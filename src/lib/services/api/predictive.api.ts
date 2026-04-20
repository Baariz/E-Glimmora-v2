/**
 * Real API Predictive Service
 * Implements IPredictiveService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §4.7
 */

import type {
  TravelFatigueAssessment,
  FatigueLevel,
  FamilyAlignmentAssessment,
  FamilyMemberPreference,
  DriftSeverity,
  PredictiveAlert,
  PredictionConfidence,
  TravelSegment,
  RiskTolerance,
} from '@/lib/types';
import type { IPredictiveService } from '../interfaces/IPredictiveService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shapes ───────────────────────────────────────────────────

interface ApiTravelFatigue {
  id: string;
  client_id: string;
  client_name: string;
  institution_id: string;
  fatigue_score: number;
  fatigue_level: string;
  trips_last_30_days: number;
  trips_last_90_days: number;
  average_timezones_crossed: number;
  total_flight_hours_last_90_days: number;
  rest_days_between_trips: number;
  burnout_risk_percent: number;
  recommendations?: string[] | null;
  trend_direction: string;
  assessed_at: string;
  next_assessment_date: string;
}

interface ApiFamilyAlignment {
  id: string;
  client_id: string;
  client_name: string;
  institution_id: string;
  overall_alignment_score: number;
  drift_severity: string;
  family_members?: ApiFamilyMember[] | null;
  drift_areas?: ApiDriftArea[] | null;
  alerts?: ApiAlignmentAlert[] | null;
  recommendations?: string[] | null;
  assessed_at: string;
  next_review_date: string;
}

interface ApiFamilyMember {
  member_id: string;
  member_name: string;
  relationship: string;
  travel_preferences?: string[] | null;
  investment_style: string;
  lifestyle_values?: string[] | null;
  philanthropic_interests?: string[] | null;
  last_updated: string;
}

interface ApiDriftArea {
  area: string;
  current_drift_percent: number;
  previous_drift_percent: number;
  trend_direction: string;
}

interface ApiAlignmentAlert {
  id: string;
  severity: string;
  message: string;
  area: string;
  triggered_at: string;
  acknowledged: boolean;
}

interface ApiPredictiveAlert {
  id: string;
  client_id: string;
  client_name: string;
  institution_id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  confidence: string;
  action_required: boolean;
  acknowledged: boolean;
  created_at: string;
  expires_at?: string | null;
}

