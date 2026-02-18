/**
 * Mock Client Service
 * localStorage-based B2B client record management
 */

import { BaseMockService } from './base.mock';
import { IClientService } from '../interfaces/IClientService';
import { ClientRecord, CreateClientRecordInput, RiskCategory } from '@/lib/types';

export class MockClientService extends BaseMockService implements IClientService {
  private readonly STORAGE_KEY = 'clients';

  constructor() {
    super();
    this.seedIfEmpty();
  }

  /**
   * Seed initial mock data (idempotent)
   */
  private seedIfEmpty(): void {
    const existing = this.getFromStorage<ClientRecord>(this.STORAGE_KEY);
    if (existing.length > 0) {
      return; // Already seeded
    }

    const mockInstitutionId = 'inst-001-uuid-placeholder';
    const mockRMId = 'b2b-rm-001-uuid-placeholder';
    const now = this.now();

    const seedClients: ClientRecord[] = [
      {
        id: this.generateId(),
        userId: 'user-uhni-001',
        institutionId: mockInstitutionId,
        assignedRM: mockRMId,
        assignedAdvisors: [],
        name: 'Arabella Chen-Worthington',
        email: 'arabella.cw@example.com',
        status: 'Active',
        riskCategory: 'Low',
        riskScore: 25,
        emotionalProfile: {
          security: 85,
          adventure: 45,
          legacy: 70,
          recognition: 30,
          autonomy: 60
        },
        activeJourneyCount: 3,
        totalJourneyCount: 12,
        ndaStatus: 'Active',
        ndaExpiresAt: '2027-06-15T00:00:00Z',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        onboardedAt: '2023-03-15T10:30:00Z',
        createdAt: '2023-03-15T10:30:00Z',
        updatedAt: now
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-002',
        institutionId: mockInstitutionId,
        assignedRM: mockRMId,
        assignedAdvisors: ['advisor-001'],
        name: 'Sebastian Al-Rashid',
        email: 'sebastian.ar@example.com',
        status: 'Active',
        riskCategory: 'Medium',
        riskScore: 52,
        emotionalProfile: {
          security: 40,
          adventure: 90,
          legacy: 55,
          recognition: 75,
          autonomy: 85
        },
        activeJourneyCount: 5,
        totalJourneyCount: 18,
        ndaStatus: 'Active',
        ndaExpiresAt: '2026-11-20T00:00:00Z',
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        onboardedAt: '2022-08-22T14:15:00Z',
        createdAt: '2022-08-22T14:15:00Z',
        updatedAt: now
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-003',
        institutionId: mockInstitutionId,
        assignedRM: mockRMId,
        assignedAdvisors: [],
        name: 'Marguerite Van der Berg',
        email: 'marguerite.vdb@example.com',
        status: 'Active',
        riskCategory: 'High',
        riskScore: 78,
        emotionalProfile: {
          security: 30,
          adventure: 70,
          legacy: 90,
          recognition: 85,
          autonomy: 95
        },
        activeJourneyCount: 2,
        totalJourneyCount: 25,
        ndaStatus: 'Expired',
        ndaExpiresAt: '2026-01-10T00:00:00Z',
        lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        onboardedAt: '2021-05-10T09:00:00Z',
        createdAt: '2021-05-10T09:00:00Z',
        updatedAt: now
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-004',
        institutionId: mockInstitutionId,
        assignedRM: mockRMId,
        assignedAdvisors: ['advisor-001', 'advisor-002'],
        name: 'Dimitri Volkov-Hayes',
        email: 'dimitri.vh@example.com',
        status: 'Onboarding',
        riskCategory: 'Medium',
        riskScore: 45,
        activeJourneyCount: 0,
        totalJourneyCount: 0,
        ndaStatus: 'Pending',
        lastActivity: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
        onboardedAt: now,
        createdAt: now,
        updatedAt: now
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-005',
        institutionId: mockInstitutionId,
        assignedRM: mockRMId,
        assignedAdvisors: [],
        name: 'Lucia Fontaine-Rossi',
        email: 'lucia.fr@example.com',
        status: 'Active',
        riskCategory: 'Low',
        riskScore: 18,
        emotionalProfile: {
          security: 95,
          adventure: 20,
          legacy: 85,
          recognition: 15,
          autonomy: 40
        },
        activeJourneyCount: 1,
        totalJourneyCount: 8,
        ndaStatus: 'Active',
        ndaExpiresAt: '2027-12-01T00:00:00Z',
        lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        onboardedAt: '2024-01-20T11:30:00Z',
        createdAt: '2024-01-20T11:30:00Z',
        updatedAt: now
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-006',
        institutionId: mockInstitutionId,
        assignedRM: mockRMId,
        assignedAdvisors: ['advisor-003'],
        name: 'Takeshi Nakamura-Smith',
        email: 'takeshi.ns@example.com',
        status: 'Active',
        riskCategory: 'Critical',
        riskScore: 92,
        emotionalProfile: {
          security: 20,
          adventure: 95,
          legacy: 60,
          recognition: 90,
          autonomy: 100
        },
        activeJourneyCount: 4,
        totalJourneyCount: 30,
        ndaStatus: 'Active',
        ndaExpiresAt: '2026-08-30T00:00:00Z',
        lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
        onboardedAt: '2020-11-05T16:45:00Z',
        createdAt: '2020-11-05T16:45:00Z',
        updatedAt: now
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-007',
        institutionId: mockInstitutionId,
        assignedRM: mockRMId,
        assignedAdvisors: [],
        name: 'Catalina Reyes-Montenegro',
        email: 'catalina.rm@example.com',
        status: 'Active',
        riskCategory: 'Medium',
        riskScore: 58,
        emotionalProfile: {
          security: 50,
          adventure: 65,
          legacy: 75,
          recognition: 55,
          autonomy: 70
        },
        activeJourneyCount: 2,
        totalJourneyCount: 14,
        ndaStatus: 'Active',
        ndaExpiresAt: '2027-03-15T00:00:00Z',
        lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        onboardedAt: '2023-07-12T13:20:00Z',
        createdAt: '2023-07-12T13:20:00Z',
        updatedAt: now
      },
      {
        id: this.generateId(),
        userId: 'user-uhni-008',
        institutionId: mockInstitutionId,
        assignedRM: mockRMId,
        assignedAdvisors: ['advisor-001'],
        name: 'Percival Ashford-Clarke',
        email: 'percival.ac@example.com',
        status: 'Archived',
        riskCategory: 'Low',
        riskScore: 22,
        activeJourneyCount: 0,
        totalJourneyCount: 6,
        ndaStatus: 'Expired',
        ndaExpiresAt: '2025-09-30T00:00:00Z',
        lastActivity: '2025-10-15T14:30:00Z',
        onboardedAt: '2024-02-14T10:00:00Z',
        createdAt: '2024-02-14T10:00:00Z',
        updatedAt: '2025-11-01T09:00:00Z'
      }
    ];

    this.setInStorage(this.STORAGE_KEY, seedClients);
  }

