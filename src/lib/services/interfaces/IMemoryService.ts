/**
 * Memory Service Interface
 * Manages memory vault items, locking, and sharing
 */

import { MemoryItem, CreateMemoryInput } from '@/lib/types';

export interface IMemoryService {
  getMemories(userId: string): Promise<MemoryItem[]>;
  getMemoryById(id: string): Promise<MemoryItem | null>;
  createMemory(data: CreateMemoryInput): Promise<MemoryItem>;
  updateMemory(id: string, data: Partial<MemoryItem>): Promise<MemoryItem>;
  deleteMemory(id: string): Promise<boolean>;
  lockMemory(id: string, unlockCondition: string): Promise<MemoryItem>;
  getSharedMemories(userId: string, viewerRole: string): Promise<MemoryItem[]>;
}
