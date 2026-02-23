'use client';

/**
 * Step 2: Emotional Outcome Drivers
 * 5 slider inputs for emotional driver calibration — card-wrapped for premium feel
 */

import { UseFormReturn } from 'react-hook-form';
import { Step2Data } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';

const EMOTIONAL_DRIVERS = [
  {
    key: 'security' as const,
    label: 'Security',
    description: 'Prioritizing safety, stability, and risk mitigation',
    lowLabel: 'Flexible',
    highLabel: 'Essential',
  },
  {
    key: 'adventure' as const,
    label: 'Adventure',
    description: 'Seeking novel experiences and exploration',
    lowLabel: 'Cautious',
    highLabel: 'Daring',
  },
  {
    key: 'legacy' as const,
    label: 'Legacy',
    description: 'Building enduring impact for future generations',
    lowLabel: 'Present-focused',
    highLabel: 'Future-focused',
  },
  {
    key: 'recognition' as const,
    label: 'Recognition',
    description: 'Valuing status, influence, and social standing',
    lowLabel: 'Private',
    highLabel: 'Visible',
  },
  {
    key: 'autonomy' as const,
    label: 'Autonomy',
    description: 'Maintaining independence and self-direction',
    lowLabel: 'Collaborative',
    highLabel: 'Independent',
  },
];

interface EmotionalOutcomeStepProps {
  form: UseFormReturn<Step2Data>;
}

export function EmotionalOutcomeStep({ form }: EmotionalOutcomeStepProps) {
  const drivers = form.watch('emotionalDrivers');

  return (
    <div className="space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-10 h-px bg-amber-400 mx-auto mb-5" />
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4 tracking-[-0.01em]">
          What do you seek from this journey?
        </h2>
        <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7]">
          Adjust each slider to reflect the emotional priorities that guide your choices.
        </p>
      </div>

      <div className="space-y-5 max-w-3xl mx-auto">
        {EMOTIONAL_DRIVERS.map((driver) => {
          const value = drivers?.[driver.key] ?? 50;

          return (
            <div key={driver.key} className="bg-white border border-sand-200/60 rounded-2xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg text-stone-900">{driver.label}</h3>
                  <p className="text-xs text-stone-400 mt-0.5 font-sans tracking-wide">{driver.description}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className={cn(
                    'text-2xl font-serif min-w-[3rem] text-right tabular-nums',
                    value >= 70 ? 'text-rose-500' : value >= 40 ? 'text-amber-500' : 'text-stone-300'
                  )}>
                    {value}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={value}
                    onChange={(e) => {
                      form.setValue(`emotionalDrivers.${driver.key}`, parseInt(e.target.value, 10));
                    }}
                    className={cn(
                      'w-full h-1.5 rounded-full appearance-none cursor-pointer',
                      'bg-gradient-to-r from-sand-200 via-rose-200 to-rose-400',
                      '[&::-webkit-slider-thumb]:appearance-none',
                      '[&::-webkit-slider-thumb]:w-5',
                      '[&::-webkit-slider-thumb]:h-5',
                      '[&::-webkit-slider-thumb]:rounded-full',
                      '[&::-webkit-slider-thumb]:bg-white',
                      '[&::-webkit-slider-thumb]:border-2',
                      '[&::-webkit-slider-thumb]:border-rose-400',
                      '[&::-webkit-slider-thumb]:shadow-md',
                      '[&::-webkit-slider-thumb]:cursor-pointer',
                      '[&::-webkit-slider-thumb]:transition-transform',
                      '[&::-webkit-slider-thumb]:hover:scale-110',
                      '[&::-moz-range-thumb]:w-5',
                      '[&::-moz-range-thumb]:h-5',
                      '[&::-moz-range-thumb]:rounded-full',
                      '[&::-moz-range-thumb]:bg-white',
                      '[&::-moz-range-thumb]:border-2',
                      '[&::-moz-range-thumb]:border-rose-400',
                      '[&::-moz-range-thumb]:shadow-md',
                      '[&::-moz-range-thumb]:cursor-pointer',
                      '[&::-moz-range-thumb]:transition-transform',
                      '[&::-moz-range-thumb]:hover:scale-110'
                    )}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 font-sans uppercase tracking-wider">
                  <span>{driver.lowLabel}</span>
                  <span>{driver.highLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
