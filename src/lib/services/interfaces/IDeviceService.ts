/**
 * Device Service Interface
 * Manages trusted devices for MFA skip functionality
 */

import { TrustedDevice } from '@/lib/types';

export interface IDeviceService {
  /**
   * Get all trusted devices for a user
   */
  getDevicesByUserId(userId: string): Promise<TrustedDevice[]>;

  /**
   * Get a device by its token
   */
  getDeviceByToken(token: string): Promise<TrustedDevice | null>;

  /**
   * Create a new trusted device
   */
  createDevice(data: Omit<TrustedDevice, 'id' | 'createdAt'>): Promise<TrustedDevice>;

  /**
   * Revoke a trusted device (set status to 'revoked')
   */
  revokeDevice(id: string): Promise<TrustedDevice>;

  /**
   * Update the last used timestamp for a device
   */
  updateLastUsed(id: string): Promise<void>;
}
