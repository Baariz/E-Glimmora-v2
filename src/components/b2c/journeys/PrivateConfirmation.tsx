'use client';

/**
 * Private Confirmation Screen
 * Shown when journey reaches PRESENTED status
 * Payment / confirmation step — no itemized costs, no retail checkout
 * On confirm: updates journey status to EXECUTED
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Landmark, KeyRound, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useServices } from '@/lib/hooks/useServices';
import { JourneyStatus, type PreDepartureBrief } from '@/lib/types/entities';
import { logger } from '@/lib/utils/logger';

type ConfirmationMethod = 'wealth_account' | 'secure_link' | null;

interface PrivateConfirmationProps {
  journeyTitle: string;
  journeyId: string;
  /**
   * Pre-departure brief from the journey. Phase 4 §6 — UHNI may see
   * `summary` and `logistics`, but NEVER `advisorNotes`.
   */
  preDepartureBrief?: PreDepartureBrief | null;
  onConfirmed?: () => void;
}

export function PrivateConfirmation({
  journeyTitle,
  journeyId,
  preDepartureBrief,
  onConfirmed,
}: PrivateConfirmationProps) {
  const services = useServices();
  const [method, setMethod] = useState<ConfirmationMethod>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!method) return;
    setIsProcessing(true);
    logger.action('PrivateConfirmation', 'confirm journey', { journeyId, method });

    // Simulate payment processing delay — 1.5 seconds for demo feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Move journey to EXECUTED after payment confirmed (Phase 4 Step 7)
      await services.journey.updateJourney(journeyId, {
        status: JourneyStatus.EXECUTED,
      });
    } catch (error) {
      logger.error('PrivateConfirmation', 'status update failed', error, { journeyId });
    }

    setIsProcessing(false);
    setConfirmed(true);
    onConfirmed?.();
  };

  // Safe logistics extraction — Phase 4 §10: UHNI may see summary + transfer/duration/contact.
  const logistics = preDepartureBrief?.logistics as
    | { transfer?: string; duration?: string; contact?: string }
    | null
    | undefined;
  const hasBrief = Boolean(preDepartureBrief?.summary);

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-emerald-200/60 rounded-2xl p-8 sm:p-10 text-center shadow-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-14 h-14 bg-emerald-50 border border-emerald-200/60 rounded-full flex items-center justify-center mx-auto mb-5"
        >
          <CheckCircle className="w-7 h-7 text-emerald-500" />
        </motion.div>
        <h3 className="font-serif text-2xl text-stone-900 mb-3">
          Your Experience Is Confirmed
        </h3>
        <p className="text-stone-500 text-sm font-sans leading-[1.7] tracking-wide max-w-sm mx-auto">
          Your journey has begun. Your team will be in touch with your pre-departure brief shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-sand-200/60 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-7 sm:px-8 pt-7 sm:pt-8 pb-6 border-b border-sand-200/60">
        <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
        <div className="flex items-center gap-2.5 mb-3">
          <Lock className="w-4 h-4 text-rose-400" />
          <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px]">
            Private Confirmation
          </p>
        </div>
        <h3 className="font-serif text-2xl text-stone-900 mb-2">{journeyTitle}</h3>
        <p className="text-stone-500 text-sm font-sans leading-[1.7] tracking-wide">
          Your experience has been secured. A private confirmation is all that remains.
        </p>
      </div>

      {/* Pre-Departure Brief (Phase 4 §6) — UHNI sees summary + logistics only. */}
      {hasBrief && (
        <div className="px-7 sm:px-8 py-6 border-b border-sand-200/60 bg-gradient-to-br from-rose-50/30 to-amber-50/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-amber-600 text-[10px] font-sans uppercase tracking-[4px]">
              Your Experience Brief
            </p>
          </div>
          <p className="text-stone-700 font-sans text-sm leading-[1.75] tracking-wide whitespace-pre-wrap mb-4">
            {preDepartureBrief!.summary}
          </p>

          {logistics && (logistics.transfer || logistics.duration || logistics.contact) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-sand-200/40">
              {logistics.transfer && (
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-[3px] font-sans mb-1">
                    Transfer
                  </p>
                  <p className="text-stone-700 font-sans text-xs leading-relaxed">
                    {logistics.transfer}
                  </p>
                </div>
              )}
              {logistics.duration && (
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-[3px] font-sans mb-1">
                    Duration
                  </p>
                  <p className="text-stone-700 font-sans text-xs leading-relaxed">
                    {logistics.duration}
                  </p>
                </div>
              )}
              {logistics.contact && (
                <div>
                  <p className="text-[9px] text-stone-400 uppercase tracking-[3px] font-sans mb-1">
                    Contact
                  </p>
                  <p className="text-stone-700 font-sans text-xs leading-relaxed">
                    {logistics.contact}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-7 sm:px-8 py-7 sm:py-8">
        <p className="text-stone-400 text-[11px] font-sans leading-[1.7] tracking-wide mb-6">
          Select your preferred confirmation method. No card details are required —
          all transactions are handled through your pre-established arrangement.
        </p>

        <div className="space-y-3 mb-7">
          {[
            {
              value: 'wealth_account' as const,
              title: 'Authorize from Preferred Account',
              description: 'Settled through your pre-authorized wealth account. No further details required.',
              icon: Landmark,
            },
            {
              value: 'secure_link' as const,
              title: 'Receive Secure Confirmation Link',
              description: 'A private link will be sent to your registered contact. Valid for 24 hours.',
              icon: KeyRound,
            },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMethod(opt.value)}
              disabled={isProcessing}
              className={cn(
                'w-full text-left p-5 rounded-xl border transition-all duration-300',
                method === opt.value
                  ? 'border-rose-400 bg-rose-50/40'
                  : 'border-sand-200/60 bg-sand-50/50 hover:border-rose-300',
                isProcessing && 'opacity-40 cursor-not-allowed'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                  method === opt.value ? 'bg-rose-100' : 'bg-white border border-sand-200/60'
                )}>
                  <opt.icon className={cn(
                    'w-5 h-5 transition-colors',
                    method === opt.value ? 'text-rose-500' : 'text-stone-400'
                  )} />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-stone-700 mb-0.5">{opt.title}</p>
                  <p className="font-sans text-[11px] text-stone-400 leading-[1.7] tracking-wide">{opt.description}</p>
                </div>
                {/* Radio indicator */}
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-auto mt-1 transition-colors',
                  method === opt.value ? 'border-rose-500' : 'border-sand-200'
                )}>
                  {method === opt.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 rounded-full bg-rose-500"
                    />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!method || isProcessing}
          className={cn(
            'w-full py-3.5 rounded-full font-sans text-[13px] font-semibold tracking-wide transition-all flex items-center justify-center gap-2.5',
            method && !isProcessing
              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg'
              : 'bg-sand-100 text-stone-300 cursor-not-allowed'
          )}
        >
          {isProcessing ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Processing your confirmation...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Approve This Experience
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-stone-300 font-sans mt-4 tracking-wide">
          Your advisor is available if you have any questions before confirming.
        </p>
      </div>
    </div>
  );
}
