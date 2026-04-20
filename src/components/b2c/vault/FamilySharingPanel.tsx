'use client';

/**
 * Family Sharing Panel (Frontend_Integration_Guide.docx §5.7)
 * Toggle role-based vault sharing for Spouse and Legacy Heir per memory entry.
 * Writes to MemoryItem.sharingRoles (PATCH /api/vault/:id body field sharing_roles).
 * Disabled when memory is locked.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MemoryItem, VaultSharingRole } from '@/lib/types/entities';
import { Users, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { logger } from '@/lib/utils/logger';

interface FamilySharingPanelProps {
  memory: MemoryItem;
  onUpdate: (sharingRoles: VaultSharingRole[]) => Promise<void>;
}

export function FamilySharingPanel({ memory, onUpdate }: FamilySharingPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const current: VaultSharingRole[] = memory.sharingRoles ?? [];
  const isSharedWithSpouse = current.includes('spouse');
  const isSharedWithHeir = current.includes('heir');

  const handleToggle = async (role: VaultSharingRole) => {
    if (memory.isLocked || isUpdating) return;

    setIsUpdating(true);
    logger.action('Vault', 'toggle sharing role', {
      memoryId: memory.id,
      role,
      currentlyShared: current.includes(role),
    });

    try {
      const updated: VaultSharingRole[] = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role];

      await onUpdate(updated);
    } catch (error) {
      logger.error('Vault', 'sharing role update failed', error, {
        memoryId: memory.id,
        role,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-7 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
          <Users size={13} className="text-stone-400" />
        </div>
        <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400">
          Family Sharing
        </p>
      </div>

      {memory.isLocked && (
        <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-200/60 rounded-xl flex items-center gap-3">
          <Lock size={13} className="text-amber-500 flex-shrink-0" />
          <p className="text-[12px] font-sans text-amber-700 leading-[1.5] tracking-wide">
            Sharing is locked. Unlock this memory to change permissions.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Spouse sharing */}
        <button
          onClick={() => handleToggle('spouse')}
          disabled={memory.isLocked || isUpdating}
          className={cn(
            'w-full flex items-center gap-4 px-4 py-4 rounded-xl border transition-all text-left',
            memory.isLocked
              ? 'border-stone-200/40 opacity-50 cursor-not-allowed'
              : isSharedWithSpouse
              ? 'border-[#3d2024]/30 bg-rose-50/50'
              : 'border-stone-200/60 hover:border-stone-300'
          )}
        >
          {/* Custom toggle */}
          <div
            className={cn(
              'w-10 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0',
              isSharedWithSpouse ? 'bg-[#3d2024]' : 'bg-stone-200'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                isSharedWithSpouse ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-sans font-medium text-stone-700">
              Share with Spouse
            </p>
            <p className="text-[11px] font-sans text-stone-400 leading-[1.5] tracking-wide mt-0.5">
              Visible in their shared vault
            </p>
          </div>
        </button>

        {/* Heir sharing */}
        <button
          onClick={() => handleToggle('heir')}
          disabled={memory.isLocked || isUpdating}
          className={cn(
            'w-full flex items-center gap-4 px-4 py-4 rounded-xl border transition-all text-left',
            memory.isLocked
              ? 'border-stone-200/40 opacity-50 cursor-not-allowed'
              : isSharedWithHeir
              ? 'border-[#3d2024]/30 bg-rose-50/50'
              : 'border-stone-200/60 hover:border-stone-300'
          )}
        >
          <div
            className={cn(
              'w-10 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0',
              isSharedWithHeir ? 'bg-[#3d2024]' : 'bg-stone-200'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                isSharedWithHeir ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-sans font-medium text-stone-700">
              Share with Legacy Heir
            </p>
            <p className="text-[11px] font-sans text-stone-400 leading-[1.5] tracking-wide mt-0.5">
              Inherited according to your legacy plan
            </p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
