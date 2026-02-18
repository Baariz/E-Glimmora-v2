'use client';

/**
 * Memory Timeline (VALT-01)
 * Chronological vertical timeline of memories.
 * Sorts by createdAt, groups by month/year, integrates emotional tag filter.
 * Pagination with "Load more" to avoid rendering all items.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import type { MemoryItem } from '@/lib/types/entities';
import { TimelineItem } from './TimelineItem';
import { EmotionalTagFilter } from './EmotionalTagFilter';

interface MemoryTimelineProps {
  memories: MemoryItem[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MemoryTimeline({ memories, isLoading }: MemoryTimelineProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on filter change
  };

  // Filter and sort memories
  const filteredMemories = useMemo(() => {
    let filtered = memories;

    // Apply emotional tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((m) =>
        m.emotionalTags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Sort chronologically (most recent first)
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [memories, selectedTags]);

  const visibleMemories = filteredMemories.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMemories.length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-sand-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center py-16"
      >
        <p className="text-lg font-serif text-sand-500 mb-4">
          Your memory vault is empty
        </p>
        <p className="text-sm font-sans text-sand-400">
          Create your first memory to begin building your personal repository.
        </p>
      </motion.div>
    );
  }

  // Group memories by month/year for section headers
  const groupedMemories: { period: string; memories: MemoryItem[] }[] = [];
  let currentPeriod = '';

  visibleMemories.forEach((memory) => {
    const period = format(parseISO(memory.createdAt), 'MMMM yyyy');
    if (period !== currentPeriod) {
      currentPeriod = period;
      groupedMemories.push({ period, memories: [memory] });
    } else {
      const lastGroup = groupedMemories[groupedMemories.length - 1];
      if (lastGroup) {
        lastGroup.memories.push(memory);
      }
    }
  });

  return (
    <div>
      {/* Emotional tag filter */}
      <div className="mb-8">
        <h3 className="text-sm font-sans text-sand-500 uppercase tracking-wide mb-4">
          Filter by emotion
        </h3>
        <EmotionalTagFilter
          selectedTags={selectedTags}
          onToggle={handleToggleTag}
        />
      </div>

      {/* Timeline */}
      {filteredMemories.length === 0 ? (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center py-16"
        >
          <p className="text-lg font-serif text-sand-500">
            No memories match your selected filters
          </p>
        </motion.div>
      ) : (
        <div className="space-y-0">
          {groupedMemories.map((group, groupIdx) => (
            <div key={groupIdx}>
              {/* Month/year section header */}
              <h2 className="text-2xl font-serif text-rose-900 mb-6 mt-8 first:mt-0">
                {group.period}
              </h2>

              {/* Memories in this period */}
              {group.memories.map((memory) => (
                <TimelineItem key={memory.id} memory={memory} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasMore && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mt-8"
        >
          <button
            onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-sans text-sm hover:bg-teal-700 transition-colors"
          >
            Load more memories
          </button>
        </motion.div>
      )}
    </div>
  );
}
