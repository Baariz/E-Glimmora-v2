/**
 * Real API Approval Chain Service
 * Implements IApprovalChainService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §5.6
 */

import type {
  ApprovalChain,
  ApprovalChainStep,
  CreateApprovalChainInput,
  UpdateApprovalChainInput,
} from '@/lib/types';
import type { IApprovalChainService } from '../interfaces/IApprovalChainService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shapes ───────────────────────────────────────────────────

interface ApiApprovalChainStep {
  role: string;
  order: number;
  required: boolean;
  parallel: boolean;
}

interface ApiApprovalChain {
  id: string;
  name: string;
  institution_id?: string | null;
  steps: ApiApprovalChainStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function toList(raw: unknown): ApiApprovalChain[] {
  if (Array.isArray(raw)) return raw as ApiApprovalChain[];
  if (raw && typeof raw === 'object') {
    const o = raw as { items?: ApiApprovalChain[]; data?: ApiApprovalChain[] };
    return o.items ?? o.data ?? [];
  }
  return [];
}

function toChain(r: ApiApprovalChain): ApprovalChain {
  return {
    id: r.id,
    name: r.name,
    institutionId: r.institution_id ?? null,
    steps: (r.steps ?? []).map((s) => ({
      role: s.role,
      order: s.order,
      required: s.required,
      parallel: s.parallel,
    })),
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toApiSteps(steps: ApprovalChainStep[]): ApiApprovalChainStep[] {
  return steps.map((s) => ({
    role: s.role,
    order: s.order,
    required: s.required,
    parallel: s.parallel,
  }));
}

export class ApiApprovalChainService implements IApprovalChainService {
  async list(institutionId?: string): Promise<ApprovalChain[]> {
    logger.info('ApprovalChain', 'list', { institutionId });
    const qs = institutionId
      ? `?institutionId=${encodeURIComponent(institutionId)}`
      : '';
    const raw = await api.get<unknown>(`/api/approval-chains${qs}`);
    return toList(raw).map(toChain);
  }

  async get(id: string): Promise<ApprovalChain | null> {
    logger.info('ApprovalChain', 'get', { id });
    try {
      const raw = await api.get<ApiApprovalChain>(`/api/approval-chains/${id}`);
      return toChain(raw);
    } catch (err) {
      logger.warn('ApprovalChain', 'get not found', { id, err });
      return null;
    }
  }

  async create(data: CreateApprovalChainInput): Promise<ApprovalChain> {
    logger.info('ApprovalChain', 'create', { name: data.name });
    const raw = await api.post<ApiApprovalChain>('/api/approval-chains', {
      name: data.name,
      institution_id: data.institutionId ?? null,
      steps: toApiSteps(data.steps),
    });
    return toChain(raw);
  }

  async update(id: string, data: UpdateApprovalChainInput): Promise<ApprovalChain> {
    logger.info('ApprovalChain', 'update', { id });
    const body: Record<string, unknown> = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.steps !== undefined) body.steps = toApiSteps(data.steps);
    if (data.isActive !== undefined) body.is_active = data.isActive;
    const raw = await api.patch<ApiApprovalChain>(`/api/approval-chains/${id}`, body);
    return toChain(raw);
  }

  async assignToJourney(journeyId: string, chainId: string): Promise<void> {
    logger.info('ApprovalChain', 'assignToJourney', { journeyId, chainId });
    await api.patch<unknown>(`/api/journeys/${journeyId}`, {
      approval_chain_id: chainId,
    });
  }
}
