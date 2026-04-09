/**
 * Journey Service Interface
 * Manages journey creation, versioning, and lifecycle
 */

import { Journey, JourneyVersion, CreateJourneyInput, DomainContext } from '@/lib/types';

export interface IJourneyService {
  getJourneys(userId: string, context: DomainContext): Promise<Journey[]>;
  getJourneyById(id: string): Promise<Journey | null>;
  createJourney(data: CreateJourneyInput): Promise<Journey>;
  updateJourney(id: string, data: Partial<Journey>): Promise<Journey>;
  deleteJourney(id: string): Promise<boolean>;
  getJourneyVersions(journeyId: string): Promise<JourneyVersion[]>;
  createJourneyVersion(journeyId: string, data: Partial<JourneyVersion>): Promise<JourneyVersion>;
  /** Execute a state-machine transition (e.g. SUBMIT_FOR_REVIEW, APPROVE_RM) */
  transitionJourney(journeyId: string, event: string, rejectionReason?: string): Promise<Journey>;
  /** AI-powered journey generation via backend */
  generateJourneys(userId: string, count?: number): Promise<Journey[]>;
}
