/**
 * Real API Crisis Service
 * Implements ICrisisService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §4.5
 */

import type {
  AviationDisruption,
  CrisisStatus,
  DisruptionType,
  ExtractionProtocol,
  ExtractionPriority,
  ExtractionStep,
  ProtocolStatus,
  SafeHouse,
  EmergencyContact,
  ThreatLevel,
  CrisisTimelineEvent,
} from '@/lib/types';
import type { ICrisisService } from '../interfaces/ICrisisService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shapes ───────────────────────────────────────────────────

interface ApiAviationDisruption {
  id: string;
  institution_id: string;
  type: string;
  title: string;
  description: string;
  affected_regions?: string[] | null;
  affected_airports?: string[] | null;
  affected_clients?: string[] | null;
  threat_level: string;
  probability_percent?: number;
  estimated_impact_hours?: number;
  forecast_source?: string;
  status: string;
  started_at?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiExtractionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: string;
  assigned_to?: string | null;
  estimated_duration_minutes: number;
  completed_at?: string | null;
  notes?: string | null;
}

interface ApiSafeHouse {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  contact_name: string;
  contact_phone: string;
  capacity: number;
  security_level: string;
  available_now: boolean;
  last_verified: string;
}

interface ApiEmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string | null;
  region: string;
  available_24h: boolean;
}

interface ApiTimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  type: string;
  actor?: string | null;
}

interface ApiExtractionProtocol {
  id: string;
  institution_id: string;
  client_id: string;
  client_name: string;
  priority: string;
  status: string;
  current_location: string;
  destination_location: string;
  crisis_id?: string | null;
  steps?: ApiExtractionStep[] | null;
  safe_houses?: ApiSafeHouse[] | null;
  emergency_contacts?: ApiEmergencyContact[] | null;
  timeline?: ApiTimelineEvent[] | null;
  activated_by?: string | null;
  activated_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

function toList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === 'object') {
    const o = raw as { items?: T[]; data?: T[] };
    return o.items ?? o.data ?? [];
  }
  return [];
}

