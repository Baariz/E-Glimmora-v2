'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal'
import { Parallax } from '@/components/shared/Parallax/Parallax'
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
      {/* Section 1: Hero - Full viewport with parallax + luxury background + entry animation */}
      <section
        ref={heroRef}
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background image - luxury marble & gold interior */}
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
        />
        {/* Warm gradient overlay — shows image at edges, clean center for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/50 to-white/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40" />

        <motion.div
          style={
            prefersReducedMotion
              ? {}
              : {
                  y: heroY,
                  opacity: heroOpacity,
                }
          }
          className="relative z-10 text-center space-y-8 px-4"
        >
          {/* Top gold line — expands outward from center */}
          <motion.div
            initial={prefersReducedMotion ? {} : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent origin-center"
          />

          {/* Brand name — letter-by-letter stagger reveal */}
          <h1 className="font-serif font-light text-7xl md:text-8xl lg:text-9xl text-rose-900 tracking-tight flex items-center justify-center gap-[0.3em]">
            {['Élan', 'Glimmora'].map((word, wordIdx) => (
              <span key={word} className="inline-flex">
                {word.split('').map((char, charIdx) => (
                  <span key={`${word}-${charIdx}`} className="inline-block overflow-hidden">
                    <motion.span
                      initial={prefersReducedMotion ? {} : { y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.6 + wordIdx * 0.4 + charIdx * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Thin separator line between brand and tagline */}
          <motion.div
            initial={prefersReducedMotion ? {} : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.4 }}
            transition={{ duration: 1.2, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-12 h-[1px] bg-sand-400 origin-center"
          />

          {/* Tagline — each letter fades in individually */}
          <div className="flex flex-wrap items-center justify-center gap-x-[0.4em] gap-y-2">
            {['Sovereign', 'Lifestyle', 'Intelligence'].map((word, wordIdx) => (
              <span key={word} className="inline-flex">
                {word.split('').map((char, charIdx) => (
                  <motion.span
                    key={`tag-${word}-${charIdx}`}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 2.0 + wordIdx * 0.3 + charIdx * 0.03,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block font-sans text-sm sm:text-lg md:text-xl text-rose-900 tracking-[0.15em] sm:tracking-[0.3em] uppercase"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>

          {/* Bottom gold line — expands from center */}
          <motion.div
            initial={prefersReducedMotion ? {} : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent origin-center"
          />
        </motion.div>

        {/* Scroll indicator — fades in last */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  opacity: 1,
                  y: [0, 12, 0],
                }
          }
          transition={{
            opacity: { duration: 0.6, delay: 3.4 },
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 3.4 },
          }}
        >
          <ChevronDown className="w-8 h-8 text-sand-500" strokeWidth={1} />
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

      {/* Section 4: Visual Break - Dark cinematic section with luxury background */}
      <section
        ref={section4Ref}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background image - luxury overwater villa */}
        <Image
          src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-rose-950/75" />
        <motion.div
          style={{ opacity: section4Opacity }}
          className="relative z-10 text-center space-y-6"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-white">
            By invitation only
          </h2>
          <p className="font-sans text-base md:text-lg text-rose-200 max-w-2xl mx-auto">
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

            {/* Right column: Luxury travel image */}
            <ScrollReveal variant={fadeUp} delay={0.2}>
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80&auto=format&fit=crop"
                  alt="Luxury villa with infinity pool overlooking the ocean"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA - Invitation to begin */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background image - luxury yacht on calm waters */}
        <Image
          src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-white/90" />
        <ScrollReveal variant={fadeUp} className="relative z-10 text-center space-y-8 max-w-3xl px-6">
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
            <Link
              href="/invite"
              className="inline-flex items-center justify-center px-10 py-4 bg-rose-900 text-white font-sans font-medium text-base rounded-lg shadow-lg hover:bg-rose-800 hover:shadow-xl active:bg-rose-950 transition-all"
            >
              Request Access
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
