'use client';

/**
 * Predictive Next Journey Panel
 * AGI anticipates the next experience — shown after journey completion
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const SUGGESTED_JOURNEYS = [
  { id: 'next-1', destination: 'Aman Venice', country: 'Italy', category: 'Private Retreat', match: 'Aligns with your need for restoration and absolute privacy.', score: 4, timing: 'Spring — April window suggested', emoji: '\uD83C\uDDEE\uD83C\uDDF9' },
  { id: 'next-2', destination: 'Kyoto Exclusive Ryokan', country: 'Japan', category: 'Cultural Immersion', match: 'Resonates with your legacy values and contemplative nature.', score: 5, timing: 'Autumn — October, cherry season ending', emoji: '\uD83C\uDDEF\uD83C\uDDF5' },
  { id: 'next-3', destination: 'Maldives Private Island', country: 'Maldives', category: 'Exclusive Seclusion', match: 'Matches your desire for complete seclusion and silence.', score: 4, timing: 'Winter — December through February', emoji: '\uD83C\uDFDD\uFE0F' },
];

const GRADIENT_TOPS = [
  'from-rose-100/80 to-rose-50/30',
  'from-amber-100/80 to-amber-50/30',
  'from-teal-100/80 to-teal-50/30',
];

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div key={dot} className={cn('w-1.5 h-1.5 rounded-full', dot <= score ? 'bg-amber-400' : 'bg-sand-200')} />
      ))}
    </div>
  );
}

export function NextJourneyPanel() {
  return (
    <div>
      <div className="mb-8">
        <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
        <p className="text-amber-500 text-[10px] font-sans uppercase tracking-[5px] mb-3">
          What Comes Next
        </p>
        <h3 className="font-serif text-2xl text-stone-900">
          Your next chapter, already taking shape.
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SUGGESTED_JOURNEYS.map((journey, i) => (
          <motion.div
            key={journey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-white border border-sand-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500"
          >
            {/* Gradient top strip */}
            <div className={cn('h-1.5 bg-gradient-to-r', GRADIENT_TOPS[i])} />

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{journey.emoji}</span>
                <span className="text-[10px] font-sans uppercase tracking-[3px] px-2.5 py-1 rounded-full bg-sand-50 text-stone-400 border border-sand-200/60">
                  {journey.category}
                </span>
              </div>

              <h4 className="font-serif text-lg text-stone-900 mb-1">{journey.destination}</h4>
              <p className="text-stone-400 text-[11px] font-sans tracking-wide mb-4">{journey.country}</p>

              <p className="text-stone-500 text-sm font-sans leading-[1.7] tracking-wide mb-4">{journey.match}</p>

              <div className="flex items-center justify-between mb-5">
                <ScoreDots score={journey.score} />
                <span className="text-[10px] text-stone-300 font-sans italic tracking-wide">{journey.timing}</span>
              </div>

              <Link
                href="/intent"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-rose-600 text-white text-[13px] font-sans font-semibold tracking-wide hover:bg-rose-700 transition-all shadow-sm group-hover:shadow-md"
              >
                Begin Curation
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
