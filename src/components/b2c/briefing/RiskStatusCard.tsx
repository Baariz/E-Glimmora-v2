'use client';

/**
 * Risk Status Card (BREF-04)
 * Luxury editorial risk indicator with cinematic styling.
 * Color-coded: emerald (low), amber (medium), rose (high).
 * Non-technical, reassuring tone for UHNI audience.
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

type RiskLevel = 'low' | 'medium' | 'high';

interface RiskStatusCardProps {
  riskLevel?: RiskLevel;
  isLoading?: boolean;
}

const riskConfig: Record<RiskLevel, {
  label: string;
  narrative: string;
  statusText: string;
  dotColor: string;
  accentColor: string;
  barColor: string;
}> = {
  low: {
    label: 'Low Exposure',
    narrative:
      'All privacy protocols are active. Your discretion shield is fully engaged — no concerns require your attention.',
    statusText: 'All Clear',
    dotColor: 'bg-emerald-400',
    accentColor: 'text-emerald-400',
    barColor: 'from-emerald-500 to-teal-400',
  },
  medium: {
    label: 'Moderate Attention',
    narrative:
      'Some settings may benefit from a review. We recommend visiting your privacy controls to confirm your preferences.',
    statusText: 'Review Advised',
    dotColor: 'bg-amber-400',
    accentColor: 'text-amber-400',
    barColor: 'from-amber-500 to-yellow-400',
  },
  high: {
    label: 'Action Recommended',
    narrative:
      'Items require your direct attention. Please review your privacy and access settings at your earliest convenience.',
    statusText: 'Action Needed',
    dotColor: 'bg-rose-400',
    accentColor: 'text-rose-400',
    barColor: 'from-rose-500 to-red-400',
  },
};

export function RiskStatusCard({ riskLevel = 'low', isLoading }: RiskStatusCardProps) {
  const config = riskConfig[riskLevel];

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white border border-stone-100 p-6 sm:p-8 animate-pulse min-h-[200px]">
        <div className="h-3 w-20 bg-stone-200 rounded mb-6" />
        <div className="h-6 w-32 bg-stone-200 rounded mb-4" />
        <div className="h-3 w-full bg-stone-200 rounded mb-2" />
        <div className="h-3 w-2/3 bg-stone-200 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden group">
      {/* Gradient accent bar */}
      <div className={cn('h-1 w-full bg-gradient-to-r', config.barColor)} />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <p className="text-stone-400 text-[10px] font-sans font-semibold uppercase tracking-[4px] mb-6">
          Risk Status
        </p>

        {/* Status row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <span className={cn('block w-3 h-3 rounded-full', config.dotColor)} />
            <motion.span
              className={cn('absolute inset-0 rounded-full', config.dotColor)}
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className={cn('font-serif text-2xl', config.accentColor === 'text-emerald-400' ? 'text-stone-900' : config.accentColor === 'text-amber-400' ? 'text-amber-700' : 'text-rose-700')}>
            {config.label}
          </span>
        </div>

        {/* Narrative */}
        <p className="text-sm font-sans text-stone-500 leading-relaxed mb-5">
          {config.narrative}
        </p>

        {/* Bottom status pill */}
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-medium',
            riskLevel === 'low' ? 'bg-emerald-50 text-emerald-700' :
            riskLevel === 'medium' ? 'bg-amber-50 text-amber-700' :
            'bg-rose-50 text-rose-700'
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
            {config.statusText}
          </span>
        </div>
      </div>
    </div>
  );
}
