'use client';

/**
 * MemberActions Component
 * Action buttons for approve/suspend/remove with audit logging
 */

import { useState } from 'react';
import { CheckCircle, XCircle, PlayCircle, Trash2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { User } from '@/lib/types';
import { toast } from 'sonner';

interface MemberActionsProps {
  user: User;
  onAction: () => void; // Refresh callback
}

export function MemberActions({ user, onAction }: MemberActionsProps) {
  const services = useServices();
  const [loading, setLoading] = useState(false);

  // Determine user state
  const roleValues = Object.values(user.roles).filter(Boolean);
  const isPending = roleValues.length === 0;
  const isSuspended = user.erasedAt?.startsWith('SUSPENDED:');
  const isRemoved = user.erasedAt?.startsWith('REMOVED:');
  const isActive = !user.erasedAt && roleValues.length > 0;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await services.user.updateUserStatus(user.id, 'active');

      // Audit log
      services.audit.log({
        event: 'member.approve',
        userId: 'admin-super-001', // Current admin user
        resourceId: user.id,
        resourceType: 'user',
        context: 'admin',
        action: 'APPROVE',
        metadata: {
          email: user.email,
          name: user.name,
          previousStatus: 'pending',
          newStatus: 'active',
        },
      });

      toast.success(`${user.name} approved successfully`);
      onAction();
    } catch (error) {
      toast.error('Failed to approve member');
      console.error('Approve error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    const confirmed = window.confirm(
      `Suspend ${user.name}? They will lose access to the platform until reactivated.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await services.user.updateUserStatus(user.id, 'suspended');

      // Audit log
      services.audit.log({
        event: 'member.suspend',
        userId: 'admin-super-001',
        resourceId: user.id,
        resourceType: 'user',
        context: 'admin',
        action: 'UPDATE',
        previousState: { status: 'active' },
        newState: { status: 'suspended' },
        metadata: {
          email: user.email,
          name: user.name,
        },
      });

      toast.success(`${user.name} suspended`);
      onAction();
    } catch (error) {
      toast.error('Failed to suspend member');
      console.error('Suspend error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true);
    try {
      await services.user.updateUserStatus(user.id, 'active');

      // Audit log
      services.audit.log({
        event: 'member.reactivate',
        userId: 'admin-super-001',
        resourceId: user.id,
        resourceType: 'user',
        context: 'admin',
        action: 'UPDATE',
        previousState: { status: isSuspended ? 'suspended' : 'removed' },
        newState: { status: 'active' },
        metadata: {
          email: user.email,
          name: user.name,
        },
      });

      toast.success(`${user.name} reactivated`);
      onAction();
    } catch (error) {
      toast.error('Failed to reactivate member');
      console.error('Reactivate error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    const confirmed = window.confirm(
      `Remove ${user.name}? This marks their account as removed but preserves audit history.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await services.user.updateUserStatus(user.id, 'removed');

      // Audit log
      services.audit.log({
        event: 'member.remove',
        userId: 'admin-super-001',
        resourceId: user.id,
        resourceType: 'user',
        context: 'admin',
        action: 'DELETE',
        previousState: { status: isSuspended ? 'suspended' : 'active' },
        newState: { status: 'removed' },
        metadata: {
          email: user.email,
          name: user.name,
        },
      });

      toast.success(`${user.name} removed`);
      onAction();
    } catch (error) {
      toast.error('Failed to remove member');
      console.error('Remove error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isPending && (
        <button
          onClick={handleApprove}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white text-sm font-sans rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CheckCircle size={16} />
          Approve
        </button>
      )}

      {isActive && (
        <button
          onClick={handleSuspend}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white text-sm font-sans rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <XCircle size={16} />
          Suspend
        </button>
      )}

      {(isSuspended || isRemoved) && (
        <button
          onClick={handleReactivate}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white text-sm font-sans rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PlayCircle size={16} />
          Reactivate
        </button>
      )}

      {isSuspended && (
        <button
          onClick={handleRemove}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm font-sans rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 size={16} />
          Remove
        </button>
      )}
    </div>
  );
}
