/**
 * Real API Risk Service
 * Implements IRiskService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §4.3
 */

import type {
  RiskRecord,
  RiskCategory,
  GeopoliticalRisk,
  TravelAdvisory,
  InsuranceLog,
  ThreatLevel,
} from '@/lib/types';
import type { IRiskService } from '../interfaces/IRiskService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shapes ───────────────────────────────────────────────────

interface ApiRiskRecord {
  id: string;
  user_id: string;
  institution_id: string;
  risk_score: number;
  risk_category: string;
  flags?: string[] | null;
  assessed_by?: string | null;
  assessed_at?: string | null;
  next_review_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ApiGeopoliticalRisk {
  id: string;
  region: string;
  country: string;
  threat_level: string;
  risk_factors?: string[] | null;
  last_updated?: string | null;
}

interface ApiTravelAdvisory {
  id: string;
  country: string;
  region: string;
  advisory_level: string;
  summary: string;
  effective_date: string;
  expires_at?: string | null;
}

interface ApiInsuranceLog {
  id: string;
  client_id: string;
  institution_id: string;
  type: string;
  provider: string;
  policy_number: string;
  coverage?: string | null;
  valid_from: string;
  valid_until?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

// ── Mappers ──────────────────────────────────────────────────────────

function toList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === 'object') {
    const o = raw as { items?: T[]; data?: T[] };
    return o.items ?? o.data ?? [];
  }
  return [];
}

function toRiskRecord(r: ApiRiskRecord): RiskRecord {
  return {
    id: r.id,
    userId: r.user_id,
    institutionId: r.institution_id,
    riskScore: r.risk_score ?? 0,
    riskCategory: (r.risk_category as RiskCategory) || 'Low',
    flags: r.flags ?? [],
    assessedBy: r.assessed_by || '',
    assessedAt: r.assessed_at || r.created_at || new Date().toISOString(),
    nextReviewDate: r.next_review_date || '',
    notes: r.notes || undefined,
  };
}

function toGeopoliticalRisk(r: ApiGeopoliticalRisk): GeopoliticalRisk {
  return {
    id: r.id,
    region: r.region,
    country: r.country,
    threatLevel: (r.threat_level as ThreatLevel) || 'Low',
    riskFactors: r.risk_factors ?? [],
    lastUpdated: r.last_updated || new Date().toISOString(),
  };
}

function toTravelAdvisory(r: ApiTravelAdvisory): TravelAdvisory {
  return {
    id: r.id,
    country: r.country,
    region: r.region,
    advisoryLevel: (r.advisory_level as ThreatLevel) || 'Low',
    summary: r.summary,
    effectiveDate: r.effective_date,
    expiresAt: r.expires_at || undefined,
  };
}

function toInsuranceLog(r: ApiInsuranceLog): InsuranceLog {
  return {
    id: r.id,
    clientId: r.client_id,
    institutionId: r.institution_id,
    type: r.type,
    provider: r.provider,
    policyNumber: r.policy_number,
    coverage: r.coverage || '',
    validFrom: r.valid_from,
    validUntil: r.valid_until || '',
    notes: r.notes || undefined,
    createdBy: r.created_by || '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// ── Service ──────────────────────────────────────────────────────────

export class ApiRiskService implements IRiskService {
  async getRiskRecords(institutionId: string): Promise<RiskRecord[]> {
    logger.info('Risk', 'getRiskRecords', { institutionId });
    const qs = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    const raw = await api.get<unknown>(`/api/risk${qs}`);
    return toList<ApiRiskRecord>(raw).map(toRiskRecord);
  }

  async getRiskByUser(userId: string): Promise<RiskRecord | null> {
    logger.info('Risk', 'getRiskByUser', { userId });
    try {
      const raw = await api.get<ApiRiskRecord>(`/api/risk/user/${userId}`);
      return toRiskRecord(raw);
    } catch (err) {
      logger.warn('Risk', 'getRiskByUser not found', { userId, err });
      return null;
    }
  }

  async createRiskRecord(data: Partial<RiskRecord>): Promise<RiskRecord> {
    logger.info('Risk', 'createRiskRecord', { userId: data.userId });
    const raw = await api.post<ApiRiskRecord>('/api/risk', {
      user_id: data.userId,
      institution_id: data.institutionId,
      risk_score: data.riskScore,
      risk_category: data.riskCategory,
      flags: data.flags ?? [],
      assessed_by: data.assessedBy,
      next_review_date: data.nextReviewDate,
    });
    return toRiskRecord(raw);
  }

  async updateRiskRecord(id: string, data: Partial<RiskRecord>): Promise<RiskRecord> {
    logger.info('Risk', 'updateRiskRecord', { id });
    const body: Record<string, unknown> = {};
    if (data.riskScore !== undefined) body.risk_score = data.riskScore;
    if (data.riskCategory !== undefined) body.risk_category = data.riskCategory;
    if (data.flags !== undefined) body.flags = data.flags;
    if (data.nextReviewDate !== undefined) body.next_review_date = data.nextReviewDate;
    const raw = await api.patch<ApiRiskRecord>(`/api/risk/${id}`, body);
    return toRiskRecord(raw);
  }

  async getGeopoliticalRisks(): Promise<GeopoliticalRisk[]> {
    logger.info('Risk', 'getGeopoliticalRisks');
    const raw = await api.get<unknown>('/api/risk/geopolitical');
    return toList<ApiGeopoliticalRisk>(raw).map(toGeopoliticalRisk);
  }

  async getTravelAdvisories(): Promise<TravelAdvisory[]> {
    logger.info('Risk', 'getTravelAdvisories');
    const raw = await api.get<unknown>('/api/risk/advisories');
    return toList<ApiTravelAdvisory>(raw).map(toTravelAdvisory);
  }

  async getInsuranceLogs(clientId?: string): Promise<InsuranceLog[]> {
    logger.info('Risk', 'getInsuranceLogs', { clientId });
    const qs = clientId ? `?clientId=${encodeURIComponent(clientId)}` : '';
    const raw = await api.get<unknown>(`/api/risk/insurance${qs}`);
    return toList<ApiInsuranceLog>(raw).map(toInsuranceLog);
  }

  async createInsuranceLog(data: Partial<InsuranceLog>): Promise<InsuranceLog> {
    logger.info('Risk', 'createInsuranceLog', { clientId: data.clientId });
    const raw = await api.post<ApiInsuranceLog>('/api/risk/insurance', {
      client_id: data.clientId,
      institution_id: data.institutionId,
      type: data.type,
      provider: data.provider,
      policy_number: data.policyNumber,
      valid_from: data.validFrom,
      valid_until: data.validUntil,
    });
    return toInsuranceLog(raw);
  }

  async flagComplianceIssue(clientId: string, flag: string): Promise<void> {
    logger.info('Risk', 'flagComplianceIssue', { clientId, flag });
    await api.post<unknown>(
      `/api/risk/flag?clientId=${encodeURIComponent(clientId)}&flag=${encodeURIComponent(flag)}`
    );
  }
}
