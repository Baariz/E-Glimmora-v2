/**
 * Real API Message Service
 * Implements IMessageService against the Elan Glimmora backend API
 */

import type {
  MessageThread,
  Message,
  MessageType,
  MessageAttachment,
  CreateMessageInput,
  DomainContext,
} from '@/lib/types';
import type { IMessageService } from '../interfaces/IMessageService';
import { api } from './client';

// ── Backend shapes (snake_case) ──────────────────────────────────────────────

interface ApiThread {
  id: string;
  participants: string[];
  subject?: string | null;
  context: string;
  related_resource_id?: string | null;
  related_resource_type?: string | null;
  last_message_at: string;
  created_at: string;
}

interface ApiMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  type: MessageType;
  attachments?: ApiAttachment[] | null;
  read_by: string[];
  sent_at: string;
}

interface ApiAttachment {
  id: string;
  filename: string;
  file_url: string;
  mime_type: string;
  size: number;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function toAttachment(raw: ApiAttachment): MessageAttachment {
  return {
    id: raw.id,
    filename: raw.filename,
    fileUrl: raw.file_url,
    mimeType: raw.mime_type,
    size: raw.size,
  };
}

function toThread(raw: ApiThread): MessageThread {
  return {
    id: raw.id,
    participants: raw.participants || [],
    subject: raw.subject || undefined,
    context: raw.context as DomainContext,
    relatedResourceId: raw.related_resource_id || undefined,
    relatedResourceType: raw.related_resource_type || undefined,
    lastMessageAt: raw.last_message_at,
    createdAt: raw.created_at,
  };
}

function toMessage(raw: ApiMessage): Message {
  return {
    id: raw.id,
    threadId: raw.thread_id,
    senderId: raw.sender_id,
    content: raw.content,
    type: raw.type,
    attachments: raw.attachments?.map(toAttachment) || undefined,
    readBy: raw.read_by || [],
    sentAt: raw.sent_at,
  };
}

// ── Service ──────────────────────────────────────────────────────────────────

export class ApiMessageService implements IMessageService {
  async getThreads(_userId: string): Promise<MessageThread[]> {
    // Backend derives userId from the JWT token; no need to pass it as query param
    const raw = await api.get<ApiThread[]>(`/api/messages`);
    return raw.map(toThread);
  }

  async getThreadById(id: string): Promise<MessageThread | null> {
    try {
      const raw = await api.get<ApiThread>(`/api/messages/${id}`);
      return toThread(raw);
    } catch {
      return null;
    }
  }

  async createThread(
    participants: string[],
    context: DomainContext,
    relatedResourceId?: string
  ): Promise<MessageThread> {
    const body: Record<string, unknown> = {
      participants,
      context,
    };
    if (relatedResourceId) body.related_resource_id = relatedResourceId;

    const raw = await api.post<ApiThread>('/api/messages', body);
    return toThread(raw);
  }

  async getMessages(threadId: string): Promise<Message[]> {
    const raw = await api.get<ApiMessage[]>(
      `/api/messages/${threadId}/messages`
    );
    return raw.map(toMessage);
  }

  async sendMessage(data: CreateMessageInput): Promise<Message> {
    const body = {
      sender_id: data.senderId,
      content: data.content,
    };

    const raw = await api.post<ApiMessage>(
      `/api/messages/${data.threadId}/messages`,
      body
    );
    return toMessage(raw);
  }

  async markAsRead(threadId: string, _userId: string): Promise<void> {
    await api.patch(`/api/messages/${threadId}/read`);
  }
}
