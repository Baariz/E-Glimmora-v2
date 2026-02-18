'use client';

/**
 * Reusable Multi-Step Wizard Hook
 * Manages step navigation, form data accumulation, and localStorage persistence
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWizardOptions<T = Record<string, unknown>> {
  totalSteps: number;
  storageKey: string;
  initialData?: Partial<T>;
}

interface WizardState<T = Record<string, unknown>> {
  currentStep: number;
  totalSteps: number;
  formData: Partial<T>;
  isFirstStep: boolean;
  isLastStep: boolean;
  next: (stepData: Partial<T>) => void;
  back: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const EMPTY_OBJ = {} as Record<string, unknown>;

export function useWizard<T = Record<string, unknown>>({
  totalSteps,
  storageKey,
  initialData,
}: UseWizardOptions<T>): WizardState<T> {
  const stableInitialData = (initialData ?? EMPTY_OBJ) as Partial<T>;
  const initialDataRef = useRef(stableInitialData);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<T>>(stableInitialData);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore from localStorage on mount only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setFormData(parsed.formData || initialDataRef.current);
          setCurrentStep(parsed.currentStep || 1);
        }
      } catch (error) {
        console.error('Failed to restore wizard state:', error);
      }
      setIsHydrated(true);
    }
  }, [storageKey]);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            currentStep,
            formData,
          })
        );
      } catch (error) {
        console.error('Failed to persist wizard state:', error);
      }
    }
  }, [currentStep, formData, storageKey, isHydrated]);

  const next = useCallback(
    (stepData: Partial<T>) => {
      setFormData((prev) => ({ ...prev, ...stepData }));
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      }
    },
    [currentStep, totalSteps]
  );

  const back = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setFormData(initialDataRef.current);
    setCurrentStep(1);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    currentStep,
    totalSteps,
    formData,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    next,
    back,
    goToStep,
    reset,
  };
}
