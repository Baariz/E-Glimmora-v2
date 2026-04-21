/**
 * Real API Package Service
 * Implements IPackageService against the Elan Glimmora backend API
 */

import type { Package, ItineraryDay, HotelRegion } from '@/lib/types/entities';
import type { IPackageService, PackageQuery } from '../interfaces/IPackageService';
import { apiRequest } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shape (snake_case) ───────────────────────────────────────────────

interface ApiPackage {
  id: string;
  name: string;
  client_title: string;
  description?: string | null;
  client_description?: string | null;
  advisor_notes?: string | null;
  hotel_id: string;
  hotel_name?: string | null;
  duration: number | string;
  region: HotelRegion;
  category: string;
  tagline: string;
  itinerary: ItineraryDay[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function toPackage(raw: ApiPackage): Package {
  return {
    id: raw.id,
    name: raw.name,
    clientTitle: raw.client_title,
    description: raw.description || undefined,
    clientDescription: raw.client_description || undefined,
    advisorNotes: raw.advisor_notes || undefined,
    hotelId: raw.hotel_id,
    hotelName: raw.hotel_name || '',
    duration: Number(raw.duration) || 0,
    region: raw.region,
    category: raw.category,
    tagline: raw.tagline,
    itinerary: raw.itinerary || [],
    isActive: raw.is_active,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function toApiBody(data: Partial<Package>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name !== undefined) body.name = data.name;
  if (data.clientTitle !== undefined) body.client_title = data.clientTitle;
  if (data.hotelId !== undefined) body.hotel_id = data.hotelId;
  if (data.duration !== undefined) body.duration = String(data.duration);
  if (data.region !== undefined) body.region = data.region;
  if (data.category !== undefined) body.category = data.category;
  if (data.tagline !== undefined) body.tagline = data.tagline;
  if (data.itinerary !== undefined) body.itinerary = data.itinerary;
  if (data.isActive !== undefined) body.is_active = data.isActive;
  return body;
}

// ── Service ──────────────────────────────────────────────────────────────────

export class ApiPackageService implements IPackageService {
  async getPackages(query?: PackageQuery): Promise<Package[]> {
    logger.info('Packages', 'getPackages', {
      hotel_id: query?.hotel_id,
      category: query?.category,
      region: query?.region,
      active: query?.active,
    });
    const qs = new URLSearchParams();
    if (query?.hotel_id) qs.set('hotel_id', query.hotel_id);
    if (query?.category) qs.set('category', query.category);
    if (query?.region) qs.set('region', query.region);
    if (query?.active !== undefined) qs.set('active', String(query.active));
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    const raw = await apiRequest<ApiPackage[]>(`/api/packages${suffix}`, { method: 'GET' });
    logger.info('Packages', 'getPackages done', { count: raw.length });
    return raw.map(toPackage);
  }

  async getActivePackages(): Promise<Package[]> {
    logger.info('Packages', 'getActivePackages');
    const raw = await apiRequest<ApiPackage[]>('/api/packages?active=true', { method: 'GET' });
    return raw.map(toPackage).filter((p) => p.isActive);
  }

  async getPackageById(id: string): Promise<Package | null> {
    logger.info('Packages', 'getPackageById', { id });
    try {
      const raw = await apiRequest<ApiPackage>(`/api/packages/${id}`, { method: 'GET' });
      return toPackage(raw);
    } catch (err) {
      logger.warn('Packages', 'getPackageById not found', { id, err });
      return null;
    }
  }

  async createPackage(data: Partial<Package>): Promise<Package> {
    logger.warn('Packages', 'createPackage (admin)', {
      name: data.name,
      hotelId: data.hotelId,
      category: data.category,
      itineraryDays: data.itinerary?.length ?? 0,
    });
    const raw = await apiRequest<ApiPackage>('/api/packages', {
      method: 'POST',
      body: JSON.stringify(toApiBody(data)),
    });
    return toPackage(raw);
  }

  async updatePackage(id: string, data: Partial<Package>): Promise<Package> {
    logger.info('Packages', 'updatePackage', { id, fields: Object.keys(data) });
    const raw = await apiRequest<ApiPackage>(`/api/packages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toApiBody(data)),
    });
    return toPackage(raw);
  }

  async deletePackage(id: string): Promise<boolean> {
    logger.warn('Packages', 'deletePackage (hard delete — prefer toggleActive)', { id });
    await apiRequest(`/api/packages/${id}`, { method: 'DELETE' });
    return true;
  }

  async toggleActive(id: string): Promise<Package> {
    logger.info('Packages', 'toggleActive', { id });
    const raw = await apiRequest<ApiPackage>(`/api/packages/${id}/toggle-active`, { method: 'POST' });
    logger.info('Packages', 'toggleActive done', { id, isActive: raw.is_active });
    return toPackage(raw);
  }
}
