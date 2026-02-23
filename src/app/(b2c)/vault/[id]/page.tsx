'use client';

/**
 * Memory Detail Page — Full-Bleed Journal Entry
 * Burgundy compact header with back link, two-column editorial layout.
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, BookOpen } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MemoryDetail } from '@/components/b2c/vault/MemoryDetail';
import { MemoryActions } from '@/components/b2c/vault/MemoryActions';
import { FamilySharingPanel } from '@/components/b2c/vault/FamilySharingPanel';

import type { MemoryItem } from '@/lib/types/entities';

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

  const handleLock = async (condition: string) => {
    if (!memory) return;
    const updatedMemory = await services.memory.lockMemory(memory.id, condition);
    setMemory(updatedMemory);
  };

  const handleUnlock = async () => {
    if (!memory) return;
    const updatedMemory = await services.memory.updateMemory(memory.id, {
      isLocked: false,
      unlockCondition: undefined,
    });
    setMemory(updatedMemory);
  };

  const handleDelete = async () => {
    if (!memory) return;
    await services.memory.deleteMemory(memory.id);
  };

  const handleUpdateSharing = async (sharingPermissions: string[]) => {
    if (!memory) return;
    const updatedMemory = await services.memory.updateMemory(memory.id, {
      sharingPermissions,
    });
    setMemory(updatedMemory);
  };

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-[#f6f4f1] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden flex items-center justify-center"
        style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-8 h-8 border-2 border-stone-300 border-t-[#3d2024] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-stone-400 text-[11px] font-sans tracking-wide">Opening memory...</p>
        </div>
      </div>
    );
  }

  /* ─── Not found ─── */
  if (notFound || !memory) {
    return (
      <div
        className="min-h-screen bg-[#f6f4f1] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden flex items-center justify-center"
        style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      >
        <motion.div
          className="bg-white border border-stone-200/60 rounded-2xl p-10 sm:p-14 text-center shadow-sm max-w-md mx-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="font-serif text-2xl text-stone-900 mb-3">
            Memory Not Found
          </h2>
          <p className="text-stone-400 text-sm font-sans leading-[1.7] tracking-wide mb-7">
            The memory you&apos;re looking for doesn&apos;t exist or has been removed
            from your vault.
          </p>
          <Link
            href="/vault"
            className="inline-flex items-center gap-2.5 px-7 py-3 bg-stone-900 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-stone-800 transition-all"
          >
            <ArrowLeft size={13} />
            Back to Vault
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f6f4f1] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden"
      style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ COMPACT BURGUNDY HEADER ═══════ */}
      <div className="bg-gradient-to-r from-[#2d1b1e] via-[#3d2024] to-[#2a1518] pt-24 sm:pt-28 pb-6">
        <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16">
          <button
            onClick={() => router.push('/vault')}
            className="flex items-center gap-2 text-white/40 text-[11px] font-sans tracking-wide hover:text-white/60 transition-colors mb-3"
          >
            <ArrowLeft size={12} />
            Memory Vault
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <BookOpen size={13} className="text-rose-300/50" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white leading-snug line-clamp-1">
              {memory.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ═══════ CONTENT ═══════ */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-8 sm:py-12">
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
    </div>
  );
}
