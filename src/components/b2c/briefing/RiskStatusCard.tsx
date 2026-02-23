'use client';

/**
 * Risk Status Card (BREF-04)
 * Simplified risk indicator with plain-language narrative.
 * Color-coded: green (low), amber (medium), red (high/critical).
 * Non-technical, reassuring tone for UHNI audience.
 */

import { cn } from '@/lib/utils/cn';

type RiskLevel = 'low' | 'medium' | 'high';

interface RiskStatusCardProps {
  /** Override risk level for testing; defaults to 'low' */
  riskLevel?: RiskLevel;
  isLoading?: boolean;
}

const riskConfig: Record<RiskLevel, {
  label: string;
  narrative: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
}> = {
  low: {
    label: 'Low Exposure',
    narrative:
      'All privacy protocols are active and no concerns require your attention. Your discretion shield is fully engaged.',
    dotColor: 'bg-olive-500',
    bgColor: 'bg-olive-50',
    textColor: 'text-olive-700',
  },
  medium: {
    label: 'Moderate Attention',
    narrative:
      'Some settings may benefit from a review. We recommend visiting your privacy controls to confirm your preferences.',
    dotColor: 'bg-gold-500',
    bgColor: 'bg-gold-50',
    textColor: 'text-gold-700',
  },
  high: {
    label: 'Action Recommended',
    narrative:
      'There are items that would benefit from your direct attention. Please review your privacy and access settings at your earliest convenience.',
    dotColor: 'bg-rose-500',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
  },
};

export function RiskStatusCard({ riskLevel = 'low', isLoading }: RiskStatusCardProps) {
  const config = riskConfig[riskLevel];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-24 bg-sand-200 rounded" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-sand-200 rounded-full" />
          <div className="h-4 w-32 bg-sand-200 rounded" />
        </div>
        <div className="h-3 w-full bg-sand-200 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Top accent line */}
      <div className={cn(
        'h-1.5 w-full',
        riskLevel === 'low'    ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
        riskLevel === 'medium' ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
        'bg-gradient-to-r from-rose-400 to-red-400'
      )} />

      <div className="p-6">
        <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-4">
          Risk Status
        </p>

        {/* Status indicator */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="relative">
            <span className={cn('block w-3 h-3 rounded-full', config.dotColor)} />
            {riskLevel === 'low' && (
              <span className={cn('absolute inset-0 rounded-full animate-ping opacity-40', config.dotColor)} />
            )}
          </div>
          <span className={cn('font-serif text-lg', config.textColor)}>{config.label}</span>
        </div>

        {/* Plain-language narrative */}
        <p className="text-sm font-sans text-stone-500 leading-relaxed">{config.narrative}</p>
      </div>
    </div>
  );
}
