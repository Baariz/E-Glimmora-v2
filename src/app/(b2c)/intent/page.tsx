/**
 * Intent Profile Page (INTN-07, INTN-09)
 * Shows Intent Profile if exists, otherwise shows empty state with CTA to wizard
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { IntentProfileView } from '@/components/b2c/intent/IntentProfileView';
import { IntentProfile } from '@/lib/types';
import { Sparkles, ArrowRight } from 'lucide-react';
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
        <Skeleton height={60} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton height={300} />
          <Skeleton height={300} />
        </div>
        <Skeleton height={400} />
      </div>
    );
  }

  if (!profile) {
    // Empty state - no intent profile yet
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100">
            <Sparkles className="w-10 h-10 text-rose-600" />
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900">
              Begin Your Journey of Self-Discovery
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Your Intent Profile is the foundation of personalized recommendations. Through a brief
              consultation, we&apos;ll capture your emotional landscape, values, and preferences to create your
              unique Emotional Travel DNA.
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/intent/wizard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-rose-600 text-white font-medium text-lg hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="pt-8 text-sm text-stone-500">
            Takes approximately 5 minutes
          </div>
        </motion.div>
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
