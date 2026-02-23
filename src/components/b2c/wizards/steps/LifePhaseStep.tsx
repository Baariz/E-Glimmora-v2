'use client';

/**
 * Step 1: Life Phase Selection
 * Premium card-based selection for current life stage
 */

import { UseFormReturn } from 'react-hook-form';
import { Step1Data } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';
import { Sparkles, Shield, Compass, Heart, Check } from 'lucide-react';

const LIFE_STAGES = [
  {
    value: 'Building' as const,
    icon: Sparkles,
    title: 'Building',
    description: 'Actively growing wealth and establishing foundations for the future.',
    gradient: 'from-rose-50 to-amber-50',
    border: 'border-rose-200/60',
    accent: 'bg-rose-500',
  },
  {
    value: 'Preserving' as const,
    icon: Shield,
    title: 'Preserving',
    description: 'Protecting and maintaining accumulated wealth with strategic foresight.',
    gradient: 'from-teal-50 to-emerald-50',
    border: 'border-teal-200/60',
    accent: 'bg-teal-500',
  },
  {
    value: 'Transitioning' as const,
    icon: Compass,
    title: 'Transitioning',
    description: 'Navigating significant life changes and evolving priorities.',
    gradient: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200/60',
    accent: 'bg-amber-500',
  },
  {
    value: 'Legacy Planning' as const,
    icon: Heart,
    title: 'Legacy Planning',
    description: 'Crafting a meaningful legacy for future generations and causes.',
    gradient: 'from-purple-50 to-violet-50',
    border: 'border-purple-200/60',
    accent: 'bg-purple-500',
  },
];

interface LifePhaseStepProps {
  form: UseFormReturn<Step1Data>;
}

export function LifePhaseStep({ form }: LifePhaseStepProps) {
  const selectedValue = form.watch('lifeStage');

  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-10 h-px bg-rose-300 mx-auto mb-5" />
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4 tracking-[-0.01em]">
          Where are you in your journey?
        </h2>
        <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7]">
          Understanding your current life phase helps us tailor recommendations to your unique moment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {LIFE_STAGES.map((stage) => {
          const Icon = stage.icon;
          const isSelected = selectedValue === stage.value;

          return (
            <button
              key={stage.value}
              type="button"
              onClick={() => form.setValue('lifeStage', stage.value)}
              className={cn(
                'group relative p-7 sm:p-8 rounded-2xl border text-left transition-all duration-300',
                isSelected
                  ? cn('bg-gradient-to-br border shadow-md', stage.gradient, stage.border)
                  : 'border-sand-200/60 bg-white hover:border-sand-300 hover:shadow-sm'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
                    isSelected ? cn(stage.accent, 'text-white shadow-sm') : 'bg-sand-100 text-stone-400 group-hover:bg-sand-200'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl text-stone-900 mb-1.5">{stage.title}</h3>
                  <p className="text-stone-400 text-sm font-sans leading-[1.6] tracking-wide">{stage.description}</p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', stage.accent)}>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {form.formState.errors.lifeStage && (
        <p className="text-center text-rose-500 text-sm font-sans">{form.formState.errors.lifeStage.message}</p>
      )}
    </div>
  );
}
