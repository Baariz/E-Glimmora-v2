'use client';

/**
 * Invisible Itinerary Default Component (PRIV-02)
 * Toggle for making all new journeys invisible by default — luxury card style
 */

import { cn } from '@/lib/utils/cn';
import { EyeOff } from 'lucide-react';

interface InvisibleItineraryDefaultProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function InvisibleItineraryDefault({ value, onChange }: InvisibleItineraryDefaultProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        'w-full bg-white border rounded-2xl p-6 sm:p-7 shadow-sm transition-all text-left',
        value ? 'border-emerald-300 bg-emerald-50/20' : 'border-stone-200/60 hover:border-stone-300'
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
              value ? 'bg-emerald-50' : 'bg-stone-100'
            )}>
              <EyeOff size={15} className={cn(
                'transition-colors',
                value ? 'text-emerald-600' : 'text-stone-400'
              )} />
            </div>
            <h3 className="font-serif text-xl text-stone-900">Invisible Journeys by Default</h3>
          </div>
          <p className="text-stone-500 font-sans text-sm leading-[1.7] tracking-wide pl-12">
            When enabled, all newly created journeys will be completely hidden from your
            relationship manager and institution staff until you explicitly make them visible.
          </p>
        </div>

        {/* Custom toggle */}
        <div
          className={cn(
            'w-12 h-7 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 mt-1',
            value ? 'bg-emerald-500' : 'bg-stone-200'
          )}
        >
          <div
            className={cn(
              'w-6 h-6 rounded-full bg-white shadow-sm transition-transform',
              value ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </div>
      </div>
    </button>
  );
}
