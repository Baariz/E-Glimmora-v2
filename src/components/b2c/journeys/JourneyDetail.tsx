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
      {/* Cinematic Header with Photography                                  */}
      {/* ------------------------------------------------------------------ */}
      <motion.header variants={fadeUp} className="mb-8">
        <div
          className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[340px]"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-10 pt-16 sm:pt-24 min-h-[280px] sm:min-h-[340px]">
            <p className="text-amber-300 text-xs font-sans uppercase tracking-widest mb-3">Your Journey</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-white mb-3">{journey.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans font-medium capitalize">
                {journey.status.toLowerCase().replace('_', ' ')}
              </span>
              {journey.category && (
                <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans">
                  {journey.category}
                </span>
              )}
              {journey.discretionLevel && (
                <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {journey.discretionLevel}
                </span>
              )}
            </div>
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
