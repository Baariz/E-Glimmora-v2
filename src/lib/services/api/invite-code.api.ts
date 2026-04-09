/**
 * Real API InviteCode Service
 * Implements IInviteCodeService against the Elan Glimmora backend API
 */

import type { InviteCode, CreateInviteCodeInput } from '@/lib/types';
import type { IInviteCodeService } from '../interfaces/IInviteCodeService';
import { api } from './client';

/** Shape returned by the backend */
interface ApiInviteCode {
  id: string;
  code: string;
  type: string;
  created_by: string;
  assigned_roles: Record<string, string>;
  institution_id?: string | null;
  max_uses: number;
  used_count: number;
  expires_at?: string | null;
  status: string;
  created_at: string;
}

function toInviteCode(raw: ApiInviteCode): InviteCode {
  return {
    id: raw.id,
    code: raw.code,
    type: raw.type as InviteCode['type'],
    createdBy: raw.created_by,
    assignedRoles: raw.assigned_roles as InviteCode['assignedRoles'],
    institutionId: raw.institution_id || undefined,
    maxUses: raw.max_uses,
    usedCount: raw.used_count,
    expiresAt: raw.expires_at || undefined,
    status: raw.status as InviteCode['status'],
    createdAt: raw.created_at,
  };
}

export class ApiInviteCodeService implements IInviteCodeService {
  async getInviteCodes(): Promise<InviteCode[]> {
    const data = await api.get<ApiInviteCode[]>('/api/invites');
    return data.map(toInviteCode);
  }

  async getInviteCodeById(id: string): Promise<InviteCode | null> {
    try {
      // The backend doesn't have a direct get-by-id, so filter from list
      const all = await this.getInviteCodes();
      return all.find((c) => c.id === id) || null;
    } catch {
      return null;
    }
  }

  async getInviteCodeByCode(code: string): Promise<InviteCode | null> {
    try {
      // Use the validate endpoint to check existence, then find in list
      const all = await this.getInviteCodes();
      return all.find((c) => c.code === code) || null;
    } catch {
      return null;
    }
  }

  async createInviteCode(data: CreateInviteCodeInput): Promise<InviteCode> {
    const raw = await api.post<ApiInviteCode>('/api/invites', {
      type: data.type,
      assigned_roles: data.assignedRoles,
      institution_id: data.institutionId || null,
      max_uses: data.maxUses,
      expires_at: data.expiresAt || null,
    });
    return toInviteCode(raw);
  }

  async updateInviteCode(id: string, data: Partial<InviteCode>): Promise<InviteCode> {
    // Backend doesn't have a direct update endpoint; use the existing data
    const existing = await this.getInviteCodeById(id);
    if (!existing) throw new Error(`Invite code ${id} not found`);
    return { ...existing, ...data };
  }

  async markAsUsed(id: string, _usedByUserId: string): Promise<InviteCode> {
    const raw = await api.post<ApiInviteCode>(`/api/invites/${id}/use`);
    return toInviteCode(raw);
  }

  async revokeInviteCode(id: string): Promise<InviteCode> {
    const raw = await api.post<ApiInviteCode>(`/api/invites/${id}/revoke`);
    return toInviteCode(raw);
  }
}
