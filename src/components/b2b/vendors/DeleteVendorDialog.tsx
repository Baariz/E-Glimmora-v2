'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteVendorDialogProps {
  open: boolean;
  vendorName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteVendorDialog({ open, vendorName, onClose, onConfirm }: DeleteVendorDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErr(null);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleConfirm = async () => {
    setSubmitting(true);
    setErr(null);
    try {
      await onConfirm();
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to delete vendor');
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
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-rose-900">Delete Vendor</h2>
                <p className="text-xs font-sans text-sand-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-sand-400 hover:text-sand-700" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-3">
            <p className="text-sm font-sans text-sand-700">
              Delete <strong className="text-rose-900">{vendorName}</strong>? All associated screenings, scorecards, and notes will be removed.
            </p>
            {err && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">{err}</div>
            )}
          </div>

          <div className="flex justify-end gap-2 p-6 border-t border-sand-100">
            <button type="button" onClick={onClose} disabled={submitting}
              className="px-4 py-2 text-sm font-sans font-medium text-sand-700 bg-sand-100 rounded-lg hover:bg-sand-200 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={handleConfirm} disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium text-white bg-rose-700 rounded-lg hover:bg-rose-800 disabled:opacity-50">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Vendor
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
