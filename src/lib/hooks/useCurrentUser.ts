'use client';

/**
 * Current User Hook
 * Returns the authenticated user from NextAuth session.
 * Falls back to mock user if session is not available.
 */

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import type { User } from '@/lib/types/entities';
import type { UserRoles } from '@/lib/types/roles';
import { B2CRole } from '@/lib/types/roles';

export const MOCK_UHNI_USER_ID = 'c7e1f2a0-4b3d-4e5f-8a9b-1c2d3e4f5a6b';

const MOCK_UHNI_USER: User = {
  id: MOCK_UHNI_USER_ID,
  email: 'james.duchamp@elan.private',
  name: 'James Duchamp',
  roles: {
    b2c: B2CRole.UHNI,
  },
  avatarUrl: undefined,
  mfaEnabled: true,
  createdAt: '2025-09-15T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
};

export function useCurrentUser() {
  const { data: session, status } = useSession();

  return useMemo(() => {
    // Session is loading
    if (status === 'loading') {
      return { user: null as User | null, isLoading: true };
    }

    // Session exists — build User from session data
    if (session?.user) {
      const sessionUser = session.user as any;
      const user: User = {
        id: sessionUser.id || MOCK_UHNI_USER_ID,
        email: sessionUser.email || '',
        name: sessionUser.name || '',
        roles: (sessionUser.roles as UserRoles) || { b2c: B2CRole.UHNI },
        avatarUrl: sessionUser.image || undefined,
        mfaEnabled: sessionUser.mfaEnabled ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { user, isLoading: false };
    }

    // No session — fall back to mock for development
    return { user: MOCK_UHNI_USER, isLoading: false };
  }, [session, status]);
}
