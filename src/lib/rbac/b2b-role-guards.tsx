/**
 * B2B Role Route Access Configuration
 * Maps B2B roles to allowed routes based on permission matrices
 */

import { B2BRole } from '@/lib/types/roles';
import { Resource, Permission } from '@/lib/types/permissions';
import { hasPermission } from './permissions';

export interface RouteAccess {
  path: string;
  label: string;
  icon: string;
  requiredResource: Resource;
  requiredAction: Permission;
}

/**
 * All B2B routes with their permission requirements
 */
export const B2B_ROUTES: RouteAccess[] = [
  { path: '/portfolio', label: 'Portfolio', icon: '⊞', requiredResource: 'client', requiredAction: Permission.READ },
  { path: '/clients', label: 'Clients', icon: '⚭', requiredResource: 'client', requiredAction: Permission.READ },
  { path: '/governance', label: 'Journeys', icon: '✈', requiredResource: 'journey', requiredAction: Permission.READ },
  { path: '/risk', label: 'Risk', icon: '⚠', requiredResource: 'risk', requiredAction: Permission.READ },
  { path: '/access', label: 'Access', icon: '⊕', requiredResource: 'institution', requiredAction: Permission.CONFIGURE },
  { path: '/predictive', label: 'Intelligence', icon: '◈', requiredResource: 'predictive', requiredAction: Permission.READ },
  { path: '/crisis', label: 'Crisis', icon: '⊙', requiredResource: 'crisis', requiredAction: Permission.READ },
  { path: '/conflicts', label: 'Conflicts', icon: '⊗', requiredResource: 'conflict', requiredAction: Permission.READ },
  { path: '/vault', label: 'Vault', icon: '⊠', requiredResource: 'vault', requiredAction: Permission.READ },
  { path: '/revenue', label: 'Revenue', icon: '$', requiredResource: 'contract', requiredAction: Permission.READ },
  { path: '/vendors', label: 'Vendors', icon: '⊡', requiredResource: 'vendor', requiredAction: Permission.READ },
  { path: '/integrations', label: 'Integrations', icon: '⊘', requiredResource: 'integration', requiredAction: Permission.READ },
];

/**
 * Default landing page per B2B role
 */
export const B2B_ROLE_DEFAULTS: Record<B2BRole, string> = {
  [B2BRole.RelationshipManager]: '/portfolio',
  [B2BRole.PrivateBanker]: '/portfolio',
  [B2BRole.FamilyOfficeDirector]: '/portfolio',
  [B2BRole.ComplianceOfficer]: '/governance',
  [B2BRole.InstitutionalAdmin]: '/access',
  [B2BRole.UHNIPortal]: '/portfolio',
};

/**
 * Check if a role can access a specific route
 * Portfolio is accessible to all B2B roles (universal landing page)
 */
export function canAccessB2BRoute(role: B2BRole, pathname: string): boolean {
  // Portfolio is accessible to all B2B roles
  if (pathname.startsWith('/portfolio')) {
    return true;
  }

  const route = B2B_ROUTES.find(r => pathname.startsWith(r.path));
  if (!route) {
    // Unknown route - allow (might be a detail page)
    return true;
  }

  return hasPermission(role, route.requiredAction, route.requiredResource, 'b2b');
}

/**
 * Get default route for a role
 */
export function getB2BRoleDefaultRoute(role: B2BRole): string {
  return B2B_ROLE_DEFAULTS[role] || '/portfolio';
}

/**
 * Get navigation items visible to a specific role
 */
export function getB2BNavItems(role: B2BRole): RouteAccess[] {
  // Portfolio is always visible
  const portfolioRoute = B2B_ROUTES.find(r => r.path === '/portfolio')!;

  const accessibleRoutes = B2B_ROUTES.filter(route => {
    // Portfolio already included
    if (route.path === '/portfolio') return false;

    return hasPermission(role, route.requiredAction, route.requiredResource, 'b2b');
  });

  return [portfolioRoute, ...accessibleRoutes];
}
