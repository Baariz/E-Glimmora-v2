'use client';

/**
 * Global Erase Flow (PRIV-08)
 * Multi-step nuclear option for complete data deletion — luxury modal treatment
 */

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useServices } from '@/lib/hooks/useServices';
import { AlertTriangle, Trash2, Shield, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface GlobalEraseFlowProps {
  userId: string;
}

type EraseStep = 'warning' | 'confirm-text' | 'final-button' | 'executing' | 'complete';

export function GlobalEraseFlow({ userId }: GlobalEraseFlowProps) {
  const services = useServices();
  const [currentStep, setCurrentStep] = useState<EraseStep>('warning');
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const deletionChecklist = [
    'All journeys and itineraries',
    'All memories and vault content',
    'All messages and advisor threads',
    'Intent profile and DNA',
    'Intelligence briefs and analytics',
    'Privacy settings and configurations',
    'All shared access (Spouse, Heir, Advisor)',
  ];

  const handleExecuteGlobalErase = async () => {
    setCurrentStep('executing');
    setError(null);

    try {
      await services.privacy.executeGlobalErase(userId);
      setCurrentStep('complete');

      setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, 2000);
    } catch (err) {
      console.error('Global erase failed:', err);
      setError('Failed to execute global erase. Please try again.');
      setCurrentStep('final-button');
    }
  };

  return (
    <div className="bg-white border border-rose-200/60 rounded-2xl shadow-sm overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Step 1: Warning */}
        {currentStep === 'warning' && (
          <motion.div
            key="warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-7 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-7">
              <div className="w-11 h-11 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-stone-900 mb-2">
                  Global Data Erase
                </h3>
                <p className="text-stone-500 font-sans text-sm leading-[1.7] tracking-wide">
                  This action is <strong className="text-stone-700">irreversible</strong> and will permanently
                  delete all of your data from our systems.
                </p>
              </div>
            </div>

            {/* Deletion Checklist */}
            <div className="mb-7 p-5 bg-rose-50/50 border border-rose-200/60 rounded-xl">
              <p className="text-[10px] font-sans uppercase tracking-[4px] text-rose-500 mb-3">
                What will be deleted
              </p>
              <ul className="space-y-2.5">
                {deletionChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm font-sans text-stone-600">
                    <Trash2 size={12} className="text-rose-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-4 py-3.5 bg-amber-50 border border-amber-200/60 rounded-xl mb-7">
              <p className="text-[12px] font-sans text-amber-800 leading-[1.5]">
                This action cannot be undone. All data will be permanently erased and you
                will be logged out immediately.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep('confirm-text')}
                className="px-7 py-3.5 bg-rose-600 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-rose-700 transition-all shadow-sm"
              >
                Continue to Confirmation
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Type Confirmation */}
        {currentStep === 'confirm-text' && (
          <motion.div
            key="confirm-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-7 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-7">
              <div className="w-11 h-11 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-stone-900 mb-2">
                  Confirm Data Deletion
                </h3>
                <p className="text-stone-500 font-sans text-sm leading-[1.7] tracking-wide">
                  To proceed, please type{' '}
                  <code className="px-2 py-1 bg-stone-100 rounded-md text-[12px] font-mono text-rose-600">
                    DELETE MY DATA
                  </code>{' '}
                  in the field below.
                </p>
              </div>
            </div>

            <div className="mb-7">
              <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2">
                Confirmation
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type DELETE MY DATA"
                className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-mono text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 placeholder:text-stone-300"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setCurrentStep('warning');
                  setConfirmationText('');
                }}
                className="px-6 py-3.5 text-stone-500 font-sans text-[13px] font-medium tracking-wide hover:text-stone-700 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => setCurrentStep('final-button')}
                disabled={confirmationText !== 'DELETE MY DATA'}
                className={cn(
                  'px-7 py-3.5 font-sans text-[13px] font-semibold tracking-wide rounded-full transition-all',
                  confirmationText === 'DELETE MY DATA'
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
                    : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                )}
              >
                Continue to Final Step
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Final Button */}
        {currentStep === 'final-button' && (
          <motion.div
            key="final-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-7 sm:p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <Trash2 size={24} className="text-white" />
              </div>
              <h3 className="font-serif text-2xl text-stone-900 mb-3">
                Final Confirmation
              </h3>
              <p className="text-stone-500 font-sans text-sm leading-[1.7] tracking-wide max-w-sm mx-auto">
                This is your last chance to cancel. Clicking the button below will permanently
                erase all your data and log you out.
              </p>
            </div>

            {error && (
              <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200/60 rounded-xl">
                <p className="text-[12px] font-sans text-rose-700">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentStep('warning');
                  setConfirmationText('');
                  setError(null);
                }}
                className="px-7 py-3.5 text-stone-500 font-sans text-[13px] font-medium tracking-wide hover:text-stone-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteGlobalErase}
                className="px-8 py-3.5 bg-rose-600 text-white font-sans text-[13px] font-bold tracking-wide rounded-full hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl"
              >
                Permanently Delete All My Data
              </button>
            </div>
          </motion.div>
        )}

        {/* Executing State */}
        {currentStep === 'executing' && (
          <motion.div
            key="executing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-14 text-center"
          >
            <motion.div
              className="w-10 h-10 border-2 border-rose-300 border-t-rose-600 rounded-full mx-auto mb-5"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <h3 className="font-serif text-2xl text-stone-900 mb-2">Erasing your data...</h3>
            <p className="text-stone-400 font-sans text-sm tracking-wide">This will only take a moment.</p>
          </motion.div>
        )}

        {/* Complete State */}
        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-14 text-center"
          >
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200/60 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-2">Data Erased</h3>
            <p className="text-stone-400 font-sans text-sm tracking-wide">
              All your data has been permanently deleted. You will be logged out shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
