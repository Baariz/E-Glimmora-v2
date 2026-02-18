'use client';

/**
 * Emotional Tag Filter (VALT-02)
 * Predefined emotional taxonomy for filtering memories.
 * Pill-shaped toggle buttons -- luxury magazine aesthetic.
 */

import { motion } from 'framer-motion';

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
          <motion.button
            key={tag}
            onClick={() => onToggle(tag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-4 py-2 rounded-full font-sans text-sm transition-all duration-200
              ${
                isSelected
                  ? 'bg-teal-600 text-white ring-2 ring-teal-300'
                  : 'bg-sand-100 text-sand-700 hover:bg-sand-200 hover:text-sand-900'
              }
            `}
          >
            {tag}
          </motion.button>
        );
      })}
    </div>
  );
}
