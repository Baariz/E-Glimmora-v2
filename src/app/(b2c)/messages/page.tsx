'use client';

/**
 * Messages Page — Private Correspondence Hub
 * Elegant dark gradient header (no hero image — unique from other pages)
 * Thread list with luxury card styling
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus } from 'lucide-react';

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
      const fetchedThreads = await services.message.getThreads(MOCK_UHNI_USER_ID);
      fetchedThreads.sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );
      setThreads(fetchedThreads);

      const lastMessagesMap: Record<string, Message | null> = {};
      const participantsMap: Record<string, User[]> = {};
      const journeysMap: Record<string, Journey | null> = {};

      await Promise.all(
        fetchedThreads.map(async (thread) => {
          const messages = await services.message.getMessages(thread.id);
          const sortedMessages = messages.sort(
            (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );
          lastMessagesMap[thread.id] = sortedMessages[sortedMessages.length - 1] || null;

          const threadParticipants = await Promise.all(
            thread.participants.map(async (userId) => {
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

      const journeys = await services.journey.getJourneys(MOCK_UHNI_USER_ID, 'b2c');
      setAvailableJourneys(journeys);

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
    <div
      className="min-h-screen bg-[#f5f3f0] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden"
      style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ DARK GRADIENT HEADER (no image) ═══════ */}
      <div className="relative bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Warm accent glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rose-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 pt-28 sm:pt-32 pb-14 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Shield size={13} className="text-amber-400/70" />
              </div>
              <p className="text-amber-400/40 text-[10px] font-sans uppercase tracking-[5px]">
                Private Correspondence
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl text-white leading-[1.05] tracking-[-0.025em] mb-4"
          >
            Your Messages
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <p className="text-white/25 font-sans text-sm max-w-md leading-[1.7] tracking-wide">
              Secure, private conversations with your dedicated advisors.
              Every exchange is encrypted and confidential.
            </p>

            {!isLoading && (
              <NewThreadModal
                journeys={availableJourneys}
                advisors={advisors}
                onThreadCreated={loadThreads}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* ═══════ THREAD LIST ═══════ */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-14">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-stone-400 text-[11px] font-sans tracking-wide mt-4">Loading your correspondence...</p>
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
    </div>
  );
}
