/**
 * Vendor Governance Service Interface
 * Full CRUD + screening/scorecard/alerts + internal notes
 */

import type {
  Vendor,
  VendorScreening,
  VendorScorecard,
  VendorAlert,
  VendorNote,
  VendorStatus,
  VendorNoteType,
  VendorNotePriority,
} from '@/lib/types';

export interface VendorListQuery {
  institutionId?: string; // omit/empty → all institutions (SuperAdmin scope)
}

export interface CreateVendorInput {
  institutionId: string;
  name: string;
  category: Vendor['category'];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  headquartersCountry: string;
  operatingRegions: string[];
  contractValue: number;
  contractStart: string;
  contractEnd?: string;
  ndaSigned: boolean;
  ndaExpiresAt?: string;
}

export type UpdateVendorInput = Partial<Omit<CreateVendorInput, 'institutionId'>>;

export interface AddNoteInput {
  type: VendorNoteType;
  priority: VendorNotePriority;
  text: string;
}

export interface IVendorService {
  // Vendors
  getVendors(query?: VendorListQuery): Promise<Vendor[]>;
  getVendorById(id: string): Promise<Vendor | null>;
  createVendor(input: CreateVendorInput): Promise<Vendor>;
  updateVendor(id: string, input: UpdateVendorInput): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;
  updateVendorStatus(id: string, status: VendorStatus): Promise<Vendor>;

  // Screening
  getScreenings(institutionId: string): Promise<VendorScreening[]>;
  getScreeningByVendor(vendorId: string): Promise<VendorScreening | null>;
  getScreeningsByVendor(vendorId: string): Promise<VendorScreening[]>;
  runScreening(vendorId: string): Promise<VendorScreening>;

  // Scorecards
  getScorecards(institutionId: string, period?: string): Promise<VendorScorecard[]>;
  getScorecardsByVendor(vendorId: string): Promise<VendorScorecard[]>;

  // Alerts
  getVendorAlerts(institutionId: string): Promise<VendorAlert[]>;
  getAlertsByVendor(vendorId: string): Promise<VendorAlert[]>;
  acknowledgeVendorAlert(alertId: string): Promise<void>;

  // Notes / Communication
  getNotesByVendor(vendorId: string): Promise<VendorNote[]>;
  addNote(vendorId: string, input: AddNoteInput): Promise<VendorNote>;
  updateNote(vendorId: string, noteId: string, input: AddNoteInput): Promise<VendorNote>;
  deleteNote(vendorId: string, noteId: string): Promise<void>;
}
