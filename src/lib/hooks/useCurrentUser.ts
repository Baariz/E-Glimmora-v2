'use client';

/**
 * Current User Hook for B2C Context
 * Returns a mock UHNI user for development.
 * When real auth is connected, this reads from session.
 */

import { useMemo } from 'react';
import type { User } from '@/lib/types/entities';
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
  return useMemo(
    () => ({
      user: MOCK_UHNI_USER,
      isLoading: false,
    }),
    []
  );
}
