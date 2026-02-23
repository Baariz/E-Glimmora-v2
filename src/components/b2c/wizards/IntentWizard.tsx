'use client';

/**
 * Intent Wizard Orchestrator
 * 5-step intake wizard for Intent Profile creation
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '@/lib/hooks/useWizard';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Step4Schema,
  Step5Schema,
  IntentProfileMasterSchema,
  IntentProfileMasterData,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  Step5Data,
} from '@/lib/validation/intent-schemas';
import { LifePhaseStep } from './steps/LifePhaseStep';
import { EmotionalOutcomeStep } from './steps/EmotionalOutcomeStep';
import { TravelModeStep } from './steps/TravelModeStep';
import { PrioritiesStep } from './steps/PrioritiesStep';
import { DiscretionStep } from './steps/DiscretionStep';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const WIZARD_STORAGE_KEY = 'wizard_intent';

export function IntentWizard() {
  const router = useRouter();
  const services = useServices();
  const { user: currentUser } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wizard = useWizard<IntentProfileMasterData>({
    totalSteps: 5,
    storageKey: WIZARD_STORAGE_KEY,
    initialData: {
      emotionalDrivers: {
        security: 50,
        adventure: 50,
        legacy: 50,
        recognition: 50,
        autonomy: 50,
      },
      priorities: [],
      values: [],
    },
  });

  // Get current step schema
  const getCurrentStepSchema = () => {
    switch (wizard.currentStep) {
      case 1:
        return Step1Schema;
      case 2:
        return Step2Schema;
      case 3:
        return Step3Schema;
      case 4:
        return Step4Schema;
      case 5:
        return Step5Schema;
      default:
        return Step1Schema;
    }
  };

  // Initialize form with current step schema
  const form = useForm<any>({
    resolver: zodResolver(getCurrentStepSchema()),
    defaultValues: wizard.formData,
    mode: 'onChange',
  });

  // Update form when step changes
  const handleStepChange = () => {
    const schema = getCurrentStepSchema();
    form.reset(wizard.formData, { keepDefaultValues: false });
  };

  const handleNext = async (data: any) => {
    setError(null);

    if (wizard.isLastStep) {
      // Final submission
      setIsSubmitting(true);

      try {
        // Merge all data
        const completeData = { ...wizard.formData, ...data };

        // Validate complete profile
        const validatedData = IntentProfileMasterSchema.parse(completeData);

        if (!currentUser) {
          throw new Error('No user logged in');
        }

        // Create intent profile
        await services.intent.createIntentProfile({
          userId: currentUser.id,
          emotionalDrivers: validatedData.emotionalDrivers,
          riskTolerance: validatedData.riskTolerance,
          values: validatedData.values,
          lifeStage: validatedData.lifeStage,
          travelMode: validatedData.travelMode,
          preferredSeason: validatedData.preferredSeason,
          travelDateFrom: validatedData.travelDateFrom,
          travelDateTo: validatedData.travelDateTo,
          priorities: validatedData.priorities,
          discretionPreference: validatedData.discretionPreference,
        });

        // Clear wizard state
        wizard.reset();

        // Redirect to intent profile page
        router.push('/intent');
      } catch (err) {
        console.error('Failed to create intent profile:', err);
        setError('Failed to generate your profile. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      // Move to next step
      wizard.next(data);
      handleStepChange();
    }
  };

  const handleBack = () => {
    wizard.back();
    handleStepChange();
  };

  const onSubmit = form.handleSubmit(handleNext as any);

  // Render current step
  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1:
        return <LifePhaseStep form={form as any} />;
      case 2:
        return <EmotionalOutcomeStep form={form as any} />;
      case 3:
        return <TravelModeStep form={form as any} />;
      case 4:
        return <PrioritiesStep form={form as any} />;
      case 5:
        return <DiscretionStep form={form as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Cinematic top banner with photography */}
      <div
        className="relative h-36 sm:h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <p className="text-amber-300 text-xs font-sans uppercase tracking-[3px] mb-2">
            Begin Your Intent
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-white">
            Shape your next experience
          </h1>
        </div>
      </div>

      {/* Step progress bar — sticky below photo */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs text-stone-500 font-sans">Step {wizard.currentStep} of {wizard.totalSteps}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: wizard.totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    wizard.goToStep(step);
                    handleStepChange();
                  }}
                  disabled={step > wizard.currentStep}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-serif transition-all',
                    step === wizard.currentStep
                      ? 'bg-rose-500 text-white scale-110'
                      : step < wizard.currentStep
                      ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  )}
                >
                  {step}
                </button>
                {step < wizard.totalSteps && (
                  <div
                    className={cn(
                      'w-12 md:w-20 h-0.5 transition-colors',
                      step < wizard.currentStep ? 'bg-rose-500' : 'bg-stone-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <form onSubmit={onSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={wizard.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <button
              type="button"
              onClick={handleBack}
              disabled={wizard.isFirstStep}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                wizard.isFirstStep
                  ? 'opacity-0 pointer-events-none'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all',
                'bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating DNA...
                </>
              ) : wizard.isLastStep ? (
                'Generate DNA'
              ) : wizard.isFirstStep ? (
                <>
                  Begin
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
