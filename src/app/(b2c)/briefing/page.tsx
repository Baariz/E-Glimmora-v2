'use client';

/**
 * Sovereign Briefing Page
 * The UHNI's personalized home view -- luxury editorial layout.
 * Composes 6 data sections: emotional phase, balance, journeys,
 * risk status, discretion tier, advisor message preview.
 *
 * This is a WEBSITE page, not a dashboard. Think luxury magazine.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser, MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

import { EmotionalPhaseCard } from '@/components/b2c/briefing/EmotionalPhaseCard';
import { BalanceSummary } from '@/components/b2c/briefing/BalanceSummary';
import { UpcomingJourneys } from '@/components/b2c/briefing/UpcomingJourneys';
import { RiskStatusCard } from '@/components/b2c/briefing/RiskStatusCard';
import { DiscretionTierBadge } from '@/components/b2c/briefing/DiscretionTierBadge';
import { AdvisorMessagePreview } from '@/components/b2c/briefing/AdvisorMessagePreview';

import type { IntentProfile, Journey, MessageThread, Message } from '@/lib/types/entities';

/** Stagger container animation */
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/** Child item fade-up animation */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Determine time-of-day greeting */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function BriefingPage() {
  const { user } = useCurrentUser();
  const services = useServices();
  const prefersReducedMotion = useReducedMotion();

  // Data state
  const [intentProfile, setIntentProfile] = useState<IntentProfile | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, Message | null>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data from mock services
  useEffect(() => {
    let cancelled = false;

    async function fetchBriefingData() {
      setIsLoading(true);

      try {
        const [profile, userJourneys, userThreads] = await Promise.all([
          services.intent.getIntentProfile(MOCK_UHNI_USER_ID),
          services.journey.getJourneys(MOCK_UHNI_USER_ID, 'b2c'),
          services.message.getThreads(MOCK_UHNI_USER_ID),
        ]);

        if (cancelled) return;

        setIntentProfile(profile);
        setJourneys(userJourneys);
        setThreads(userThreads);

        // Fetch last message for each thread
        const messageMap: Record<string, Message | null> = {};
        await Promise.all(
          userThreads.map(async (thread) => {
            const messages = await services.message.getMessages(thread.id);
            const sorted = messages.sort(
              (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
            );
            messageMap[thread.id] = sorted[0] ?? null;
          })
        );

        if (!cancelled) {
          setLastMessages(messageMap);
        }
      } catch (error) {
        // Silently handle -- mock services should not fail
        console.error('Briefing data fetch error:', error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchBriefingData();

    return () => {
      cancelled = true;
    };
  }, [services]);

  const firstName = user.name.split(' ')[0];
  const todayFormatted = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      variants={prefersReducedMotion ? undefined : stagger}
      initial={prefersReducedMotion ? undefined : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Hero: Greeting + Date                                               */}
      {/* ------------------------------------------------------------------ */}
      <motion.header variants={fadeUp} className="mb-16">
        <p className="text-sm font-sans text-sand-500 mb-2">{todayFormatted}</p>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-rose-900 mb-3">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-lg font-sans text-sand-600 max-w-2xl">
          Your Sovereign Briefing -- a personal view of your emotional landscape,
          upcoming journeys, and the state of your world.
        </p>
      </motion.header>

      {/* ------------------------------------------------------------------ */}
      {/* Primary Row: Emotional Phase + Balance (left) / Journeys (right)   */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
        {/* Left column: Phase + Balance */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={fadeUp}>
            <EmotionalPhaseCard intentProfile={intentProfile} isLoading={isLoading} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <BalanceSummary intentProfile={intentProfile} isLoading={isLoading} />
          </motion.div>
        </div>

        {/* Right column: Upcoming Journeys */}
        <motion.div variants={fadeUp} className="lg:col-span-3">
          <UpcomingJourneys journeys={journeys} isLoading={isLoading} />
        </motion.div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Secondary Row: Risk + Discretion + Advisor Messages                */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <motion.div variants={fadeUp}>
          <RiskStatusCard riskLevel="low" isLoading={isLoading} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <DiscretionTierBadge tier="High" isLoading={isLoading} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <AdvisorMessagePreview
            threads={threads}
            lastMessages={lastMessages}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
