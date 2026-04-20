/**
 * Real API Audit Service
 * Implements IAuditService against the Elan Glimmora backend API.
 * Backend spec: Frontend_Integration_Guide.docx §4.10
 *
 * NOTE: log() is a no-op — backend auto-logs every write per §1.
 */

import type { AuditEvent, AuditAction, DomainContext } from '@/lib/types';
import type { IAuditService } from '../interfaces/IAuditService';
import { api } from './client';
import { logger } from '@/lib/utils/logger';

// ── Backend shape ───────────────────────────────────────────────────

interface ApiAuditEvent {
  id: string;
  event: string;
  user_id: string;
  resource_id: string;
  resource_type: string;
  context: string;
  action: string;
  metadata?: Record<string, unknown> | null;
  timestamp: string;
  previous_state?: Record<string, unknown> | null;
  new_state?: Record<string, unknown> | null;
}

function toList(raw: unknown): ApiAuditEvent[] {
  if (Array.isArray(raw)) return raw as ApiAuditEvent[];
  if (raw && typeof raw === 'object') {
    const o = raw as { items?: ApiAuditEvent[]; data?: ApiAuditEvent[] };
    return o.items ?? o.data ?? [];
  }
  return [];
}

function toAuditEvent(r: ApiAuditEvent): AuditEvent {
  return {
    id: r.id,
    event: r.event,
    userId: r.user_id,
    resourceId: r.resource_id,
    resourceType: r.resource_type,
    context: r.context as DomainContext,
    action: r.action as AuditAction,
    metadata: r.metadata || undefined,
    timestamp: r.timestamp,
    previousState: r.previous_state || undefined,
    newState: r.new_state || undefined,
  };
}

async function query(params: Record<string, string | undefined>): Promise<AuditEvent[]> {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) search.set(k, v);
  }
  const qs = search.toString() ? `?${search.toString()}` : '';
  const raw = await api.get<unknown>(`/api/audit${qs}`);
  return toList(raw).map(toAuditEvent);
}

export class ApiAuditService implements IAuditService {
  log(_event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    // Backend auto-logs writes — frontend-initiated log calls are silently dropped.
    logger.debug('Audit', 'log (no-op, backend auto-logs)', {
      event: _event.event,
      action: _event.action,
    });
  }

  async getAll(): Promise<AuditEvent[]> {
    logger.info('Audit', 'getAll');
    return query({});
  }

  async getByResource(resourceType: string, resourceId: string): Promise<AuditEvent[]> {
    logger.info('Audit', 'getByResource', { resourceType, resourceId });
    return query({ resourceType, resourceId });
  }

  async getByUser(userId: string): Promise<AuditEvent[]> {
    logger.info('Audit', 'getByUser', { userId });
    return query({ userId });
  }

  async getByContext(context: DomainContext): Promise<AuditEvent[]> {
    logger.info('Audit', 'getByContext', { context });
    return query({ context });
  }

  async anonymizeUser(userId: string): Promise<void> {
    logger.warn('Audit', 'anonymizeUser (GDPR)', { userId });
    await api.post<unknown>(`/api/audit/anonymize/${encodeURIComponent(userId)}`);
  }
}
