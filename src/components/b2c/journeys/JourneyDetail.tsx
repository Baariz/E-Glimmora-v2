'use client';

/**
 * Journey Detail Component
 * Full narrative view with editorial typography.
 * Displays complete journey narrative with all metadata.
 */

import { motion } from 'framer-motion';
import { Calendar, MapPin, Shield, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

import type { Journey, DiscretionLevel } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';

interface JourneyDetailProps {
  journey: Journey;
  className?: string;
}

const DISCRETION_COLORS: Record<DiscretionLevel, string> = {
  High: 'bg-rose-900 text-rose-50',
  Medium: 'bg-rose-700 text-rose-50',
  Standard: 'bg-sand-600 text-sand-50',
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function JourneyDetail({ journey, className }: JourneyDetailProps) {
  return (
    <motion.article
      className={cn('max-w-4xl', className)}
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
      {/* Header: Title + Metadata Row                                       */}
      {/* ------------------------------------------------------------------ */}
      <motion.header variants={fadeUp} className="mb-8">
        {/* Category + Discretion Badges */}
        <div className="flex gap-3 mb-4">
          <span className="px-4 py-1.5 bg-rose-50 text-rose-900 text-sm font-sans font-medium rounded-full">
            {journey.category}
          </span>
          {journey.discretionLevel && (
            <span
              className={cn(
                'px-4 py-1.5 text-sm font-sans font-medium rounded-full flex items-center gap-2',
                DISCRETION_COLORS[journey.discretionLevel]
              )}
            >
              <Shield className="w-4 h-4" />
              {journey.discretionLevel} Discretion
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-light text-rose-900 leading-tight mb-4">
          {journey.title}
        </h1>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-6 text-sm font-sans text-sand-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created {format(new Date(journey.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="capitalize">{journey.status.toLowerCase().replace('_', ' ')}</span>
          </div>
        </div>
      </motion.header>

      {/* ------------------------------------------------------------------ */}
      {/* Emotional Objective (if present)                                   */}
      {/* ------------------------------------------------------------------ */}
      {journey.emotionalObjective && (
        <motion.section variants={fadeUp} className="mb-8">
          <div className="flex items-start gap-3 p-6 bg-rose-50 border border-rose-100 rounded-lg">
            <Target className="w-5 h-5 text-rose-900 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-sans font-semibold text-rose-900 uppercase tracking-wide mb-2">
                Emotional Objective
              </h3>
              <p className="text-base font-sans text-rose-900 leading-relaxed">
                {journey.emotionalObjective}
              </p>
            </div>
          </div>
        </motion.section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Full Narrative (editorial typography)                              */}
      {/* ------------------------------------------------------------------ */}
      <motion.section variants={fadeUp} className="mb-10">
        <div className="prose prose-lg prose-sand max-w-none">
          <p className="text-lg font-sans text-sand-800 leading-relaxed whitespace-pre-line">
            {journey.narrative}
          </p>
        </div>
      </motion.section>

      {/* ------------------------------------------------------------------ */}
      {/* Strategic Reasoning (if present)                                   */}
      {/* ------------------------------------------------------------------ */}
      {journey.strategicReasoning && (
        <motion.section variants={fadeUp} className="mb-8">
          <div className="flex items-start gap-3 p-6 bg-sand-50 border border-sand-200 rounded-lg">
            <Lightbulb className="w-5 h-5 text-sand-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-sans font-semibold text-sand-900 uppercase tracking-wide mb-2">
                Strategic Reasoning
              </h3>
              <p className="text-base font-sans text-sand-700 leading-relaxed">
                {journey.strategicReasoning}
              </p>
            </div>
          </div>
        </motion.section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Risk Summary (if present)                                          */}
      {/* ------------------------------------------------------------------ */}
      {journey.riskSummary && (
        <motion.section variants={fadeUp} className="mb-8">
          <div className="flex items-start gap-3 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-sans font-semibold text-amber-900 uppercase tracking-wide mb-2">
                Risk Summary
              </h3>
              <p className="text-base font-sans text-amber-900 leading-relaxed">
                {journey.riskSummary}
              </p>
            </div>
          </div>
        </motion.section>
      )}
    </motion.article>
  );
}
