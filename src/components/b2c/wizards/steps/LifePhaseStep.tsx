'use client';

/**
 * Step 1: Life Phase Selection
 * Large card-based selection for current life stage
 */

import { UseFormReturn } from 'react-hook-form';
import { Step1Data } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';
import { Sparkles, Shield, Compass, Heart } from 'lucide-react';

const LIFE_STAGES = [
  {
    value: 'Building' as const,
    icon: Sparkles,
    title: 'Building',
    description: 'Actively growing wealth and establishing foundations for the future.',
  },
  {
    value: 'Preserving' as const,
    icon: Shield,
    title: 'Preserving',
    description: 'Protecting and maintaining accumulated wealth with strategic foresight.',
  },
  {
    value: 'Transitioning' as const,
    icon: Compass,
    title: 'Transitioning',
    description: 'Navigating significant life changes and evolving priorities.',
  },
  {
    value: 'Legacy Planning' as const,
    icon: Heart,
    title: 'Legacy Planning',
    description: 'Crafting a meaningful legacy for future generations and causes.',
  },
];

interface LifePhaseStepProps {
  form: UseFormReturn<Step1Data>;
}

export function LifePhaseStep({ form }: LifePhaseStepProps) {
  const selectedValue = form.watch('lifeStage');

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
          Where are you in your journey?
        </h2>
        <p className="text-stone-600 text-lg">
          Understanding your current life phase helps us tailor recommendations to your unique moment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {LIFE_STAGES.map((stage) => {
          const Icon = stage.icon;
          const isSelected = selectedValue === stage.value;

          return (
            <button
              key={stage.value}
              type="button"
              onClick={() => form.setValue('lifeStage', stage.value)}
              className={cn(
                'group relative p-8 rounded-lg border-2 text-left transition-all duration-300',
                'hover:shadow-lg hover:scale-[1.02]',
                isSelected
                  ? 'border-rose-500 bg-rose-50/50 shadow-md'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    isSelected ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-stone-900 mb-2">{stage.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{stage.description}</p>
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

      {form.formState.errors.lifeStage && (
        <p className="text-center text-red-500 text-sm">{form.formState.errors.lifeStage.message}</p>
      )}
    </div>
  );
}
