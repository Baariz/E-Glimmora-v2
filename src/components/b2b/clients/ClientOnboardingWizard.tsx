'use client';

/**
 * Client Onboarding Wizard
 * 4-step wizard for creating new UHNI client records
 */

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useWizard } from '@/lib/hooks/useWizard';
import { useServices } from '@/lib/hooks/useServices';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { RiskCategory } from '@/lib/types';

const MOCK_RM_USER_ID = 'b2b-rm-001-uuid-placeholder';
const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

// Validation schemas for each step
const Step1Schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'both']).optional(),
});

const Step2Schema = z.object({
  initialRiskCategory: z.enum(['Low', 'Medium', 'High', 'Critical']),
  riskNotes: z.string().optional(),
  complianceFlags: z.array(z.string()).optional(),
});

const Step3Schema = z.object({
  ndaStatus: z.enum(['Active', 'Pending', 'None']),
  ndaExpiresAt: z.string().optional(),
  complianceNotes: z.string().optional(),
});

interface ClientOnboardingWizardProps {
  onComplete: (clientId: string) => void;
}

interface WizardData {
  name?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  initialRiskCategory?: RiskCategory;
  riskNotes?: string;
  complianceFlags?: string[];
  ndaStatus?: 'Active' | 'Pending' | 'None';
  ndaExpiresAt?: string;
  complianceNotes?: string;
}

const EMPTY_INITIAL_DATA: WizardData = {};

