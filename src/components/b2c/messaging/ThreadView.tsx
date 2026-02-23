'use client';

/**
 * ThreadView — Refined Private Conversation
 * Elegant chat interface with frosted header, refined message area,
 * and premium input. No generic chat-app feel.
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const sentMessage = await services.message.sendMessage({
        threadId: thread.id,
        senderId: MOCK_UHNI_USER_ID,
        content,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticMessage.id ? sentMessage : msg
        )
      );
      onMessagesUpdated?.();
    } catch (error) {
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
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden">
      {/* Header — frosted with journey context */}
      <div className="border-b border-stone-200/60 bg-stone-50/80 backdrop-blur-sm px-6 sm:px-7 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/messages')}
            className="w-8 h-8 rounded-full bg-white border border-stone-200/60 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:border-stone-300 transition-all"
            aria-label="Back to messages"
          >
            <ArrowLeft size={14} />
          </button>

          <div className="flex-1 min-w-0">
            {relatedJourney && (
              <h2 className="font-serif text-lg text-stone-900 leading-snug truncate">
                {relatedJourney.title}
              </h2>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <Shield size={10} className="text-stone-300" />
              <span className="text-[10px] font-sans text-stone-400 tracking-wide">
                {participants.map((p) => p.name).join(' & ')} &middot; End-to-end encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-6 bg-[#faf9f7]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <Shield size={18} className="text-stone-400" />
            </div>
            <p className="text-stone-400 text-sm font-sans tracking-wide">
              Begin your private conversation.
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

      {/* Input */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
