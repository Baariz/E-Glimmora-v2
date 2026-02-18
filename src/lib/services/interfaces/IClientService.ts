/**
 * Client Service Interface
 * Manages B2B client records (RM view of UHNI clients)
 */

import { ClientRecord, CreateClientRecordInput } from '@/lib/types';

export interface IClientService {
  getClientsByRM(rmId: string): Promise<ClientRecord[]>;
  getClientsByInstitution(institutionId: string): Promise<ClientRecord[]>;
  getClientById(id: string): Promise<ClientRecord | null>;
  createClient(data: CreateClientRecordInput): Promise<ClientRecord>;
  updateClient(id: string, data: Partial<ClientRecord>): Promise<ClientRecord>;
  assignAdvisor(clientId: string, advisorId: string): Promise<ClientRecord>;
  removeAdvisor(clientId: string, advisorId: string): Promise<ClientRecord>;
  archiveClient(id: string): Promise<ClientRecord>;
}
