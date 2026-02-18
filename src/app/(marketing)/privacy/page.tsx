'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal'
import { fadeUp } from '@/styles/variants/scroll-reveal'

/**
 * Privacy Charter page - Plain-language privacy commitment
 *
 * NOT a legal document designed to obscure. A promise written in plain language
 * about how we treat user information.
 *
 * Structure:
 * - Hero (dark, serious, trustworthy): "Your Sovereignty, Our Promise"
 * - Preamble: This is a promise, not a legal document
 * - 6 Privacy Principles presented as editorial content
 * - Closing CTA
 *
 * Design: Editorial luxury with trust-building dark hero
 */
export default function PrivacyCharterPage() {
  return (
    <div className="bg-white">
      {/* Hero Section - Dark for seriousness and trust */}
      <section className="h-[60vh] flex items-center justify-center bg-rose-950 px-6">
        <ScrollReveal variant={fadeUp} className="text-center space-y-6 max-w-4xl">
          {/* Eyebrow */}
          <p className="font-sans text-xs tracking-[0.3em] text-rose-300 uppercase">
            Privacy Charter
          </p>

          {/* Main heading */}
          <h1 className="font-serif text-5xl md:text-6xl text-white">
            Your Sovereignty, Our Promise
          </h1>

          {/* Subheading */}
          <p className="font-sans text-lg md:text-xl text-rose-200 max-w-2xl mx-auto leading-relaxed">
            How we protect what matters most — your privacy
          </p>
        </ScrollReveal>
      </section>

      {/* Preamble */}
      <section className="bg-white px-6 md:px-12 py-20 md:py-32">
        <ScrollReveal variant={fadeUp} className="max-w-2xl mx-auto">
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-olive-700 italic">
            This is not a legal document designed to obscure. This is a promise, written in plain
            language, about how we treat your information.
          </p>
        </ScrollReveal>
      </section>

      {/* Privacy Principles - Editorial format, not bullet points */}
      <section className="bg-white px-6 md:px-12 pb-20 md:pb-32">
        <div className="max-w-2xl mx-auto space-y-16 md:space-y-24">
          {/* Principle 1 */}
          <ScrollReveal variant={fadeUp} delay={0}>
            <article className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                Your Data Belongs to You
              </h2>
              <p className="font-sans text-lg text-olive-700 leading-relaxed">
                Every piece of information you provide to Élan Glimmora remains your property. We are
                custodians, not owners. You have the right to access, modify, or delete your data at
                any time. No exceptions.
              </p>
            </article>
          </ScrollReveal>

          {/* Principle 2 */}
          <ScrollReveal variant={fadeUp} delay={0.1}>
            <article className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                Consent is Explicit, Never Assumed
              </h2>
              <p className="font-sans text-lg text-olive-700 leading-relaxed">
                We will never share, analyze, or process your data without your explicit, informed
                consent. No pre-checked boxes. No buried opt-outs. Every permission is requested
                clearly and granted consciously.
              </p>
            </article>
          </ScrollReveal>

          {/* Principle 3 */}
          <ScrollReveal variant={fadeUp} delay={0.2}>
            <article className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                Visibility is Your Choice
              </h2>
              <p className="font-sans text-lg text-olive-700 leading-relaxed">
                You decide who sees what. From your advisor to your spouse to your heir — every data
                point has visibility controls that you govern. Granular permissions ensure that
                information is shared only with those you explicitly authorize.
              </p>
            </article>
          </ScrollReveal>

          {/* Principle 4 */}
          <ScrollReveal variant={fadeUp} delay={0.3}>
            <article className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                The Right to Disappear
              </h2>
              <p className="font-sans text-lg text-olive-700 leading-relaxed">
                You can erase your entire presence from Élan Glimmora at any time. Global erase is
                permanent, complete, and immediate. No remnants. No backups. No &ldquo;deactivated but
                retained&rdquo; loopholes. When you leave, you truly leave.
              </p>
            </article>
          </ScrollReveal>

          {/* Principle 5 */}
          <ScrollReveal variant={fadeUp} delay={0.4}>
            <article className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                No Surveillance, No Tracking
              </h2>
              <p className="font-sans text-lg text-olive-700 leading-relaxed">
                We do not track your behavior for advertising. We do not sell your data. We do not
                build profiles for third parties. Élan Glimmora exists to serve you — not to monetize
                your attention or mine your habits for external gain.
              </p>
            </article>
          </ScrollReveal>

          {/* Principle 6 */}
          <ScrollReveal variant={fadeUp} delay={0.5}>
            <article className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
                Security Without Compromise
              </h2>
              <p className="font-sans text-lg text-olive-700 leading-relaxed">
                Multi-factor authentication, device recognition, and encrypted storage protect your
                information at every layer. We employ industry-leading security practices — not as a
                checkbox, but as a fundamental responsibility to the trust you place in us.
              </p>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* Closing Section */}
      <section className="bg-sand-50 px-6 py-20 md:py-32">
        <ScrollReveal variant={fadeUp} className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-2xl md:text-3xl text-rose-900">
            Questions about our privacy practices?
          </h2>
          <p className="font-sans text-base md:text-lg text-olive-600">
            Contact your dedicated advisor or reach out to our privacy team. Transparency is not a
            policy — it&apos;s our commitment.
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