function toDisruption(r: ApiAviationDisruption): AviationDisruption {
  return {
    id: r.id,
    institutionId: r.institution_id,
    type: r.type as DisruptionType,
    title: r.title,
    description: r.description,
    affectedRegions: r.affected_regions ?? [],
    affectedAirports: r.affected_airports ?? [],
    affectedClients: r.affected_clients ?? [],
    threatLevel: (r.threat_level as ThreatLevel) || 'Low',
    probabilityPercent: r.probability_percent ?? 0,
    estimatedImpactHours: r.estimated_impact_hours ?? 0,
    forecastSource: r.forecast_source ?? '',
    status: (r.status as CrisisStatus) || 'Monitoring',
    startedAt: r.started_at || undefined,
    resolvedAt: r.resolved_at || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toSafeHouse(r: ApiSafeHouse): SafeHouse {
  return {
    id: r.id,
    name: r.name,
    city: r.city,
    country: r.country,
    address: r.address,
    contactName: r.contact_name,
    contactPhone: r.contact_phone,
    capacity: r.capacity,
    securityLevel: r.security_level as SafeHouse['securityLevel'],
    availableNow: r.available_now,
    lastVerified: r.last_verified,
  };
}

function toEmergencyContact(r: ApiEmergencyContact): EmergencyContact {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    phone: r.phone,
    email: r.email || undefined,
    region: r.region,
    available24h: r.available_24h,
  };
}

function toStep(r: ApiExtractionStep): ExtractionStep {
  return {
    id: r.id,
    order: r.order,
    title: r.title,
    description: r.description,
    status: r.status as ExtractionStep['status'],
    assignedTo: r.assigned_to || undefined,
    estimatedDurationMinutes: r.estimated_duration_minutes,
    completedAt: r.completed_at || undefined,
    notes: r.notes || undefined,
  };
}

function toTimelineEvent(r: ApiTimelineEvent): CrisisTimelineEvent {
  return {
    id: r.id,
    timestamp: r.timestamp,
    event: r.event,
    type: r.type as CrisisTimelineEvent['type'],
    actor: r.actor || undefined,
  };
}

function toProtocol(r: ApiExtractionProtocol): ExtractionProtocol {
  return {
    id: r.id,
    institutionId: r.institution_id,
    clientId: r.client_id,
    clientName: r.client_name,
    priority: r.priority as ExtractionPriority,
    status: r.status as ProtocolStatus,
    currentLocation: r.current_location,
    destinationLocation: r.destination_location,
    crisisId: r.crisis_id || undefined,
    steps: (r.steps ?? []).map(toStep),
    safeHouses: (r.safe_houses ?? []).map(toSafeHouse),
    emergencyContacts: (r.emergency_contacts ?? []).map(toEmergencyContact),
    timeline: (r.timeline ?? []).map(toTimelineEvent),
    activatedBy: r.activated_by || undefined,
    activatedAt: r.activated_at || undefined,
    completedAt: r.completed_at || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// ── Service ──────────────────────────────────────────────────────────

export class ApiCrisisService implements ICrisisService {
  async getDisruptions(institutionId: string): Promise<AviationDisruption[]> {
    logger.info('Crisis', 'getDisruptions', { institutionId });
    const qs = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    const raw = await api.get<unknown>(`/api/crisis/disruptions${qs}`);
    return toList<ApiAviationDisruption>(raw).map(toDisruption);
  }

  async getActiveDisruptions(institutionId: string): Promise<AviationDisruption[]> {
    logger.info('Crisis', 'getActiveDisruptions', { institutionId });
    const qs = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    const raw = await api.get<unknown>(`/api/crisis/disruptions/active${qs}`);
    return toList<ApiAviationDisruption>(raw).map(toDisruption);
  }

  async getDisruptionById(id: string): Promise<AviationDisruption | null> {
    logger.info('Crisis', 'getDisruptionById', { id });
    try {
      const raw = await api.get<ApiAviationDisruption>(`/api/crisis/disruptions/${id}`);
      return toDisruption(raw);
    } catch (err) {
      logger.warn('Crisis', 'getDisruptionById not found', { id, err });
      return null;
    }
  }

  async updateDisruptionStatus(
    id: string,
    status: CrisisStatus
  ): Promise<AviationDisruption> {
    logger.info('Crisis', 'updateDisruptionStatus', { id, status });
    const raw = await api.patch<ApiAviationDisruption>(
      `/api/crisis/disruptions/${id}/status?status=${encodeURIComponent(status)}`
    );
    return toDisruption(raw);
  }

  async getProtocols(institutionId: string): Promise<ExtractionProtocol[]> {
    logger.info('Crisis', 'getProtocols', { institutionId });
    const qs = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    const raw = await api.get<unknown>(`/api/crisis/protocols${qs}`);
    return toList<ApiExtractionProtocol>(raw).map(toProtocol);
  }

  async getProtocolById(id: string): Promise<ExtractionProtocol | null> {
    logger.info('Crisis', 'getProtocolById', { id });
    try {
      const raw = await api.get<ApiExtractionProtocol>(`/api/crisis/protocols/${id}`);
      return toProtocol(raw);
    } catch (err) {
      logger.warn('Crisis', 'getProtocolById not found', { id, err });
      return null;
    }
  }

  async activateProtocol(id: string, activatedBy: string): Promise<ExtractionProtocol> {
    logger.warn('Crisis', 'activateProtocol', { id, activatedBy });
    const raw = await api.post<ApiExtractionProtocol>(
      `/api/crisis/protocols/${id}/activate`,
      { activated_by: activatedBy }
    );
    return toProtocol(raw);
  }

  async updateStepStatus(
    protocolId: string,
    stepId: string,
    status: 'in_progress' | 'completed' | 'skipped'
  ): Promise<ExtractionProtocol> {
    logger.info('Crisis', 'updateStepStatus', { protocolId, stepId, status });
    const raw = await api.patch<ApiExtractionProtocol>(
      `/api/crisis/protocols/${protocolId}/steps/${stepId}?status=${encodeURIComponent(status)}`
    );
    return toProtocol(raw);
  }

  async getSafeHouses(region?: string): Promise<SafeHouse[]> {
    logger.info('Crisis', 'getSafeHouses', { region });
    const qs = region ? `?region=${encodeURIComponent(region)}` : '';
    const raw = await api.get<unknown>(`/api/crisis/safe-houses${qs}`);
    return toList<ApiSafeHouse>(raw).map(toSafeHouse);
  }

  async getEmergencyContacts(_region?: string): Promise<EmergencyContact[]> {
    // The Frontend Integration Guide §4.5 lists no standalone emergency-contacts
    // endpoint — contacts are surfaced via ExtractionProtocol.emergencyContacts
    // instead. Calling /api/crisis/emergency-contacts consistently 404s, so we
    // skip the request entirely and let callers merge contacts out of the
    // already-loaded protocols.
    logger.debug('Crisis', 'getEmergencyContacts skipped — not in spec');
    return [];
  }
}
