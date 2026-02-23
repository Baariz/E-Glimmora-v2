'use client';

/**
 * Upcoming Journeys (BREF-03)
 * Preview cards for 2-3 upcoming journeys from journey service.
 * Each card: title, category, status badge, narrative excerpt.
 * Links to /journeys/[id].
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Journey } from '@/lib/types/entities';
import { JourneyStatus } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';

interface UpcomingJourneysProps {
  journeys: Journey[];
  isLoading?: boolean;
}

const statusColors: Record<JourneyStatus, { bg: string; text: string; label: string }> = {
  [JourneyStatus.DRAFT]: { bg: 'bg-sand-100', text: 'text-sand-700', label: 'Draft' },
  [JourneyStatus.RM_REVIEW]: { bg: 'bg-gold-50', text: 'text-gold-700', label: 'In Review' },
  [JourneyStatus.COMPLIANCE_REVIEW]: { bg: 'bg-gold-50', text: 'text-gold-700', label: 'Compliance' },
  [JourneyStatus.APPROVED]: { bg: 'bg-teal-50', text: 'text-teal-700', label: 'Approved' },
  [JourneyStatus.PRESENTED]: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Presented' },
  [JourneyStatus.EXECUTED]: { bg: 'bg-olive-50', text: 'text-olive-700', label: 'Active' },
  [JourneyStatus.ARCHIVED]: { bg: 'bg-sand-100', text: 'text-sand-500', label: 'Archived' },
};

function StatusBadge({ status }: { status: JourneyStatus }) {
  const style = statusColors[status] || statusColors[JourneyStatus.DRAFT];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans',
        style.bg,
        style.text
      )}
    >
      {style.label}
    </span>
  );
}

const categoryIcons: Record<string, string> = {
  Travel: 'Travel',
  Investment: 'Investment',
  'Estate Planning': 'Estate',
  Philanthropy: 'Philanthropy',
  'Family Education': 'Education',
  Wellness: 'Wellness',
  Concierge: 'Concierge',
  Other: 'Journey',
};

export function UpcomingJourneys({ journeys, isLoading }: UpcomingJourneysProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-40 bg-sand-200 rounded animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-white border border-sand-200 p-6 animate-pulse">
            <div className="h-4 w-24 bg-sand-200 rounded mb-3" />
            <div className="h-5 w-3/4 bg-sand-200 rounded mb-2" />
            <div className="h-3 w-full bg-sand-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Show at most 3 upcoming journeys
  const upcoming = journeys.slice(0, 3);

  return (
    <div>
      <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-2">
        On Your Horizon
      </p>
      <h3 className="font-serif text-lg text-stone-900 mb-6">Upcoming Journeys</h3>

      {upcoming.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sand-300 p-8 text-center">
          <p className="font-serif text-lg text-sand-400 mb-2">No journeys yet</p>
          <p className="text-sm font-sans text-sand-400">
            Your curated journeys will appear here once they are created through the Intent
            process.
          </p>
          <Link
            href="/intent"
            className="inline-block mt-4 text-sm font-sans text-rose-600 hover:text-rose-500 transition-colors"
          >
            Begin your Intent profile &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {upcoming.map((journey, index) => (
            <motion.div
              key={journey.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              <Link href={`/journeys/${journey.id}`} className="block group">
                <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                  {/* Status gradient accent */}
                  <div className={cn(
                    'h-1 w-full',
                    journey.status === JourneyStatus.EXECUTED  ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                    journey.status === JourneyStatus.PRESENTED ? 'bg-gradient-to-r from-rose-400 to-amber-400' :
                    journey.status === JourneyStatus.APPROVED  ? 'bg-gradient-to-r from-amber-400 to-yellow-300' :
                    'bg-gradient-to-r from-stone-200 to-stone-300'
                  )} />

                  <div className="p-6">
                    {/* Category + Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-sans uppercase tracking-wider text-stone-400">
                        {categoryIcons[journey.category] || journey.category}
                      </span>
                      <StatusBadge status={journey.status} />
                    </div>

                    {/* Title */}
                    <h4 className="font-serif text-lg text-rose-900 group-hover:text-rose-700 transition-colors mb-2">
                      {journey.title}
                    </h4>

                    {/* Narrative excerpt */}
                    <p className="text-sm font-sans text-stone-500 line-clamp-2 leading-relaxed">
                      {journey.narrative}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
