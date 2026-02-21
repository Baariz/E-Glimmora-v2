/**
 * Mock Journey Service
 * localStorage-based implementation with realistic delays
 */

import { BaseMockService } from './base.mock';
import { IJourneyService } from '../interfaces/IJourneyService';
import {
  Journey,
  JourneyVersion,
  CreateJourneyInput,
  DomainContext,
  JourneyStatus
} from '@/lib/types';

export class MockJourneyService extends BaseMockService implements IJourneyService {
  private readonly STORAGE_KEY = 'journeys';
  private readonly VERSIONS_KEY = 'journey_versions';

  constructor() {
    super();
    this.seedIfEmpty();
  }

  /**
   * Seed realistic UHNI journeys across all statuses (idempotent)
   */
  private seedIfEmpty(): void {
    const existing = this.getFromStorage<Journey>(this.STORAGE_KEY);
    if (existing.length > 0) {
      return;
    }

    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
    const userId = 'c7e1f2a0-4b3d-4e5f-8a9b-1c2d3e4f5a6b'; // MOCK_UHNI_USER_ID from useCurrentUser

    const seedJourneys: Journey[] = [
      {
        id: 'journey-seed-001',
        userId,
        title: 'Mediterranean Legacy Voyage',
        narrative: 'A curated 14-day sailing experience across the Amalfi Coast and Greek Islands, with private archaeological tours and Michelin-starred dining aboard a 60m superyacht. Designed to create lasting family memories while exploring ancient maritime heritage.',
        category: 'Travel',
        status: JourneyStatus.EXECUTED,
        versions: [{
          id: 'v-seed-001',
          journeyId: 'journey-seed-001',
          versionNumber: 1,
          title: 'Mediterranean Legacy Voyage',
          narrative: 'A curated 14-day sailing experience across the Amalfi Coast and Greek Islands.',
          status: JourneyStatus.EXECUTED,
          modifiedBy: 'b2b-rm-001-uuid-placeholder',
          createdAt: daysAgo(30),
        }],
        currentVersionId: 'v-seed-001',
        discretionLevel: 'High',
        isInvisible: false,
        emotionalObjective: 'Legacy & family bonding through shared cultural discovery',
        strategicReasoning: 'Aligned with client preference for heritage travel and family values',
        riskSummary: 'Low risk — stable region, vetted operators, comprehensive insurance',
        createdAt: daysAgo(30),
        updatedAt: daysAgo(2),
      },
      {
        id: 'journey-seed-002',
        userId,
        title: 'Swiss Alpine Wellness Retreat',
        narrative: 'An exclusive 7-day wellness immersion at a private clinic in Gstaad, combining cutting-edge longevity treatments with mindfulness practices. Includes personal chef, private helicopter transfers, and curated art therapy sessions.',
        category: 'Wellness',
        status: JourneyStatus.APPROVED,
        versions: [{
          id: 'v-seed-002',
          journeyId: 'journey-seed-002',
          versionNumber: 1,
          title: 'Swiss Alpine Wellness Retreat',
          narrative: 'An exclusive 7-day wellness immersion at a private clinic in Gstaad.',
          status: JourneyStatus.APPROVED,
          modifiedBy: 'b2b-rm-001-uuid-placeholder',
          approvedBy: 'b2b-compliance-001',
          createdAt: daysAgo(14),
        }],
        currentVersionId: 'v-seed-002',
        discretionLevel: 'High',
        isInvisible: false,
        emotionalObjective: 'Renewal and longevity through holistic wellbeing',
        strategicReasoning: 'Client expressed interest in preventive health and stress reduction',
        riskSummary: 'Minimal risk — Switzerland, established medical facility',
        createdAt: daysAgo(14),
        updatedAt: daysAgo(3),
      },
      {
        id: 'journey-seed-003',
        userId,
        title: 'Tokyo Art & Architecture Immersion',
        narrative: 'A 10-day cultural deep-dive into Japan\'s art scene with private gallery viewings, meetings with Living National Treasures, tea ceremony with a Grand Master, and exclusive access to Tadao Ando\'s private studio.',
        category: 'Travel',
        status: JourneyStatus.ARCHIVED,
        versions: [{
          id: 'v-seed-003',
          journeyId: 'journey-seed-003',
          versionNumber: 1,
          title: 'Tokyo Art & Architecture Immersion',
          narrative: 'A 10-day cultural deep-dive into Japan\'s art scene.',
          status: JourneyStatus.ARCHIVED,
          modifiedBy: 'b2b-rm-001-uuid-placeholder',
          createdAt: daysAgo(90),
        }],
        currentVersionId: 'v-seed-003',
        discretionLevel: 'Medium',
        isInvisible: false,
        emotionalObjective: 'Cultural enrichment and aesthetic inspiration',
        riskSummary: 'Low risk — completed successfully',
        createdAt: daysAgo(90),
        updatedAt: daysAgo(60),
      },
      {
        id: 'journey-seed-004',
        userId,
        title: 'Patagonia Private Estate Acquisition',
        narrative: 'Strategic acquisition of a 5,000-hectare estate in Argentine Patagonia for legacy preservation. Includes environmental impact assessment, local governance consultation, and bespoke lodge design by a Pritzker Prize architect.',
        category: 'Estate Planning',
        status: JourneyStatus.RM_REVIEW,
        versions: [{
          id: 'v-seed-004',
          journeyId: 'journey-seed-004',
          versionNumber: 1,
          title: 'Patagonia Private Estate Acquisition',
          narrative: 'Strategic acquisition of a 5,000-hectare estate in Argentine Patagonia.',
          status: JourneyStatus.RM_REVIEW,
          modifiedBy: userId,
          createdAt: daysAgo(5),
        }],
        currentVersionId: 'v-seed-004',
        discretionLevel: 'High',
        isInvisible: false,
        emotionalObjective: 'Legacy creation through land stewardship',
        strategicReasoning: 'Long-term asset diversification aligned with conservation values',
        riskSummary: 'Moderate — foreign land ownership regulations require local counsel',
        createdAt: daysAgo(5),
        updatedAt: daysAgo(1),
      },
      {
        id: 'journey-seed-005',
        userId,
        title: 'Next-Gen Philanthropy Blueprint',
        narrative: 'Design and launch of a family foundation focused on ocean conservation and marine science education. Includes board formation, grant strategy, and partnership with Sylvia Earle\'s Mission Blue initiative.',
        category: 'Philanthropy',
        status: JourneyStatus.DRAFT,
        versions: [{
          id: 'v-seed-005',
          journeyId: 'journey-seed-005',
          versionNumber: 1,
          title: 'Next-Gen Philanthropy Blueprint',
          narrative: 'Design and launch of a family foundation focused on ocean conservation.',
          status: JourneyStatus.DRAFT,
          modifiedBy: userId,
          createdAt: daysAgo(2),
        }],
        currentVersionId: 'v-seed-005',
        discretionLevel: 'Standard',
        isInvisible: false,
        emotionalObjective: 'Purpose and legacy through environmental stewardship',
        createdAt: daysAgo(2),
        updatedAt: daysAgo(1),
      },
      {
        id: 'journey-seed-006',
        userId,
        title: 'Private Concert Series — Vienna & Salzburg',
        narrative: 'An intimate 5-day musical journey featuring a private Vienna Philharmonic recital, backstage access at the Salzburg Festival, and a private dinner with a world-renowned pianist at Schloss Leopoldskron.',
        category: 'Concierge',
        status: JourneyStatus.PRESENTED,
        versions: [{
          id: 'v-seed-006',
          journeyId: 'journey-seed-006',
          versionNumber: 1,
          title: 'Private Concert Series — Vienna & Salzburg',
          narrative: 'An intimate 5-day musical journey featuring a private Vienna Philharmonic recital.',
          status: JourneyStatus.PRESENTED,
          modifiedBy: 'b2b-rm-001-uuid-placeholder',
          approvedBy: 'b2b-compliance-001',
          createdAt: daysAgo(10),
        }],
        currentVersionId: 'v-seed-006',
        discretionLevel: 'Medium',
        isInvisible: false,
        emotionalObjective: 'Artistic fulfillment and exclusive cultural access',
        strategicReasoning: 'Client is a patron of classical music with connections to European orchestras',
        riskSummary: 'Low risk — stable European destinations, established venues',
        createdAt: daysAgo(10),
        updatedAt: daysAgo(4),
      },
    ];

    // Also seed for other UHNI users
    const seedJourneys2: Journey[] = [
      {
        id: 'journey-seed-007',
        userId: 'user-uhni-002', // Charlotte Beaumont
        title: 'Bordeaux Vineyard Heritage Tour',
        narrative: 'A 5-day private tour of first-growth Bordeaux estates with exclusive barrel tastings and a private dinner at Château Margaux.',
        category: 'Travel',
        status: JourneyStatus.EXECUTED,
        versions: [{
          id: 'v-seed-007',
          journeyId: 'journey-seed-007',
          versionNumber: 1,
          title: 'Bordeaux Vineyard Heritage Tour',
          narrative: 'A 5-day private tour of first-growth Bordeaux estates.',
          status: JourneyStatus.EXECUTED,
          modifiedBy: 'b2b-rm-001-uuid-placeholder',
          createdAt: daysAgo(45),
        }],
        currentVersionId: 'v-seed-007',
        discretionLevel: 'Medium',
        isInvisible: false,
        emotionalObjective: 'Heritage appreciation and sensory exploration',
        createdAt: daysAgo(45),
        updatedAt: daysAgo(20),
      },
    ];

    this.setInStorage(this.STORAGE_KEY, [...seedJourneys, ...seedJourneys2]);

    // Collect all versions
    const allVersions = [...seedJourneys, ...seedJourneys2].flatMap(j => j.versions);
    this.setInStorage(this.VERSIONS_KEY, allVersions);
  }

