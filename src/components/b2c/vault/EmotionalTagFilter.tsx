'use client';

/**
 * Emotional Tag Filter (VALT-02)
 * Predefined emotional taxonomy for filtering memories.
 * Pill-shaped toggle buttons — luxury journal aesthetic.
 */

import { cn } from '@/lib/utils/cn';

export const EMOTIONAL_TAGS = [
  'Joy',
  'Growth',
  'Peace',
  'Connection',
  'Achievement',
  'Gratitude',
  'Wonder',
  'Renewal',
  'Legacy',
  'Love',
] as const;

export type EmotionalTag = typeof EMOTIONAL_TAGS[number];

interface EmotionalTagFilterProps {
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

export function EmotionalTagFilter({ selectedTags, onToggle }: EmotionalTagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {EMOTIONAL_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag);

        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={cn(
              'px-4 py-2 rounded-full font-sans text-[12px] tracking-wide transition-all duration-200',
              isSelected
                ? 'bg-[#3d2024] text-rose-100 shadow-sm'
                : 'bg-white border border-stone-200/60 text-stone-500 hover:border-stone-300 hover:text-stone-700'
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
