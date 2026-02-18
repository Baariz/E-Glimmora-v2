'use client';

/**
 * Global Erase Flow (PRIV-08)
 * Multi-step nuclear option for complete data deletion
 * Step 1: Warning with deletion checklist
 * Step 2: Type "DELETE MY DATA" confirmation
 * Step 3: Final red button execution
 */

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useServices } from '@/lib/hooks/useServices';
import { AlertTriangle, Loader2, Trash2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      // Execute the nuclear option
      await services.privacy.executeGlobalErase(userId);

      // Show completion message briefly
      setCurrentStep('complete');

      // Auto-redirect to signOut after 2 seconds
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
    <div className="bg-white rounded-lg shadow-sm border border-rose-200 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Step 1: Warning */}
        {currentStep === 'warning' && (
          <motion.div
            key="warning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-rose-900 mb-2">
                  Global Data Erase
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  This action is <strong>irreversible</strong> and will permanently delete all of your data
                  from our systems. This is the ultimate privacy sovereign action.
                </p>
              </div>
            </div>

            {/* Deletion Checklist */}
            <div className="mb-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h4 className="font-medium text-stone-900 mb-3">What will be deleted:</h4>
              <ul className="space-y-2">
                {deletionChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-stone-700">
                    <Trash2 className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-900 font-medium">
                ⚠️ This action cannot be undone. All data will be permanently erased and you will be
                logged out immediately.
              </p>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setCurrentStep('confirm-text')}
                className="px-6 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-all"
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
            className="p-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-rose-900 mb-2">
                  Confirm Data Deletion
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  To proceed, please type{' '}
                  <code className="px-2 py-1 bg-stone-100 rounded text-sm font-mono text-rose-600">
                    DELETE MY DATA
                  </code>{' '}
                  in the field below.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type DELETE MY DATA"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-sm"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setCurrentStep('warning');
                  setConfirmationText('');
                }}
                className="px-6 py-2 text-stone-600 hover:text-stone-900 font-medium transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => setCurrentStep('final-button')}
                disabled={confirmationText !== 'DELETE MY DATA'}
                className="px-6 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all"
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
            className="p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-serif text-2xl text-rose-900 mb-2">
                Final Confirmation
              </h3>
              <p className="text-stone-600 max-w-md mx-auto">
                This is your last chance to cancel. Clicking the button below will permanently erase
                all your data and log you out.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentStep('warning');
                  setConfirmationText('');
                  setError(null);
                }}
                className="px-6 py-3 text-stone-600 hover:text-stone-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteGlobalErase}
                className="px-8 py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl"
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
            className="p-12 text-center"
          >
            <Loader2 className="w-12 h-12 animate-spin text-rose-600 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-stone-900 mb-2">Erasing your data...</h3>
            <p className="text-stone-600">This will only take a moment.</p>
          </motion.div>
        )}

        {/* Complete State */}
        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-12 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-serif text-2xl text-stone-900 mb-2">Data Erased</h3>
            <p className="text-stone-600">
              All your data has been permanently deleted. You will be logged out shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
