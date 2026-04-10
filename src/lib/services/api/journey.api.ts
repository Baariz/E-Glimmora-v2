/**
 * Real API Journey Service
 * Implements IJourneyService against the Elan Glimmora backend API
 */

import type {
  Journey,
  JourneyVersion,
  JourneyFeedback,
  PreDepartureBrief,
  TravelMonitor,
  JourneyCategory,
  JourneyStatus,
  DiscretionLevel,
  CreateJourneyInput,
  DomainContext,
} from '@/lib/types';
import type { IJourneyService } from '../interfaces/IJourneyService';
import { api } from './client';

// ── Backend shapes (snake_case) ──────────────────────────────────────────────

interface ApiJourney {
  id: string;
  user_id: string;
  institution_id?: string | null;
  assigned_rm?: string | null;
  title: string;
  narrative: string;
  category: JourneyCategory;
  status: JourneyStatus;
  versions?: ApiJourneyVersion[] | null;
  current_version_id?: string | null;
  risk_summary?: string | null;
  discretion_level?: DiscretionLevel | null;
  is_invisible: boolean;
  emotional_objective?: string | null;
  strategic_reasoning?: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiJourneyVersion {
  id: string;
  journey_id: string;
  version_number: number;
  title: string;
  narrative: string;
  status: JourneyStatus;
  approved_by?: string | null;
  rejected_by?: string | null;
  rejection_reason?: string | null;
  modified_by: string;
  created_at: string;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function toJourneyVersion(raw: ApiJourneyVersion): JourneyVersion {
  return {
    id: raw.id,
    journeyId: raw.journey_id,
    versionNumber: raw.version_number,
    title: raw.title,
    narrative: raw.narrative,
    status: raw.status,
    approvedBy: raw.approved_by || undefined,
    rejectedBy: raw.rejected_by || undefined,
    rejectionReason: raw.rejection_reason || undefined,
    modifiedBy: raw.modified_by,
    createdAt: raw.created_at,
  };
}

function toJourney(raw: ApiJourney): Journey {
  return {
    id: raw.id,
    userId: raw.user_id,
    institutionId: raw.institution_id || undefined,
    assignedRM: raw.assigned_rm || undefined,
    title: raw.title,
    narrative: raw.narrative,
    category: raw.category,
    status: raw.status,
    versions: (raw.versions || []).map(toJourneyVersion),
    currentVersionId: raw.current_version_id || '',
    riskSummary: raw.risk_summary || undefined,
    discretionLevel: (raw.discretion_level as DiscretionLevel) || undefined,
    isInvisible: raw.is_invisible,
    emotionalObjective: raw.emotional_objective || undefined,
    strategicReasoning: raw.strategic_reasoning || undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/** Convert camelCase frontend fields to snake_case API body */
function toApiCreateBody(data: CreateJourneyInput) {
  return {
    user_id: data.userId,
    title: data.title,
    narrative: data.narrative,
    category: data.category,
  };
}

function toApiUpdateBody(data: Partial<Journey>) {
  const body: Record<string, unknown> = {};
  if (data.title !== undefined) body.title = data.title;
  if (data.narrative !== undefined) body.narrative = data.narrative;
  if (data.category !== undefined) body.category = data.category;
  if (data.assignedRM !== undefined) body.assigned_rm = data.assignedRM;
  if (data.riskSummary !== undefined) body.risk_summary = data.riskSummary;
  if (data.discretionLevel !== undefined) body.discretion_level = data.discretionLevel;
  if (data.isInvisible !== undefined) body.is_invisible = data.isInvisible;
  if (data.emotionalObjective !== undefined) body.emotional_objective = data.emotionalObjective;
  if (data.strategicReasoning !== undefined) body.strategic_reasoning = data.strategicReasoning;
  return body;
}

// ── Service ──────────────────────────────────────────────────────────────────

export class ApiJourneyService implements IJourneyService {
  async getJourneys(userId: string, _context: DomainContext): Promise<Journey[]> {
    const raw = await api.get<ApiJourney[]>(`/api/journeys?userId=${encodeURIComponent(userId)}`);
    return raw.map(toJourney);
  }

  async getJourneyById(id: string): Promise<Journey | null> {
    try {
      const raw = await api.get<ApiJourney>(`/api/journeys/${id}`);
      return toJourney(raw);
    } catch {
      return null;
    }
  }

  async createJourney(data: CreateJourneyInput): Promise<Journey> {
    const raw = await api.post<ApiJourney>('/api/journeys', toApiCreateBody(data));
    return toJourney(raw);
  }

  async updateJourney(id: string, data: Partial<Journey>): Promise<Journey> {
    const raw = await api.patch<ApiJourney>(`/api/journeys/${id}`, toApiUpdateBody(data));
    return toJourney(raw);
  }

  async deleteJourney(id: string): Promise<boolean> {
    await api.delete(`/api/journeys/${id}`);
    return true;
  }

  async getJourneyVersions(journeyId: string): Promise<JourneyVersion[]> {
    const raw = await api.get<ApiJourneyVersion[]>(`/api/journeys/${journeyId}/versions`);
    return raw.map(toJourneyVersion);
  }

  async createJourneyVersion(
    journeyId: string,
    data: Partial<JourneyVersion>
  ): Promise<JourneyVersion> {
    const body: Record<string, unknown> = {};
    if (data.title !== undefined) body.title = data.title;
    if (data.narrative !== undefined) body.narrative = data.narrative;
    if (data.status !== undefined) body.status = data.status;
    if (data.modifiedBy !== undefined) body.modified_by = data.modifiedBy;

    const raw = await api.post<ApiJourneyVersion>(
      `/api/journeys/${journeyId}/versions`,
      body
    );
    return toJourneyVersion(raw);
  }

  async transitionJourney(
    journeyId: string,
    event: string,
    rejectionReason?: string
  ): Promise<Journey> {
    const body: Record<string, unknown> = { event };
    if (rejectionReason) body.rejection_reason = rejectionReason;

    const raw = await api.post<ApiJourney>(
      `/api/journeys/${journeyId}/transition`,
      body
    );
    return toJourney(raw);
  }

  async generateJourneys(userId: string, count?: number): Promise<Journey[]> {
    const body: Record<string, unknown> = { user_id: userId };
    if (count !== undefined) body.count = count;

    const raw = await api.post<ApiJourney[]>('/api/journeys/generate', body);
    return raw.map(toJourney);
  }

  async submitFeedback(
    journeyId: string,
    data: { mood: number; reflection?: string; emotionalTags?: string[] }
  ): Promise<JourneyFeedback> {
    const body: Record<string, unknown> = { mood: data.mood };
    if (data.reflection) body.reflection = data.reflection;
    if (data.emotionalTags) body.emotional_tags = data.emotionalTags;

    const raw = await api.post<{
      id: string;
      journey_id: string;
      user_id: string;
      mood: number;
      reflection?: string;
      emotional_tags: string[];
      created_at: string;
    }>(`/api/journeys/${journeyId}/feedback`, body);

    return {
      id: raw.id,
      journeyId: raw.journey_id,
      userId: raw.user_id,
      mood: raw.mood,
      reflection: raw.reflection || undefined,
      emotionalTags: raw.emotional_tags || [],
      createdAt: raw.created_at,
    };
  }

  async getFeedback(journeyId: string): Promise<JourneyFeedback[]> {
    const raw = await api.get<Array<{
      id: string;
      journey_id: string;
      user_id: string;
      mood: number;
      reflection?: string;
      emotional_tags: string[];
      created_at: string;
    }>>(`/api/journeys/${journeyId}/feedback`);

    return raw.map((r) => ({
      id: r.id,
      journeyId: r.journey_id,
      userId: r.user_id,
      mood: r.mood,
      reflection: r.reflection || undefined,
      emotionalTags: r.emotional_tags || [],
      createdAt: r.created_at,
    }));
  }

  async setPreDepartureBrief(
    journeyId: string,
    data: { summary: string; logistics?: Record<string, unknown>; advisorNotes?: string; autoGenerated?: boolean }
  ): Promise<PreDepartureBrief> {
    const body: Record<string, unknown> = { summary: data.summary };
    if (data.logistics) body.logistics = data.logistics;
    if (data.advisorNotes) body.advisor_notes = data.advisorNotes;
    if (data.autoGenerated !== undefined) body.auto_generated = data.autoGenerated;

    const raw = await api.post<{
      id: string;
      journey_id: string;
      summary: string;
      logistics?: Record<string, unknown>;
      advisor_notes?: string;
      auto_generated: boolean;
      created_at: string;
    }>(`/api/journeys/${journeyId}/pre-departure`, body);

    return {
      id: raw.id,
      journeyId: raw.journey_id,
      summary: raw.summary,
      logistics: raw.logistics || undefined,
      advisorNotes: raw.advisor_notes || undefined,
      autoGenerated: raw.auto_generated ?? false,
      createdAt: raw.created_at,
    };
  }

  async getTravelMonitor(journeyId: string): Promise<TravelMonitor | null> {
    try {
      const raw = await api.get<{
        journey_id: string;
        flight?: { number: string; route: string; status: string; departure: string; arrival: string };
        transfer?: { type: string; route: string; status: string; driver?: string; vehicle?: string };
        accommodation?: { property: string; room: string; status: string; check_in?: string; note?: string };
        alerts: string[];
        updated_at: string;
      }>(`/api/journeys/${journeyId}/monitor`);

      return {
        journeyId: raw.journey_id,
        flight: raw.flight || undefined,
        transfer: raw.transfer || undefined,
        accommodation: raw.accommodation
          ? {
              property: raw.accommodation.property,
              room: raw.accommodation.room,
              status: raw.accommodation.status,
              checkIn: raw.accommodation.check_in || undefined,
              note: raw.accommodation.note || undefined,
            }
          : undefined,
        alerts: raw.alerts || [],
        updatedAt: raw.updated_at,
      };
    } catch {
      return null;
    }
  }
}
