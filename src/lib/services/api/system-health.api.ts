/**
 * Real API System Health Service
 * Implements ISystemHealthService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §4.12
 */

import type {
  ISystemHealthService,
  SystemMetrics,
  HealthTimePoint,
} from '../interfaces/ISystemHealthService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shapes ───────────────────────────────────────────────────

interface ApiSystemMetrics {
  uptime?: number;
  error_rate?: number;
  avg_response_time?: number;
  active_sessions?: number;
  api_calls_today?: number;
  storage_used_gb?: number;
  storage_capacity_gb?: number;
}

interface ApiHealthPoint {
  time?: string;
  timestamp?: string;
  uptime?: number;
  error_rate?: number;
  response_time?: number;
}

function toList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === 'object') {
    const o = raw as { items?: T[]; data?: T[] };
    return o.items ?? o.data ?? [];
  }
  return [];
}

function toMetrics(r: ApiSystemMetrics): SystemMetrics {
  return {
    uptime: r.uptime ?? 100,
    errorRate: r.error_rate ?? 0,
    avgResponseTime: r.avg_response_time ?? 0,
    activeSessions: r.active_sessions ?? 0,
    apiCallsToday: r.api_calls_today ?? 0,
    storageUsedGB: r.storage_used_gb ?? 0,
    storageCapacityGB: r.storage_capacity_gb ?? 0,
  };
}

function toPoint(r: ApiHealthPoint): HealthTimePoint {
  return {
    time: r.time || r.timestamp || new Date().toISOString(),
    uptime: r.uptime ?? 100,
    errorRate: r.error_rate ?? 0,
    responseTime: r.response_time ?? 0,
  };
}

// ── Service ──────────────────────────────────────────────────────────

export class ApiSystemHealthService implements ISystemHealthService {
  async getCurrentMetrics(): Promise<SystemMetrics> {
    logger.info('SystemHealth', 'getCurrentMetrics');
    const raw = await api.get<ApiSystemMetrics>('/api/system/metrics');
    return toMetrics(raw || {});
  }

  async getHealthTimeline(hours = 24): Promise<HealthTimePoint[]> {
    logger.info('SystemHealth', 'getHealthTimeline', { hours });
    const raw = await api.get<unknown>(`/api/system/health-history?hours=${hours}`);
    return toList<ApiHealthPoint>(raw).map(toPoint);
  }
}
