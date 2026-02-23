'use client';

/**
 * Discretion Tier Badge (BREF-05)
 * Displays current privacy/discretion tier as a styled badge.
 * Links to /privacy settings.
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
  description: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
}> = {
  High: {
    label: 'High Discretion',
    description: 'Maximum privacy protection. Invisible itineraries enabled by default.',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-800',
    icon: 'Shield',
  },
  Medium: {
    label: 'Medium Discretion',
    description: 'Balanced privacy with selective advisor visibility.',
    badgeBg: 'bg-sand-200',
    badgeText: 'text-sand-800',
    icon: 'Lock',
  },
  Standard: {
    label: 'Standard',
    description: 'Standard privacy settings. Advisors have default visibility.',
    badgeBg: 'bg-sand-100',
    badgeText: 'text-sand-600',
    icon: 'Eye',
  },
};

export function DiscretionTierBadge({ tier = 'High', isLoading }: DiscretionTierBadgeProps) {
  const config = tierConfig[tier];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-28 bg-sand-200 rounded" />
        <div className="h-8 w-36 bg-sand-200 rounded-full" />
        <div className="h-3 w-full bg-sand-200 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow p-6">
      <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-4">
        Discretion Tier
      </p>

      {/* Badge */}
      <div className="mb-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-sans font-medium border',
            tier === 'High'
              ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-800 border-teal-200'
              : tier === 'Medium'
              ? 'bg-gradient-to-r from-stone-50 to-stone-100 text-stone-700 border-stone-200'
              : 'bg-stone-50 text-stone-500 border-stone-200'
          )}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          {config.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm font-sans text-stone-500 leading-relaxed mb-4">
        {config.description}
      </p>

      {/* Link to privacy settings */}
      <Link
        href="/privacy"
        className="text-xs font-sans text-rose-700 hover:text-rose-600 font-medium transition-colors"
      >
        Manage privacy settings &rarr;
      </Link>
    </div>
  );
}
