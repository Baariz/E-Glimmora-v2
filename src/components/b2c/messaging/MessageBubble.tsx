'use client';

/**
 * MessageBubble Component
 * Displays individual message with sender-based styling
 * Own messages: right-aligned, rose background
 * Other messages: left-aligned, sand background
 * System messages: centered, italic, no bubble
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
  // System messages: centered, no bubble
  if (message.type === 'system') {
    return (
      <motion.div
        className="flex justify-center my-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm font-sans italic text-sand-500 text-center max-w-md">
          {message.content}
        </p>
      </motion.div>
    );
  }

  // User messages: bubbles with sender info
  return (
    <motion.div
      className={cn(
        'flex flex-col mb-4',
        isOwnMessage ? 'items-end' : 'items-start'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sender name */}
      <div className="px-4 mb-1">
        <p className="text-xs font-sans text-sand-600">
          {sender?.name || 'Unknown'}
        </p>
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          'px-4 py-3 rounded-2xl max-w-md',
          isOwnMessage
            ? 'bg-rose-900 text-rose-50 rounded-tr-sm'
            : 'bg-sand-100 text-sand-900 rounded-tl-sm'
        )}
      >
        <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>

      {/* Timestamp */}
      <div className="px-4 mt-1">
        <p className="text-xs font-sans text-sand-400">
          {format(new Date(message.sentAt), 'MMM d, h:mm a')}
        </p>
      </div>
    </motion.div>
  );
}
