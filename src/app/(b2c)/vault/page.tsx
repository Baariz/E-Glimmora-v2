'use client';

/**
 * Memory Vault Page
 * The UHNI's private memory repository.
 * Chronological timeline with emotional context -- feels like a personal memoir.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { MemoryTimeline } from '@/components/b2c/vault/MemoryTimeline';

import type { MemoryItem } from '@/lib/types/entities';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

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

        if (!cancelled) {
          setMemories(data);
        }
      } catch (error) {
        console.error('Failed to fetch memories:', error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchMemories();

    return () => {
      cancelled = true;
    };
  }, [services]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero section */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-light text-rose-900 mb-4">
          Memory Vault
        </h1>
        <p className="text-lg font-sans text-sand-600 max-w-2xl mb-6">
          Your private repository of experiences. A personal memoir of moments that matter,
          preserved with emotional context and shared on your terms.
        </p>

        <Link href="/vault/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-sans text-sm hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Memory
          </motion.button>
        </Link>
      </motion.header>

      {/* Timeline */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <MemoryTimeline memories={memories} isLoading={isLoading} />
      </motion.div>
    </div>
  );
}
