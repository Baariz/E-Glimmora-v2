'use client';

/**
 * Alignment Baseline (INTN-08)
 * Light luxury coherence score card with rose/amber accents.
 */

import { IntentProfile } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface AlignmentBaselineProps {
  profile: IntentProfile;
  score: number;
  className?: string;
}

export function AlignmentBaseline({ profile, score, className }: AlignmentBaselineProps) {
  const getLabel = (s: number) => {
    if (s < 40) return 'Developing';
    if (s < 70) return 'Aligned';
    return 'Exceptional';
  };

  const getNarrative = (s: number) => {
    if (s < 40) return 'Your profile is still developing. As you take journeys and refine your preferences, this alignment will strengthen naturally over time.';
    if (s < 70) return 'Your profile shows strong coherence between your emotional drivers and stated preferences. Recommendations will be well-matched.';
    return 'Exceptional alignment. Your emotional drivers, lifestyle priorities, and preferences create a deeply coherent foundation.';
  };

  const getScoreColor = (s: number) => {
    if (s < 40) return 'text-amber-500';
    if (s < 70) return 'text-teal-500';
    return 'text-rose-500';
  };

  const getBarGradient = (s: number) => {
    if (s < 40) return 'bg-gradient-to-r from-amber-400 to-amber-300';
    if (s < 70) return 'bg-gradient-to-r from-teal-400 to-teal-300';
    return 'bg-gradient-to-r from-rose-400 to-amber-400';
  };

  const driverEntries = Object.entries(profile.emotionalDrivers)
    .sort(([, a], [, b]) => b - a);

  const dominantDriver = driverEntries[0]?.[0] ?? 'balance';

  return (
    <div className={cn('bg-white border border-sand-200/60 rounded-2xl p-8 sm:p-10 flex flex-col justify-between min-h-[320px] shadow-sm', className)}>
      {/* Header */}
      <div>
        <div className="w-8 h-px bg-amber-400 mb-4" />
        <p className="text-amber-500 text-[10px] font-sans font-medium uppercase tracking-[4px] mb-6">
          Coherence Score
        </p>

        <div className="flex items-baseline gap-2 mb-2">
          <span className={cn('font-serif text-7xl leading-none', getScoreColor(score))}>
            {score}
          </span>
          <span className="text-stone-300 font-sans text-xl">/100</span>
        </div>

        <p className="text-stone-400 font-sans text-[10px] uppercase tracking-[3px] mb-6">
          {getLabel(score)}
        </p>

        {/* Progress bar */}
        <div className="h-1 bg-sand-100 rounded-full mb-8">
          <div
            className={cn('h-full rounded-full transition-all duration-1000', getBarGradient(score))}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Narrative */}
      <div>
        <p className="text-stone-400 text-sm font-sans leading-[1.7] tracking-wide mb-6">
          {getNarrative(score)}
        </p>

        {/* Dominant driver highlight */}
        <div className="pt-4 border-t border-sand-200/60">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px] font-sans uppercase tracking-[3px]">Dominant driver</span>
            <span className="text-stone-900 font-serif text-base capitalize">{dominantDriver}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
