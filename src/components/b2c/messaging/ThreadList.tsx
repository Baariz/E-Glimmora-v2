'use client';

/**
 * ThreadList — Luxury Correspondence Cards
 * Each thread displayed as an editorial card with accent borders,
 * journey context, and unread indicators.
 */

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { MessageCircle, ArrowRight, Clock, User as UserIcon } from 'lucide-react';

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
    return otherParticipants.map((p) => p.name).join(', ') || 'Your Advisor';
  };

  if (threads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white border border-stone-200/60 rounded-2xl p-12 sm:p-16 text-center shadow-sm"
      >
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-7 h-7 text-stone-400" />
        </div>
        <h3 className="font-serif text-2xl text-stone-900 mb-3">
          No conversations yet
        </h3>
        <p className="text-stone-400 text-sm font-sans leading-[1.7] tracking-wide max-w-sm mx-auto">
          Begin a private conversation with your advisor about any of your journeys.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread, index) => {
        const lastMessage = lastMessages[thread.id];
        const journey = relatedJourneys[thread.id];
        const hasUnread = hasUnreadMessages(thread, lastMessage || null);

        return (
          <motion.button
            key={thread.id}
            onClick={() => router.push(`/messages/${thread.id}`)}
            className={cn(
              'group w-full text-left bg-white rounded-2xl border overflow-hidden',
              'transition-all duration-500',
              'hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]',
              hasUnread
                ? 'border-amber-300/60 shadow-sm'
                : 'border-stone-200/60 shadow-sm hover:border-stone-300/60'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-stretch">
              {/* Left accent bar */}
              <div className={cn(
                'w-1 flex-shrink-0 transition-colors',
                hasUnread
                  ? 'bg-gradient-to-b from-amber-400 to-amber-500'
                  : 'bg-gradient-to-b from-stone-200 to-stone-300 group-hover:from-stone-300 group-hover:to-stone-400'
              )} />

              <div className="flex-1 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Journey title */}
                    {journey && (
                      <h3 className="font-serif text-lg text-stone-900 leading-snug mb-1.5 truncate">
                        {journey.title}
                      </h3>
                    )}

                    {/* Advisor name */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center">
                        <UserIcon size={10} className="text-stone-500" />
                      </div>
                      <span className="text-[11px] font-sans text-stone-400 tracking-wide">
                        {getThreadParticipantNames(thread)}
                      </span>
                    </div>

                    {/* Last message preview */}
                    {lastMessage && (
                      <p className={cn(
                        'font-sans text-sm leading-[1.6] tracking-wide line-clamp-2',
                        hasUnread
                          ? 'text-stone-700 font-medium'
                          : 'text-stone-400'
                      )}>
                        {lastMessage.type === 'system' && (
                          <span className="text-stone-300 italic">System: </span>
                        )}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>

                  {/* Right side: time + indicators */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0 pt-0.5">
                    {lastMessage && (
                      <span className="text-[10px] font-sans text-stone-300 tracking-wide whitespace-nowrap">
                        {format(new Date(lastMessage.sentAt), 'MMM d')}
                      </span>
                    )}

                    {hasUnread ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                    ) : (
                      <ArrowRight size={13} className="text-stone-300 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
