/**
 * Real API User Service
 * Implements IUserService against the Elan Glimmora backend API
 */

import type { User, CreateUserInput } from '@/lib/types';
import type { IUserService } from '../interfaces/IUserService';
import { api } from './client';

/** Backend role object shape */
interface ApiRoleEntry {
  domain: string;
  role: string;
}

/** Shape returned by the backend for a user record */
interface ApiUser {
  id: string;
  email: string;
  name: string;
  roles: Record<string, string> | ApiRoleEntry[];
  institution_id?: string | null;
  avatar_url?: string | null;
  mfa_enabled?: boolean;
  mfa_secret?: string | null;
  password_hash?: string | null;
  status?: string;
  created_at: string;
  updated_at: string;
  erased_at?: string | null;
}

/**
 * Convert backend roles to frontend UserRoles format.
 * Backend may return either:
 *   - { "b2c": "UHNI" } (from auth endpoints)
 *   - [{ "domain": "b2c", "role": "UHNI" }] (from users endpoints)
 */
function normalizeRoles(roles: Record<string, string> | ApiRoleEntry[]): User['roles'] {
  if (Array.isArray(roles)) {
    const result: Record<string, string> = {};
    for (const entry of roles) {
      result[entry.domain] = entry.role;
    }
    return result as User['roles'];
  }
  return roles as User['roles'];
}

/**
 * Convert frontend roles object to backend array format for POST/PATCH.
 * Frontend: { b2c: "UHNI", admin: "SuperAdmin" }
 * Backend:  [{ domain: "b2c", role: "UHNI" }, { domain: "admin", role: "SuperAdmin" }]
 */
function toApiRoles(roles: Record<string, string | undefined>): ApiRoleEntry[] {
  const entries: ApiRoleEntry[] = [];
  for (const [domain, role] of Object.entries(roles)) {
    if (role) entries.push({ domain, role });
  }
  return entries;
}

/** Convert snake_case API response to camelCase frontend entity */
function toUser(raw: ApiUser): User {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    roles: normalizeRoles(raw.roles),
    institutionId: raw.institution_id || undefined,
    avatarUrl: raw.avatar_url || undefined,
    passwordHash: raw.password_hash || undefined,
    mfaEnabled: raw.mfa_enabled ?? false,
    mfaSecret: raw.mfa_secret || undefined,
    status: raw.status || undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    erasedAt: raw.erased_at || undefined,
  };
}

export class ApiUserService implements IUserService {
  async getUsers(): Promise<User[]> {
    const data = await api.get<ApiUser[]>('/api/users');
    return data.map(toUser);
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const data = await api.get<ApiUser>(`/api/users/${id}`);
      return toUser(data);
    } catch {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const data = await api.get<ApiUser[]>(`/api/users?email=${encodeURIComponent(email)}`);
      const first = data?.[0];
      if (first) {
        return toUser(first);
      }
      return null;
    } catch {
      return null;
    }
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const raw = await api.post<ApiUser>('/api/users', {
      email: data.email,
      name: data.name,
      roles: toApiRoles(data.roles),
      password: (data as any).password || (data as any).passwordHash,
    });
    return toUser(raw);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const body: Record<string, unknown> = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.avatarUrl !== undefined) body.avatar_url = data.avatarUrl;
    if (data.institutionId !== undefined) body.institution_id = data.institutionId;

    const raw = await api.patch<ApiUser>(`/api/users/${id}`, body);
    return toUser(raw);
  }

  async updateUserStatus(id: string, status: 'active' | 'suspended' | 'removed'): Promise<User> {
    const raw = await api.patch<ApiUser>(`/api/users/${id}/status`, { status });
    return toUser(raw);
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await api.delete(`/api/users/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async eraseUserData(id: string): Promise<void> {
    await api.post(`/api/users/${id}/erase`);
  }
}
