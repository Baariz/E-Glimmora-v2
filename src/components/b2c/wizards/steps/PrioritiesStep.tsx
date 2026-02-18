'use client';

/**
 * Step 4: Priorities and Values
 * Multi-select checkboxes for lifestyle priorities (max 5)
 */

import { UseFormReturn } from 'react-hook-form';
import { Step4Data, LIFESTYLE_PRIORITIES } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';

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
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
          What matters most to you?
        </h2>
        <p className="text-stone-600 text-lg">
          Select up to 5 lifestyle priorities that guide your decisions.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  'group relative p-4 rounded-lg border-2 text-left transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                      isSelected
                        ? 'border-rose-500 bg-rose-500'
                        : 'border-stone-300 bg-white group-hover:border-stone-400'
                    )}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-serif text-lg text-stone-900">{priority}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center text-sm text-stone-600">
          {priorities.length} of 5 selected
        </div>

        {form.formState.errors.priorities && (
          <p className="text-center text-red-500 text-sm mt-2">{form.formState.errors.priorities.message}</p>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        <label htmlFor="values" className="block font-serif text-xl text-stone-900">
          Personal Values <span className="text-stone-500 text-sm font-sans">(Optional)</span>
        </label>
        <p className="text-sm text-stone-600">
          Share any core values that guide your life choices, separated by commas.
        </p>
        <input
          id="values"
          type="text"
          placeholder="e.g., Integrity, Innovation, Family, Stewardship"
          className={cn(
            'w-full px-4 py-3 rounded-lg border-2 border-stone-200',
            'focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none',
            'transition-colors'
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
  );
}
