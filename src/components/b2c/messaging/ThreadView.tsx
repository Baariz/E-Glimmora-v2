'use client';

/**
 * ThreadView Component (COLB-01, COLB-03)
 * Displays message thread with:
 * - Header showing journey title and participants
 * - Scrollable message list with auto-scroll to bottom
 * - MessageInput at bottom
 * - Marks messages as read when viewed
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

import type { MessageThread, Message, User, Journey } from '@/lib/types/entities';

interface ThreadViewProps {
  thread: MessageThread;
  messages: Message[];
  participants: User[];
  relatedJourney?: Journey | null;
  onMessagesUpdated?: () => void;
}

export function ThreadView({
  thread,
  messages: initialMessages,
  participants,
  relatedJourney,
  onMessagesUpdated,
}: ThreadViewProps) {
  const services = useServices();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when component mounts
  useEffect(() => {
    const markRead = async () => {
      try {
        await services.message.markAsRead(thread.id, MOCK_UHNI_USER_ID);
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    };

    markRead();
  }, [thread.id, services.message]);

  const handleSendMessage = async (content: string) => {
    // Optimistic update: add message immediately
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      threadId: thread.id,
      senderId: MOCK_UHNI_USER_ID,
      content,
      type: 'user',
      readBy: [MOCK_UHNI_USER_ID],
      sentAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      // Send message to service
      const sentMessage = await services.message.sendMessage({
        threadId: thread.id,
        senderId: MOCK_UHNI_USER_ID,
        content,
      });

      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticMessage.id ? sentMessage : msg
        )
      );

      // Notify parent to refresh thread list
      onMessagesUpdated?.();
    } catch (error) {
      // Remove optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      throw error;
    }
  };

  const getSenderForMessage = (message: Message): User | null => {
    return participants.find((p) => p.id === message.senderId) || null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-sand-200 bg-sand-50 px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Back button */}
          <button
            onClick={() => router.push('/messages')}
            className="text-sand-600 hover:text-sand-900 transition-colors"
            aria-label="Back to messages"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            {/* Journey title */}
            {relatedJourney && (
              <h2 className="font-serif text-lg font-light text-rose-900 mb-1">
                {relatedJourney.title}
              </h2>
            )}

            {/* Participants */}
            <div className="flex items-center gap-2 text-sm font-sans text-sand-600">
              <Users className="w-4 h-4" />
              <span>
                {participants.map((p) => p.name).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm font-sans text-sand-400 italic">
              No messages yet. Start the conversation.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                sender={getSenderForMessage(message)}
                isOwnMessage={message.senderId === MOCK_UHNI_USER_ID}
              />
            ))}
            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </div>

      {/* Message input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
