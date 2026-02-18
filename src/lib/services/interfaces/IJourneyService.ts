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
}
