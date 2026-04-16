/**
 * Mock Vendor Governance Service
 * Full CRUD + screening/scorecard/alerts + internal notes (localStorage-backed)
 */

import { BaseMockService } from './base.mock';
import type {
  IVendorService,
  VendorListQuery,
  CreateVendorInput,
  UpdateVendorInput,
  AddNoteInput,
} from '../interfaces/IVendorService';
import type {
  Vendor,
  VendorScreening,
  VendorScorecard,
  VendorAlert,
  VendorNote,
  VendorStatus,
} from '@/lib/types';

const VENDORS_KEY = 'vendor_list';
const SCREENINGS_KEY = 'vendor_screenings';
const SCORECARDS_KEY = 'vendor_scorecards';
const ALERTS_KEY = 'vendor_alerts_list';
const NOTES_KEY = 'vendor_notes';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export class MockVendorService extends BaseMockService implements IVendorService {
  constructor() {
    super();
    if (this.isClient) {
      this.seedIfEmpty();
    }
  }

  private seedIfEmpty(): void {
    if (this.getFromStorage(VENDORS_KEY).length > 0) return;

    const vendors: Vendor[] = [
      {
        id: 'vendor-001', institutionId: MOCK_INSTITUTION_ID, name: 'NetJets Europe', category: 'Travel & Aviation', status: 'Active',
        contactName: 'Sarah Chen', contactEmail: 's.chen@netjets.com', contactPhone: '+44 20 7590 6000', website: 'https://netjets.com',
        headquartersCountry: 'United Kingdom', operatingRegions: ['Europe', 'Middle East', 'North Africa'],
        contractValue: 2400000, contractStart: '2025-01-01', contractEnd: '2027-12-31', ndaSigned: true, ndaExpiresAt: '2027-12-31',
        onboardedAt: '2024-09-15', createdAt: '2024-09-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'vendor-002', institutionId: MOCK_INSTITUTION_ID, name: 'Kroll Security International', category: 'Security', status: 'Active',
        contactName: 'James Whitfield', contactEmail: 'j.whitfield@kroll.com', contactPhone: '+44 20 7029 5000',
        headquartersCountry: 'United States', operatingRegions: ['Global'],
        contractValue: 850000, contractStart: '2025-03-01', contractEnd: '2027-02-28', ndaSigned: true, ndaExpiresAt: '2027-02-28',
        onboardedAt: '2025-02-01', createdAt: '2025-02-01T10:00:00Z', updatedAt: '2026-02-01T10:00:00Z',
      },
      {
        id: 'vendor-003', institutionId: MOCK_INSTITUTION_ID, name: 'Quintessentially', category: 'Concierge', status: 'Active',
        contactName: 'Ben Elliot', contactEmail: 'b.elliot@quintessentially.com', contactPhone: '+44 20 7022 7860',
        headquartersCountry: 'United Kingdom', operatingRegions: ['Global'],
        contractValue: 1200000, contractStart: '2025-06-01', contractEnd: '2027-05-31', ndaSigned: true, ndaExpiresAt: '2027-05-31',
        onboardedAt: '2025-05-01', createdAt: '2025-05-01T10:00:00Z', updatedAt: '2026-01-20T10:00:00Z',
      },
      {
        id: 'vendor-004', institutionId: MOCK_INSTITUTION_ID, name: 'Withers LLP', category: 'Legal', status: 'Active',
        contactName: 'Margaret Thompson', contactEmail: 'm.thompson@withersworldwide.com', contactPhone: '+44 20 7597 6000',
        headquartersCountry: 'United Kingdom', operatingRegions: ['Europe', 'Asia-Pacific', 'Americas'],
        contractValue: 1800000, contractStart: '2024-04-01', contractEnd: '2026-03-31', ndaSigned: true, ndaExpiresAt: '2026-03-31',
        onboardedAt: '2024-03-01', createdAt: '2024-03-01T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z',
      },
      {
        id: 'vendor-005', institutionId: MOCK_INSTITUTION_ID, name: 'International SOS', category: 'Medical', status: 'Active',
        contactName: 'Dr. Elena Voss', contactEmail: 'e.voss@internationalsos.com', contactPhone: '+41 22 785 6464',
        headquartersCountry: 'Singapore', operatingRegions: ['Global'],
        contractValue: 620000, contractStart: '2025-01-01', contractEnd: '2026-12-31', ndaSigned: true, ndaExpiresAt: '2026-12-31',
        onboardedAt: '2024-11-01', createdAt: '2024-11-01T10:00:00Z', updatedAt: '2026-01-05T10:00:00Z',
      },
      {
        id: 'vendor-006', institutionId: MOCK_INSTITUTION_ID, name: 'Mandarin Oriental Hotel Group', category: 'Hospitality', status: 'Under Review',
        contactName: 'Laurent Kleitman', contactEmail: 'l.kleitman@mohg.com', contactPhone: '+852 2895 9288',
        headquartersCountry: 'Hong Kong', operatingRegions: ['Asia-Pacific', 'Europe', 'Americas'],
        contractValue: 900000, contractStart: '2025-07-01', contractEnd: '2027-06-30', ndaSigned: true, ndaExpiresAt: '2027-06-30',
        onboardedAt: '2025-06-01', createdAt: '2025-06-01T10:00:00Z', updatedAt: '2026-02-18T10:00:00Z',
      },
      {
        id: 'vendor-007', institutionId: MOCK_INSTITUTION_ID, name: 'CYBR Shield', category: 'Technology', status: 'Suspended',
        contactName: 'Alex Morrison', contactEmail: 'a.morrison@cybrshield.io', contactPhone: '+1 415 555 0199',
        headquartersCountry: 'United States', operatingRegions: ['Global'],
        contractValue: 340000, contractStart: '2025-04-01', contractEnd: '2027-03-31', ndaSigned: true, ndaExpiresAt: '2027-03-31',
        onboardedAt: '2025-03-15', createdAt: '2025-03-15T10:00:00Z', updatedAt: '2026-02-12T10:00:00Z',
      },
      {
        id: 'vendor-008', institutionId: MOCK_INSTITUTION_ID, name: 'Art Basel Advisory Services', category: 'Concierge', status: 'Active',
        contactName: 'Marc Spiegler', contactEmail: 'm.spiegler@artbasel.com', contactPhone: '+41 58 206 3100',
        headquartersCountry: 'Switzerland', operatingRegions: ['Europe', 'Americas', 'Asia-Pacific'],
        contractValue: 280000, contractStart: '2025-09-01', contractEnd: '2026-08-31', ndaSigned: true, ndaExpiresAt: '2026-08-31',
        onboardedAt: '2025-08-15', createdAt: '2025-08-15T10:00:00Z', updatedAt: '2026-01-28T10:00:00Z',
      },
    ];

    const screenings: VendorScreening[] = [
      { id: 'screen-001', vendorId: 'vendor-001', vendorName: 'NetJets Europe', institutionId: MOCK_INSTITUTION_ID, financialHealthScore: 92, financialHealthDetails: { creditRating: 'AA', revenueStability: 94, debtRatio: 22, liquidityScore: 89, bankruptcyRisk: 'Negligible' }, securityAssessmentScore: 88, securityAssessmentDetails: { dataProtectionCompliance: true, encryptionStandards: 'AES-256', incidentHistory: 0, lastPenTestDate: '2025-11-15', certifications: ['IS-BAO Stage 3', 'Wyvern Wingman', 'ISO 27001'] }, overallScreeningStatus: 'Passed', screenedBy: 'Compliance Team', screenedAt: '2026-01-10T10:00:00Z', expiresAt: '2027-01-10T10:00:00Z' },
      { id: 'screen-002', vendorId: 'vendor-002', vendorName: 'Kroll Security International', institutionId: MOCK_INSTITUTION_ID, financialHealthScore: 88, financialHealthDetails: { creditRating: 'A+', revenueStability: 91, debtRatio: 28, liquidityScore: 85, bankruptcyRisk: 'Negligible' }, securityAssessmentScore: 96, securityAssessmentDetails: { dataProtectionCompliance: true, encryptionStandards: 'AES-256 + RSA-4096', incidentHistory: 0, lastPenTestDate: '2026-01-20', certifications: ['ISO 27001', 'SOC 2 Type II', 'ASIS PSP'] }, overallScreeningStatus: 'Passed', screenedBy: 'Compliance Team', screenedAt: '2026-02-01T10:00:00Z', expiresAt: '2027-02-01T10:00:00Z' },
      { id: 'screen-003', vendorId: 'vendor-003', vendorName: 'Quintessentially', institutionId: MOCK_INSTITUTION_ID, financialHealthScore: 79, financialHealthDetails: { creditRating: 'A-', revenueStability: 82, debtRatio: 35, liquidityScore: 74, bankruptcyRisk: 'Low' }, securityAssessmentScore: 72, securityAssessmentDetails: { dataProtectionCompliance: true, encryptionStandards: 'AES-256', incidentHistory: 1, lastPenTestDate: '2025-08-20', certifications: ['GDPR Certified', 'ISO 27001'] }, overallScreeningStatus: 'Passed', screenedBy: 'Compliance Team', screenedAt: '2025-11-15T10:00:00Z', expiresAt: '2026-11-15T10:00:00Z' },
      { id: 'screen-004', vendorId: 'vendor-004', vendorName: 'Withers LLP', institutionId: MOCK_INSTITUTION_ID, financialHealthScore: 95, financialHealthDetails: { creditRating: 'AA+', revenueStability: 97, debtRatio: 15, liquidityScore: 93, bankruptcyRisk: 'Negligible' }, securityAssessmentScore: 91, securityAssessmentDetails: { dataProtectionCompliance: true, encryptionStandards: 'AES-256', incidentHistory: 0, lastPenTestDate: '2025-12-10', certifications: ['SRA Compliance', 'ISO 27001', 'Cyber Essentials Plus'] }, overallScreeningStatus: 'Passed', screenedBy: 'Compliance Team', screenedAt: '2025-12-20T10:00:00Z', expiresAt: '2026-12-20T10:00:00Z' },
      { id: 'screen-005', vendorId: 'vendor-005', vendorName: 'International SOS', institutionId: MOCK_INSTITUTION_ID, financialHealthScore: 86, financialHealthDetails: { creditRating: 'A', revenueStability: 90, debtRatio: 30, liquidityScore: 82, bankruptcyRisk: 'Negligible' }, securityAssessmentScore: 84, securityAssessmentDetails: { dataProtectionCompliance: true, encryptionStandards: 'AES-256', incidentHistory: 0, lastPenTestDate: '2025-10-05', certifications: ['ISO 27001', 'HIPAA', 'ISO 9001'] }, overallScreeningStatus: 'Passed', screenedBy: 'Compliance Team', screenedAt: '2025-10-15T10:00:00Z', expiresAt: '2026-10-15T10:00:00Z' },
      { id: 'screen-006', vendorId: 'vendor-006', vendorName: 'Mandarin Oriental Hotel Group', institutionId: MOCK_INSTITUTION_ID, financialHealthScore: 74, financialHealthDetails: { creditRating: 'BBB+', revenueStability: 71, debtRatio: 42, liquidityScore: 68, bankruptcyRisk: 'Low' }, securityAssessmentScore: 70, securityAssessmentDetails: { dataProtectionCompliance: true, encryptionStandards: 'AES-128', incidentHistory: 2, lastPenTestDate: '2025-06-20', certifications: ['GDPR Certified'] }, overallScreeningStatus: 'In Progress', screenedBy: 'Compliance Team', screenedAt: '2026-02-15T10:00:00Z', expiresAt: '2027-02-15T10:00:00Z', notes: 'Under review due to recent cybersecurity incident at Hong Kong property' },
      { id: 'screen-007', vendorId: 'vendor-007', vendorName: 'CYBR Shield', institutionId: MOCK_INSTITUTION_ID, financialHealthScore: 52, financialHealthDetails: { creditRating: 'BB', revenueStability: 48, debtRatio: 58, liquidityScore: 45, bankruptcyRisk: 'Moderate' }, securityAssessmentScore: 38, securityAssessmentDetails: { dataProtectionCompliance: false, encryptionStandards: 'AES-256', incidentHistory: 3, lastPenTestDate: '2025-04-15', certifications: ['SOC 2 Type I'] }, overallScreeningStatus: 'Failed', screenedBy: 'Compliance Team', screenedAt: '2026-02-10T10:00:00Z', expiresAt: '2026-05-10T10:00:00Z', notes: 'Suspended following data breach affecting 3 client records. Security remediation required before reinstatement.' },
      { id: 'screen-008', vendorId: 'vendor-008', vendorName: 'Art Basel Advisory Services', institutionId: MOCK_INSTITUTION_ID, financialHealthScore: 81, financialHealthDetails: { creditRating: 'A-', revenueStability: 78, debtRatio: 25, liquidityScore: 80, bankruptcyRisk: 'Negligible' }, securityAssessmentScore: 75, securityAssessmentDetails: { dataProtectionCompliance: true, encryptionStandards: 'AES-256', incidentHistory: 0, certifications: ['GDPR Certified'] }, overallScreeningStatus: 'Passed', screenedBy: 'Compliance Team', screenedAt: '2025-09-20T10:00:00Z', expiresAt: '2026-09-20T10:00:00Z' },
    ];

    const scorecards: VendorScorecard[] = vendors.filter(v => v.status === 'Active').flatMap(v => [
      { id: `sc-${v.id}-q4`, vendorId: v.id, vendorName: v.name, institutionId: MOCK_INSTITUTION_ID, period: '2025-Q4', overallRating: 'Good' as const, overallScore: 84, metrics: [ { category: 'Response Time', score: 88, weight: 0.25, target: 85 }, { category: 'Quality', score: 82, weight: 0.30, target: 80 }, { category: 'SLA Compliance', score: 90, weight: 0.25, target: 95 }, { category: 'Client Satisfaction', score: 78, weight: 0.20, target: 85 } ], slaCompliance: 90, qualityRating: 82, responseTime: 3.2, clientSatisfaction: 78, incidentCount: 1, reviewedBy: 'Compliance Team', reviewedAt: '2026-01-15T10:00:00Z', createdAt: '2026-01-15T10:00:00Z' },
      { id: `sc-${v.id}-q1`, vendorId: v.id, vendorName: v.name, institutionId: MOCK_INSTITUTION_ID, period: '2026-Q1', overallRating: 'Good' as const, overallScore: 87, metrics: [ { category: 'Response Time', score: 90, weight: 0.25, target: 85 }, { category: 'Quality', score: 85, weight: 0.30, target: 80 }, { category: 'SLA Compliance', score: 92, weight: 0.25, target: 95 }, { category: 'Client Satisfaction', score: 82, weight: 0.20, target: 85 } ], slaCompliance: 92, qualityRating: 85, responseTime: 2.8, clientSatisfaction: 82, incidentCount: 0, reviewedBy: 'Compliance Team', reviewedAt: '2026-02-15T10:00:00Z', createdAt: '2026-02-15T10:00:00Z' },
    ]);

    const alerts: VendorAlert[] = [
      { id: 'va-001', vendorId: 'vendor-006', vendorName: 'Mandarin Oriental', institutionId: MOCK_INSTITUTION_ID, type: 'screening_expiry', severity: 'warning', title: 'Screening Under Review', message: 'Mandarin Oriental screening is in progress following cybersecurity incident. Action required within 30 days.', acknowledged: false, createdAt: '2026-02-15T10:00:00Z' },
      { id: 'va-002', vendorId: 'vendor-007', vendorName: 'CYBR Shield', institutionId: MOCK_INSTITUTION_ID, type: 'security_incident', severity: 'critical', title: 'Data Breach — Vendor Suspended', message: 'CYBR Shield experienced a data breach affecting 3 client records. Vendor suspended pending remediation.', acknowledged: true, createdAt: '2026-02-10T10:00:00Z' },
      { id: 'va-003', vendorId: 'vendor-004', vendorName: 'Withers LLP', institutionId: MOCK_INSTITUTION_ID, type: 'contract_expiry', severity: 'warning', title: 'Contract Expiring Soon', message: 'Withers LLP contract expires March 31, 2026. Renewal negotiations should begin immediately.', acknowledged: false, createdAt: '2026-02-05T10:00:00Z' },
      { id: 'va-004', vendorId: 'vendor-003', vendorName: 'Quintessentially', institutionId: MOCK_INSTITUTION_ID, type: 'sla_breach', severity: 'info', title: 'Minor SLA Miss', message: 'Quintessentially response time exceeded SLA threshold by 0.3 hours on 2 occasions in January.', acknowledged: true, createdAt: '2026-02-01T10:00:00Z' },
      { id: 'va-005', vendorId: 'vendor-005', vendorName: 'International SOS', institutionId: MOCK_INSTITUTION_ID, type: 'screening_expiry', severity: 'info', title: 'Screening Renewal Due', message: 'International SOS screening expires October 15, 2026. Schedule renewal for Q3.', acknowledged: false, createdAt: '2026-02-18T10:00:00Z' },
    ];

    this.setInStorage(VENDORS_KEY, vendors);
    this.setInStorage(SCREENINGS_KEY, screenings);
    this.setInStorage(SCORECARDS_KEY, scorecards);
    this.setInStorage(ALERTS_KEY, alerts);
    this.setInStorage(NOTES_KEY, [] as VendorNote[]);
  }

  async getVendors(query?: VendorListQuery): Promise<Vendor[]> {
    await this.delay();
    const all = this.getFromStorage<Vendor>(VENDORS_KEY);
    if (!query?.institutionId) return all;
    return all.filter(v => v.institutionId === query.institutionId);
  }

  async getVendorById(id: string): Promise<Vendor | null> {
    await this.delay();
    return this.getFromStorage<Vendor>(VENDORS_KEY).find(v => v.id === id) || null;
  }

  async createVendor(input: CreateVendorInput): Promise<Vendor> {
    await this.delay();
    const now = this.now();
    const vendor: Vendor = {
      id: this.generateId(),
      status: 'Under Review',
      onboardedAt: now,
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    const items = this.getFromStorage<Vendor>(VENDORS_KEY);
    items.push(vendor);
    this.setInStorage(VENDORS_KEY, items);
    return vendor;
  }

  async updateVendor(id: string, input: UpdateVendorInput): Promise<Vendor> {
    await this.delay();
    const items = this.getFromStorage<Vendor>(VENDORS_KEY);
    const existing = items.find(v => v.id === id);
    if (!existing) throw new Error('Vendor not found');
    const updated: Vendor = { ...existing, ...input, updatedAt: this.now() };
    const next = items.map(v => (v.id === id ? updated : v));
    this.setInStorage(VENDORS_KEY, next);
    return updated;
  }

  async deleteVendor(id: string): Promise<void> {
    await this.delay();
    const items = this.getFromStorage<Vendor>(VENDORS_KEY).filter(v => v.id !== id);
    this.setInStorage(VENDORS_KEY, items);
  }

  async updateVendorStatus(id: string, status: VendorStatus): Promise<Vendor> {
    await this.delay();
    const items = this.getFromStorage<Vendor>(VENDORS_KEY);
    const item = items.find(v => v.id === id);
    if (!item) throw new Error('Vendor not found');
    item.status = status;
    item.updatedAt = this.now();
    this.setInStorage(VENDORS_KEY, items);
    return item;
  }

  async getScreenings(institutionId: string): Promise<VendorScreening[]> {
    await this.delay();
    const all = this.getFromStorage<VendorScreening>(SCREENINGS_KEY);
    if (!institutionId) return all;
    return all.filter(s => s.institutionId === institutionId);
  }

  async getScreeningByVendor(vendorId: string): Promise<VendorScreening | null> {
    await this.delay();
    const list = this.getFromStorage<VendorScreening>(SCREENINGS_KEY).filter(s => s.vendorId === vendorId);
    list.sort((a, b) => b.screenedAt.localeCompare(a.screenedAt));
    return list[0] || null;
  }

  async getScreeningsByVendor(vendorId: string): Promise<VendorScreening[]> {
    await this.delay();
    return this.getFromStorage<VendorScreening>(SCREENINGS_KEY).filter(s => s.vendorId === vendorId);
  }

  async runScreening(vendorId: string): Promise<VendorScreening> {
    await this.delay(200);
    const vendor = await this.getVendorById(vendorId);
    if (!vendor) throw new Error('Vendor not found');
    const financial = Math.floor(Math.random() * 30) + 65;
    const security = Math.floor(Math.random() * 30) + 65;
    const screening: VendorScreening = {
      id: this.generateId(),
      vendorId,
      vendorName: vendor.name,
      institutionId: vendor.institutionId,
      financialHealthScore: financial,
      financialHealthDetails: { creditRating: financial >= 85 ? 'AA' : 'A', revenueStability: financial, debtRatio: 100 - financial, liquidityScore: financial, bankruptcyRisk: financial >= 80 ? 'Negligible' : 'Low' },
      securityAssessmentScore: security,
      securityAssessmentDetails: { dataProtectionCompliance: security >= 60, encryptionStandards: 'AES-256', incidentHistory: 0, certifications: ['ISO 27001'] },
      overallScreeningStatus: financial >= 70 && security >= 70 ? 'Passed' : 'Failed',
      screenedBy: 'Current User',
      screenedAt: this.now(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const items = this.getFromStorage<VendorScreening>(SCREENINGS_KEY);
    items.push(screening);
    this.setInStorage(SCREENINGS_KEY, items);
    return screening;
  }

  async getScorecards(institutionId: string, period?: string): Promise<VendorScorecard[]> {
    await this.delay();
    let cards = this.getFromStorage<VendorScorecard>(SCORECARDS_KEY);
    if (institutionId) cards = cards.filter(s => s.institutionId === institutionId);
    if (period) cards = cards.filter(s => s.period === period);
    return cards;
  }

  async getScorecardsByVendor(vendorId: string): Promise<VendorScorecard[]> {
    await this.delay();
    return this.getFromStorage<VendorScorecard>(SCORECARDS_KEY).filter(s => s.vendorId === vendorId);
  }

  async getVendorAlerts(institutionId: string): Promise<VendorAlert[]> {
    await this.delay();
    const all = this.getFromStorage<VendorAlert>(ALERTS_KEY);
    if (!institutionId) return all;
    return all.filter(a => a.institutionId === institutionId);
  }

  async getAlertsByVendor(vendorId: string): Promise<VendorAlert[]> {
    await this.delay();
    return this.getFromStorage<VendorAlert>(ALERTS_KEY).filter(a => a.vendorId === vendorId);
  }

  async acknowledgeVendorAlert(alertId: string): Promise<void> {
    await this.delay();
    const items = this.getFromStorage<VendorAlert>(ALERTS_KEY);
    const item = items.find(a => a.id === alertId);
    if (item) {
      item.acknowledged = true;
      this.setInStorage(ALERTS_KEY, items);
    }
  }

  async getNotesByVendor(vendorId: string): Promise<VendorNote[]> {
    await this.delay();
    return this.getFromStorage<VendorNote>(NOTES_KEY)
      .filter(n => n.vendorId === vendorId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async addNote(vendorId: string, input: AddNoteInput): Promise<VendorNote> {
    await this.delay();
    const vendor = await this.getVendorById(vendorId);
    if (!vendor) throw new Error('Vendor not found');
    const note: VendorNote = {
      id: this.generateId(),
      vendorId,
      institutionId: vendor.institutionId,
      authorId: 'current-user',
      authorName: 'Current User',
      type: input.type,
      priority: input.priority,
      text: input.text,
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    const notes = this.getFromStorage<VendorNote>(NOTES_KEY);
    notes.push(note);
    this.setInStorage(NOTES_KEY, notes);
    return note;
  }

  async updateNote(vendorId: string, noteId: string, input: AddNoteInput): Promise<VendorNote> {
    await this.delay();
    const notes = this.getFromStorage<VendorNote>(NOTES_KEY);
    const note = notes.find(n => n.id === noteId && n.vendorId === vendorId);
    if (!note) throw new Error('Note not found');
    note.type = input.type;
    note.priority = input.priority;
    note.text = input.text;
    note.updatedAt = this.now();
    this.setInStorage(NOTES_KEY, notes);
    return note;
  }

  async deleteNote(vendorId: string, noteId: string): Promise<void> {
    await this.delay();
    const notes = this.getFromStorage<VendorNote>(NOTES_KEY).filter(n => !(n.id === noteId && n.vendorId === vendorId));
    this.setInStorage(NOTES_KEY, notes);
  }
}
