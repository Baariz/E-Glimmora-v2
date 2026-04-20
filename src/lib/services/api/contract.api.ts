/**
 * Real API Contract Service
 * Implements IContractService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §4.4
 */

import type {
  Contract,
  ContractStatus,
  InstitutionTier,
  Currency,
  RevenueRecord,
  RevenueType,
} from '@/lib/types';
import type {
  IContractService,
  UsageMetrics,
  SLAMetrics,
} from '../interfaces/IContractService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shapes ───────────────────────────────────────────────────

interface ApiContract {
  id: string;
  institution_id: string;
  tier: string;
  annual_fee: number;
  per_user_fee: number;
  start_date: string;
  end_date?: string | null;
  status: string;
  signed_by?: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiRevenueRecord {
  id: string;
  institution_id: string;
  contract_id: string;
  amount: number;
  currency: string;
  type: string;
  period: string;
  paid_at?: string | null;
  created_at: string;
}

interface ApiUsageMetrics {
  active_users?: number;
  total_users?: number;
  api_calls?: number;
  storage_used_mb?: number;
  storage_capacity_mb?: number;
  journeys_created?: number;
}

interface ApiSlaMetrics {
  uptime_percent?: number;
  avg_response_ms?: number;
  incident_count?: number;
  resolved_count?: number;
  sla_target?: number;
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

function toContract(r: ApiContract): Contract {
  return {
    id: r.id,
    institutionId: r.institution_id,
    tier: r.tier as InstitutionTier,
    annualFee: r.annual_fee,
    perUserFee: r.per_user_fee,
    startDate: r.start_date,
    endDate: r.end_date || undefined,
    status: (r.status as ContractStatus) || 'Active',
    signedBy: r.signed_by || '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toRevenueRecord(r: ApiRevenueRecord): RevenueRecord {
  return {
    id: r.id,
    institutionId: r.institution_id,
    contractId: r.contract_id,
    amount: r.amount,
    currency: (r.currency as Currency) || 'USD',
    type: (r.type as RevenueType) || 'Subscription',
    period: r.period,
    paidAt: r.paid_at || undefined,
    createdAt: r.created_at,
  };
}

function toUsageMetrics(r: ApiUsageMetrics): UsageMetrics {
  return {
    activeUsers: r.active_users ?? 0,
    totalUsers: r.total_users ?? 0,
    apiCalls: r.api_calls ?? 0,
    storageUsedMB: r.storage_used_mb ?? 0,
    storageCapacityMB: r.storage_capacity_mb ?? 0,
    journeysCreated: r.journeys_created ?? 0,
  };
}

function toSlaMetrics(r: ApiSlaMetrics): SLAMetrics {
  return {
    uptimePercent: r.uptime_percent ?? 0,
    avgResponseMs: r.avg_response_ms ?? 0,
    incidentCount: r.incident_count ?? 0,
    resolvedCount: r.resolved_count ?? 0,
    slaTarget: r.sla_target ?? 99.9,
  };
}

// ── Service ──────────────────────────────────────────────────────────

export class ApiContractService implements IContractService {
  async getContracts(institutionId: string): Promise<Contract[]> {
    logger.info('Contract', 'getContracts', { institutionId });
    const qs = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
    const raw = await api.get<unknown>(`/api/contracts${qs}`);
    return toList<ApiContract>(raw).map(toContract);
  }

  async getContractById(id: string): Promise<Contract | null> {
    logger.info('Contract', 'getContractById', { id });
    try {
      const raw = await api.get<ApiContract>(`/api/contracts/${id}`);
      return toContract(raw);
    } catch (err) {
      logger.warn('Contract', 'getContractById not found', { id, err });
      return null;
    }
  }

  async createContract(data: Partial<Contract>): Promise<Contract> {
    logger.info('Contract', 'createContract', { institutionId: data.institutionId });
    const raw = await api.post<ApiContract>('/api/contracts', {
      institution_id: data.institutionId,
      tier: data.tier,
      annual_fee: data.annualFee,
      per_user_fee: data.perUserFee,
      start_date: data.startDate,
      end_date: data.endDate,
      signed_by: data.signedBy,
    });
    return toContract(raw);
  }

  async getRevenueRecords(institutionId: string): Promise<RevenueRecord[]> {
    logger.info('Contract', 'getRevenueRecords', { institutionId });
    const raw = await api.get<unknown>(
      `/api/contracts/revenue?institutionId=${encodeURIComponent(institutionId)}`
    );
    return toList<ApiRevenueRecord>(raw).map(toRevenueRecord);
  }

  async getActiveLicenses(institutionId: string): Promise<Contract[]> {
    logger.info('Contract', 'getActiveLicenses', { institutionId });
    const raw = await api.get<unknown>(
      `/api/contracts/licenses?institutionId=${encodeURIComponent(institutionId)}`
    );
    return toList<ApiContract>(raw).map(toContract);
  }

  async getUsageMetrics(institutionId: string): Promise<UsageMetrics> {
    logger.info('Contract', 'getUsageMetrics', { institutionId });
    const raw = await api.get<ApiUsageMetrics>(
      `/api/contracts/usage?institutionId=${encodeURIComponent(institutionId)}`
    );
    return toUsageMetrics(raw || {});
  }

  async getSLAMetrics(institutionId: string): Promise<SLAMetrics> {
    logger.info('Contract', 'getSLAMetrics', { institutionId });
    const raw = await api.get<ApiSlaMetrics>(
      `/api/contracts/sla?institutionId=${encodeURIComponent(institutionId)}`
    );
    return toSlaMetrics(raw || {});
  }
}
