'use client';

/**
 * Advisor View Wrapper (ROLE-04)
 * Contextual collaboration view for Elan Advisors
 * - Filtered journeys (respecting granular per-journey permissions)
 * - Messages (only their threads)
 * - Intelligence (conditional based on advisorResourcePermissions)
 * - Cannot confirm/refine/archive journeys
 * - Banner indicating advisor context
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Shield } from 'lucide-react';

interface AdvisorViewProps {
  children: ReactNode;
  uhniName?: string;
  advisorName?: string;
}

export function AdvisorView({
  children,
  uhniName = 'the client',
  advisorName = 'Advisor'
}: AdvisorViewProps) {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Advisor Role Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-rose-700 to-rose-800 text-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5" />
              <p className="font-medium">
                Advisor View — {uhniName}&apos;s Profile
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4" />
              <span>Limited Access</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content - filtered by advisor permissions */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>

      {/* Advisor Context Notice */}
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-rose-200 p-4 max-w-sm">
        <p className="text-sm text-stone-600">
          <strong className="text-rose-700">Advisor Access:</strong> You can view journeys
          within your scope, send messages, and access granted intelligence. Journey actions
          (confirm, refine, archive) are restricted.
        </p>
      </div>
    </div>
  );
}
