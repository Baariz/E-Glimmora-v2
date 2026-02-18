'use client';

/**
 * Message Thread Detail Page
 * Displays full thread view with message history
 * Fetches thread, shows ThreadView, handles 404
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

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
      // Fetch thread
      const fetchedThread = await services.message.getThreadById(threadId);

      if (!fetchedThread) {
        setError('Thread not found');
        setIsLoading(false);
        return;
      }

      // Verify user is participant
      if (!fetchedThread.participants.includes(MOCK_UHNI_USER_ID)) {
        setError('You do not have access to this conversation');
        setIsLoading(false);
        return;
      }

      setThread(fetchedThread);

      // Fetch messages
      const fetchedMessages = await services.message.getMessages(threadId);
      const sortedMessages = fetchedMessages.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
      setMessages(sortedMessages);

      // Fetch participants (mock)
      const threadParticipants = fetchedThread.participants.map((userId) => ({
        id: userId,
        name: userId === MOCK_UHNI_USER_ID ? 'James Duchamp' : 'Sarah Chen',
        email: `${userId}@example.com`,
        roles: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) as User[];
      setParticipants(threadParticipants);

      // Fetch related journey
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
    // Reload messages when new message is sent
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
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <motion.div
          className="w-8 h-8 border-4 border-rose-900 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-sand-200 p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-2xl font-serif font-light text-rose-900 mb-2">
            {error || 'Conversation not found'}
          </h2>
          <p className="text-sm font-sans text-sand-600 mb-6">
            The conversation you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            access to it.
          </p>
          <button
            onClick={() => router.push('/messages')}
            className="px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
          >
            Back to Messages
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <ThreadView
      thread={thread}
      messages={messages}
      participants={participants}
      relatedJourney={relatedJourney}
      onMessagesUpdated={handleMessagesUpdated}
    />
  );
}
