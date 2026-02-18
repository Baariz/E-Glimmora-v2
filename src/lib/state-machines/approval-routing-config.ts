/**
 * Approval Routing Configuration
 * Multi-level approval chains per resource type and institution
 * Configurable per-institution approval workflows
 */

import { B2BRole } from '@/lib/types/roles';

/**
 * Single step in an approval chain
 */
export interface ApprovalStep {
  order: number;
  role: B2BRole;
  label: string;
  required: boolean;
  parallelWith?: number[]; // Other step orders that can run in parallel
}

/**
 * Complete approval chain for a resource
 */
export interface ApprovalChain {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  institutionId?: string; // If null, applies to all institutions
  steps: ApprovalStep[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Default approval chains for standard workflows
 */
const DEFAULT_CHAINS: ApprovalChain[] = [
  {
    id: 'standard-journey',
    name: 'Standard Journey Approval',
    description: 'Standard two-level approval for client journeys',
    resourceType: 'journey',
    steps: [
      {
        order: 1,
        role: B2BRole.RelationshipManager,
        label: 'RM Review',
        required: true,
      },
      {
        order: 2,
        role: B2BRole.ComplianceOfficer,
        label: 'Compliance Review',
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'high-value-journey',
    name: 'High-Value Journey Approval',
    description: 'Three-level approval for high-value client journeys (>$5M)',
    resourceType: 'journey',
    steps: [
      {
        order: 1,
        role: B2BRole.RelationshipManager,
        label: 'RM Review',
        required: true,
      },
      {
        order: 2,
        role: B2BRole.ComplianceOfficer,
        label: 'Compliance Review',
        required: true,
      },
      {
        order: 3,
        role: B2BRole.PrivateBanker,
        label: 'Private Banker Approval',
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'client-onboarding',
    name: 'Client Onboarding Approval',
    description: 'Approval workflow for new client onboarding',
    resourceType: 'client',
    steps: [
      {
        order: 1,
        role: B2BRole.RelationshipManager,
        label: 'RM Verification',
        required: true,
      },
      {
        order: 2,
        role: B2BRole.ComplianceOfficer,
        label: 'KYC/AML Review',
        required: true,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Institution-specific approval chains (overrides)
 * In production, these would be loaded from database per institution
 */
const INSTITUTION_CHAINS: ApprovalChain[] = [];

/**
 * Get all approval chains
 * @returns All configured approval chains
 */
export function getApprovalChains(): ApprovalChain[] {
  return [...DEFAULT_CHAINS, ...INSTITUTION_CHAINS];
}

/**
 * Get approval chain for a specific resource type
 * @param resourceType - Type of resource (journey, client, etc.)
 * @param institutionId - Optional institution ID for institution-specific chains
 * @returns Approval chain or null if not found
 */
export function getApprovalChain(
  resourceType: string,
  institutionId?: string
): ApprovalChain | null {
  // First, check for institution-specific chain
  if (institutionId) {
    const institutionChain = INSTITUTION_CHAINS.find(
      (chain) =>
        chain.resourceType === resourceType &&
        chain.institutionId === institutionId
    );
    if (institutionChain) {
      return institutionChain;
    }
  }

  // Fall back to default chain
  const defaultChain = DEFAULT_CHAINS.find(
    (chain) => chain.resourceType === resourceType && !chain.institutionId
  );

  return defaultChain || null;
}

/**
 * Get approval step for a specific role in a chain
 * @param chain - Approval chain
 * @param role - B2B role
 * @returns Approval step or null if role not in chain
 */
export function getApprovalStepForRole(
  chain: ApprovalChain,
  role: B2BRole
): ApprovalStep | null {
  return chain.steps.find((step) => step.role === role) || null;
}

/**
 * Check if a role is an approver in a chain
 * @param chain - Approval chain
 * @param role - B2B role
 * @returns True if role is an approver
 */
export function isApprover(chain: ApprovalChain, role: B2BRole): boolean {
  return chain.steps.some((step) => step.role === role);
}

/**
 * Get the next required approval step
 * @param chain - Approval chain
 * @param currentOrder - Current step order (0 if starting)
 * @returns Next approval step or null if complete
 */
export function getNextApprovalStep(
  chain: ApprovalChain,
  currentOrder: number
): ApprovalStep | null {
  const nextSteps = chain.steps.filter(
    (step) => step.order > currentOrder && step.required
  );

  if (nextSteps.length === 0) {
    return null;
  }

  // Return the lowest order step greater than current
  return nextSteps.sort((a, b) => a.order - b.order)[0] ?? null;
}

/**
 * Validate if approval chain is complete
 * @param chain - Approval chain
 * @param completedSteps - Array of completed step orders
 * @returns True if all required steps are complete
 */
export function isApprovalChainComplete(
  chain: ApprovalChain,
  completedSteps: number[]
): boolean {
  const requiredSteps = chain.steps.filter((step) => step.required);
  return requiredSteps.every((step) => completedSteps.includes(step.order));
}
