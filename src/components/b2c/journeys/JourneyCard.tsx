'use client';

/**
 * Journey Card Component
 * Rich preview card for journey narratives -- editorial magazine cover style.
 * Displays: title, category, discretion level, emotional objective,
 * narrative excerpt, risk indicator, status, invisible itinerary indicator.
 */

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';

import type { Journey, JourneyStatus } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';

interface JourneyCardProps {
  journey: Journey;
  className?: string;
}

/** Status badge colors */
const STATUS_COLORS: Record<JourneyStatus, string> = {
  DRAFT: 'bg-sand-100 text-sand-700',
  RM_REVIEW: 'bg-blue-100 text-blue-700',
  COMPLIANCE_REVIEW: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  PRESENTED: 'bg-purple-100 text-purple-700',
  EXECUTED: 'bg-rose-100 text-rose-700',
  ARCHIVED: 'bg-sand-200 text-sand-500',
};

/** Discretion level badge colors */
const DISCRETION_COLORS = {
  High: 'bg-rose-900 text-rose-50',
  Medium: 'bg-rose-700 text-rose-50',
  Standard: 'bg-sand-600 text-sand-50',
};

/** Risk indicator colors */
const RISK_INDICATORS = {
  high: { color: 'text-red-600', label: 'High Risk' },
  moderate: { color: 'text-amber-600', label: 'Moderate Risk' },
  low: { color: 'text-emerald-600', label: 'Low Risk' },
};

/** Determine risk level from riskSummary text */
function getRiskLevel(riskSummary?: string): 'high' | 'moderate' | 'low' {
  if (!riskSummary) return 'low';
  const lower = riskSummary.toLowerCase();
  if (lower.includes('high') || lower.includes('critical')) return 'high';
  if (lower.includes('moderate')) return 'moderate';
  return 'low';
}

export function JourneyCard({ journey, className }: JourneyCardProps) {
  const router = useRouter();
  const riskLevel = getRiskLevel(journey.riskSummary);
  const risk = RISK_INDICATORS[riskLevel];

  // Narrative excerpt (first 150 chars)
  const excerpt =
    journey.narrative.length > 150
      ? journey.narrative.substring(0, 150) + '…'
      : journey.narrative;

  const handleClick = () => {
    router.push(`/journeys/${journey.id}`);
  };

  return (
    <motion.article
      className={cn(
        'group relative bg-white border border-stone-100 rounded-2xl overflow-hidden',
        'cursor-pointer transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-0.5',
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Gradient accent bar */}
      <div className={cn(
        'h-1 w-full',
        journey.status === 'EXECUTED'  ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
        journey.status === 'PRESENTED' ? 'bg-gradient-to-r from-rose-400 to-amber-400' :
        journey.status === 'APPROVED'  ? 'bg-gradient-to-r from-amber-400 to-yellow-300' :
        'bg-gradient-to-r from-stone-200 to-stone-300'
      )} />

      {/* Top badges row */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-10">
        <div className="flex gap-2 flex-wrap">
          {/* Category badge */}
          <span className="px-3 py-1 bg-rose-50 text-rose-900 text-xs font-sans font-medium rounded-full">
            {journey.category}
          </span>

          {/* Discretion level badge */}
          {journey.discretionLevel && (
            <span
              className={cn(
                'px-3 py-1 text-xs font-sans font-medium rounded-full flex items-center gap-1',
                DISCRETION_COLORS[journey.discretionLevel]
              )}
            >
              <Lock className="w-3 h-3" />
              {journey.discretionLevel}
            </span>
          )}
        </div>

        {/* Invisible itinerary indicator */}
        {journey.isInvisible && (
          <div
            className="px-3 py-1 bg-rose-900 text-rose-50 text-xs font-sans font-medium rounded-full flex items-center gap-1"
            title="Invisible Itinerary Active"
          >
            <EyeOff className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-6 pt-16">
        {/* Title */}
        <h3 className="text-2xl font-serif font-light text-rose-900 mb-2 leading-tight">
          {journey.title}
        </h3>

        {/* Emotional objective */}
        {journey.emotionalObjective && (
          <p className="text-sm font-sans text-sand-600 italic mb-4">
            {journey.emotionalObjective}
          </p>
        )}

        {/* Narrative excerpt */}
        <p className="text-base font-sans text-sand-700 leading-relaxed mb-4">
          {excerpt}
        </p>

        {/* Bottom row: Risk + Status */}
        <div className="flex items-center justify-between pt-4 border-t border-sand-100">
          {/* Risk indicator */}
          <div className="flex items-center gap-2">
            <AlertTriangle className={cn('w-4 h-4', risk.color)} />
            <span className={cn('text-xs font-sans font-medium', risk.color)}>
              {risk.label}
            </span>
          </div>

          {/* Status badge */}
          <span
            className={cn(
              'px-3 py-1 text-xs font-sans font-medium rounded-full',
              STATUS_COLORS[journey.status]
            )}
          >
            {journey.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 border-2 border-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.article>
  );
}
