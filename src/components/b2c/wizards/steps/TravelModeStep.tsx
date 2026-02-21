'use client';

/**
 * Step 3: Travel Style (Merged — Travel Mode + Preferred Season)
 * Two questions, one screen — feels effortless, not like a long form
 * Top half: how you travel | Bottom half: when you travel
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

const SEASONS = [
  { value: 'Summer' as const,   emoji: '\u2600\uFE0F', title: 'Summer',               feeling: 'Vibrant & Expansive'   },
  { value: 'Autumn' as const,   emoji: '\uD83C\uDF42', title: 'Autumn',               feeling: 'Rich & Contemplative'  },
  { value: 'Winter' as const,   emoji: '\u2744\uFE0F', title: 'Winter',               feeling: 'Rare & Immersive'      },
  { value: 'Spring' as const,   emoji: '\uD83C\uDF38', title: 'Spring',               feeling: 'Hopeful & Alive'       },
  { value: 'Timeless' as const, emoji: '\u221E',        title: 'When the moment calls', feeling: 'Sovereign & Fluid'    },
];

interface TravelModeStepProps {
  form: UseFormReturn<Step3Data>;
}

export function TravelModeStep({ form }: TravelModeStepProps) {
  const selectedMode   = form.watch('travelMode');
  const selectedSeason = form.watch('preferredSeason');

  return (
    <div className="space-y-10">

      {/* Section 1: Travel Mode */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3">
            How do you prefer to travel?
          </h2>
          <p className="text-stone-600 text-base">
            Select the style that best reflects your ideal experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {TRAVEL_MODES.map((mode) => {
            const Icon       = mode.icon;
            const isSelected = selectedMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => form.setValue('travelMode', mode.value, { shouldValidate: true })}
                className={cn(
                  'text-left p-5 rounded-2xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-rose-500 bg-rose-50 shadow-md scale-[1.01]'
                    : 'border-stone-200 bg-white hover:border-rose-300 hover:shadow-sm'
                )}
              >
                <Icon className={cn('w-6 h-6 mb-3', isSelected ? 'text-rose-600' : 'text-stone-400')} />
                <h3 className="font-serif text-lg text-stone-900 mb-1">{mode.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{mode.description}</p>
              </button>
            );
          })}
        </div>

        {form.formState.errors.travelMode && (
          <p className="text-center text-rose-600 text-sm mt-2">
            {form.formState.errors.travelMode.message}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 max-w-3xl mx-auto">
        <div className="flex-1 h-px bg-stone-100" />
        <p className="text-stone-400 text-xs font-sans uppercase tracking-widest">And</p>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      {/* Section 2: Season */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-2">
            When does your soul feel most alive?
          </h2>
          <p className="text-stone-600 text-base">
            This shapes the texture and timing of every experience we curate.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-3xl mx-auto">
          {SEASONS.map((season) => {
            const isSelected = selectedSeason === season.value;
            return (
              <button
                key={season.value}
                type="button"
                onClick={() => form.setValue('preferredSeason', season.value, { shouldValidate: true })}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-rose-500 bg-rose-50 shadow-md scale-[1.02]'
                    : 'border-stone-200 bg-white hover:border-rose-300 hover:shadow-sm'
                )}
              >
                <span className="text-2xl">{season.emoji}</span>
                <span className={cn(
                  'font-serif text-sm text-center leading-tight',
                  isSelected ? 'text-rose-900' : 'text-stone-700'
                )}>
                  {season.title}
                </span>
                <span className={cn(
                  'text-xs text-center leading-tight',
                  isSelected ? 'text-rose-500' : 'text-stone-400'
                )}>
                  {season.feeling}
                </span>
              </button>
            );
          })}
        </div>

        {form.formState.errors.preferredSeason && (
          <p className="text-center text-rose-600 text-sm mt-2">
            {form.formState.errors.preferredSeason.message}
          </p>
        )}
      </div>

    </div>
  );
}
