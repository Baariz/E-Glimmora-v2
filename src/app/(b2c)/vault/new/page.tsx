'use client';

/**
 * Create/Edit Memory Page
 * Form for creating new memories or editing existing ones.
 * Handles both create and edit flows via query param.
 */

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { MemoryForm } from '@/components/b2c/vault/MemoryForm';

import type { MemoryItem } from '@/lib/types/entities';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

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

        // Update with additional fields
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
      <div className="max-w-3xl mx-auto">
        <div className="h-96 bg-sand-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Link
          href="/vault"
          className="inline-flex items-center gap-2 text-sm font-sans text-sand-600 hover:text-teal-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vault
        </Link>

        <h1 className="text-4xl md:text-5xl font-serif font-light text-rose-900 mb-4">
          {isEditMode ? 'Edit Memory' : 'Create Memory'}
        </h1>
        <p className="text-lg font-sans text-sand-600">
          {isEditMode
            ? 'Update the details of this memory'
            : 'Capture a moment, thought, or experience for your private repository'}
        </p>
      </motion.header>

      {/* Form */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg p-8 shadow-sm ring-1 ring-sand-200"
      >
        <MemoryForm
          initialData={existingMemory || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </motion.div>
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
