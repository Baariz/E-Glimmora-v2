'use client';

/**
 * Intent Wizard Orchestrator
 * 5-step intake wizard for Intent Profile creation
 * Full-bleed cinematic hero extending behind transparent nav.
 */

import { useState, useEffect } from 'react';
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
} from '@/lib/validation/intent-schemas';
import { LifePhaseStep } from './steps/LifePhaseStep';
import { EmotionalOutcomeStep } from './steps/EmotionalOutcomeStep';
import { TravelModeStep } from './steps/TravelModeStep';
import { PrioritiesStep } from './steps/PrioritiesStep';
import { DiscretionStep } from './steps/DiscretionStep';
import { Loader2, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { IMAGES } from '@/lib/constants/imagery';

const WIZARD_STORAGE_KEY = 'wizard_intent';

const STEP_IMAGES = [
  IMAGES.heroAerial,
  IMAGES.heroWellness,
  IMAGES.heroMaldives,
  IMAGES.heroTemple,
  IMAGES.heroSuite,
];

const STEP_TITLES = [
  'Your life phase',
  'Emotional drivers',
  'Travel style',
  'Your priorities',
  'Privacy & risk',
];

const STEP_SUBTITLES = [
  'Tell us where you are in your journey',
  'What emotions guide your choices',
  'How you prefer to experience the world',
  'What matters most to you',
  'How we protect your world',
];

export function IntentWizard() {
  const router = useRouter();
  const services = useServices();
  const { user: currentUser } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll to wizard-content if navigated with hash (e.g. from "Refine Profile")
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#wizard-content') {
      const el = document.getElementById('wizard-content');
      if (el) {
        // Small delay to ensure layout is painted
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, []);

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

  const getCurrentStepSchema = () => {
    switch (wizard.currentStep) {
      case 1: return Step1Schema;
      case 2: return Step2Schema;
      case 3: return Step3Schema;
      case 4: return Step4Schema;
      case 5: return Step5Schema;
      default: return Step1Schema;
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(getCurrentStepSchema()),
    defaultValues: wizard.formData,
    mode: 'onChange',
  });

  const handleStepChange = () => {
    form.reset(wizard.formData, { keepDefaultValues: false });
  };

  const handleNext = async (data: any) => {
    setError(null);

    if (wizard.isLastStep) {
      setIsSubmitting(true);

      try {
        const completeData = { ...wizard.formData, ...data };
        const validatedData = IntentProfileMasterSchema.parse(completeData);

        if (!currentUser) {
          throw new Error('No user logged in');
        }

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

        wizard.reset();
        router.push('/intent');
      } catch (err) {
        console.error('Failed to create intent profile:', err);
        setError('Failed to generate your profile. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      wizard.next(data);
      handleStepChange();
    }
  };

  const handleBack = () => {
    wizard.back();
    handleStepChange();
  };

  const onSubmit = form.handleSubmit(handleNext as any);

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1: return <LifePhaseStep form={form as any} />;
      case 2: return <EmotionalOutcomeStep form={form as any} />;
      case 3: return <TravelModeStep form={form as any} />;
      case 4: return <PrioritiesStep form={form as any} />;
      case 5: return <DiscretionStep form={form as any} />;
      default: return null;
    }
  };

  const currentImage = STEP_IMAGES[wizard.currentStep - 1] || STEP_IMAGES[0];
  const currentTitle = STEP_TITLES[wizard.currentStep - 1];
  const currentSubtitle = STEP_SUBTITLES[wizard.currentStep - 1];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* ═══════ FULL-BLEED HERO — immersive, no nav ═══════ */}
      <div
        className="relative min-h-[38vh] sm:min-h-[42vh] bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Mini header: logo + close */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-12 lg:px-16 py-5">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/Logo/elan-glimmora.png"
              alt="Élan Glimmora"
              width={120}
              height={36}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <Link
            href="/intent"
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label="Exit wizard"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative z-10 flex flex-col justify-end h-full min-h-[38vh] sm:min-h-[42vh] max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 pt-20 pb-10 sm:pb-14">
          <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-4" />
          <p className="text-amber-300/60 text-[10px] font-sans uppercase tracking-[5px] mb-3">
            Step {wizard.currentStep} of {wizard.totalSteps}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-[0.95] tracking-[-0.01em] mb-3 max-w-lg">
            {currentTitle}
          </h1>
          <p className="text-white/40 font-sans text-sm max-w-md tracking-wide">
            {currentSubtitle}
          </p>
        </div>
      </div>

      {/* ═══════ STEP PROGRESS — elegant minimal dots ═══════ */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-sand-200/60 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-5">
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: wizard.totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (step <= wizard.currentStep) {
                      wizard.goToStep(step);
                      handleStepChange();
                    }
                  }}
                  disabled={step > wizard.currentStep}
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center font-sans text-xs font-medium transition-all duration-300',
                    step === wizard.currentStep
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-110'
                      : step < wizard.currentStep
                      ? 'bg-rose-100 text-rose-600 hover:bg-rose-200 cursor-pointer'
                      : 'bg-sand-100 text-stone-300 cursor-not-allowed'
                  )}
                >
                  {step < wizard.currentStep ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    step
                  )}
                </button>
                {step < wizard.totalSteps && (
                  <div
                    className={cn(
                      'w-10 sm:w-16 md:w-20 h-px transition-colors duration-500',
                      step < wizard.currentStep ? 'bg-rose-300' : 'bg-sand-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ STEP CONTENT ═══════ */}
      <div id="wizard-content" className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16">
        <form onSubmit={onSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={wizard.currentStep}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div className="mb-10 p-5 bg-red-50 border border-red-200/60 rounded-2xl text-center">
              <p className="text-red-600 text-sm font-sans">{error}</p>
            </div>
          )}

          {/* ═══════ NAVIGATION ═══════ */}
          <div className="flex items-center justify-between max-w-3xl mx-auto pt-4 border-t border-sand-200/60">
            <button
              type="button"
              onClick={handleBack}
              disabled={wizard.isFirstStep}
              className={cn(
                'group flex items-center gap-2 px-5 py-3 rounded-full font-sans text-[13px] font-medium transition-all',
                wizard.isFirstStep
                  ? 'opacity-0 pointer-events-none'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
              )}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'group flex items-center gap-2.5 px-8 py-3.5 rounded-full font-sans text-[13px] font-semibold tracking-wide transition-all shadow-lg',
                'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating DNA...
                </>
              ) : wizard.isLastStep ? (
                'Generate DNA'
              ) : wizard.isFirstStep ? (
                <>
                  Begin
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
