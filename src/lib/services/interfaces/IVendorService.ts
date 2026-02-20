/**
 * Vendor Governance Service Interface
 * Financial/security screening and performance scorecards
 */

import type {
  Vendor,
  VendorScreening,
  VendorScorecard,
  VendorAlert,
  VendorStatus,
} from '@/lib/types';

export interface IVendorService {
  // Vendors
  getVendors(institutionId: string): Promise<Vendor[]>;
  getVendorById(id: string): Promise<Vendor | null>;
  updateVendorStatus(id: string, status: VendorStatus): Promise<Vendor>;

  // Screening
  getScreenings(institutionId: string): Promise<VendorScreening[]>;
  getScreeningByVendor(vendorId: string): Promise<VendorScreening | null>;

  // Scorecards
  getScorecards(institutionId: string, period?: string): Promise<VendorScorecard[]>;
  getScorecardsByVendor(vendorId: string): Promise<VendorScorecard[]>;

  // Alerts
  getVendorAlerts(institutionId: string): Promise<VendorAlert[]>;
  acknowledgeVendorAlert(alertId: string): Promise<void>;
}
