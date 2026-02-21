/**
 * Core entity type definitions for E-Glimmora (Elan platform)
 * All 15+ entity types with production-ready interfaces
 */

import { UserRoles, DomainContext } from './roles';
import { Permission, Resource } from './permissions';

// ============================================================================
// User & Institution
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRoles;
  institutionId?: string;
  avatarUrl?: string;
  passwordHash?: string; // For auth - stored internally only
  mfaEnabled?: boolean; // Whether MFA is enabled for this user
  mfaSecret?: string; // Stored encrypted in production, plain in mock
  createdAt: string;
  updatedAt: string;
  erasedAt?: string;
}

export type InstitutionType = 'Private Bank' | 'Family Office' | 'Wealth Manager';
export type InstitutionTier = 'Platinum' | 'Gold' | 'Silver';
export type InstitutionStatus = 'Active' | 'Pending' | 'Suspended';

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  tier: InstitutionTier;
  status: InstitutionStatus;
  contractStart: string;
  contractEnd?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Intent Profile
// ============================================================================

export interface EmotionalDrivers {
  security: number; // 0-100
  adventure: number; // 0-100
  legacy: number; // 0-100
  recognition: number; // 0-100
  autonomy: number; // 0-100
}

export type RiskTolerance = 'Conservative' | 'Moderate' | 'Aggressive' | 'Very Aggressive';
export type LifeStage = 'Building' | 'Preserving' | 'Transitioning' | 'Legacy Planning';
export type TravelMode = 'Luxury' | 'Adventure' | 'Wellness' | 'Cultural' | 'Exclusive Access';

