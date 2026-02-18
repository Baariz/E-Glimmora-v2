'use client';

/**
 * Step 3: Travel Mode Selection
 * Card-based selection for preferred travel style
 */

import { UseFormReturn } from 'react-hook-form';
import { Step3Data } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';
import { Crown, Mountain, Heart, Palette, Key } from 'lucide-react';

const TRAVEL_MODES = [
  {
    value: 'Luxury' as const,
    icon: Crown,
    title: 'Luxury',
    description: 'Exceptional service, comfort, and refinement in every detail.',
  },
  {
    value: 'Adventure' as const,
    icon: Mountain,
    title: 'Adventure',
    description: 'Unique experiences that challenge and inspire beyond convention.',
  },
  {
    value: 'Wellness' as const,
    icon: Heart,
    title: 'Wellness',
    description: 'Restorative journeys focused on health, balance, and rejuvenation.',
  },
  {
    value: 'Cultural' as const,
    icon: Palette,
    title: 'Cultural',
    description: 'Deep immersion in art, history, and authentic local traditions.',
  },
  {
    value: 'Exclusive Access' as const,
    icon: Key,
    title: 'Exclusive Access',
    description: 'Private experiences and invitation-only opportunities unavailable to most.',
  },
];

interface TravelModeStepProps {
  form: UseFormReturn<Step3Data>;
}

export function TravelModeStep({ form }: TravelModeStepProps) {
  const selectedValue = form.watch('travelMode');

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
          How do you prefer to travel?
        </h2>
        <p className="text-stone-600 text-lg">
          Select the travel mode that best reflects your ideal journey experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {TRAVEL_MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedValue === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => form.setValue('travelMode', mode.value)}
              className={cn(
                'group relative p-6 rounded-lg border-2 text-left transition-all duration-300',
                'hover:shadow-lg hover:scale-[1.02]',
                isSelected
                  ? 'border-rose-500 bg-rose-50/50 shadow-md'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              )}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                    isSelected ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                  )}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-stone-900 mb-2">{mode.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{mode.description}</p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {form.formState.errors.travelMode && (
        <p className="text-center text-red-500 text-sm">{form.formState.errors.travelMode.message}</p>
      )}
    </div>
  );
}
