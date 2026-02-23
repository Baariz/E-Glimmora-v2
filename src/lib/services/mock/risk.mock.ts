/**
 * Mock Risk Service
 * localStorage-based risk record management
 */

import { BaseMockService } from './base.mock';
import { IRiskService } from '../interfaces/IRiskService';
import { RiskRecord, RiskCategory, GeopoliticalRisk, TravelAdvisory, InsuranceLog } from '@/lib/types';

export class MockRiskService extends BaseMockService implements IRiskService {
  private readonly STORAGE_KEY = 'risk_records';
  private readonly GEO_RISKS_KEY = 'geopolitical_risks';
  private readonly ADVISORIES_KEY = 'travel_advisories';
  private readonly INSURANCE_KEY = 'insurance_logs';

  constructor() {
    super();
    if (this.isClient) {
      this.seedIfEmpty();
      this.seedGeopoliticalData();
      this.seedInsuranceData();
    }
  }

  /**
   * Seed initial mock data (idempotent)
   */
  private seedIfEmpty(): void {
    const existing = this.getFromStorage<RiskRecord>(this.STORAGE_KEY);
    if (existing.length > 0) {
      return; // Already seeded
    }

    const mockInstitutionId = 'inst-001-uuid-placeholder';
    const mockAssessorId = 'b2b-rm-001-uuid-placeholder';

    const seedRecords: RiskRecord[] = [
      {
        id: this.generateId(),
        userId: 'user-uhni-001',
        institutionId: mockInstitutionId,
        riskScore: 25,
        riskCategory: 'Low',
        flags: [],
        assessedBy: mockAssessorId,
        assessedAt: '2026-01-15T10:00:00Z',
        nextReviewDate: '2026-07-15T00:00:00Z',
        notes: 'Conservative profile, low exposure'
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-002',
        institutionId: mockInstitutionId,
        riskScore: 52,
        riskCategory: 'Medium',
        flags: ['multi-jurisdiction'],
        assessedBy: mockAssessorId,
        assessedAt: '2026-01-10T14:30:00Z',
        nextReviewDate: '2026-07-10T00:00:00Z',
        notes: 'Active in emerging markets'
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-003',
        institutionId: mockInstitutionId,
        riskScore: 78,
        riskCategory: 'High',
        flags: ['high-net-worth', 'complex-structures', 'multi-jurisdiction'],
        assessedBy: mockAssessorId,
        assessedAt: '2026-02-01T09:15:00Z',
        nextReviewDate: '2026-05-01T00:00:00Z',
        notes: 'Multiple holding companies, international exposure'
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-004',
        institutionId: mockInstitutionId,
        riskScore: 45,
        riskCategory: 'Medium',
        flags: [],
        assessedBy: mockAssessorId,
        assessedAt: '2026-02-16T11:00:00Z',
        nextReviewDate: '2026-08-16T00:00:00Z',
        notes: 'New client, initial assessment'
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-005',
        institutionId: mockInstitutionId,
        riskScore: 18,
        riskCategory: 'Low',
        flags: [],
        assessedBy: mockAssessorId,
        assessedAt: '2026-01-20T15:45:00Z',
        nextReviewDate: '2026-07-20T00:00:00Z',
        notes: 'Traditional portfolio, domestic focus'
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-006',
        institutionId: mockInstitutionId,
        riskScore: 92,
        riskCategory: 'Critical',
        flags: ['pep', 'high-net-worth', 'complex-structures', 'multi-jurisdiction'],
        assessedBy: mockAssessorId,
        assessedAt: '2026-02-10T13:00:00Z',
        nextReviewDate: '2026-04-10T00:00:00Z',
        notes: 'Enhanced due diligence required, quarterly review'
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-007',
        institutionId: mockInstitutionId,
        riskScore: 58,
        riskCategory: 'Medium',
        flags: ['multi-jurisdiction'],
        assessedBy: mockAssessorId,
        assessedAt: '2026-01-25T10:30:00Z',
        nextReviewDate: '2026-07-25T00:00:00Z',
        notes: 'Latin American holdings require monitoring'
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-008',
        institutionId: mockInstitutionId,
        riskScore: 22,
        riskCategory: 'Low',
        flags: [],
        assessedBy: mockAssessorId,
        assessedAt: '2025-11-01T09:00:00Z',
        nextReviewDate: '2026-05-01T00:00:00Z',
        notes: 'Account archived, final assessment'
      }
    ];

    this.setInStorage(this.STORAGE_KEY, seedRecords);
  }

  async getRiskRecords(institutionId: string): Promise<RiskRecord[]> {
    await this.delay();
    const records = this.getFromStorage<RiskRecord>(this.STORAGE_KEY);
    return records.filter(r => r.institutionId === institutionId);
  }

