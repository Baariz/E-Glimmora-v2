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
import { BookOpen } from 'lucide-react';
import type { MemoryItem } from '@/lib/types/entities';
import { TimelineItem } from './TimelineItem';
import { EmotionalTagFilter } from './EmotionalTagFilter';

interface MemoryTimelineProps {
  memories: MemoryItem[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

export function MemoryTimeline({ memories, isLoading }: MemoryTimelineProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const filteredMemories = useMemo(() => {
    let filtered = memories;

    if (selectedTags.length > 0) {
      filtered = filtered.filter((m) =>
        m.emotionalTags.some((tag) => selectedTags.includes(tag))
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [memories, selectedTags]);

  const visibleMemories = filteredMemories.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMemories.length;

  /* ─── Loading skeleton ─── */
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-stone-200/60 rounded-2xl p-7 animate-pulse">
            <div className="h-3 w-24 bg-stone-200 rounded mb-4" />
            <div className="h-5 w-2/3 bg-stone-200 rounded mb-3" />
            <div className="h-3 w-full bg-stone-100 rounded mb-2" />
            <div className="h-3 w-4/5 bg-stone-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  /* ─── Empty state ─── */
  if (memories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-20"
      >
        <div className="w-16 h-16 rounded-full bg-white border border-stone-200/60 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <BookOpen size={22} className="text-rose-300/60" />
        </div>
        <h3 className="font-serif text-2xl text-stone-800 mb-3">
          Your vault is empty
        </h3>
        <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-sm mx-auto">
          Create your first memory to begin building your
          private repository of moments that matter.
        </p>
      </motion.div>
    );
  }

  /* ─── Group by month/year ─── */
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
      {/* ─── Emotional tag filter ─── */}
      <div className="mb-10">
        <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-4">
          Filter by emotion
        </p>
        <EmotionalTagFilter
          selectedTags={selectedTags}
          onToggle={handleToggleTag}
        />
      </div>

      {/* ─── Timeline ─── */}
      {filteredMemories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <p className="font-serif text-xl text-stone-500">
            No memories match your selected filters
          </p>
          <p className="text-stone-400 font-sans text-sm mt-2 tracking-wide">
            Try removing a filter to see more results.
          </p>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-stone-200/80 hidden sm:block" />

          {groupedMemories.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-10 last:mb-0">
              {/* Month/year section header */}
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-[31px] h-[31px] rounded-full bg-[#3d2024] border-[3px] border-[#f6f4f1] flex items-center justify-center flex-shrink-0 relative z-10 hidden sm:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                </div>
                <h2 className="font-serif text-2xl text-stone-800 tracking-[-0.01em]">
                  {group.period}
                </h2>
                <div className="flex-1 h-px bg-stone-200/60" />
              </div>

              {/* Memories in this period */}
              <div className="sm:pl-[47px] space-y-4">
                {group.memories.map((memory, memIdx) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: memIdx * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <TimelineItem memory={memory} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Load more ─── */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
            className="px-8 py-3.5 bg-stone-900 text-white font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-stone-800 transition-all shadow-sm"
          >
            Load more memories
          </button>
        </div>
      )}
    </div>
  );
}
