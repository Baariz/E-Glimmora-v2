'use client';

/**
 * New Client Onboarding Page
 * Hosts the client onboarding wizard
 */

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { ClientOnboardingWizard } from '@/components/b2b/clients/ClientOnboardingWizard';
import { ChevronRight, Users } from 'lucide-react';

export default function NewClientPage() {
  const router = useRouter();
  const { can } = useCan();
  const canWriteClient = can(Permission.WRITE, 'client');

  const handleComplete = (clientId: string) => {
    toast.success('Client onboarded successfully');
    router.push(`/clients/${clientId}`);
  };

  // Permission gate
  if (!canWriteClient) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-slate-900 mb-2">Access Denied</h2>
          <p className="font-sans text-slate-600">
            You do not have permission to create client records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-sans text-slate-600">
        <button
          onClick={() => router.push('/portfolio')}
          className="hover:text-rose-600 transition-colors"
        >
          Portfolio
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() => router.push('/clients')}
          className="hover:text-rose-600 transition-colors"
        >
          Clients
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900">New Client</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl text-slate-900 mb-2">Onboard New Client</h1>
        <p className="font-sans text-slate-600">
          Complete the onboarding process to add a new UHNI client to your portfolio
        </p>
      </div>

      {/* Wizard */}
      <div className="max-w-3xl">
        <ClientOnboardingWizard onComplete={handleComplete} />
      </div>
    </div>
  );
}
