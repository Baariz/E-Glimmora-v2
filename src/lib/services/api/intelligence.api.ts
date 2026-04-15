/**
 * Real API Intelligence Service — Phase 6 AGI endpoints.
 * Tolerates both `{success, data}` envelope and raw payload shapes.
 */

import type {
  HotelScoringResponse,
  PackageMatchingResponse,
  JourneySuggestionsResponse,
} from '@/lib/types/entities';
import type { IIntelligenceService } from '../interfaces/IIntelligenceService';
import { ApiError, ensureAuthToken } from './client';

const isServer = typeof window === 'undefined';
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';
const API_BASE_URL = isServer ? BACKEND_URL : '/api/proxy';

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const token = await ensureAuthToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string> || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init.body && !(init.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const adjusted = !isServer && path.startsWith('/api/') ? path.replace('/api/', '/') : path;
  const url = `${API_BASE_URL}${adjusted}`;

  const res = await fetch(url, { ...init, headers });
  if (res.status === 204) return undefined as T;

  const raw = await res.text();
  let body: unknown;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    throw new ApiError(res.status, 'INVALID_JSON', `Invalid JSON from ${path}`);
  }

  if (!res.ok) {
    const err = (body as { error?: { code?: string; message?: string; status?: number } })?.error;
    throw new ApiError(
      err?.status ?? res.status,
      err?.code ?? 'HTTP_ERROR',
      err?.message ?? res.statusText ?? `Request failed: ${res.status}`,
    );
  }

  if (body && typeof body === 'object' && 'success' in body) {
    const envelope = body as { success: boolean; data?: T; error?: { code?: string; message?: string; status?: number } };
    if (!envelope.success) {
      throw new ApiError(
        envelope.error?.status ?? res.status,
        envelope.error?.code ?? 'UNKNOWN_ERROR',
        envelope.error?.message ?? 'Request failed',
      );
    }
    return envelope.data as T;
  }

  return body as T;
}

export class ApiIntelligenceService implements IIntelligenceService {
  async scoreHotels(userId: string): Promise<HotelScoringResponse> {
    return request<HotelScoringResponse>('/api/intelligence/hotel-scoring', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async matchPackages(userId: string, hotelId?: string): Promise<PackageMatchingResponse> {
    return request<PackageMatchingResponse>('/api/intelligence/package-matching', {
      method: 'POST',
      body: JSON.stringify(hotelId ? { user_id: userId, hotel_id: hotelId } : { user_id: userId }),
    });
  }

  async getSuggestions(userId: string): Promise<JourneySuggestionsResponse> {
    return request<JourneySuggestionsResponse>(
      `/api/intelligence/suggestions/${encodeURIComponent(userId)}`,
      { method: 'GET' },
    );
  }
}
