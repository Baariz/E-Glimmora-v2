/**
 * User Service Interface
 * Manages user accounts, authentication data, and global erase
 */

import { User, CreateUserInput, UserRoles } from '@/lib/types';

export interface IUserService {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserInput): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  updateUserStatus(id: string, status: 'active' | 'suspended' | 'removed'): Promise<User>;
  /**
   * Replace all roles for a user (§5.4). Pass only the domains you want the user
   * to have — existing roles are replaced, not merged.
   */
  updateUserRoles(id: string, roles: Partial<UserRoles>): Promise<User>;
  /** Remove a Spouse/Heir from the UHNI's circle (§5.5). */
  removeFromCircle(id: string): Promise<void>;
  deleteUser(id: string): Promise<boolean>;
  eraseUserData(id: string): Promise<void>;
}
