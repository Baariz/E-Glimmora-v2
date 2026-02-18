'use client';

/**
 * Step 5: Discretion Preferences
 * Privacy tier selection and risk tolerance
 */

import { UseFormReturn } from 'react-hook-form';
import { Step5Data } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';
import { ShieldCheck, Shield, ShieldAlert, TrendingUp } from 'lucide-react';

const DISCRETION_TIERS = [
  {
    value: 'High' as const,
    icon: ShieldCheck,
    title: 'High Discretion',
    description: 'Maximum privacy. Minimal data visibility. Journeys default to invisible.',
    features: ['Encrypted storage', 'Minimal advisor visibility', 'Anonymous analytics'],
  },
  {
    value: 'Medium' as const,
    icon: Shield,
    title: 'Medium Discretion',
    description: 'Balanced privacy. Selective data sharing for enhanced service.',
    features: ['Standard encryption', 'Trusted advisor access', 'Selective analytics'],
  },
  {
    value: 'Standard' as const,
    icon: ShieldAlert,
    title: 'Standard Discretion',
    description: 'Open collaboration. Full data access enables comprehensive recommendations.',
    features: ['Full encryption', 'Broad advisor access', 'Full analytics'],
  },
];

const RISK_TOLERANCE_OPTIONS = [
  {
    value: 'Conservative' as const,
    label: 'Conservative',
    description: 'Prioritize capital preservation and stability',
  },
  {
    value: 'Moderate' as const,
    label: 'Moderate',
    description: 'Balanced approach between growth and security',
  },
  {
    value: 'Aggressive' as const,
    label: 'Aggressive',
    description: 'Pursue higher returns with calculated risk',
  },
  {
    value: 'Very Aggressive' as const,
    label: 'Very Aggressive',
    description: 'Maximize growth potential with significant risk tolerance',
  },
];

interface DiscretionStepProps {
  form: UseFormReturn<Step5Data>;
}

export function DiscretionStep({ form }: DiscretionStepProps) {
  const selectedDiscretion = form.watch('discretionPreference');
  const selectedRisk = form.watch('riskTolerance');

  return (
    <div className="space-y-12">
      {/* Discretion Tier Selection */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
            How much privacy do you prefer?
          </h2>
          <p className="text-stone-600 text-lg">
            Your discretion tier determines how we handle and share your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {DISCRETION_TIERS.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedDiscretion === tier.value;

            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => form.setValue('discretionPreference', tier.value)}
                className={cn(
                  'group relative p-6 rounded-lg border-2 text-left transition-all duration-300',
                  'hover:shadow-lg hover:scale-[1.02]',
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 shadow-md'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                )}
              >
                <div className="space-y-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      isSelected ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-stone-900 mb-2">{tier.title}</h3>
                    <p className="text-sm text-stone-600 mb-4">{tier.description}</p>
                    <ul className="space-y-1">
                      {tier.features.map((feature) => (
                        <li key={feature} className="text-xs text-stone-500 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-stone-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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

        {form.formState.errors.discretionPreference && (
          <p className="text-center text-red-500 text-sm">{form.formState.errors.discretionPreference.message}</p>
        )}
      </div>

      {/* Risk Tolerance Selection */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-stone-600" />
            <h3 className="font-serif text-2xl text-stone-900">Risk Tolerance</h3>
          </div>
          <p className="text-stone-600">
            How comfortable are you with financial risk in pursuit of returns?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {RISK_TOLERANCE_OPTIONS.map((option) => {
            const isSelected = selectedRisk === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => form.setValue('riskTolerance', option.value)}
                className={cn(
                  'group p-4 rounded-lg border-2 text-left transition-all duration-200',
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 transition-colors',
                      isSelected ? 'border-rose-500 bg-rose-500' : 'border-stone-300 bg-white'
                    )}
                  >
                    {isSelected && <div className="w-full h-full rounded-full bg-white scale-50" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-serif text-lg text-stone-900 mb-1">{option.label}</div>
                    <div className="text-sm text-stone-600">{option.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {form.formState.errors.riskTolerance && (
          <p className="text-center text-red-500 text-sm">{form.formState.errors.riskTolerance.message}</p>
        )}
      </div>
    </div>
  );
}
