'use client';

/**
 * Messages Page
 * Thread list page with hero and "New Thread" button
 * Displays all messaging threads for the UHNI
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { ThreadList } from '@/components/b2c/messaging/ThreadList';
import { NewThreadModal } from '@/components/b2c/messaging/NewThreadModal';

import type { MessageThread, Message, User, Journey } from '@/lib/types/entities';

export default function MessagesPage() {
  const services = useServices();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, Message | null>>({});
  const [participants, setParticipants] = useState<Record<string, User[]>>({});
  const [relatedJourneys, setRelatedJourneys] = useState<Record<string, Journey | null>>({});
  const [availableJourneys, setAvailableJourneys] = useState<Journey[]>([]);
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      // Fetch threads
      const fetchedThreads = await services.message.getThreads(MOCK_UHNI_USER_ID);

      // Sort by last message time (most recent first)
      fetchedThreads.sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );

      setThreads(fetchedThreads);

      // Fetch last message for each thread
      const lastMessagesMap: Record<string, Message | null> = {};
      const participantsMap: Record<string, User[]> = {};
      const journeysMap: Record<string, Journey | null> = {};

      await Promise.all(
        fetchedThreads.map(async (thread) => {
          // Get messages for thread
          const messages = await services.message.getMessages(thread.id);
          const sortedMessages = messages.sort(
            (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );
          lastMessagesMap[thread.id] = sortedMessages[sortedMessages.length - 1] || null;

          // Get participants (mock - in real app would fetch from user service)
          // For now, create mock participants
          const threadParticipants = await Promise.all(
            thread.participants.map(async (userId) => {
              // Try to get user from service (would work if users are seeded)
              // For mock, create placeholder
              return {
                id: userId,
                name: userId === MOCK_UHNI_USER_ID ? 'You' : 'Advisor',
                email: `${userId}@example.com`,
                roles: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              } as User;
            })
          );
          participantsMap[thread.id] = threadParticipants;

          // Get related journey
          if (thread.relatedResourceId) {
            const journey = await services.journey.getJourneyById(
              thread.relatedResourceId
            );
            journeysMap[thread.id] = journey;
          } else {
            journeysMap[thread.id] = null;
          }
        })
      );

      setLastMessages(lastMessagesMap);
      setParticipants(participantsMap);
      setRelatedJourneys(journeysMap);

      // Fetch available journeys for new thread modal
      const journeys = await services.journey.getJourneys(MOCK_UHNI_USER_ID, 'b2c');
      setAvailableJourneys(journeys);

      // Mock advisors (in real app, would fetch from user service)
      setAdvisors([
        {
          id: 'advisor-1',
          name: 'Sarah Chen',
          email: 'sarah.chen@elan.private',
          roles: { b2b: 'RelationshipManager' as any },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'advisor-2',
          name: 'Michael Torres',
          email: 'michael.torres@elan.private',
          roles: { b2b: 'PrivateBanker' as any },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to load threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-8 h-8 text-rose-900" />
              <h1 className="text-4xl font-serif font-light text-rose-900">
                Messages
              </h1>
            </div>
            <p className="text-base font-sans text-sand-600 leading-relaxed max-w-2xl">
              Private correspondence with your advisors about your journeys.
            </p>
          </div>

          {/* New Thread button */}
          {!isLoading && (
            <NewThreadModal
              journeys={availableJourneys}
              advisors={advisors}
              onThreadCreated={loadThreads}
            />
          )}
        </div>
      </motion.div>

      {/* Thread list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <motion.div
            className="w-8 h-8 border-4 border-rose-900 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : (
        <ThreadList
          threads={threads}
          lastMessages={lastMessages}
          participants={participants}
          relatedJourneys={relatedJourneys}
        />
      )}
    </div>
  );
}
