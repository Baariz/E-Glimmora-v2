'use client';

/**
 * Institution Onboarding Page
 * Wrapper for onboarding wizard
 */

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InstitutionOnboardingWizard } from '@/components/admin/institutions/InstitutionOnboardingWizard';

export default function NewInstitutionPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => router.push('/institutions')}
        className="flex items-center gap-2 text-sm font-sans text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Institutions
      </button>

      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-light text-gray-900">
          Onboard New Institution
        </h1>
        <p className="text-base font-sans text-gray-600">
          Follow the guided setup to add a new financial institution to the platform
        </p>
      </div>

      {/* Wizard */}
      <InstitutionOnboardingWizard />
    </div>
  );
}