export function ClientOnboardingWizard({ onComplete }: ClientOnboardingWizardProps) {
  const services = useServices();
  const router = useRouter();
  const initialDataRef = useRef(EMPTY_INITIAL_DATA);

  const wizard = useWizard<WizardData>({
    totalSteps: 4,
    storageKey: 'wizard_client_onboarding',
    initialData: initialDataRef.current,
  });

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = (step: number, data: Partial<WizardData>): boolean => {
    setStepErrors({});

    try {
      if (step === 1) {
        Step1Schema.parse({
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredContact: data.preferredContact,
        });
      } else if (step === 2) {
        Step2Schema.parse({
          initialRiskCategory: data.initialRiskCategory,
          riskNotes: data.riskNotes,
          complianceFlags: data.complianceFlags,
        });
      } else if (step === 3) {
        Step3Schema.parse({
          ndaStatus: data.ndaStatus,
          ndaExpiresAt: data.ndaExpiresAt,
          complianceNotes: data.complianceNotes,
        });
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const key = err.path.join('.');
          errors[key] = err.message;
        });
        setStepErrors(errors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(wizard.currentStep, wizard.formData)) {
      return;
    }
    wizard.next({});
  };

  const handleBack = () => {
    wizard.back();
    setStepErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(wizard.currentStep, wizard.formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a userId for the new client
      const userId = `user-uhni-${Date.now()}`;

      // Create client record
      const client = await services.client.createClient({
        userId,
        institutionId: MOCK_INSTITUTION_ID,
        assignedRM: MOCK_RM_USER_ID,
        name: wizard.formData.name!,
        email: wizard.formData.email!,
      });

      // Create initial risk record
      await services.risk.createRiskRecord({
        userId,
        institutionId: MOCK_INSTITUTION_ID,
        riskScore: wizard.formData.initialRiskCategory === 'Low' ? 20 :
                  wizard.formData.initialRiskCategory === 'Medium' ? 50 :
                  wizard.formData.initialRiskCategory === 'High' ? 75 : 90,
        riskCategory: wizard.formData.initialRiskCategory || 'Low',
        flags: wizard.formData.complianceFlags || [],
        assessedBy: MOCK_RM_USER_ID,
      });

      // Update client with NDA and risk info
      await services.client.updateClient(client.id, {
        riskCategory: wizard.formData.initialRiskCategory || 'Low',
        riskScore: wizard.formData.initialRiskCategory === 'Low' ? 20 :
                  wizard.formData.initialRiskCategory === 'Medium' ? 50 :
                  wizard.formData.initialRiskCategory === 'High' ? 75 : 90,
        ndaStatus: wizard.formData.ndaStatus || 'None',
        ndaExpiresAt: wizard.formData.ndaExpiresAt,
        status: 'Onboarding',
      });

      // Clear wizard state
      wizard.reset();

      // Call completion callback
      onComplete(client.id);
    } catch (error) {
      console.error('Failed to create client:', error);
      setStepErrors({ submit: 'Failed to create client. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    wizard.next({ [field]: value } as Partial<WizardData>);
    wizard.back(); // Stay on current step
  };

  return (
    <Card className="p-8">
      {/* Step Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-sans font-semibold ${
                  step < wizard.currentStep
                    ? 'bg-teal-500 text-white'
                    : step === wizard.currentStep
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step < wizard.currentStep ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`h-1 w-12 mx-2 ${
                    step < wizard.currentStep ? 'bg-teal-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center font-sans text-sm text-slate-600">
          Step {wizard.currentStep} of 4
        </p>
      </div>

      {/* Step Content */}
      <div className="space-y-6 min-h-[400px]">
        {/* Step 1: Client Details */}
        {wizard.currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-slate-900 mb-2">Client Details</h2>
              <p className="font-sans text-slate-600">
                Enter the basic information for the new client
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <Input
                  value={wizard.formData.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Arabella Chen-Worthington"
                />
                {stepErrors.name && (
                  <p className="mt-1 text-sm text-rose-600">{stepErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={wizard.formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="client@example.com"
                />
                {stepErrors.email && (
                  <p className="mt-1 text-sm text-rose-600">{stepErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  Phone Number (Optional)
                </label>
                <Input
                  type="tel"
                  value={wizard.formData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  Preferred Contact Method
                </label>
                <Select
                  value={wizard.formData.preferredContact || 'email'}
                  onValueChange={(value) => updateField('preferredContact', value)}
                  options={[
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                    { value: 'both', label: 'Both' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Risk Assessment */}
        {wizard.currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-slate-900 mb-2">Risk Assessment</h2>
              <p className="font-sans text-slate-600">
                Provide initial risk evaluation for this client
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  Initial Risk Category *
                </label>
                <Select
                  value={wizard.formData.initialRiskCategory || 'Low'}
                  onValueChange={(value) => updateField('initialRiskCategory', value)}
                  options={[
                    { value: 'Low', label: 'Low Risk' },
                    { value: 'Medium', label: 'Medium Risk' },
                    { value: 'High', label: 'High Risk' },
                    { value: 'Critical', label: 'Critical Risk' },
                  ]}
                />
                {stepErrors.initialRiskCategory && (
                  <p className="mt-1 text-sm text-rose-600">{stepErrors.initialRiskCategory}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  Risk Notes (Optional)
                </label>
                <textarea
                  value={wizard.formData.riskNotes || ''}
                  onChange={(e) => updateField('riskNotes', e.target.value)}
                  placeholder="Document any initial risk considerations..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  Compliance Flags
                </label>
                <div className="space-y-2">
                  {['PEP', 'Sanctions Screen Required', 'Enhanced Due Diligence', 'High Net Worth Verification'].map(
                    (flag) => (
                      <label key={flag} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={wizard.formData.complianceFlags?.includes(flag) || false}
                          onChange={(e) => {
                            const current = wizard.formData.complianceFlags || [];
                            const updated = e.target.checked
                              ? [...current, flag]
                              : current.filter((f) => f !== flag);
                            updateField('complianceFlags', updated);
                          }}
                          className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500"
                        />
                        <span className="ml-2 font-sans text-sm text-slate-700">{flag}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: NDA & Compliance */}
        {wizard.currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-slate-900 mb-2">NDA & Compliance</h2>
              <p className="font-sans text-slate-600">
                Configure confidentiality and compliance settings
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  NDA Status *
                </label>
                <Select
                  value={wizard.formData.ndaStatus || 'None'}
                  onValueChange={(value) => updateField('ndaStatus', value)}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'None', label: 'None' },
                  ]}
                />
                {stepErrors.ndaStatus && (
                  <p className="mt-1 text-sm text-rose-600">{stepErrors.ndaStatus}</p>
                )}
              </div>

              {wizard.formData.ndaStatus === 'Active' && (
                <div>
                  <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                    NDA Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={wizard.formData.ndaExpiresAt || ''}
                    onChange={(e) => updateField('ndaExpiresAt', e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
                  Compliance Notes (Optional)
                </label>
                <textarea
                  value={wizard.formData.complianceNotes || ''}
                  onChange={(e) => updateField('complianceNotes', e.target.value)}
                  placeholder="Additional compliance considerations..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {wizard.currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-slate-900 mb-2">Review & Confirm</h2>
              <p className="font-sans text-slate-600">
                Please review the client information before submitting
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 space-y-4">
              <div>
                <p className="font-sans text-xs uppercase text-slate-500 mb-1">Client Details</p>
                <p className="font-serif text-lg text-slate-900">{wizard.formData.name}</p>
                <p className="font-sans text-sm text-slate-600">{wizard.formData.email}</p>
                {wizard.formData.phone && (
                  <p className="font-sans text-sm text-slate-600">{wizard.formData.phone}</p>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="font-sans text-xs uppercase text-slate-500 mb-1">Risk Assessment</p>
                <p className="font-sans text-sm text-slate-900">
                  <span className="font-semibold">Category:</span> {wizard.formData.initialRiskCategory}
                </p>
                {wizard.formData.complianceFlags && wizard.formData.complianceFlags.length > 0 && (
                  <p className="font-sans text-sm text-slate-900">
                    <span className="font-semibold">Flags:</span>{' '}
                    {wizard.formData.complianceFlags.join(', ')}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="font-sans text-xs uppercase text-slate-500 mb-1">NDA & Compliance</p>
                <p className="font-sans text-sm text-slate-900">
                  <span className="font-semibold">NDA Status:</span> {wizard.formData.ndaStatus}
                </p>
                {wizard.formData.ndaExpiresAt && (
                  <p className="font-sans text-sm text-slate-900">
                    <span className="font-semibold">Expires:</span> {wizard.formData.ndaExpiresAt}
                  </p>
                )}
              </div>
            </div>

            {stepErrors.submit && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <p className="font-sans text-sm text-rose-800">{stepErrors.submit}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={wizard.isFirstStep || isSubmitting}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {wizard.isLastStep ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirm Onboarding
              </>
            )}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext} className="flex items-center gap-2">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
