/**
 * Crisis Response Service Interface
 * Aviation disruption forecasting and global extraction protocols
 */

import type {
  AviationDisruption,
  ExtractionProtocol,
  SafeHouse,
  EmergencyContact,
  CrisisStatus,
} from '@/lib/types';

export interface ICrisisService {
  // Aviation Disruptions
  getDisruptions(institutionId: string): Promise<AviationDisruption[]>;
  getActiveDisruptions(institutionId: string): Promise<AviationDisruption[]>;
  getDisruptionById(id: string): Promise<AviationDisruption | null>;
  updateDisruptionStatus(id: string, status: CrisisStatus): Promise<AviationDisruption>;

  // Extraction Protocols
  getProtocols(institutionId: string): Promise<ExtractionProtocol[]>;
  getProtocolById(id: string): Promise<ExtractionProtocol | null>;
  activateProtocol(id: string, activatedBy: string): Promise<ExtractionProtocol>;
  updateStepStatus(protocolId: string, stepId: string, status: 'in_progress' | 'completed' | 'skipped'): Promise<ExtractionProtocol>;

  // Safe Houses & Contacts
  getSafeHouses(region?: string): Promise<SafeHouse[]>;
  getEmergencyContacts(region?: string): Promise<EmergencyContact[]>;
}
