/**
 * Audit Service Interface
 * Manages audit logging and compliance trails.
 *
 * NOTE: Backend now auto-logs every write endpoint (Frontend_Integration_Guide §1).
 * `log()` remains as a no-op for backwards compatibility with legacy call sites;
 * the query methods are async and hit the real API.
 */

import { AuditEvent, DomainContext } from '@/lib/types';

export interface IAuditService {
  /** No-op on real API; backend logs writes automatically. */
  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void;
  getAll(): Promise<AuditEvent[]>;
  getByResource(resourceType: string, resourceId: string): Promise<AuditEvent[]>;
  getByUser(userId: string): Promise<AuditEvent[]>;
  getByContext(context: DomainContext): Promise<AuditEvent[]>;
  anonymizeUser(userId: string): Promise<void>;
}
