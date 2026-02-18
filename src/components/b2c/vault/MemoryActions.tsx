'use client';

/**
 * Memory Actions (VALT-05, VALT-06, VALT-07)
 * Action panel for memory detail page.
 * - Edit: navigate to /vault/new?edit=[id]
 * - Lock/Unlock: dialog for condition, locks memory
 * - Export: JSON download via Blob + URL.createObjectURL
 * - Erase Permanently: requires typing "ERASE", cascade deletes from journeys
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { MemoryItem } from '@/lib/types/entities';
import { Edit, Lock, Unlock, Download, Trash2 } from 'lucide-react';

interface MemoryActionsProps {
  memory: MemoryItem;
  onLock: (condition: string) => Promise<void>;
  onUnlock: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MemoryActions({ memory, onLock, onUnlock, onDelete }: MemoryActionsProps) {
  const router = useRouter();

  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockCondition, setLockCondition] = useState('');
  const [isLocking, setIsLocking] = useState(false);

  const [showEraseDialog, setShowEraseDialog] = useState(false);
  const [eraseConfirmation, setEraseConfirmation] = useState('');
  const [isErasing, setIsErasing] = useState(false);

  // Navigate to edit page
  const handleEdit = () => {
    router.push(`/vault/new?edit=${memory.id}`);
  };

  // Lock memory
  const handleLock = async () => {
    if (!lockCondition.trim()) {
      alert('Please specify an unlock condition');
      return;
    }

    setIsLocking(true);

    try {
      await onLock(lockCondition);
      setShowLockDialog(false);
      setLockCondition('');
    } catch (error) {
      console.error('Failed to lock memory:', error);
      alert('Failed to lock memory. Please try again.');
    } finally {
      setIsLocking(false);
    }
  };

  // Unlock memory
  const handleUnlock = async () => {
    const confirmed = confirm('Unlock this memory? It will become editable again.');
    if (!confirmed) return;

    try {
      await onUnlock();
    } catch (error) {
      console.error('Failed to unlock memory:', error);
      alert('Failed to unlock memory. Please try again.');
    }
  };

  // Export as JSON
  const handleExport = () => {
    const exportData = {
      ...memory,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-${memory.id}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Erase permanently
  const handleErase = async () => {
    if (eraseConfirmation !== 'ERASE') {
      alert('Please type "ERASE" to confirm permanent deletion');
      return;
    }

    setIsErasing(true);

    try {
      await onDelete();
      router.push('/vault');
    } catch (error) {
      console.error('Failed to erase memory:', error);
      alert('Failed to erase memory. Please try again.');
      setIsErasing(false);
    }
  };

  return (
    <>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-sand-200"
      >
        <h2 className="text-xl font-serif text-rose-900 mb-4">Actions</h2>

        <div className="space-y-3">
          {/* Edit */}
          {!memory.isLocked && (
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-sand-200 hover:border-teal-400 hover:bg-teal-50 transition-colors text-left"
            >
              <Edit className="w-5 h-5 text-sand-600" />
              <span className="text-sm font-sans text-sand-700">Edit Memory</span>
            </button>
          )}

          {/* Lock/Unlock */}
          {memory.isLocked ? (
            <button
              onClick={handleUnlock}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-sand-200 hover:border-amber-400 hover:bg-amber-50 transition-colors text-left"
            >
              <Unlock className="w-5 h-5 text-sand-600" />
              <span className="text-sm font-sans text-sand-700">Unlock Memory</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLockDialog(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-sand-200 hover:border-amber-400 hover:bg-amber-50 transition-colors text-left"
            >
              <Lock className="w-5 h-5 text-sand-600" />
              <span className="text-sm font-sans text-sand-700">Lock Memory</span>
            </button>
          )}

          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-sand-200 hover:border-teal-400 hover:bg-teal-50 transition-colors text-left"
          >
            <Download className="w-5 h-5 text-sand-600" />
            <span className="text-sm font-sans text-sand-700">Export as JSON</span>
          </button>

          {/* Erase Permanently */}
          <button
            onClick={() => setShowEraseDialog(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-rose-200 hover:border-rose-400 hover:bg-rose-50 transition-colors text-left"
          >
            <Trash2 className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-sans text-rose-700">Erase Permanently</span>
          </button>
        </div>
      </motion.div>

      {/* Lock Dialog */}
      {showLockDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-serif text-rose-900 mb-4">Lock Memory</h3>
            <p className="text-sm font-sans text-sand-600 mb-4">
              Once locked, this memory cannot be edited or deleted. Specify a condition
              under which it should be unlocked.
            </p>

            <textarea
              value={lockCondition}
              onChange={(e) => setLockCondition(e.target.value)}
              placeholder="e.g., Upon my passing, After my children turn 18, When I retire..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-sans resize-none mb-4"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleLock}
                disabled={isLocking}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg font-sans text-sm hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {isLocking ? 'Locking...' : 'Lock Memory'}
              </button>
              <button
                onClick={() => setShowLockDialog(false)}
                className="flex-1 px-4 py-2 text-sand-600 rounded-lg font-sans text-sm hover:bg-sand-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Erase Dialog */}
      {showEraseDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-serif text-rose-900 mb-4">Erase Permanently</h3>
            <p className="text-sm font-sans text-sand-600 mb-4">
              This action cannot be undone. This memory will be permanently deleted,
              including all links to journeys and shared permissions.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-sans text-sand-700 mb-2">
                Type <strong>ERASE</strong> to confirm
              </label>
              <input
                type="text"
                value={eraseConfirmation}
                onChange={(e) => setEraseConfirmation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition font-mono"
                placeholder="ERASE"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleErase}
                disabled={isErasing || eraseConfirmation !== 'ERASE'}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg font-sans text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isErasing ? 'Erasing...' : 'Erase Permanently'}
              </button>
              <button
                onClick={() => {
                  setShowEraseDialog(false);
                  setEraseConfirmation('');
                }}
                className="flex-1 px-4 py-2 text-sand-600 rounded-lg font-sans text-sm hover:bg-sand-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
