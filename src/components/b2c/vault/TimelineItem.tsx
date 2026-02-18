'use client';

/**
 * Timeline Item
 * Individual memory card in chronological timeline.
 * Shows date, milestone indicator, emotional tags, lock/share status.
 * Click navigates to detail page.
 */

import { motion } from 'framer-motion';
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
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative pl-8 pb-8 border-l-2 border-sand-200 group-hover:border-teal-400 transition-colors"
      >
        {/* Timeline dot */}
        <div
          className={`absolute left-0 top-0 -ml-[9px] w-4 h-4 rounded-full border-2 transition-colors ${
            memory.isMilestone
              ? 'bg-rose-500 border-rose-300'
              : 'bg-white border-sand-300 group-hover:border-teal-400'
          }`}
        />

        {/* Milestone star */}
        {memory.isMilestone && (
          <Star className="absolute left-0 top-6 -ml-[7px] w-3 h-3 text-rose-500 fill-rose-500" />
        )}

        {/* Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm ring-1 ring-sand-200 group-hover:ring-teal-300 transition-all">
          {/* Header: Date + Type Icon */}
          <div className="flex items-center justify-between mb-3">
            <time className="text-xs font-sans text-sand-500 uppercase tracking-wide">
              {format(new Date(memory.createdAt), 'MMMM d, yyyy')}
            </time>
            <TypeIcon className="w-5 h-5 text-sand-400" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-serif text-rose-900 mb-2 group-hover:text-teal-700 transition-colors">
            {memory.title}
          </h3>

          {/* Description excerpt */}
          {memory.description && (
            <p className="text-sm font-sans text-sand-600 mb-4 line-clamp-2">
              {memory.description}
            </p>
          )}

          {/* Emotional tags */}
          {memory.emotionalTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {memory.emotionalTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-sans"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Status indicators */}
          <div className="flex items-center gap-3 text-xs text-sand-500">
            {memory.isLocked && (
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span>Locked</span>
              </div>
            )}
            {hasSharing && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Shared</span>
              </div>
            )}
            {memory.isMilestone && (
              <div className="flex items-center gap-1 text-rose-500">
                <Star className="w-4 h-4" />
                <span>Milestone</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
