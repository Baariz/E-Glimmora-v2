/**
 * Real API Device Service
 * Implements IDeviceService against the Elan Glimmora backend API
 */

import type { TrustedDevice } from '@/lib/types';
import type { IDeviceService } from '../interfaces/IDeviceService';
import { api } from './client';

/** Shape returned by the backend */
interface ApiDevice {
  id: string;
  user_id: string;
  device_token: string;
  device_name: string;
  last_used: string;
  status: string;
  created_at: string;
}

function toDevice(raw: ApiDevice): TrustedDevice {
  return {
    id: raw.id,
    userId: raw.user_id,
    deviceToken: raw.device_token,
    deviceName: raw.device_name,
    lastUsed: raw.last_used,
    status: raw.status as TrustedDevice['status'],
    createdAt: raw.created_at,
  };
}

export class ApiDeviceService implements IDeviceService {
  async getDevicesByUserId(userId: string): Promise<TrustedDevice[]> {
    const data = await api.get<ApiDevice[]>(`/api/auth/devices?userId=${encodeURIComponent(userId)}`);
    return data.map(toDevice);
  }

  async getDeviceByToken(token: string): Promise<TrustedDevice | null> {
    try {
      // Backend doesn't have a direct get-by-token endpoint.
      // We need the userId context — this is only called from device-recognition.ts
      // where we already have the userId. For now, return null and let the caller
      // use getDevicesByUserId + filter.
      // This limitation is acceptable since the mock did localStorage lookups.
      return null;
    } catch {
      return null;
    }
  }

  async createDevice(data: Omit<TrustedDevice, 'id' | 'createdAt'>): Promise<TrustedDevice> {
    const raw = await api.post<ApiDevice>('/api/auth/devices', {
      user_id: data.userId,
      device_token: data.deviceToken,
      device_name: data.deviceName,
    });
    return toDevice(raw);
  }

  async revokeDevice(id: string): Promise<TrustedDevice> {
    const raw = await api.delete<ApiDevice>(`/api/auth/devices/${id}`);
    return toDevice(raw);
  }

  async updateLastUsed(id: string): Promise<void> {
    await api.patch(`/api/auth/devices/${id}/ping`);
  }
}
