/**
 * Data Access Filters
 * Filter data arrays based on role permissions and sharing rules
 */

import { Journey, MemoryItem } from '@/lib/types/entities';
import { Role, B2CRole, B2BRole, DomainContext } from '@/lib/types/roles';

/**
 * Filter journeys based on user role and access permissions
 * @param journeys - Array of journeys to filter
 * @param userId - Current user's ID
 * @param role - Current user's role
 * @param context - Current domain context
 * @returns Filtered array of journeys user can access
 */
export function filterJourneysByAccess(
  journeys: Journey[],
  userId: string,
  role: Role,
  context: DomainContext
): Journey[] {
  if (context === 'b2c') {
    switch (role) {
      case B2CRole.UHNI:
        // UHNI sees all their own journeys
        return journeys.filter(j => j.userId === userId);

      case B2CRole.Spouse:
        // Spouse sees shared journeys only (not invisible)
        return journeys.filter(j =>
          j.userId === userId && !j.isInvisible
        );

      case B2CRole.LegacyHeir:
        // Legacy heir sees shared journeys (not invisible, not locked)
        return journeys.filter(j =>
          j.userId === userId && !j.isInvisible
        );

      case B2CRole.ElanAdvisor:
        // Advisor sees journeys where they have visibility scope
        // In a real implementation, this would check advisorVisibilityScope
        return journeys.filter(j => j.userId === userId);

      default:
        return [];
    }
  }

  if (context === 'b2b') {
    // B2B roles see journeys for their assigned clients
    switch (role) {
      case B2BRole.RelationshipManager:
        // RM sees journeys for assigned clients
        return journeys.filter(j => j.assignedRM === userId);

      case B2BRole.PrivateBanker:
      case B2BRole.FamilyOfficeDirector:
      case B2BRole.ComplianceOfficer:
        // These roles see all journeys within their institution
        return journeys.filter(j => j.institutionId !== undefined);

      case B2BRole.UHNIPortal:
        // UHNI portal sees only their own journeys
        return journeys.filter(j => j.userId === userId);

      default:
        return [];
    }
  }

  // Admin context - could see all journeys with proper filtering
  return journeys;
}

/**
 * Filter memory items based on user role and sharing permissions
 * @param memories - Array of memory items to filter
 * @param userId - Current user's ID
 * @param role - Current user's role
 * @returns Filtered array of memories user can access
 */
export function filterMemoriesByAccess(
  memories: MemoryItem[],
  userId: string,
  role: Role
): MemoryItem[] {
  switch (role) {
    case B2CRole.UHNI:
      // UHNI sees all their own memories
      return memories.filter(m => m.userId === userId);

    case B2CRole.Spouse:
      // Spouse sees memories where they have sharing permissions
      return memories.filter(m =>
        m.userId === userId && m.sharingPermissions.includes('spouse')
      );

    case B2CRole.LegacyHeir:
      // Legacy heir sees shared memories that are not locked
      return memories.filter(m =>
        m.userId === userId &&
        m.sharingPermissions.includes('heir') &&
        !m.isLocked
      );

    // B2B roles and advisors don't have direct memory vault access
    default:
      return [];
  }
}

/**
 * Generic filter function by permission
 * Can be extended for other resource types
 */
export function filterByPermission<T extends { userId: string }>(
  items: T[],
  userId: string,
  hasAccess: (item: T) => boolean
): T[] {
  return items.filter(item => item.userId === userId && hasAccess(item));
}
