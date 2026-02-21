'use client';

/**
 * Private Confirmation Screen
 * Shown when journey reaches PRESENTED status
 * Payment / confirmation step — no itemized costs, no retail checkout
 * On confirm: updates journey status to EXECUTED
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useServices } from '@/lib/hooks/useServices';
import { JourneyStatus } from '@/lib/types/entities';

type ConfirmationMethod = 'wealth_account' | 'secure_link' | null;

interface PrivateConfirmationProps {
  journeyTitle: string;
  journeyId: string;
  onConfirmed?: () => void;
}

export function PrivateConfirmation({ journeyTitle, journeyId, onConfirmed }: PrivateConfirmationProps) {
  const services = useServices();
  const [method, setMethod] = useState<ConfirmationMethod>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!method) return;
    setIsProcessing(true);

    // Simulate payment processing delay — 1.5 seconds for demo feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Move journey to EXECUTED after payment confirmed
      await services.journey.updateJourney(journeyId, {
        status: JourneyStatus.EXECUTED,
      });
    } catch (error) {
      console.error('Failed to update journey status:', error);
    }

    setIsProcessing(false);
    setConfirmed(true);
    onConfirmed?.();
  };

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-8 text-center"
      >
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="font-serif text-xl text-emerald-900 mb-2">
          Your experience is confirmed.
        </h3>
        <p className="text-emerald-700 font-sans text-sm">
          Your journey has begun. Your Élan team will be in touch with your pre-departure brief shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-rose-900 to-rose-800 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-4 h-4 text-rose-300" />
          <p className="text-rose-300 text-xs font-sans uppercase tracking-widest">Private Confirmation Required</p>
        </div>
        <h3 className="font-serif text-xl text-white">{journeyTitle}</h3>
        <p className="text-rose-200 text-sm font-sans mt-1">
          Your experience has been secured. A private confirmation is all that remains.
        </p>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-6">
        <p className="text-sand-600 font-sans text-sm mb-5">
          Select your preferred confirmation method. No card details are required —
          all transactions are handled through your pre-established arrangement.
        </p>

        <div className="space-y-3 mb-6">
          {[
            { value: 'wealth_account' as const, title: 'Authorize from Preferred Account', description: 'Settled through your pre-authorized wealth account. No further details required.', icon: '\uD83C\uDFDB\uFE0F' },
            { value: 'secure_link' as const, title: 'Receive Secure Confirmation Link', description: 'A private link will be sent to your registered contact. Valid for 24 hours.', icon: '\uD83D\uDD10' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMethod(opt.value)}
              disabled={isProcessing}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                method === opt.value ? 'border-rose-400 bg-rose-50' : 'border-sand-200 hover:border-sand-300',
                isProcessing && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{opt.icon}</span>
                <div>
                  <p className="font-sans text-sm font-medium text-rose-900">{opt.title}</p>
                  <p className="font-sans text-xs text-sand-500 mt-0.5">{opt.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!method || isProcessing}
          className={cn(
            'w-full py-3 rounded-xl font-sans font-medium text-sm transition-all',
            method && !isProcessing
              ? 'bg-rose-900 text-white hover:bg-rose-800'
              : 'bg-sand-100 text-sand-400 cursor-not-allowed'
          )}
        >
          {isProcessing ? 'Processing your confirmation...' : 'Approve This Experience'}
        </button>

        <p className="text-center text-xs text-sand-400 font-sans mt-3">
          Your advisor is available if you have any questions before confirming.
        </p>
      </div>
    </div>
  );
}
