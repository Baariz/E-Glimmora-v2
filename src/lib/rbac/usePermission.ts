'use client';

/**
 * Permission Resolution Hooks
 * Integrates RBAC permission system with auth context
 */

import { useAuth } from '@/lib/hooks/useAuth';
import { hasPermission } from './permissions';
import { Permission, Resource } from '@/lib/types/permissions';

/**
 * Hook to check if current user has a specific permission
 * @param action - The permission to check (READ, WRITE, etc.)
 * @param resource - The resource type (journey, vault, etc.)
 * @returns true if user has permission, false otherwise
 */
export function usePermission(action: Permission, resource: Resource): boolean {
  const { currentRole, context } = useAuth();

  if (!currentRole) {
    return false;
  }

  return hasPermission(currentRole, action, resource, context);
}

/**
 * More ergonomic hook that returns a can() function for multiple checks
 * @returns Object with can() function
 *
 * @example
 * const { can } = useCan();
 * if (can('WRITE', 'journey')) {
 *   // Show edit button
 * }
 */
export function useCan() {
  const { currentRole, context } = useAuth();

  const can = (action: Permission, resource: Resource): boolean => {
    if (!currentRole) {
      return false;
    }

    return hasPermission(currentRole, action, resource, context);
  };

  return { can };
}
