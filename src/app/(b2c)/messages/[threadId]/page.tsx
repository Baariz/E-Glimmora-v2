'use client';

/**
 * Thread Detail Page — Private Conversation View
 * Full-bleed wrapper matching Messages hub design
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { ThreadView } from '@/components/b2c/messaging/ThreadView';

import type { MessageThread, Message, User, Journey } from '@/lib/types/entities';

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const services = useServices();
  const threadId = params.threadId as string;

  const [thread, setThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [relatedJourney, setRelatedJourney] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadThread = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedThread = await services.message.getThreadById(threadId);

      if (!fetchedThread) {
        setError('Thread not found');
        setIsLoading(false);
        return;
      }

      if (!fetchedThread.participants.includes(MOCK_UHNI_USER_ID)) {
        setError('You do not have access to this conversation');
        setIsLoading(false);
        return;
      }

      setThread(fetchedThread);

      const fetchedMessages = await services.message.getMessages(threadId);
      const sortedMessages = fetchedMessages.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
      setMessages(sortedMessages);

      const threadParticipants = fetchedThread.participants.map((userId) => ({
        id: userId,
        name: userId === MOCK_UHNI_USER_ID ? 'James Duchamp' : 'Sarah Chen',
        email: `${userId}@example.com`,
        roles: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) as User[];
      setParticipants(threadParticipants);

      if (fetchedThread.relatedResourceId) {
        const journey = await services.journey.getJourneyById(
          fetchedThread.relatedResourceId
        );
        setRelatedJourney(journey);
      }
    } catch (err) {
      console.error('Failed to load thread:', err);
      setError('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessagesUpdated = () => {
    loadThread();
  };

  useEffect(() => {
    if (threadId) {
      loadThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-[#f5f3f0] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden flex items-center justify-center"
        style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-stone-400 text-[11px] font-sans tracking-wide">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div
        className="min-h-screen bg-[#f5f3f0] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden flex items-center justify-center"
        style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        <motion.div
          className="bg-white border border-stone-200/60 rounded-2xl p-10 sm:p-14 text-center shadow-sm max-w-md mx-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="font-serif text-2xl text-stone-900 mb-3">
            {error || 'Conversation not found'}
          </h2>
          <p className="text-stone-400 text-sm font-sans leading-[1.7] tracking-wide mb-7">
            The conversation you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            access to it.
          </p>
          <button
            onClick={() => router.push('/messages')}
            className="inline-flex items-center gap-2.5 px-7 py-3 bg-stone-900 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-stone-800 transition-all"
          >
            <ArrowLeft size={13} />
            Back to Messages
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f3f0] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden"
      style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* Compact dark header for thread context */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-800 pt-24 sm:pt-28 pb-6">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-16">
          <button
            onClick={() => router.push('/messages')}
            className="flex items-center gap-2 text-white/40 text-[11px] font-sans tracking-wide hover:text-white/60 transition-colors mb-3"
          >
            <ArrowLeft size={12} />
            All Messages
          </button>
          {relatedJourney && (
            <h1 className="font-serif text-2xl sm:text-3xl text-white leading-snug">
              {relatedJourney.title}
            </h1>
          )}
        </div>
      </div>

      {/* Thread view container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-16 py-8 sm:py-10">
        <ThreadView
          thread={thread}
          messages={messages}
          participants={participants}
          relatedJourney={relatedJourney}
          onMessagesUpdated={handleMessagesUpdated}
        />
      </div>
    </div>
  );
}
