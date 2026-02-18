/**
 * Mock Message Service
 * localStorage-based implementation for threaded messaging
 */

import { BaseMockService } from './base.mock';
import { IMessageService } from '../interfaces/IMessageService';
import {
  MessageThread,
  Message,
  CreateMessageInput,
  DomainContext
} from '@/lib/types';

export class MockMessageService extends BaseMockService implements IMessageService {
  private readonly THREADS_KEY = 'message_threads';
  private readonly MESSAGES_KEY = 'messages';

  async getThreads(userId: string): Promise<MessageThread[]> {
    await this.delay();
    const threads = this.getFromStorage<MessageThread>(this.THREADS_KEY);
    return threads.filter(t => t.participants.includes(userId));
  }

  async getThreadById(id: string): Promise<MessageThread | null> {
    await this.delay();
    const threads = this.getFromStorage<MessageThread>(this.THREADS_KEY);
    return threads.find(t => t.id === id) || null;
  }

  async createThread(
    participants: string[],
    context: DomainContext,
    relatedResourceId?: string
  ): Promise<MessageThread> {
    await this.delay();

    const threads = this.getFromStorage<MessageThread>(this.THREADS_KEY);
    const now = this.now();

    const thread: MessageThread = {
      id: this.generateId(),
      participants,
      context,
      relatedResourceId,
      lastMessageAt: now,
      createdAt: now
    };

    threads.push(thread);
    this.setInStorage(this.THREADS_KEY, threads);

    return thread;
  }

  async getMessages(threadId: string): Promise<Message[]> {
    await this.delay();
    const messages = this.getFromStorage<Message>(this.MESSAGES_KEY);
    return messages.filter(m => m.threadId === threadId);
  }

  async sendMessage(data: CreateMessageInput): Promise<Message> {
    await this.delay();

    const messages = this.getFromStorage<Message>(this.MESSAGES_KEY);
    const threads = this.getFromStorage<MessageThread>(this.THREADS_KEY);
    const now = this.now();

    // Detect system messages by senderId === 'system'
    const isSystemMessage = data.senderId === 'system';

    const message: Message = {
      id: this.generateId(),
      threadId: data.threadId,
      senderId: data.senderId,
      content: data.content,
      type: isSystemMessage ? 'system' : 'user',
      readBy: isSystemMessage ? [] : [data.senderId],
      sentAt: now
    };

    messages.push(message);
    this.setInStorage(this.MESSAGES_KEY, messages);

    // Update thread's lastMessageAt
    const threadIndex = threads.findIndex(t => t.id === data.threadId);
    if (threadIndex !== -1) {
      const thread = threads[threadIndex]!;
      thread.lastMessageAt = now;
      this.setInStorage(this.THREADS_KEY, threads);
    }

    return message;
  }

  async markAsRead(threadId: string, userId: string): Promise<void> {
    await this.delay();

    const messages = this.getFromStorage<Message>(this.MESSAGES_KEY);
    let updated = false;

    messages.forEach(m => {
      if (m.threadId === threadId && !m.readBy.includes(userId)) {
        m.readBy.push(userId);
        updated = true;
      }
    });

    if (updated) {
      this.setInStorage(this.MESSAGES_KEY, messages);
    }
  }
}
