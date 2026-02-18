/**
 * Journey Workflow State Machine
 * Configuration-driven state transitions with permission gating
 */

import { JourneyStatus } from '@/lib/types/entities';
import { Permission, Resource } from '@/lib/types/permissions';
import { Role, DomainContext } from '@/lib/types/roles';
import { hasPermission } from '@/lib/rbac/permissions';

/**
 * Transition definition
 */
interface Transition {
  next: JourneyStatus;
  requiredPermission: {
    action: Permission;
    resource: Resource;
  };
  label?: string;
}

/**
 * Journey workflow state machine configuration
 */
const JOURNEY_TRANSITIONS: Record<JourneyStatus, Record<string, Transition>> = {
  [JourneyStatus.DRAFT]: {
    SUBMIT_FOR_REVIEW: {
      next: JourneyStatus.RM_REVIEW,
      requiredPermission: { action: Permission.WRITE, resource: 'journey' },
      label: 'Submit for Review'
    }
  },
  [JourneyStatus.RM_REVIEW]: {
    APPROVE: {
      next: JourneyStatus.COMPLIANCE_REVIEW,
      requiredPermission: { action: Permission.WRITE, resource: 'journey' },
      label: 'Approve & Send to Compliance'
    },
    REQUEST_CHANGES: {
      next: JourneyStatus.DRAFT,
      requiredPermission: { action: Permission.WRITE, resource: 'journey' },
      label: 'Request Changes'
    }
  },
  [JourneyStatus.COMPLIANCE_REVIEW]: {
    APPROVE: {
      next: JourneyStatus.APPROVED,
      requiredPermission: { action: Permission.APPROVE, resource: 'journey' },
      label: 'Compliance Approval'
    },
    REJECT: {
      next: JourneyStatus.DRAFT,
      requiredPermission: { action: Permission.APPROVE, resource: 'journey' },
      label: 'Reject & Return to Draft'
    }
  },
  [JourneyStatus.APPROVED]: {
    PRESENT_TO_CLIENT: {
      next: JourneyStatus.PRESENTED,
      requiredPermission: { action: Permission.WRITE, resource: 'journey' },
      label: 'Present to Client'
    }
  },
  [JourneyStatus.PRESENTED]: {
    BEGIN_EXECUTION: {
      next: JourneyStatus.EXECUTED,
      requiredPermission: { action: Permission.WRITE, resource: 'journey' },
      label: 'Begin Execution'
    }
  },
  [JourneyStatus.EXECUTED]: {
    ARCHIVE: {
      next: JourneyStatus.ARCHIVED,
      requiredPermission: { action: Permission.WRITE, resource: 'journey' },
      label: 'Archive Journey'
    }
  },
  [JourneyStatus.ARCHIVED]: {}
};

/**
 * Get available transitions for a given state and role
 * @param state - Current journey status
 * @param role - User's role
 * @param context - Domain context (b2c/b2b/admin)
 * @returns Array of available event names
 */
export function getAvailableTransitions(
  state: JourneyStatus,
  role: Role,
  context: DomainContext
): string[] {
  const stateTransitions = JOURNEY_TRANSITIONS[state];
  if (!stateTransitions) {
    return [];
  }

  return Object.entries(stateTransitions)
    .filter(([_, transition]) => {
      const { action, resource } = transition.requiredPermission;
      return hasPermission(role, action, resource, context);
    })
    .map(([event]) => event);
}

/**
 * Execute a state transition
 * @param state - Current journey status
 * @param event - Transition event name
 * @param role - User's role
 * @param context - Domain context
 * @returns Next state
 * @throws Error if transition is invalid or user lacks permission
 */
export function executeTransition(
  state: JourneyStatus,
  event: string,
  role: Role,
  context: DomainContext
): JourneyStatus {
  const stateTransitions = JOURNEY_TRANSITIONS[state];
  if (!stateTransitions) {
    throw new Error(`No transitions available from state: ${state}`);
  }

  const transition = stateTransitions[event];
  if (!transition) {
    throw new Error(`Invalid transition: ${event} from state ${state}`);
  }

  const { action, resource } = transition.requiredPermission;
  if (!hasPermission(role, action, resource, context)) {
    throw new Error(
      `Permission denied: ${role} cannot ${action} ${resource} in ${context} context`
    );
  }

  return transition.next;
}

/**
 * Get human-readable label for a transition event
 * @param event - Transition event name
 * @returns Human-readable label
 */
export function getTransitionLabel(event: string): string {
  for (const stateTransitions of Object.values(JOURNEY_TRANSITIONS)) {
    const transition = stateTransitions[event];
    if (transition?.label) {
      return transition.label;
    }
  }
  // Fallback: convert SNAKE_CASE to Title Case
  return event
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get human-readable label for a journey status
 * @param state - Journey status
 * @returns Human-readable label
 */
export function getStateLabel(state: JourneyStatus): string {
  const labels: Record<JourneyStatus, string> = {
    [JourneyStatus.DRAFT]: 'Draft',
    [JourneyStatus.RM_REVIEW]: 'RM Review',
    [JourneyStatus.COMPLIANCE_REVIEW]: 'Compliance Review',
    [JourneyStatus.APPROVED]: 'Approved',
    [JourneyStatus.PRESENTED]: 'Presented',
    [JourneyStatus.EXECUTED]: 'Executed',
    [JourneyStatus.ARCHIVED]: 'Archived'
  };
  return labels[state] || state;
}

/**
 * Get Tailwind color class for a journey status
 * @param state - Journey status
 * @returns Tailwind color class (e.g., 'slate', 'teal', 'rose')
 */
export function getStateColor(state: JourneyStatus): string {
  const colors: Record<JourneyStatus, string> = {
    [JourneyStatus.DRAFT]: 'slate',
    [JourneyStatus.RM_REVIEW]: 'gold',
    [JourneyStatus.COMPLIANCE_REVIEW]: 'amber',
    [JourneyStatus.APPROVED]: 'teal',
    [JourneyStatus.PRESENTED]: 'olive',
    [JourneyStatus.EXECUTED]: 'emerald',
    [JourneyStatus.ARCHIVED]: 'gray'
  };
  return colors[state] || 'slate';
}
