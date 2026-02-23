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
import { motion, AnimatePresence } from 'framer-motion';
import type { MemoryItem } from '@/lib/types/entities';
import { Edit, Lock, Unlock, Download, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MemoryActionsProps {
  memory: MemoryItem;
  onLock: (condition: string) => Promise<void>;
  onUnlock: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export function MemoryActions({ memory, onLock, onUnlock, onDelete }: MemoryActionsProps) {
  const router = useRouter();

  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockCondition, setLockCondition] = useState('');
  const [isLocking, setIsLocking] = useState(false);

  const [showEraseDialog, setShowEraseDialog] = useState(false);
  const [eraseConfirmation, setEraseConfirmation] = useState('');
  const [isErasing, setIsErasing] = useState(false);

  const handleEdit = () => {
    router.push(`/vault/new?edit=${memory.id}`);
  };

  const handleLock = async () => {
    if (!lockCondition.trim()) return;

    setIsLocking(true);
    try {
      await onLock(lockCondition);
      setShowLockDialog(false);
      setLockCondition('');
    } catch (error) {
      console.error('Failed to lock memory:', error);
    } finally {
      setIsLocking(false);
    }
  };

  const handleUnlock = async () => {
    try {
      await onUnlock();
    } catch (error) {
      console.error('Failed to unlock memory:', error);
    }
  };

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

  const handleErase = async () => {
    if (eraseConfirmation !== 'ERASE') return;

    setIsErasing(true);
    try {
      await onDelete();
      router.push('/vault');
    } catch (error) {
      console.error('Failed to erase memory:', error);
      setIsErasing(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-7 shadow-sm"
      >
        <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-5">
          Actions
        </p>

        <div className="space-y-2.5">
          {/* Edit */}
          {!memory.isLocked && (
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-stone-200/60 hover:border-stone-300 hover:bg-stone-50 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                <Edit size={13} className="text-stone-500" />
              </div>
              <span className="text-sm font-sans text-stone-600 tracking-wide">Edit Memory</span>
            </button>
          )}

          {/* Lock/Unlock */}
          {memory.isLocked ? (
            <button
              onClick={handleUnlock}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-amber-200/60 hover:border-amber-300 hover:bg-amber-50 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Unlock size={13} className="text-amber-600" />
              </div>
              <span className="text-sm font-sans text-amber-700 tracking-wide">Unlock Memory</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLockDialog(true)}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-stone-200/60 hover:border-amber-300 hover:bg-amber-50 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Lock size={13} className="text-stone-500 group-hover:text-amber-600" />
              </div>
              <span className="text-sm font-sans text-stone-600 tracking-wide">Lock Memory</span>
            </button>
          )}

          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-stone-200/60 hover:border-stone-300 hover:bg-stone-50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
              <Download size={13} className="text-stone-500" />
            </div>
            <span className="text-sm font-sans text-stone-600 tracking-wide">Export as JSON</span>
          </button>

          {/* Erase */}
          <button
            onClick={() => setShowEraseDialog(true)}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-rose-200/60 hover:border-rose-300 hover:bg-rose-50 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
              <Trash2 size={13} className="text-rose-500" />
            </div>
            <span className="text-sm font-sans text-rose-600 tracking-wide">Erase Permanently</span>
          </button>
        </div>
      </motion.div>

      {/* ═══════ LOCK DIALOG ═══════ */}
      <AnimatePresence>
        {showLockDialog && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLockDialog(false)}
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
                  onClick={() => setShowLockDialog(false)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-all"
                >
                  <X size={14} />
                </button>

                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <Lock size={17} className="text-amber-600" />
                </div>
                <h2 className="font-serif text-2xl text-stone-900 mb-1.5">Lock Memory</h2>
                <p className="text-stone-400 text-sm font-sans leading-[1.6] tracking-wide">
                  Once locked, this memory cannot be edited or deleted. Specify a condition for unlocking.
                </p>
              </div>

              <div className="px-7 py-6">
                <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2">
                  Unlock Condition
                </label>
                <textarea
                  value={lockCondition}
                  onChange={(e) => setLockCondition(e.target.value)}
                  placeholder="e.g., Upon my passing, After my children turn 18..."
                  rows={3}
                  className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-sans text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300 resize-none placeholder:text-stone-300"
                />
              </div>

              <div className="px-7 pb-7 flex gap-3">
                <button
                  onClick={() => setShowLockDialog(false)}
                  className="flex-1 py-3.5 bg-stone-100 text-stone-500 font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-stone-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLock}
                  disabled={!lockCondition.trim() || isLocking}
                  className={cn(
                    'flex-1 py-3.5 font-sans text-[13px] font-semibold tracking-wide rounded-full transition-all',
                    lockCondition.trim() && !isLocking
                      ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                      : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  )}
                >
                  {isLocking ? 'Locking...' : 'Lock Memory'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ ERASE DIALOG ═══════ */}
      <AnimatePresence>
        {showEraseDialog && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowEraseDialog(false); setEraseConfirmation(''); }}
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
                  onClick={() => { setShowEraseDialog(false); setEraseConfirmation(''); }}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-all"
                >
                  <X size={14} />
                </button>

                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                  <Trash2 size={17} className="text-rose-500" />
                </div>
                <h2 className="font-serif text-2xl text-stone-900 mb-1.5">Erase Permanently</h2>
                <p className="text-stone-400 text-sm font-sans leading-[1.6] tracking-wide">
                  This cannot be undone. All links to journeys and shared permissions will be removed.
                </p>
              </div>

              <div className="px-7 py-6">
                <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2">
                  Type ERASE to confirm
                </label>
                <input
                  type="text"
                  value={eraseConfirmation}
                  onChange={(e) => setEraseConfirmation(e.target.value)}
                  className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-mono text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 placeholder:text-stone-300"
                  placeholder="ERASE"
                />
              </div>

              <div className="px-7 pb-7 flex gap-3">
                <button
                  onClick={() => { setShowEraseDialog(false); setEraseConfirmation(''); }}
                  className="flex-1 py-3.5 bg-stone-100 text-stone-500 font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-stone-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleErase}
                  disabled={isErasing || eraseConfirmation !== 'ERASE'}
                  className={cn(
                    'flex-1 py-3.5 font-sans text-[13px] font-semibold tracking-wide rounded-full transition-all',
                    eraseConfirmation === 'ERASE' && !isErasing
                      ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
                      : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  )}
                >
                  {isErasing ? 'Erasing...' : 'Erase Permanently'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
