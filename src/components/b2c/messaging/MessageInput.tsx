'use client';

/**
 * MessageInput — Refined Composer
 * Minimal, elegant input area with circular send button.
 * Shift+Enter for newline, Enter to send.
 */

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  placeholder = 'Write a message...',
  disabled = false,
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSend(content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-stone-200/60 bg-white px-5 sm:px-6 py-4">
      <div className="flex gap-3 items-end">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          rows={1}
          className={cn(
            'flex-1 px-5 py-3 bg-stone-50 border border-stone-200/60 rounded-xl',
            'font-sans text-sm text-stone-700 placeholder:text-stone-300',
            'focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300',
            'resize-none leading-[1.6] tracking-wide',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        />

        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending || disabled}
          className={cn(
            'w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0',
            'transition-all duration-300',
            content.trim() && !isSending
              ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
              : 'bg-stone-100 text-stone-300 cursor-not-allowed'
          )}
          aria-label="Send message"
        >
          <Send size={15} className={content.trim() ? '-translate-x-px' : ''} />
        </button>
      </div>

      <p className="text-[10px] font-sans text-stone-300 tracking-wide mt-2.5 pl-1">
        Enter to send &middot; Shift + Enter for new line
      </p>
    </div>
  );
}
