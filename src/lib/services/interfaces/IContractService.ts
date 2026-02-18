/**
 * Contract Service Interface
 * Manages B2B contracts and revenue tracking
 */

import { Contract, RevenueRecord } from '@/lib/types';

export interface UsageMetrics {
  activeUsers: number;
  totalUsers: number;
  apiCalls: number;
  storageUsedMB: number;
  storageCapacityMB: number;
  journeysCreated: number;
}

export interface SLAMetrics {
  uptimePercent: number;
  avgResponseMs: number;
  incidentCount: number;
  resolvedCount: number;
  slaTarget: number;
}

export interface IContractService {
  getContracts(institutionId: string): Promise<Contract[]>;
  getContractById(id: string): Promise<Contract | null>;
  createContract(data: Partial<Contract>): Promise<Contract>;
  getRevenueRecords(institutionId: string): Promise<RevenueRecord[]>;
  getActiveLicenses(institutionId: string): Promise<Contract[]>;
  getUsageMetrics(institutionId: string): Promise<UsageMetrics>;
  getSLAMetrics(institutionId: string): Promise<SLAMetrics>;
}
