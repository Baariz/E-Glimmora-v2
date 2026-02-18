/**
 * B2C Role-Based Data Filtering Functions
 * Filters data visibility based on UHNI privacy settings and role permissions
 */

import { B2CRole } from '@/lib/types/roles';
import { Journey, MemoryItem, Message, MessageThread, AdvisorResourcePermissions, JourneyStatus } from '@/lib/types';

/**
 * Navigation links configuration per B2C role
 */
export function getNavLinksForRole(role: B2CRole): Array<{ href: string; label: string }> {
  switch (role) {
    case B2CRole.UHNI:
      // Full access to all 6 B2C sections + Privacy
      return [
        { href: '/briefing', label: 'Briefing' },
        { href: '/intent', label: 'Intent' },
        { href: '/journeys', label: 'Journeys' },
        { href: '/messages', label: 'Messages' },
        { href: '/intelligence', label: 'Intelligence' },
        { href: '/vault', label: 'Vault' },
      ];

    case B2CRole.Spouse:
      // Restricted to shared journeys and memories
      return [
        { href: '/journeys', label: 'Shared Journeys' },
        { href: '/vault', label: 'Shared Memories' },
      ];

    case B2CRole.LegacyHeir:
      // View-only access to shared content
      return [
        { href: '/journeys', label: 'Shared Journeys' },
        { href: '/vault', label: 'Shared Memories' },
      ];

    case B2CRole.ElanAdvisor:
      // Contextual collaboration view
      return [
        { href: '/journeys', label: 'Client Journeys' },
        { href: '/messages', label: 'Messages' },
        { href: '/intelligence', label: 'Intelligence' },
      ];

    default:
      return [];
  }
}

/**
 * Filter journeys based on role and UHNI privacy settings
 */
export function filterJourneysForRole(
  journeys: Journey[],
  role: B2CRole,
  advisorId?: string,
  advisorResourcePermissions?: Record<string, AdvisorResourcePermissions>
): Journey[] {
  switch (role) {
    case B2CRole.UHNI:
      // UHNI sees everything
      return journeys;

    case B2CRole.Spouse:
      // Spouse sees: approved status + NOT invisible
      // Note: In full implementation, journey would have familySharing prop
      // For now, filter by approved status and visibility
      return journeys.filter(
        (j) => j.status === JourneyStatus.APPROVED && !j.isInvisible
      );

    case B2CRole.LegacyHeir:
      // Heir sees: approved status only
      return journeys.filter(
        (j) => j.status === JourneyStatus.APPROVED
      );

    case B2CRole.ElanAdvisor:
      // Advisor sees: based on granular permissions
      if (!advisorId || !advisorResourcePermissions?.[advisorId]) {
        return [];
      }

      const permissions = advisorResourcePermissions[advisorId];
      const journeyPermission = permissions?.journeys;

      if (journeyPermission === 'all') {
        // All non-invisible journeys
        return journeys.filter((j) => !j.isInvisible);
      } else if (journeyPermission === 'none') {
        return [];
      } else if (Array.isArray(journeyPermission)) {
        // Specific journey IDs
        return journeys.filter(
          (j) => journeyPermission.includes(j.id) && !j.isInvisible
        );
      }

      return [];

    default:
      return [];
  }
}

/**
 * Filter memories based on role and sharing settings
 */
export function filterMemoriesForRole(
  memories: MemoryItem[],
  role: B2CRole,
  advisorId?: string,
  advisorResourcePermissions?: Record<string, AdvisorResourcePermissions>
): MemoryItem[] {
  switch (role) {
    case B2CRole.UHNI:
      // UHNI sees everything
      return memories;

    case B2CRole.Spouse:
      // Spouse sees: shared + NOT locked
      return memories.filter(
        (m) => m.sharingPermissions.includes('spouse') && !m.isLocked
      );

    case B2CRole.LegacyHeir:
      // Heir sees: shared + NOT locked
      return memories.filter(
        (m) => m.sharingPermissions.includes('heir') && !m.isLocked
      );

    case B2CRole.ElanAdvisor:
      // Advisor sees: NONE unless memories permission granted
      if (!advisorId || !advisorResourcePermissions?.[advisorId]) {
        return [];
      }

      const permissions = advisorResourcePermissions[advisorId];
      if (permissions?.memories) {
        // If memories permission granted, show shared memories only
        return memories.filter((m) => !m.isLocked);
      }

      return [];

    default:
      return [];
  }
}

/**
 * Filter message threads based on role
 */
export function filterThreadsForRole(
  threads: MessageThread[],
  role: B2CRole,
  userId?: string
): MessageThread[] {
  switch (role) {
    case B2CRole.UHNI:
      // UHNI sees all their threads
      return threads;

    case B2CRole.Spouse:
    case B2CRole.LegacyHeir:
      // Spouse and Heir see NO message threads
      return [];

    case B2CRole.ElanAdvisor:
      // Advisor sees ONLY threads they are a participant in
      if (!userId) {
        return [];
      }
      return threads.filter(
        (t) => t.participants.includes(userId)
      );

    default:
      return [];
  }
}

/**
 * Filter messages based on role
 * Note: This filters individual messages. For thread-based filtering,
 * use filterThreadsForRole and then get messages for those threads.
 */
export function filterMessagesForRole(
  messages: Message[],
  role: B2CRole,
  userId?: string
): Message[] {
  switch (role) {
    case B2CRole.UHNI:
      // UHNI sees all their messages
      return messages;

    case B2CRole.Spouse:
    case B2CRole.LegacyHeir:
      // Spouse and Heir see NO messages
      return [];

    case B2CRole.ElanAdvisor:
      // Advisor sees ONLY messages they sent
      // (Thread-level filtering is done separately)
      if (!userId) {
        return [];
      }
      return messages.filter(
        (m) => m.senderId === userId
      );

    default:
      return [];
  }
}

/**
 * Check if role has access to a specific resource
 */
export function canAccessResource(
  role: B2CRole,
  resource: 'briefing' | 'intent' | 'journeys' | 'messages' | 'intelligence' | 'vault' | 'privacy'
): boolean {
  const navLinks = getNavLinksForRole(role);

  switch (resource) {
    case 'briefing':
      return role === B2CRole.UHNI;
    case 'intent':
      return role === B2CRole.UHNI;
    case 'journeys':
      return navLinks.some((link) => link.href.includes('journeys'));
    case 'messages':
      return navLinks.some((link) => link.href.includes('messages'));
    case 'intelligence':
      return role === B2CRole.UHNI || role === B2CRole.ElanAdvisor;
    case 'vault':
      return navLinks.some((link) => link.href.includes('vault'));
    case 'privacy':
      return role === B2CRole.UHNI; // Only UHNI can access privacy settings
    default:
      return false;
  }
}

/**
 * Get role display badge configuration
 */
export function getRoleBadge(role: B2CRole): { label: string; color: string } | null {
  switch (role) {
    case B2CRole.UHNI:
      return null; // UHNI doesn't need a badge

    case B2CRole.Spouse:
      return { label: 'Spouse Access', color: 'bg-teal-100 text-teal-800' };

    case B2CRole.LegacyHeir:
      return { label: 'Legacy Heir', color: 'bg-sand-100 text-sand-800' };

    case B2CRole.ElanAdvisor:
      return { label: 'Advisor', color: 'bg-rose-100 text-rose-800' };

    default:
      return null;
  }
}
