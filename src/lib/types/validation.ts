/**
 * Zod validation schemas for runtime input validation
 * Each schema exports inferred TypeScript types for input data
 */

import { z } from 'zod';

// ============================================================================
// User Schemas
// ============================================================================

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  roles: z.object({
    b2c: z.enum(['UHNI', 'Spouse', 'LegacyHeir', 'ElanAdvisor']).optional(),
    b2b: z.enum([
      'RelationshipManager',
      'PrivateBanker',
      'FamilyOfficeDirector',
      'ComplianceOfficer',
      'InstitutionalAdmin',
      'UHNIPortal'
    ]).optional(),
    admin: z.enum(['SuperAdmin']).optional()
  })
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// ============================================================================
// Journey Schemas
// ============================================================================

export const CreateJourneySchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  narrative: z.string().min(10, 'Narrative too short').max(5000, 'Narrative too long'),
  category: z.enum([
    'Travel',
    'Investment',
    'Estate Planning',
    'Philanthropy',
    'Family Education',
    'Wellness',
    'Concierge',
    'Other'
  ]),
  context: z.enum(['b2c', 'b2b'])
});

export type CreateJourneyInput = z.infer<typeof CreateJourneySchema>;

// ============================================================================
// Memory Schemas
// ============================================================================

export const CreateMemorySchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  type: z.enum(['Document', 'Photo', 'Video', 'Note', 'Audio']),
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional()
});

export type CreateMemoryInput = z.infer<typeof CreateMemorySchema>;

// ============================================================================
// Message Schemas
// ============================================================================

export const CreateMessageSchema = z.object({
  threadId: z.string().uuid('Invalid thread ID'),
  senderId: z.string().uuid('Invalid sender ID'),
  content: z.string().min(1, 'Content required').max(5000, 'Content too long')
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;

// ============================================================================
// Intent Profile Schemas
// ============================================================================

export const CreateIntentProfileSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  emotionalDrivers: z.object({
    security: z.number().min(0).max(100),
    adventure: z.number().min(0).max(100),
    legacy: z.number().min(0).max(100),
    recognition: z.number().min(0).max(100),
    autonomy: z.number().min(0).max(100)
  }),
  riskTolerance: z.enum(['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive']),
  values: z.array(z.string()),
  lifeStage: z.enum(['Building', 'Preserving', 'Transitioning', 'Legacy Planning']),
  travelMode: z.enum(['Luxury', 'Adventure', 'Wellness', 'Cultural', 'Exclusive Access']).optional(),
  priorities: z.array(z.string()).optional(),
  discretionPreference: z.enum(['High', 'Medium', 'Standard']).optional()
});

export type CreateIntentProfileInput = z.infer<typeof CreateIntentProfileSchema>;

// ============================================================================
// Institution Schemas
// ============================================================================

export const CreateInstitutionSchema = z.object({
  name: z.string().min(1, 'Name required').max(200, 'Name too long'),
  type: z.enum(['Private Bank', 'Family Office', 'Wealth Manager']),
  tier: z.enum(['Platinum', 'Gold', 'Silver'])
});

export type CreateInstitutionInput = z.infer<typeof CreateInstitutionSchema>;

// ============================================================================
// Privacy Settings Schemas
// ============================================================================

export const UpdatePrivacySettingsSchema = z.object({
  discretionTier: z.enum(['High', 'Medium', 'Standard']).optional(),
  invisibleItineraryDefault: z.boolean().optional(),
  dataRetention: z.number().min(0).optional(),
  analyticsOptOut: z.boolean().optional(),
  thirdPartySharing: z.boolean().optional(),
  advisorVisibilityScope: z.array(z.string()).optional(),
  advisorResourcePermissions: z.record(z.object({
    journeys: z.union([z.array(z.string()), z.literal('all'), z.literal('none')]),
    intelligence: z.boolean(),
    memories: z.boolean()
  })).optional(),
  globalEraseRequested: z.boolean().optional()
});

export type UpdatePrivacySettingsInput = z.infer<typeof UpdatePrivacySettingsSchema>;

// ============================================================================
// Risk Record Schemas
// ============================================================================

export const CreateRiskRecordSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  institutionId: z.string().uuid('Invalid institution ID'),
  riskScore: z.number().min(0).max(100),
  riskCategory: z.enum(['Low', 'Medium', 'High', 'Critical']),
  flags: z.array(z.string()),
  assessedBy: z.string().uuid('Invalid assessor ID')
});

export type CreateRiskRecordInput = z.infer<typeof CreateRiskRecordSchema>;

// ============================================================================
// Invite Code Schemas
// ============================================================================

export const CreateInviteCodeSchema = z.object({
  type: z.enum(['b2c', 'b2b', 'admin']),
  createdBy: z.string().uuid('Invalid creator ID'),
  assignedRoles: z.object({
    b2c: z.enum(['UHNI', 'Spouse', 'LegacyHeir', 'ElanAdvisor']).optional(),
    b2b: z.enum([
      'RelationshipManager',
      'PrivateBanker',
      'FamilyOfficeDirector',
      'ComplianceOfficer',
      'InstitutionalAdmin',
      'UHNIPortal'
    ]).optional(),
    admin: z.enum(['SuperAdmin']).optional()
  }),
  institutionId: z.string().uuid().optional(),
  maxUses: z.number().min(1),
  expiresAt: z.string().datetime().optional()
});

export type CreateInviteCodeInput = z.infer<typeof CreateInviteCodeSchema>;

// ============================================================================
// Client Record Schemas
// ============================================================================

export const CreateClientRecordSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  institutionId: z.string().uuid('Invalid institution ID'),
  assignedRM: z.string().uuid('Invalid RM ID'),
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  email: z.string().email('Invalid email'),
});

export type CreateClientRecordInput = z.infer<typeof CreateClientRecordSchema>;
