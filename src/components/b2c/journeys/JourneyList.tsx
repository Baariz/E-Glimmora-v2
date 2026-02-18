'use client';

/**
 * Journey List Component
 * Displays grid of journey cards with loading skeleton and empty state.
 * Fetches journeys from service via useServices hook.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { JourneyCard } from './JourneyCard';

import type { Journey } from '@/lib/types/entities';
import { JourneyStatus } from '@/lib/types/entities';

interface JourneyListProps {
  filter?: 'all' | 'active' | 'archived';
  onGenerateClick?: () => void;
}

/** Stagger animation for grid */
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/** Individual card fade-up */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function JourneyList({ filter = 'all', onGenerateClick }: JourneyListProps) {
  const services = useServices();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchJourneys() {
      setIsLoading(true);

      try {
        const allJourneys = await services.journey.getJourneys(
          MOCK_UHNI_USER_ID,
          'b2c'
        );

        if (cancelled) return;

        // Apply filter
        let filtered = allJourneys;
        if (filter === 'active') {
          filtered = allJourneys.filter(
            (j) => j.status !== JourneyStatus.ARCHIVED
          );
        } else if (filter === 'archived') {
          filtered = allJourneys.filter(
            (j) => j.status === JourneyStatus.ARCHIVED
          );
        }

        setJourneys(filtered);
      } catch (error) {
        console.error('Failed to fetch journeys:', error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchJourneys();

    return () => {
      cancelled = true;
    };
  }, [services, filter]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-sand-50 border border-sand-200 rounded-lg h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (journeys.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-4">
          <Compass className="w-8 h-8 text-rose-900" />
        </div>
        <h3 className="text-xl font-serif font-light text-rose-900 mb-2">
          {filter === 'archived'
            ? 'No Archived Journeys'
            : 'No Journeys Yet'}
        </h3>
        <p className="text-base font-sans text-sand-600 mb-6 max-w-md mx-auto">
          {filter === 'archived'
            ? 'You haven\'t archived any journeys yet.'
            : 'Generate your first set of personalized narrative journeys based on your intent profile.'}
        </p>
        {filter !== 'archived' && onGenerateClick && (
          <button
            onClick={onGenerateClick}
            className="px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
          >
            Generate Journeys
          </button>
        )}
      </motion.div>
    );
  }

  // Journey grid
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {journeys.map((journey) => (
        <motion.div key={journey.id} variants={fadeUp}>
          <JourneyCard journey={journey} />
        </motion.div>
      ))}
    </motion.div>
  );
}
