'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowRight } from 'lucide-react';
import type { VendorStatus } from '@/lib/types';
import { VENDOR_STATUS_TRANSITIONS } from '@/lib/types/entities';

interface StatusChangeDialogProps {
  open: boolean;
  vendorName: string;
  currentStatus: VendorStatus;
  onClose: () => void;
  onConfirm: (next: VendorStatus) => Promise<void>;
}

const STATUS_STYLES: Record<VendorStatus, string> = {
  'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
  Approved: 'bg-blue-100 text-blue-800 border-blue-200',
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Suspended: 'bg-rose-100 text-rose-800 border-rose-200',
  Rejected: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function StatusChangeDialog({ open, vendorName, currentStatus, onClose, onConfirm }: StatusChangeDialogProps) {
  const [next, setNext] = useState<VendorStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const allowed = VENDOR_STATUS_TRANSITIONS[currentStatus] || [];

  useEffect(() => {
    if (open) {
      setNext(allowed[0] ?? null);
      setErr(null);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentStatus]);

  const handleConfirm = async () => {
    if (!next) return;
    setSubmitting(true);
    setErr(null);
    try {
      await onConfirm(next);
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to change status');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, y: 10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full"
        >
          <div className="flex items-start justify-between p-6 border-b border-sand-100">
            <div>
              <h2 className="font-serif text-lg text-rose-900">Change Vendor Status</h2>
              <p className="text-xs font-sans text-sand-500 mt-0.5">{vendorName}</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-sand-400 hover:text-sand-700" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-sans border ${STATUS_STYLES[currentStatus]}`}>{currentStatus}</span>
              <ArrowRight className="w-4 h-4 text-sand-400" />
              {next ? (
                <span className={`px-2.5 py-1 rounded-full text-xs font-sans border ${STATUS_STYLES[next]}`}>{next}</span>
              ) : (
                <span className="text-xs text-sand-500">No transitions available</span>
              )}
            </div>

            {allowed.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-sans text-sand-600">Select new status:</p>
                <div className="flex flex-wrap gap-2">
                  {allowed.map((s) => (
                    <button key={s} type="button" onClick={() => setNext(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans border transition-colors ${next === s ? STATUS_STYLES[s] + ' ring-2 ring-offset-1 ring-rose-400' : 'border-sand-200 text-sand-700 hover:bg-sand-50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {allowed.length === 0 && (
              <p className="text-sm font-sans text-sand-600">
                <strong>{currentStatus}</strong> is a terminal state — no further transitions allowed.
              </p>
            )}

            {err && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">{err}</div>
            )}
          </div>

          <div className="flex justify-end gap-2 p-6 border-t border-sand-100">
            <button type="button" onClick={onClose} disabled={submitting}
              className="px-4 py-2 text-sm font-sans font-medium text-sand-700 bg-sand-100 rounded-lg hover:bg-sand-200 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleConfirm} disabled={submitting || !next || allowed.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium text-white bg-rose-900 rounded-lg hover:bg-rose-800 disabled:opacity-50">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm Change
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
