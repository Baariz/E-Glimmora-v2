/**
 * Mock Memory Service
 * localStorage-based implementation for memory vault
 */

import { BaseMockService } from './base.mock';
import { IMemoryService } from '../interfaces/IMemoryService';
import { MemoryItem, CreateMemoryInput } from '@/lib/types';

export class MockMemoryService extends BaseMockService implements IMemoryService {
  private readonly STORAGE_KEY = 'memories';

  async getMemories(userId: string): Promise<MemoryItem[]> {
    await this.delay();
    const memories = this.getFromStorage<MemoryItem>(this.STORAGE_KEY);
    return memories.filter(m => m.userId === userId);
  }

  async getMemoryById(id: string): Promise<MemoryItem | null> {
    await this.delay();
    const memories = this.getFromStorage<MemoryItem>(this.STORAGE_KEY);
    return memories.find(m => m.id === id) || null;
  }

  async createMemory(data: CreateMemoryInput): Promise<MemoryItem> {
    await this.delay();

    const memories = this.getFromStorage<MemoryItem>(this.STORAGE_KEY);
    const now = this.now();

    const memory: MemoryItem = {
      id: this.generateId(),
      userId: data.userId,
      type: data.type,
      title: data.title,
      description: data.description,
      emotionalTags: [],
      linkedJourneys: [],
      sharingPermissions: [],
      isLocked: false,
      isMilestone: false,
      createdAt: now,
      updatedAt: now
    };

    memories.push(memory);
    this.setInStorage(this.STORAGE_KEY, memories);

    return memory;
  }

  async updateMemory(id: string, data: Partial<MemoryItem>): Promise<MemoryItem> {
    await this.delay();

    const memories = this.getFromStorage<MemoryItem>(this.STORAGE_KEY);
    const index = memories.findIndex(m => m.id === id);

    if (index === -1) {
      throw new Error(`Memory ${id} not found`);
    }

    const updated = {
      ...memories[index],
      ...data,
      updatedAt: this.now()
    } as MemoryItem;

    memories[index] = updated;
    this.setInStorage(this.STORAGE_KEY, memories);
    return updated;
  }

  async deleteMemory(id: string): Promise<boolean> {
    await this.delay();

    const memories = this.getFromStorage<MemoryItem>(this.STORAGE_KEY);
    const filtered = memories.filter(m => m.id !== id);

    if (filtered.length === memories.length) {
      return false;
    }

    this.setInStorage(this.STORAGE_KEY, filtered);
    return true;
  }

  async lockMemory(id: string, unlockCondition: string): Promise<MemoryItem> {
    await this.delay();

    const memories = this.getFromStorage<MemoryItem>(this.STORAGE_KEY);
    const index = memories.findIndex(m => m.id === id);

    if (index === -1) {
      throw new Error(`Memory ${id} not found`);
    }

    const updated = {
      ...memories[index],
      isLocked: true,
      unlockCondition,
      updatedAt: this.now()
    } as MemoryItem;

    memories[index] = updated;
    this.setInStorage(this.STORAGE_KEY, memories);
    return updated;
  }

  async getSharedMemories(userId: string, viewerRole: string): Promise<MemoryItem[]> {
    await this.delay();

    const memories = this.getFromStorage<MemoryItem>(this.STORAGE_KEY);

    // Filter memories where the viewer has sharing permissions
    return memories.filter(m =>
      m.sharingPermissions.includes(viewerRole) ||
      m.sharingPermissions.includes(userId)
    );
  }
}
