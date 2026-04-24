/**
 * Real API InviteCode Service
 * Implements IInviteCodeService against the Elan Glimmora backend API.
 * See FRONTEND_EMAIL_INTEGRATION.docx §3.1, §4.1 for recipient_email/resend.
 */

import type { InviteCode, CreateInviteCodeInput, ResendInviteInput } from '@/lib/types';
import type { IInviteCodeService, ResendInviteResult } from '../interfaces/IInviteCodeService';
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
      const raw = await api.get<ApiInviteCode>(`/api/invites/${id}`);
      return toInviteCode(raw);
    } catch {
      return null;
    }
  }

  async getInviteCodeByCode(code: string): Promise<InviteCode | null> {
    try {
      const raw = await api.get<ApiInviteCode | ApiInviteCode[]>(
        `/api/invites?code=${encodeURIComponent(code)}`
      );
      const match = Array.isArray(raw) ? raw[0] : raw;
      return match ? toInviteCode(match) : null;
    } catch {
      return null;
    }
  }

  async createInviteCode(data: CreateInviteCodeInput): Promise<InviteCode> {
    const raw = await api.post<ApiInviteCode>('/api/invites', {
      type: data.type,
      created_by: data.createdBy,
      assigned_roles: data.assignedRoles,
      institution_id: data.institutionId || null,
      linked_uhni_id: data.linkedUhniId || null,
      max_uses: data.maxUses,
      expires_at: data.expiresAt || null,
      recipient_email: data.recipientEmail || null,
      recipient_name: data.recipientName || null,
    });
    return toInviteCode(raw);
  }

  async resendInvite(
    id: string,
    input: ResendInviteInput
  ): Promise<ResendInviteResult> {
    const raw = await api.post<{
      resent: boolean;
      delivered: boolean;
      invite: ApiInviteCode;
    }>(`/api/invites/${id}/resend`, {
      recipient_email: input.recipientEmail,
      recipient_name: input.recipientName || null,
    });
    return {
      resent: !!raw.resent,
      delivered: !!raw.delivered,
      invite: toInviteCode(raw.invite),
    };
  }

  async updateInviteCode(id: string, data: Partial<InviteCode>): Promise<InviteCode> {
    const body: Record<string, unknown> = {};
    if (data.type !== undefined) body.type = data.type;
    if (data.assignedRoles !== undefined) body.assigned_roles = data.assignedRoles;
    if (data.institutionId !== undefined) body.institution_id = data.institutionId || null;
    if (data.maxUses !== undefined) body.max_uses = data.maxUses;
    if (data.expiresAt !== undefined) body.expires_at = data.expiresAt || null;
    if (data.status !== undefined) body.status = data.status;
    const raw = await api.patch<ApiInviteCode>(`/api/invites/${id}`, body);
    return toInviteCode(raw);
  }

  async markAsUsed(id: string, usedByUserId: string): Promise<InviteCode> {
    const raw = await api.post<ApiInviteCode>(`/api/invites/${id}/use`, {
      used_by: usedByUserId,
    });
    return toInviteCode(raw);
  }

  async revokeInviteCode(id: string): Promise<InviteCode> {
    const raw = await api.post<ApiInviteCode>(`/api/invites/${id}/revoke`);
    return toInviteCode(raw);
  }
}
