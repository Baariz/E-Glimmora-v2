/**
 * Real API Hotel Service
 * Implements IHotelService against the Elan Glimmora backend API
 */

import type { Hotel, HotelAmenity, HotelRegion, HotelTier } from '@/lib/types/entities';
import type { IHotelService, HotelQuery } from '../interfaces/IHotelService';
import { apiRequest } from './client';

// ── Backend shape (snake_case) ───────────────────────────────────────────────

interface ApiHotel {
  id: string;
  name: string;
  location: string;
  country: string;
  region: HotelRegion;
  tier: HotelTier;
  privacy_score: number;
  description: string;
  client_description: string;
  advisor_notes?: string | null;
  amenities: string[];
  image_urls?: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function toHotel(raw: ApiHotel): Hotel {
  const amenities: HotelAmenity[] = (raw.amenities || []).map((a) =>
    typeof a === 'string' ? { label: a, icon: '✦' } : (a as HotelAmenity)
  );
  return {
    id: raw.id,
    name: raw.name,
    location: raw.location,
    country: raw.country,
    region: raw.region,
    tier: raw.tier,
    privacyScore: raw.privacy_score,
    description: raw.description,
    clientDescription: raw.client_description,
    advisorNotes: raw.advisor_notes || undefined,
    amenities,
    imageUrl: raw.image_urls?.[0] || undefined,
    imageUrls: raw.image_urls || [],
    isActive: raw.is_active,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function toApiBody(data: Partial<Hotel>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name !== undefined) body.name = data.name;
  if (data.location !== undefined) body.location = data.location;
  if (data.country !== undefined) body.country = data.country;
  if (data.region !== undefined) body.region = data.region;
  if (data.tier !== undefined) body.tier = data.tier;
  if (data.privacyScore !== undefined) body.privacy_score = data.privacyScore;
  if (data.description !== undefined) body.description = data.description;
  if (data.clientDescription !== undefined) body.client_description = data.clientDescription;
  if (data.advisorNotes !== undefined) body.advisor_notes = data.advisorNotes;
  if (data.amenities !== undefined) body.amenities = data.amenities.map((a) => a.label);
  if (data.imageUrls !== undefined) body.image_urls = data.imageUrls;
  else if (data.imageUrl !== undefined) body.image_urls = data.imageUrl ? [data.imageUrl] : [];
  if (data.isActive !== undefined) body.is_active = data.isActive;
  return body;
}

// ── Service ──────────────────────────────────────────────────────────────────

export class ApiHotelService implements IHotelService {
  async getHotels(query?: HotelQuery): Promise<Hotel[]> {
    const qs = new URLSearchParams();
    if (query?.active !== undefined) qs.set('active', String(query.active));
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    const raw = await apiRequest<ApiHotel[]>(`/api/hotels${suffix}`, { method: 'GET' });
    return raw.map(toHotel);
  }

  async getHotelById(id: string): Promise<Hotel | null> {
    try {
      const raw = await apiRequest<ApiHotel>(`/api/hotels/${id}`, { method: 'GET' });
      return toHotel(raw);
    } catch {
      return null;
    }
  }

  async createHotel(data: Partial<Hotel>): Promise<Hotel> {
    const raw = await apiRequest<ApiHotel>('/api/hotels', {
      method: 'POST',
      body: JSON.stringify(toApiBody(data)),
    });
    return toHotel(raw);
  }

  async updateHotel(id: string, data: Partial<Hotel>): Promise<Hotel> {
    const raw = await apiRequest<ApiHotel>(`/api/hotels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toApiBody(data)),
    });
    return toHotel(raw);
  }

  async deleteHotel(id: string): Promise<boolean> {
    await apiRequest(`/api/hotels/${id}`, { method: 'DELETE' });
    return true;
  }

  async toggleActive(id: string): Promise<Hotel> {
    const raw = await apiRequest<ApiHotel>(`/api/hotels/${id}/toggle-active`, { method: 'POST' });
    return toHotel(raw);
  }
}
