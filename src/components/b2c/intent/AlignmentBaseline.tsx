'use client';

/**
 * Alignment Baseline Component (INTN-08)
 * Circular progress indicator with alignment score
 */

import { IntentProfile } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface AlignmentBaselineProps {
  profile: IntentProfile;
  score: number;
  className?: string;
}

export function AlignmentBaseline({ profile, score, className }: AlignmentBaselineProps) {
  // Color coding based on score
  const getScoreColor = (score: number) => {
    if (score < 40) return { bg: 'bg-amber-100', stroke: 'stroke-amber-500', text: 'text-amber-700' };
    if (score < 70) return { bg: 'bg-teal-100', stroke: 'stroke-teal-500', text: 'text-teal-700' };
    return { bg: 'bg-rose-100', stroke: 'stroke-rose-500', text: 'text-rose-700' };
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 70; // radius = 70
  const offset = circumference - (score / 100) * circumference;

  // Narrative text based on score
  const getNarrative = (score: number) => {
    if (score < 40) {
      return 'Your profile is still developing. As you take journeys and refine your preferences, this alignment will strengthen.';
    }
    if (score < 70) {
      return 'Your profile shows good alignment. Your emotional drivers and preferences create a balanced foundation for recommendations.';
    }
    return 'Exceptional alignment. Your profile exhibits strong coherence between emotional drivers and lifestyle priorities.';
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="text-center">
        <h3 className="font-serif text-2xl text-stone-900 mb-2">Alignment Baseline</h3>
        <p className="text-sm text-stone-600">
          How well your emotional drivers align with your stated preferences
        </p>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="70"
              className="stroke-stone-200"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              className={cn(colors.stroke, 'transition-all duration-1000 ease-out')}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>

          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn('font-serif text-5xl font-bold', colors.text)}>{score}</div>
            <div className="text-xs text-stone-500 uppercase tracking-wide mt-1">out of 100</div>
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div className={cn('p-4 rounded-lg', colors.bg)}>
        <p className={cn('text-sm leading-relaxed', colors.text)}>{getNarrative(score)}</p>
      </div>
    </div>
  );
}
