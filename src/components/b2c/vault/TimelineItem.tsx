'use client';

/**
 * Timeline Item
 * Individual memory card in chronological timeline.
 * Shows date, milestone indicator, emotional tags, lock/share status.
 * Click navigates to detail page.
 */

import { format } from 'date-fns';
import Link from 'next/link';
import type { MemoryItem } from '@/lib/types/entities';
import {
  FileText,
  Image,
  Video,
  StickyNote,
  Music,
  Lock,
  Users,
  Star,
  ArrowRight,
} from 'lucide-react';

interface TimelineItemProps {
  memory: MemoryItem;
}

const typeIcons = {
  Document: FileText,
  Photo: Image,
  Video: Video,
  Note: StickyNote,
  Audio: Music,
};

export function TimelineItem({ memory }: TimelineItemProps) {
  const TypeIcon = typeIcons[memory.type];
  const hasSharing = memory.sharingPermissions.length > 0;

  return (
    <Link href={`/vault/${memory.id}`} className="block group">
      <div className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-stone-300/80 transition-all duration-300">
        {/* Header: Date + Type */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
              <TypeIcon size={14} className="text-stone-400" />
            </div>
            <time className="text-[10px] font-sans uppercase tracking-[3px] text-stone-400">
              {format(new Date(memory.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2">
            {memory.isMilestone && (
              <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center">
                <Star size={11} className="text-rose-400 fill-rose-400" />
              </div>
            )}
            {memory.isLocked && (
              <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">
                <Lock size={11} className="text-amber-500" />
              </div>
            )}
            {hasSharing && (
              <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                <Users size={11} className="text-stone-400" />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl text-stone-900 mb-2 group-hover:text-[#3d2024] transition-colors leading-snug">
          {memory.title}
        </h3>

        {/* Description excerpt */}
        {memory.description && (
          <p className="text-sm font-sans text-stone-500 mb-4 line-clamp-2 leading-[1.7] tracking-wide">
            {memory.description}
          </p>
        )}

        {/* Emotional tags + arrow */}
        <div className="flex items-end justify-between gap-4">
          {memory.emotionalTags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {memory.emotionalTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-rose-50 text-rose-600/80 text-[11px] font-sans tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div />
          )}

          <ArrowRight
            size={14}
            className="text-stone-300 group-hover:text-stone-500 group-hover:translate-x-1 transition-all flex-shrink-0"
          />
        </div>
      </div>
    </Link>
  );
}
