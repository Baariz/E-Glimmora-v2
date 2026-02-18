'use client';

/**
 * Access Restricted Component
 * Shown when a role tries to access a resource they don't have permission for
 * Styled message, NOT redirect
 */

import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface AccessRestrictedProps {
  message?: string;
  role?: string;
}

export function AccessRestricted({
  message = 'You do not have permission to access this resource.',
  role
}: AccessRestrictedProps) {
  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg border border-rose-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        </div>
        <h2 className="font-serif text-2xl text-stone-900 mb-2">
          Access Restricted
        </h2>
        <p className="text-stone-600 mb-4">
          {message}
        </p>
        {role && (
          <p className="text-sm text-stone-500 bg-stone-50 rounded-lg px-4 py-2">
            Your current role: <strong>{role}</strong>
          </p>
        )}
      </motion.div>
    </div>
  );
}
