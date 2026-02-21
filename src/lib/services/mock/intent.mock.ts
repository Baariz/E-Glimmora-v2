/**
 * Mock Intent Service
 * localStorage-based implementation for intent profiles
 */

import { BaseMockService } from './base.mock';
import { IIntentService } from '../interfaces/IIntentService';
import { IntentProfile, CreateIntentProfileInput } from '@/lib/types';

export class MockIntentService extends BaseMockService implements IIntentService {
  private readonly STORAGE_KEY = 'intent_profiles';

  constructor() {
    super();
    this.seedIfEmpty();
  }

  /**
   * Seed a realistic UHNI intent profile (idempotent)
   */
  private seedIfEmpty(): void {
    const existing = this.getFromStorage<IntentProfile>(this.STORAGE_KEY);
    if (existing.length > 0) {
      return;
    }

    const now = new Date().toISOString();
    const seedProfiles: IntentProfile[] = [
      {
        id: 'intent-seed-001',
        userId: 'c7e1f2a0-4b3d-4e5f-8a9b-1c2d3e4f5a6b', // MOCK_UHNI_USER_ID
        emotionalDrivers: {
          security: 72,
          adventure: 58,
          legacy: 85,
          recognition: 35,
          autonomy: 68,
        },
        riskTolerance: 'Moderate',
        values: ['Privacy', 'Family Legacy', 'Cultural Immersion', 'Wellness'],
        lifeStage: 'Preserving',
        travelMode: 'Luxury',
        preferredSeason: 'Autumn',
        priorities: ['Privacy', 'Family Legacy', 'Wellness', 'Cultural Immersion'],
        discretionPreference: 'High',
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        updatedAt: now,
      },
    ];

    this.setInStorage(this.STORAGE_KEY, seedProfiles);
  }

  async getIntentProfile(userId: string): Promise<IntentProfile | null> {
    await this.delay();
    const profiles = this.getFromStorage<IntentProfile>(this.STORAGE_KEY);
    return profiles.find(p => p.userId === userId) || null;
  }

  async createIntentProfile(data: CreateIntentProfileInput): Promise<IntentProfile> {
    await this.delay();

    const profiles = this.getFromStorage<IntentProfile>(this.STORAGE_KEY);
    const now = this.now();

    const profile: IntentProfile = {
      id: this.generateId(),
      userId: data.userId,
      emotionalDrivers: data.emotionalDrivers,
      riskTolerance: data.riskTolerance,
      values: data.values,
      lifeStage: data.lifeStage,
      travelMode: data.travelMode,
      priorities: data.priorities,
      discretionPreference: data.discretionPreference,
      createdAt: now,
      updatedAt: now
    };

    profiles.push(profile);
    this.setInStorage(this.STORAGE_KEY, profiles);

    return profile;
  }

  async updateIntentProfile(
    userId: string,
    data: Partial<IntentProfile>
  ): Promise<IntentProfile> {
    await this.delay();

    const profiles = this.getFromStorage<IntentProfile>(this.STORAGE_KEY);
    const index = profiles.findIndex(p => p.userId === userId);

    if (index === -1) {
      throw new Error(`Intent profile for user ${userId} not found`);
    }

    const updated = {
      ...profiles[index],
      ...data,
      updatedAt: this.now()
    } as IntentProfile;

    profiles[index] = updated;
    this.setInStorage(this.STORAGE_KEY, profiles);
    return updated;
  }

  calculateAlignmentBaseline(profile: IntentProfile): number {
    // Calculate weighted alignment score based on emotional drivers
    const { emotionalDrivers } = profile;

    // Simple weighted average (can be enhanced with more complex algorithms)
    const totalDriverScore =
      emotionalDrivers.security * 0.25 +
      emotionalDrivers.adventure * 0.15 +
      emotionalDrivers.legacy * 0.25 +
      emotionalDrivers.recognition * 0.15 +
      emotionalDrivers.autonomy * 0.20;

    // Normalize to 0-100 scale
    return Math.round(totalDriverScore);
  }
}
