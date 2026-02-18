'use client';

/**
 * MFA Verification Page
 * Shown to MFA-enabled users during login
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { MFAVerify } from '@/components/auth/MFAVerify';
import { fadeUp } from '@/styles/variants/scroll-reveal';

export default function VerifyMFAPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/invite');
    }
  }, [status, router]);

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
          <h1 className="font-serif text-lg text-charcoal-900">Elan Glimmora</h1>
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
              Verify Your Identity
            </h1>
            <p className="text-base text-charcoal-600 max-w-lg mx-auto">
              Your account has two-factor authentication enabled.
              Enter the code from your authenticator app to continue.
            </p>
          </div>

          {/* MFA Verify Component */}
          <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-8 md:p-12">
            <MFAVerify />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
