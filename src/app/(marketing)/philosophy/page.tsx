'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal'
import { fadeUp } from '@/styles/variants/scroll-reveal'

/**
 * Philosophy page - Editorial brand identity content
 *
 * Communicates Elan Glimmora's approach to wealth, experience, and sovereignty
 * through long-form editorial prose. NOT a features page.
 *
 * Structure:
 * - Hero: "Intelligence, Not Information"
 * - Section 1: The Paradox of Abundance (the problem)
 * - Section 2: Emotional Architecture (our approach)
 * - Section 3: Sovereignty as a Right (privacy principles)
 *
 * Design: Luxury editorial magazine article with generous whitespace
 */
export default function PhilosophyPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="h-[60vh] flex items-center justify-center bg-sand-50 px-6">
        <ScrollReveal variant={fadeUp} className="text-center space-y-6 max-w-4xl">
          {/* Eyebrow */}
          <p className="font-sans text-xs tracking-[0.3em] text-sand-400 uppercase">
            Our Philosophy
          </p>

          {/* Main heading */}
          <h1 className="font-serif text-5xl md:text-6xl text-rose-900">
            Intelligence, Not Information
          </h1>

          {/* Subheading */}
          <p className="font-sans text-lg md:text-xl text-olive-600 max-w-2xl mx-auto leading-relaxed">
            A different way of thinking about wealth, experience, and sovereignty
          </p>
        </ScrollReveal>
      </section>

      {/* Content Section 1: The Problem */}
      <section className="min-h-[50vh] flex items-center bg-white px-6 md:px-12 py-20 md:py-32">
        <ScrollReveal variant={fadeUp} className="max-w-2xl mx-auto space-y-8">
          {/* Heading */}
          <h2 className="font-serif text-3xl md:text-4xl text-rose-900">
            The Paradox of Abundance
          </h2>

          {/* Body */}
          <div className="space-y-6 font-sans text-lg text-olive-700 leading-relaxed">
            <p>
              Ultra high net worth individuals have access to everything — except clarity. The more
              resources available, the more noise obscures what truly matters.
            </p>
            <p>
              Traditional wealth management platforms treat life as a spreadsheet. We believe it is a
              narrative — one that deserves emotional intelligence, not just data intelligence.
            </p>
            <p>
              Every transaction has a story. Every investment reflects a value. Every decision reveals
              what moves you. Yet the industry remains fixated on returns, blind to the emotional
              architecture that shapes every choice.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Content Section 2: Our Approach */}
      <section className="min-h-[50vh] flex items-center bg-sand-50 px-6 md:px-12 py-20 md:py-32">
        <ScrollReveal variant={fadeUp} delay={0.1} className="max-w-2xl mx-auto space-y-8">
          {/* Heading */}
          <h2 className="font-serif text-3xl md:text-4xl text-rose-900">
            Emotional Architecture
          </h2>

          {/* Body */}
          <div className="space-y-6 font-sans text-lg text-olive-700 leading-relaxed">
            <p>
              Every interaction with Élan Glimmora begins with understanding — not your assets, but
              your aspirations. Not your schedule, but your soul.
            </p>
            <p>
              We call this <em className="font-serif">Emotional Architecture</em>: the art of designing
              experiences that align with your deepest values, respect your sovereignty, and evolve
              with your journey.
            </p>
            <p>
              Through a combination of human intelligence and algorithmic precision, we identify
              patterns invisible to traditional analysis. We surface opportunities that resonate with
              your philosophy, not just your portfolio. We curate experiences that feel intuitive,
              because they emerge from who you are — not who the system thinks you should be.
            </p>
          </div>

          {/* Decorative separator */}
          <div className="w-16 h-px bg-rose-200 mx-auto my-12" aria-hidden="true" />
        </ScrollReveal>
      </section>

      {/* Content Section 3: Sovereignty */}
      <section className="min-h-[50vh] flex items-center bg-white px-6 md:px-12 py-20 md:py-32">
        <ScrollReveal variant={fadeUp} delay={0.2} className="max-w-2xl mx-auto space-y-8">
          {/* Heading */}
          <h2 className="font-serif text-3xl md:text-4xl text-rose-900">
            Sovereignty as a Right
          </h2>

          {/* Body */}
          <div className="space-y-6 font-sans text-lg text-olive-700 leading-relaxed">
            <p>
              In a world where data is the new currency, we believe your data belongs to you —
              absolutely and without compromise.
            </p>
            <p>
              Élan Glimmora is built on the principle that privacy is not a feature to be toggled. It
              is a right to be honored. Every piece of information you share is governed by your
              explicit consent. Every interaction is designed with sovereignty in mind.
            </p>
            <p>
              We do not track you for advertising. We do not sell your information. We do not build
              profiles for third parties. Your visibility settings are yours to control — from your
              advisor to your spouse to your heir. Every data point has permissions that you govern.
            </p>
          </div>

          {/* CTA to Privacy Charter */}
          <div className="pt-8 border-t border-sand-200">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 font-sans text-sm text-rose-900 hover:text-rose-700 transition-colors border-b border-rose-200 hover:border-rose-900 pb-1"
            >
              Read Our Privacy Charter
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Closing CTA Section */}
      <section className="min-h-[40vh] flex items-center justify-center bg-sand-50 px-6 py-20">
        <ScrollReveal variant={fadeUp} className="text-center space-y-8 max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl text-rose-900">
            Experience the Difference
          </h2>
          <p className="font-sans text-lg text-olive-600">
            Join the world&apos;s most discerning individuals in experiencing life through a sovereign
            lens.
          </p>
          <div className="pt-4">
            <Link
              href="/invite"
              className="inline-flex items-center gap-2 font-sans text-base text-white bg-rose-900 hover:bg-rose-800 px-8 py-3 rounded-md transition-colors shadow-lg hover:shadow-xl"
            >
              Request Access
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
