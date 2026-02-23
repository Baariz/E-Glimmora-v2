'use client';

/**
 * Live Journey Card — UHNI View
 * Shown when journey status = EXECUTED (actively travelling)
 * Cinematic aerial photo with live indicator
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function LiveJourneyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[320px] flex items-end bg-cover bg-center"
      style={{ backgroundImage: `url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Pulsing live indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <div className="relative w-2.5 h-2.5">
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          <div className="relative rounded-full bg-emerald-400 w-2.5 h-2.5" />
        </div>
        <span className="text-white/80 text-xs font-sans font-medium uppercase tracking-wider">
          Live
        </span>
      </div>

      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-10 w-full">
        <p className="text-amber-300 text-xs font-sans uppercase tracking-widest mb-3">
          Your Journey &middot; In Progress
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">
          Your journey is underway.
        </h2>
        <p className="text-white/70 font-sans text-base mb-6 max-w-lg">
          Everything has been arranged. One message is all it takes if you need anything.
        </p>
        <Link
          href="/messages"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-900 font-sans text-sm font-semibold rounded-full hover:bg-rose-50 transition-all"
        >
          Message your Advisor <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
