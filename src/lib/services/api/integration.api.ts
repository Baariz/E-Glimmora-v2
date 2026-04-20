/**
 * Real API Integration Service
 * Implements IIntegrationService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §4.11
 */

import type {
  ExternalIntegration,
  IntegrationType,
  IntegrationStatus,
  SyncFrequency,
  IntegrationHealthCheck,
  DataFlowMetric,
} from '@/lib/types';
import type {
  IIntegrationService,
  IntegrationDashboardStats,
} from '../interfaces/IIntegrationService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shapes ───────────────────────────────────────────────────

interface ApiIntegration {
  id: string;
  institution_id: string;
  name: string;
  provider: string;
  type: string;
  status: string;
  endpoint: string;
  api_key_configured: boolean;
  sync_frequency: string;
  last_sync_at?: string | null;
  last_sync_status: string;
  records_synced: number;
  error_count: number;
  health_score: number;
  configured_by: string;
  configured_at: string;
  created_at: string;
  updated_at: string;
}

interface ApiHealthCheck {
  id: string;
  integration_id: string;
  timestamp: string;
  latency_ms: number;
  status_code: number;
  is_healthy: boolean;
  error_message?: string | null;
}

interface ApiDataFlowMetric {
  integration_id: string;
  period: string;
  records_ingested: number;
  records_failed: number;
  avg_latency_ms: number;
  peak_latency_ms: number;
}

interface ApiDashboardStats {
  total_integrations?: number;
  connected_count?: number;
  degraded_count?: number;
  disconnected_count?: number;
  average_health_score?: number;
  total_records_synced_today?: number;
  total_errors_today?: number;
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

function toIntegration(r: ApiIntegration): ExternalIntegration {
  return {
    id: r.id,
    institutionId: r.institution_id,
    name: r.name,
    provider: r.provider,
    type: r.type as IntegrationType,
    status: r.status as IntegrationStatus,
    endpoint: r.endpoint,
    apiKeyConfigured: r.api_key_configured,
    syncFrequency: r.sync_frequency as SyncFrequency,
    lastSyncAt: r.last_sync_at || undefined,
    lastSyncStatus: r.last_sync_status as ExternalIntegration['lastSyncStatus'],
    recordsSynced: r.records_synced,
    errorCount: r.error_count,
    healthScore: r.health_score,
    configuredBy: r.configured_by,
    configuredAt: r.configured_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toHealthCheck(r: ApiHealthCheck): IntegrationHealthCheck {
  return {
    id: r.id,
    integrationId: r.integration_id,
    timestamp: r.timestamp,
    latencyMs: r.latency_ms,
    statusCode: r.status_code,
    isHealthy: r.is_healthy,
    errorMessage: r.error_message || undefined,
  };
}

function toMetric(r: ApiDataFlowMetric): DataFlowMetric {
  return {
    integrationId: r.integration_id,
    period: r.period,
    recordsIngested: r.records_ingested,
    recordsFailed: r.records_failed,
    avgLatencyMs: r.avg_latency_ms,
    peakLatencyMs: r.peak_latency_ms,
  };
}

function toStats(r: ApiDashboardStats): IntegrationDashboardStats {
  return {
    totalIntegrations: r.total_integrations ?? 0,
    connectedCount: r.connected_count ?? 0,
    degradedCount: r.degraded_count ?? 0,
    disconnectedCount: r.disconnected_count ?? 0,
    averageHealthScore: r.average_health_score ?? 0,
    totalRecordsSyncedToday: r.total_records_synced_today ?? 0,
    totalErrorsToday: r.total_errors_today ?? 0,
  };
}

// ── Service ──────────────────────────────────────────────────────────

export class ApiIntegrationService implements IIntegrationService {
  async getIntegrations(
    institutionId: string,
    filters?: { type?: IntegrationType; status?: IntegrationStatus }
  ): Promise<ExternalIntegration[]> {
    logger.info('Integration', 'getIntegrations', { institutionId, filters });
    const params = new URLSearchParams();
    if (institutionId) params.set('institutionId', institutionId);
    if (filters?.type) params.set('type', filters.type);
    if (filters?.status) params.set('status', filters.status);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const raw = await api.get<unknown>(`/api/integrations${qs}`);
    return toList<ApiIntegration>(raw).map(toIntegration);
  }

  async getIntegrationById(id: string): Promise<ExternalIntegration | null> {
    logger.info('Integration', 'getIntegrationById', { id });
    try {
      const raw = await api.get<ApiIntegration>(`/api/integrations/${id}`);
      return toIntegration(raw);
    } catch (err) {
      logger.warn('Integration', 'getIntegrationById not found', { id, err });
      return null;
    }
  }

  async getDashboardStats(institutionId: string): Promise<IntegrationDashboardStats> {
    logger.info('Integration', 'getDashboardStats', { institutionId });
    const raw = await api.get<ApiDashboardStats>(
      `/api/integrations/stats?institutionId=${encodeURIComponent(institutionId)}`
    );
    return toStats(raw || {});
  }

  async getHealthChecks(
    integrationId: string,
    _limit?: number
  ): Promise<IntegrationHealthCheck[]> {
    logger.info('Integration', 'getHealthChecks', { integrationId });
    // Not in guide; use /metrics path — server may return health history too.
    try {
      const raw = await api.get<unknown>(`/api/integrations/${integrationId}/health-history`);
      return toList<ApiHealthCheck>(raw).map(toHealthCheck);
    } catch (err) {
      logger.warn('Integration', 'getHealthChecks unavailable', { err });
      return [];
    }
  }

  async triggerHealthCheck(integrationId: string): Promise<IntegrationHealthCheck> {
    logger.info('Integration', 'triggerHealthCheck', { integrationId });
    const raw = await api.post<ApiHealthCheck>(
      `/api/integrations/${integrationId}/health-check`
    );
    return toHealthCheck(raw);
  }

  async getDataFlowMetrics(integrationId: string, days = 7): Promise<DataFlowMetric[]> {
    logger.info('Integration', 'getDataFlowMetrics', { integrationId, days });
    const raw = await api.get<unknown>(
      `/api/integrations/${integrationId}/metrics?days=${days}`
    );
    return toList<ApiDataFlowMetric>(raw).map(toMetric);
  }

  async toggleIntegration(
    integrationId: string,
    enabled: boolean
  ): Promise<ExternalIntegration> {
    logger.info('Integration', 'toggleIntegration', { integrationId, enabled });
    const raw = await api.post<ApiIntegration>(
      `/api/integrations/${integrationId}/toggle?enabled=${enabled}`
    );
    return toIntegration(raw);
  }

  async testConnection(
    integrationId: string
  ): Promise<{ success: boolean; latencyMs: number; message: string }> {
    logger.info('Integration', 'testConnection', { integrationId });
    const raw = await api.post<{
      success?: boolean;
      latency_ms?: number;
      message?: string;
    }>(`/api/integrations/${integrationId}/test`);
    return {
      success: raw?.success ?? false,
      latencyMs: raw?.latency_ms ?? 0,
      message: raw?.message ?? '',
    };
  }
}
