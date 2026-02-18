/**
 * Mock Privacy Service
 * localStorage-based implementation for privacy settings and global erase
 */

import { BaseMockService } from './base.mock';
import { IPrivacyService } from '../interfaces/IPrivacyService';
import { PrivacySettings, UpdatePrivacySettingsInput } from '@/lib/types';

export class MockPrivacyService extends BaseMockService implements IPrivacyService {
  private readonly STORAGE_KEY = 'privacy-settings';

  async getSettings(userId: string): Promise<PrivacySettings | null> {
    await this.delay();
    const allSettings = this.getFromStorage<PrivacySettings>(this.STORAGE_KEY);
    return allSettings.find(s => s.userId === userId) || null;
  }

  async updateSettings(userId: string, data: UpdatePrivacySettingsInput): Promise<PrivacySettings> {
    await this.delay();

    const allSettings = this.getFromStorage<PrivacySettings>(this.STORAGE_KEY);
    const existingIndex = allSettings.findIndex(s => s.userId === userId);

    const now = this.now();

    if (existingIndex !== -1) {
      // Update existing settings
      const existing = allSettings[existingIndex]!;
      const updated: PrivacySettings = {
        id: existing.id,
        userId: existing.userId,
        discretionTier: data.discretionTier ?? existing.discretionTier,
        invisibleItineraryDefault: data.invisibleItineraryDefault ?? existing.invisibleItineraryDefault,
        dataRetention: data.dataRetention ?? existing.dataRetention,
        analyticsOptOut: data.analyticsOptOut ?? existing.analyticsOptOut,
        thirdPartySharing: data.thirdPartySharing ?? existing.thirdPartySharing,
        advisorVisibilityScope: data.advisorVisibilityScope ?? existing.advisorVisibilityScope,
        advisorResourcePermissions: data.advisorResourcePermissions ?? existing.advisorResourcePermissions,
        globalEraseRequested: data.globalEraseRequested ?? existing.globalEraseRequested,
        globalEraseExecutedAt: existing.globalEraseExecutedAt,
        createdAt: existing.createdAt,
        updatedAt: now,
      };

      allSettings[existingIndex] = updated;
      this.setInStorage(this.STORAGE_KEY, allSettings);
      return updated;
    } else {
      // Create new settings with defaults
      const newSettings: PrivacySettings = {
        id: this.generateId(),
        userId,
        discretionTier: data.discretionTier || 'Standard',
        invisibleItineraryDefault: data.invisibleItineraryDefault ?? false,
        dataRetention: data.dataRetention ?? 0,
        analyticsOptOut: data.analyticsOptOut ?? false,
        thirdPartySharing: data.thirdPartySharing ?? false,
        advisorVisibilityScope: data.advisorVisibilityScope || [],
        globalEraseRequested: data.globalEraseRequested ?? false,
        createdAt: now,
        updatedAt: now,
      };

      allSettings.push(newSettings);
      this.setInStorage(this.STORAGE_KEY, allSettings);
      return newSettings;
    }
  }

  async executeGlobalErase(userId: string): Promise<void> {
    await this.delay();

    if (typeof window === 'undefined') {
      return;
    }

    // Mark privacy settings as erased
    const allSettings = this.getFromStorage<PrivacySettings>(this.STORAGE_KEY);
    const index = allSettings.findIndex(s => s.userId === userId);

    if (index !== -1) {
      const existing = allSettings[index]!;
      allSettings[index] = {
        ...existing,
        globalEraseRequested: true,
        globalEraseExecutedAt: this.now(),
        updatedAt: this.now(),
      };
      this.setInStorage(this.STORAGE_KEY, allSettings);
    }

    // Delete ALL user data from localStorage (nuclear option)
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('elan:')) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => localStorage.removeItem(key));

    console.warn(`Global erase executed for user ${userId}. All localStorage data removed.`);
  }
}
