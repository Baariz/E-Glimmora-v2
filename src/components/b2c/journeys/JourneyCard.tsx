'use client';

/**
 * Journey Card — Luxury full-image editorial card
 * Everything overlaid on the cinematic image, no white content panel.
 * Feels like a spread from a luxury travel magazine.
 */

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, EyeOff, ArrowRight } from 'lucide-react';
import type { Journey } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';
import { IMAGES } from '@/lib/constants/imagery';

interface JourneyCardProps {
  journey: Journey;
  className?: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  Travel: IMAGES.heroAerial,
  Wellness: IMAGES.heroWellness,
  'Estate Planning': IMAGES.heroSuite,
  Philanthropy: IMAGES.heroCulture,
  Investment: IMAGES.heroDining,
  Concierge: IMAGES.heroRiviera,
  Other: IMAGES.heroJourney,
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-white/20 text-white/70' },
  RM_REVIEW: { label: 'In Review', color: 'bg-amber-500/20 text-amber-200' },
  COMPLIANCE_REVIEW: { label: 'Compliance', color: 'bg-amber-500/20 text-amber-200' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-200' },
  PRESENTED: { label: 'Ready for You', color: 'bg-purple-500/20 text-purple-200' },
  EXECUTED: { label: 'Active', color: 'bg-rose-500/20 text-rose-200' },
  ARCHIVED: { label: 'Archived', color: 'bg-white/10 text-white/50' },
};

export function JourneyCard({ journey, className }: JourneyCardProps) {
  const router = useRouter();
  const img = CATEGORY_IMAGES[journey.category] || IMAGES.heroJourney;
  const status = STATUS_LABELS[journey.status] || { label: 'Draft', color: 'bg-white/20 text-white/70' };

  return (
    <article
      className={cn(
        'group relative cursor-pointer overflow-hidden',
        'rounded-[20px] min-h-[420px] sm:min-h-[460px] flex flex-col justify-end',
        'transition-all duration-700 ease-out',
        'hover:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.30),0_0_0_1px_rgba(255,255,255,0.08)]',
        className
      )}
      onClick={() => router.push(`/journeys/${journey.id}`)}
    >
      {/* Full-cover image with slow zoom on hover */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-[1.05]"
        style={{ backgroundImage: `url(${img})` }}
      />

      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />

      {/* Top badges row */}
      <div className="absolute top-0 left-0 right-0 p-5 flex items-start justify-between gap-2 z-10">
        {/* Category pill */}
        <span className="bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 text-[9px] font-sans font-medium uppercase tracking-[3px] px-4 py-2 rounded-full">
          {journey.category}
        </span>

        {/* Privacy badges */}
        <div className="flex items-center gap-1.5">
          {journey.discretionLevel && journey.discretionLevel !== 'Standard' && (
            <span className="bg-black/30 backdrop-blur-xl border border-white/10 text-white/70 text-[9px] font-sans px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Lock size={8} /> {journey.discretionLevel}
            </span>
          )}
          {journey.isInvisible && (
            <span className="bg-black/30 backdrop-blur-xl border border-white/10 text-white/60 p-1.5 rounded-full">
              <EyeOff size={10} />
            </span>
          )}
        </div>
      </div>

      {/* Bottom content — all overlaid on the image */}
      <div className="relative z-10 p-6 sm:p-7">
        {/* Gold accent */}
        <motion.div
          className="h-px bg-gradient-to-r from-amber-400/80 to-amber-500/40 mb-4"
          initial={{ width: 0 }}
          animate={{ width: 28 }}
          whileHover={{ width: 48 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Emotional objective */}
        {journey.emotionalObjective && (
          <p className="text-white/35 text-[11px] font-sans italic tracking-wider mb-2 line-clamp-1">
            {journey.emotionalObjective}
          </p>
        )}

        {/* Title */}
        <h3 className="font-serif text-[22px] sm:text-2xl text-white leading-[1.15] tracking-[-0.01em] mb-3">
          {journey.title}
        </h3>

        {/* Narrative excerpt */}
        <p className="text-white/35 text-[13px] font-sans leading-[1.7] tracking-wide mb-5 line-clamp-2">
          {journey.narrative.length > 110
            ? journey.narrative.substring(0, 110) + '\u2026'
            : journey.narrative}
        </p>

        {/* Footer: status + explore link */}
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-[9px] font-sans font-medium uppercase tracking-[3px] px-3 py-1.5 rounded-full backdrop-blur-sm',
            status.color
          )}>
            {status.label}
          </span>

          <span className="flex items-center gap-1.5 text-white/30 text-[11px] font-sans font-medium tracking-wider opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            Explore <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
