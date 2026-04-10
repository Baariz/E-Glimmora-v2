/**
 * Real API Institution Service
 * Implements IInstitutionService against the Elan Glimmora backend API
 */

import type {
  Institution,
  InstitutionType,
  InstitutionTier,
  InstitutionStatus,
  CreateInstitutionInput,
} from '@/lib/types';
import type { IInstitutionService } from '../interfaces/IInstitutionService';
import { api } from './client';

// ── Backend shapes (snake_case) ──────────────────────────────────────────────

interface ApiInstitution {
  id: string;
  name: string;
  type: string;
  tier: string;
  status: string;
  contract_start: string;
  contract_end?: string | null;
  created_at: string;
  updated_at: string;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function toInstitution(raw: ApiInstitution): Institution {
  return {
    id: raw.id,
    name: raw.name,
    type: raw.type as InstitutionType,
    tier: raw.tier as InstitutionTier,
    status: (raw.status as InstitutionStatus) || 'Pending',
    contractStart: raw.contract_start,
    contractEnd: raw.contract_end || undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function toApiCreateBody(data: CreateInstitutionInput): Record<string, unknown> {
  return {
    name: data.name,
    type: data.type,
    tier: data.tier,
    contract_start: new Date().toISOString().split('T')[0], // Default to today
  };
}

function toApiUpdateBody(data: Partial<Institution>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name !== undefined) body.name = data.name;
  if (data.type !== undefined) body.type = data.type;
  if (data.tier !== undefined) body.tier = data.tier;
  if (data.contractStart !== undefined) body.contract_start = data.contractStart;
  if (data.contractEnd !== undefined) body.contract_end = data.contractEnd;
  return body;
}

// ── Service ──────────────────────────────────────────────────────────────────

export class ApiInstitutionService implements IInstitutionService {
  async getInstitutions(): Promise<Institution[]> {
    const raw = await api.get<ApiInstitution[]>('/api/institutions');
    return raw.map(toInstitution);
  }

  async getInstitutionById(id: string): Promise<Institution | null> {
    try {
      const raw = await api.get<ApiInstitution>(`/api/institutions/${id}`);
      return toInstitution(raw);
    } catch {
      return null;
    }
  }

  async createInstitution(data: CreateInstitutionInput): Promise<Institution> {
    const raw = await api.post<ApiInstitution>(
      '/api/institutions',
      toApiCreateBody(data)
    );
    return toInstitution(raw);
  }

  async updateInstitution(id: string, data: Partial<Institution>): Promise<Institution> {
    const raw = await api.patch<ApiInstitution>(
      `/api/institutions/${id}`,
      toApiUpdateBody(data)
    );
    return toInstitution(raw);
  }

  async suspendInstitution(id: string): Promise<Institution> {
    const raw = await api.post<ApiInstitution>(`/api/institutions/${id}/suspend`);
    return toInstitution(raw);
  }

  async reactivateInstitution(id: string): Promise<Institution> {
    const raw = await api.post<ApiInstitution>(`/api/institutions/${id}/reactivate`);
    return toInstitution(raw);
  }

  async removeInstitution(id: string): Promise<Institution> {
    const raw = await api.post<ApiInstitution>(`/api/institutions/${id}/remove`);
    return toInstitution(raw);
  }
}
