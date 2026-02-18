/**
 * Intent Service Interface
 * Manages user intent profiles and alignment calculations
 */

import { IntentProfile, CreateIntentProfileInput } from '@/lib/types';

export interface IIntentService {
  getIntentProfile(userId: string): Promise<IntentProfile | null>;
  createIntentProfile(data: CreateIntentProfileInput): Promise<IntentProfile>;
  updateIntentProfile(userId: string, data: Partial<IntentProfile>): Promise<IntentProfile>;
  calculateAlignmentBaseline(profile: IntentProfile): number;
}
