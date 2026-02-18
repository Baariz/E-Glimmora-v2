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

  async getJourneys(userId: string, context: DomainContext): Promise<Journey[]> {
    await this.delay();
    const journeys = this.getFromStorage<Journey>(this.STORAGE_KEY);
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
