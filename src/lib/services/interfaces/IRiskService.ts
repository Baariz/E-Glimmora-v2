/**
 * Risk Service Interface
 * Manages compliance risk assessments and scoring
 */

import { RiskRecord, GeopoliticalRisk, TravelAdvisory, InsuranceLog } from '@/lib/types';

export interface IRiskService {
  getRiskRecords(institutionId: string): Promise<RiskRecord[]>;
  getRiskByUser(userId: string): Promise<RiskRecord | null>;
  createRiskRecord(data: Partial<RiskRecord>): Promise<RiskRecord>;
  updateRiskRecord(id: string, data: Partial<RiskRecord>): Promise<RiskRecord>;

  // Geopolitical & Travel Risk
  getGeopoliticalRisks(): Promise<GeopoliticalRisk[]>;
  getTravelAdvisories(): Promise<TravelAdvisory[]>;

  // Insurance Management
  getInsuranceLogs(clientId?: string): Promise<InsuranceLog[]>;
  createInsuranceLog(data: Partial<InsuranceLog>): Promise<InsuranceLog>;

  // Compliance Flags
  flagComplianceIssue(clientId: string, flag: string): Promise<void>;
}
