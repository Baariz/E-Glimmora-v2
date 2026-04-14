/**
 * Real API Journey Service
 * Implements IJourneyService against the Elan Glimmora backend API
 */

import type {
  Journey,
  JourneyVersion,
  JourneyCategory,
  JourneyStatus,
  DiscretionLevel,
  CreateJourneyInput,
  DomainContext,
  PreDepartureBrief,
  JourneyFeedback,
  TravelMonitor,
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
  package_id?: string | null;
  pre_departure_brief?: ApiPreDepartureBrief | null;
  created_at: string;
  updated_at: string;
}

interface ApiPreDepartureBrief {
  arrival_summary?: string | null;
  key_contact?: string | null;
  key_contact_role?: string | null;
  timing?: string | null;
  discretion_level?: 'High' | 'Standard' | 'Custom' | null;
  special_instructions?: string | null;
  sent_at?: string | null;
}

interface ApiJourneyFeedback {
  journey_id: string;
  mood: number;
  reflection?: string | null;
  submitted_at?: string | null;
}

interface ApiTravelMonitor {
  journey_id: string;
  flight?: Record<string, string | null> | null;
  transfer?: Record<string, string | null> | null;
  accommodation?: Record<string, string | null> | null;
  alerts?: string[] | null;
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
    packageId: raw.package_id ?? null,
    preDepartureBrief: raw.pre_departure_brief ? toPreDepartureBrief(raw.pre_departure_brief) : null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function toPreDepartureBrief(raw: ApiPreDepartureBrief): PreDepartureBrief {
  return {
    arrivalSummary: raw.arrival_summary || undefined,
    keyContact: raw.key_contact || undefined,
    keyContactRole: raw.key_contact_role || undefined,
    timing: raw.timing || undefined,
    discretionLevel: raw.discretion_level || undefined,
    specialInstructions: raw.special_instructions || undefined,
    sentAt: raw.sent_at || undefined,
  };
}

function toApiPreDepartureBody(brief: PreDepartureBrief): Record<string, unknown> {
  return {
    arrival_summary: brief.arrivalSummary ?? null,
    key_contact: brief.keyContact ?? null,
    key_contact_role: brief.keyContactRole ?? null,
    timing: brief.timing ?? null,
    discretion_level: brief.discretionLevel ?? null,
    special_instructions: brief.specialInstructions ?? null,
  };
}

function toFeedback(raw: ApiJourneyFeedback): JourneyFeedback {
  return {
    journeyId: raw.journey_id,
    mood: raw.mood,
    reflection: raw.reflection || undefined,
    submittedAt: raw.submitted_at || undefined,
  };
}

function toMonitor(raw: ApiTravelMonitor): TravelMonitor {
  const mapBlock = (b: Record<string, string | null> | null | undefined) => {
    if (!b) return null;
    const out: Record<string, string | undefined> = {};
    for (const [k, v] of Object.entries(b)) {
      const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      out[camel] = v ?? undefined;
    }
    return out;
  };
  return {
    journeyId: raw.journey_id,
    flight: mapBlock(raw.flight) as TravelMonitor['flight'],
    transfer: mapBlock(raw.transfer) as TravelMonitor['transfer'],
    accommodation: mapBlock(raw.accommodation) as TravelMonitor['accommodation'],
    alerts: raw.alerts || [],
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
  if (data.packageId !== undefined) body.package_id = data.packageId;
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

  async setPreDepartureBrief(journeyId: string, brief: PreDepartureBrief): Promise<Journey> {
    const raw = await api.post<ApiJourney>(
      `/api/journeys/${journeyId}/pre-departure`,
      toApiPreDepartureBody(brief)
    );
    return toJourney(raw);
  }

  async getMonitor(journeyId: string): Promise<TravelMonitor> {
    const raw = await api.get<ApiTravelMonitor>(`/api/journeys/${journeyId}/monitor`);
    return toMonitor(raw);
  }

  async submitFeedback(
    journeyId: string,
    feedback: { mood: number; reflection?: string }
  ): Promise<JourneyFeedback> {
    const raw = await api.post<ApiJourneyFeedback>(
      `/api/journeys/${journeyId}/feedback`,
      { mood: feedback.mood, reflection: feedback.reflection ?? null }
    );
    return toFeedback(raw);
  }

  async getFeedback(journeyId: string): Promise<JourneyFeedback | null> {
    try {
      const raw = await api.get<ApiJourneyFeedback>(`/api/journeys/${journeyId}/feedback`);
      return toFeedback(raw);
    } catch {
      return null;
    }
  }

  async generateJourneys(userId: string, count?: number): Promise<Journey[]> {
    const body: Record<string, unknown> = { user_id: userId };
    if (count !== undefined) body.count = count;

    const raw = await api.post<ApiJourney[]>('/api/journeys/generate', body);
    return raw.map(toJourney);
  }
}
