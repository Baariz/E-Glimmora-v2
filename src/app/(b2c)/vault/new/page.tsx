'use client';

/**
 * Create/Edit Memory Page
 * Full-bleed burgundy header, refined form in white card.
 * Handles both create and edit flows via query param.
 */

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Feather } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { MemoryForm } from '@/components/b2c/vault/MemoryForm';

import type { MemoryItem } from '@/lib/types/entities';

function NewMemoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const services = useServices();

  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const [existingMemory, setExistingMemory] = useState<MemoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (!editId) return;

    let cancelled = false;

    async function fetchMemory() {
      setIsLoading(true);

      try {
        const memory = await services.memory.getMemoryById(editId as string);

        if (!cancelled) {
          if (memory) {
            setExistingMemory(memory);
          } else {
            router.push('/vault');
          }
        }
      } catch (error) {
        console.error('Failed to fetch memory:', error);
        if (!cancelled) {
          router.push('/vault');
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
  }, [editId, services, router]);

  const handleSubmit = async (data: any) => {
    try {
      if (isEditMode && existingMemory) {
        await services.memory.updateMemory(existingMemory.id, {
          title: data.title,
          description: data.description,
          type: data.type,
          emotionalTags: data.emotionalTags,
          isMilestone: data.isMilestone,
          fileUrl: data.fileUrl,
        });
      } else {
        await services.memory.createMemory({
          userId: MOCK_UHNI_USER_ID,
          title: data.title,
          description: data.description,
          type: data.type,
        });

        const memories = await services.memory.getMemories(MOCK_UHNI_USER_ID);
        const newMemory = memories[memories.length - 1];

        if (newMemory) {
          await services.memory.updateMemory(newMemory.id, {
            emotionalTags: data.emotionalTags,
            isMilestone: data.isMilestone,
            fileUrl: data.fileUrl,
          });
        }
      }

      router.push('/vault');
    } catch (error) {
      console.error('Failed to save memory:', error);
    }
  };

  const handleCancel = () => {
    router.push('/vault');
  };

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
          <p className="text-stone-400 text-[11px] font-sans tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f6f4f1] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden"
      style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ BURGUNDY HEADER ═══════ */}
      <div className="relative bg-gradient-to-br from-[#2d1b1e] via-[#3d2024] to-[#2a1518] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 right-1/3 w-[400px] h-[300px] bg-rose-500/[0.04] rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-12 lg:px-16 pt-28 sm:pt-36 pb-14 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={() => router.push('/vault')}
              className="flex items-center gap-2 text-white/40 text-[11px] font-sans tracking-wide hover:text-white/60 transition-colors mb-6"
            >
              <ArrowLeft size={12} />
              Memory Vault
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                <Feather size={14} className="text-rose-300/50" />
              </div>
              <p className="text-rose-300/30 text-[10px] font-sans uppercase tracking-[5px]">
                {isEditMode ? 'Edit Entry' : 'New Entry'}
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl text-white leading-[1] tracking-[-0.03em] mb-4"
          >
            {isEditMode ? 'Edit Memory' : 'Create Memory'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/20 font-sans text-sm max-w-md leading-[1.8] tracking-wide"
          >
            {isEditMode
              ? 'Update the details of this memory.'
              : 'Capture a moment, thought, or experience for your private repository.'}
          </motion.p>
        </div>
      </div>

      {/* ═══════ FORM ═══════ */}
      <div className="max-w-3xl mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white border border-stone-200/60 rounded-2xl p-7 sm:p-10 shadow-sm"
        >
          <MemoryForm
            initialData={existingMemory || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function NewMemoryPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <NewMemoryContent />
    </Suspense>
  );
}