  async getRiskByUser(userId: string): Promise<RiskRecord | null> {
    await this.delay();
    const records = this.getFromStorage<RiskRecord>(this.STORAGE_KEY);
    return records.find(r => r.userId === userId) || null;
  }

  async createRiskRecord(data: Partial<RiskRecord>): Promise<RiskRecord> {
    await this.delay();

    const records = this.getFromStorage<RiskRecord>(this.STORAGE_KEY);
    const now = this.now();

    const record: RiskRecord = {
      id: this.generateId(),
      userId: data.userId!,
      institutionId: data.institutionId!,
      riskScore: data.riskScore || 0,
      riskCategory: data.riskCategory || 'Low',
      flags: data.flags || [],
      assessedBy: data.assessedBy!,
      assessedAt: now,
      nextReviewDate: data.nextReviewDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      notes: data.notes
    };

    records.push(record);
    this.setInStorage(this.STORAGE_KEY, records);

    return record;
  }

  async updateRiskRecord(id: string, data: Partial<RiskRecord>): Promise<RiskRecord> {
    await this.delay();

    const records = this.getFromStorage<RiskRecord>(this.STORAGE_KEY);
    const index = records.findIndex(r => r.id === id);

    if (index === -1) {
      throw new Error(`Risk record ${id} not found`);
    }

    const updated = {
      ...records[index],
      ...data
    } as RiskRecord;

    records[index] = updated;
    this.setInStorage(this.STORAGE_KEY, records);

    return updated;
  }

  /**
   * Get aggregated portfolio risk metrics for an institution
   */
  async getPortfolioRisk(institutionId: string): Promise<{
    totalClients: number;
    riskDistribution: Record<RiskCategory, number>;
    averageRiskScore: number;
    criticalCount: number;
  }> {
    await this.delay();

    const records = await this.getRiskRecords(institutionId);

    const distribution: Record<RiskCategory, number> = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };

    let totalScore = 0;
    records.forEach(r => {
      distribution[r.riskCategory]++;
      totalScore += r.riskScore;
    });

