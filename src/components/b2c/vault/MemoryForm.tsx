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
import { CloudUpload, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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
  const isMilestone = watch('isMilestone');

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
        <label htmlFor="title" className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5">
          Title <span className="text-rose-400">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-serif text-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300 placeholder:text-stone-300 transition-all"
          placeholder="A title for this memory"
        />
        {errors.title && (
          <p className="mt-2 text-[12px] text-rose-500 font-sans tracking-wide">{errors.title.message}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5">
          Type <span className="text-rose-400">*</span>
        </label>
        <select
          id="type"
          {...register('type')}
          className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-sans text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300 appearance-none transition-all"
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
        <label htmlFor="description" className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={6}
          className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl font-sans text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300 resize-none leading-[1.7] tracking-wide placeholder:text-stone-300 transition-all"
          placeholder="Describe this memory..."
        />
        {errors.description && (
          <p className="mt-2 text-[12px] text-rose-500 font-sans tracking-wide">{errors.description.message}</p>
        )}
      </div>

      {/* Emotional Tags */}
      <div>
        <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-3">
          Emotional Tags <span className="text-stone-300 normal-case tracking-normal text-[11px]">(max 5)</span>
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
                className={cn(
                  'px-4 py-2 rounded-full font-sans text-[12px] tracking-wide transition-all duration-200',
                  isSelected
                    ? 'bg-[#3d2024] text-rose-100 shadow-sm'
                    : isDisabled
                    ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                    : 'bg-stone-50 border border-stone-200/60 text-stone-500 hover:border-stone-300 hover:text-stone-700'
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {errors.emotionalTags && (
          <p className="mt-2 text-[12px] text-rose-500 font-sans tracking-wide">{errors.emotionalTags.message}</p>
        )}
      </div>

      {/* Milestone toggle */}
      <button
        type="button"
        onClick={() => setValue('isMilestone', !isMilestone)}
        className={cn(
          'w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-left',
          isMilestone
            ? 'border-rose-200/60 bg-rose-50/50'
            : 'border-stone-200/60 hover:border-stone-300'
        )}
      >
        <div
          className={cn(
            'w-10 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0',
            isMilestone ? 'bg-[#3d2024]' : 'bg-stone-200'
          )}
        >
          <div
            className={cn(
              'w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
              isMilestone ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-sans font-medium text-stone-700 flex items-center gap-2">
            <Star size={13} className={isMilestone ? 'text-rose-400 fill-rose-400' : 'text-stone-400'} />
            Mark as milestone
          </p>
          <p className="text-[11px] font-sans text-stone-400 leading-[1.5] tracking-wide mt-0.5">
            Milestones appear with special markers in your timeline
          </p>
        </div>
      </button>

      {/* File Upload */}
      <div>
        <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-3">
          Attach file <span className="text-stone-300 normal-case tracking-normal text-[11px]">(optional)</span>
        </label>

        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all',
              isDragActive
                ? 'border-[#3d2024]/40 bg-rose-50/30'
                : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            )}
          >
            <input {...getInputProps()} />
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <CloudUpload size={20} className="text-stone-400" />
            </div>
            <p className="text-sm font-sans text-stone-600 tracking-wide">
              {isDragActive
                ? 'Drop file here...'
                : 'Drag and drop a file, or click to browse'}
            </p>
            <p className="text-[11px] text-stone-400 mt-2 tracking-wide">
              Supports images, videos, audio, and PDFs
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-4 bg-rose-50/50 rounded-xl border border-rose-200/60">
            <span className="text-sm font-sans text-stone-600 truncate">{uploadedFile}</span>
            <button
              type="button"
              onClick={() => setUploadedFile(null)}
              className="ml-4 w-7 h-7 rounded-full bg-white border border-stone-200/60 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-all flex-shrink-0"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'px-8 py-3.5 font-sans text-[13px] font-semibold tracking-wide rounded-full transition-all',
            isSubmitting
              ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
              : 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
          )}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Memory' : 'Create Memory'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 text-stone-500 font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-stone-100 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