  async getClientsByRM(rmId: string): Promise<ClientRecord[]> {
    await this.delay();
    const clients = this.getFromStorage<ClientRecord>(this.STORAGE_KEY);
    return clients.filter(c => c.assignedRM === rmId);
  }

  async getClientsByInstitution(institutionId: string): Promise<ClientRecord[]> {
    await this.delay();
    const clients = this.getFromStorage<ClientRecord>(this.STORAGE_KEY);
    return clients.filter(c => c.institutionId === institutionId);
  }

  async getClientById(id: string): Promise<ClientRecord | null> {
    await this.delay();
    const clients = this.getFromStorage<ClientRecord>(this.STORAGE_KEY);
    return clients.find(c => c.id === id) || null;
  }

  async createClient(data: CreateClientRecordInput): Promise<ClientRecord> {
    await this.delay();

    const clients = this.getFromStorage<ClientRecord>(this.STORAGE_KEY);
    const now = this.now();

    const client: ClientRecord = {
      id: this.generateId(),
      userId: data.userId,
      institutionId: data.institutionId,
      assignedRM: data.assignedRM,
      assignedAdvisors: [],
      name: data.name,
      email: data.email,
      status: 'Pending',
      riskCategory: 'Low',
      riskScore: 0,
      activeJourneyCount: 0,
      totalJourneyCount: 0,
      ndaStatus: 'None',
      lastActivity: now,
      onboardedAt: now,
      createdAt: now,
      updatedAt: now
    };

    clients.push(client);
    this.setInStorage(this.STORAGE_KEY, clients);

    return client;
  }

  async updateClient(id: string, data: Partial<ClientRecord>): Promise<ClientRecord> {
    await this.delay();

    const clients = this.getFromStorage<ClientRecord>(this.STORAGE_KEY);
    const index = clients.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Client ${id} not found`);
    }

    const updated = {
      ...clients[index],
      ...data,
      updatedAt: this.now()
    } as ClientRecord;

    clients[index] = updated;
    this.setInStorage(this.STORAGE_KEY, clients);

    return updated;
  }

  async assignAdvisor(clientId: string, advisorId: string): Promise<ClientRecord> {
    await this.delay();

    const clients = this.getFromStorage<ClientRecord>(this.STORAGE_KEY);
    const index = clients.findIndex(c => c.id === clientId);

    if (index === -1) {
      throw new Error(`Client ${clientId} not found`);
    }

    const client = clients[index]!;
    if (!client.assignedAdvisors.includes(advisorId)) {
      client.assignedAdvisors.push(advisorId);
      client.updatedAt = this.now();
      this.setInStorage(this.STORAGE_KEY, clients);
    }

    return client;
  }

  async removeAdvisor(clientId: string, advisorId: string): Promise<ClientRecord> {
    await this.delay();

    const clients = this.getFromStorage<ClientRecord>(this.STORAGE_KEY);
    const index = clients.findIndex(c => c.id === clientId);

    if (index === -1) {
      throw new Error(`Client ${clientId} not found`);
    }

    const client = clients[index]!;
    client.assignedAdvisors = client.assignedAdvisors.filter(id => id !== advisorId);
    client.updatedAt = this.now();
    this.setInStorage(this.STORAGE_KEY, clients);

    return client;
  }

  async archiveClient(id: string): Promise<ClientRecord> {
    return this.updateClient(id, { status: 'Archived' });
  }
}
