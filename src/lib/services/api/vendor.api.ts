/**
 * Real API Vendor Service
 * Implements IVendorService against the Elan Glimmora backend API.
 * All client-side requests go through /api/proxy — never call backend directly.
 */

import type {
  Vendor,
  VendorScreening,
  VendorScorecard,
  VendorAlert,
  VendorNote,
  VendorStatus,
  VendorCategory,
} from '@/lib/types/entities';
import type {
  IVendorService,
  VendorListQuery,
  CreateVendorInput,
  UpdateVendorInput,
  AddNoteInput,
} from '../interfaces/IVendorService';
import { apiRequest } from './client';

// ── Backend shapes (snake_case) ──────────────────────────────────────────────

interface ApiVendor {
  id: string;
  institution_id: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website?: string | null;
  headquarters_country: string;
  operating_regions: string[];
  contract_value: number;
  contract_start: string;
  contract_end?: string | null;
  nda_signed: boolean;
  nda_expires_at?: string | null;
  onboarded_at: string;
  created_at: string;
  updated_at: string;
}

interface ApiScreening {
  id: string;
  vendor_id: string;
  vendor_name: string;
  institution_id: string;
  financial_health_score: number;
  financial_health_details: {
    credit_rating: string;
    revenue_stability: number;
    debt_ratio: number;
    liquidity_score: number;
    bankruptcy_risk: VendorScreening['financialHealthDetails']['bankruptcyRisk'];
  };
  security_assessment_score: number;
  security_assessment_details: {
    data_protection_compliance: boolean;
    encryption_standards: string;
    incident_history: number;
    last_pen_test_date?: string | null;
    certifications: string[];
  };
  overall_screening_status: VendorScreening['overallScreeningStatus'];
  screened_by: string;
  screened_at: string;
  expires_at: string;
  notes?: string | null;
}

interface ApiScorecard {
  id: string;
  vendor_id: string;
  vendor_name: string;
  institution_id: string;
  period: string;
  overall_rating: VendorScorecard['overallRating'];
  overall_score: number;
  metrics: VendorScorecard['metrics'];
  sla_compliance: number;
  quality_rating: number;
  response_time: number;
  client_satisfaction: number;
  incident_count: number;
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
}

interface ApiAlert {
  id: string;
  vendor_id: string;
  vendor_name: string;
  institution_id: string;
  type: VendorAlert['type'];
  severity: VendorAlert['severity'];
  title: string;
  message: string;
  acknowledged: boolean;
  created_at: string;
}

