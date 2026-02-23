'use client';

/**
 * Journey Detail Page
 * Full-bleed hero with journey photography, then editorial detail sections.
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
import { JourneyStatusTimeline } from '@/components/b2c/journeys/JourneyStatusTimeline';
import { LiveJourneyCard } from '@/components/b2c/journeys/LiveJourneyCard';
import { PrivateConfirmation } from '@/components/b2c/journeys/PrivateConfirmation';
import { PostJourneyFeedback } from '@/components/b2c/journeys/PostJourneyFeedback';
import { NextJourneyPanel } from '@/components/b2c/journeys/NextJourneyPanel';
import { ItineraryViewer } from '@/components/b2c/journeys/ItineraryViewer';
import { IMAGES } from '@/lib/constants/imagery';
import { ParallaxSection } from '@/components/ui/ParallaxSection';
import { cn } from '@/lib/utils/cn';

import type { Journey } from '@/lib/types/entities';
import { JourneyStatus } from '@/lib/types/entities';

const CATEGORY_IMAGES: Record<string, string> = {
  Travel: IMAGES.heroAerial,
  Wellness: IMAGES.heroWellness,
  'Estate Planning': IMAGES.heroSuite,
  Philanthropy: IMAGES.heroCulture,
  Investment: IMAGES.heroDining,
  Concierge: IMAGES.heroRiviera,
  Other: IMAGES.heroJourney,
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  RM_REVIEW: { label: 'In Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  COMPLIANCE_REVIEW: { label: 'Compliance', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PRESENTED: { label: 'Ready for You', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  EXECUTED: { label: 'Active', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ARCHIVED: { label: 'Archived', color: 'bg-stone-50 text-stone-500 border-stone-200' },
};

export default function JourneyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const services = useServices();

  const journeyId = params.id as string;

  const [journey, setJourney] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchJourney() {
      setIsLoading(true);
      try {
        const fetched = await services.journey.getJourneyById(journeyId);
        if (cancelled) return;
        if (!fetched) { setNotFound(true); } else { setJourney(fetched); }
      } catch (error) {
        console.error('Failed to fetch journey:', error);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchJourney();
    return () => { cancelled = true; };
  }, [journeyId, services]);

  const handleJourneyUpdate = (updated: Journey) => setJourney(updated);

  const handleRefreshJourney = async () => {
    const refreshed = await services.journey.getJourneyById(journeyId);
    if (refreshed) setJourney(refreshed);
  };

  const handleArchive = async () => {
    if (!journey) return;
    const confirmed = confirm('Archive this journey? You can view it later in the Archived filter.');
    if (!confirmed) return;
    try {
      const updated = await services.journey.updateJourney(journey.id, { status: JourneyStatus.ARCHIVED });
      setJourney(updated);
    } catch (error) {
      console.error('Failed to archive journey:', error);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="-mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
        <div className="h-[45vh] bg-sand-100 animate-pulse" />
        <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-16">
          <div className="space-y-6">
            <div className="h-8 bg-sand-100 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-sand-100 rounded w-3/4 animate-pulse" />
            <div className="h-64 bg-sand-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 404
  if (notFound || !journey) {
    return (
      <div
        className="-mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8"
        style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        <ParallaxSection
          imageUrl={IMAGES.heroJourney}
          className="min-h-[45vh] flex items-end"
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 pb-14 pt-32">
            <h1 className="font-serif text-4xl text-white mb-4">Journey Not Found</h1>
            <p className="text-white/40 font-sans text-sm mb-8">The journey you are looking for does not exist or has been removed.</p>
            <Link
              href="/journeys"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-900 font-sans text-[13px] font-semibold rounded-full hover:bg-amber-50 transition-all shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Journeys
            </Link>
          </div>
        </ParallaxSection>
      </div>
    );
  }

  const heroImage = CATEGORY_IMAGES[journey.category] || IMAGES.heroJourney;
  const statusCfg = STATUS_CONFIG[journey.status] || { label: 'Draft', color: 'bg-stone-100 text-stone-600 border-stone-200' };

  return (
    <div
      className="min-h-screen bg-sand-50 -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8"
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ FULL-BLEED HERO ═══════ */}
      <ParallaxSection
        imageUrl={heroImage}
        className="min-h-[45vh] sm:min-h-[50vh] flex items-end"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-sand-50 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-16 pt-32">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/journeys"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white font-sans text-[13px] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Journeys
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-4" />
            <p className="text-amber-300/60 text-[10px] font-sans uppercase tracking-[5px] mb-3">
              {journey.category}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-[0.95] tracking-[-0.02em] mb-5 max-w-2xl">
              {journey.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn('text-xs font-sans font-medium px-3.5 py-1.5 rounded-full border', statusCfg.color)}>
                {statusCfg.label}
              </span>
              {journey.discretionLevel && journey.discretionLevel !== 'Standard' && (
                <span className="text-xs font-sans px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20">
                  {journey.discretionLevel} Discretion
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* ═══════ CONTENT ═══════ */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-14 sm:py-20">

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <JourneyStatusTimeline status={journey.status} journeyTitle={journey.title} />
        </motion.div>

        {/* Live Journey Card — only when EXECUTED */}
        {journey.status === JourneyStatus.EXECUTED && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <LiveJourneyCard />
          </motion.div>
        )}

        {/* Private Confirmation — only when PRESENTED */}
        {journey.status === JourneyStatus.PRESENTED && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <PrivateConfirmation
              journeyTitle={journey.title}
              journeyId={journey.id}
              onConfirmed={handleRefreshJourney}
            />
          </motion.div>
        )}

        {/* Journey Detail — narrative, objective, reasoning */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <JourneyDetail journey={journey} className="mb-12" />
        </motion.div>

        {/* Itinerary Viewer — when confirmed */}
        {[JourneyStatus.APPROVED, JourneyStatus.PRESENTED, JourneyStatus.EXECUTED].includes(journey.status) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <ItineraryViewer journeyTitle={journey.title} />
          </motion.div>
        )}

        {/* Invisible Itinerary Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 bg-white border border-sand-200/60 rounded-2xl p-7 shadow-sm"
        >
          <InvisibleItineraryToggle journey={journey} onToggled={handleJourneyUpdate} />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex flex-wrap items-center gap-4">
            {journey.status === JourneyStatus.DRAFT && (
              <>
                <ConfirmJourneyFlow journey={journey} onConfirmed={handleJourneyUpdate} />
                <RefineJourneyModal journey={journey} onRefined={handleJourneyUpdate} />
              </>
            )}

            {journey.status !== JourneyStatus.ARCHIVED && (
              <button
                onClick={handleArchive}
                className="px-6 py-3 bg-sand-100 text-stone-400 font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-sand-200 transition-all flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
            )}

            {journey.status === JourneyStatus.APPROVED && (
              <div className="flex-1 px-6 py-3.5 bg-emerald-50 text-emerald-600 font-sans text-[13px] font-medium tracking-wide rounded-full flex items-center justify-center gap-2.5 border border-emerald-200/60">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Journey Confirmed
              </div>
            )}

            {journey.status === JourneyStatus.ARCHIVED && (
              <div className="flex-1 px-6 py-3.5 bg-sand-50 text-stone-400 font-sans text-[13px] font-medium tracking-wide rounded-full flex items-center justify-center gap-2.5 border border-sand-200/60">
                <Archive className="w-4 h-4" />
                Archived
              </div>
            )}
          </div>
        </motion.div>

        {/* Post-Journey Feedback */}
        {(journey.status === JourneyStatus.EXECUTED || journey.status === JourneyStatus.ARCHIVED) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <PostJourneyFeedback journeyTitle={journey.title} />
          </motion.div>
        )}

        {/* Next Journey Suggestions */}
        {(journey.status === JourneyStatus.EXECUTED || journey.status === JourneyStatus.ARCHIVED) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <NextJourneyPanel />
          </motion.div>
        )}
      </div>
    </div>
  );
}
