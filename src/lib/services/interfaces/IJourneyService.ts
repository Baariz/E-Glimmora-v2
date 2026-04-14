/**
 * Journey Service Interface
 * Manages journey creation, versioning, and lifecycle
 */

import {
  Journey,
  JourneyVersion,
  CreateJourneyInput,
  DomainContext,
  PreDepartureBrief,
  JourneyFeedback,
  TravelMonitor,
} from '@/lib/types';

export interface IJourneyService {
  getJourneys(userId: string, context: DomainContext): Promise<Journey[]>;
  getJourneyById(id: string): Promise<Journey | null>;
  createJourney(data: CreateJourneyInput): Promise<Journey>;
  updateJourney(id: string, data: Partial<Journey>): Promise<Journey>;
  deleteJourney(id: string): Promise<boolean>;
  getJourneyVersions(journeyId: string): Promise<JourneyVersion[]>;
  createJourneyVersion(journeyId: string, data: Partial<JourneyVersion>): Promise<JourneyVersion>;
  /** Execute a state-machine transition (e.g. SUBMIT_FOR_REVIEW, APPROVE_RM, SUBMIT_FEEDBACK) */
  transitionJourney(journeyId: string, event: string, rejectionReason?: string): Promise<Journey>;
  /** AI-powered journey generation via backend */
  generateJourneys(userId: string, count?: number): Promise<Journey[]>;

  /** Phase 2 — Advisor composes pre-departure brief */
  setPreDepartureBrief(journeyId: string, brief: PreDepartureBrief): Promise<Journey>;
  /** Phase 2 — Advisor travel monitor feed */
  getMonitor(journeyId: string): Promise<TravelMonitor>;
  /** Phase 2 — UHNI submits post-journey feedback (mood + reflection) */
  submitFeedback(journeyId: string, feedback: { mood: number; reflection?: string }): Promise<JourneyFeedback>;
  /** Phase 2 — Fetch existing feedback for a journey */
  getFeedback(journeyId: string): Promise<JourneyFeedback | null>;
}
