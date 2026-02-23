'use client';

/**
 * MessageBubble — Premium Message Display
 * Own messages: dark stone background, right-aligned
 * Other messages: white card, left-aligned
 * System messages: centered divider style
 */

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { Message, User } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';

interface MessageBubbleProps {
  message: Message;
  sender: User | null;
  isOwnMessage: boolean;
}

export function MessageBubble({
  message,
  sender,
  isOwnMessage,
}: MessageBubbleProps) {
  if (message.type === 'system') {
    return (
      <motion.div
        className="flex items-center gap-4 my-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex-1 h-px bg-stone-200/60" />
        <p className="text-[11px] font-sans text-stone-300 tracking-wide whitespace-nowrap">
          {message.content}
        </p>
        <div className="flex-1 h-px bg-stone-200/60" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        'flex flex-col mb-5',
        isOwnMessage ? 'items-end' : 'items-start'
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sender name */}
      <p className={cn(
        'text-[10px] font-sans tracking-wide mb-1.5 px-1',
        isOwnMessage ? 'text-stone-400' : 'text-stone-500'
      )}>
        {sender?.name || 'Unknown'}
      </p>

      {/* Bubble */}
      <div
        className={cn(
          'px-5 py-3.5 max-w-[75%] sm:max-w-md',
          isOwnMessage
            ? 'bg-stone-900 text-white rounded-2xl rounded-tr-md'
            : 'bg-white border border-stone-200/60 text-stone-700 rounded-2xl rounded-tl-md shadow-sm'
        )}
      >
        <p className={cn(
          'font-sans text-sm leading-[1.7] tracking-wide whitespace-pre-wrap',
          isOwnMessage ? 'text-white/90' : 'text-stone-600'
        )}>
          {message.content}
        </p>
      </div>

      {/* Timestamp */}
      <p className="text-[10px] font-sans text-stone-300 tracking-wide mt-1.5 px-1">
        {format(new Date(message.sentAt), 'MMM d, h:mm a')}
      </p>
    </motion.div>
  );
}
