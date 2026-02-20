/**
 * RBAC Permission Matrices
 * Complete permission definitions for all 11 roles across 3 domains
 */

import { B2CRole, B2BRole, AdminRole, Role, DomainContext } from '@/lib/types/roles';
import { Permission, Resource } from '@/lib/types/permissions';

type PermissionMatrix = Record<Role, Partial<Record<Resource, Permission[]>>>;

// ============================================================================
// B2C Permission Matrices
// ============================================================================

export const B2C_PERMISSIONS: Partial<Record<B2CRole, Partial<Record<Resource, Permission[]>>>> = {
  [B2CRole.UHNI]: {
    journey: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.EXPORT],
    vault: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.EXPORT],
    intent: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.EXPORT],
    privacy: [Permission.READ, Permission.WRITE, Permission.CONFIGURE],
    message: [Permission.READ, Permission.WRITE, Permission.DELETE],
  },

  [B2CRole.Spouse]: {
    journey: [Permission.READ], // Filtered by sharing permissions
    vault: [Permission.READ], // Filtered by sharing, not locked
  },

  [B2CRole.LegacyHeir]: {
    journey: [Permission.READ], // Filtered by sharing
    vault: [Permission.READ], // Filtered, not locked, not hidden
  },

  [B2CRole.ElanAdvisor]: {
    journey: [Permission.READ], // Filtered by visibility scope
    intent: [Permission.READ], // Summary only
    message: [Permission.READ, Permission.WRITE],
  },
};

// ============================================================================
// B2B Permission Matrices
// ============================================================================

const B2B_PERMISSIONS: Partial<Record<B2BRole, Partial<Record<Resource, Permission[]>>>> = {
  [B2BRole.RelationshipManager]: {
    client: [Permission.READ, Permission.WRITE, Permission.ASSIGN],
    journey: [Permission.READ, Permission.WRITE],
    risk: [Permission.READ, Permission.WRITE],
    vault: [Permission.READ],
    audit: [Permission.READ],
    message: [Permission.READ, Permission.WRITE],
    predictive: [Permission.READ, Permission.WRITE],
    crisis: [Permission.READ, Permission.WRITE, Permission.APPROVE],
    vendor: [Permission.READ],
    conflict: [Permission.READ, Permission.WRITE],
    integration: [Permission.READ],
  },

  [B2BRole.PrivateBanker]: {
    client: [Permission.READ],
    journey: [Permission.READ],
    risk: [Permission.READ],
    audit: [Permission.READ],
    revenue: [Permission.READ],
    predictive: [Permission.READ],
    crisis: [Permission.READ],
    vendor: [Permission.READ],
    conflict: [Permission.READ],
  },

  [B2BRole.FamilyOfficeDirector]: {
    client: [Permission.READ],
    journey: [Permission.READ],
    risk: [Permission.READ],
    audit: [Permission.READ],
    revenue: [Permission.READ],
    institution: [Permission.CONFIGURE],
    predictive: [Permission.READ, Permission.CONFIGURE],
    crisis: [Permission.READ, Permission.WRITE, Permission.APPROVE],
    vendor: [Permission.READ, Permission.WRITE, Permission.APPROVE],
    conflict: [Permission.READ],
    integration: [Permission.READ],
  },

  [B2BRole.ComplianceOfficer]: {
    journey: [Permission.READ, Permission.APPROVE],
    client: [Permission.READ],
    risk: [Permission.READ],
    audit: [Permission.READ, Permission.EXPORT],
    predictive: [Permission.READ],
    crisis: [Permission.READ, Permission.APPROVE],
    vendor: [Permission.READ, Permission.APPROVE, Permission.EXPORT],
    conflict: [Permission.READ, Permission.APPROVE],
    integration: [Permission.READ],
  },

  [B2BRole.InstitutionalAdmin]: {
    institution: [Permission.CONFIGURE],
    user: [Permission.READ, Permission.WRITE, Permission.ASSIGN],
    contract: [Permission.READ, Permission.WRITE],
    audit: [Permission.READ],
    privacy: [Permission.CONFIGURE],
    crisis: [Permission.READ, Permission.CONFIGURE],
    vendor: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.CONFIGURE],
    conflict: [Permission.READ, Permission.CONFIGURE],
    integration: [Permission.READ, Permission.WRITE, Permission.CONFIGURE],
  },

  [B2BRole.UHNIPortal]: {
    journey: [Permission.READ],
    client: [Permission.READ],
  },
};

// ============================================================================
// Admin Permission Matrices
// ============================================================================

const ADMIN_PERMISSIONS: Partial<Record<AdminRole, Partial<Record<Resource, Permission[]>>>> = {
  [AdminRole.SuperAdmin]: {
    invite: [Permission.READ, Permission.WRITE, Permission.DELETE],
    institution: [Permission.READ, Permission.WRITE, Permission.CONFIGURE],
    user: [Permission.READ, Permission.CONFIGURE],
    audit: [Permission.READ, Permission.EXPORT],
    revenue: [Permission.READ],
    contract: [Permission.READ],
    integration: [Permission.READ, Permission.CONFIGURE],
  },
};

// ============================================================================
// Permission Resolution Functions
// ============================================================================

/**
 * Get the permission matrix for a given domain context
 */
export function getPermissionMatrix(context: DomainContext): Partial<Record<Role, Partial<Record<Resource, Permission[]>>>> {
  switch (context) {
    case 'b2c':
      return B2C_PERMISSIONS as Partial<Record<Role, Partial<Record<Resource, Permission[]>>>>;
    case 'b2b':
      return B2B_PERMISSIONS as Partial<Record<Role, Partial<Record<Resource, Permission[]>>>>;
    case 'admin':
      return ADMIN_PERMISSIONS as Partial<Record<Role, Partial<Record<Resource, Permission[]>>>>;
    default:
      return {};
  }
}

/**
 * Pure function to check if a role has a specific permission on a resource
 * @param role - The user's role in the current context
 * @param action - The permission being checked (READ, WRITE, etc.)
 * @param resource - The resource type (journey, vault, etc.)
 * @param context - The domain context (b2c, b2b, admin)
 * @returns true if the role has the permission, false otherwise
 */
export function hasPermission(
  role: Role,
  action: Permission,
  resource: Resource,
  context: DomainContext
): boolean {
  const matrix = getPermissionMatrix(context);
  const rolePermissions = matrix[role];

  if (!rolePermissions) {
    return false;
  }

  const resourcePermissions = rolePermissions[resource];

  if (!resourcePermissions) {
    return false;
  }

  return resourcePermissions.includes(action);
}