  async getJourneys(userId: string, context: DomainContext): Promise<Journey[]> {
    await this.delay();
    const journeys = this.getFromStorage<Journey>(this.STORAGE_KEY);
    // B2B advisors see all journeys (across their institution's clients)
    // B2C members see only their own journeys
    if (context === 'b2b') {
      return journeys;
    }
    return journeys.filter(j => j.userId === userId);
  }

  async getJourneyById(id: string): Promise<Journey | null> {
    await this.delay();
    const journeys = this.getFromStorage<Journey>(this.STORAGE_KEY);
    return journeys.find(j => j.id === id) || null;
  }

  async createJourney(data: CreateJourneyInput): Promise<Journey> {
    await this.delay();

    const journeys = this.getFromStorage<Journey>(this.STORAGE_KEY);
    const versions = this.getFromStorage<JourneyVersion>(this.VERSIONS_KEY);

    const journeyId = this.generateId();
    const versionId = this.generateId();
    const now = this.now();

    // Create initial version
    const initialVersion: JourneyVersion = {
      id: versionId,
      journeyId,
      versionNumber: 1,
      title: data.title,
      narrative: data.narrative,
      status: JourneyStatus.DRAFT,
      modifiedBy: data.userId,
      createdAt: now
    };

    versions.push(initialVersion);
    this.setInStorage(this.VERSIONS_KEY, versions);

    // Create journey
    const journey: Journey = {
      id: journeyId,
      userId: data.userId,
      title: data.title,
      narrative: data.narrative,
      category: data.category,
      status: JourneyStatus.DRAFT,
      versions: [initialVersion],
      currentVersionId: versionId,
      isInvisible: false,
      createdAt: now,
      updatedAt: now
    };

    journeys.push(journey);
    this.setInStorage(this.STORAGE_KEY, journeys);

    return journey;
  }

