'use client';

/**
 * Predictive Next Journey Panel
 * AGI anticipates the next experience — shown after journey completion
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const SUGGESTED_JOURNEYS = [
  { id: 'next-1', destination: 'Aman Venice', country: 'Italy', category: 'Private Retreat', match: 'Aligns with your need for restoration and absolute privacy.', score: 4, timing: 'Spring — April window suggested', emoji: '\uD83C\uDDEE\uD83C\uDDF9' },
  { id: 'next-2', destination: 'Kyoto Exclusive Ryokan', country: 'Japan', category: 'Cultural Immersion', match: 'Resonates with your legacy values and contemplative nature.', score: 5, timing: 'Autumn — October, cherry season ending', emoji: '\uD83C\uDDEF\uD83C\uDDF5' },
  { id: 'next-3', destination: 'Maldives Private Island', country: 'Maldives', category: 'Exclusive Seclusion', match: 'Matches your desire for complete seclusion and silence.', score: 4, timing: 'Winter — December through February', emoji: '\uD83C\uDFDD\uFE0F' },
];

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div key={dot} className={cn('w-1.5 h-1.5 rounded-full', dot <= score ? 'bg-amber-500' : 'bg-sand-200')} />
      ))}
    </div>
  );
}

export function NextJourneyPanel() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-rose-900 rounded-full" />
        <div>
          <p className="text-sand-500 text-xs font-sans uppercase tracking-widest">{'\u25C8'} AGI Anticipates</p>
          <h3 className="font-serif text-xl text-rose-900">Your next chapter, already taking shape.</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUGGESTED_JOURNEYS.map((journey, i) => (
          <motion.div
            key={journey.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-amber-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{journey.emoji}</span>
              <span className="text-xs font-sans px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{journey.category}</span>
            </div>
            <h4 className="font-serif text-lg text-rose-900 mb-1">{journey.destination}</h4>
            <p className="text-sand-500 text-xs font-sans mb-3">{journey.country}</p>
            <p className="text-sand-600 text-sm font-sans leading-relaxed mb-3">{journey.match}</p>
            <div className="flex items-center justify-between mb-4">
              <ScoreDots score={journey.score} />
              <span className="text-xs text-sand-400 font-sans">{journey.timing}</span>
            </div>
            <Link
              href="/intent"
              className="block w-full text-center py-2 rounded-lg bg-rose-900 text-white text-sm font-sans font-medium hover:bg-rose-800 transition-colors"
            >
              Begin Curation
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
