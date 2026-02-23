'use client';

/**
 * Alignment Baseline Component (INTN-08)
 * Premium circular progress indicator with alignment score
 */

import { IntentProfile } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface AlignmentBaselineProps {
  profile: IntentProfile;
  score: number;
  className?: string;
}

export function AlignmentBaseline({ profile, score, className }: AlignmentBaselineProps) {
  const getScoreColor = (s: number) => {
    if (s < 40) return { stroke: '#d97706', text: 'text-amber-700', accent: 'from-amber-50 to-yellow-50', border: 'border-amber-200' };
    if (s < 70) return { stroke: '#0d9488', text: 'text-teal-700', accent: 'from-teal-50 to-emerald-50', border: 'border-teal-200' };
    return { stroke: '#9f1239', text: 'text-rose-800', accent: 'from-rose-50 to-amber-50', border: 'border-rose-200' };
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  const getNarrative = (s: number) => {
    if (s < 40) return 'Your profile is still developing. As you take journeys and refine your preferences, this alignment will strengthen.';
    if (s < 70) return 'Your profile shows good alignment. Your emotional drivers and preferences create a balanced foundation for recommendations.';
    return 'Exceptional alignment. Your profile exhibits strong coherence between emotional drivers and lifestyle priorities.';
  };

  const getLabel = (s: number) => {
    if (s < 40) return 'Developing';
    if (s < 70) return 'Aligned';
    return 'Exceptional';
  };

  return (
    <div className={cn('bg-white border border-stone-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow', className)}>
      <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-2">Coherence Score</p>
      <h3 className="font-serif text-2xl text-stone-900 mb-6">Alignment Baseline</h3>

      {/* Circular Progress */}
      <div className="flex justify-center mb-6">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="70"
              className="stroke-stone-100"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="88"
              cy="88"
              r="70"
              stroke={colors.stroke}
              className="transition-all duration-1000 ease-out"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn('font-serif text-5xl font-bold', colors.text)}>{score}</div>
            <div className="text-xs text-stone-400 uppercase tracking-wider mt-1">{getLabel(score)}</div>
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div className={cn('p-4 rounded-xl bg-gradient-to-r border', colors.accent, colors.border)}>
        <p className={cn('text-sm font-sans leading-relaxed', colors.text)}>{getNarrative(score)}</p>
      </div>
    </div>
  );
}
