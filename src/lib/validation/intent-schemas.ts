/**
 * Intent Wizard Per-Step Validation Schemas
 * Each step has its own Zod schema for granular validation
 */

import { z } from 'zod';

// ============================================================================
// Step 1: Life Phase
// ============================================================================

export const Step1Schema = z.object({
  lifeStage: z.enum(['Building', 'Preserving', 'Transitioning', 'Legacy Planning'], {
    required_error: 'Please select your current life stage',
  }),
});

export type Step1Data = z.infer<typeof Step1Schema>;

// ============================================================================
// Step 2: Emotional Outcome
// ============================================================================

export const Step2Schema = z.object({
  emotionalDrivers: z.object({
    security: z.number().min(0).max(100),
    adventure: z.number().min(0).max(100),
    legacy: z.number().min(0).max(100),
    recognition: z.number().min(0).max(100),
    autonomy: z.number().min(0).max(100),
  }),
});

export type Step2Data = z.infer<typeof Step2Schema>;

// ============================================================================
// Step 3: Travel Mode
// ============================================================================

export const Step3Schema = z.object({
  travelMode: z.enum(['Luxury', 'Adventure', 'Wellness', 'Cultural', 'Exclusive Access'], {
    required_error: 'Please select your preferred travel mode',
  }),
});

export type Step3Data = z.infer<typeof Step3Schema>;

// ============================================================================
// Step 4: Priorities
// ============================================================================

export const Step4Schema = z.object({
  priorities: z
    .array(z.string())
    .min(1, 'Please select at least one priority')
    .max(5, 'Please select no more than 5 priorities'),
  values: z.array(z.string()).default([]),
});

export type Step4Data = z.infer<typeof Step4Schema>;

// ============================================================================
// Step 5: Discretion
// ============================================================================

export const Step5Schema = z.object({
  discretionPreference: z.enum(['High', 'Medium', 'Standard'], {
    required_error: 'Please select your discretion preference',
  }),
  riskTolerance: z.enum(['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'], {
    required_error: 'Please select your risk tolerance',
  }),
});

export type Step5Data = z.infer<typeof Step5Schema>;

// ============================================================================
// Master Schema (All Steps Combined)
// ============================================================================

export const IntentProfileMasterSchema = z.object({
  lifeStage: Step1Schema.shape.lifeStage,
  emotionalDrivers: Step2Schema.shape.emotionalDrivers,
  travelMode: Step3Schema.shape.travelMode,
  priorities: Step4Schema.shape.priorities,
  values: Step4Schema.shape.values,
  discretionPreference: Step5Schema.shape.discretionPreference,
  riskTolerance: Step5Schema.shape.riskTolerance,
});

export type IntentProfileMasterData = z.infer<typeof IntentProfileMasterSchema>;

// ============================================================================
// Available Options (for UI rendering)
// ============================================================================

export const LIFESTYLE_PRIORITIES = [
  'Privacy',
  'Family Legacy',
  'Cultural Immersion',
  'Adventure',
  'Wellness',
  'Philanthropy',
  'Wealth Preservation',
  'Social Recognition',
] as const;
