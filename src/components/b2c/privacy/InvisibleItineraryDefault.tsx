'use client';

/**
 * Invisible Itinerary Default Component (PRIV-02)
 * Toggle for making all new journeys invisible by default
 */

import { cn } from '@/lib/utils/cn';
import { EyeOff } from 'lucide-react';

interface InvisibleItineraryDefaultProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function InvisibleItineraryDefault({ value, onChange }: InvisibleItineraryDefaultProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <EyeOff className="w-5 h-5 text-stone-700" />
            <h3 className="font-serif text-xl text-stone-900">Invisible Journeys by Default</h3>
          </div>
          <p className="text-stone-600 leading-relaxed">
            When enabled, all newly created journeys will be marked as invisible. Invisible journeys
            are completely hidden from your relationship manager and institution staff until you
            explicitly make them visible.
          </p>
        </div>

        <button
          onClick={() => onChange(!value)}
          className={cn(
            'flex-shrink-0 relative w-14 h-8 rounded-full transition-colors',
            value ? 'bg-rose-600' : 'bg-stone-300'
          )}
          aria-label={value ? 'Disable invisible journeys by default' : 'Enable invisible journeys by default'}
        >
          <div
            className={cn(
              'absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform',
              value ? 'translate-x-7' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    </div>
  );
}
