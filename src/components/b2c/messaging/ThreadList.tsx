'use client';

/**
 * ThreadList Component
 * Displays list of messaging threads
 * Each shows: linked journey title, last message preview, timestamp,
 * participant names, unread indicator
 */

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { MessageCircle, Clock } from 'lucide-react';

import { cn } from '@/lib/utils/cn';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';

import type { MessageThread, Message, User, Journey } from '@/lib/types/entities';

interface ThreadListProps {
  threads: MessageThread[];
  lastMessages: Record<string, Message | null | undefined>;
  participants: Record<string, User[]>;
  relatedJourneys: Record<string, Journey | null | undefined>;
}

export function ThreadList({
  threads,
  lastMessages,
  participants,
  relatedJourneys,
}: ThreadListProps) {
  const router = useRouter();

  const hasUnreadMessages = (thread: MessageThread, lastMessage: Message | null | undefined): boolean => {
    if (!lastMessage) return false;
    return !lastMessage.readBy.includes(MOCK_UHNI_USER_ID);
  };

  const getThreadParticipantNames = (thread: MessageThread): string => {
    const threadParticipants = participants[thread.id] || [];
    const otherParticipants = threadParticipants.filter(
      (p) => p.id !== MOCK_UHNI_USER_ID
    );
    return otherParticipants.map((p) => p.name).join(', ') || 'Unknown';
  };

  if (threads.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sand-100 rounded-full mb-4">
          <MessageCircle className="w-8 h-8 text-sand-400" />
        </div>
        <h3 className="font-serif text-xl font-light text-rose-900 mb-2">
          No messages yet
        </h3>
        <p className="text-sm font-sans text-sand-600 max-w-md mx-auto">
          Start a conversation with your advisor about a journey.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {threads.map((thread, index) => {
        const lastMessage = lastMessages[thread.id];
        const journey = relatedJourneys[thread.id];
        const hasUnread = hasUnreadMessages(thread, lastMessage || null);

        return (
          <motion.button
            key={thread.id}
            onClick={() => router.push(`/messages/${thread.id}`)}
            className={cn(
              'w-full text-left p-5 bg-white rounded-lg border transition-all',
              hasUnread
                ? 'border-rose-300 shadow-sm'
                : 'border-sand-200 hover:border-sand-300',
              'hover:shadow-md'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {/* Journey title */}
            {journey && (
              <h3
                className={cn(
                  'font-serif text-base mb-1',
                  hasUnread
                    ? 'text-rose-900 font-medium'
                    : 'text-rose-900 font-light'
                )}
              >
                {journey.title}
              </h3>
            )}

            {/* Participants */}
            <p className="text-xs font-sans text-sand-500 mb-2">
              {getThreadParticipantNames(thread)}
            </p>

            {/* Last message preview */}
            {lastMessage && (
              <p
                className={cn(
                  'text-sm font-sans mb-2 line-clamp-2',
                  hasUnread
                    ? 'text-sand-900 font-medium'
                    : 'text-sand-600'
                )}
              >
                {lastMessage.type === 'system' && <em>System: </em>}
                {lastMessage.content}
              </p>
            )}

            {/* Timestamp and unread indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-sans text-sand-400">
                <Clock className="w-3 h-3" />
                {lastMessage && (
                  <span>
                    {format(new Date(lastMessage.sentAt), 'MMM d, h:mm a')}
                  </span>
                )}
              </div>

              {hasUnread && (
                <div className="w-2 h-2 bg-rose-600 rounded-full" />
              )}
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
