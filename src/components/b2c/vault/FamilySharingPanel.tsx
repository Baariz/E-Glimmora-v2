'use client';

/**
 * Family Sharing Panel (VALT-04)
 * Toggle visibility for Spouse and Legacy Heir per memory entry.
 * Disabled when memory is locked.
 * Plain language explanations.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MemoryItem } from '@/lib/types/entities';

interface FamilySharingPanelProps {
  memory: MemoryItem;
  onUpdate: (sharingPermissions: string[]) => Promise<void>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FamilySharingPanel({ memory, onUpdate }: FamilySharingPanelProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const isSharedWithSpouse = memory.sharingPermissions.includes('spouse');
  const isSharedWithHeir = memory.sharingPermissions.includes('heir');

  const handleToggle = async (role: 'spouse' | 'heir') => {
    if (memory.isLocked) return;

    setIsUpdating(true);

    try {
      const current = memory.sharingPermissions;
      const updated = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role];

      await onUpdate(updated);
    } catch (error) {
      console.error('Failed to update sharing permissions:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-sand-200"
    >
      <h2 className="text-xl font-serif text-rose-900 mb-4">Family Sharing</h2>

      {memory.isLocked && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-sans text-amber-700">
            This memory is locked. Sharing permissions cannot be changed until unlocked.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Spouse sharing */}
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            id="share-spouse"
            checked={isSharedWithSpouse}
            onChange={() => handleToggle('spouse')}
            disabled={memory.isLocked || isUpdating}
            className="mt-1 w-5 h-5 rounded border-sand-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <label
              htmlFor="share-spouse"
              className={`block text-sm font-sans font-medium mb-1 ${
                memory.isLocked ? 'text-sand-400 cursor-not-allowed' : 'text-sand-700 cursor-pointer'
              }`}
            >
              Share with Spouse
            </label>
            <p className="text-xs font-sans text-sand-500">
              Your spouse will be able to view this memory in their shared vault.
            </p>
          </div>
        </div>

        {/* Heir sharing */}
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            id="share-heir"
            checked={isSharedWithHeir}
            onChange={() => handleToggle('heir')}
            disabled={memory.isLocked || isUpdating}
            className="mt-1 w-5 h-5 rounded border-sand-300 text-teal-600 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <label
              htmlFor="share-heir"
              className={`block text-sm font-sans font-medium mb-1 ${
                memory.isLocked ? 'text-sand-400 cursor-not-allowed' : 'text-sand-700 cursor-pointer'
              }`}
            >
              Share with Legacy Heir
            </label>
            <p className="text-xs font-sans text-sand-500">
              Your designated heir will inherit access to this memory according to your legacy plan.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
