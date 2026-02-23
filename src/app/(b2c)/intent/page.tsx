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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

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
        <Skeleton height={300} borderRadius={24} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton height={300} borderRadius={16} />
          <Skeleton height={300} borderRadius={16} />
        </div>
        <Skeleton height={400} borderRadius={16} />
      </div>
    );
  }

  if (!profile) {
    // Cinematic empty state
    return (
      <div className="min-h-screen bg-stone-50">
        {/* Full-bleed cinematic hero */}
        <div
          className="relative min-h-[75vh] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-2xl mx-auto text-center px-6"
          >
            <p className="text-amber-300 text-xs font-sans font-semibold uppercase tracking-[4px] mb-6">
              Your Emotional Travel DNA
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-6">
              Begin your journey of self-discovery.
            </h1>

            <p className="text-white/70 font-sans text-lg sm:text-xl leading-relaxed mb-10 max-w-lg mx-auto">
              Through a brief private consultation, we capture the emotional landscape
              that will shape every experience curated for you.
            </p>

            <Link
              href="/intent/wizard"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-rose-900 font-sans text-sm font-semibold rounded-full hover:bg-rose-50 transition-all shadow-xl hover:shadow-2xl"
            >
              Begin Your Intent
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-white/40 font-sans text-sm mt-8">
              A private, 5-minute experience &middot; Your responses shape everything
            </p>
          </motion.div>
        </div>

        {/* Bottom editorial strip */}
        <div className="bg-white border-t border-stone-100 py-16 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
                <span className="font-serif text-rose-700 text-lg">1</span>
              </div>
              <h3 className="font-serif text-lg text-stone-900 mb-2">Share your moment</h3>
              <p className="text-stone-500 text-sm font-sans leading-relaxed">
                Where you are in life, what moves you, and what you seek from your next experience.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                <span className="font-serif text-amber-700 text-lg">2</span>
              </div>
              <h3 className="font-serif text-lg text-stone-900 mb-2">We compose your DNA</h3>
              <p className="text-stone-500 text-sm font-sans leading-relaxed">
                Our intelligence distils your emotional drivers into a unique profile that guides every recommendation.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center">
                <span className="font-serif text-teal-700 text-lg">3</span>
              </div>
              <h3 className="font-serif text-lg text-stone-900 mb-2">Experiences find you</h3>
              <p className="text-stone-500 text-sm font-sans leading-relaxed">
                Journeys aligned to your inner landscape appear — curated, private, and extraordinary.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile exists - show full view
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      <IntentProfileView profile={profile} />
    </motion.div>
  );
}
