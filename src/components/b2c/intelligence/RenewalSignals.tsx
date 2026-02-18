'use client';

/**
 * RenewalSignals Component (INTL-03)
 * Timeline of 3-4 renewal signal events with dates and narrative descriptions
 * Editorial magazine-style presentation
 */

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Sparkles, Calendar } from 'lucide-react';

interface RenewalSignal {
  date: string;
  title: string;
  description: string;
  category: 'Personal' | 'Financial' | 'Relational' | 'Aspirational';
}

const mockSignals: RenewalSignal[] = [
  {
    date: '2026-01-15',
    title: 'Renewed Interest in Experiential Travel',
    description:
      'Multiple conversations about transformative travel experiences suggest a shift from transactional tourism to meaningful cultural immersion. This aligns with your rising adventure driver.',
    category: 'Aspirational',
  },
  {
    date: '2025-12-08',
    title: 'Estate Planning Document Review',
    description:
      'Initiated comprehensive review of estate documents, indicating heightened awareness of legacy preservation and multi-generational wealth transfer considerations.',
    category: 'Financial',
  },
  {
    date: '2025-11-22',
    title: 'Family Education Priorities Emerging',
    description:
      'Discussions about grandchildren\'s educational opportunities abroad signal a desire to invest in next-generation experiences and cultural fluency.',
    category: 'Personal',
  },
  {
    date: '2025-10-10',
    title: 'Wellness Journey Exploration',
    description:
      'Inquiries about longevity-focused wellness programs reflect a proactive approach to health optimization and quality-of-life enhancement.',
    category: 'Personal',
  },
];

const categoryColors: Record<RenewalSignal['category'], string> = {
  Personal: 'bg-emerald-100 text-emerald-800',
  Financial: 'bg-rose-100 text-rose-800',
  Relational: 'bg-amber-100 text-amber-800',
  Aspirational: 'bg-purple-100 text-purple-800',
};

export function RenewalSignals() {
  return (
    <motion.section
      className="py-16 px-8 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-rose-600" />
            <h2 className="text-3xl font-serif font-light text-rose-900">
              Renewal Signals
            </h2>
          </div>
          <p className="text-base font-sans text-sand-600 leading-relaxed italic max-w-3xl">
            Key moments and patterns that suggest evolving priorities, emerging opportunities,
            and natural life transitions. These signals inform our journey recommendations.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-sand-200 hidden md:block" />

          {/* Events */}
          <div className="space-y-8">
            {mockSignals.map((signal, index) => (
              <motion.div
                key={signal.date + signal.title}
                className="relative pl-0 md:pl-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-3 h-3 bg-rose-600 rounded-full border-4 border-white shadow-sm hidden md:block" />

                {/* Event card */}
                <div className="bg-sand-50 rounded-lg p-6 border border-sand-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-sand-500" />
                        <time className="text-sm font-sans text-sand-500">
                          {format(new Date(signal.date), 'MMMM d, yyyy')}
                        </time>
                      </div>
                      <h3 className="text-xl font-serif font-light text-rose-900 mb-2">
                        {signal.title}
                      </h3>
                    </div>

                    {/* Category badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-sans font-medium ${
                        categoryColors[signal.category]
                      }`}
                    >
                      {signal.category}
                    </span>
                  </div>

                  <p className="text-base font-sans text-sand-700 leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom insight */}
        <motion.div
          className="mt-12 p-6 bg-rose-50 border-l-4 border-rose-600 rounded-r-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <p className="font-serif text-base text-rose-900 leading-relaxed italic">
            These signals collectively point toward a <strong>Renewal phase</strong>—a time of
            recalibration and reimagining what wealth can enable. We recommend exploring journeys
            that integrate family legacy, experiential learning, and purposeful impact.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
