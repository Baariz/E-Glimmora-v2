/**
 * Real API Briefing / Dashboard Service
 * Phase 5 aggregated landing-page endpoints.
 *
 * These endpoints may return either the standard `{success, data}` envelope
 * or the payload directly. This service tolerates both shapes.
 */

import type {
  UhniBriefing,
  AdvisorPortfolio,
  AdminDashboard,
  IntelligenceFeed,
} from '@/lib/types/entities';
import type { IBriefingService } from '../interfaces/IBriefingService';
import { ApiError, ensureAuthToken } from './client';
import { logger } from '@/lib/utils/logger';

const isServer = typeof window === 'undefined';
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';
const API_BASE_URL = isServer ? BACKEND_URL : '/api/proxy';

async function fetchBriefing<T>(path: string): Promise<T> {
  const token = await ensureAuthToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  // On client, strip leading /api/ (proxy is mounted at /api/proxy and appends the rest)
  const adjusted = !isServer && path.startsWith('/api/')
    ? path.replace('/api/', '/')
    : path;
  const url = `${API_BASE_URL}${adjusted}`;

  const startedAt = logger.apiStart('Briefing', 'GET', path);

  let res: Response;
  try {
    res = await fetch(url, { method: 'GET', headers });
  } catch (err) {
    logger.apiError('Briefing', 'GET', path, startedAt, err, { stage: 'network' });
    throw err;
  }

  if (res.status === 204) {
    logger.apiSuccess('Briefing', 'GET', path, startedAt, { status: 204 });
    return undefined as T;
  }

  const raw = await res.text();
  let body: unknown;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    const parseErr = new ApiError(res.status, 'INVALID_JSON', `Invalid JSON from ${path}`);
    logger.apiError('Briefing', 'GET', path, startedAt, parseErr, { stage: 'parse' });
    throw parseErr;
  }

  // Error cases
  if (!res.ok) {
    const err = (body as { error?: { code?: string; message?: string; status?: number } })?.error;
    const apiErr = new ApiError(
      err?.status ?? res.status,
      err?.code ?? 'HTTP_ERROR',
      err?.message ?? res.statusText ?? `Request failed: ${res.status}`
    );
    logger.apiError('Briefing', 'GET', path, startedAt, apiErr, {
      status: res.status,
      code: apiErr.code,
    });
    throw apiErr;
  }

  // Wrapped envelope — { success: true, data: {...} }
  if (body && typeof body === 'object' && 'success' in body) {
    const envelope = body as { success: boolean; data?: T; error?: { code?: string; message?: string; status?: number } };
    if (!envelope.success) {
      const apiErr = new ApiError(
        envelope.error?.status ?? res.status,
        envelope.error?.code ?? 'UNKNOWN_ERROR',
        envelope.error?.message ?? 'Request failed'
      );
      logger.apiError('Briefing', 'GET', path, startedAt, apiErr, {
        status: res.status,
        code: apiErr.code,
      });
      throw apiErr;
    }
    logger.apiSuccess('Briefing', 'GET', path, startedAt, { status: res.status });
    return envelope.data as T;
  }

  // Raw payload — return as-is
  logger.apiSuccess('Briefing', 'GET', path, startedAt, { status: res.status, shape: 'raw' });
  return body as T;
}

export class ApiBriefingService implements IBriefingService {
  async getUhniBriefing(): Promise<UhniBriefing> {
    return fetchBriefing<UhniBriefing>('/api/briefing');
  }

  async getAdvisorPortfolio(): Promise<AdvisorPortfolio> {
    return fetchBriefing<AdvisorPortfolio>('/api/portfolio');
  }

  async getAdminDashboard(): Promise<AdminDashboard> {
    return fetchBriefing<AdminDashboard>('/api/dashboard');
  }

  async getIntelligenceFeed(userId?: string): Promise<IntelligenceFeed> {
    const suffix = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    return fetchBriefing<IntelligenceFeed>(`/api/intelligence/feed${suffix}`);
  }
}
