/**
 * Intent Profile Page (INTN-07, INTN-09)
 * Shows Intent Profile if exists, otherwise shows cinematic empty state with CTA to wizard
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { IntentProfileView } from '@/components/b2c/intent/IntentProfileView';
import { IntentProfile } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/constants/imagery';
import { ParallaxSection } from '@/components/ui/ParallaxSection';

export default function IntentPage() {
  const services = useServices();
  const { user: currentUser } = useCurrentUser();
  const [profile, setProfile] = useState<IntentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const intentProfile = await services.intent.getIntentProfile(currentUser.id);
        setProfile(intentProfile);
      } catch (error) {
        console.error('Failed to load intent profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, services.intent]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-3xl bg-sand-100 animate-pulse h-[340px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-sand-100 animate-pulse h-[300px]" />
          <div className="rounded-2xl bg-sand-100 animate-pulse h-[300px]" />
        </div>
        <div className="rounded-2xl bg-sand-100 animate-pulse h-[400px]" />
      </div>
    );
  }

  if (!profile) {
    // Cinematic empty state — full-bleed
    return (
      <div
        className="min-h-screen bg-sand-50 -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8"
        style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        {/* Full-bleed cinematic hero */}
        <ParallaxSection
          imageUrl={IMAGES.heroVenice}
          className="min-h-[80vh] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-2xl mx-auto text-center px-6"
          >
            <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-8" />
            <p className="text-amber-300/70 text-[10px] font-sans uppercase tracking-[5px] mb-6">
              Your Emotional Travel DNA
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[0.9] tracking-[-0.02em] mb-6">
              Begin your journey<br />of self-discovery.
            </h1>

            <p className="text-white/50 font-sans text-sm sm:text-base leading-[1.7] mb-10 max-w-lg mx-auto tracking-wide">
              Through a brief private consultation, we capture the emotional landscape
              that will shape every experience curated for you.
            </p>

            <Link
              href="/intent/wizard"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-rose-900 font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-amber-50 transition-all shadow-2xl"
            >
              Begin Your Intent
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-white/30 font-sans text-[11px] mt-8 tracking-wide">
              A private, 5-minute experience &middot; Your responses shape everything
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Bottom editorial strip */}
        <div className="bg-sand-50 border-t border-sand-200/60 py-20 sm:py-28 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 text-center">
            {[
              {
                num: '01',
                title: 'Share your moment',
                desc: 'Where you are in life, what moves you, and what you seek from your next experience.',
                accent: 'text-rose-300',
              },
              {
                num: '02',
                title: 'We compose your DNA',
                desc: 'Our intelligence distils your emotional drivers into a unique profile that guides every recommendation.',
                accent: 'text-amber-400',
              },
              {
                num: '03',
                title: 'Experiences find you',
                desc: 'Journeys aligned to your inner landscape appear — curated, private, and extraordinary.',
                accent: 'text-teal-400',
              },
            ].map((step) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: parseInt(step.num) * 0.15 }}
              >
                <span className={`font-serif text-4xl ${step.accent}`}>{step.num}</span>
                <h3 className="font-serif text-xl text-stone-900 mt-3 mb-3">{step.title}</h3>
                <p className="text-stone-400 text-sm font-sans leading-[1.7] tracking-wide">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Profile exists — full-bleed so hero extends behind nav
  return (
    <div
      className="bg-sand-50 -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8"
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <IntentProfileView profile={profile} />
      </motion.div>
    </div>
  );
}
