/**
 * Institution Service Interface
 * Manages financial institution accounts and contracts
 */

import { Institution, CreateInstitutionInput } from '@/lib/types';

export interface IInstitutionService {
  getInstitutions(): Promise<Institution[]>;
  getInstitutionById(id: string): Promise<Institution | null>;
  createInstitution(data: CreateInstitutionInput): Promise<Institution>;
  updateInstitution(id: string, data: Partial<Institution>): Promise<Institution>;
  suspendInstitution(id: string): Promise<Institution>;
  reactivateInstitution(id: string): Promise<Institution>;
  removeInstitution(id: string): Promise<Institution>;
}
