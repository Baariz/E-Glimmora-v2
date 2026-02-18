/**
 * Privacy Service Interface
 * Manages privacy settings and global data erase
 */

import { PrivacySettings, UpdatePrivacySettingsInput } from '@/lib/types';

export interface IPrivacyService {
  getSettings(userId: string): Promise<PrivacySettings | null>;
  updateSettings(userId: string, data: UpdatePrivacySettingsInput): Promise<PrivacySettings>;
  executeGlobalErase(userId: string): Promise<void>;
}
