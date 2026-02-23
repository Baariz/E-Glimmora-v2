'use client';

/**
 * Advisor Message Preview (BREF-06)
 * Shows latest message thread summary: advisor name, last message snippet, timestamp.
 * Fetches from message service. Links to /messages.
 * Shows empty state when no messages exist.
 */

import Link from 'next/link';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import type { MessageThread, Message } from '@/lib/types/entities';

interface AdvisorMessagePreviewProps {
  threads: MessageThread[];
  /** Map of threadId -> last message for preview */
  lastMessages: Record<string, Message | null>;
  isLoading?: boolean;
}

/**
 * Resolve a participant ID to a display name.
 * In production this would call a user service; for mock we use a static map.
 */
const ADVISOR_NAMES: Record<string, string> = {
  'advisor-001': 'Sarah Chen',
  'advisor-002': 'Marcus Reed',
};

function resolveAdvisorName(participantIds: string[], currentUserId: string): string {
  const advisorId = participantIds.find((id) => id !== currentUserId);
  if (advisorId && ADVISOR_NAMES[advisorId]) {
    return ADVISOR_NAMES[advisorId];
  }
  return 'Your Advisor';
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isValid(date)) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  if (diffDays < 7) {
    return format(date, 'EEEE');
  }
  return format(date, 'MMM d');
}

export function AdvisorMessagePreview({
  threads,
  lastMessages,
  isLoading,
}: AdvisorMessagePreviewProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-32 bg-sand-200 rounded" />
        <div className="h-4 w-48 bg-sand-200 rounded" />
        <div className="h-3 w-full bg-sand-200 rounded" />
        <div className="h-3 w-2/3 bg-sand-200 rounded" />
      </div>
    );
  }

  // Get the most recent thread
  const sortedThreads = [...threads].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
  const latestThread = sortedThreads[0];

  if (!latestThread) {
    return (
      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6">
        <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-4">
          Your Advisor
        </p>
        <div className="text-center py-4">
          <p className="font-serif text-lg text-stone-400 mb-1">No messages yet</p>
          <p className="text-sm font-sans text-stone-400">
            Conversations with your advisor will appear here.
          </p>
        </div>
      </div>
    );
  }

  const lastMessage = lastMessages[latestThread.id] ?? null;
  const advisorName = resolveAdvisorName(latestThread.participants, '');
  const timestamp = latestThread.lastMessageAt
    ? formatTimestamp(latestThread.lastMessageAt)
    : '';

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow p-6">
      <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-4">
        Your Advisor
      </p>

      <Link href="/messages" className="block group">
        {/* Advisor name + timestamp */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-serif text-base text-rose-900 group-hover:text-rose-700 transition-colors">
            {advisorName}
          </span>
          {timestamp && (
            <span className="text-xs font-sans text-stone-400">{timestamp}</span>
          )}
        </div>

        {/* Subject line */}
        {latestThread.subject && (
          <p className="text-sm font-sans font-medium text-stone-700 mb-1">
            {latestThread.subject}
          </p>
        )}

        {/* Last message snippet */}
        {lastMessage ? (
          <p className="text-sm font-sans text-stone-500 line-clamp-2 leading-relaxed">
            {lastMessage.content}
          </p>
        ) : (
          <p className="text-sm font-sans text-stone-400 italic">No messages in this thread</p>
        )}

        {/* Thread count indicator */}
        {sortedThreads.length > 1 && (
          <p className="mt-3 text-xs font-sans text-rose-700 font-medium">
            +{sortedThreads.length - 1} more{' '}
            {sortedThreads.length - 1 === 1 ? 'conversation' : 'conversations'}
          </p>
        )}
      </Link>
    </div>
  );
}
