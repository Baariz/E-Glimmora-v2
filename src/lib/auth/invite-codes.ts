/**
 * Invite code validation logic
 * Validates invite codes against business rules
 */

import { services } from '@/lib/services';
import type { InviteCode } from '@/lib/types';

export async function validateInviteCode(code: string): Promise<{
  valid: boolean;
  error?: string;
  inviteCode?: InviteCode
}> {
  const inviteCode = await services.inviteCode.getInviteCodeByCode(code);

  if (!inviteCode) {
    return { valid: false, error: 'Invalid invite code' };
  }

  if (inviteCode.status !== 'active') {
    return { valid: false, error: 'This invite code has already been used or expired' };
  }

  if (inviteCode.usedCount >= inviteCode.maxUses) {
    return { valid: false, error: 'This invite code has reached its usage limit' };
  }

  if (inviteCode.expiresAt && new Date(inviteCode.expiresAt) < new Date()) {
    return { valid: false, error: 'This invite code has expired' };
  }

  return { valid: true, inviteCode };
}
