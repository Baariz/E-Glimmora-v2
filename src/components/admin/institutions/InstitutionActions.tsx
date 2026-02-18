'use client';

/**
 * InstitutionActions Component
 * Action buttons for activate/suspend/reactivate/remove/edit with audit logging
 */

import { useState } from 'react';
import { CheckCircle, XCircle, PlayCircle, Trash2, Edit } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { Institution } from '@/lib/types';
import { toast } from 'sonner';

interface InstitutionActionsProps {
  institution: Institution;
  onAction: () => void;
  onEditToggle?: () => void;
}

export function InstitutionActions({ institution, onAction, onEditToggle }: InstitutionActionsProps) {
  const services = useServices();
  const [loading, setLoading] = useState(false);

  const isPending = institution.status === 'Pending';
  const isSuspended = institution.status === 'Suspended';
  const isActive = institution.status === 'Active';

  const handleActivate = async () => {
    setLoading(true);
    try {
      await services.institution.reactivateInstitution(institution.id);

      services.audit.log({
        event: 'institution.activate',
        userId: 'admin-super-001',
        resourceId: institution.id,
        resourceType: 'institution',
        context: 'admin',
        action: 'APPROVE',
        previousState: { status: 'Pending' },
        newState: { status: 'Active' },
        metadata: {
          name: institution.name,
        },
      });

      toast.success(`${institution.name} activated`);
      onAction();
    } catch (error) {
      toast.error('Failed to activate institution');
      console.error('Activate error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    const confirmed = window.confirm(
      `Suspend ${institution.name}? All users from this institution will lose access.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await services.institution.suspendInstitution(institution.id);

      services.audit.log({
        event: 'institution.suspend',
        userId: 'admin-super-001',
        resourceId: institution.id,
        resourceType: 'institution',
        context: 'admin',
        action: 'UPDATE',
        previousState: { status: 'Active' },
        newState: { status: 'Suspended' },
        metadata: {
          name: institution.name,
        },
      });

      toast.success(`${institution.name} suspended`);
      onAction();
    } catch (error) {
      toast.error('Failed to suspend institution');
      console.error('Suspend error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true);
    try {
      await services.institution.reactivateInstitution(institution.id);

      services.audit.log({
        event: 'institution.reactivate',
        userId: 'admin-super-001',
        resourceId: institution.id,
        resourceType: 'institution',
        context: 'admin',
        action: 'UPDATE',
        previousState: { status: 'Suspended' },
        newState: { status: 'Active' },
        metadata: {
          name: institution.name,
        },
      });

      toast.success(`${institution.name} reactivated`);
      onAction();
    } catch (error) {
      toast.error('Failed to reactivate institution');
      console.error('Reactivate error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    const confirmed = window.confirm(
      `Remove ${institution.name}? This will end their contract and suspend access.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await services.institution.removeInstitution(institution.id);

      services.audit.log({
        event: 'institution.remove',
        userId: 'admin-super-001',
        resourceId: institution.id,
        resourceType: 'institution',
        context: 'admin',
        action: 'DELETE',
        previousState: { status: institution.status },
        newState: { status: 'Suspended', contractEnded: true },
        metadata: {
          name: institution.name,
        },
      });

      toast.success(`${institution.name} removed`);
      onAction();
    } catch (error) {
      toast.error('Failed to remove institution');
      console.error('Remove error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {onEditToggle && (
        <button
          onClick={onEditToggle}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 text-white text-sm font-sans rounded-md hover:bg-slate-700 transition-colors"
        >
          <Edit size={16} />
          Edit
        </button>
      )}

      {isPending && (
        <button
          onClick={handleActivate}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white text-sm font-sans rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CheckCircle size={16} />
          Activate
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

      {isSuspended && (
        <>
          <button
            onClick={handleReactivate}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white text-sm font-sans rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PlayCircle size={16} />
            Reactivate
          </button>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm font-sans rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </>
      )}
    </div>
  );
}
