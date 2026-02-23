'use client';

/**
 * Remove Access Flow Component (PRIV-07, COLB-06)
 * List invited people with remove/restrict access — luxury card style
 */

import { useState } from 'react';
import { User } from '@/lib/types';
import { B2CRole } from '@/lib/types/roles';
import { cn } from '@/lib/utils/cn';
import { UserMinus, Shield, AlertTriangle, X, Users } from 'lucide-react';
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-7 pt-7 pb-5 border-b border-stone-200/60">
            <button
              onClick={onCancel}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-all"
            >
              <X size={14} />
            </button>

            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center mb-4',
              isRemove ? 'bg-rose-50' : 'bg-stone-100'
            )}>
              {isRemove ? (
                <AlertTriangle size={17} className="text-rose-500" />
              ) : (
                <Shield size={17} className="text-stone-500" />
              )}
            </div>
            <h2 className="font-serif text-2xl text-stone-900 mb-1.5">
              {isRemove ? 'Remove Access?' : 'Restrict Access?'}
            </h2>
            <p className="text-stone-400 text-sm font-sans leading-[1.6] tracking-wide">
              {isRemove
                ? `${user.name} will no longer have access to any of your journeys or data.`
                : `You can customize which journeys and resources ${user.name} can access.`}
            </p>
          </div>

          {isRemove && (
            <div className="px-7 pt-5">
              <div className="px-4 py-3 bg-rose-50 border border-rose-200/60 rounded-xl">
                <p className="text-[12px] font-sans text-rose-700 leading-[1.5]">
                  This action cannot be undone. They will need a new invitation to regain access.
                </p>
              </div>
            </div>
          )}

          <div className="px-7 py-6 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 bg-stone-100 text-stone-500 font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-stone-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={cn(
                'flex-1 py-3.5 font-sans text-[13px] font-semibold tracking-wide rounded-full transition-all shadow-sm',
                isRemove
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              )}
            >
              {isRemove ? 'Remove Access' : 'Restrict Access'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getRoleLabel(role?: B2CRole): string {
  if (!role) return 'Unknown';
  switch (role) {
    case 'Spouse': return 'Spouse';
    case 'LegacyHeir': return 'Legacy Heir';
    case 'ElanAdvisor': return 'Advisor';
    default: return role;
  }
}

function getRoleBadgeStyle(role?: B2CRole): string {
  if (!role) return 'bg-stone-100 text-stone-500';
  switch (role) {
    case 'Spouse': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
    case 'LegacyHeir': return 'bg-stone-100 text-stone-600 border border-stone-200/60';
    case 'ElanAdvisor': return 'bg-stone-900 text-white';
    default: return 'bg-stone-100 text-stone-500';
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
      <div className="bg-white border border-stone-200/60 rounded-2xl p-10 sm:p-12 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-5">
          <Users size={20} className="text-stone-400" />
        </div>
        <h3 className="font-serif text-xl text-stone-800 mb-2">No one has been invited</h3>
        <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-sm mx-auto">
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
              className="bg-white border border-stone-200/60 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-sans text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium text-stone-900 truncate">{user.name}</p>
                  <p className="text-[11px] font-sans text-stone-400 tracking-wide truncate">{user.email}</p>
                </div>
                <div className={cn('px-3 py-1 rounded-full text-[10px] font-sans font-medium tracking-wide flex-shrink-0', getRoleBadgeStyle(role))}>
                  {getRoleLabel(role)}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {isAdvisor && (
                  <button
                    onClick={() => setConfirmModal({ isOpen: true, user, action: 'restrict' })}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-sans text-stone-500 tracking-wide hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <Shield size={12} />
                    Restrict
                  </button>
                )}
                <button
                  onClick={() => setConfirmModal({ isOpen: true, user, action: 'remove' })}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-sans text-rose-500 tracking-wide hover:bg-rose-50 rounded-full transition-colors"
                >
                  <UserMinus size={12} />
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
