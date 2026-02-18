'use client';

/**
 * Permission Gate Component
 * Conditionally renders children based on user permissions
 * Does NOT handle routing/redirects - just hides/shows UI
 */

import { ReactNode } from 'react';
import { usePermission } from './usePermission';
import { Permission, Resource } from '@/lib/types/permissions';

interface RequirePermissionProps {
  action: Permission;
  resource: Resource;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Gate component that renders children only if user has permission
 * @param action - Required permission (READ, WRITE, etc.)
 * @param resource - Resource type (journey, vault, etc.)
 * @param children - Content to render if permission granted
 * @param fallback - Optional content to render if permission denied (default: null)
 */
export function RequirePermission({
  action,
  resource,
  children,
  fallback = null
}: RequirePermissionProps) {
  const hasPermission = usePermission(action, resource);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
