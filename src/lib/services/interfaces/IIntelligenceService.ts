/**
 * Intelligence Service Interface — Phase 6 AGI features.
 * Hotel scoring, package matching, and next-journey suggestions.
 */

import type {
  HotelScoringResponse,
  PackageMatchingResponse,
  JourneySuggestionsResponse,
} from '@/lib/types/entities';

export interface IIntelligenceService {
  /** POST /api/intelligence/hotel-scoring */
  scoreHotels(userId: string): Promise<HotelScoringResponse>;
  /** POST /api/intelligence/package-matching */
  matchPackages(userId: string, hotelId?: string): Promise<PackageMatchingResponse>;
  /** GET /api/intelligence/suggestions/{userId} */
  getSuggestions(userId: string): Promise<JourneySuggestionsResponse>;
}
