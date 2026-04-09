/**
 * Real API Intent Service
 * Implements IIntentService against the Elan Glimmora backend API
 */

import type { IntentProfile, CreateIntentProfileInput } from '@/lib/types';
import type { IIntentService } from '../interfaces/IIntentService';
import { api } from './client';

/** Shape returned by the backend */
interface ApiIntentProfile {
  id: string;
  user_id: string;
  score_security: number;
  score_adventure: number;
  score_legacy: number;
  score_recognition: number;
  score_autonomy: number;
  risk_tolerance: string;
  life_stage: string;
  travel_mode?: string | null;
  preferred_season?: string | null;
  travel_date_from?: string | null;
  travel_date_to?: string | null;
  values: string[];
  priorities?: string[];
  discretion_preference?: string | null;
  alignment_score?: number;
  created_at: string;
  updated_at: string;
}

/** Convert backend snake_case to frontend camelCase */
function toIntentProfile(raw: ApiIntentProfile): IntentProfile {
  return {
    id: raw.id,
    userId: raw.user_id,
    emotionalDrivers: {
      security: raw.score_security,
      adventure: raw.score_adventure,
      legacy: raw.score_legacy,
      recognition: raw.score_recognition,
      autonomy: raw.score_autonomy,
    },
    riskTolerance: raw.risk_tolerance as IntentProfile['riskTolerance'],
    lifeStage: raw.life_stage as IntentProfile['lifeStage'],
    travelMode: (raw.travel_mode as IntentProfile['travelMode']) || undefined,
    preferredSeason: (raw.preferred_season as IntentProfile['preferredSeason']) || undefined,
    travelDateFrom: raw.travel_date_from || undefined,
    travelDateTo: raw.travel_date_to || undefined,
    values: raw.values || [],
    priorities: raw.priorities || undefined,
    discretionPreference: raw.discretion_preference || undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/** Convert frontend camelCase to backend snake_case for create/update */
function toApiBody(data: Partial<IntentProfile> & { userId?: string }) {
  const body: Record<string, unknown> = {};

  if (data.userId !== undefined) body.user_id = data.userId;

  if (data.emotionalDrivers) {
    body.emotional_drivers = {
      security: data.emotionalDrivers.security,
      adventure: data.emotionalDrivers.adventure,
      legacy: data.emotionalDrivers.legacy,
      recognition: data.emotionalDrivers.recognition,
      autonomy: data.emotionalDrivers.autonomy,
    };
  }

  if (data.riskTolerance !== undefined) body.risk_tolerance = data.riskTolerance;
  if (data.lifeStage !== undefined) body.life_stage = data.lifeStage;
  if (data.travelMode !== undefined) body.travel_mode = data.travelMode;
  if (data.preferredSeason !== undefined) body.preferred_season = data.preferredSeason;
  if (data.travelDateFrom !== undefined) body.travel_date_from = data.travelDateFrom;
  if (data.travelDateTo !== undefined) body.travel_date_to = data.travelDateTo;
  if (data.values !== undefined) body.values = data.values;
  if (data.priorities !== undefined) body.priorities = data.priorities;
  if (data.discretionPreference !== undefined) body.discretion_preference = data.discretionPreference;

  return body;
}

export class ApiIntentService implements IIntentService {
  async getIntentProfile(userId: string): Promise<IntentProfile | null> {
    try {
      const raw = await api.get<ApiIntentProfile>(`/api/intent/${userId}`);
      return toIntentProfile(raw);
    } catch {
      return null;
    }
  }

  async createIntentProfile(data: CreateIntentProfileInput): Promise<IntentProfile> {
    const raw = await api.post<ApiIntentProfile>('/api/intent', toApiBody(data));
    return toIntentProfile(raw);
  }

  async updateIntentProfile(userId: string, data: Partial<IntentProfile>): Promise<IntentProfile> {
    const raw = await api.patch<ApiIntentProfile>(`/api/intent/${userId}`, toApiBody(data));
    return toIntentProfile(raw);
  }

  calculateAlignmentBaseline(profile: IntentProfile): number {
    const drivers = profile.emotionalDrivers;
    const values = [
      drivers.security,
      drivers.adventure,
      drivers.legacy,
      drivers.recognition,
      drivers.autonomy,
    ];
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return Math.round(100 - stdDev);
  }
}
