/**
 * User Service Interface
 * Manages user accounts, authentication data, and global erase
 */

import { User, CreateUserInput } from '@/lib/types';

export interface IUserService {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserInput): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  updateUserStatus(id: string, status: 'active' | 'suspended' | 'removed'): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  eraseUserData(id: string): Promise<void>;
}
