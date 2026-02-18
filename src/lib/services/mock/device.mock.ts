/**
 * Mock Device Service
 * localStorage-based implementation for trusted device management
 */

import { BaseMockService } from './base.mock';
import { IDeviceService } from '../interfaces/IDeviceService';
import { TrustedDevice } from '@/lib/types';

export class MockDeviceService extends BaseMockService implements IDeviceService {
  private readonly storageKey = 'devices';

  /**
   * Get all trusted devices for a user
   */
  async getDevicesByUserId(userId: string): Promise<TrustedDevice[]> {
    await this.delay();

    const devices = this.getFromStorage<TrustedDevice>(this.storageKey);
    return devices.filter((device) => device.userId === userId);
  }

  /**
   * Get a device by its token
   */
  async getDeviceByToken(token: string): Promise<TrustedDevice | null> {
    await this.delay();

    const devices = this.getFromStorage<TrustedDevice>(this.storageKey);
    const device = devices.find((d) => d.deviceToken === token);
    return device || null;
  }

  /**
   * Create a new trusted device
   */
  async createDevice(data: Omit<TrustedDevice, 'id' | 'createdAt'>): Promise<TrustedDevice> {
    await this.delay();

    const devices = this.getFromStorage<TrustedDevice>(this.storageKey);

    const newDevice: TrustedDevice = {
      id: this.generateId(),
      ...data,
      createdAt: this.now(),
    };

    devices.push(newDevice);
    this.setInStorage(this.storageKey, devices);

    return newDevice;
  }

  /**
   * Revoke a trusted device (set status to 'revoked')
   */
  async revokeDevice(id: string): Promise<TrustedDevice> {
    await this.delay();

    const devices = this.getFromStorage<TrustedDevice>(this.storageKey);
    const device = devices.find((d) => d.id === id);

    if (!device) {
      throw new Error(`Device with id ${id} not found`);
    }

    device.status = 'revoked';
    this.setInStorage(this.storageKey, devices);

    return device;
  }

  /**
   * Update the last used timestamp for a device
   */
  async updateLastUsed(id: string): Promise<void> {
    await this.delay();

    const devices = this.getFromStorage<TrustedDevice>(this.storageKey);
    const device = devices.find((d) => d.id === id);

    if (!device) {
      throw new Error(`Device with id ${id} not found`);
    }

    device.lastUsed = this.now();
    this.setInStorage(this.storageKey, devices);
  }
}
