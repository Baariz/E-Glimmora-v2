'use client';

/**
 * RenewalSignals — Timeline of key life signals
 * Clean editorial timeline with category badges
 */

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';

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

const categoryStyles: Record<RenewalSignal['category'], string> = {
  Personal: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  Financial: 'bg-slate-50 text-slate-600 border-slate-200/60',
  Relational: 'bg-amber-50 text-amber-600 border-amber-200/60',
  Aspirational: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
};

export function RenewalSignals() {
  return (
    <div>
      {/* Section header */}
      <div className="mb-10">
        <div className="w-10 h-px bg-gradient-to-r from-slate-400 to-slate-300 mb-5" />
        <p className="text-slate-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
          Section III
        </p>
        <h2 className="font-serif text-3xl text-stone-900 mb-3">
          Renewal Signals
        </h2>
        <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-2xl">
          Key moments and patterns that suggest evolving priorities, emerging opportunities,
          and natural life transitions.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-stone-200 hidden md:block" />

        <div className="space-y-6">
          {mockSignals.map((signal, index) => (
            <motion.div
              key={signal.date + signal.title}
              className="relative pl-0 md:pl-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Timeline dot */}
              <div className="absolute left-[11px] top-6 w-[9px] h-[9px] bg-slate-400 rounded-full ring-4 ring-[#f7f6f4] hidden md:block" />

              {/* Event card */}
              <div className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-7 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <time className="text-[10px] font-sans text-stone-300 tracking-wider uppercase">
                      {format(new Date(signal.date), 'MMMM d, yyyy')}
                    </time>
                    <h3 className="font-serif text-lg text-stone-900 mt-1.5">
                      {signal.title}
                    </h3>
                  </div>
                  <span className={cn(
                    'text-[9px] font-sans font-medium uppercase tracking-[2px] px-3 py-1.5 rounded-full border flex-shrink-0',
                    categoryStyles[signal.category]
                  )}>
                    {signal.category}
                  </span>
                </div>

                <p className="text-stone-500 font-sans text-sm leading-[1.7] tracking-wide">
                  {signal.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom insight */}
      <motion.div
        className="mt-10 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 sm:p-7"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="font-serif text-base text-slate-700 leading-[1.8] italic">
          These signals collectively point toward a <strong className="text-slate-900 not-italic">Renewal phase</strong>—a
          time of recalibration and reimagining what wealth can enable. We recommend exploring
          journeys that integrate family legacy, experiential learning, and purposeful impact.
        </p>
      </motion.div>
    </div>
  );
}
