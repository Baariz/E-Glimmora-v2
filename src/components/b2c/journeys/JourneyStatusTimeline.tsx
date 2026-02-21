'use client';

/**
 * Journey Status Timeline
 * 10-step calm, luxury progress view for UHNI
 * Shows current step with expected timing — no percentages, no progress bars
 * Language is warm and confident, like a private secretary speaking
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { JourneyStatus } from '@/lib/types/entities';

interface Step {
  number: number;
  label: string;
  clientMessage: string;
  expectedTiming: string;
}

const JOURNEY_STEPS: Step[] = [
  { number: 1, label: 'Intent Received', clientMessage: 'Your experience is being shaped.', expectedTiming: 'Immediate' },
  { number: 2, label: 'Intelligence Preparing', clientMessage: 'Our intelligence is preparing your curated brief.', expectedTiming: 'Within a few hours' },
  { number: 3, label: 'Advisor Review', clientMessage: 'Your advisor is reviewing the finest options for you.', expectedTiming: 'Typically within 24 hours' },
  { number: 4, label: 'Awaiting Your Conversation', clientMessage: 'Your advisor will be in touch to present your options.', expectedTiming: 'Within 1–2 days' },
  { number: 5, label: 'Securing Your Access', clientMessage: 'Your exclusive access is being locked in.', expectedTiming: 'Typically 2–3 days' },
  { number: 6, label: 'Confirmation', clientMessage: 'A private confirmation is ready for your approval.', expectedTiming: 'At your convenience' },
  { number: 7, label: 'Pre-Departure Brief', clientMessage: 'Your advisor is preparing your arrival summary.', expectedTiming: '48 hours before travel' },
  { number: 8, label: 'Your Journey', clientMessage: 'Enjoy your experience. We are quietly here if needed.', expectedTiming: 'During travel' },
  { number: 9, label: 'Welcome Back', clientMessage: 'We hope your experience was everything it should be.', expectedTiming: 'On your return' },
  { number: 10, label: 'Reflection', clientMessage: 'Share how it felt. Your future experiences begin here.', expectedTiming: 'When you are ready' },
];

export function getStepFromStatus(status: JourneyStatus): number {
  const map: Record<JourneyStatus, number> = {
    [JourneyStatus.DRAFT]: 1,
    [JourneyStatus.RM_REVIEW]: 3,
    [JourneyStatus.COMPLIANCE_REVIEW]: 5,
    [JourneyStatus.APPROVED]: 6,
    [JourneyStatus.PRESENTED]: 7,
    [JourneyStatus.EXECUTED]: 8,
    [JourneyStatus.ARCHIVED]: 9,
  };
  return map[status] ?? 1;
}

interface JourneyStatusTimelineProps {
  status: JourneyStatus;
  journeyTitle: string;
}

export function JourneyStatusTimeline({ status, journeyTitle }: JourneyStatusTimelineProps) {
  const currentStep = getStepFromStatus(status);
  const currentStepData = JOURNEY_STEPS[currentStep - 1];

  return (
    <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-rose-900 to-rose-800 px-4 sm:px-8 py-4 sm:py-6">
        <p className="text-rose-200 text-xs font-sans uppercase tracking-widest mb-1">Your Experience</p>
        <h3 className="font-serif text-xl text-white mb-3">{journeyTitle}</h3>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-rose-100 font-sans text-sm">{currentStepData?.clientMessage}</p>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-6">
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-sand-200" />
          <div className="space-y-0">
            {JOURNEY_STEPS.map((step, index) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isFuture = step.number > currentStep;
              const isVisible = Math.abs(step.number - currentStep) <= 3;
              if (!isVisible && isFuture) return null;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex items-start gap-5 pb-5"
                >
                  <div className={cn(
                    'relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                    isCompleted && 'bg-emerald-100 border-2 border-emerald-500',
                    isCurrent && 'bg-rose-900 border-2 border-rose-900 shadow-md shadow-rose-200',
                    isFuture && 'bg-white border-2 border-sand-200',
                  )}>
                    {isCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                    {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    {isFuture && <span className="text-xs text-sand-400 font-sans">{step.number}</span>}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <p className={cn(
                        'font-sans text-sm font-medium',
                        isCompleted && 'text-emerald-700',
                        isCurrent && 'text-rose-900',
                        isFuture && 'text-sand-400',
                      )}>{step.label}</p>
                      {(isCurrent || (isFuture && step.number === currentStep + 1)) && (
                        <span className={cn(
                          'text-xs font-sans px-2 py-0.5 rounded-full',
                          isCurrent ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-sand-50 text-sand-500 border border-sand-200'
                        )}>{step.expectedTiming}</span>
                      )}
                      {isCompleted && <span className="text-xs font-sans text-emerald-600">Completed</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        {currentStep < 7 && (
          <p className="text-xs text-sand-400 font-sans text-center mt-2">
            {10 - currentStep - 3} further steps ahead
          </p>
        )}
      </div>
    </div>
  );
}
