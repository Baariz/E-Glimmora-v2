/**
 * Mock Conflict Detection Service
 * Cross-UHNI conflict detection with privacy-safe labeling
 */

import { BaseMockService } from './base.mock';
import type { IConflictService, ConflictStats } from '../interfaces/IConflictService';
import type {
  ConflictAlert,
  ConflictResolution,
  ConflictMatrixEntry,
  ConflictSeverity,
  ConflictStatus,
  ConflictType,
} from '@/lib/types';

const ALERTS_KEY = 'conflict_alerts';
const RESOLUTIONS_KEY = 'conflict_resolutions';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export class MockConflictService extends BaseMockService implements IConflictService {
  constructor() {
    super();
    this.seedIfEmpty();
  }

  private seedIfEmpty(): void {
    if (this.getFromStorage(ALERTS_KEY).length > 0) return;

    const alerts: ConflictAlert[] = [
      {
        id: 'conf-001', institutionId: MOCK_INSTITUTION_ID, conflictType: 'venue', severity: 'High', status: 'Active',
        partyAClientId: 'user-uhni-001', partyBClientId: 'user-uhni-003',
        partyALabel: 'Client A (Bennett)', partyBLabel: 'Another Client (Ref: CF-7A3B)',
        title: "Venue Overlap: Claridge's Ballroom, March 15",
        description: "Two clients have reserved the same venue for private events on the same evening. Claridge's Ballroom, London, March 15, 2026. Recommend immediate rescheduling coordination.",
        detectedAt: '2026-02-18T09:00:00Z', venue: "Claridge's Ballroom, London", eventDate: '2026-03-15T19:00:00Z',
        recommendedActions: ['Contact Party A to discuss alternative dates', 'Offer Savoy Ballroom as alternative venue', 'Escalate to Senior RM if unresolved within 48h'],
        createdAt: '2026-02-18T09:00:00Z', updatedAt: '2026-02-18T09:00:00Z',
      },
      {
        id: 'conf-002', institutionId: MOCK_INSTITUTION_ID, conflictType: 'business', severity: 'Critical', status: 'Active',
        partyAClientId: 'user-uhni-002', partyBClientId: 'user-uhni-005',
        partyALabel: 'Client B (Pemberton-Shaw)', partyBLabel: 'Another Client (Ref: CF-9D2E)',
        title: 'Competing Acquisition Targets',
        description: 'Two UHNI clients are pursuing the same acquisition target (Mediterranean luxury resort group). Information barrier required immediately.',
        detectedAt: '2026-02-16T14:00:00Z',
        recommendedActions: ['Establish information barrier between client teams immediately', 'Notify Compliance Officer for oversight', 'Document all communications related to the acquisition', 'Ensure separate RM handling for each party'],
        createdAt: '2026-02-16T14:00:00Z', updatedAt: '2026-02-16T14:00:00Z',
      },
      {
        id: 'conf-003', institutionId: MOCK_INSTITUTION_ID, conflictType: 'relationship', severity: 'Medium', status: 'Acknowledged',
        partyAClientId: 'user-uhni-001', partyBClientId: 'user-uhni-004',
        partyALabel: 'Client A (Bennett)', partyBLabel: 'Another Client (Ref: CF-4F1C)',
        title: 'Shared Estate Planning Interests',
        description: 'Two clients connected by extended family ties have conflicting estate planning directives. Both reference overlapping property portfolios in Switzerland.',
        detectedAt: '2026-02-10T11:00:00Z',
        recommendedActions: ['Verify extent of property overlap', 'Engage separate legal counsel for each party', 'Schedule mediation if conflicting claims identified'],
        createdAt: '2026-02-10T11:00:00Z', updatedAt: '2026-02-12T09:00:00Z',
      },
      {
        id: 'conf-004', institutionId: MOCK_INSTITUTION_ID, conflictType: 'scheduling', severity: 'Low', status: 'Resolved',
        partyAClientId: 'user-uhni-002', partyBClientId: 'user-uhni-003',
        partyALabel: 'Client B (Pemberton-Shaw)', partyBLabel: 'Another Client (Ref: CF-7A3B)',
        title: 'Private Jet Charter Overlap, Apr 2',
        description: 'Two clients requested the same Gulfstream G700 charter on April 2 for Geneva-Nice route. Alternative aircraft sourced from VistaJet.',
        detectedAt: '2026-01-28T15:00:00Z',
        recommendedActions: ['Source alternative aircraft', 'Confirm with both parties'],
        resolvedBy: 'b2b-rm-001-uuid-placeholder', resolvedAt: '2026-01-29T10:00:00Z', resolutionNotes: 'VistaJet Global 7500 secured for Party B. Both parties confirmed.',
        createdAt: '2026-01-28T15:00:00Z', updatedAt: '2026-01-29T10:00:00Z',
      },
      {
        id: 'conf-005', institutionId: MOCK_INSTITUTION_ID, conflictType: 'social_circle', severity: 'Medium', status: 'Active',
        partyAClientId: 'user-uhni-004', partyBClientId: 'user-uhni-005',
        partyALabel: 'Client C (Mehta)', partyBLabel: 'Another Client (Ref: CF-9D2E)',
        title: 'Davos 2026 Event Seating Tension',
        description: 'Two clients with known personal tensions have been seated in adjacent positions at the Davos Leadership Dinner. Seating rearrangement recommended.',
        detectedAt: '2026-02-14T16:00:00Z', venue: 'Congress Centre, Davos', eventDate: '2026-05-20T19:00:00Z',
        recommendedActions: ['Contact event organizers to adjust seating', 'Ensure minimum 3-table separation', 'Brief security on potential tension points'],
        createdAt: '2026-02-14T16:00:00Z', updatedAt: '2026-02-14T16:00:00Z',
      },
      {
        id: 'conf-006', institutionId: MOCK_INSTITUTION_ID, conflictType: 'venue', severity: 'Low', status: 'Resolved',
        partyAClientId: 'user-uhni-003', partyBClientId: 'user-uhni-004',
        partyALabel: 'Another Client (Ref: CF-7A3B)', partyBLabel: 'Client C (Mehta)',
        title: 'Art Basel VIP Preview Overlap',
        description: 'Both clients scheduled private curator tours at the same time slot during Art Basel Miami. Staggered scheduling resolved.',
        detectedAt: '2026-01-20T10:00:00Z',
        recommendedActions: ['Stagger tour schedules by 2 hours'],
        resolvedBy: 'b2b-rm-001-uuid-placeholder', resolvedAt: '2026-01-21T14:00:00Z', resolutionNotes: 'Tours staggered: Party A at 10am, Party B at 2pm. Both confirmed.',
        createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-01-21T14:00:00Z',
      },
      {
        id: 'conf-007', institutionId: MOCK_INSTITUTION_ID, conflictType: 'business', severity: 'High', status: 'Acknowledged',
        partyAClientId: 'user-uhni-001', partyBClientId: 'user-uhni-005',
        partyALabel: 'Client A (Bennett)', partyBLabel: 'Another Client (Ref: CF-9D2E)',
        title: 'Competing Philanthropic Board Seats',
        description: 'Both clients have been nominated for the same board seat at a prominent London arts foundation. Potential reputational conflict.',
        detectedAt: '2026-02-08T09:00:00Z',
        recommendedActions: ['Inform both RMs of the situation', 'Advise clients on potential reputational implications', 'Suggest alternative board opportunities for one party'],
        createdAt: '2026-02-08T09:00:00Z', updatedAt: '2026-02-09T11:00:00Z',
      },
      {
        id: 'conf-008', institutionId: MOCK_INSTITUTION_ID, conflictType: 'scheduling', severity: 'Medium', status: 'Active',
        partyAClientId: 'user-uhni-002', partyBClientId: 'user-uhni-004',
        partyALabel: 'Client B (Pemberton-Shaw)', partyBLabel: 'Client C (Mehta)',
        title: 'Overlapping Monaco GP Hospitality',
        description: 'Both clients booked the same premium hospitality suite for the Monaco Grand Prix weekend. Only one suite available from provider.',
        detectedAt: '2026-02-19T10:00:00Z', venue: 'Fairmont Monte Carlo, Terrace Suite', eventDate: '2026-05-24T14:00:00Z',
        recommendedActions: ['Contact Fairmont for additional suite availability', 'Offer alternative premium suite at Hotel de Paris', 'Prioritize based on booking timestamp'],
        createdAt: '2026-02-19T10:00:00Z', updatedAt: '2026-02-19T10:00:00Z',
      },
    ];

    const resolutions: ConflictResolution[] = [
      { id: 'res-001', conflictId: 'conf-004', resolvedBy: 'b2b-rm-001-uuid-placeholder', action: 'Alternative Aircraft Sourced', notes: 'VistaJet Global 7500 secured for Party B at comparable rate. Both parties confirmed satisfaction.', createdAt: '2026-01-29T10:00:00Z' },
      { id: 'res-002', conflictId: 'conf-006', resolvedBy: 'b2b-rm-001-uuid-placeholder', action: 'Schedule Staggered', notes: 'Tours staggered by 4 hours. Both clients received upgraded curator experience as compensation.', createdAt: '2026-01-21T14:00:00Z' },
    ];

    this.setInStorage(ALERTS_KEY, alerts);
    this.setInStorage(RESOLUTIONS_KEY, resolutions);
  }

  async getConflictAlerts(institutionId: string, filters?: {
    severity?: ConflictSeverity;
    status?: ConflictStatus;
    type?: ConflictType;
  }): Promise<ConflictAlert[]> {
    await this.delay();
    let results = this.getFromStorage<ConflictAlert>(ALERTS_KEY)
      .filter(a => a.institutionId === institutionId);
    if (filters?.severity) results = results.filter(a => a.severity === filters.severity);
    if (filters?.status) results = results.filter(a => a.status === filters.status);
    if (filters?.type) results = results.filter(a => a.conflictType === filters.type);
    return results;
  }

  async getConflictById(id: string): Promise<ConflictAlert | null> {
    await this.delay();
    return this.getFromStorage<ConflictAlert>(ALERTS_KEY).find(a => a.id === id) || null;
  }

  async getConflictStats(institutionId: string): Promise<ConflictStats> {
    await this.delay();
    const alerts = this.getFromStorage<ConflictAlert>(ALERTS_KEY)
      .filter(a => a.institutionId === institutionId);

    const active = alerts.filter(a => a.status === 'Active' || a.status === 'Acknowledged');
    const resolved = alerts.filter(a => a.status === 'Resolved');

    const byType: Record<ConflictType, number> = {
      scheduling: 0, venue: 0, relationship: 0, business: 0, social_circle: 0,
    };
    alerts.forEach(a => { byType[a.conflictType]++; });

    return {
      totalActive: active.length,
      totalResolved: resolved.length,
      criticalCount: active.filter(a => a.severity === 'Critical').length,
      highCount: active.filter(a => a.severity === 'High').length,
      averageResolutionHours: 18.5,
      byType,
    };
  }

  async getConflictMatrix(institutionId: string): Promise<ConflictMatrixEntry[]> {
    await this.delay();
    const alerts = this.getFromStorage<ConflictAlert>(ALERTS_KEY)
      .filter(a => a.institutionId === institutionId);

    const clientMap = new Map<string, ConflictMatrixEntry>();
    const labels = ['Client Alpha', 'Client Beta', 'Client Gamma', 'Client Delta', 'Client Epsilon'];
    let labelIdx = 0;

    const getEntry = (clientId: string): ConflictMatrixEntry => {
      if (!clientMap.has(clientId)) {
        clientMap.set(clientId, {
          clientId,
          clientLabel: labels[labelIdx++ % labels.length] ?? 'Client Unknown',
          conflictCount: 0,
          highSeverityCount: 0,
          activeConflicts: 0,
        });
      }
      return clientMap.get(clientId)!;
    };

    alerts.forEach(a => {
      const entryA = getEntry(a.partyAClientId);
      const entryB = getEntry(a.partyBClientId);
      entryA.conflictCount++;
      entryB.conflictCount++;
      if (a.severity === 'High' || a.severity === 'Critical') {
        entryA.highSeverityCount++;
        entryB.highSeverityCount++;
      }
      if (a.status === 'Active' || a.status === 'Acknowledged') {
        entryA.activeConflicts++;
        entryB.activeConflicts++;
      }
    });

    return Array.from(clientMap.values());
  }

  async resolveConflict(conflictId: string, data: {
    resolvedBy: string;
    action: string;
    notes: string;
  }): Promise<ConflictAlert> {
    await this.delay();
    const alerts = this.getFromStorage<ConflictAlert>(ALERTS_KEY);
    const alert = alerts.find(a => a.id === conflictId);
    if (!alert) throw new Error('Conflict not found');
    alert.status = 'Resolved';
    alert.resolvedBy = data.resolvedBy;
    alert.resolvedAt = this.now();
    alert.resolutionNotes = data.notes;
    alert.updatedAt = this.now();
    this.setInStorage(ALERTS_KEY, alerts);

    const resolutions = this.getFromStorage<ConflictResolution>(RESOLUTIONS_KEY);
    resolutions.push({
      id: this.generateId(),
      conflictId,
      resolvedBy: data.resolvedBy,
      action: data.action,
      notes: data.notes,
      createdAt: this.now(),
    });
    this.setInStorage(RESOLUTIONS_KEY, resolutions);
    return alert;
  }

  async acknowledgeConflict(conflictId: string, userId: string): Promise<ConflictAlert> {
    await this.delay();
    const alerts = this.getFromStorage<ConflictAlert>(ALERTS_KEY);
    const found = alerts.find(a => a.id === conflictId);
    if (!found) throw new Error('Conflict not found');
    found.status = 'Acknowledged';
    found.updatedAt = this.now();
    this.setInStorage(ALERTS_KEY, alerts);
    return found;
  }

  async getResolutionHistory(conflictId: string): Promise<ConflictResolution[]> {
    await this.delay();
    return this.getFromStorage<ConflictResolution>(RESOLUTIONS_KEY)
      .filter(r => r.conflictId === conflictId);
  }
}
