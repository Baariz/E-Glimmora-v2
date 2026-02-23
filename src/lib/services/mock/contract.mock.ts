/**
 * Mock Contract Service
 * localStorage-based contract and revenue management
 */

import { BaseMockService } from './base.mock';
import { IContractService, UsageMetrics, SLAMetrics } from '../interfaces/IContractService';
import { Contract, RevenueRecord } from '@/lib/types';

export class MockContractService extends BaseMockService implements IContractService {
  private readonly CONTRACTS_KEY = 'contracts';
  private readonly REVENUE_KEY = 'revenue_records';

  constructor() {
    super();
    if (this.isClient) {
      this.seedIfEmpty();
    }
  }

  /**
   * Seed initial mock data (idempotent)
   */
  private seedIfEmpty(): void {
    const existingContracts = this.getFromStorage<Contract>(this.CONTRACTS_KEY);
    const existingRevenue = this.getFromStorage<RevenueRecord>(this.REVENUE_KEY);

    if (existingContracts.length > 0 || existingRevenue.length > 0) {
      return; // Already seeded
    }

    const mockInstitutionId = 'inst-001-uuid-placeholder';

    // Seed contracts
    const contracts: Contract[] = [
      {
        id: this.generateId(),
        institutionId: mockInstitutionId,
        tier: 'Platinum',
        annualFee: 500000,
        perUserFee: 5000,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2027-12-31T23:59:59Z',
        status: 'Active',
        signedBy: 'inst-admin-001',
        createdAt: '2023-11-15T14:30:00Z',
        updatedAt: '2023-11-15T14:30:00Z'
      },
      {
        id: this.generateId(),
        institutionId: 'inst-002-uuid-placeholder',
        tier: 'Gold',
        annualFee: 250000,
        perUserFee: 3500,
        startDate: '2025-06-01T00:00:00Z',
        endDate: '2026-05-31T23:59:59Z',
        status: 'Active',
        signedBy: 'inst-admin-002',
        createdAt: '2025-05-10T10:00:00Z',
        updatedAt: '2025-05-10T10:00:00Z'
      }
    ];

    this.setInStorage(this.CONTRACTS_KEY, contracts);

    // Seed revenue records (last 6 months)
    const revenueRecords: RevenueRecord[] = [
      {
        id: this.generateId(),
        institutionId: mockInstitutionId,
        contractId: contracts[0]!.id,
        amount: 125000,
        currency: 'USD',
        type: 'Subscription',
        period: '2026-Q1',
        paidAt: '2026-01-05T10:00:00Z',
        createdAt: '2025-12-20T14:00:00Z'
      },
      {
        id: this.generateId(),
        institutionId: mockInstitutionId,
        contractId: contracts[0]!.id,
        amount: 45000,
        currency: 'USD',
        type: 'Usage',
        period: '2026-01',
        paidAt: '2026-02-01T10:00:00Z',
        createdAt: '2026-01-31T14:00:00Z'
      },
      {
        id: this.generateId(),
        institutionId: mockInstitutionId,
        contractId: contracts[0]!.id,
        amount: 125000,
        currency: 'USD',
        type: 'Subscription',
        period: '2025-Q4',
        paidAt: '2025-10-05T10:00:00Z',
        createdAt: '2025-09-20T14:00:00Z'
      },
      {
        id: this.generateId(),
        institutionId: mockInstitutionId,
        contractId: contracts[0]!.id,
        amount: 38000,
        currency: 'USD',
        type: 'Usage',
        period: '2025-12',
        paidAt: '2026-01-01T10:00:00Z',
        createdAt: '2025-12-31T14:00:00Z'
      },
      {
        id: this.generateId(),
        institutionId: mockInstitutionId,
        contractId: contracts[0]!.id,
        amount: 42000,
        currency: 'USD',
        type: 'Usage',
        period: '2025-11',
        paidAt: '2025-12-01T10:00:00Z',
        createdAt: '2025-11-30T14:00:00Z'
      },
      {
        id: this.generateId(),
        institutionId: mockInstitutionId,
        contractId: contracts[0]!.id,
        amount: 125000,
        currency: 'USD',
        type: 'Subscription',
        period: '2025-Q3',
        paidAt: '2025-07-05T10:00:00Z',
        createdAt: '2025-06-20T14:00:00Z'
      },
      {
        id: this.generateId(),
        institutionId: mockInstitutionId,
        contractId: contracts[0]!.id,
        amount: 35000,
        currency: 'USD',
        type: 'Usage',
        period: '2025-09',
        paidAt: '2025-10-01T10:00:00Z',
        createdAt: '2025-09-30T14:00:00Z'
      }
    ];

    this.setInStorage(this.REVENUE_KEY, revenueRecords);
  }

  async getContracts(institutionId: string): Promise<Contract[]> {
    await this.delay();
    const contracts = this.getFromStorage<Contract>(this.CONTRACTS_KEY);
    return contracts.filter(c => c.institutionId === institutionId);
  }

  async getContractById(id: string): Promise<Contract | null> {
    await this.delay();
    const contracts = this.getFromStorage<Contract>(this.CONTRACTS_KEY);
    return contracts.find(c => c.id === id) || null;
  }

  async createContract(data: Partial<Contract>): Promise<Contract> {
    await this.delay();

    const contracts = this.getFromStorage<Contract>(this.CONTRACTS_KEY);
    const now = this.now();

    const contract: Contract = {
      id: this.generateId(),
      institutionId: data.institutionId!,
      tier: data.tier || 'Silver',
      annualFee: data.annualFee || 100000,
      perUserFee: data.perUserFee || 2000,
      startDate: data.startDate || now,
      endDate: data.endDate,
      status: data.status || 'Active',
      signedBy: data.signedBy!,
      createdAt: now,
      updatedAt: now
    };

    contracts.push(contract);
    this.setInStorage(this.CONTRACTS_KEY, contracts);

    return contract;
  }

  async getRevenueRecords(institutionId: string): Promise<RevenueRecord[]> {
    await this.delay();
    const records = this.getFromStorage<RevenueRecord>(this.REVENUE_KEY);
    return records.filter(r => r.institutionId === institutionId);
  }

  async getActiveLicenses(institutionId: string): Promise<Contract[]> {
    await this.delay();
    const contracts = this.getFromStorage<Contract>(this.CONTRACTS_KEY);
    return contracts.filter(c => c.institutionId === institutionId && c.status === 'Active');
  }

  async getUsageMetrics(institutionId: string): Promise<UsageMetrics> {
    await this.delay();
    // Mock usage data
    return {
      activeUsers: 247,
      totalUsers: 310,
      apiCalls: 12400,
      storageUsedMB: 890,
      storageCapacityMB: 5000,
      journeysCreated: 89,
    };
  }

  async getSLAMetrics(institutionId: string): Promise<SLAMetrics> {
    await this.delay();
    // Mock SLA data
    return {
      uptimePercent: 99.97,
      avgResponseMs: 120,
      incidentCount: 2,
      resolvedCount: 2,
      slaTarget: 99.9,
    };
  }
}
