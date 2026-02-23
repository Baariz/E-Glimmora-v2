'use client';

/**
 * Discretion Tier Badge (BREF-05)
 * Premium editorial discretion tier display.
 * Tiers: High / Medium / Standard.
 */

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { DiscretionTier } from '@/lib/types/entities';

interface DiscretionTierBadgeProps {
  tier?: DiscretionTier;
  isLoading?: boolean;
}

const tierConfig: Record<DiscretionTier, {
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  pillBg: string;
  pillText: string;
  accentBar: string;
}> = {
  High: {
    label: 'High Discretion',
    shortLabel: 'Maximum',
    description: 'Maximum privacy protection. Invisible itineraries enabled by default.',
    icon: '◈',
    pillBg: 'bg-teal-50',
    pillText: 'text-teal-700',
    accentBar: 'from-teal-500 to-emerald-400',
  },
  Medium: {
    label: 'Medium Discretion',
    shortLabel: 'Balanced',
    description: 'Balanced privacy with selective advisor visibility.',
    icon: '◇',
    pillBg: 'bg-stone-100',
    pillText: 'text-stone-700',
    accentBar: 'from-stone-400 to-stone-300',
  },
  Standard: {
    label: 'Standard',
    shortLabel: 'Open',
    description: 'Standard privacy settings. Advisors have default visibility.',
    icon: '○',
    pillBg: 'bg-stone-50',
    pillText: 'text-stone-500',
    accentBar: 'from-stone-300 to-stone-200',
  },
};

export function DiscretionTierBadge({ tier = 'High', isLoading }: DiscretionTierBadgeProps) {
  const config = tierConfig[tier];

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white border border-stone-100 p-6 sm:p-8 animate-pulse min-h-[200px]">
        <div className="h-3 w-24 bg-stone-200 rounded mb-6" />
        <div className="h-8 w-36 bg-stone-200 rounded-full mb-4" />
        <div className="h-3 w-full bg-stone-200 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden group">
      {/* Gradient accent bar */}
      <div className={cn('h-1 w-full bg-gradient-to-r', config.accentBar)} />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <p className="text-stone-400 text-[10px] font-sans font-semibold uppercase tracking-[4px] mb-6">
          Discretion Tier
        </p>

        {/* Tier display */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h4 className="font-serif text-2xl text-stone-900 leading-tight">{config.label}</h4>
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider mt-1',
              config.pillBg, config.pillText
            )}>
              {config.shortLabel} Privacy
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm font-sans text-stone-500 leading-relaxed mb-5">
          {config.description}
        </p>

        {/* Link */}
        <Link
          href="/privacy"
          className="inline-flex items-center gap-1.5 text-[11px] font-sans text-rose-700 hover:text-rose-500 font-medium transition-colors uppercase tracking-wider group/link"
        >
          Manage Settings
          <span className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
