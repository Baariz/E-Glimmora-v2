/**
 * Real API Client Service
 * Implements IClientService against the Elan Glimmora backend API
 */

import type {
  ClientRecord,
  ClientStatus,
  CreateClientRecordInput,
  RiskCategory,
  EmotionalDrivers,
} from '@/lib/types';
import type { IClientService } from '../interfaces/IClientService';
import { api } from './client';

// Backend represents risk_category as an integer enum
const RISK_CATEGORY_FROM_INT: Record<number, RiskCategory> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical',
};
const RISK_CATEGORY_TO_INT: Record<RiskCategory, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
};

interface ApiClientRecord {
  id: string;
  user_id: string;
  institution_id: string;
  assigned_rm?: string | null;
  assigned_advisors?: string[] | null;
  name?: string | null;
  email?: string | null;
  status: string;
  risk_category?: number | null;
  risk_score?: number | null;
  emotional_profile?: EmotionalDrivers | null;
  active_journey_count?: number | null;
  total_journey_count?: number | null;
  nda_status?: string | null;
  nda_expires_at?: string | null;
  last_activity?: string | null;
  onboarded_at?: string | null;
  created_at: string;
  updated_at: string;
}

function toClientRecord(raw: ApiClientRecord): ClientRecord {
  return {
    id: raw.id,
    userId: raw.user_id,
    institutionId: raw.institution_id,
    assignedRM: raw.assigned_rm || '',
    assignedAdvisors: raw.assigned_advisors || [],
    name: raw.name || '',
    email: raw.email || '',
    status: (raw.status as ClientStatus) || 'Active',
    riskCategory:
      raw.risk_category != null ? RISK_CATEGORY_FROM_INT[raw.risk_category] || 'Low' : 'Low',
    riskScore: raw.risk_score ?? 0,
    emotionalProfile: raw.emotional_profile || undefined,
    activeJourneyCount: raw.active_journey_count ?? 0,
    totalJourneyCount: raw.total_journey_count ?? 0,
    ndaStatus: (raw.nda_status as ClientRecord['ndaStatus']) || 'None',
    ndaExpiresAt: raw.nda_expires_at || undefined,
    lastActivity: raw.last_activity || raw.updated_at,
    onboardedAt: raw.onboarded_at || raw.created_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

async function enrichWithUser(record: ClientRecord): Promise<ClientRecord> {
  if ((record.name && record.email) || !record.userId) return record;
  try {
    const user = await api.get<{ id: string; name?: string; email?: string }>(
      `/api/users/${record.userId}`
    );
    const data = (user as { data?: typeof user }).data ?? user;
    return {
      ...record,
      name: record.name || data.name || '',
      email: record.email || data.email || '',
    };
  } catch {
    return record;
  }
}

function toListArray(data: unknown): ApiClientRecord[] {
  if (Array.isArray(data)) return data as ApiClientRecord[];
  if (data && typeof data === 'object') {
    const d = data as { items?: ApiClientRecord[]; data?: ApiClientRecord[] };
    return d.items || d.data || [];
  }
  return [];
}

export class ApiClientService implements IClientService {
  async getClientsByRM(rmId: string): Promise<ClientRecord[]> {
    const raw = await api.get<unknown>(`/api/clients?rmId=${encodeURIComponent(rmId)}`);
    const records = toListArray(raw).map(toClientRecord);
    return Promise.all(records.map(enrichWithUser));
  }

  async getClientsByInstitution(institutionId: string): Promise<ClientRecord[]> {
    const raw = await api.get<unknown>(
      `/api/clients?institutionId=${encodeURIComponent(institutionId)}`
    );
    const records = toListArray(raw).map(toClientRecord);
    return Promise.all(records.map(enrichWithUser));
  }

  async getClientById(id: string): Promise<ClientRecord | null> {
    try {
      const raw = await api.get<ApiClientRecord>(`/api/clients/${id}`);
      return enrichWithUser(toClientRecord(raw));
    } catch {
      return null;
    }
  }

  async createClient(data: CreateClientRecordInput): Promise<ClientRecord> {
    const raw = await api.post<ApiClientRecord>('/api/clients', {
      user_id: data.userId,
      institution_id: data.institutionId,
      assigned_rm: data.assignedRM,
      status: 'Active',
    });
    return toClientRecord(raw);
  }

  async updateClient(id: string, data: Partial<ClientRecord>): Promise<ClientRecord> {
    const body: Record<string, unknown> = {};
    if (data.status !== undefined) body.status = data.status;
    if (data.riskCategory !== undefined)
      body.risk_category = RISK_CATEGORY_TO_INT[data.riskCategory];
    if (data.ndaStatus !== undefined) body.nda_status = data.ndaStatus;
    if (data.emotionalProfile !== undefined) body.emotional_profile = data.emotionalProfile;
    const raw = await api.patch<ApiClientRecord>(`/api/clients/${id}`, body);
    return toClientRecord(raw);
  }

  async assignAdvisor(clientId: string, advisorId: string): Promise<ClientRecord> {
    const raw = await api.post<ApiClientRecord>(
      `/api/clients/${clientId}/advisors?advisor_id=${encodeURIComponent(advisorId)}`
    );
    return toClientRecord(raw);
  }

  async removeAdvisor(clientId: string, advisorId: string): Promise<ClientRecord> {
    const raw = await api.delete<ApiClientRecord>(
      `/api/clients/${clientId}/advisors/${advisorId}`
    );
    return toClientRecord(raw);
  }

  async archiveClient(id: string): Promise<ClientRecord> {
    const raw = await api.post<ApiClientRecord>(`/api/clients/${id}/archive`);
    return toClientRecord(raw);
  }
}
