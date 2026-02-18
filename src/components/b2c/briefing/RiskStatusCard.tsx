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
    <div className={cn('rounded-2xl p-6', config.bgColor)}>
      <p className="text-xs font-sans uppercase tracking-widest text-sand-500 mb-4">
        Risk Status
      </p>

      {/* Status indicator */}
      <div className="flex items-center gap-2.5 mb-3">
        <span className={cn('w-2.5 h-2.5 rounded-full', config.dotColor)} />
        <span className={cn('font-serif text-lg', config.textColor)}>{config.label}</span>
      </div>

      {/* Plain-language narrative */}
      <p className="text-sm font-sans text-sand-600 leading-relaxed">{config.narrative}</p>
    </div>
  );
}