interface ApiNote {
  id: string;
  vendor_id: string;
  institution_id: string;
  author_id: string;
  author_name: string;
  type: VendorNote['type'];
  priority: VendorNote['priority'];
  text: string;
  created_at: string;
  updated_at: string;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function toVendor(raw: ApiVendor): Vendor {
  return {
    id: raw.id,
    institutionId: raw.institution_id,
    name: raw.name,
    category: raw.category,
    status: raw.status,
    contactName: raw.contact_name,
    contactEmail: raw.contact_email,
    contactPhone: raw.contact_phone,
    website: raw.website ?? undefined,
    headquartersCountry: raw.headquarters_country,
    operatingRegions: raw.operating_regions || [],
    contractValue: raw.contract_value,
    contractStart: raw.contract_start,
    contractEnd: raw.contract_end ?? undefined,
    ndaSigned: raw.nda_signed,
    ndaExpiresAt: raw.nda_expires_at ?? undefined,
    onboardedAt: raw.onboarded_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function toCreateBody(input: CreateVendorInput): Record<string, unknown> {
  return {
    institution_id: input.institutionId,
    name: input.name,
    category: input.category,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone,
    website: input.website || null,
    headquarters_country: input.headquartersCountry,
    operating_regions: input.operatingRegions,
    contract_value: input.contractValue,
    contract_start: input.contractStart,
    contract_end: input.contractEnd || null,
    nda_signed: input.ndaSigned,
    nda_expires_at: input.ndaExpiresAt || null,
  };
}

function toUpdateBody(input: UpdateVendorInput): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (input.name !== undefined) body.name = input.name;
  if (input.category !== undefined) body.category = input.category;
  if (input.contactName !== undefined) body.contact_name = input.contactName;
  if (input.contactEmail !== undefined) body.contact_email = input.contactEmail;
  if (input.contactPhone !== undefined) body.contact_phone = input.contactPhone;
  if (input.website !== undefined) body.website = input.website || null;
  if (input.headquartersCountry !== undefined) body.headquarters_country = input.headquartersCountry;
  if (input.operatingRegions !== undefined) body.operating_regions = input.operatingRegions;
  if (input.contractValue !== undefined) body.contract_value = input.contractValue;
  if (input.contractStart !== undefined) body.contract_start = input.contractStart;
  if (input.contractEnd !== undefined) body.contract_end = input.contractEnd || null;
  if (input.ndaSigned !== undefined) body.nda_signed = input.ndaSigned;
  if (input.ndaExpiresAt !== undefined) body.nda_expires_at = input.ndaExpiresAt || null;
  return body;
}

function toScreening(raw: ApiScreening): VendorScreening {
  return {
    id: raw.id,
    vendorId: raw.vendor_id,
    vendorName: raw.vendor_name,
    institutionId: raw.institution_id,
    financialHealthScore: raw.financial_health_score,
    financialHealthDetails: {
      creditRating: raw.financial_health_details.credit_rating,
      revenueStability: raw.financial_health_details.revenue_stability,
      debtRatio: raw.financial_health_details.debt_ratio,
      liquidityScore: raw.financial_health_details.liquidity_score,
      bankruptcyRisk: raw.financial_health_details.bankruptcy_risk,
    },
    securityAssessmentScore: raw.security_assessment_score,
    securityAssessmentDetails: {
      dataProtectionCompliance: raw.security_assessment_details.data_protection_compliance,
      encryptionStandards: raw.security_assessment_details.encryption_standards,
      incidentHistory: raw.security_assessment_details.incident_history,
      lastPenTestDate: raw.security_assessment_details.last_pen_test_date ?? undefined,
      certifications: raw.security_assessment_details.certifications || [],
    },
    overallScreeningStatus: raw.overall_screening_status,
    screenedBy: raw.screened_by,
    screenedAt: raw.screened_at,
    expiresAt: raw.expires_at,
    notes: raw.notes ?? undefined,
  };
}

function toScorecard(raw: ApiScorecard): VendorScorecard {
  return {
    id: raw.id,
    vendorId: raw.vendor_id,
    vendorName: raw.vendor_name,
    institutionId: raw.institution_id,
    period: raw.period,
    overallRating: raw.overall_rating,
    overallScore: raw.overall_score,
    metrics: raw.metrics || [],
    slaCompliance: raw.sla_compliance,
    qualityRating: raw.quality_rating,
    responseTime: raw.response_time,
    clientSatisfaction: raw.client_satisfaction,
    incidentCount: raw.incident_count,
    reviewedBy: raw.reviewed_by,
    reviewedAt: raw.reviewed_at,
    createdAt: raw.created_at,
  };
}

function toAlert(raw: ApiAlert): VendorAlert {
  return {
    id: raw.id,
    vendorId: raw.vendor_id,
    vendorName: raw.vendor_name,
    institutionId: raw.institution_id,
    type: raw.type,
    severity: raw.severity,
    title: raw.title,
    message: raw.message,
    acknowledged: raw.acknowledged,
    createdAt: raw.created_at,
  };
}

function toNote(raw: ApiNote): VendorNote {
  return {
    id: raw.id,
    vendorId: raw.vendor_id,
    institutionId: raw.institution_id,
    authorId: raw.author_id,
    authorName: raw.author_name,
    type: raw.type,
    priority: raw.priority,
    text: raw.text,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// ── Service ──────────────────────────────────────────────────────────────────

export class ApiVendorService implements IVendorService {
  async getVendors(query?: VendorListQuery): Promise<Vendor[]> {
    const qs = new URLSearchParams();
    if (query?.institutionId) qs.set('institution_id', query.institutionId);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    const raw = await apiRequest<ApiVendor[]>(`/api/vendors${suffix}`, { method: 'GET' });
    return (raw || []).map(toVendor);
  }

  async getVendorById(id: string): Promise<Vendor | null> {
    try {
      const raw = await apiRequest<ApiVendor>(`/api/vendors/${id}`, { method: 'GET' });
      return toVendor(raw);
    } catch {
      return null;
    }
  }

  async createVendor(input: CreateVendorInput): Promise<Vendor> {
    const raw = await apiRequest<ApiVendor>('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(toCreateBody(input)),
    });
    return toVendor(raw);
  }

  async updateVendor(id: string, input: UpdateVendorInput): Promise<Vendor> {
    const raw = await apiRequest<ApiVendor>(`/api/vendors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(toUpdateBody(input)),
    });
    return toVendor(raw);
  }

  async deleteVendor(id: string): Promise<void> {
    await apiRequest(`/api/vendors/${id}`, { method: 'DELETE' });
  }

  async updateVendorStatus(id: string, status: VendorStatus): Promise<Vendor> {
    const raw = await apiRequest<ApiVendor>(`/api/vendors/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return toVendor(raw);
  }

  async getScreenings(institutionId: string): Promise<VendorScreening[]> {
    const qs = institutionId ? `?institution_id=${encodeURIComponent(institutionId)}` : '';
    const raw = await apiRequest<ApiScreening[]>(`/api/vendors/screenings${qs}`, { method: 'GET' });
    return (raw || []).map(toScreening);
  }

  async getScreeningByVendor(vendorId: string): Promise<VendorScreening | null> {
    const list = await this.getScreeningsByVendor(vendorId);
    const sorted = [...list].sort((a, b) => b.screenedAt.localeCompare(a.screenedAt));
    return sorted[0] ?? null;
  }

  async getScreeningsByVendor(vendorId: string): Promise<VendorScreening[]> {
    const raw = await apiRequest<ApiScreening[]>(`/api/vendors/${vendorId}/screenings`, { method: 'GET' });
    return (raw || []).map(toScreening);
  }

  async runScreening(vendorId: string): Promise<VendorScreening> {
    const raw = await apiRequest<ApiScreening>(`/api/vendors/${vendorId}/screenings`, {
      method: 'POST',
    });
    return toScreening(raw);
  }

  async getScorecards(institutionId: string, period?: string): Promise<VendorScorecard[]> {
    const qs = new URLSearchParams();
    if (institutionId) qs.set('institution_id', institutionId);
    if (period) qs.set('period', period);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    const raw = await apiRequest<ApiScorecard[]>(`/api/vendors/scorecards${suffix}`, { method: 'GET' });
    return (raw || []).map(toScorecard);
  }

  async getScorecardsByVendor(vendorId: string): Promise<VendorScorecard[]> {
    const raw = await apiRequest<ApiScorecard[]>(`/api/vendors/${vendorId}/scorecards`, { method: 'GET' });
    return (raw || []).map(toScorecard);
  }

  async getVendorAlerts(institutionId: string): Promise<VendorAlert[]> {
    const qs = institutionId ? `?institution_id=${encodeURIComponent(institutionId)}` : '';
    const raw = await apiRequest<ApiAlert[]>(`/api/vendors/alerts${qs}`, { method: 'GET' });
    return (raw || []).map(toAlert);
  }

  async getAlertsByVendor(vendorId: string): Promise<VendorAlert[]> {
    const raw = await apiRequest<ApiAlert[]>(`/api/vendors/${vendorId}/alerts`, { method: 'GET' });
    return (raw || []).map(toAlert);
  }

  async acknowledgeVendorAlert(alertId: string): Promise<void> {
    await apiRequest(`/api/vendors/alerts/${alertId}/acknowledge`, { method: 'POST' });
  }

  async getNotesByVendor(vendorId: string): Promise<VendorNote[]> {
    const raw = await apiRequest<ApiNote[]>(`/api/vendors/${vendorId}/notes`, { method: 'GET' });
    return (raw || []).map(toNote);
  }

  async addNote(vendorId: string, input: AddNoteInput): Promise<VendorNote> {
    const raw = await apiRequest<ApiNote>(`/api/vendors/${vendorId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ type: input.type, priority: input.priority, text: input.text }),
    });
    return toNote(raw);
  }

  async updateNote(vendorId: string, noteId: string, input: AddNoteInput): Promise<VendorNote> {
    const raw = await apiRequest<ApiNote>(`/api/vendors/${vendorId}/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify({ type: input.type, priority: input.priority, text: input.text }),
    });
    return toNote(raw);
  }

  async deleteNote(vendorId: string, noteId: string): Promise<void> {
    await apiRequest(`/api/vendors/${vendorId}/notes/${noteId}`, { method: 'DELETE' });
  }
}
