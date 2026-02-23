'use client';

/**
 * Discretion Tier Selector Component (PRIV-01)
 * Three-tier privacy level selection — luxury card style with emerald accents
 */

import { DiscretionTier } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface DiscretionTierSelectorProps {
  value: DiscretionTier;
  onChange: (tier: DiscretionTier) => void;
}

interface TierOption {
  tier: DiscretionTier;
  label: string;
  description: string;
  Icon: typeof Shield;
  iconBg: string;
  iconColor: string;
  selectedBorder: string;
  selectedBg: string;
}

const TIER_OPTIONS: TierOption[] = [
  {
    tier: 'High',
    label: 'Maximum Privacy',
    description: 'Your journeys are completely private by default. Only you can see them unless you explicitly grant access.',
    Icon: ShieldAlert,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    selectedBorder: 'border-emerald-400',
    selectedBg: 'bg-emerald-50/30',
  },
  {
    tier: 'Medium',
    label: 'Balanced Privacy',
    description: 'Your journeys are visible to your relationship manager and compliance team, but not to other institution staff.',
    Icon: ShieldCheck,
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-600',
    selectedBorder: 'border-stone-400',
    selectedBg: 'bg-stone-50/50',
  },
  {
    tier: 'Standard',
    label: 'Open Collaboration',
    description: 'Your journeys are visible to authorized institution staff for seamless service delivery and planning.',
    Icon: Shield,
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-400',
    selectedBorder: 'border-stone-300',
    selectedBg: 'bg-stone-50/30',
  },
];

export function DiscretionTierSelector({ value, onChange }: DiscretionTierSelectorProps) {
  return (
    <div className="space-y-3">
      {TIER_OPTIONS.map((option) => {
        const isSelected = value === option.tier;
        const Icon = option.Icon;

        return (
          <button
            key={option.tier}
            onClick={() => onChange(option.tier)}
            className={cn(
              'w-full bg-white border rounded-2xl p-6 sm:p-7 shadow-sm transition-all text-left group',
              'hover:shadow-md',
              isSelected
                ? cn(option.selectedBorder, option.selectedBg)
                : 'border-stone-200/60 hover:border-stone-300'
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                isSelected ? option.iconBg : 'bg-stone-100'
              )}>
                <Icon size={17} className={cn(
                  'transition-colors',
                  isSelected ? option.iconColor : 'text-stone-400'
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-xl text-stone-900 mb-1.5">{option.label}</h3>
                <p className="text-stone-500 font-sans text-sm leading-[1.7] tracking-wide">
                  {option.description}
                </p>
              </div>

              {/* Radio indicator */}
              <div className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors',
                isSelected ? option.selectedBorder : 'border-stone-300'
              )}>
                {isSelected && (
                  <div className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    option.tier === 'High' ? 'bg-emerald-500' : 'bg-stone-500'
                  )} />
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
