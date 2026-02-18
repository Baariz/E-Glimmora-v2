'use client';

/**
 * B2B Role Guard Component
 * Enforces role-based route access control
 */

import { useAuth } from '@/lib/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { canAccessB2BRoute, getB2BRoleDefaultRoute } from '@/lib/rbac/b2b-role-guards';
import { B2BRole } from '@/lib/types/roles';

interface B2BRoleGuardProps {
  children: React.ReactNode;
}

export function B2BRoleGuard({ children }: B2BRoleGuardProps) {
  const { currentRole, context } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Only enforce in B2B context
  if (context !== 'b2b' || !currentRole) {
    return <>{children}</>;
  }

  const b2bRole = currentRole as B2BRole;

  // Check if current role can access current route
  if (!canAccessB2BRoute(b2bRole, pathname)) {
    // Get default route for this role
    const defaultRoute = getB2BRoleDefaultRoute(b2bRole);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl text-rose-600">!</span>
        </div>
        <h2 className="text-2xl font-serif text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-600 font-sans max-w-md mb-6">
          Your role ({b2bRole}) does not have permission to access this section.
        </p>
        <button
          onClick={() => router.push(defaultRoute)}
          className="px-6 py-2 bg-rose-700 text-white rounded-md font-sans text-sm hover:bg-rose-800 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
