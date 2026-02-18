/**
 * Audit Service Interface
 * Manages audit logging and compliance trails
 */

import { AuditEvent, DomainContext } from '@/lib/types';

export interface IAuditService {
  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void;
  getAll(): AuditEvent[];
  getByResource(resourceType: string, resourceId: string): AuditEvent[];
  getByUser(userId: string): AuditEvent[];
  getByContext(context: DomainContext): AuditEvent[];
  anonymizeUser(userId: string): void;
}
