'use client';

/**
 * Step 4: Priorities and Values
 * Multi-select for lifestyle priorities (max 5) + optional values input
 */

import { UseFormReturn } from 'react-hook-form';
import { Step4Data, LIFESTYLE_PRIORITIES } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

interface PrioritiesStepProps {
  form: UseFormReturn<Step4Data>;
}

export function PrioritiesStep({ form }: PrioritiesStepProps) {
  const priorities = form.watch('priorities') || [];

  const togglePriority = (priority: string) => {
    const current = priorities;
    if (current.includes(priority)) {
      form.setValue(
        'priorities',
        current.filter((p) => p !== priority)
      );
    } else {
      if (current.length < 5) {
        form.setValue('priorities', [...current, priority]);
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-10 h-px bg-rose-300 mx-auto mb-5" />
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4 tracking-[-0.01em]">
          What matters most to you?
        </h2>
        <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7]">
          Select up to 5 lifestyle priorities that guide your decisions.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LIFESTYLE_PRIORITIES.map((priority) => {
            const isSelected = priorities.includes(priority);
            const isDisabled = !isSelected && priorities.length >= 5;

            return (
              <button
                key={priority}
                type="button"
                onClick={() => togglePriority(priority)}
                disabled={isDisabled}
                className={cn(
                  'group relative p-5 rounded-2xl border text-left transition-all duration-300',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  isSelected
                    ? 'border-rose-300 bg-gradient-to-r from-rose-50 to-amber-50 shadow-sm'
                    : 'border-sand-200/60 bg-white hover:border-sand-300 hover:shadow-sm'
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                      isSelected
                        ? 'border-rose-500 bg-rose-500'
                        : 'border-sand-300 bg-white group-hover:border-sand-400'
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className={cn(
                    'font-serif text-base transition-colors',
                    isSelected ? 'text-stone-900' : 'text-stone-600'
                  )}>
                    {priority}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 text-center">
          <span className="text-[10px] text-stone-400 font-sans uppercase tracking-[3px]">
            {priorities.length} of 5 selected
          </span>
        </div>

        {form.formState.errors.priorities && (
          <p className="text-center text-rose-500 text-sm mt-3 font-sans">{form.formState.errors.priorities.message}</p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-6 max-w-3xl mx-auto">
        <div className="flex-1 h-px bg-sand-200/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-teal-300" />
        <div className="flex-1 h-px bg-sand-200/60" />
      </div>

      {/* Values input */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-sand-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
          <div className="mb-5">
            <h3 className="font-serif text-xl text-stone-900 mb-1">
              Personal Values
              <span className="text-stone-300 text-sm font-sans ml-2">(Optional)</span>
            </h3>
            <p className="text-sm text-stone-400 font-sans tracking-wide">
              Share any core values that guide your life choices, separated by commas.
            </p>
          </div>
          <input
            type="text"
            placeholder="e.g., Integrity, Innovation, Family, Stewardship"
            className={cn(
              'w-full px-5 py-3.5 rounded-xl border font-sans text-sm text-stone-800 bg-sand-50/50',
              'focus:border-rose-300 focus:ring-1 focus:ring-rose-200 focus:outline-none',
              'border-sand-200/60 hover:border-sand-300 transition-all',
              'placeholder:text-stone-300'
            )}
            onChange={(e) => {
              const valuesArray = e.target.value
                .split(',')
                .map((v) => v.trim())
                .filter((v) => v.length > 0);
              form.setValue('values', valuesArray);
            }}
            defaultValue={form.getValues('values')?.join(', ') || ''}
          />
        </div>
      </div>
    </div>
  );
}
