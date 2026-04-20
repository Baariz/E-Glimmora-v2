/**
 * Real API Conflict Service
 * Implements IConflictService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §4.6
 */

import type {
  ConflictAlert,
  ConflictResolution,
  ConflictMatrixEntry,
  ConflictSeverity,
  ConflictStatus,
  ConflictType,
} from '@/lib/types';
import type {
  IConflictService,
  ConflictStats,
} from '../interfaces/IConflictService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shapes ───────────────────────────────────────────────────

interface ApiConflictAlert {
  id: string;
  institution_id: string;
  conflict_type: string;
  severity: string;
  status: string;
  party_a_client_id: string;
  party_b_client_id: string;
  party_a_label: string;
  party_b_label: string;
  title: string;
  description: string;
  detected_at: string;
  venue?: string | null;
  event_date?: string | null;
  recommended_actions?: string[] | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  resolution_notes?: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiConflictResolution {
  id: string;
  conflict_id: string;
  resolved_by: string;
  action: string;
  notes: string;
  created_at: string;
}

interface ApiConflictStats {
  total_active?: number;
  total_resolved?: number;
  critical_count?: number;
  high_count?: number;
  average_resolution_hours?: number;
  by_type?: Record<string, number>;
}

interface ApiConflictMatrixEntry {
  client_id: string;
  client_label: string;
  conflict_count: number;
  high_severity_count: number;
  active_conflicts: number;
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

function toAlert(r: ApiConflictAlert): ConflictAlert {
  return {
    id: r.id,
    institutionId: r.institution_id,
    conflictType: r.conflict_type as ConflictType,
    severity: r.severity as ConflictSeverity,
    status: r.status as ConflictStatus,
    partyAClientId: r.party_a_client_id,
    partyBClientId: r.party_b_client_id,
    partyALabel: r.party_a_label,
    partyBLabel: r.party_b_label,
    title: r.title,
    description: r.description,
    detectedAt: r.detected_at,
    venue: r.venue || undefined,
    eventDate: r.event_date || undefined,
    recommendedActions: r.recommended_actions ?? [],
    resolvedBy: r.resolved_by || undefined,
    resolvedAt: r.resolved_at || undefined,
    resolutionNotes: r.resolution_notes || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toResolution(r: ApiConflictResolution): ConflictResolution {
  return {
    id: r.id,
    conflictId: r.conflict_id,
    resolvedBy: r.resolved_by,
    action: r.action,
    notes: r.notes,
    createdAt: r.created_at,
  };
}

function toMatrixEntry(r: ApiConflictMatrixEntry): ConflictMatrixEntry {
  return {
    clientId: r.client_id,
    clientLabel: r.client_label,
    conflictCount: r.conflict_count,
    highSeverityCount: r.high_severity_count,
    activeConflicts: r.active_conflicts,
  };
}

function toStats(r: ApiConflictStats): ConflictStats {
  return {
    totalActive: r.total_active ?? 0,
    totalResolved: r.total_resolved ?? 0,
    criticalCount: r.critical_count ?? 0,
    highCount: r.high_count ?? 0,
    averageResolutionHours: r.average_resolution_hours ?? 0,
    byType: (r.by_type as Record<ConflictType, number>) ?? {
      scheduling: 0,
      venue: 0,
      relationship: 0,
      business: 0,
      social_circle: 0,
    },
  };
}

// ── Service ──────────────────────────────────────────────────────────

export class ApiConflictService implements IConflictService {
  async getConflictAlerts(
    institutionId: string,
    filters?: {
      severity?: ConflictSeverity;
      status?: ConflictStatus;
      type?: ConflictType;
    }
  ): Promise<ConflictAlert[]> {
    logger.info('Conflict', 'getConflictAlerts', { institutionId, filters });
    const params = new URLSearchParams();
    if (institutionId) params.set('institutionId', institutionId);
    if (filters?.severity) params.set('severity', filters.severity);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.type) params.set('type', filters.type);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const raw = await api.get<unknown>(`/api/conflicts${qs}`);
    return toList<ApiConflictAlert>(raw).map(toAlert);
  }

  async getConflictById(id: string): Promise<ConflictAlert | null> {
    logger.info('Conflict', 'getConflictById', { id });
    try {
      const raw = await api.get<ApiConflictAlert>(`/api/conflicts/${id}`);
      return toAlert(raw);
    } catch (err) {
      logger.warn('Conflict', 'getConflictById not found', { id, err });
      return null;
    }
  }

  async getConflictStats(institutionId: string): Promise<ConflictStats> {
    logger.info('Conflict', 'getConflictStats', { institutionId });
    const raw = await api.get<ApiConflictStats>(
      `/api/conflicts/stats?institutionId=${encodeURIComponent(institutionId)}`
    );
    return toStats(raw || {});
  }

  async getConflictMatrix(institutionId: string): Promise<ConflictMatrixEntry[]> {
    logger.info('Conflict', 'getConflictMatrix', { institutionId });
    const raw = await api.get<unknown>(
      `/api/conflicts/matrix?institutionId=${encodeURIComponent(institutionId)}`
    );
    return toList<ApiConflictMatrixEntry>(raw).map(toMatrixEntry);
  }

  async resolveConflict(
    conflictId: string,
    data: { resolvedBy: string; action: string; notes: string }
  ): Promise<ConflictAlert> {
    logger.info('Conflict', 'resolveConflict', { conflictId });
    const raw = await api.post<ApiConflictAlert>(
      `/api/conflicts/${conflictId}/resolve`,
      {
        resolved_by: data.resolvedBy,
        action: data.action,
        notes: data.notes,
      }
    );
    return toAlert(raw);
  }

  async acknowledgeConflict(conflictId: string, userId: string): Promise<ConflictAlert> {
    logger.info('Conflict', 'acknowledgeConflict', { conflictId, userId });
    const raw = await api.post<ApiConflictAlert>(
      `/api/conflicts/${conflictId}/acknowledge`,
      { acknowledged_by: userId }
    );
    return toAlert(raw);
  }

  async getResolutionHistory(conflictId: string): Promise<ConflictResolution[]> {
    logger.info('Conflict', 'getResolutionHistory', { conflictId });
    const raw = await api.get<unknown>(
      `/api/conflicts/${conflictId}/resolution-history`
    );
    return toList<ApiConflictResolution>(raw).map(toResolution);
  }
}
