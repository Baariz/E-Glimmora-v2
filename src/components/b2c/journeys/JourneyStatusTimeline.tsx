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
    <div className="bg-white border border-sand-200/60 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-7 sm:px-8 pt-7 sm:pt-8 pb-6">
        <div className="w-10 h-px bg-rose-300 mb-5" />
        <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
          Your Experience
        </p>
        <h3 className="font-serif text-2xl text-stone-900 mb-4">{journeyTitle}</h3>

        {/* Current step message */}
        <div className="bg-rose-50/60 border border-rose-200/40 rounded-xl px-5 py-4 flex items-start gap-3">
          <div className="relative w-2.5 h-2.5 mt-1.5 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-40" />
            <div className="relative rounded-full bg-rose-400 w-2.5 h-2.5" />
          </div>
          <p className="text-stone-600 font-sans text-sm leading-[1.7] tracking-wide">
            {currentStepData?.clientMessage}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-7 sm:px-8 pb-7 sm:pb-8">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-sand-200/80" />

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
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="relative flex items-start gap-5 pb-5 last:pb-0"
                >
                  {/* Step circle */}
                  <div className={cn(
                    'relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                    isCompleted && 'bg-emerald-50 border border-emerald-300',
                    isCurrent && 'bg-rose-500 shadow-md shadow-rose-200/50',
                    isFuture && 'bg-white border border-sand-200',
                  )}>
                    {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                    {isFuture && <span className="text-[10px] text-stone-300 font-sans">{step.number}</span>}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <p className={cn(
                        'font-sans text-sm',
                        isCompleted && 'text-emerald-600 font-medium',
                        isCurrent && 'text-stone-900 font-semibold',
                        isFuture && 'text-stone-300',
                      )}>{step.label}</p>

                      {(isCurrent || (isFuture && step.number === currentStep + 1)) && (
                        <span className={cn(
                          'text-[10px] font-sans px-2.5 py-1 rounded-full tracking-wide',
                          isCurrent
                            ? 'bg-rose-50 text-rose-500 border border-rose-200/60'
                            : 'bg-sand-50 text-stone-400 border border-sand-200/60'
                        )}>{step.expectedTiming}</span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-sans text-emerald-500 tracking-wide">Completed</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {currentStep < 7 && (
          <p className="text-[10px] text-stone-300 font-sans text-center mt-4 tracking-wide">
            {10 - currentStep - 3} further steps ahead
          </p>
        )}
      </div>
    </div>
  );
}
