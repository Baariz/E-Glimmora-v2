/**
 * Mock Invite Code Service
 * localStorage-based implementation for invite code management
 */

import { BaseMockService } from './base.mock';
import { IInviteCodeService } from '../interfaces/IInviteCodeService';
import { InviteCode, CreateInviteCodeInput, B2CRole, B2BRole, AdminRole } from '@/lib/types';

export class MockInviteCodeService extends BaseMockService implements IInviteCodeService {
  private readonly STORAGE_KEY = 'invite_codes';
  // In-memory store for server-side (where localStorage is unavailable)
  private serverCodes: InviteCode[] = [];

  constructor() {
    super();
    this.seedDefaultCodes();
  }

  private getDefaultCodes(): InviteCode[] {
    const now = this.now();
    const nowDate = new Date(now);

    return [
      // Original test codes
      {
        id: this.generateId(),
        code: 'ELAN-TEST-B2CC-CODE',
        type: 'b2c',
        createdBy: 'system',
        assignedRoles: { b2c: B2CRole.UHNI },
        maxUses: 100,
        usedCount: 0,
        status: 'active',
        createdAt: now,
      },
      {
        id: this.generateId(),
        code: 'ELAN-TEST-B2BB-CODE',
        type: 'b2b',
        createdBy: 'system',
        assignedRoles: { b2b: B2BRole.RelationshipManager },
        maxUses: 100,
        usedCount: 0,
        status: 'active',
        createdAt: now,
      },
      {
        id: this.generateId(),
        code: 'ELAN-TEST-ADMN-CODE',
        type: 'admin',
        createdBy: 'system',
        assignedRoles: { admin: AdminRole.SuperAdmin },
        maxUses: 100,
        usedCount: 0,
        status: 'active',
        createdAt: now,
      },
      // Additional varied codes for admin dashboard
      {
        id: this.generateId(),
        code: 'ELAN-B2C-VIP-9X2K',
        type: 'b2c',
        createdBy: 'super-admin',
        assignedRoles: { b2c: B2CRole.UHNI },
        maxUses: 1,
        usedCount: 1,
        status: 'used',
        createdAt: new Date(nowDate.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        code: 'ELAN-B2B-RM-7H4F',
        type: 'b2b',
        createdBy: 'super-admin',
        assignedRoles: { b2b: B2BRole.RelationshipManager },
        maxUses: 5,
        usedCount: 3,
        status: 'active',
        createdAt: new Date(nowDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(nowDate.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        code: 'ELAN-B2B-PB-3M8L',
        type: 'b2b',
        createdBy: 'super-admin',
        assignedRoles: { b2b: B2BRole.PrivateBanker },
        maxUses: 10,
        usedCount: 10,
        status: 'used',
        createdAt: new Date(nowDate.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        code: 'ELAN-B2C-ELITE-2K9P',
        type: 'b2c',
        createdBy: 'super-admin',
        assignedRoles: { b2c: B2CRole.UHNI },
        maxUses: 1,
        usedCount: 0,
        status: 'expired',
        createdAt: new Date(nowDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(nowDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        code: 'ELAN-B2B-FO-6T5R',
        type: 'b2b',
        createdBy: 'super-admin',
        assignedRoles: { b2b: B2BRole.FamilyOfficeDirector },
        maxUses: 3,
        usedCount: 1,
        status: 'active',
        createdAt: new Date(nowDate.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        code: 'ELAN-ADMIN-SA-1W4Q',
        type: 'admin',
        createdBy: 'super-admin',
        assignedRoles: { admin: AdminRole.SuperAdmin },
        maxUses: 1,
        usedCount: 0,
        status: 'revoked',
        createdAt: new Date(nowDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        code: 'ELAN-B2B-CO-8N7M',
        type: 'b2b',
        createdBy: 'super-admin',
        assignedRoles: { b2b: B2BRole.ComplianceOfficer },
        maxUses: 2,
        usedCount: 0,
        status: 'active',
        createdAt: new Date(nowDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(nowDate.getTime() + 53 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        code: 'ELAN-B2C-PREM-5J2D',
        type: 'b2c',
        createdBy: 'super-admin',
        assignedRoles: { b2c: B2CRole.UHNI },
        maxUses: 1,
        usedCount: 0,
        status: 'active',
        createdAt: new Date(nowDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(nowDate.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: this.generateId(),
        code: 'ELAN-B2B-IA-4P3L',
        type: 'b2b',
        createdBy: 'super-admin',
        assignedRoles: { b2b: B2BRole.InstitutionalAdmin },
        maxUses: 5,
        usedCount: 2,
        status: 'active',
        createdAt: new Date(nowDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  /**
   * Seed 3 default test invite codes for development
   */
  private seedDefaultCodes(): void {
    const defaultCodes = this.getDefaultCodes();

    // Server-side: always populate in-memory store
    if (typeof window === 'undefined') {
      this.serverCodes = defaultCodes;
      return;
    }

    // Client-side: seed localStorage if empty
    const existing = this.getFromStorage<InviteCode>(this.STORAGE_KEY);
    if (existing.length > 0) return;

    this.setInStorage(this.STORAGE_KEY, defaultCodes);
  }

  private getCodes(): InviteCode[] {
    if (typeof window === 'undefined') return this.serverCodes;
    return this.getFromStorage<InviteCode>(this.STORAGE_KEY);
  }

  private saveCodes(codes: InviteCode[]): void {
    if (typeof window === 'undefined') {
      this.serverCodes = codes;
      return;
    }
    this.setInStorage(this.STORAGE_KEY, codes);
  }

  async getInviteCodes(): Promise<InviteCode[]> {
    await this.delay();
    return this.getCodes();
  }

  async getInviteCodeById(id: string): Promise<InviteCode | null> {
    await this.delay();
    const codes = this.getCodes();
    return codes.find(c => c.id === id) || null;
  }

  async getInviteCodeByCode(code: string): Promise<InviteCode | null> {
    await this.delay();
    const codes = this.getCodes();
    return codes.find(c => c.code === code) || null;
  }

  async createInviteCode(data: CreateInviteCodeInput): Promise<InviteCode> {
    await this.delay();

    const codes = this.getCodes();
    const now = this.now();

    // Generate a unique invite code
    const codePrefix = data.type.toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const generatedCode = `ELAN-${codePrefix}-${randomSuffix}`;

    const inviteCode: InviteCode = {
      id: this.generateId(),
      code: generatedCode,
      type: data.type,
      createdBy: data.createdBy,
      assignedRoles: data.assignedRoles as any,
      institutionId: data.institutionId,
      maxUses: data.maxUses,
      usedCount: 0,
      expiresAt: data.expiresAt,
      status: 'active',
      createdAt: now,
    };

    codes.push(inviteCode);
    this.saveCodes(codes);

    return inviteCode;
  }

  async updateInviteCode(id: string, data: Partial<InviteCode>): Promise<InviteCode> {
    await this.delay();

    const codes = this.getCodes();
    const index = codes.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Invite code ${id} not found`);
    }

    const updated = {
      ...codes[index],
      ...data,
    } as InviteCode;

    codes[index] = updated;
    this.saveCodes(codes);
    return updated;
  }

  async markAsUsed(id: string, _usedByUserId: string): Promise<InviteCode> {
    await this.delay();

    const codes = this.getCodes();
    const index = codes.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Invite code ${id} not found`);
    }

    const code = codes[index]!; // Safe after index check
    code.usedCount = code.usedCount + 1;
    code.status = code.usedCount >= code.maxUses ? 'used' : 'active';

    codes[index] = code;
    this.saveCodes(codes);

    return code;
  }

  async revokeInviteCode(id: string): Promise<InviteCode> {
    await this.delay();

    const codes = this.getCodes();
    const index = codes.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Invite code ${id} not found`);
    }

    const code = codes[index]!; // Safe after index check
    code.status = 'revoked';

    codes[index] = code;
    this.saveCodes(codes);

    return code;
  }
}