  async updateJourney(id: string, data: Partial<Journey>): Promise<Journey> {
    await this.delay();

    const journeys = this.getFromStorage<Journey>(this.STORAGE_KEY);
    const index = journeys.findIndex(j => j.id === id);

    if (index === -1) {
      throw new Error(`Journey ${id} not found`);
    }

    const updated = {
      ...journeys[index],
      ...data,
      updatedAt: this.now()
    } as Journey;

    journeys[index] = updated;
    this.setInStorage(this.STORAGE_KEY, journeys);
    return updated;
  }

  async deleteJourney(id: string): Promise<boolean> {
    await this.delay();

    const journeys = this.getFromStorage<Journey>(this.STORAGE_KEY);
    const filtered = journeys.filter(j => j.id !== id);

    if (filtered.length === journeys.length) {
      return false; // Nothing deleted
    }

    this.setInStorage(this.STORAGE_KEY, filtered);
    return true;
  }

  async getJourneyVersions(journeyId: string): Promise<JourneyVersion[]> {
    await this.delay();

    const versions = this.getFromStorage<JourneyVersion>(this.VERSIONS_KEY);
    return versions.filter(v => v.journeyId === journeyId);
  }

  async createJourneyVersion(
    journeyId: string,
    data: Partial<JourneyVersion>
  ): Promise<JourneyVersion> {
    await this.delay();

    const versions = this.getFromStorage<JourneyVersion>(this.VERSIONS_KEY);
    const journeyVersions = versions.filter(v => v.journeyId === journeyId);
    const nextVersionNumber = journeyVersions.length + 1;

    const version: JourneyVersion = {
      id: this.generateId(),
      journeyId,
      versionNumber: nextVersionNumber,
      title: data.title || '',
      narrative: data.narrative || '',
      status: data.status || JourneyStatus.DRAFT,
      modifiedBy: data.modifiedBy || '',
      createdAt: this.now(),
      ...data
    };

    versions.push(version);
    this.setInStorage(this.VERSIONS_KEY, versions);

    // Update journey's current version
    const journeys = this.getFromStorage<Journey>(this.STORAGE_KEY);
    const journeyIndex = journeys.findIndex(j => j.id === journeyId);

    if (journeyIndex !== -1) {
      const journey = journeys[journeyIndex]!;
      journey.versions.push(version);
      journey.currentVersionId = version.id;
      journey.updatedAt = this.now();
      this.setInStorage(this.STORAGE_KEY, journeys);
    }

    return version;
  }
}
