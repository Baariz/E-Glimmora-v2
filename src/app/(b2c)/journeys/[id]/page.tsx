'use client';

/**
 * Journey Detail Page
 * Full journey view with narrative, actions, and invisible itinerary toggle.
 * Handles confirm/refine/archive flows end-to-end.
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Archive } from 'lucide-react';
import Link from 'next/link';

import { useServices } from '@/lib/hooks/useServices';
import { JourneyDetail } from '@/components/b2c/journeys/JourneyDetail';
import { ConfirmJourneyFlow } from '@/components/b2c/journeys/ConfirmJourneyFlow';
import { RefineJourneyModal } from '@/components/b2c/journeys/RefineJourneyModal';
import { InvisibleItineraryToggle } from '@/components/b2c/journeys/InvisibleItineraryToggle';
import { JourneyActions } from '@/components/b2c/journeys/JourneyActions';
import { JourneyStatusTimeline } from '@/components/b2c/journeys/JourneyStatusTimeline';
import { LiveJourneyCard } from '@/components/b2c/journeys/LiveJourneyCard';
import { PrivateConfirmation } from '@/components/b2c/journeys/PrivateConfirmation';
import { PostJourneyFeedback } from '@/components/b2c/journeys/PostJourneyFeedback';
import { NextJourneyPanel } from '@/components/b2c/journeys/NextJourneyPanel';

import type { Journey } from '@/lib/types/entities';
import { JourneyStatus } from '@/lib/types/entities';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function JourneyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const services = useServices();

  const journeyId = params.id as string;

  const [journey, setJourney] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fetch journey
  useEffect(() => {
    let cancelled = false;

    async function fetchJourney() {
      setIsLoading(true);

      try {
        const fetchedJourney = await services.journey.getJourneyById(journeyId);

        if (cancelled) return;

        if (!fetchedJourney) {
          setNotFound(true);
        } else {
          setJourney(fetchedJourney);
        }
      } catch (error) {
        console.error('Failed to fetch journey:', error);
        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchJourney();

    return () => {
      cancelled = true;
    };
  }, [journeyId, services]);

  // Handle journey updates from child components
  const handleJourneyUpdate = (updatedJourney: Journey) => {
    setJourney(updatedJourney);
  };

  // Handle archive
  const handleArchive = async () => {
    if (!journey) return;

    const confirmed = confirm(
      'Archive this journey? You can view it later in the Archived filter.'
    );

    if (!confirmed) return;

    try {
      const updatedJourney = await services.journey.updateJourney(journey.id, {
        status: JourneyStatus.ARCHIVED,
      });
      setJourney(updatedJourney);
    } catch (error) {
      console.error('Failed to archive journey:', error);
      alert('Failed to archive journey. Please try again.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-sand-100 rounded w-1/4" />
          <div className="h-12 bg-sand-100 rounded w-3/4" />
          <div className="h-64 bg-sand-100 rounded" />
        </div>
      </div>
    );
  }

  // 404 state
  if (notFound || !journey) {
    return (
      <motion.div
        className="max-w-5xl mx-auto text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-serif font-light text-rose-900 mb-4">
          Journey Not Found
        </h1>
        <p className="text-base font-sans text-sand-600 mb-8">
          The journey you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/journeys"
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Journeys
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Back Navigation                                                    */}
      {/* ------------------------------------------------------------------ */}
      <motion.div variants={fadeUp} className="mb-8">
        <Link
          href="/journeys"
          className="inline-flex items-center gap-2 text-sand-600 hover:text-sand-800 font-sans text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journeys
        </Link>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Journey Status Timeline — always show                              */}
      {/* ------------------------------------------------------------------ */}
      <motion.div variants={fadeUp} className="mb-10">
        <JourneyStatusTimeline status={journey.status} journeyTitle={journey.title} />
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Live Journey Card — only when EXECUTED                             */}
      {/* ------------------------------------------------------------------ */}
      {journey.status === JourneyStatus.EXECUTED && (
        <motion.div variants={fadeUp} className="mb-10">
          <LiveJourneyCard />
        </motion.div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Private Confirmation — only when APPROVED                          */}
      {/* ------------------------------------------------------------------ */}
      {journey.status === JourneyStatus.APPROVED && (
        <motion.div variants={fadeUp} className="mb-10">
          <PrivateConfirmation journeyTitle={journey.title} />
        </motion.div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Journey Detail                                                     */}
      {/* ------------------------------------------------------------------ */}
      <motion.div variants={fadeUp}>
        <JourneyDetail journey={journey} className="mb-10" />
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Invisible Itinerary Toggle                                         */}
      {/* ------------------------------------------------------------------ */}
      <motion.div
        variants={fadeUp}
        className="mb-8 p-6 border border-sand-200 rounded-lg bg-sand-50"
      >
        <InvisibleItineraryToggle
          journey={journey}
          onToggled={handleJourneyUpdate}
        />
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Action Buttons (Confirm/Refine/Archive)                            */}
      {/* ------------------------------------------------------------------ */}
      <motion.div variants={fadeUp} className="mb-16">
        <div className="flex gap-4">
          {journey.status === JourneyStatus.DRAFT && (
            <>
              {/* Confirm Flow */}
              <ConfirmJourneyFlow
                journey={journey}
                onConfirmed={handleJourneyUpdate}
              />

              {/* Refine Flow */}
              <RefineJourneyModal
                journey={journey}
                onRefined={handleJourneyUpdate}
              />
            </>
          )}

          {/* Archive */}
          {journey.status !== JourneyStatus.ARCHIVED && (
            <button
              onClick={handleArchive}
              className="px-6 py-3 bg-sand-100 text-sand-700 font-sans font-medium rounded-lg hover:bg-sand-200 transition-colors flex items-center justify-center gap-2"
            >
              <Archive className="w-5 h-5" />
              Archive
            </button>
          )}

          {/* Status badges for non-draft states */}
          {journey.status === JourneyStatus.APPROVED && (
            <div className="flex-1 px-6 py-3 bg-emerald-50 text-emerald-900 font-sans font-medium rounded-lg flex items-center justify-center gap-2 border border-emerald-200">
              Journey Confirmed
            </div>
          )}

          {journey.status === JourneyStatus.ARCHIVED && (
            <div className="flex-1 px-6 py-3 bg-sand-200 text-sand-600 font-sans font-medium rounded-lg flex items-center justify-center gap-2">
              <Archive className="w-5 h-5" />
              Archived
            </div>
          )}
        </div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Post-Journey Feedback — only when EXECUTED or ARCHIVED             */}
      {/* ------------------------------------------------------------------ */}
      {(journey.status === JourneyStatus.EXECUTED || journey.status === JourneyStatus.ARCHIVED) && (
        <motion.div variants={fadeUp} className="mb-10">
          <PostJourneyFeedback journeyTitle={journey.title} />
        </motion.div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Next Journey Suggestions — only when EXECUTED or ARCHIVED          */}
      {/* ------------------------------------------------------------------ */}
      {(journey.status === JourneyStatus.EXECUTED || journey.status === JourneyStatus.ARCHIVED) && (
        <motion.div variants={fadeUp} className="mb-16">
          <NextJourneyPanel />
        </motion.div>
      )}
    </motion.div>
  );
}
