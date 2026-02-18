/**
 * Message Service Interface
 * Manages threaded messaging between users
 */

import { MessageThread, Message, CreateMessageInput, DomainContext } from '@/lib/types';

export interface IMessageService {
  getThreads(userId: string): Promise<MessageThread[]>;
  getThreadById(id: string): Promise<MessageThread | null>;
  createThread(participants: string[], context: DomainContext, relatedResourceId?: string): Promise<MessageThread>;
  getMessages(threadId: string): Promise<Message[]>;
  sendMessage(data: CreateMessageInput): Promise<Message>;
  markAsRead(threadId: string, userId: string): Promise<void>;
}
