'use client';

/**
 * Journey List Component
 * Two-column editorial grid with full-image cinematic cards.
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-[20px] overflow-hidden bg-stone-200/40 min-h-[420px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (journeys.length === 0) {
    return (
      <motion.div
        className="text-center py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 border border-rose-200/60 rounded-full mb-6">
          <Compass className="w-7 h-7 text-rose-400" />
        </div>
        <h3 className="font-serif text-2xl text-stone-900 mb-3">
          {filter === 'archived'
            ? 'No Archived Journeys'
            : 'No Journeys Yet'}
        </h3>
        <p className="text-stone-400 text-sm font-sans tracking-wide leading-[1.7] max-w-sm mx-auto mb-8">
          {filter === 'archived'
            ? 'You haven\'t archived any journeys yet.'
            : 'Generate your first set of personalized narrative journeys based on your intent profile.'}
        </p>
        {filter !== 'archived' && onGenerateClick && (
          <button
            onClick={onGenerateClick}
            className="px-8 py-3.5 bg-rose-600 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-rose-700 transition-all shadow-lg"
          >
            Generate Journeys
          </button>
        )}
      </motion.div>
    );
  }

  // Journey grid — two columns
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {journeys.map((journey, i) => (
        <motion.div
          key={journey.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <JourneyCard journey={journey} />
        </motion.div>
      ))}
    </div>
  );
}
