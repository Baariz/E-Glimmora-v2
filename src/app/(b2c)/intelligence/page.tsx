'use client';

/**
 * Intelligence Brief Page (INTL-05)
 * Magazine-style layout with stacked editorial sections
 * NOT a grid of cards - alternating layouts, scroll-triggered animations
 * Luxury magazine feel - each section is a feature article spread
 */

import { motion } from 'framer-motion';
import { BookOpen, TrendingUp } from 'lucide-react';

import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal';
import { fadeUp, fadeIn } from '@/styles/variants';
import { EmotionalTrends } from '@/components/b2c/intelligence/EmotionalTrends';
import { LifestylePatterns } from '@/components/b2c/intelligence/LifestylePatterns';
import { RenewalSignals } from '@/components/b2c/intelligence/RenewalSignals';
import { ExposureRiskOverview } from '@/components/b2c/intelligence/ExposureRiskOverview';

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Magazine cover / Hero */}
      <motion.div
        className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Issue label */}
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6" />
              <p className="text-sm font-sans uppercase tracking-widest text-rose-200">
                Intelligence Brief — February 2026
              </p>
            </div>

            {/* Cover title */}
            <h1 className="text-6xl md:text-7xl font-serif font-light mb-6 leading-tight">
              Your Evolving<br />
              Narrative
            </h1>

            {/* Subtitle */}
            <p className="text-xl font-sans text-rose-100 leading-relaxed max-w-2xl">
              An analytical view of your emotional trends, lifestyle patterns, renewal signals,
              and exposure profile. This brief informs our journey recommendations and ensures
              alignment with your evolving priorities.
            </p>
          </motion.div>

          {/* Decorative element */}
          <motion.div
            className="absolute bottom-0 right-0 w-64 h-64 opacity-20"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 0.2, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <TrendingUp className="w-full h-full" strokeWidth={0.5} />
          </motion.div>
        </div>
      </motion.div>

      {/* Table of contents bar */}
      <motion.div
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sand-200 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="max-w-5xl mx-auto px-8 py-4">
          <nav className="flex items-center gap-8 overflow-x-auto">
            {[
              { label: 'Emotional Trends', href: '#emotional-trends' },
              { label: 'Lifestyle Patterns', href: '#lifestyle-patterns' },
              { label: 'Renewal Signals', href: '#renewal-signals' },
              { label: 'Exposure & Risk', href: '#exposure-risk' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-sans text-sand-600 hover:text-rose-900 transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Magazine sections - stacked editorial spreads with scroll-reveal */}
      <ScrollReveal variant={fadeUp} delay={0}>
        <div id="emotional-trends">
          <EmotionalTrends />
        </div>
      </ScrollReveal>

      <ScrollReveal variant={fadeUp} delay={0.1}>
        <div id="lifestyle-patterns">
          <LifestylePatterns />
        </div>
      </ScrollReveal>

      <ScrollReveal variant={fadeUp} delay={0.2}>
        <div id="renewal-signals">
          <RenewalSignals />
        </div>
      </ScrollReveal>

      <ScrollReveal variant={fadeUp} delay={0.3}>
        <div id="exposure-risk">
          <ExposureRiskOverview />
        </div>
      </ScrollReveal>

      {/* Closing statement */}
      <motion.section
        className="py-16 px-8 bg-gradient-to-br from-rose-900 to-rose-800 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl font-serif font-light leading-relaxed mb-6">
            This Intelligence Brief is updated quarterly and reflects our ongoing analysis
            of your preferences, behaviors, and life stage transitions.
          </p>
          <p className="text-base font-sans text-rose-200 leading-relaxed">
            For questions about any insights presented here, please reach out to your
            relationship manager. We&apos;re here to ensure every journey aligns with your
            evolving narrative.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
