'use client';

/**
 * Advisor Message Preview (BREF-06)
 * Premium editorial message preview with advisor avatar.
 * Shows latest thread summary. Links to /messages.
 */

import Link from 'next/link';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import type { MessageThread, Message } from '@/lib/types/entities';

interface AdvisorMessagePreviewProps {
  threads: MessageThread[];
  lastMessages: Record<string, Message | null>;
  isLoading?: boolean;
}

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

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
      <div className="rounded-2xl bg-white border border-stone-100 p-6 sm:p-8 animate-pulse min-h-[200px]">
        <div className="h-3 w-24 bg-stone-200 rounded mb-6" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-stone-200 rounded-full" />
          <div className="h-5 w-28 bg-stone-200 rounded" />
        </div>
        <div className="h-3 w-full bg-stone-200 rounded mb-2" />
        <div className="h-3 w-2/3 bg-stone-200 rounded" />
      </div>
    );
  }

  const sortedThreads = [...threads].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
  const latestThread = sortedThreads[0];

  if (!latestThread) {
    return (
      <div className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-amber-300" />
        <div className="p-6 sm:p-8">
          <p className="text-stone-400 text-[10px] font-sans font-semibold uppercase tracking-[4px] mb-6">
            Your Advisor
          </p>
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-stone-100 mx-auto mb-4 flex items-center justify-center">
              <span className="text-stone-400 text-lg">✦</span>
            </div>
            <p className="font-serif text-xl text-stone-400 mb-1">No messages yet</p>
            <p className="text-sm font-sans text-stone-400">
              Conversations with your advisor will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const lastMessage = lastMessages[latestThread.id] ?? null;
  const advisorName = resolveAdvisorName(latestThread.participants, '');
  const initials = getInitials(advisorName);
  const timestamp = latestThread.lastMessageAt
    ? formatTimestamp(latestThread.lastMessageAt)
    : '';

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden group">
      {/* Gradient accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-amber-300" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <p className="text-stone-400 text-[10px] font-sans font-semibold uppercase tracking-[4px] mb-6">
          Your Advisor
        </p>

        <Link href="/messages" className="block group/link">
          {/* Advisor row */}
          <div className="flex items-center gap-3 mb-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-700 to-rose-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-sans font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-serif text-lg text-stone-900 group-hover/link:text-rose-700 transition-colors block">
                {advisorName}
              </span>
            </div>
            {timestamp && (
              <span className="text-[11px] font-sans text-stone-400 flex-shrink-0">{timestamp}</span>
            )}
          </div>

          {/* Subject */}
          {latestThread.subject && (
            <p className="text-sm font-sans font-medium text-stone-700 mb-1.5 truncate">
              {latestThread.subject}
            </p>
          )}

          {/* Message snippet */}
          {lastMessage ? (
            <p className="text-sm font-sans text-stone-500 line-clamp-2 leading-relaxed">
              {lastMessage.content}
            </p>
          ) : (
            <p className="text-sm font-sans text-stone-400 italic">No messages in this thread</p>
          )}

          {/* Thread count */}
          {sortedThreads.length > 1 && (
            <p className="mt-4 text-[11px] font-sans text-rose-700 font-medium uppercase tracking-wider">
              +{sortedThreads.length - 1} more{' '}
              {sortedThreads.length - 1 === 1 ? 'conversation' : 'conversations'} &rarr;
            </p>
          )}
        </Link>
      </div>
    </div>
  );
}