interface ApiTravelSegment {
  id: string;
  client_id: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  timezones_crossed: number;
  trip_duration_days: number;
  purpose: string;
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

function toFatigue(r: ApiTravelFatigue): TravelFatigueAssessment {
  return {
    id: r.id,
    clientId: r.client_id,
    clientName: r.client_name,
    institutionId: r.institution_id,
    fatigueScore: r.fatigue_score,
    fatigueLevel: r.fatigue_level as FatigueLevel,
    tripsLast30Days: r.trips_last_30_days,
    tripsLast90Days: r.trips_last_90_days,
    averageTimezonesCrossed: r.average_timezones_crossed,
    totalFlightHoursLast90Days: r.total_flight_hours_last_90_days,
    restDaysBetweenTrips: r.rest_days_between_trips,
    burnoutRiskPercent: r.burnout_risk_percent,
    recommendations: r.recommendations ?? [],
    trendDirection: r.trend_direction as TravelFatigueAssessment['trendDirection'],
    assessedAt: r.assessed_at,
    nextAssessmentDate: r.next_assessment_date,
  };
}

function toFamilyMember(r: ApiFamilyMember): FamilyMemberPreference {
  return {
    memberId: r.member_id,
    memberName: r.member_name,
    relationship: r.relationship as FamilyMemberPreference['relationship'],
    travelPreferences: r.travel_preferences ?? [],
    investmentStyle: r.investment_style as RiskTolerance,
    lifestyleValues: r.lifestyle_values ?? [],
    philanthropicInterests: r.philanthropic_interests ?? [],
    lastUpdated: r.last_updated,
  };
}

function toAlignment(r: ApiFamilyAlignment): FamilyAlignmentAssessment {
  return {
    id: r.id,
    clientId: r.client_id,
    clientName: r.client_name,
    institutionId: r.institution_id,
    overallAlignmentScore: r.overall_alignment_score,
    driftSeverity: r.drift_severity as DriftSeverity,
    familyMembers: (r.family_members ?? []).map(toFamilyMember),
    driftAreas: (r.drift_areas ?? []).map((a) => ({
      area: a.area,
      currentDriftPercent: a.current_drift_percent,
      previousDriftPercent: a.previous_drift_percent,
      trendDirection:
        a.trend_direction as FamilyAlignmentAssessment['driftAreas'][number]['trendDirection'],
    })),
    alerts: (r.alerts ?? []).map((a) => ({
      id: a.id,
      severity: a.severity as DriftSeverity,
      message: a.message,
      area: a.area,
      triggeredAt: a.triggered_at,
      acknowledged: a.acknowledged,
    })),
    recommendations: r.recommendations ?? [],
    assessedAt: r.assessed_at,
    nextReviewDate: r.next_review_date,
  };
}

function toAlert(r: ApiPredictiveAlert): PredictiveAlert {
  return {
    id: r.id,
    clientId: r.client_id,
    clientName: r.client_name,
    institutionId: r.institution_id,
    type: r.type as PredictiveAlert['type'],
    severity: r.severity as PredictiveAlert['severity'],
    title: r.title,
    message: r.message,
    confidence: r.confidence as PredictionConfidence,
    actionRequired: r.action_required,
    acknowledged: r.acknowledged,
    createdAt: r.created_at,
    expiresAt: r.expires_at || undefined,
  };
}

function toSegment(r: ApiTravelSegment): TravelSegment {
  return {
    id: r.id,
    clientId: r.client_id,
    origin: r.origin,
    destination: r.destination,
    departureDate: r.departure_date,
    returnDate: r.return_date,
    timezonesCrossed: r.timezones_crossed,
    tripDurationDays: r.trip_duration_days,
    purpose: r.purpose as TravelSegment['purpose'],
  };
}

// ── Service ──────────────────────────────────────────────────────────

export class ApiPredictiveService implements IPredictiveService {
  async getTravelFatigueAssessments(
    institutionId: string
  ): Promise<TravelFatigueAssessment[]> {
    logger.info('Predictive', 'getTravelFatigueAssessments', { institutionId });
    const qs = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    const raw = await api.get<unknown>(`/api/predictive/fatigue${qs}`);
    return toList<ApiTravelFatigue>(raw).map(toFatigue);
  }

  async getTravelFatigueByClient(
    clientId: string
  ): Promise<TravelFatigueAssessment | null> {
    logger.info('Predictive', 'getTravelFatigueByClient', { clientId });
    try {
      const raw = await api.get<ApiTravelFatigue>(`/api/predictive/fatigue/${clientId}`);
      return toFatigue(raw);
    } catch (err) {
      logger.warn('Predictive', 'fatigue by client not found', { clientId, err });
      return null;
    }
  }

  async getTravelSegments(clientId: string): Promise<TravelSegment[]> {
    logger.info('Predictive', 'getTravelSegments', { clientId });
    const raw = await api.get<unknown>(`/api/predictive/segments/${clientId}`);
    return toList<ApiTravelSegment>(raw).map(toSegment);
  }

  async getFamilyAlignmentAssessments(
    institutionId: string
  ): Promise<FamilyAlignmentAssessment[]> {
    logger.info('Predictive', 'getFamilyAlignmentAssessments', { institutionId });
    const qs = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    const raw = await api.get<unknown>(`/api/predictive/alignment${qs}`);
    return toList<ApiFamilyAlignment>(raw).map(toAlignment);
  }

  async getFamilyAlignmentByClient(
    clientId: string
  ): Promise<FamilyAlignmentAssessment | null> {
    logger.info('Predictive', 'getFamilyAlignmentByClient', { clientId });
    try {
      const raw = await api.get<ApiFamilyAlignment>(
        `/api/predictive/alignment/${clientId}`
      );
      return toAlignment(raw);
    } catch (err) {
      logger.warn('Predictive', 'alignment by client not found', { clientId, err });
      return null;
    }
  }

  async getPredictiveAlerts(institutionId: string): Promise<PredictiveAlert[]> {
    logger.info('Predictive', 'getPredictiveAlerts', { institutionId });
    const qs = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    const raw = await api.get<unknown>(`/api/predictive/alerts${qs}`);
    return toList<ApiPredictiveAlert>(raw).map(toAlert);
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    logger.info('Predictive', 'acknowledgeAlert', { alertId });
    await api.post<unknown>(`/api/predictive/alerts/${alertId}/acknowledge`);
  }
}
