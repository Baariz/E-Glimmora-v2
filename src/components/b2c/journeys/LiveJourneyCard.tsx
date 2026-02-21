'use client';

/**
 * Live Journey Card — UHNI View
 * Shown when journey status = EXECUTED (actively travelling)
 * Calm, silent, reassuring — NO tracking data shown to UHNI
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function LiveJourneyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 rounded-2xl p-8 text-white text-center"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-white/60" />
          </div>
        </div>
      </div>

      <p className="text-rose-300 text-xs font-sans uppercase tracking-widest mb-2">Live Experience</p>
      <h3 className="font-serif text-2xl text-white mb-3">Your journey is underway.</h3>
      <p className="text-rose-200 font-sans text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        Your Élan team is quietly present. Everything is attended to. You need only experience.
      </p>

      <Link
        href="/messages"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-sans text-sm font-medium transition-colors"
      >
        <MessageCircle size={16} />
        One message is all it takes
      </Link>
    </motion.div>
  );
}
