/**
 * Briefing / Dashboard Service Interface
 * Aggregated landing-page endpoints introduced in Phase 5.
 */

import type {
  UhniBriefing,
  AdvisorPortfolio,
  AdminDashboard,
  IntelligenceFeed,
} from '@/lib/types/entities';

export interface IBriefingService {
  /** GET /api/briefing — UHNI landing */
  getUhniBriefing(): Promise<UhniBriefing>;
  /** GET /api/portfolio — advisor landing */
  getAdvisorPortfolio(): Promise<AdvisorPortfolio>;
  /** GET /api/dashboard — admin landing */
  getAdminDashboard(): Promise<AdminDashboard>;
  /** GET /api/intelligence/feed — ranked intelligence items for a user */
  getIntelligenceFeed(userId?: string): Promise<IntelligenceFeed>;
}
