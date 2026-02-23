'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser, MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { EmotionalPhaseCard } from '@/components/b2c/briefing/EmotionalPhaseCard';
import { BalanceSummary } from '@/components/b2c/briefing/BalanceSummary';
import { IMAGES } from '@/lib/constants/imagery';
import type { IntentProfile, Journey } from '@/lib/types/entities';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};
const lineDraw = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

export default function BriefingPage() {
  const { user } = useCurrentUser();
  const services = useServices();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const [intentProfile, setIntentProfile] = useState<IntentProfile | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [profile, userJourneys] = await Promise.all([
          services.intent.getIntentProfile(MOCK_UHNI_USER_ID),
          services.journey.getJourneys(MOCK_UHNI_USER_ID, 'b2c'),
        ]);
        if (cancelled) return;
        setIntentProfile(profile);
        setJourneys(userJourneys);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [services]);

  const firstName = user.name.split(' ')[0];
  const initials = user.name.split(' ').map(n => n[0]).join('');
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const upcomingJourneys = journeys.filter(j => j.status !== 'ARCHIVED').slice(0, 3);

  return (
    <div
      className="min-h-screen bg-sand-50 -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8"
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >

      {/* ═══════════════════════════════ CINEMATIC HERO ═══ */}
      <div ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-[-12%]"
          aria-hidden
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${IMAGES.heroRiviera})` }}
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        {/* Content — vertically centered, left-aligned */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto"
        >
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            {/* Monogram + date */}
            <motion.div variants={fadeIn} className="mb-10">
              <span className="text-white/35 text-[10px] font-sans uppercase tracking-[5px]">
                {today}
              </span>
            </motion.div>

            {/* Decorative line */}
            <motion.div variants={lineDraw} className="w-16 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-8 origin-left" />

            {/* Greeting */}
            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[0.88] tracking-[-0.02em] mb-6 max-w-4xl"
            >
              {getGreeting()},
              <br />
              <span className="text-amber-200/90">{firstName}</span>.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-sans text-sm sm:text-base text-white/40 max-w-lg leading-[1.7] mb-10 tracking-wide"
            >
              Your sovereign briefing is ready. Every detail curated by your Elan team,
              presented for your review.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-10">
              <div className="flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 text-white/60 text-[11px] font-sans px-4 py-2 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {journeys.filter(j => j.status === 'EXECUTED').length > 0 ? 'Journey Active' : 'All Clear'}
              </div>
              <div className="flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 text-white/60 text-[11px] font-sans px-4 py-2 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {journeys.filter(j => !['ARCHIVED', 'EXECUTED'].includes(j.status)).length} in progress
              </div>
              <div className="flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 text-white/60 text-[11px] font-sans px-4 py-2 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                Discretion · High
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5">
              <Link
                href="/journeys"
                className="group inline-flex items-center gap-3 bg-white text-rose-900 font-sans text-[13px] font-semibold tracking-wide px-8 py-3.5 rounded-full hover:bg-amber-50 transition-all shadow-2xl"
              >
                Explore Journeys
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/messages"
                className="group inline-flex items-center gap-2 text-white/50 font-sans text-[13px] tracking-wide hover:text-white transition-colors"
              >
                Contact Advisor
                <span className="w-4 h-px bg-white/30 group-hover:w-6 group-hover:bg-white transition-all" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════════════════ EMOTIONAL LANDSCAPE ═══ */}
      <div className="bg-sand-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-28 sm:py-36">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 sm:mb-20"
          >
            <div className="w-10 h-px bg-rose-300 mb-6" />
            <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
              Your State
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[0.95]">
              Emotional landscape.
            </h2>
          </motion.div>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3"
            >
              <EmotionalPhaseCard intentProfile={intentProfile} isLoading={isLoading} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2"
            >
              <BalanceSummary intentProfile={intentProfile} isLoading={isLoading} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ SOVEREIGN STATUS ═══ */}
      <div className="bg-stone-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <div className="w-8 h-px bg-amber-400/40 mb-5" />
            <p className="text-white/30 text-[10px] font-sans uppercase tracking-[5px]">
              Your Standing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
            {/* Risk */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              className="px-0 sm:pr-10 pb-10 sm:pb-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </div>
                <p className="text-white/30 text-[10px] font-sans uppercase tracking-[4px]">Risk Status</p>
              </div>
              <h3 className="font-serif text-3xl text-white mb-3">All Clear.</h3>
              <p className="text-white/30 text-[12px] font-sans leading-[1.8] tracking-wide">
                All privacy protocols are active. Your discretion shield is fully engaged.
              </p>
            </motion.div>

            {/* Discretion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="px-0 sm:px-10 py-10 sm:py-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-400/60 text-sm">{'\u25C8'}</span>
                <p className="text-white/30 text-[10px] font-sans uppercase tracking-[4px]">Discretion</p>
              </div>
              <h3 className="font-serif text-3xl text-white mb-3">Maximum.</h3>
              <p className="text-white/30 text-[12px] font-sans leading-[1.8] tracking-wide">
                Invisible itineraries active. Maximum privacy protection engaged across all touchpoints.
              </p>
            </motion.div>

            {/* Advisor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="px-0 sm:pl-10 pt-10 sm:pt-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400/60" />
                <p className="text-white/30 text-[10px] font-sans uppercase tracking-[4px]">Your Advisor</p>
              </div>
              <h3 className="font-serif text-3xl text-white mb-3">Available.</h3>
              <p className="text-white/30 text-[12px] font-sans leading-[1.8] tracking-wide mb-5">
                Your personal advisor is ready. One message is all it takes.
              </p>
              <Link
                href="/messages"
                className="group inline-flex items-center gap-2 text-white/40 text-[11px] font-sans tracking-wide hover:text-white transition-colors"
              >
                Send a message
                <span className="w-4 h-px bg-white/20 group-hover:w-6 group-hover:bg-white/60 transition-all" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ PHOTOGRAPHY DIVIDER ═══ */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.heroMaldives})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        <div className="relative z-10 h-full flex items-end px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={lineDraw} className="w-10 h-px bg-amber-400/60 mb-6 origin-left" />
            <motion.p variants={fadeUp} className="text-white/40 text-[10px] font-sans uppercase tracking-[5px] mb-3">
              Your Collection
            </motion.p>
            <motion.h3 variants={fadeUp} className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-[0.95] mb-5 max-w-lg">
              {upcomingJourneys.length > 0
                ? `${upcomingJourneys.length} journeys in motion.`
                : 'Your journeys await.'}
            </motion.h3>
            <motion.div variants={fadeUp}>
              <Link
                href="/journeys"
                className="group inline-flex items-center gap-2 text-white/50 text-[13px] font-sans tracking-wide hover:text-white transition-colors"
              >
                View all journeys
                <span className="w-4 h-px bg-white/30 group-hover:w-6 group-hover:bg-white transition-all" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════ UPCOMING JOURNEYS ═══ */}
      {upcomingJourneys.length > 0 && (
        <div className="bg-sand-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-28 sm:py-36">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16"
            >
              <div className="w-10 h-px bg-rose-300 mb-6" />
              <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
                In Motion
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[0.95]">
                Upcoming journeys.
              </h2>
            </motion.div>

            <div className="divide-y divide-stone-200/60">
              {upcomingJourneys.map((journey, i) => (
                <motion.div
                  key={journey.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/journeys/${journey.id}`} className="group block py-8 sm:py-10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
                      {/* Number */}
                      <span className="font-serif text-5xl sm:text-6xl text-stone-200 group-hover:text-rose-200 transition-colors duration-500 flex-shrink-0 w-20">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-[10px] font-sans uppercase tracking-[3px] text-stone-400">
                            {journey.category}
                          </span>
                          <span className="text-[10px] text-rose-500 font-sans font-medium tracking-wide uppercase">
                            {journey.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-serif text-2xl sm:text-3xl text-stone-800 group-hover:text-rose-800 transition-colors duration-300 truncate">
                          {journey.title}
                        </h4>
                        <p className="text-stone-400 text-sm mt-2 line-clamp-1 font-sans tracking-wide">
                          {journey.narrative}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full border border-stone-200 group-hover:border-rose-300 flex items-center justify-center transition-all duration-500 group-hover:bg-rose-50">
                        <ArrowRight size={16} className="text-stone-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ FOOTER CTA ═══ */}
      <div className="relative py-36 sm:py-44 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGES.heroSuite})` }}
        />
        <div className="absolute inset-0 bg-black/55" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        >
          <motion.div variants={lineDraw} className="w-12 h-px bg-amber-400/50 mx-auto mb-8 origin-center" />
          <motion.p variants={fadeUp} className="text-amber-300/50 text-[10px] font-sans uppercase tracking-[6px] mb-6">
            Begin
          </motion.p>
          <motion.h3 variants={fadeUp} className="font-serif text-4xl sm:text-5xl text-white leading-[0.95] mb-6">
            Ready for your next<br />experience?
          </motion.h3>
          <motion.p variants={fadeUp} className="text-white/40 font-sans text-sm mb-12 leading-[1.8] tracking-wide max-w-sm mx-auto">
            Tell us what you seek. Our intelligence will craft something extraordinary.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/intent"
              className="group inline-flex items-center gap-3 bg-white text-rose-900 font-sans text-[13px] font-semibold tracking-wide px-10 py-4 rounded-full hover:bg-rose-50 transition-all shadow-2xl"
            >
              Begin Your Intent
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
