'use client';

/**
 * Auth hook - NextAuth + domain context
 * Provides current user, domain context, and role resolution
 */

import { useSession, signOut } from 'next-auth/react';
import { useDomainContext } from '@/components/providers/AuthProvider';
import { UserRoles, DomainContext, Role } from '@/lib/types';

interface UseAuthReturn {
  user: {
    id: string;
    email: string;
    name: string;
    roles: UserRoles;
    mfaEnabled?: boolean;
  } | null;
  context: DomainContext;
  setContext: (context: DomainContext) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentRole: Role | null;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const { context, setContext } = useDomainContext();

  const user = session?.user ? {
    id: session.user.id as string,
    email: session.user.email!,
    name: session.user.name!,
    roles: (session.user as any).roles as UserRoles,
    mfaEnabled: (session.user as any).mfaEnabled,
  } : null;

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const currentRole: Role | null = user?.roles
    ? (user.roles[context as keyof UserRoles] as Role) ?? null
    : null;

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return {
    user,
    context,
    setContext,
    isAuthenticated,
    isLoading,
    currentRole,
    logout,
  };
}
