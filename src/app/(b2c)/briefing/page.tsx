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
      {/* Cinematic Greeting Hero                                             */}
      {/* ------------------------------------------------------------------ */}
      <motion.header variants={fadeUp} className="mb-16">
        <div
          className="relative rounded-3xl overflow-hidden min-h-[240px] sm:min-h-[300px] flex items-end bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10 w-full">
            <p className="text-amber-300 text-xs font-sans uppercase tracking-[3px] mb-3">Your Private Briefing</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-white mb-2">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-white/70 font-sans text-base">
              Here is everything your Élan team has prepared for you.
            </p>
            <p className="text-white/40 font-sans text-sm mt-2">{todayFormatted}</p>
          </div>
        </div>
      </motion.header>

      {/* ------------------------------------------------------------------ */}
      {/* Section: Your Emotional Landscape                                  */}
      {/* ------------------------------------------------------------------ */}
      <motion.div variants={fadeUp} className="mb-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent" />
          <span className="text-stone-400 text-xs font-sans uppercase tracking-[3px] shrink-0">Your Emotional Landscape</span>
          <div className="h-px flex-1 bg-gradient-to-l from-stone-200 to-transparent" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
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
      {/* Section: Your Private Shield                                       */}
      {/* ------------------------------------------------------------------ */}
      <motion.div variants={fadeUp} className="mb-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent" />
          <span className="text-stone-400 text-xs font-sans uppercase tracking-[3px] shrink-0">Your Private Shield</span>
          <div className="h-px flex-1 bg-gradient-to-l from-stone-200 to-transparent" />
        </div>
      </motion.div>

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
