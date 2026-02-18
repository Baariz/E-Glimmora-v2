'use client';

/**
 * Discretion Tier Selector Component (PRIV-01)
 * Three-tier privacy level selection with explanations
 */

import { useState } from 'react';
import { DiscretionTier } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface DiscretionTierSelectorProps {
  value: DiscretionTier;
  onChange: (tier: DiscretionTier) => void;
}

interface TierOption {
  tier: DiscretionTier;
  label: string;
  description: string;
  Icon: typeof Shield;
  color: string;
  bgColor: string;
  borderColor: string;
  activeBorderColor: string;
}

const TIER_OPTIONS: TierOption[] = [
  {
    tier: 'High',
    label: 'Maximum Privacy',
    description: 'Your journeys are completely private by default. Only you can see them unless you explicitly grant access.',
    Icon: ShieldAlert,
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    activeBorderColor: 'border-rose-600',
  },
  {
    tier: 'Medium',
    label: 'Balanced Privacy',
    description: 'Your journeys are visible to your relationship manager and compliance team, but not to other institution staff.',
    Icon: ShieldCheck,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    activeBorderColor: 'border-teal-600',
  },
  {
    tier: 'Standard',
    label: 'Open Collaboration',
    description: 'Your journeys are visible to authorized institution staff for seamless service delivery and planning.',
    Icon: Shield,
    color: 'text-sand-700',
    bgColor: 'bg-sand-50',
    borderColor: 'border-sand-200',
    activeBorderColor: 'border-sand-600',
  },
];

export function DiscretionTierSelector({ value, onChange }: DiscretionTierSelectorProps) {
  return (
    <div className="space-y-4">
      {TIER_OPTIONS.map((option) => {
        const isSelected = value === option.tier;
        const Icon = option.Icon;

        return (
          <button
            key={option.tier}
            onClick={() => onChange(option.tier)}
            className={cn(
              'w-full p-6 rounded-xl border-2 transition-all text-left',
              'hover:shadow-md',
              isSelected
                ? cn(option.activeBorderColor, option.bgColor, 'shadow-sm')
                : cn(option.borderColor, 'bg-white')
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn('flex-shrink-0 mt-1', option.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl text-stone-900 mb-1">{option.label}</h3>
                <p className="text-stone-600 leading-relaxed">{option.description}</p>
              </div>
              {isSelected && (
                <div className={cn('flex-shrink-0 w-5 h-5 rounded-full', option.bgColor, option.activeBorderColor, 'border-2')}>
                  <div className={cn('w-full h-full rounded-full', option.color.replace('text-', 'bg-'), 'scale-75')} />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
