/**
 * Mock Audit Service
 * localStorage-based append-only audit logging
 */

import { BaseMockService } from './base.mock';
import { IAuditService } from '../interfaces/IAuditService';
import { AuditEvent, DomainContext, AuditAction } from '@/lib/types';

export class MockAuditService extends BaseMockService implements IAuditService {
  private readonly STORAGE_KEY = 'audit_events';

  constructor() {
    super();
    this.seedIfEmpty();
  }

  /**
   * Seed initial mock data (idempotent)
   */
  private seedIfEmpty(): void {
    const existing = this.getFromStorage<AuditEvent>(this.STORAGE_KEY);
    if (existing.length > 0) {
      return; // Already seeded
    }

    const mockUserId = 'b2b-rm-001-uuid-placeholder';

    const seedEvents: AuditEvent[] = [
      {
        id: this.generateId(),
        event: 'client.create',
        userId: mockUserId,
        resourceId: 'user-uhni-004',
        resourceType: 'client',
        context: 'b2b',
        action: 'CREATE',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        metadata: { clientName: 'Dimitri Volkov-Hayes' }
      },
      {
        id: this.generateId(),
        event: 'journey.approve',
        userId: 'b2b-compliance-001',
        resourceId: 'journey-001',
        resourceType: 'journey',
        context: 'b2b',
        action: 'APPROVE',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        metadata: { status: 'APPROVED' }
      },
      {
        id: this.generateId(),
        event: 'risk.update',
        userId: mockUserId,
        resourceId: 'user-uhni-006',
        resourceType: 'risk',
        context: 'b2b',
        action: 'UPDATE',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        previousState: { riskScore: 88 },
        newState: { riskScore: 92 },
        metadata: { reason: 'Enhanced due diligence review' }
      },
      {
        id: this.generateId(),
        event: 'client.read',
        userId: 'b2b-banker-001',
        resourceId: 'user-uhni-001',
        resourceType: 'client',
        context: 'b2b',
        action: 'READ',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        metadata: { view: 'profile' }
      },
      {
        id: this.generateId(),
        event: 'journey.create',
        userId: 'user-uhni-002',
        resourceId: 'journey-002',
        resourceType: 'journey',
        context: 'b2c',
        action: 'CREATE',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        metadata: { title: 'Alpine Winter Escape' }
      },
      {
        id: this.generateId(),
        event: 'journey.update',
        userId: mockUserId,
        resourceId: 'journey-003',
        resourceType: 'journey',
        context: 'b2b',
        action: 'UPDATE',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        previousState: { status: 'DRAFT' },
        newState: { status: 'RM_REVIEW' },
        metadata: { action: 'submitted_for_review' }
      },
      {
        id: this.generateId(),
        event: 'risk.read',
        userId: 'b2b-compliance-001',
        resourceId: 'user-uhni-003',
        resourceType: 'risk',
        context: 'b2b',
        action: 'READ',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        metadata: { report: 'risk_summary' }
      },
      {
        id: this.generateId(),
        event: 'client.update',
        userId: mockUserId,
        resourceId: 'user-uhni-005',
        resourceType: 'client',
        context: 'b2b',
        action: 'UPDATE',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        previousState: { ndaStatus: 'Pending' },
        newState: { ndaStatus: 'Active' },
        metadata: { ndaExpiresAt: '2027-12-01' }
      },
      {
        id: this.generateId(),
        event: 'journey.approve',
        userId: 'b2b-compliance-001',
        resourceId: 'journey-004',
        resourceType: 'journey',
        context: 'b2b',
        action: 'APPROVE',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        metadata: { status: 'APPROVED' }
      },
      {
        id: this.generateId(),
        event: 'client.read',
        userId: mockUserId,
        resourceId: 'user-uhni-007',
        resourceType: 'client',
        context: 'b2b',
        action: 'READ',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        metadata: { view: 'profile' }
      },
      {
        id: this.generateId(),
        event: 'journey.create',
        userId: 'user-uhni-001',
        resourceId: 'journey-005',
        resourceType: 'journey',
        context: 'b2c',
        action: 'CREATE',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        metadata: { title: 'Mediterranean Summer Journey' }
      },
      {
        id: this.generateId(),
        event: 'risk.create',
        userId: mockUserId,
        resourceId: 'user-uhni-004',
        resourceType: 'risk',
        context: 'b2b',
        action: 'CREATE',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metadata: { riskScore: 45, riskCategory: 'Medium' }
      },
      {
        id: this.generateId(),
        event: 'client.update',
        userId: mockUserId,
        resourceId: 'user-uhni-006',
        resourceType: 'client',
        context: 'b2b',
        action: 'UPDATE',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        previousState: { status: 'Onboarding' },
        newState: { status: 'Active' },
        metadata: { onboardedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString() }
      },
      {
        id: this.generateId(),
        event: 'journey.read',
        userId: 'b2b-banker-001',
        resourceId: 'journey-001',
        resourceType: 'journey',
        context: 'b2b',
        action: 'READ',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        metadata: { view: 'details' }
      },
      {
        id: this.generateId(),
        event: 'client.read',
        userId: mockUserId,
        resourceId: 'user-uhni-002',
        resourceType: 'client',
        context: 'b2b',
        action: 'READ',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        metadata: { view: 'portfolio' }
      }
    ];

    this.setInStorage(this.STORAGE_KEY, seedEvents);
  }

  /**
   * Log an audit event (append-only)
   */
  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const events = this.getFromStorage<AuditEvent>(this.STORAGE_KEY);

    const auditEvent: AuditEvent = {
      id: this.generateId(),
      timestamp: this.now(),
      ...event
    };

    events.push(auditEvent);
    this.setInStorage(this.STORAGE_KEY, events);
  }

  getAll(): AuditEvent[] {
    return this.getFromStorage<AuditEvent>(this.STORAGE_KEY);
  }

  getByResource(resourceType: string, resourceId: string): AuditEvent[] {
    const events = this.getFromStorage<AuditEvent>(this.STORAGE_KEY);
    return events.filter(e => e.resourceType === resourceType && e.resourceId === resourceId);
  }

  getByUser(userId: string): AuditEvent[] {
    const events = this.getFromStorage<AuditEvent>(this.STORAGE_KEY);
    return events.filter(e => e.userId === userId);
  }

  getByContext(context: DomainContext): AuditEvent[] {
    const events = this.getFromStorage<AuditEvent>(this.STORAGE_KEY);
    return events.filter(e => e.context === context);
  }

  /**
   * Anonymize all audit events for a user (GDPR compliance)
   */
  anonymizeUser(userId: string): void {
    const events = this.getFromStorage<AuditEvent>(this.STORAGE_KEY);
    const anonymized = events.map(event =>
      event.userId === userId
        ? { ...event, userId: 'ANONYMIZED', metadata: { ...event.metadata, anonymized: true } }
        : event
    );
    this.setInStorage(this.STORAGE_KEY, anonymized);
  }
}
