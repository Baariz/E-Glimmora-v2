'use client';

/**
 * Memory Form (VALT-08, VALT-09)
 * Create and edit memory entries.
 * React Hook Form + Zod validation.
 * Fields: title, description, type, emotional tags (max 5), isMilestone, file upload.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import type { MemoryItem, MemoryType } from '@/lib/types/entities';
import { EMOTIONAL_TAGS } from './EmotionalTagFilter';
import { CloudUpload, X } from 'lucide-react';

const MemoryFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  type: z.enum(['Document', 'Photo', 'Video', 'Note', 'Audio']),
  emotionalTags: z.array(z.string()).max(5, 'Maximum 5 emotional tags'),
  isMilestone: z.boolean(),
});

type MemoryFormData = z.infer<typeof MemoryFormSchema>;

interface MemoryFormProps {
  initialData?: MemoryItem;
  onSubmit: (data: MemoryFormData & { fileUrl?: string }) => Promise<void>;
  onCancel?: () => void;
}

const MEMORY_TYPES: { value: MemoryType; label: string }[] = [
  { value: 'Note', label: 'Note' },
  { value: 'Document', label: 'Document' },
  { value: 'Photo', label: 'Photo' },
  { value: 'Video', label: 'Video' },
  { value: 'Audio', label: 'Audio' },
];

export function MemoryForm({ initialData, onSubmit, onCancel }: MemoryFormProps) {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MemoryFormData>({
    resolver: zodResolver(MemoryFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'Note',
      emotionalTags: initialData?.emotionalTags || [],
      isMilestone: initialData?.isMilestone || false,
    },
  });

  const [uploadedFile, setUploadedFile] = useState<string | null>(
    initialData?.fileUrl || null
  );

  const emotionalTags = watch('emotionalTags');

  // File upload dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov'],
      'audio/*': ['.mp3', '.wav'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0 && acceptedFiles[0]) {
        // Mock file URL for development
        const mockUrl = `https://cdn.elan.private/memories/${Date.now()}-${acceptedFiles[0].name}`;
        setUploadedFile(mockUrl);
      }
    },
  });

  const handleToggleTag = (tag: string) => {
    const current = emotionalTags || [];
    if (current.includes(tag)) {
      setValue('emotionalTags', current.filter((t) => t !== tag));
    } else if (current.length < 5) {
      setValue('emotionalTags', [...current, tag]);
    }
  };

  const handleFormSubmit = async (data: MemoryFormData) => {
    await onSubmit({
      ...data,
      fileUrl: uploadedFile || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-sans text-sand-700 mb-2">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-serif text-lg"
          placeholder="A title for this memory"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-rose-600">{errors.title.message}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-sans text-sand-700 mb-2">
          Type <span className="text-rose-500">*</span>
        </label>
        <select
          id="type"
          {...register('type')}
          className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-sans"
        >
          {MEMORY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-sans text-sand-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-sand-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition font-sans resize-none"
          placeholder="Describe this memory..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-rose-600">{errors.description.message}</p>
        )}
      </div>

      {/* Emotional Tags */}
      <div>
        <label className="block text-sm font-sans text-sand-700 mb-3">
          Emotional Tags (max 5)
        </label>
        <div className="flex flex-wrap gap-2">
          {EMOTIONAL_TAGS.map((tag) => {
            const isSelected = emotionalTags.includes(tag);
            const isDisabled = !isSelected && emotionalTags.length >= 5;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTag(tag)}
                disabled={isDisabled}
                className={`
                  px-4 py-2 rounded-full font-sans text-sm transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-teal-600 text-white ring-2 ring-teal-300'
                      : isDisabled
                      ? 'bg-sand-100 text-sand-400 cursor-not-allowed'
                      : 'bg-sand-100 text-sand-700 hover:bg-sand-200 hover:text-sand-900'
                  }
                `}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {errors.emotionalTags && (
          <p className="mt-2 text-sm text-rose-600">{errors.emotionalTags.message}</p>
        )}
      </div>

      {/* Milestone toggle */}
      <div className="flex items-start gap-3">
        <input
          id="isMilestone"
          type="checkbox"
          {...register('isMilestone')}
          className="mt-1 w-5 h-5 rounded border-sand-300 text-teal-600 focus:ring-teal-500"
        />
        <div>
          <label htmlFor="isMilestone" className="block text-sm font-sans text-sand-700 cursor-pointer">
            Mark as milestone
          </label>
          <p className="text-xs text-sand-500 mt-1">
            Milestones appear with special markers in your timeline
          </p>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-sans text-sand-700 mb-3">
          Attach file (optional)
        </label>

        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-sand-300 hover:border-teal-400 hover:bg-sand-50'
              }
            `}
          >
            <input {...getInputProps()} />
            <CloudUpload className="w-12 h-12 text-sand-400 mx-auto mb-3" />
            <p className="text-sm font-sans text-sand-600">
              {isDragActive
                ? 'Drop file here...'
                : 'Drag and drop a file, or click to browse'}
            </p>
            <p className="text-xs text-sand-400 mt-2">
              Supports images, videos, audio, and PDFs
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200">
            <span className="text-sm font-sans text-teal-700 truncate">{uploadedFile}</span>
            <button
              type="button"
              onClick={() => setUploadedFile(null)}
              className="ml-4 p-1 text-teal-600 hover:text-teal-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg font-sans text-sm hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Memory' : 'Create Memory'}
        </motion.button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-sand-600 rounded-lg font-sans text-sm hover:text-sand-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
