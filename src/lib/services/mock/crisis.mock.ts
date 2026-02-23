/**
 * Mock Crisis Response Service
 * Aviation disruption forecasting and global extraction protocols
 */

import { BaseMockService } from './base.mock';
import type { ICrisisService } from '../interfaces/ICrisisService';
import type {
  AviationDisruption,
  ExtractionProtocol,
  SafeHouse,
  EmergencyContact,
  CrisisStatus,
} from '@/lib/types';

const DISRUPTIONS_KEY = 'crisis_disruptions';
const PROTOCOLS_KEY = 'crisis_protocols';
const SAFE_HOUSES_KEY = 'crisis_safe_houses';
const CONTACTS_KEY = 'crisis_contacts';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export class MockCrisisService extends BaseMockService implements ICrisisService {
  constructor() {
    super();
    if (this.isClient) {
      this.seedIfEmpty();
    }
  }

  private seedIfEmpty(): void {
    if (this.getFromStorage(DISRUPTIONS_KEY).length > 0) return;

    const disruptions: AviationDisruption[] = [
      {
        id: 'crisis-001',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'Weather',
        title: 'Volcanic Ash Cloud over North Atlantic',
        description: 'Eyjafjallajökull-type volcanic activity detected near Iceland. Ash cloud trajectory models indicate potential disruption to North Atlantic air corridors within 48-72 hours.',
        affectedRegions: ['Northern Europe', 'North Atlantic'],
        affectedAirports: ['LHR', 'CDG', 'ZRH', 'AMS', 'FRA'],
        affectedClients: ['user-uhni-001', 'user-uhni-003'],
        threatLevel: 'High',
        probabilityPercent: 73,
        estimatedImpactHours: 96,
        forecastSource: 'EUROCONTROL Volcanic Ash Advisory',
        status: 'Active',
        startedAt: '2026-02-19T06:00:00Z',
        createdAt: '2026-02-18T22:00:00Z',
        updatedAt: '2026-02-20T08:00:00Z',
      },
      {
        id: 'crisis-002',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'Strike',
        title: 'Air Traffic Controller Strike — France',
        description: 'French DGAC controllers have announced a 72-hour strike starting March 1. All French airspace transit will be severely impacted.',
        affectedRegions: ['France', 'Western Europe'],
        affectedAirports: ['CDG', 'NCE', 'LYS', 'MRS'],
        affectedClients: ['user-uhni-005'],
        threatLevel: 'Elevated',
        probabilityPercent: 92,
        estimatedImpactHours: 72,
        forecastSource: 'DGAC Official Notice',
        status: 'Monitoring',
        createdAt: '2026-02-17T14:00:00Z',
        updatedAt: '2026-02-20T06:00:00Z',
      },
      {
        id: 'crisis-003',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'Geopolitical',
        title: 'Geopolitical Escalation — Eastern Mediterranean',
        description: 'Heightened military activity in eastern Mediterranean. Commercial aviation advisories issued for overflights of contested zones.',
        affectedRegions: ['Eastern Mediterranean', 'Middle East'],
        affectedAirports: ['IST', 'AYT', 'LCA'],
        affectedClients: [],
        threatLevel: 'Moderate',
        probabilityPercent: 45,
        estimatedImpactHours: 168,
        forecastSource: 'NATO NOTAM Advisory',
        status: 'Monitoring',
        createdAt: '2026-02-15T10:00:00Z',
        updatedAt: '2026-02-19T16:00:00Z',
      },
      {
        id: 'crisis-004',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'Infrastructure',
        title: 'Dubai Airport Runway Closure',
        description: 'DXB Runway 12L/30R closed for emergency maintenance after FOD incident. Reduced capacity expected for 24 hours.',
        affectedRegions: ['UAE', 'Gulf'],
        affectedAirports: ['DXB'],
        affectedClients: ['user-uhni-002'],
        threatLevel: 'Low',
        probabilityPercent: 100,
        estimatedImpactHours: 24,
        forecastSource: 'GCAA NOTAM',
        status: 'Resolved',
        startedAt: '2026-02-16T02:00:00Z',
        resolvedAt: '2026-02-17T02:00:00Z',
        createdAt: '2026-02-16T01:00:00Z',
        updatedAt: '2026-02-17T02:00:00Z',
      },
      {
        id: 'crisis-005',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'Health',
        title: 'H5N1 Aviation Advisory — Southeast Asia',
        description: 'WHO elevated advisory for avian influenza affecting poultry in SE Asia. Enhanced health screening at arrival airports. No travel ban but monitoring closely.',
        affectedRegions: ['Southeast Asia'],
        affectedAirports: ['SIN', 'BKK', 'KUL'],
        affectedClients: ['user-uhni-003'],
        threatLevel: 'Low',
        probabilityPercent: 15,
        estimatedImpactHours: 720,
        forecastSource: 'WHO Health Advisory',
        status: 'Monitoring',
        createdAt: '2026-02-10T08:00:00Z',
        updatedAt: '2026-02-18T12:00:00Z',
      },
    ];

    const protocols: ExtractionProtocol[] = [
      {
        id: 'proto-001',
        institutionId: MOCK_INSTITUTION_ID,
        clientId: 'user-uhni-003',
        clientName: 'Isabella von Habsburg',
        priority: 'Urgent',
        status: 'Standby',
        currentLocation: 'London, UK',
        destinationLocation: 'Zurich, Switzerland',
        crisisId: 'crisis-001',
        steps: [
          { id: 'step-001', order: 1, title: 'Alert local security liaison', description: 'Contact Kroll London desk and brief on situation', status: 'pending', estimatedDurationMinutes: 15 },
          { id: 'step-002', order: 2, title: 'Arrange ground transport', description: 'Secure armored vehicle transfer to Farnborough Airport', status: 'pending', estimatedDurationMinutes: 45 },
          { id: 'step-003', order: 3, title: 'Secure private aviation', description: 'Activate NetJets standby fleet — Farnborough to Zurich direct', status: 'pending', estimatedDurationMinutes: 120 },
          { id: 'step-004', order: 4, title: 'Confirm safe house arrival', description: 'Verify arrival at Baur au Lac secure suite, Zurich', status: 'pending', estimatedDurationMinutes: 30 },
        ],
        safeHouses: [],
        emergencyContacts: [],
        timeline: [
          { id: 'tl-001', timestamp: '2026-02-19T06:30:00Z', event: 'Protocol created based on volcanic ash advisory', type: 'info' },
          { id: 'tl-002', timestamp: '2026-02-19T07:00:00Z', event: 'Client notified via secure channel', type: 'action' },
        ],
        createdAt: '2026-02-19T06:30:00Z',
        updatedAt: '2026-02-20T08:00:00Z',
      },
      {
        id: 'proto-002',
        institutionId: MOCK_INSTITUTION_ID,
        clientId: 'user-uhni-002',
        clientName: 'Marcus Pemberton-Shaw',
        priority: 'Emergency',
        status: 'Completed',
        currentLocation: 'Dubai, UAE',
        destinationLocation: 'London, UK',
        crisisId: 'crisis-004',
        steps: [
          { id: 'step-005', order: 1, title: 'Contact Emirates VIP liaison', description: 'Coordinate priority rebooking via CIP terminal', status: 'completed', estimatedDurationMinutes: 20, completedAt: '2026-02-16T03:00:00Z' },
          { id: 'step-006', order: 2, title: 'Arrange alternative routing', description: 'Book Abu Dhabi to London via Etihad First', status: 'completed', estimatedDurationMinutes: 60, completedAt: '2026-02-16T04:30:00Z' },
          { id: 'step-007', order: 3, title: 'Ground transport to Abu Dhabi', description: 'Luxury sedan transfer DXB to AUH (90 min)', status: 'completed', estimatedDurationMinutes: 90, completedAt: '2026-02-16T06:00:00Z' },
          { id: 'step-008', order: 4, title: 'Confirm departure', description: 'Client departed Abu Dhabi on EY19 to London', status: 'completed', estimatedDurationMinutes: 10, completedAt: '2026-02-16T08:00:00Z' },
        ],
        safeHouses: [],
        emergencyContacts: [],
        timeline: [
          { id: 'tl-003', timestamp: '2026-02-16T02:15:00Z', event: 'Runway closure detected — protocol auto-triggered', type: 'info' },
          { id: 'tl-004', timestamp: '2026-02-16T02:30:00Z', event: 'Protocol activated by RM duty officer', type: 'action' },
          { id: 'tl-005', timestamp: '2026-02-16T04:30:00Z', event: 'Alternative routing confirmed via Abu Dhabi', type: 'action' },
          { id: 'tl-006', timestamp: '2026-02-16T08:00:00Z', event: 'Client safely departed — protocol complete', type: 'resolution' },
        ],
        activatedBy: 'b2b-rm-001-uuid-placeholder',
        activatedAt: '2026-02-16T02:30:00Z',
        completedAt: '2026-02-16T08:00:00Z',
        createdAt: '2026-02-16T02:15:00Z',
        updatedAt: '2026-02-16T08:00:00Z',
      },
      {
        id: 'proto-003',
        institutionId: MOCK_INSTITUTION_ID,
        clientId: 'user-uhni-005',
        clientName: 'Elena Volkov',
        priority: 'Routine',
        status: 'Standby',
        currentLocation: 'Paris, France',
        destinationLocation: 'London, UK',
        crisisId: 'crisis-002',
        steps: [
          { id: 'step-009', order: 1, title: 'Monitor strike developments', description: 'Track DGAC announcements for confirmation', status: 'pending', estimatedDurationMinutes: 30 },
          { id: 'step-010', order: 2, title: 'Pre-book Eurostar alternative', description: 'Reserve First Class Eurostar Paris-London for March 1-3', status: 'pending', estimatedDurationMinutes: 20 },
          { id: 'step-011', order: 3, title: 'Arrange car service if needed', description: 'Standby chauffeur for Calais ferry crossing backup', status: 'pending', estimatedDurationMinutes: 15 },
        ],
        safeHouses: [],
        emergencyContacts: [],
        timeline: [
          { id: 'tl-007', timestamp: '2026-02-17T14:30:00Z', event: 'Strike advisory detected — routine protocol created', type: 'info' },
        ],
        createdAt: '2026-02-17T14:30:00Z',
        updatedAt: '2026-02-20T06:00:00Z',
      },
    ];

    const safeHouses: SafeHouse[] = [
      { id: 'sh-001', name: 'The Dorchester — Secure Suite', city: 'London', country: 'United Kingdom', address: 'Park Lane, Mayfair W1K 1QA', contactName: 'James Whitfield', contactPhone: '+44 20 7629 8888', capacity: 4, securityLevel: 'Enhanced', availableNow: true, lastVerified: '2026-02-15T00:00:00Z' },
      { id: 'sh-002', name: 'Baur au Lac — Private Wing', city: 'Zurich', country: 'Switzerland', address: 'Talstrasse 1, 8001', contactName: 'Hans Mueller', contactPhone: '+41 44 220 5020', capacity: 6, securityLevel: 'Maximum', availableNow: true, lastVerified: '2026-02-18T00:00:00Z' },
      { id: 'sh-003', name: 'Aman Tokyo — Discreet Suite', city: 'Tokyo', country: 'Japan', address: 'Otemachi Tower, 1-5-6 Otemachi', contactName: 'Yuki Tanaka', contactPhone: '+81 3 5224 3333', capacity: 3, securityLevel: 'Enhanced', availableNow: true, lastVerified: '2026-02-12T00:00:00Z' },
      { id: 'sh-004', name: 'Four Seasons — Private Residence', city: 'Dubai', country: 'UAE', address: 'Jumeirah Beach Road', contactName: 'Ahmed Al-Rashid', contactPhone: '+971 4 270 7777', capacity: 8, securityLevel: 'Maximum', availableNow: true, lastVerified: '2026-02-19T00:00:00Z' },
      { id: 'sh-005', name: 'The Peninsula — Executive Suite', city: 'Hong Kong', country: 'China', address: 'Salisbury Road, Tsim Sha Tsui', contactName: 'David Chen', contactPhone: '+852 2920 2888', capacity: 4, securityLevel: 'Enhanced', availableNow: false, lastVerified: '2026-02-10T00:00:00Z' },
      { id: 'sh-006', name: 'Ritz Paris — Coco Chanel Suite', city: 'Paris', country: 'France', address: '15 Place Vendôme', contactName: 'Pierre Dubois', contactPhone: '+33 1 43 16 30 30', capacity: 3, securityLevel: 'Standard', availableNow: true, lastVerified: '2026-02-17T00:00:00Z' },
    ];

    const contacts: EmergencyContact[] = [
      { id: 'ec-001', name: 'James Whitfield', role: 'Head of Security Operations', phone: '+44 7700 900100', email: 'j.whitfield@kroll.com', region: 'Europe', available24h: true },
      { id: 'ec-002', name: 'Dr. Elena Voss', role: 'Medical Evacuation Director', phone: '+41 79 555 0100', email: 'e.voss@internationalsos.com', region: 'Global', available24h: true },
      { id: 'ec-003', name: 'Ahmed Al-Rashid', role: 'Gulf Region Security Liaison', phone: '+971 50 555 0200', email: 'a.alrashid@securitas.ae', region: 'Middle East', available24h: true },
      { id: 'ec-004', name: 'Yuki Tanaka', role: 'Asia-Pacific Coordinator', phone: '+81 80 5555 0300', region: 'Asia-Pacific', available24h: true },
      { id: 'ec-005', name: 'Pierre Dubois', role: 'French Embassy Liaison', phone: '+33 6 55 55 0400', email: 'p.dubois@consulaire.fr', region: 'France', available24h: false },
      { id: 'ec-006', name: 'Sarah Chen', role: 'Aviation Disruption Specialist', phone: '+44 7700 900500', email: 's.chen@netjets.com', region: 'Global', available24h: true },
      { id: 'ec-007', name: 'Marcus Thompson', role: 'Legal Emergency Response', phone: '+44 20 7597 6000', email: 'm.thompson@withersworldwide.com', region: 'Global', available24h: false },
      { id: 'ec-008', name: 'Dr. Hans Berger', role: 'Psychiatric Crisis Support', phone: '+41 44 255 1111', region: 'Europe', available24h: true },
    ];

    this.setInStorage(DISRUPTIONS_KEY, disruptions);
    this.setInStorage(PROTOCOLS_KEY, protocols);
    this.setInStorage(SAFE_HOUSES_KEY, safeHouses);
    this.setInStorage(CONTACTS_KEY, contacts);
  }

  async getDisruptions(institutionId: string): Promise<AviationDisruption[]> {
    await this.delay();
    return this.getFromStorage<AviationDisruption>(DISRUPTIONS_KEY)
      .filter(d => d.institutionId === institutionId);
  }

  async getActiveDisruptions(institutionId: string): Promise<AviationDisruption[]> {
    await this.delay();
    return this.getFromStorage<AviationDisruption>(DISRUPTIONS_KEY)
      .filter(d => d.institutionId === institutionId && ['Active', 'Escalated', 'Monitoring'].includes(d.status));
  }

  async getDisruptionById(id: string): Promise<AviationDisruption | null> {
    await this.delay();
    return this.getFromStorage<AviationDisruption>(DISRUPTIONS_KEY).find(d => d.id === id) || null;
  }

  async updateDisruptionStatus(id: string, status: CrisisStatus): Promise<AviationDisruption> {
    await this.delay();
    const items = this.getFromStorage<AviationDisruption>(DISRUPTIONS_KEY);
    const item = items.find(d => d.id === id);
    if (!item) throw new Error('Disruption not found');
    item.status = status;
    item.updatedAt = this.now();
    if (status === 'Resolved') item.resolvedAt = this.now();
    this.setInStorage(DISRUPTIONS_KEY, items);
    return item;
  }

  async getProtocols(institutionId: string): Promise<ExtractionProtocol[]> {
    await this.delay();
    return this.getFromStorage<ExtractionProtocol>(PROTOCOLS_KEY)
      .filter(p => p.institutionId === institutionId);
  }

  async getProtocolById(id: string): Promise<ExtractionProtocol | null> {
    await this.delay();
    return this.getFromStorage<ExtractionProtocol>(PROTOCOLS_KEY).find(p => p.id === id) || null;
  }

  async activateProtocol(id: string, activatedBy: string): Promise<ExtractionProtocol> {
    await this.delay();
    const items = this.getFromStorage<ExtractionProtocol>(PROTOCOLS_KEY);
    const item = items.find(p => p.id === id);
    if (!item) throw new Error('Protocol not found');
    item.status = 'Activated';
    item.activatedBy = activatedBy;
    item.activatedAt = this.now();
    item.updatedAt = this.now();
    item.timeline.push({
      id: this.generateId(),
      timestamp: this.now(),
      event: 'Protocol activated',
      type: 'action',
      actor: activatedBy,
    });
    this.setInStorage(PROTOCOLS_KEY, items);
    return item;
  }

  async updateStepStatus(protocolId: string, stepId: string, status: 'in_progress' | 'completed' | 'skipped'): Promise<ExtractionProtocol> {
    await this.delay();
    const items = this.getFromStorage<ExtractionProtocol>(PROTOCOLS_KEY);
    const item = items.find(p => p.id === protocolId);
    if (!item) throw new Error('Protocol not found');
    const step = item.steps.find(s => s.id === stepId);
    if (!step) throw new Error('Step not found');
    step.status = status;
    if (status === 'completed') step.completedAt = this.now();
    item.updatedAt = this.now();
    this.setInStorage(PROTOCOLS_KEY, items);
    return item;
  }

  async getSafeHouses(region?: string): Promise<SafeHouse[]> {
    await this.delay();
    const houses = this.getFromStorage<SafeHouse>(SAFE_HOUSES_KEY);
    if (region) return houses.filter(h => h.country.toLowerCase().includes(region.toLowerCase()));
    return houses;
  }

  async getEmergencyContacts(region?: string): Promise<EmergencyContact[]> {
    await this.delay();
    const contacts = this.getFromStorage<EmergencyContact>(CONTACTS_KEY);
    if (region) return contacts.filter(c => c.region.toLowerCase().includes(region.toLowerCase()));
    return contacts;
  }
}
