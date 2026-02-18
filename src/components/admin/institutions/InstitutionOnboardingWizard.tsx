'use client';

/**
 * Institution Onboarding Wizard
 * 3-step guided setup: Details → Configuration → Review
 */

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/hooks/useWizard';
import { useServices } from '@/lib/hooks/useServices';
import type { InstitutionType, InstitutionTier } from '@/lib/types';
import { toast } from 'sonner';

interface InstitutionFormData {
  name: string;
  type: InstitutionType;
  tier: InstitutionTier;
  contractStart: string;
  contractEnd?: string;
  notes?: string;
}

export function InstitutionOnboardingWizard() {
  const router = useRouter();
  const services = useServices();
  const [submitting, setSubmitting] = useState(false);
  const [createdInstitutionId, setCreatedInstitutionId] = useState<string | null>(null);

  const wizard = useWizard<InstitutionFormData>({
    totalSteps: 3,
    storageKey: 'institution_onboarding',
    initialData: {
      type: 'Private Bank',
      tier: 'Silver',
      contractStart: new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const institution = await services.institution.createInstitution({
        name: wizard.formData.name!,
        type: wizard.formData.type!,
        tier: wizard.formData.tier!,
      });

      // Audit log
      services.audit.log({
        event: 'institution.create',
        userId: 'admin-super-001',
        resourceId: institution.id,
        resourceType: 'institution',
        context: 'admin',
        action: 'CREATE',
        metadata: {
          name: institution.name,
          type: institution.type,
          tier: institution.tier,
        },
      });

      setCreatedInstitutionId(institution.id);
      wizard.reset();
      toast.success('Institution onboarded successfully');
    } catch (error) {
      console.error('Failed to create institution:', error);
      toast.error('Failed to create institution');
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (createdInstitutionId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle size={64} className="text-teal-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-light text-gray-900">
              Institution Onboarded Successfully
            </h2>
            <p className="text-base font-sans text-gray-600">
              The institution has been added to the platform
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => router.push(`/institutions/${createdInstitutionId}`)}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-sans rounded-md hover:bg-gray-800 transition-colors"
            >
              View Institution
            </button>
            <button
              onClick={() => router.push('/institutions')}
              className="px-4 py-2 bg-white text-gray-900 text-sm font-sans border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center gap-2 ${
                step < 3 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans ${
                  wizard.currentStep === step
                    ? 'bg-rose-600 text-white'
                    : wizard.currentStep > step
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {wizard.currentStep > step ? <CheckCircle size={16} /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`h-0.5 flex-1 ${
                    wizard.currentStep > step ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs font-sans text-gray-600">
          <span>Details</span>
          <span>Configuration</span>
          <span>Review</span>
        </div>
      </div>

      {/* Step 1: Basic Details */}
      {wizard.currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-light text-gray-900 mb-2">
              Institution Details
            </h2>
            <p className="text-sm font-sans text-gray-600">
              Enter the basic information for this institution
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                value={wizard.formData.name || ''}
                onChange={(e) =>
                  wizard.next({ ...wizard.formData, name: e.target.value })
                }
                placeholder="e.g., Rothschild & Co. Private Wealth"
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                Institution Type *
              </label>
              <select
                value={wizard.formData.type || 'Private Bank'}
                onChange={(e) =>
                  wizard.next({ ...wizard.formData, type: e.target.value as InstitutionType })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="Private Bank">Private Bank</option>
                <option value="Family Office">Family Office</option>
                <option value="Wealth Manager">Wealth Manager</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => wizard.next(wizard.formData)}
              disabled={!wizard.formData.name}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-sans rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configuration */}
      {wizard.currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-light text-gray-900 mb-2">
              Contract Configuration
            </h2>
            <p className="text-sm font-sans text-gray-600">
              Set the service tier and contract dates
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                Service Tier *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Platinum', 'Gold', 'Silver'] as InstitutionTier[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => wizard.next({ ...wizard.formData, tier })}
                    className={`px-4 py-3 border rounded-md text-sm font-sans transition-colors ${
                      wizard.formData.tier === tier
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                  Contract Start *
                </label>
                <input
                  type="date"
                  value={wizard.formData.contractStart || ''}
                  onChange={(e) =>
                    wizard.next({ ...wizard.formData, contractStart: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">
                  Contract End (Optional)
                </label>
                <input
                  type="date"
                  value={wizard.formData.contractEnd || ''}
                  onChange={(e) =>
                    wizard.next({ ...wizard.formData, contractEnd: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={wizard.back}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 text-sm font-sans border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              onClick={() => wizard.next(wizard.formData)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-sans rounded-md hover:bg-gray-800 transition-colors"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {wizard.currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif font-light text-gray-900 mb-2">
              Review & Confirm
            </h2>
            <p className="text-sm font-sans text-gray-600">
              Verify the information before creating the institution
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-sans text-gray-600">Institution Name</span>
              <span className="text-sm font-sans font-medium text-gray-900">
                {wizard.formData.name}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-sans text-gray-600">Type</span>
              <span className="text-sm font-sans font-medium text-gray-900">
                {wizard.formData.type}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-sans text-gray-600">Tier</span>
              <span className="text-sm font-sans font-medium text-gray-900">
                {wizard.formData.tier}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-sans text-gray-600">Contract Period</span>
              <span className="text-sm font-sans font-medium text-gray-900">
                {wizard.formData.contractStart}
                {wizard.formData.contractEnd ? ` → ${wizard.formData.contractEnd}` : ' (ongoing)'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={wizard.back}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 text-sm font-sans border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white text-sm font-sans rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Institution'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
