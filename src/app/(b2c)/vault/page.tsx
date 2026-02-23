'use client';

/**
 * Memory Vault — Private Journal
 * Deep burgundy/wine header (unique — like opening a leather-bound journal)
 * Timeline of memories with emotional tag filtering
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { MemoryTimeline } from '@/components/b2c/vault/MemoryTimeline';

import type { MemoryItem } from '@/lib/types/entities';

export default function VaultPage() {
  const services = useServices();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMemories() {
      setIsLoading(true);
      try {
        const data = await services.memory.getMemories(MOCK_UHNI_USER_ID);
        if (!cancelled) setMemories(data);
      } catch (error) {
        console.error('Failed to fetch memories:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMemories();
    return () => { cancelled = true; };
  }, [services]);

  return (
    <div
      className="min-h-screen bg-[#f6f4f1] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden"
      style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ BURGUNDY JOURNAL HEADER ═══════ */}
      <div className="relative bg-gradient-to-br from-[#2d1b1e] via-[#3d2024] to-[#2a1518] overflow-hidden">
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Warm glow accents */}
        <div className="absolute top-0 right-1/3 w-[500px] h-[400px] bg-rose-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-amber-500/[0.03] rounded-full blur-[100px] translate-y-1/3" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 pt-28 sm:pt-36 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <BookOpen size={15} className="text-rose-300/50" />
              </div>
              <p className="text-rose-300/30 text-[10px] font-sans uppercase tracking-[5px]">
                Private Repository
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl sm:text-6xl text-white leading-[1] tracking-[-0.03em] mb-5"
          >
            Memory Vault
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <p className="text-white/20 font-sans text-sm max-w-md leading-[1.8] tracking-wide">
              Your private memoir of moments that matter — preserved with
              emotional context and shared entirely on your terms.
            </p>

            <Link
              href="/vault/new"
              className="flex items-center gap-2.5 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/15 text-white font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-white/15 transition-all flex-shrink-0"
            >
              <Plus size={14} />
              Create Memory
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ═══════ TIMELINE ═══════ */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-14">
        <MemoryTimeline memories={memories} isLoading={isLoading} />
      </div>
    </div>
  );
}
