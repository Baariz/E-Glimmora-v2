/**
 * Mock User Service
 * localStorage-based implementation for user management
 */

import { BaseMockService } from './base.mock';
import { IUserService } from '../interfaces/IUserService';
import { User, CreateUserInput } from '@/lib/types';
import { B2CRole, B2BRole, AdminRole } from '@/lib/types/roles';

export class MockUserService extends BaseMockService implements IUserService {
  private readonly STORAGE_KEY = 'users';
  private serverUsers: User[] = [];

  constructor() {
    super();
    this.seedIfEmpty();
  }

  private getUsers_(): User[] {
    if (typeof window === 'undefined') return this.serverUsers;
    return this.getFromStorage<User>(this.STORAGE_KEY);
  }

  private saveUsers(users: User[]): void {
    if (typeof window === 'undefined') {
      this.serverUsers = users;
      return;
    }
    this.setInStorage(this.STORAGE_KEY, users);
  }

  /**
   * Seed initial mock users (idempotent)
   */
  private seedIfEmpty(): void {
    const existing = this.getUsers_();
    if (existing.length > 0) {
      return; // Already seeded
    }

    const now = this.now();
    const institutionId1 = 'inst-001-uuid';
    const institutionId2 = 'inst-002-uuid';

    // Shared test password hash for "Test1234!" (bcrypt, 12 rounds)
    const testPasswordHash = '$2b$12$.2/6MKfWqbW4P.S1Cs6sJe5nhDLjK9GT4K70ktJMv9Q6wiE8DIXbi';

    const seedUsers: User[] = [
      // B2C - UHNI members (3 active, 2 pending, 1 suspended)
      {
        id: 'user-uhni-001',
        email: 'dimitri.hayes@example.com',
        name: 'Dimitri Volkov-Hayes',
        passwordHash: testPasswordHash,
        roles: { b2c: B2CRole.UHNI },
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'user-uhni-002',
        email: 'charlotte.beaumont@example.com',
        name: 'Charlotte Beaumont',
        passwordHash: testPasswordHash,
        roles: { b2c: B2CRole.UHNI },
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'user-uhni-003',
        email: 'alexander.rothschild@example.com',
        name: 'Alexander Rothschild',
        passwordHash: testPasswordHash,
        roles: { b2c: B2CRole.UHNI },
        erasedAt: 'SUSPENDED:' + new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'user-uhni-004',
        email: 'isabella.martinez@example.com',
        name: 'Isabella Martinez',
        passwordHash: testPasswordHash,
        roles: { b2c: B2CRole.UHNI },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // Pending approval (no roles yet)
      {
        id: 'user-pending-001',
        email: 'james.wellington@example.com',
        name: 'James Wellington',
        passwordHash: testPasswordHash,
        roles: {},
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'user-pending-002',
        email: 'sophia.chen@example.com',
        name: 'Sophia Chen',
        passwordHash: testPasswordHash,
        roles: {},
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // B2B - All 6 roles represented
      {
        id: 'b2b-rm-001-uuid-placeholder',
        email: 'robert.chambers@privatebank.com',
        name: 'Robert Chambers',
        passwordHash: testPasswordHash,
        roles: { b2b: B2BRole.RelationshipManager },
        institutionId: institutionId1,
        createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'b2b-banker-001',
        email: 'emily.lawson@privatebank.com',
        name: 'Emily Lawson',
        passwordHash: testPasswordHash,
        roles: { b2b: B2BRole.PrivateBanker },
        institutionId: institutionId1,
        createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'b2b-compliance-001',
        email: 'michael.ross@privatebank.com',
        name: 'Michael Ross',
        passwordHash: testPasswordHash,
        roles: { b2b: B2BRole.ComplianceOfficer },
        institutionId: institutionId1,
        createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'b2b-fo-001',
        email: 'diana.hartwell@familyoffice.com',
        name: 'Diana Hartwell',
        passwordHash: testPasswordHash,
        roles: { b2b: B2BRole.FamilyOfficeDirector },
        institutionId: institutionId1,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'b2b-ia-001',
        email: 'jonathan.pierce@privatebank.com',
        name: 'Jonathan Pierce',
        passwordHash: testPasswordHash,
        roles: { b2b: B2BRole.InstitutionalAdmin },
        institutionId: institutionId1,
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'b2b-portal-001',
        email: 'sebastian.grove@wealthpartners.com',
        name: 'Sebastian Grove',
        passwordHash: testPasswordHash,
        roles: { b2b: B2BRole.UHNIPortal },
        institutionId: institutionId2,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'b2b-rm-002',
        email: 'victoria.kim@wealthpartners.com',
        name: 'Victoria Kim',
        passwordHash: testPasswordHash,
        roles: { b2b: B2BRole.RelationshipManager },
        institutionId: institutionId2,
        createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Admin
      {
        id: 'admin-super-001',
        email: 'admin@eglimmora.com',
        name: 'Platform Administrator',
        passwordHash: testPasswordHash,
        roles: { admin: AdminRole.SuperAdmin },
        createdAt: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    this.saveUsers(seedUsers);
  }

  async getUsers(): Promise<User[]> {
    await this.delay();
    return this.getUsers_();
  }

  async getUserById(id: string): Promise<User | null> {
    await this.delay();
    const users = this.getUsers_();
    return users.find(u => u.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.delay();
    const users = this.getUsers_();
    return users.find(u => u.email === email) || null;
  }

  async createUser(data: CreateUserInput & { passwordHash?: string }): Promise<User> {
    await this.delay();

    const users = this.getUsers_();
    const now = this.now();

    // Check for duplicate email
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error(`User with email ${data.email} already exists`);
    }

    const user: User = {
      id: this.generateId(),
      email: data.email,
      name: data.name,
      roles: data.roles as any, // Zod infers string literals, but they're compatible with enums
      passwordHash: data.passwordHash,
      createdAt: now,
      updatedAt: now
    };

    users.push(user);
    this.saveUsers(users);

    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await this.delay();

    const users = this.getUsers_();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      throw new Error(`User ${id} not found`);
    }

    const updated = {
      ...users[index],
      ...data,
      updatedAt: this.now()
    } as User;

    users[index] = updated;
    this.saveUsers(users);
    return updated;
  }

  async updateUserStatus(id: string, status: 'active' | 'suspended' | 'removed'): Promise<User> {
    await this.delay();

    const users = this.getUsers_();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      throw new Error(`User ${id} not found`);
    }

    const user = users[index]!;
    let updated: User;

    if (status === 'active') {
      // Active: clear erasedAt, ensure user has at least one role if pending
      const hasRoles = Object.values(user.roles).filter(Boolean).length > 0;
      updated = {
        ...user,
        erasedAt: undefined,
        roles: hasRoles ? user.roles : { b2c: B2CRole.UHNI },
        updatedAt: this.now()
      } as User;
    } else if (status === 'suspended') {
      // Suspended: set erasedAt with SUSPENDED prefix
      updated = {
        ...user,
        erasedAt: 'SUSPENDED:' + this.now(),
        updatedAt: this.now()
      } as User;
    } else {
      // Removed: set erasedAt with REMOVED prefix
      updated = {
        ...user,
        erasedAt: 'REMOVED:' + this.now(),
        updatedAt: this.now()
      } as User;
    }

    users[index] = updated;
    this.saveUsers(users);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.delay();

    const users = this.getUsers_();
    const filtered = users.filter(u => u.id !== id);

    if (filtered.length === users.length) {
      return false;
    }

    this.saveUsers(filtered);
    return true;
  }

  async eraseUserData(id: string): Promise<void> {
    await this.delay();

    const users = this.getUsers_();
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
      const erased = {
        ...users[index],
        name: '[ERASED]',
        email: `erased-${this.generateId()}@example.com`,
        avatarUrl: undefined,
        erasedAt: this.now(),
        updatedAt: this.now()
      } as User;

      users[index] = erased;
      this.saveUsers(users);
    }

    // In a real implementation, this would also erase related data
    // from journeys, memories, messages, etc.
  }
}
