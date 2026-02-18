'use client';

/**
 * Admin Role Guard Component
 * Enforces SuperAdmin role access control for admin routes
 */

import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface AdminRoleGuardProps {
  children: React.ReactNode;
}

export function AdminRoleGuard({ children }: AdminRoleGuardProps) {
  const { currentRole, context } = useAuth();
  const router = useRouter();

  // Only enforce in admin context
  if (context !== 'admin' || !currentRole) {
    return <>{children}</>;
  }

  // Check if current role is SuperAdmin
  if (currentRole !== 'SuperAdmin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl text-rose-600">!</span>
        </div>
        <h2 className="text-2xl font-serif text-slate-900 mb-2">
          Super Admin Access Required
        </h2>
        <p className="text-slate-600 font-sans max-w-md mb-6">
          Your role ({currentRole}) does not have permission to access the admin
          panel. Only Super Admins can view this section.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-rose-700 text-white rounded-md font-sans text-sm hover:bg-rose-800 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
