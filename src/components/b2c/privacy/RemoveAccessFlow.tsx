'use client';

/**
 * Remove Access Flow Component (PRIV-07, COLB-06)
 * List invited people with remove/restrict access controls
 */

import { useState } from 'react';
import { User } from '@/lib/types';
import { B2CRole } from '@/lib/types/roles';
import { cn } from '@/lib/utils/cn';
import { UserMinus, Shield, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RemoveAccessFlowProps {
  invitedUsers: User[];
  onRemoveAccess: (userId: string) => void;
  onRestrictAccess: (userId: string) => void;
}

interface ConfirmModalProps {
  isOpen: boolean;
  user: User | null;
  action: 'remove' | 'restrict';
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ isOpen, user, action, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen || !user) return null;

  const isRemove = action === 'remove';
  const role = user.roles.b2c || '';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/40"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={cn('flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center', isRemove ? 'bg-rose-100' : 'bg-sand-100')}>
              {isRemove ? (
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              ) : (
                <Shield className="w-6 h-6 text-sand-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-xl text-stone-900 mb-1">
                {isRemove ? 'Remove Access?' : 'Restrict Access?'}
              </h3>
              <p className="text-stone-600">
                {isRemove
                  ? `${user.name} will no longer have access to any of your journeys or data.`
                  : `You can customize which journeys and resources ${user.name} can access.`}
              </p>
            </div>
          </div>

          {isRemove && (
            <div className="bg-rose-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-rose-800">
                This action cannot be undone. They will need a new invitation to regain access.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border-2 border-stone-300 rounded-lg text-stone-700 font-medium hover:border-stone-400 hover:bg-stone-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={cn(
                'flex-1 px-4 py-2.5 font-medium rounded-lg transition-all',
                isRemove
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-sand-600 text-white hover:bg-sand-700'
              )}
            >
              {isRemove ? 'Remove Access' : 'Restrict Access'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function getRoleLabel(role?: B2CRole): string {
  if (!role) return 'Unknown';

  switch (role) {
    case 'Spouse':
      return 'Spouse';
    case 'LegacyHeir':
      return 'Legacy Heir';
    case 'ElanAdvisor':
      return 'Elan Advisor';
    default:
      return role;
  }
}

function getRoleColor(role?: B2CRole): string {
  if (!role) return 'bg-stone-100 text-stone-700';

  switch (role) {
    case 'Spouse':
      return 'bg-teal-100 text-teal-700';
    case 'LegacyHeir':
      return 'bg-sand-100 text-sand-700';
    case 'ElanAdvisor':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-stone-100 text-stone-700';
  }
}

export function RemoveAccessFlow({
  invitedUsers,
  onRemoveAccess,
  onRestrictAccess,
}: RemoveAccessFlowProps) {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    user: User | null;
    action: 'remove' | 'restrict';
  }>({
    isOpen: false,
    user: null,
    action: 'remove',
  });

  const handleConfirm = () => {
    if (!confirmModal.user) return;

    if (confirmModal.action === 'remove') {
      onRemoveAccess(confirmModal.user.id);
    } else {
      onRestrictAccess(confirmModal.user.id);
    }

    setConfirmModal({ isOpen: false, user: null, action: 'remove' });
  };

  const handleCancel = () => {
    setConfirmModal({ isOpen: false, user: null, action: 'remove' });
  };

  if (invitedUsers.length === 0) {
    return (
      <div className="bg-stone-50 rounded-xl p-8 text-center">
        <p className="text-stone-600">No one has been invited yet.</p>
        <p className="text-sm text-stone-500 mt-1">
          Use the invite buttons above to grant access to your spouse, heir, or advisor.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {invitedUsers.map((user) => {
          const role = user.roles.b2c;
          const isAdvisor = role === 'ElanAdvisor';

          return (
            <div
              key={user.id}
              className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-stone-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                  <span className="text-stone-600 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-stone-900">{user.name}</div>
                  <div className="text-sm text-stone-500">{user.email}</div>
                </div>
                <div className={cn('px-3 py-1 rounded-full text-xs font-medium', getRoleColor(role))}>
                  {getRoleLabel(role)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAdvisor && (
                  <button
                    onClick={() => setConfirmModal({ isOpen: true, user, action: 'restrict' })}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-sand-700 hover:bg-sand-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Restrict
                  </button>
                )}
                <button
                  onClick={() => setConfirmModal({ isOpen: true, user, action: 'remove' })}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        user={confirmModal.user}
        action={confirmModal.action}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
