/**
 * API HTTP Client
 * Centralized fetch wrapper with JWT token management for the Elan Glimmora backend.
 *
 * On the server (API routes, auth.ts), calls go directly to the backend.
 * On the client (browser), calls go through the Next.js proxy at /api/proxy
 * to avoid CORS issues.
 */

import { logger } from '@/lib/utils/logger';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

const isServer = typeof window === 'undefined';

/**
 * On the server, call the backend directly.
 * On the client, route through /api/proxy to avoid CORS.
 * e.g. /api/intent/123 → /api/proxy/intent/123 (client) → backend/api/intent/123
 */
const API_BASE_URL = isServer ? BACKEND_URL : '/api/proxy';

let cachedToken: string | null = null;

/**
 * Set the JWT token for authenticated requests.
 * Called after login/register to store the token in memory.
 */
export function setAuthToken(token: string | null) {
  cachedToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('elan:api_token', token);
    } else {
      localStorage.removeItem('elan:api_token');
    }
  }
}

/**
 * Get the current JWT token, checking memory first then localStorage.
 * If not found, attempts to fetch from the NextAuth session as a fallback.
 */
export function getAuthToken(): string | null {
  if (cachedToken) return cachedToken;
  if (typeof window !== 'undefined') {
    cachedToken = localStorage.getItem('elan:api_token');
  }
  return cachedToken;
}

/**
 * Ensure the token is available, fetching from session if needed.
 * Call this before making API requests that require auth.
 */
export async function ensureAuthToken(): Promise<string | null> {
  const token = getAuthToken();
  if (token) return token;

  // Fallback: fetch token from NextAuth session
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      if (session?.apiToken) {
        setAuthToken(session.apiToken);
        return session.apiToken;
      }
    } catch {
      // Session fetch failed — no token available
    }
  }
  return null;
}

/**
 * Clear the JWT token (used on logout).
 */
export function clearAuthToken() {
  cachedToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('elan:api_token');
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    status: number;
  };
}

export interface ApiRequestOptions extends RequestInit {
  /**
   * Status codes the caller treats as expected (e.g. 404 on an endpoint
   * the backend may not have deployed yet). These are logged at warn
   * level instead of error, and still throw an ApiError so callers can
   * catch and degrade gracefully.
   */
  silentStatuses?: number[];
}

/**
 * Make an authenticated API request to the backend.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { silentStatuses, ...fetchOptions } = options;
  const token = await ensureAuthToken();
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON bodies (not FormData)
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // On client: /api/proxy + /api/intent/123 → /api/proxy/intent/123
  // On server: https://backend + /api/intent/123 → https://backend/api/intent/123
  const adjustedPath = !isServer && path.startsWith('/api/')
    ? path.replace('/api/', '/')
    : path;
  const url = `${API_BASE_URL}${adjustedPath}`;
  const method = (fetchOptions.method || 'GET').toUpperCase();

  const startedAt = logger.apiStart('API', method, path);

  let response: Response;
  try {
    response = await fetch(url, { ...fetchOptions, headers });
  } catch (err) {
    logger.apiError('API', method, path, startedAt, err, { stage: 'network' });
    throw err;
  }

  // Handle no-content responses
  if (response.status === 204) {
    logger.apiSuccess('API', method, path, startedAt, { status: 204 });
    return undefined as T;
  }

  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch (err) {
    logger.apiError('API', method, path, startedAt, err, {
      stage: 'parse',
      status: response.status,
    });
    throw err;
  }

  if (!response.ok || !json.success) {
    const error = json.error || {
      code: 'UNKNOWN_ERROR',
      message: response.statusText,
      status: response.status,
    };
    const apiErr = new ApiError(error.status || response.status, error.code, error.message);
    const expected = silentStatuses?.includes(response.status) ?? false;
    if (expected) {
      // Caller flagged this status as expected — drop to warn so devtools
      // doesn't redline; still throw so the caller can fall back.
      logger.warn('API', `${method} ${path} (${response.status} expected)`, {
        status: response.status,
        code: error.code,
      });
    } else {
      logger.apiError('API', method, path, startedAt, apiErr, {
        status: response.status,
        code: error.code,
      });
    }
    throw apiErr;
  }

  logger.apiSuccess('API', method, path, startedAt, { status: response.status });
  return json.data as T;
}

/**
 * Convenience methods. Pass { silentStatuses: [404, ...] } when a non-2xx
 * response is expected and shouldn't show as a red error in devtools.
 */
type ReqOpts = Pick<ApiRequestOptions, 'silentStatuses'>;

export const api = {
  get: <T>(path: string, opts: ReqOpts = {}) =>
    apiRequest<T>(path, { method: 'GET', ...opts }),

  post: <T>(path: string, body?: unknown, opts: ReqOpts = {}) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...opts,
    }),

  patch: <T>(path: string, body?: unknown, opts: ReqOpts = {}) =>
    apiRequest<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...opts,
    }),

  delete: <T>(path: string, opts: ReqOpts = {}) =>
    apiRequest<T>(path, { method: 'DELETE', ...opts }),
};
