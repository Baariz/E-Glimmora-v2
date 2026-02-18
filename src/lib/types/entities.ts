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
