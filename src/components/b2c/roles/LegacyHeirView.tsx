'use client';

/**
 * Legacy Heir View Wrapper (ROLE-03)
 * View-only wrapper for Legacy Heir role
 * - Even more restricted than Spouse
 * - Only shared content visible
 * - Sepia-tinted styling for legacy feel
 * - Banner indicating heir access
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface LegacyHeirViewProps {
  children: ReactNode;
  uhniName?: string;
}

export function LegacyHeirView({ children, uhniName = 'the principal' }: LegacyHeirViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-amber-50">
      {/* Legacy Heir Role Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sand-700 to-amber-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5" />
            <p className="font-medium">
              You are viewing shared memories as Legacy Heir
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content - filtered by role, sepia styling */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="sepia-[0.15] saturate-90">
          {children}
        </div>
      </div>

      {/* View-Only Notice */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-sand-300 p-4 max-w-sm sepia-[0.15]">
        <p className="text-sm text-stone-600">
          <strong className="text-sand-800">Legacy Heir Access:</strong> You have read-only access
          to shared journeys and memories. This content has been preserved for you.
        </p>
      </div>
    </div>
  );
}
