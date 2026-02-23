'use client';

/**
 * Live Journey Card — UHNI View
 * Shown when journey status = EXECUTED (actively travelling)
 * Cinematic aerial photo with live indicator
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { IMAGES } from '@/lib/constants/imagery';

export function LiveJourneyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[340px] flex items-end bg-cover bg-center shadow-sm"
      style={{ backgroundImage: `url(${IMAGES.heroAerial})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Pulsing live indicator */}
      <div className="absolute top-5 right-5 flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1.5">
        <div className="relative w-2 h-2">
          <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
          <div className="relative rounded-full bg-emerald-400 w-2 h-2" />
        </div>
        <span className="text-white/80 text-[10px] font-sans font-medium uppercase tracking-[3px]">
          Live
        </span>
      </div>

      <div className="relative z-10 px-7 sm:px-10 py-8 sm:py-10 w-full">
        <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
        <p className="text-amber-300/60 text-[10px] font-sans uppercase tracking-[5px] mb-3">
          Your Journey &middot; In Progress
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-white leading-[0.95] tracking-[-0.02em] mb-4">
          Your journey is underway.
        </h2>
        <p className="text-white/50 font-sans text-sm leading-[1.7] tracking-wide mb-7 max-w-md">
          Everything has been arranged. One message is all it takes if you need anything.
        </p>
        <Link
          href="/messages"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-rose-900 font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-amber-50 transition-all shadow-lg"
        >
          <MessageCircle className="w-4 h-4" />
          Message Your Advisor
          <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}