    return {
      totalClients: records.length,
      riskDistribution: distribution,
      averageRiskScore: records.length > 0 ? Math.round(totalScore / records.length) : 0,
      criticalCount: distribution.Critical
    };
  }

  // ============================================================================
  // Geopolitical & Travel Risk
  // ============================================================================

  /**
   * Seed geopolitical risk and travel advisory data (idempotent)
   */
  private seedGeopoliticalData(): void {
    const geoRisks = this.getFromStorage<GeopoliticalRisk>(this.GEO_RISKS_KEY);
    if (geoRisks.length > 0) return;

    const seedGeoRisks: GeopoliticalRisk[] = [
      {
        id: this.generateId(),
        region: 'Western Europe',
        country: 'Switzerland',
        threatLevel: 'Low',
        riskFactors: ['Stable political environment', 'Strong banking regulations'],
        lastUpdated: '2026-02-01T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'Middle East',
        country: 'UAE',
        threatLevel: 'Low',
        riskFactors: ['Business-friendly environment', 'Regional tensions monitored'],
        lastUpdated: '2026-02-01T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'West Africa',
        country: 'Nigeria',
        threatLevel: 'High',
        riskFactors: ['Political instability', 'Security concerns', 'Infrastructure challenges'],
        lastUpdated: '2026-02-10T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'Eastern Europe',
        country: 'Russia',
        threatLevel: 'Critical',
        riskFactors: ['Geopolitical tensions', 'Sanctions', 'Capital controls', 'Banking restrictions'],
        lastUpdated: '2026-02-14T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'South America',
        country: 'Brazil',
        threatLevel: 'Moderate',
        riskFactors: ['Economic volatility', 'Political changes', 'Currency fluctuations'],
        lastUpdated: '2026-02-05T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'East Asia',
        country: 'Japan',
        threatLevel: 'Low',
        riskFactors: ['Stable democracy', 'Strong financial system'],
        lastUpdated: '2026-02-01T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'North America',
        country: 'Mexico',
        threatLevel: 'Elevated',
        riskFactors: ['Regional security concerns', 'Corruption risks', 'Border areas require caution'],
        lastUpdated: '2026-02-08T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'Western Europe',
        country: 'United Kingdom',
        threatLevel: 'Low',
        riskFactors: ['Stable political environment', 'Robust regulatory framework'],
        lastUpdated: '2026-02-01T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'Western Europe',
        country: 'Monaco',
        threatLevel: 'Low',
        riskFactors: ['Tax haven', 'Stable governance', 'High security'],
        lastUpdated: '2026-02-01T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'Middle East',
        country: 'Turkey',
        threatLevel: 'Moderate',
        riskFactors: ['Economic challenges', 'Currency volatility', 'Regional tensions'],
        lastUpdated: '2026-02-06T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'South America',
        country: 'Colombia',
        threatLevel: 'High',
        riskFactors: ['Security concerns', 'Drug trade impact', 'Rural areas high risk'],
        lastUpdated: '2026-02-12T00:00:00Z'
      },
      {
        id: this.generateId(),
        region: 'Southeast Asia',
        country: 'Singapore',
        threatLevel: 'Low',
        riskFactors: ['Stable government', 'Strong financial hub', 'Low corruption'],
        lastUpdated: '2026-02-01T00:00:00Z'
      }
    ];

    this.setInStorage(this.GEO_RISKS_KEY, seedGeoRisks);

    const seedAdvisories: TravelAdvisory[] = [
      {
        id: this.generateId(),
        country: 'Russia',
        region: 'Eastern Europe',
        advisoryLevel: 'Critical',
        summary: 'Do not travel to Russia due to ongoing geopolitical tensions, arbitrary enforcement of local laws, limited flights, and the potential for terrorism. U.S. citizens residing or traveling in Russia should depart immediately.',
        effectiveDate: '2026-02-14T00:00:00Z'
      },
      {
        id: this.generateId(),
        country: 'Nigeria',
        region: 'West Africa',
        advisoryLevel: 'High',
        summary: 'Reconsider travel to Nigeria due to crime, terrorism, civil unrest, kidnapping, and maritime crime. Some areas have increased risk. Exercise extreme caution in northeastern regions.',
        effectiveDate: '2026-02-10T00:00:00Z'
      },
      {
        id: this.generateId(),
        country: 'Colombia',
        region: 'South America',
        advisoryLevel: 'High',
        summary: 'Exercise increased caution in Colombia due to civil unrest, crime, terrorism, and kidnapping. Some areas have high crime rates and are off-limits to U.S. government personnel.',
        effectiveDate: '2026-02-12T00:00:00Z'
      },
      {
        id: this.generateId(),
        country: 'Mexico',
        region: 'North America',
        advisoryLevel: 'Elevated',
        summary: 'Exercise increased caution in Mexico due to crime and kidnapping. Violent crime is widespread. Some areas pose heightened risks. Avoid traveling at night and off main highways.',
        effectiveDate: '2026-02-08T00:00:00Z'
      },
      {
        id: this.generateId(),
        country: 'Turkey',
        region: 'Middle East',
        advisoryLevel: 'Moderate',
        summary: 'Exercise increased caution when traveling to Turkey due to terrorism and arbitrary detentions. Some areas near the Syrian and Iraqi borders are at higher risk.',
        effectiveDate: '2026-02-06T00:00:00Z'
      },
      {
        id: this.generateId(),
        country: 'Brazil',
        region: 'South America',
        advisoryLevel: 'Moderate',
        summary: 'Exercise increased caution in Brazil due to crime. Some areas have higher crime rates. Avoid displaying signs of wealth and remain vigilant in tourist areas.',
        effectiveDate: '2026-02-05T00:00:00Z'
      }
    ];

    this.setInStorage(this.ADVISORIES_KEY, seedAdvisories);
  }

  async getGeopoliticalRisks(): Promise<GeopoliticalRisk[]> {
    await this.delay();
    return this.getFromStorage<GeopoliticalRisk>(this.GEO_RISKS_KEY);
  }

  async getTravelAdvisories(): Promise<TravelAdvisory[]> {
    await this.delay();
    return this.getFromStorage<TravelAdvisory>(this.ADVISORIES_KEY);
  }

  // ============================================================================
  // Insurance Management
  // ============================================================================

  /**
   * Seed insurance log data (idempotent)
   */
  private seedInsuranceData(): void {
    const logs = this.getFromStorage<InsuranceLog>(this.INSURANCE_KEY);
    if (logs.length > 0) return;

    const mockInstitutionId = 'inst-001-uuid-placeholder';
    const mockCreatedBy = 'b2b-rm-001-uuid-placeholder';

    const seedLogs: InsuranceLog[] = [
      {
        id: this.generateId(),
        clientId: 'user-uhni-001',
        institutionId: mockInstitutionId,
        type: 'Travel Insurance',
        provider: 'Zurich International',
        policyNumber: 'ZI-UHNI-2026-00145',
        coverage: 'Comprehensive travel, medical evacuation, trip cancellation - $5M coverage',
        validFrom: '2026-01-01T00:00:00Z',
        validUntil: '2027-01-01T00:00:00Z',
        notes: 'Annual renewal - covers worldwide travel excluding high-risk zones',
        createdBy: mockCreatedBy,
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z'
      },
      {
        id: this.generateId(),
        clientId: 'user-uhni-002',
        institutionId: mockInstitutionId,
        type: 'Health Coverage',
        provider: 'Aetna International',
        policyNumber: 'AET-ELITE-2026-08821',
        coverage: 'Elite health coverage including specialist care, global network - $10M coverage',
        validFrom: '2025-07-01T00:00:00Z',
        validUntil: '2026-07-01T00:00:00Z',
        notes: 'Includes family members, renewable every 12 months',
        createdBy: mockCreatedBy,
        createdAt: '2025-07-15T14:30:00Z',
        updatedAt: '2025-07-15T14:30:00Z'
      },
      {
        id: this.generateId(),
        clientId: 'user-uhni-003',
        institutionId: mockInstitutionId,
        type: 'Property Insurance',
        provider: 'Chubb Elite',
        policyNumber: 'CHB-PROP-2026-55432',
        coverage: 'Multi-residence property coverage - London, Monaco, NYC properties - $150M total',
        validFrom: '2026-01-01T00:00:00Z',
        validUntil: '2027-01-01T00:00:00Z',
        notes: 'Annual review scheduled for Q4 2026, includes art collection rider',
        createdBy: mockCreatedBy,
        createdAt: '2026-01-10T09:00:00Z',
        updatedAt: '2026-01-10T09:00:00Z'
      },
      {
        id: this.generateId(),
        clientId: 'user-uhni-006',
        institutionId: mockInstitutionId,
        type: 'Travel Insurance',
        provider: 'AIG Private Client',
        policyNumber: 'AIG-TRV-2026-12093',
        coverage: 'High-risk travel coverage including evacuation, ransom & kidnapping - $10M',
        validFrom: '2026-02-01T00:00:00Z',
        validUntil: '2027-02-01T00:00:00Z',
        notes: 'Enhanced due diligence approved - covers emerging markets and high-risk zones',
        createdBy: mockCreatedBy,
        createdAt: '2026-02-05T11:30:00Z',
        updatedAt: '2026-02-05T11:30:00Z'
      },
      {
        id: this.generateId(),
        clientId: 'user-uhni-007',
        institutionId: mockInstitutionId,
        type: 'Health Coverage',
        provider: 'Bupa Global',
        policyNumber: 'BUPA-GLB-2026-77245',
        coverage: 'Executive health coverage - international medical, mental health, preventative care',
        validFrom: '2026-01-15T00:00:00Z',
        validUntil: '2027-01-15T00:00:00Z',
        notes: 'Includes annual health screening at Mayo Clinic',
        createdBy: mockCreatedBy,
        createdAt: '2026-01-20T16:45:00Z',
        updatedAt: '2026-01-20T16:45:00Z'
      }
    ];

    this.setInStorage(this.INSURANCE_KEY, seedLogs);
  }

  async getInsuranceLogs(clientId?: string): Promise<InsuranceLog[]> {
    await this.delay();
    const logs = this.getFromStorage<InsuranceLog>(this.INSURANCE_KEY);
    return clientId ? logs.filter(l => l.clientId === clientId) : logs;
  }

  async createInsuranceLog(data: Partial<InsuranceLog>): Promise<InsuranceLog> {
    await this.delay();

    const logs = this.getFromStorage<InsuranceLog>(this.INSURANCE_KEY);
    const now = this.now();

    const log: InsuranceLog = {
      id: this.generateId(),
      clientId: data.clientId!,
      institutionId: data.institutionId!,
      type: data.type!,
      provider: data.provider!,
      policyNumber: data.policyNumber!,
      coverage: data.coverage!,
      validFrom: data.validFrom!,
      validUntil: data.validUntil!,
      notes: data.notes,
      createdBy: data.createdBy!,
      createdAt: now,
      updatedAt: now
    };

    logs.push(log);
    this.setInStorage(this.INSURANCE_KEY, logs);

    return log;
  }

  // ============================================================================
  // Compliance Flags
  // ============================================================================

  async flagComplianceIssue(clientId: string, flag: string): Promise<void> {
    await this.delay();

    const records = this.getFromStorage<RiskRecord>(this.STORAGE_KEY);
    const record = records.find(r => r.userId === clientId);

    if (record) {
      if (!record.flags.includes(flag)) {
        record.flags.push(flag);
        this.setInStorage(this.STORAGE_KEY, records);
      }
    }
  }
}
