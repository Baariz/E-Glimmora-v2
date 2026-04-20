/**
 * Real API Memory (Vault) Service
 * Implements IMemoryService against the Elan Glimmora backend API
 */

import type {
  MemoryItem,
  MemoryType,
  CreateMemoryInput,
  VaultSharingRole,
} from '@/lib/types';
import type { IMemoryService } from '../interfaces/IMemoryService';
import { api, apiRequest } from './client';
import { logger } from '@/lib/utils/logger';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

// ── Backend shapes (snake_case) ──────────────────────────────────────────────

interface ApiMemoryItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description?: string | null;
  file_url?: string | null;
  thumbnail_url?: string | null;
  emotional_tags: string[];
  linked_journeys: string[];
  sharing_permissions: string[];
  sharing_roles?: string[] | null;
  is_locked: boolean;
  unlock_condition?: string | null;
  is_milestone: boolean;
  created_at: string;
  updated_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve file URLs: relative paths get the backend base prepended */
function resolveFileUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  // Already absolute — return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Relative path — prepend backend URL
  return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function toMemoryItem(raw: ApiMemoryItem): MemoryItem {
  return {
    id: raw.id,
    userId: raw.user_id,
    type: raw.type as MemoryType,
    title: raw.title,
    description: raw.description || undefined,
    fileUrl: resolveFileUrl(raw.file_url),
    thumbnailUrl: resolveFileUrl(raw.thumbnail_url),
    emotionalTags: raw.emotional_tags || [],
    linkedJourneys: raw.linked_journeys || [],
    sharingPermissions: raw.sharing_permissions || [],
    sharingRoles: (raw.sharing_roles || []) as VaultSharingRole[],
    isLocked: raw.is_locked ?? false,
    unlockCondition: raw.unlock_condition || undefined,
    isMilestone: raw.is_milestone ?? false,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function toApiUpdateBody(data: Partial<MemoryItem>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.title !== undefined) body.title = data.title;
  if (data.description !== undefined) body.description = data.description;
  if (data.emotionalTags !== undefined) body.emotional_tags = data.emotionalTags;
  if (data.linkedJourneys !== undefined) body.linked_journeys = data.linkedJourneys;
  if (data.sharingPermissions !== undefined) body.sharing_permissions = data.sharingPermissions;
  if (data.sharingRoles !== undefined) body.sharing_roles = data.sharingRoles;
  if (data.isMilestone !== undefined) body.is_milestone = data.isMilestone;
  return body;
}

// ── Service ──────────────────────────────────────────────────────────────────

export class ApiMemoryService implements IMemoryService {
  async getMemories(userId: string): Promise<MemoryItem[]> {
    const raw = await api.get<ApiMemoryItem[]>(
      `/api/vault?userId=${encodeURIComponent(userId)}`
    );
    return raw.map(toMemoryItem);
  }

  async getMemoryById(id: string): Promise<MemoryItem | null> {
    try {
      // Backend doesn't have a GET /api/vault/{id} endpoint.
      // Fetch all and filter — acceptable for vault items which are typically few.
      const raw = await api.get<ApiMemoryItem[]>('/api/vault');
      const item = raw.find((m) => m.id === id);
      return item ? toMemoryItem(item) : null;
    } catch {
      return null;
    }
  }

  async createMemory(data: CreateMemoryInput, file?: File): Promise<MemoryItem> {
    // Backend expects multipart/form-data for file upload support
    const formData = new FormData();
    formData.append('user_id', data.userId);
    formData.append('type', data.type);
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('emotional_tags', '[]');
    if (file) {
      formData.append('file', file);
    }

    const raw = await apiRequest<ApiMemoryItem>('/api/vault', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type — browser sets it with boundary for FormData
    });
    return toMemoryItem(raw);
  }

  async updateMemory(id: string, data: Partial<MemoryItem>): Promise<MemoryItem> {
    logger.info('Memory', 'updateMemory', {
      id,
      hasSharingRoles: data.sharingRoles !== undefined,
    });
    const raw = await api.patch<ApiMemoryItem>(
      `/api/vault/${id}`,
      toApiUpdateBody(data)
    );
    return toMemoryItem(raw);
  }

  async deleteMemory(id: string): Promise<boolean> {
    await api.delete(`/api/vault/${id}`);
    return true;
  }

  async lockMemory(id: string, unlockCondition: string): Promise<MemoryItem> {
    const raw = await api.post<ApiMemoryItem>(
      `/api/vault/${id}/lock`,
      { unlock_condition: unlockCondition }
    );
    return toMemoryItem(raw);
  }

  async getSharedMemories(userId: string, viewerRole: string): Promise<MemoryItem[]> {
    const raw = await api.get<ApiMemoryItem[]>(
      `/api/vault/shared?userId=${encodeURIComponent(userId)}&viewerRole=${encodeURIComponent(viewerRole)}`
    );
    return raw.map(toMemoryItem);
  }
}
