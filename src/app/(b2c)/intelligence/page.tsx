'use client';

/**
 * Intelligence Brief Page — Analytical Magazine
 * Deep slate header with grid-pattern overlay (unique from all other pages)
 * Sticky section nav, editorial scroll sections
 */

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal';
import { fadeUp, fadeIn } from '@/styles/variants';
import { EmotionalTrends } from '@/components/b2c/intelligence/EmotionalTrends';
import { LifestylePatterns } from '@/components/b2c/intelligence/LifestylePatterns';
import { RenewalSignals } from '@/components/b2c/intelligence/RenewalSignals';
import { ExposureRiskOverview } from '@/components/b2c/intelligence/ExposureRiskOverview';

const SECTIONS = [
  { label: 'Emotional Trends', href: '#emotional-trends' },
  { label: 'Lifestyle Patterns', href: '#lifestyle-patterns' },
  { label: 'Renewal Signals', href: '#renewal-signals' },
  { label: 'Exposure & Risk', href: '#exposure-risk' },
];

export default function IntelligencePage() {
  return (
    <div
      className="min-h-screen bg-[#f7f6f4] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden"
      style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ DEEP SLATE HEADER (unique — no image, no rose) ═══════ */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
        {/* Analytical grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Subtle accent glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-emerald-500/[0.03] rounded-full blur-[100px] translate-y-1/2" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 pt-28 sm:pt-36 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Brain size={15} className="text-blue-400/60" />
              </div>
              <div>
                <p className="text-blue-300/40 text-[10px] font-sans uppercase tracking-[5px]">
                  Intelligence Brief
                </p>
                <p className="text-slate-500 text-[10px] font-sans tracking-wider mt-0.5">
                  February 2026
                </p>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl text-white leading-[1] tracking-[-0.03em] mb-6"
          >
            Your Evolving<br />
            Narrative
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/20 font-sans text-sm sm:text-base max-w-xl leading-[1.8] tracking-wide"
          >
            An analytical view of your emotional trends, lifestyle patterns,
            renewal signals, and exposure profile — informing every journey
            we curate for you.
          </motion.p>
        </div>
      </div>

      {/* ═══════ STICKY SECTION NAV ═══════ */}
      <div className="sticky top-16 z-20 bg-[#f7f6f4]/95 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16">
          <nav className="flex items-center gap-1 overflow-x-auto py-0 -mx-2">
            {SECTIONS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-4 text-[12px] font-sans text-stone-400 tracking-wide whitespace-nowrap hover:text-stone-700 transition-colors border-b-2 border-transparent hover:border-stone-400"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ═══════ EDITORIAL SECTIONS ═══════ */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16">
        <ScrollReveal variant={fadeUp} delay={0}>
          <div id="emotional-trends" className="py-14 sm:py-16">
            <EmotionalTrends />
          </div>
        </ScrollReveal>

        <div className="h-px bg-stone-200/60" />

        <ScrollReveal variant={fadeUp} delay={0.1}>
          <div id="lifestyle-patterns" className="py-14 sm:py-16">
            <LifestylePatterns />
          </div>
        </ScrollReveal>

        <div className="h-px bg-stone-200/60" />

        <ScrollReveal variant={fadeUp} delay={0.2}>
          <div id="renewal-signals" className="py-14 sm:py-16">
            <RenewalSignals />
          </div>
        </ScrollReveal>

        <div className="h-px bg-stone-200/60" />

        <ScrollReveal variant={fadeUp} delay={0.3}>
          <div id="exposure-risk" className="py-14 sm:py-16">
            <ExposureRiskOverview />
          </div>
        </ScrollReveal>
      </div>

      {/* ═══════ CLOSING STATEMENT ═══════ */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-16 py-16 sm:py-20 text-center">
          <div className="w-8 h-px bg-gradient-to-r from-blue-400/40 to-blue-500/20 mx-auto mb-6" />
          <p className="font-serif text-2xl sm:text-3xl text-white/80 leading-[1.3] tracking-[-0.01em] mb-6">
            This brief is updated quarterly and reflects
            our ongoing analysis of your priorities.
          </p>
          <p className="text-white/20 font-sans text-sm leading-[1.8] tracking-wide max-w-md mx-auto">
            For questions about any insights presented here,
            please reach out to your relationship manager.
          </p>
        </div>
      </div>
    </div>
  );
}
