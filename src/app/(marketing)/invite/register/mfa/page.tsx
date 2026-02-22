'use client';

/**
 * MFA Setup Page
 * Optional MFA setup during user onboarding
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MFASetup } from '@/components/auth/MFASetup';
import { fadeUp } from '@/styles/variants/scroll-reveal';

export default function MFASetupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [inviteType, setInviteType] = useState<string | null>(null);

  // Check authentication and get invite type
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/invite');
      return;
    }

    // Get invite type from sessionStorage
    if (typeof window !== 'undefined') {
      const storedType = sessionStorage.getItem('inviteType') || 'b2c';
      setInviteType(storedType);
    }
  }, [status, router]);

  const handleComplete = () => {
    // Clear sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('validatedInviteCode');
      sessionStorage.removeItem('inviteType');
    }

    // Redirect based on invite type
    const destination = getDestinationRoute(inviteType || 'b2c');
    router.push(destination);
  };

  const handleSkip = () => {
    // Clear sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('validatedInviteCode');
      sessionStorage.removeItem('inviteType');
    }

    // Redirect based on invite type
    const destination = getDestinationRoute(inviteType || 'b2c');
    router.push(destination);
  };

  const getDestinationRoute = (type: string): string => {
    switch (type) {
      case 'b2b':
        return '/portfolio';
      case 'admin':
        return '/dashboard';
      default:
        return '/briefing';
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <p className="text-sm text-charcoal-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-sand-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Image src="/Logo/elan-glimmora.png" alt="Élan Glimmora" width={140} height={40} className="h-9 w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-charcoal-900 mb-4">
              Secure Your Account
            </h1>
            <p className="text-base text-charcoal-600 max-w-lg mx-auto">
              Two-factor authentication adds an extra layer of security to your account.
              We recommend enabling it to protect your sensitive information.
            </p>
          </div>

          {/* MFA Setup Component */}
          <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-8 md:p-12">
            <MFASetup onComplete={handleComplete} />
          </div>

          {/* Skip Option */}
          <div className="text-center mt-6">
            <button
              onClick={handleSkip}
              className="text-sm text-charcoal-600 hover:text-charcoal-900 underline transition-colors"
            >
              Set up later
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
