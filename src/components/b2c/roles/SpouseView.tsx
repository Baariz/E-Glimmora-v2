'use client';

/**
 * Spouse View Wrapper (ROLE-02)
 * Restricted view for Spouse role
 * - Filters journeys and memories via b2c-role-filters
 * - View only, no edit/delete/create
 * - Banner indicating spouse access
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface SpouseViewProps {
  children: ReactNode;
  uhniName?: string;
}

export function SpouseView({ children, uhniName = 'your partner' }: SpouseViewProps) {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Spouse Role Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-600 to-teal-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5" />
            <p className="font-medium">
              You are viewing {uhniName}&apos;s shared experiences as their Spouse
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content - filtered by role */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>

      {/* View-Only Notice */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-teal-200 p-4 max-w-sm">
        <p className="text-sm text-stone-600">
          <strong className="text-teal-700">Spouse Access:</strong> You can view shared journeys
          and memories. You cannot create, edit, or delete content.
        </p>
      </div>
    </div>
  );
}
