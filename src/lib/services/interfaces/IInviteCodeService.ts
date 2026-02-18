/**
 * Invite Code Service Interface
 * Manages invite codes for invite-only registration
 */

import { InviteCode, CreateInviteCodeInput } from '@/lib/types';

export interface IInviteCodeService {
  getInviteCodes(): Promise<InviteCode[]>;
  getInviteCodeById(id: string): Promise<InviteCode | null>;
  getInviteCodeByCode(code: string): Promise<InviteCode | null>;
  createInviteCode(data: CreateInviteCodeInput): Promise<InviteCode>;
  updateInviteCode(id: string, data: Partial<InviteCode>): Promise<InviteCode>;
  markAsUsed(id: string, usedByUserId: string): Promise<InviteCode>;
  revokeInviteCode(id: string): Promise<InviteCode>;
}
