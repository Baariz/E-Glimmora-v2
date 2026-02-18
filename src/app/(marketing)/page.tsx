'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal'
import { Parallax } from '@/components/shared/Parallax/Parallax'
import { Button } from '@/components/shared/Button/Button'
import { fadeUp } from '@/styles/variants/scroll-reveal'

/**
 * Editorial homepage with cinematic parallax scroll storytelling
 *
 * Design direction: Luxury editorial magazine, NOT tech landing page
 * - Full-viewport sections with generous whitespace
 * - Typography-driven narrative experience
 * - Parallax creates depth and dimensionality
 * - Color blocks as visual placeholders (no photography yet)
 *
 * Sections:
 * 1. Hero with parallax (brand name, tagline, scroll indicator)
 * 2. Philosophy preview (quote-style editorial)
 * 3. Three Pillars (editorial blocks, not feature cards)
 * 4. Visual break (dark cinematic section)
 * 5. The Experience (two-column editorial description)
 * 6. Final CTA (invitation to begin journey)
 */
export default function MarketingHomePage() {
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)

  // Hero parallax using heroParallax config
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroY = useTransform(heroScroll, [0, 1], prefersReducedMotion ? [0, 0] : [0, -100])
  const heroOpacity = useTransform(heroScroll, [0, 0.5, 1], prefersReducedMotion ? [1, 1, 1] : [1, 0.5, 0])

  // Section 4 cinematic break parallax
  const { scrollYProgress: section4Scroll } = useScroll({
    target: section4Ref,
    offset: ['start end', 'end start'],
  })

  const section4Opacity = useTransform(section4Scroll, [0, 0.3, 0.7, 1], prefersReducedMotion ? [1, 1, 1, 1] : [0.8, 1, 1, 0.8])

  return (
    <div className="bg-white">
      {/* Section 1: Hero - Full viewport with parallax */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgb(254 252 243) 0%, rgb(255 255 255) 100%)',
        }}
      >
        <motion.div
          style={
            prefersReducedMotion
              ? {}
              : {
                  y: heroY,
                  opacity: heroOpacity,
                }
          }
          className="text-center space-y-8 px-4"
        >
          {/* Brand name */}
          <h1 className="font-serif font-light text-7xl md:text-8xl lg:text-9xl text-rose-900 tracking-tight">
            Élan Glimmora
          </h1>

          {/* Tagline */}
          <p className="font-sans text-lg md:text-xl text-sand-500 tracking-[0.3em] uppercase">
            Sovereign Lifestyle Intelligence
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [0, 12, 0],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown className="w-8 h-8 text-sand-400" strokeWidth={1} />
        </motion.div>
      </section>

      {/* Section 2: Philosophy Preview - Quote-style editorial */}
      <section className="min-h-screen flex items-center bg-sand-50 px-6 md:px-12 lg:px-20 py-20 md:py-32">
        <ScrollReveal variant={fadeUp} className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {/* Quote */}
            <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl leading-relaxed text-olive-800 max-w-4xl">
              For those who shape the future, privacy is not a feature — it is sovereignty.
            </blockquote>

            {/* Attribution */}
            <p className="font-sans text-xs tracking-widest uppercase text-sand-400">
              The Élan Philosophy
            </p>

            {/* CTA */}
            <div className="pt-8">
              <Link
                href="/philosophy"
                className="inline-flex items-center gap-2 font-sans text-sm text-rose-900 hover:text-rose-700 transition-colors border-b border-rose-200 hover:border-rose-900 pb-1"
              >
                Explore Our Philosophy
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Section 3: Three Pillars - Editorial blocks, not feature cards */}
      <section className="min-h-screen flex items-center bg-white px-6 md:px-12 lg:px-20 py-20 md:py-32">
        <div className="max-w-4xl mx-auto w-full space-y-16 md:space-y-24">
          {/* Pillar 1: Emotional Intelligence */}
          <ScrollReveal variant={fadeUp} delay={0}>
            <article className="space-y-4 border-t border-sand-200 pt-8">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                Emotional Intelligence
              </h2>
              <p className="font-sans text-lg text-olive-600 leading-relaxed max-w-3xl">
                We understand that wealth is emotional. Every journey begins with understanding
                what moves you — not your assets, but your aspirations. Not your schedule, but
                your soul.
              </p>
            </article>
          </ScrollReveal>

          {/* Pillar 2: Privacy Sovereignty */}
          <ScrollReveal variant={fadeUp} delay={0.15}>
            <article className="space-y-4 border-t border-sand-200 pt-8">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                Privacy Sovereignty
              </h2>
              <p className="font-sans text-lg text-olive-600 leading-relaxed max-w-3xl">
                Your data. Your rules. Every interaction is governed by your consent, visible only
                to those you choose. In a world where data is currency, your privacy is
                non-negotiable.
              </p>
            </article>
          </ScrollReveal>

          {/* Pillar 3: Narrative Experience */}
          <ScrollReveal variant={fadeUp} delay={0.3}>
            <article className="space-y-4 border-t border-sand-200 pt-8">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                Narrative Experience
              </h2>
              <p className="font-sans text-lg text-olive-600 leading-relaxed max-w-3xl">
                Life is not a dashboard. We craft experiences that read like chapters of your
                personal narrative — curated moments that align with your deepest values and
                evolve with your journey.
              </p>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 4: Visual Break - Dark cinematic section with opacity fade */}
      <section
        ref={section4Ref}
        className="relative h-[60vh] flex items-center justify-center bg-rose-950 px-6"
      >
        <motion.div
          style={{ opacity: section4Opacity }}
          className="text-center space-y-6"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-white">
            By invitation only
          </h2>
          <p className="font-sans text-base md:text-lg text-rose-300 max-w-2xl mx-auto">
            A membership as exclusive as the experiences we curate
          </p>
        </motion.div>
      </section>

      {/* Section 5: The Experience - Two-column editorial with scroll-reveal */}
      <section className="min-h-screen flex items-center bg-sand-50 px-6 md:px-12 lg:px-20 py-20 md:py-32">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column: Editorial content */}
            <ScrollReveal variant={fadeUp} delay={0} className="space-y-8">
              {/* Eyebrow */}
              <p className="font-sans text-xs tracking-widest text-sand-400 uppercase">
                The Experience
              </p>

              {/* Heading */}
              <h2 className="font-serif text-3xl md:text-4xl text-rose-900 leading-tight">
                Intelligence, Not Information
              </h2>

              {/* Body paragraphs */}
              <div className="space-y-6 font-sans text-lg text-olive-700 leading-relaxed">
                <p>
                  Élan Glimmora transforms how the world&apos;s most discerning individuals navigate
                  their extraordinary lives.
                </p>
                <p>
                  Through emotional intelligence algorithms and sovereign privacy architecture, we
                  curate journeys that align with your deepest values — not just your calendar.
                </p>
                <p>
                  Every interaction is designed as a narrative moment, because your life deserves
                  to be experienced, not managed.
                </p>
              </div>
            </ScrollReveal>

            {/* Right column: Visual placeholder */}
            <ScrollReveal variant={fadeUp} delay={0.2}>
              <div
                className="w-full aspect-[3/4] rounded-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgb(207 250 254) 0%, rgb(237 246 236) 100%)',
                }}
                aria-hidden="true"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA - Invitation to begin */}
      <section className="h-[80vh] flex items-center justify-center bg-white px-6">
        <ScrollReveal variant={fadeUp} className="text-center space-y-8 max-w-3xl">
          {/* Pre-heading */}
          <p className="font-sans text-xs tracking-[0.5em] text-sand-400 uppercase">
            Ready?
          </p>

          {/* Main heading */}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-rose-900 leading-tight">
            Begin Your Sovereign Journey
          </h2>

          {/* Description */}
          <p className="font-sans text-lg text-sand-600 max-w-2xl mx-auto">
            Enter your invitation code to experience Élan Glimmora.
          </p>

          {/* CTA button */}
          <div className="pt-4">
            <Link href="/invite">
              <Button
                size="lg"
                className="bg-rose-900 text-white hover:bg-rose-800 px-8 py-4 text-base shadow-lg hover:shadow-xl transition-all"
              >
                Request Access
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
