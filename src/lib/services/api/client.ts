/**
 * API HTTP Client
 * Centralized fetch wrapper with JWT token management for the Elan Glimmora backend.
 *
 * On the server (API routes, auth.ts), calls go directly to the backend.
 * On the client (browser), calls go through the Next.js proxy at /api/proxy
 * to avoid CORS issues.
 */

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

/**
 * Make an authenticated API request to the backend.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await ensureAuthToken();
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON bodies (not FormData)
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // On client: /api/proxy + /api/intent/123 → /api/proxy/intent/123
  // On server: https://backend + /api/intent/123 → https://backend/api/intent/123
  const adjustedPath = !isServer && path.startsWith('/api/')
    ? path.replace('/api/', '/')
    : path;
  const url = `${API_BASE_URL}${adjustedPath}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle no-content responses
  if (response.status === 204) {
    return undefined as T;
  }

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    const error = json.error || {
      code: 'UNKNOWN_ERROR',
      message: response.statusText,
      status: response.status,
    };
    throw new ApiError(error.status || response.status, error.code, error.message);
  }

  return json.data as T;
}

/**
 * Convenience methods
 */
export const api = {
  get: <T>(path: string) => apiRequest<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) => apiRequest<T>(path, { method: 'DELETE' }),
};
