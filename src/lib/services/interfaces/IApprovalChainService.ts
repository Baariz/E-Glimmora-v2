/**
 * Approval Chain Service Interface
 * Governance workflow configuration per Frontend_Integration_Guide.docx §5.6.
 */

import { ApprovalChain, CreateApprovalChainInput, UpdateApprovalChainInput } from '@/lib/types';

export interface IApprovalChainService {
  list(institutionId?: string): Promise<ApprovalChain[]>;
  get(id: string): Promise<ApprovalChain | null>;
  create(data: CreateApprovalChainInput): Promise<ApprovalChain>;
  update(id: string, data: UpdateApprovalChainInput): Promise<ApprovalChain>;
  assignToJourney(journeyId: string, chainId: string): Promise<void>;
}
