'use client';

/**
 * Step 5: Discretion Preferences
 * Privacy tier selection and risk tolerance
 */

import { UseFormReturn } from 'react-hook-form';
import { Step5Data } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';
import { ShieldCheck, Shield, ShieldAlert, TrendingUp, Check } from 'lucide-react';

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
    <div className="space-y-14">
      {/* Discretion Tier Selection */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="w-10 h-px bg-stone-300 mx-auto mb-5" />
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4 tracking-[-0.01em]">
            How much privacy do you prefer?
          </h2>
          <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7]">
            Your discretion tier determines how we handle and share your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {DISCRETION_TIERS.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedDiscretion === tier.value;

            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => form.setValue('discretionPreference', tier.value)}
                className={cn(
                  'group relative p-7 rounded-2xl border text-left transition-all duration-300',
                  isSelected
                    ? 'border-rose-300 bg-gradient-to-br from-rose-50 to-amber-50 shadow-md'
                    : 'border-sand-200/60 bg-white hover:border-sand-300 hover:shadow-sm'
                )}
              >
                <div className="space-y-4">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
                      isSelected ? 'bg-rose-500 text-white' : 'bg-sand-100 text-stone-400 group-hover:bg-sand-200'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-stone-900 mb-2">{tier.title}</h3>
                    <p className="text-xs text-stone-400 font-sans leading-relaxed tracking-wide mb-4">{tier.description}</p>
                    <ul className="space-y-1.5">
                      {tier.features.map((feature) => (
                        <li key={feature} className="text-[11px] text-stone-400 flex items-center gap-2 font-sans tracking-wide">
                          <div className={cn(
                            'w-1 h-1 rounded-full',
                            isSelected ? 'bg-rose-400' : 'bg-stone-300'
                          )} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {form.formState.errors.discretionPreference && (
          <p className="text-center text-rose-500 text-sm mt-3 font-sans">{form.formState.errors.discretionPreference.message}</p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-6 max-w-3xl mx-auto">
        <div className="flex-1 h-px bg-sand-200/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
        <div className="flex-1 h-px bg-sand-200/60" />
      </div>

      {/* Risk Tolerance Selection */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-[-0.01em]">Risk Tolerance</h2>
          </div>
          <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7]">
            How comfortable are you with financial risk in pursuit of returns?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {RISK_TOLERANCE_OPTIONS.map((option) => {
            const isSelected = selectedRisk === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => form.setValue('riskTolerance', option.value)}
                className={cn(
                  'group p-5 rounded-2xl border text-left transition-all duration-300',
                  isSelected
                    ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm'
                    : 'border-sand-200/60 bg-white hover:border-sand-300 hover:shadow-sm'
                )}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={cn(
                      'flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 transition-all duration-300 flex items-center justify-center',
                      isSelected ? 'border-amber-500 bg-amber-500' : 'border-sand-300 bg-white'
                    )}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-serif text-base text-stone-900 mb-1">{option.label}</div>
                    <div className="text-xs text-stone-400 font-sans tracking-wide">{option.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {form.formState.errors.riskTolerance && (
          <p className="text-center text-rose-500 text-sm mt-3 font-sans">{form.formState.errors.riskTolerance.message}</p>
        )}
      </div>
    </div>
  );
}
