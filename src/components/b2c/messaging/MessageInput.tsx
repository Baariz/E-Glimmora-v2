'use client';

/**
 * MessageInput Component
 * Text input for composing and sending messages
 * Shift+Enter for newline, Enter to send
 * Optimistic updates for instant feedback
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
  placeholder = 'Type a message...',
  disabled = false,
}: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSend(content.trim());
      setContent(''); // Clear input on success
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-sand-200 bg-white p-4">
      <div className="flex gap-3 items-end">
        {/* Text input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          rows={2}
          className={cn(
            'flex-1 px-4 py-3 bg-sand-50 border border-sand-200 rounded-lg',
            'font-sans text-sm text-sand-900 placeholder:text-sand-400',
            'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
            'resize-none',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!content.trim() || isSending || disabled}
          className={cn(
            'px-4 py-3 bg-rose-900 text-rose-50 rounded-lg',
            'hover:bg-rose-800 transition-colors',
            'flex items-center justify-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
          <span className="font-sans text-sm font-medium">
            {isSending ? 'Sending...' : 'Send'}
          </span>
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs font-sans text-sand-400 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
