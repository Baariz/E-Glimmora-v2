'use client';

/**
 * Journey Simulation Page
 * Form to generate journey draft for client
 */

import { JourneySimulatorForm } from '@/components/b2b/forms/JourneySimulatorForm';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function JourneySimulatePage() {
  const { can } = useCan();

  if (!can(Permission.WRITE, 'journey')) {
    return (
      <div className="p-8">
        <p className="font-sans text-slate-600">
          You do not have permission to generate journeys.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-sans text-sm text-slate-600">
        <Link href="/governance" className="hover:text-rose-600 transition-colors">
          Journey Governance
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900">Generate Journey</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-rose-900">Generate Journey</h1>
        <p className="mt-2 font-sans text-sm text-slate-600">
          Create a personalized journey proposal for a client. The system will generate a narrative
          based on the client&apos;s profile and your specified parameters.
        </p>
      </div>

      {/* Form */}
      <JourneySimulatorForm />
    </div>
  );
}
