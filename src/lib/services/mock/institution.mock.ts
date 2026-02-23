/**
 * Mock Institution Service
 * localStorage-based implementation for institution management
 */

import { BaseMockService } from './base.mock';
import { IInstitutionService } from '../interfaces/IInstitutionService';
import { Institution, CreateInstitutionInput } from '@/lib/types';

export class MockInstitutionService extends BaseMockService implements IInstitutionService {
  private readonly STORAGE_KEY = 'institutions';

  constructor() {
    super();
    if (this.isClient) {
      this.seedIfEmpty();
    }
  }

  /**
   * Seed initial mock institutions (idempotent)
   */
  private seedIfEmpty(): void {
    const existing = this.getFromStorage<Institution>(this.STORAGE_KEY);
    if (existing.length > 0) {
      return; // Already seeded
    }

    const now = this.now();

    const seedInstitutions: Institution[] = [
      {
        id: 'inst-001-uuid',
        name: 'Rothschild & Co. Private Wealth',
        type: 'Private Bank',
        tier: 'Platinum',
        status: 'Active',
        contractStart: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
        contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inst-002-uuid',
        name: 'Sterling Wealth Partners',
        type: 'Family Office',
        tier: 'Gold',
        status: 'Active',
        contractStart: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inst-003-uuid',
        name: 'Apex Private Banking Group',
        type: 'Private Bank',
        tier: 'Silver',
        status: 'Active',
        contractStart: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        contractEnd: new Date(Date.now() + 545 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inst-004-uuid',
        name: 'Legacy Capital Advisors',
        type: 'Wealth Manager',
        tier: 'Gold',
        status: 'Pending',
        contractStart: now,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inst-005-uuid',
        name: 'Geneva Trust & Fiduciary',
        type: 'Family Office',
        tier: 'Platinum',
        status: 'Suspended',
        contractStart: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(),
        contractEnd: new Date(Date.now() + 230 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inst-006-uuid',
        name: 'Meridian Wealth Management',
        type: 'Wealth Manager',
        tier: 'Silver',
        status: 'Active',
        contractStart: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        contractEnd: new Date(Date.now() + 640 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inst-007-uuid',
        name: 'Sovereign Asset Partners',
        type: 'Private Bank',
        tier: 'Platinum',
        status: 'Active',
        contractStart: new Date(Date.now() - 600 * 24 * 60 * 60 * 1000).toISOString(),
        contractEnd: new Date(Date.now() + 130 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 600 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'inst-008-uuid',
        name: 'Crown Estate Holdings',
        type: 'Family Office',
        tier: 'Gold',
        status: 'Pending',
        contractStart: now,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    this.setInStorage(this.STORAGE_KEY, seedInstitutions);
  }

  async getInstitutions(): Promise<Institution[]> {
    await this.delay();
    return this.getFromStorage<Institution>(this.STORAGE_KEY);
  }

  async getInstitutionById(id: string): Promise<Institution | null> {
    await this.delay();
    const institutions = this.getFromStorage<Institution>(this.STORAGE_KEY);
    return institutions.find(i => i.id === id) || null;
  }

  async createInstitution(data: CreateInstitutionInput): Promise<Institution> {
    await this.delay();

    const institutions = this.getFromStorage<Institution>(this.STORAGE_KEY);
    const now = this.now();

    const institution: Institution = {
      id: this.generateId(),
      name: data.name,
      type: data.type,
      tier: data.tier,
      status: 'Pending',
      contractStart: now,
      createdAt: now,
      updatedAt: now
    };

    institutions.push(institution);
    this.setInStorage(this.STORAGE_KEY, institutions);

    return institution;
  }

  async updateInstitution(id: string, data: Partial<Institution>): Promise<Institution> {
    await this.delay();

    const institutions = this.getFromStorage<Institution>(this.STORAGE_KEY);
    const index = institutions.findIndex(i => i.id === id);

    if (index === -1) {
      throw new Error(`Institution ${id} not found`);
    }

    const updated = {
      ...institutions[index],
      ...data,
      updatedAt: this.now()
    } as Institution;

    institutions[index] = updated;
    this.setInStorage(this.STORAGE_KEY, institutions);
    return updated;
  }

  async suspendInstitution(id: string): Promise<Institution> {
    await this.delay();

    const institutions = this.getFromStorage<Institution>(this.STORAGE_KEY);
    const index = institutions.findIndex(i => i.id === id);

    if (index === -1) {
      throw new Error(`Institution ${id} not found`);
    }

    const updated = {
      ...institutions[index],
      status: 'Suspended' as const,
      updatedAt: this.now()
    } as Institution;

    institutions[index] = updated;
    this.setInStorage(this.STORAGE_KEY, institutions);
    return updated;
  }

  async reactivateInstitution(id: string): Promise<Institution> {
    await this.delay();

    const institutions = this.getFromStorage<Institution>(this.STORAGE_KEY);
    const index = institutions.findIndex(i => i.id === id);

    if (index === -1) {
      throw new Error(`Institution ${id} not found`);
    }

    const updated = {
      ...institutions[index],
      status: 'Active' as const,
      updatedAt: this.now()
    } as Institution;

    institutions[index] = updated;
    this.setInStorage(this.STORAGE_KEY, institutions);
    return updated;
  }

  async removeInstitution(id: string): Promise<Institution> {
    await this.delay();

    const institutions = this.getFromStorage<Institution>(this.STORAGE_KEY);
    const index = institutions.findIndex(i => i.id === id);

    if (index === -1) {
      throw new Error(`Institution ${id} not found`);
    }

    // Mark as suspended with special removed flag (preserve in list but inactive)
    const updated = {
      ...institutions[index],
      status: 'Suspended' as const,
      contractEnd: this.now(), // End contract immediately
      updatedAt: this.now()
    } as Institution;

    institutions[index] = updated;
    this.setInStorage(this.STORAGE_KEY, institutions);
    return updated;
  }
}
