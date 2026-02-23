'use client';

/**
 * Step 3: Travel Style
 * Three sections — Travel Mode, Season, Travel Dates
 * All on one screen. Wizard stays at 5 steps.
 */

import { UseFormReturn } from 'react-hook-form';
import { Step3Data } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';
import { Crown, Mountain, Heart, Palette, Key, Calendar, Check } from 'lucide-react';

const TRAVEL_MODES = [
  { value: 'Luxury' as const, icon: Crown, title: 'Luxury', description: 'Exceptional service, comfort, and refinement in every detail.' },
  { value: 'Adventure' as const, icon: Mountain, title: 'Adventure', description: 'Unique experiences that challenge and inspire beyond convention.' },
  { value: 'Wellness' as const, icon: Heart, title: 'Wellness', description: 'Restorative journeys focused on health, balance, and rejuvenation.' },
  { value: 'Cultural' as const, icon: Palette, title: 'Cultural', description: 'Deep immersion in art, history, and authentic local traditions.' },
  { value: 'Exclusive Access' as const, icon: Key, title: 'Exclusive Access', description: 'Private experiences and invitation-only opportunities unavailable to most.' },
];

const SEASONS = [
  { value: 'Summer' as const, emoji: '☀️', title: 'Summer', feeling: 'Vibrant & Expansive' },
  { value: 'Autumn' as const, emoji: '🍂', title: 'Autumn', feeling: 'Rich & Contemplative' },
  { value: 'Winter' as const, emoji: '❄️', title: 'Winter', feeling: 'Rare & Immersive' },
  { value: 'Spring' as const, emoji: '🌸', title: 'Spring', feeling: 'Hopeful & Alive' },
  { value: 'Timeless' as const, emoji: '∞', title: 'When the moment calls', feeling: 'Sovereign & Fluid' },
];

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

interface TravelModeStepProps {
  form: UseFormReturn<Step3Data>;
}

export function TravelModeStep({ form }: TravelModeStepProps) {
  const selectedMode = form.watch('travelMode');
  const selectedSeason = form.watch('preferredSeason');
  const dateFrom = form.watch('travelDateFrom');

  return (
    <div className="space-y-14">
      {/* ── Section 1: Travel Mode ── */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="w-10 h-px bg-teal-300 mx-auto mb-5" />
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-3 tracking-[-0.01em]">
            How do you prefer to travel?
          </h2>
          <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7]">
            Select the style that best reflects your ideal experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {TRAVEL_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => form.setValue('travelMode', mode.value, { shouldValidate: true })}
                className={cn(
                  'group relative text-left p-6 rounded-2xl border transition-all duration-300',
                  isSelected
                    ? 'border-rose-300 bg-gradient-to-br from-rose-50 to-amber-50 shadow-md'
                    : 'border-sand-200/60 bg-white hover:border-sand-300 hover:shadow-sm'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-300',
                  isSelected ? 'bg-rose-500 text-white' : 'bg-sand-100 text-stone-400 group-hover:bg-sand-200'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg text-stone-900 mb-1">{mode.title}</h3>
                <p className="text-stone-400 text-xs font-sans leading-relaxed tracking-wide">{mode.description}</p>

                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {form.formState.errors.travelMode && (
          <p className="text-center text-rose-500 text-sm mt-3 font-sans">
            {form.formState.errors.travelMode.message}
          </p>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-6 max-w-3xl mx-auto">
        <div className="flex-1 h-px bg-sand-200/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
        <div className="flex-1 h-px bg-sand-200/60" />
      </div>

      {/* ── Section 2: Season ── */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="w-10 h-px bg-amber-400 mx-auto mb-5" />
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-3 tracking-[-0.01em]">
            When does your soul feel most alive?
          </h2>
          <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7]">
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
                  'flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all duration-300',
                  isSelected
                    ? 'border-rose-300 bg-gradient-to-br from-rose-50 to-amber-50 shadow-md'
                    : 'border-sand-200/60 bg-white hover:border-sand-300 hover:shadow-sm'
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
                  'text-[10px] text-center leading-tight font-sans tracking-wide',
                  isSelected ? 'text-rose-400' : 'text-stone-400'
                )}>
                  {season.feeling}
                </span>
              </button>
            );
          })}
        </div>

        {form.formState.errors.preferredSeason && (
          <p className="text-center text-rose-500 text-sm mt-3 font-sans">
            {form.formState.errors.preferredSeason.message}
          </p>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-6 max-w-3xl mx-auto">
        <div className="flex-1 h-px bg-sand-200/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
        <div className="flex-1 h-px bg-sand-200/60" />
      </div>

      {/* ── Section 3: Travel Dates ── */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <Calendar className="w-5 h-5 text-rose-400" />
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-[-0.01em]">
              When are you thinking of travelling?
            </h2>
          </div>
          <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7]">
            A general window is enough. Your advisor will work around your schedule.
          </p>
        </div>

        <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-sand-200/60 rounded-2xl p-5 shadow-sm">
            <label className="block text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[3px] mb-3">
              Departure Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              min={todayISO()}
              {...form.register('travelDateFrom')}
              className={cn(
                'w-full px-4 py-3 rounded-xl border font-sans text-sm text-stone-800 bg-sand-50/50 transition-all',
                'focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200',
                form.formState.errors.travelDateFrom
                  ? 'border-rose-300'
                  : 'border-sand-200/60 hover:border-sand-300'
              )}
            />
            {form.formState.errors.travelDateFrom && (
              <p className="text-rose-500 text-xs mt-2 font-sans">
                {form.formState.errors.travelDateFrom.message}
              </p>
            )}
          </div>

          <div className="bg-white border border-sand-200/60 rounded-2xl p-5 shadow-sm">
            <label className="block text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[3px] mb-3">
              Return Date <span className="text-stone-300">(optional)</span>
            </label>
            <input
              type="date"
              min={dateFrom || todayISO()}
              {...form.register('travelDateTo')}
              className="w-full px-4 py-3 rounded-xl border border-sand-200/60 hover:border-sand-300 font-sans text-sm text-stone-800 bg-sand-50/50 transition-all focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-200"
            />
            <p className="text-stone-300 text-[10px] mt-2 font-sans tracking-wide">
              Leave blank if your return is flexible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
