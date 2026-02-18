/**
 * Immutable Audit Event System
 * Append-only logging for compliance and security tracking
 * CRITICAL: No delete method - audit logs are immutable
 */

import { AuditEvent } from '@/lib/types/entities';
import { DomainContext } from '@/lib/types/roles';
import { IAuditService } from '@/lib/services/interfaces/IAuditService';

const STORAGE_KEY = 'elan:audit';

/**
 * Audit Service - Immutable, append-only event logging
 *
 * Event naming convention:
 * - Pattern: {resource}.{action} (lowercase)
 * - Examples:
 *   - journey.created, journey.updated, journey.deleted, journey.approved
 *   - vault.created, vault.locked, vault.erased
 *   - user.registered, user.suspended, user.erased
 *   - privacy.updated, privacy.global_erase_requested
 *   - intent.created, intent.regenerated
 */
export class AuditService implements IAuditService {
  // ============================================================================
  // Logging (Append-Only)
  // ============================================================================

  /**
   * Log an audit event - append-only, generates id and timestamp
   * NEVER modifies existing entries
   */
  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') {
      // SSR-safe no-op
      return;
    }

    const auditEvent: AuditEvent = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...event,
    };

    const events = this.getAll();
    events.push(auditEvent);
    this.saveEvents(events);
  }

  // ============================================================================
  // Query Methods (Read-Only)
  // ============================================================================

  /**
   * Get all audit events, newest first
   */
  getAll(): AuditEvent[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }

      const events = JSON.parse(data) as AuditEvent[];
      // Return newest first
      return events.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to retrieve audit events:', error);
      return [];
    }
  }

  /**
   * Get audit events for a specific resource
   */
  getByResource(resourceType: string, resourceId: string): AuditEvent[] {
    return this.getAll().filter(
      event => event.resourceType === resourceType && event.resourceId === resourceId
    );
  }

  /**
   * Get audit events for a specific user
   */
  getByUser(userId: string): AuditEvent[] {
    return this.getAll().filter(event => event.userId === userId);
  }

  /**
   * Get audit events for a specific domain context
   */
  getByContext(context: DomainContext): AuditEvent[] {
    return this.getAll().filter(event => event.context === context);
  }

  /**
   * Get audit events by event type
   * @param eventType - Event type (e.g., 'journey.created', 'vault.locked')
   */
  getByEvent(eventType: string): AuditEvent[] {
    return this.getAll().filter(event => event.event === eventType);
  }

  /**
   * Get audit events within a date range
   * @param start - Start date (ISO 8601 string)
   * @param end - End date (ISO 8601 string)
   */
  getByDateRange(start: string, end: string): AuditEvent[] {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    return this.getAll().filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime >= startTime && eventTime <= endTime;
    });
  }

  /**
   * Search audit events with multiple filters
   */
  search(filters: {
    userId?: string;
    resourceType?: string;
    action?: string;
    context?: DomainContext;
    startDate?: string;
    endDate?: string;
  }): AuditEvent[] {
    let results = this.getAll();

    if (filters.userId) {
      results = results.filter(event => event.userId === filters.userId);
    }

    if (filters.resourceType) {
      results = results.filter(event => event.resourceType === filters.resourceType);
    }

    if (filters.action) {
      results = results.filter(event => event.action === filters.action);
    }

    if (filters.context) {
      results = results.filter(event => event.context === filters.context);
    }

    if (filters.startDate && filters.endDate) {
      const startTime = new Date(filters.startDate).getTime();
      const endTime = new Date(filters.endDate).getTime();
      results = results.filter(event => {
        const eventTime = new Date(event.timestamp).getTime();
        return eventTime >= startTime && eventTime <= endTime;
      });
    }

    return results;
  }

  // ============================================================================
  // GDPR Compliance
  // ============================================================================

  /**
   * Anonymize all events for a specific user
   * This is the ONLY mutation allowed on audit data (legal requirement)
   * Replaces userId with REDACTED_<uuid>
   */
  anonymizeUser(userId: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    const events = this.getAll();
    const redactedId = `REDACTED_${this.generateId()}`;
    const timestamp = new Date().toISOString();

    const anonymizedEvents = events.map(event => {
      if (event.userId === userId) {
        return {
          ...event,
          userId: redactedId,
          metadata: {
            ...event.metadata,
            anonymized: true,
            anonymizedAt: timestamp,
          },
        };
      }
      return event;
    });

    this.saveEvents(anonymizedEvents);
  }

  // ============================================================================
  // Private Helpers
  // ============================================================================

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for environments without crypto.randomUUID
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  private saveEvents(events: AuditEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save audit events:', error);
    }
  }

  // ============================================================================
  // INTENTIONAL: No delete method. Audit logs are immutable.
  // ============================================================================
  // Audit events are append-only for compliance and security.
  // The only mutation allowed is anonymizeUser() for GDPR compliance.
  // ============================================================================
}

// Singleton export
export const auditService = new AuditService();