export interface IntentProfile {
  id: string;
  userId: string;
  emotionalDrivers: EmotionalDrivers;
  riskTolerance: RiskTolerance;
  values: string[];
  lifeStage: LifeStage;
  travelMode?: TravelMode;
  preferredSeason?: 'Summer' | 'Autumn' | 'Winter' | 'Spring' | 'Timeless';
  priorities?: string[];
  discretionPreference?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Journey & Versions
// ============================================================================

export enum JourneyStatus {
  DRAFT = 'DRAFT',
  RM_REVIEW = 'RM_REVIEW',
  COMPLIANCE_REVIEW = 'COMPLIANCE_REVIEW',
  APPROVED = 'APPROVED',
  PRESENTED = 'PRESENTED',
  EXECUTED = 'EXECUTED',
  ARCHIVED = 'ARCHIVED'
}

export type JourneyCategory =
  | 'Travel'
  | 'Investment'
  | 'Estate Planning'
  | 'Philanthropy'
  | 'Family Education'
  | 'Wellness'
  | 'Concierge'
  | 'Other';

export type DiscretionLevel = 'High' | 'Medium' | 'Standard';

export interface Journey {
  id: string;
  userId: string;
  institutionId?: string;
  assignedRM?: string;
  title: string;
  narrative: string;
  category: JourneyCategory;
  status: JourneyStatus;
  versions: JourneyVersion[];
  currentVersionId: string;
  riskSummary?: string;
  discretionLevel?: DiscretionLevel;
  isInvisible: boolean;
  emotionalObjective?: string;
  strategicReasoning?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyVersion {
  id: string;
  journeyId: string;
  versionNumber: number;
  title: string;
  narrative: string;
  status: JourneyStatus;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  modifiedBy: string;
  createdAt: string;
}

// ============================================================================
// Memory Vault
// ============================================================================

export type MemoryType = 'Document' | 'Photo' | 'Video' | 'Note' | 'Audio';

export interface MemoryItem {
  id: string;
  userId: string;
  type: MemoryType;
  title: string;
  description?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  emotionalTags: string[];
  linkedJourneys: string[];
  sharingPermissions: string[];
  isLocked: boolean;
  unlockCondition?: string;
  isMilestone: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Messaging
// ============================================================================

export interface MessageThread {
  id: string;
  participants: string[];
  subject?: string;
  context: DomainContext;
  relatedResourceId?: string;
  relatedResourceType?: string;
  lastMessageAt: string;
  createdAt: string;
}

export type MessageType = 'user' | 'system';

export interface MessageAttachment {
  id: string;
  filename: string;
  fileUrl: string;
  mimeType: string;
  size: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  type: MessageType;
  attachments?: MessageAttachment[];
  readBy: string[];
  sentAt: string;
}

// ============================================================================
// Privacy & Access Control
// ============================================================================

export type DiscretionTier = 'High' | 'Medium' | 'Standard';

export interface AdvisorResourcePermissions {
  journeys: string[] | 'all' | 'none';
  intelligence: boolean;
  memories: boolean;
}

export interface PrivacySettings {
  id: string;
  userId: string;
  discretionTier: DiscretionTier;
  invisibleItineraryDefault: boolean;
  dataRetention: number; // days, 0 = never
  analyticsOptOut: boolean;
  thirdPartySharing: boolean;
  advisorVisibilityScope: string[]; // advisor user IDs
  advisorResourcePermissions?: Record<string, AdvisorResourcePermissions>; // { [advisorId]: permissions }
  globalEraseRequested: boolean;
  globalEraseExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessPermission {
  id: string;
  grantedBy: string;
  grantedTo: string;
  resourceType: Resource;
  resourceId: string;
  permission: Permission;
  expiresAt?: string;
  createdAt: string;
}

// ============================================================================
// Risk & Compliance
// ============================================================================

export type RiskCategory = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskRecord {
  id: string;
  userId: string;
  institutionId: string;
  riskScore: number; // 0-100
  riskCategory: RiskCategory;
  flags: string[];
  assessedBy: string;
  assessedAt: string;
  nextReviewDate: string;
  notes?: string;
}

// ============================================================================
// B2B Client Record
// ============================================================================

export type ClientStatus = 'Active' | 'Pending' | 'Onboarding' | 'Archived';

export interface ClientRecord {
  id: string;
  userId: string; // Links to User entity
  institutionId: string;
  assignedRM: string; // User ID of the RM
  assignedAdvisors: string[]; // User IDs of advisors
  name: string;
  email: string;
  status: ClientStatus;
  riskCategory: RiskCategory;
  riskScore: number;
  emotionalProfile?: EmotionalDrivers;
  activeJourneyCount: number;
  totalJourneyCount: number;
  ndaStatus: 'Active' | 'Expired' | 'Pending' | 'None';
  ndaExpiresAt?: string;
  lastActivity: string;
  onboardedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Insurance & Travel Risk
// ============================================================================

export interface InsuranceLog {
  id: string;
  clientId: string;
  institutionId: string;
  type: string; // e.g., "Travel", "Health", "Property"
  provider: string;
  policyNumber: string;
  coverage: string;
  validFrom: string;
  validUntil: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ThreatLevel = 'Low' | 'Moderate' | 'Elevated' | 'High' | 'Critical';

export interface GeopoliticalRisk {
  id: string;
  region: string;
  country: string;
  threatLevel: ThreatLevel;
  riskFactors: string[];
  lastUpdated: string;
}

export interface TravelAdvisory {
  id: string;
  country: string;
  region: string;
  advisoryLevel: ThreatLevel;
  summary: string;
  effectiveDate: string;
  expiresAt?: string;
}

// ============================================================================
// Retention Policy
// ============================================================================

export interface RetentionPolicy {
  id: string;
  institutionId: string;
  entityType: string;
  retentionDays: number;
  autoArchive: boolean;
  autoDelete: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Contracts & Revenue
// ============================================================================

export type ContractStatus = 'Active' | 'Expired' | 'Pending Renewal';

export interface Contract {
  id: string;
  institutionId: string;
  tier: InstitutionTier;
  annualFee: number;
  perUserFee: number;
  startDate: string;
  endDate?: string;
  status: ContractStatus;
  signedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF';
export type RevenueType = 'Subscription' | 'Usage' | 'One-Time';

export interface RevenueRecord {
  id: string;
  institutionId: string;
  contractId: string;
  amount: number;
  currency: Currency;
  type: RevenueType;
  period: string;
  paidAt?: string;
  createdAt: string;
}

// ============================================================================
// Audit & Logging
// ============================================================================

export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE';

export interface AuditEvent {
  id: string;
  event: string;
  userId: string;
  resourceId: string;
  resourceType: string;
  context: DomainContext;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  timestamp: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
}

// ============================================================================
// Invite System
// ============================================================================

export type InviteType = 'b2c' | 'b2b' | 'admin';
export type InviteStatus = 'active' | 'used' | 'expired' | 'revoked';

export interface InviteCode {
  id: string;
  code: string;
  type: InviteType;
  createdBy: string;
  assignedRoles: UserRoles;
  institutionId?: string;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  status: InviteStatus;
  createdAt: string;
}

// ============================================================================
// Device Recognition
// ============================================================================

export interface TrustedDevice {
  id: string;
  userId: string;
  deviceToken: string;
  deviceName: string;  // e.g., "Chrome on macOS"
  lastUsed: string;    // ISO 8601
  createdAt: string;
  status: 'active' | 'revoked';
}

// ============================================================================
// Predictive Intelligence
// ============================================================================

export type FatigueLevel = 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Critical';
export type DriftSeverity = 'Aligned' | 'Minor' | 'Moderate' | 'Significant' | 'Critical';
export type PredictionConfidence = 'Low' | 'Medium' | 'High';

export interface TravelSegment {
  id: string;
  clientId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  timezonesCrossed: number;
  tripDurationDays: number;
  purpose: 'Business' | 'Leisure' | 'Medical' | 'Family' | 'Philanthropy';
}

export interface TravelFatigueAssessment {
  id: string;
  clientId: string;
  clientName: string;
  institutionId: string;
  fatigueScore: number;
  fatigueLevel: FatigueLevel;
  tripsLast30Days: number;
  tripsLast90Days: number;
  averageTimezonesCrossed: number;
  totalFlightHoursLast90Days: number;
  restDaysBetweenTrips: number;
  burnoutRiskPercent: number;
  recommendations: string[];
  trendDirection: 'improving' | 'stable' | 'worsening';
  assessedAt: string;
  nextAssessmentDate: string;
}

export interface FamilyMemberPreference {
  memberId: string;
  memberName: string;
  relationship: 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Other';
  travelPreferences: string[];
  investmentStyle: RiskTolerance;
  lifestyleValues: string[];
  philanthropicInterests: string[];
  lastUpdated: string;
}

export interface FamilyAlignmentAssessment {
  id: string;
  clientId: string;
  clientName: string;
  institutionId: string;
  overallAlignmentScore: number;
  driftSeverity: DriftSeverity;
  familyMembers: FamilyMemberPreference[];
  driftAreas: {
    area: string;
    currentDriftPercent: number;
    previousDriftPercent: number;
    trendDirection: 'converging' | 'stable' | 'diverging';
  }[];
  alerts: {
    id: string;
    severity: DriftSeverity;
    message: string;
    area: string;
    triggeredAt: string;
    acknowledged: boolean;
  }[];
  recommendations: string[];
  assessedAt: string;
  nextReviewDate: string;
}

export interface PredictiveAlert {
  id: string;
  clientId: string;
  clientName: string;
  institutionId: string;
  type: 'travel_fatigue' | 'family_drift';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  confidence: PredictionConfidence;
  actionRequired: boolean;
  acknowledged: boolean;
  createdAt: string;
  expiresAt?: string;
}

// ============================================================================
// Crisis Response
// ============================================================================

export type CrisisStatus = 'Monitoring' | 'Active' | 'Escalated' | 'Resolved' | 'Archived';
export type DisruptionType = 'Weather' | 'Strike' | 'Geopolitical' | 'Infrastructure' | 'Health' | 'Security';
export type ProtocolStatus = 'Standby' | 'Activated' | 'In Progress' | 'Completed' | 'Aborted';
export type ExtractionPriority = 'Routine' | 'Urgent' | 'Emergency' | 'Critical';

export interface AviationDisruption {
  id: string;
  institutionId: string;
  type: DisruptionType;
  title: string;
  description: string;
  affectedRegions: string[];
  affectedAirports: string[];
  affectedClients: string[];
  threatLevel: ThreatLevel;
  probabilityPercent: number;
  estimatedImpactHours: number;
  forecastSource: string;
  status: CrisisStatus;
  startedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtractionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedTo?: string;
  estimatedDurationMinutes: number;
  completedAt?: string;
  notes?: string;
}

export interface SafeHouse {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  contactName: string;
  contactPhone: string;
  capacity: number;
  securityLevel: 'Standard' | 'Enhanced' | 'Maximum';
  availableNow: boolean;
  lastVerified: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  region: string;
  available24h: boolean;
}

export interface CrisisTimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  type: 'info' | 'action' | 'escalation' | 'resolution';
  actor?: string;
}

export interface ExtractionProtocol {
  id: string;
  institutionId: string;
  clientId: string;
  clientName: string;
  priority: ExtractionPriority;
  status: ProtocolStatus;
  currentLocation: string;
  destinationLocation: string;
  crisisId?: string;
  steps: ExtractionStep[];
  safeHouses: SafeHouse[];
  emergencyContacts: EmergencyContact[];
  timeline: CrisisTimelineEvent[];
  activatedBy?: string;
  activatedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Vendor Governance
// ============================================================================

export type VendorStatus = 'Active' | 'Under Review' | 'Suspended' | 'Approved' | 'Rejected';
export type VendorCategory = 'Travel & Aviation' | 'Security' | 'Legal' | 'Concierge' | 'Financial' | 'Medical' | 'Hospitality' | 'Technology';
export type ScreeningStatus = 'Not Started' | 'In Progress' | 'Passed' | 'Failed' | 'Expired';
export type ScorecardRating = 'Exceptional' | 'Good' | 'Satisfactory' | 'Below Expectations' | 'Unacceptable';

export interface Vendor {
  id: string;
  institutionId: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
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
  onboardedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorScreening {
  id: string;
  vendorId: string;
  vendorName: string;
  institutionId: string;
  financialHealthScore: number;
  financialHealthDetails: {
    creditRating: string;
    revenueStability: number;
    debtRatio: number;
    liquidityScore: number;
    bankruptcyRisk: 'Negligible' | 'Low' | 'Moderate' | 'Elevated' | 'High';
  };
  securityAssessmentScore: number;
  securityAssessmentDetails: {
    dataProtectionCompliance: boolean;
    encryptionStandards: string;
    incidentHistory: number;
    lastPenTestDate?: string;
    certifications: string[];
  };
  overallScreeningStatus: ScreeningStatus;
  screenedBy: string;
  screenedAt: string;
  expiresAt: string;
  notes?: string;
}

export interface VendorScorecard {
  id: string;
  vendorId: string;
  vendorName: string;
  institutionId: string;
  period: string;
  overallRating: ScorecardRating;
  overallScore: number;
  metrics: {
    category: string;
    score: number;
    weight: number;
    target: number;
    notes?: string;
  }[];
  slaCompliance: number;
  qualityRating: number;
  responseTime: number;
  clientSatisfaction: number;
  incidentCount: number;
  reviewedBy: string;
  reviewedAt: string;
  createdAt: string;
}

export interface VendorAlert {
  id: string;
  vendorId: string;
  vendorName: string;
  institutionId: string;
  type: 'screening_expiry' | 'sla_breach' | 'financial_deterioration' | 'security_incident' | 'contract_expiry';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  acknowledged: boolean;
  createdAt: string;
}

// ============================================================================
// Cross-UHNI Conflict Detection
// ============================================================================

export type ConflictType = 'scheduling' | 'venue' | 'relationship' | 'business' | 'social_circle';
export type ConflictSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ConflictStatus = 'Active' | 'Acknowledged' | 'Resolved' | 'Dismissed';

export interface ConflictAlert {
  id: string;
  institutionId: string;
  conflictType: ConflictType;
  severity: ConflictSeverity;
  status: ConflictStatus;
  partyAClientId: string;
  partyBClientId: string;
  partyALabel: string;
  partyBLabel: string;
  title: string;
  description: string;
  detectedAt: string;
  venue?: string;
  eventDate?: string;
  recommendedActions: string[];
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConflictResolution {
  id: string;
  conflictId: string;
  resolvedBy: string;
  action: string;
  notes: string;
  createdAt: string;
}

export interface ConflictMatrixEntry {
  clientId: string;
  clientLabel: string;
  conflictCount: number;
  highSeverityCount: number;
  activeConflicts: number;
}

// ============================================================================
// External Integrations
// ============================================================================

export type IntegrationType = 'government_advisory' | 'aviation' | 'insurance_provider' | 'security' | 'financial_data';
export type IntegrationStatus = 'Connected' | 'Degraded' | 'Disconnected' | 'Configuring' | 'Maintenance';
export type SyncFrequency = 'Real-time' | 'Hourly' | 'Daily' | 'Weekly' | 'Manual';

export interface ExternalIntegration {
  id: string;
  institutionId: string;
  name: string;
  provider: string;
  type: IntegrationType;
  status: IntegrationStatus;
  endpoint: string;
  apiKeyConfigured: boolean;
  syncFrequency: SyncFrequency;
  lastSyncAt?: string;
  lastSyncStatus: 'Success' | 'Partial' | 'Failed' | 'Never';
  recordsSynced: number;
  errorCount: number;
  healthScore: number;
  configuredBy: string;
  configuredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationHealthCheck {
  id: string;
  integrationId: string;
  timestamp: string;
  latencyMs: number;
  statusCode: number;
  isHealthy: boolean;
  errorMessage?: string;
}

export interface DataFlowMetric {
  integrationId: string;
  period: string;
  recordsIngested: number;
  recordsFailed: number;
  avgLatencyMs: number;
  peakLatencyMs: number;
}

export interface IntegrationConfig {
  id: string;
  integrationId: string;
  key: string;
  value: string;
  updatedBy: string;
  updatedAt: string;
}
