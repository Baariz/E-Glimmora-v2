/**
 * Real API Privacy Service
 * Implements IPrivacyService against the Elan Glimmora backend API
 */

import type {
  PrivacySettings,
  UpdatePrivacySettingsInput,
  AdvisorResourcePermissions,
  DiscretionTier,
} from '@/lib/types';
import type { IPrivacyService } from '../interfaces/IPrivacyService';
import { api } from './client';

// ── Backend shapes (snake_case) ──────────────────────────────────────────────

interface ApiPrivacySettings {
  id: string;
  user_id: string;
  discretion_tier: string;
  invisible_itinerary_default: boolean;
  data_retention_days: number;
  analytics_opt_out: boolean;
  third_party_sharing: boolean;
  advisor_visibility_scope: string[];
  advisor_resource_permissions?: Record<string, AdvisorResourcePermissions> | null;
  global_erase_requested: boolean;
  global_erase_executed_at?: string | null;
  created_at: string;
  updated_at: string;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function toPrivacySettings(raw: ApiPrivacySettings): PrivacySettings {
  return {
    id: raw.id,
    userId: raw.user_id,
    discretionTier: (raw.discretion_tier as DiscretionTier) || 'Standard',
    invisibleItineraryDefault: raw.invisible_itinerary_default ?? false,
    dataRetention: raw.data_retention_days ?? 0,
    analyticsOptOut: raw.analytics_opt_out ?? false,
    thirdPartySharing: raw.third_party_sharing ?? false,
    advisorVisibilityScope: raw.advisor_visibility_scope || [],
    advisorResourcePermissions: raw.advisor_resource_permissions || undefined,
    globalEraseRequested: raw.global_erase_requested ?? false,
    globalEraseExecutedAt: raw.global_erase_executed_at || undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function toApiUpdateBody(data: UpdatePrivacySettingsInput): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.discretionTier !== undefined) body.discretion_tier = data.discretionTier;
  if (data.invisibleItineraryDefault !== undefined) body.invisible_itinerary_default = data.invisibleItineraryDefault;
  if (data.dataRetention !== undefined) body.data_retention_days = data.dataRetention;
  if (data.analyticsOptOut !== undefined) body.analytics_opt_out = data.analyticsOptOut;
  if (data.thirdPartySharing !== undefined) body.third_party_sharing = data.thirdPartySharing;
  if (data.advisorVisibilityScope !== undefined) body.advisor_visibility_scope = data.advisorVisibilityScope;
  if (data.advisorResourcePermissions !== undefined) body.advisor_resource_permissions = data.advisorResourcePermissions;
  if (data.globalEraseRequested !== undefined) body.global_erase_requested = data.globalEraseRequested;
  return body;
}

// ── Service ──────────────────────────────────────────────────────────────────

export class ApiPrivacyService implements IPrivacyService {
  async getSettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const raw = await api.get<ApiPrivacySettings>(`/api/privacy/${userId}`);
      return toPrivacySettings(raw);
    } catch {
      return null;
    }
  }

  async updateSettings(userId: string, data: UpdatePrivacySettingsInput): Promise<PrivacySettings> {
    const raw = await api.patch<ApiPrivacySettings>(
      `/api/privacy/${userId}`,
      toApiUpdateBody(data)
    );
    return toPrivacySettings(raw);
  }

  async executeGlobalErase(userId: string): Promise<void> {
    await api.post(`/api/privacy/${userId}/erase/execute`);
  }
}
