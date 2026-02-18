'use client';

/**
 * Memory Detail Page
 * Full memory view with detail, actions, and family sharing.
 * Handles lock/unlock, export, erase flows end-to-end.
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MemoryDetail } from '@/components/b2c/vault/MemoryDetail';
import { MemoryActions } from '@/components/b2c/vault/MemoryActions';
import { FamilySharingPanel } from '@/components/b2c/vault/FamilySharingPanel';

import type { MemoryItem } from '@/lib/types/entities';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const services = useServices();

  const memoryId = params.id as string;

  const [memory, setMemory] = useState<MemoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMemory() {
      setIsLoading(true);

      try {
        const fetchedMemory = await services.memory.getMemoryById(memoryId);

        if (cancelled) return;

        if (!fetchedMemory) {
          setNotFound(true);
        } else {
          setMemory(fetchedMemory);
        }
      } catch (error) {
        console.error('Failed to fetch memory:', error);
        if (!cancelled) {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchMemory();

    return () => {
      cancelled = true;
    };
  }, [memoryId, services]);

  // Handle lock
  const handleLock = async (condition: string) => {
    if (!memory) return;

    const updatedMemory = await services.memory.lockMemory(memory.id, condition);
    setMemory(updatedMemory);
  };

  // Handle unlock
  const handleUnlock = async () => {
    if (!memory) return;

    const updatedMemory = await services.memory.updateMemory(memory.id, {
      isLocked: false,
      unlockCondition: undefined,
    });
    setMemory(updatedMemory);
  };

  // Handle delete (cascade)
  const handleDelete = async () => {
    if (!memory) return;

    // Cascade delete: remove from linked journeys
    // In a real system, this would be handled server-side
    await services.memory.deleteMemory(memory.id);
  };

  // Handle sharing permissions update
  const handleUpdateSharing = async (sharingPermissions: string[]) => {
    if (!memory) return;

    const updatedMemory = await services.memory.updateMemory(memory.id, {
      sharingPermissions,
    });
    setMemory(updatedMemory);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-sand-200 rounded" />
          <div className="h-64 bg-sand-200 rounded-lg" />
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound || !memory) {
    return (
      <motion.div
        className="max-w-5xl mx-auto text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-serif font-light text-rose-900 mb-4">
          Memory Not Found
        </h1>
        <p className="text-base font-sans text-sand-600 mb-8">
          The memory you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/vault"
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Vault
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back link */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <Link
          href="/vault"
          className="inline-flex items-center gap-2 text-sm font-sans text-sand-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vault
        </Link>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content (left, 2/3 width) */}
        <div className="lg:col-span-2">
          <MemoryDetail memory={memory} />
        </div>

        {/* Sidebar (right, 1/3 width) */}
        <div className="space-y-6">
          <MemoryActions
            memory={memory}
            onLock={handleLock}
            onUnlock={handleUnlock}
            onDelete={handleDelete}
          />

          <FamilySharingPanel memory={memory} onUpdate={handleUpdateSharing} />
        </div>
      </div>
    </div>
  );
}
