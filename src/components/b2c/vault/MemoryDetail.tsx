'use client';

/**
 * Memory Detail
 * Full memory view with editorial typography, emotional tags, milestone badge,
 * linked journeys, file preview, lock/sharing status.
 */

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { MemoryItem } from '@/lib/types/entities';
import { Lock, Users, Star, FileText, Image, Video, StickyNote, Music } from 'lucide-react';

interface MemoryDetailProps {
  memory: MemoryItem;
}

const typeIcons = {
  Document: FileText,
  Photo: Image,
  Video: Video,
  Note: StickyNote,
  Audio: Music,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MemoryDetail({ memory }: MemoryDetailProps) {
  const TypeIcon = typeIcons[memory.type];
  const hasSharing = memory.sharingPermissions.length > 0;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <header className="border-b border-sand-200 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <TypeIcon className="w-6 h-6 text-sand-400" />
            <span className="text-sm font-sans text-sand-500 uppercase tracking-wide">
              {memory.type}
            </span>
          </div>

          <time className="text-sm font-sans text-sand-500">
            {format(new Date(memory.createdAt), 'MMMM d, yyyy')}
          </time>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-light text-rose-900 mb-4">
          {memory.title}
        </h1>

        {/* Status badges */}
        <div className="flex items-center gap-4">
          {memory.isMilestone && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700">
              <Star className="w-4 h-4 fill-rose-700" />
              <span className="text-xs font-sans font-medium">Milestone</span>
            </div>
          )}

          {memory.isLocked && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-sans font-medium">Locked</span>
            </div>
          )}

          {hasSharing && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700">
              <Users className="w-4 h-4" />
              <span className="text-xs font-sans font-medium">
                Shared with {memory.sharingPermissions.length} {memory.sharingPermissions.length === 1 ? 'person' : 'people'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Description */}
      {memory.description && (
        <div className="prose prose-lg max-w-none">
          <p className="font-serif text-sand-700 leading-relaxed whitespace-pre-wrap">
            {memory.description}
          </p>
        </div>
      )}

      {/* Emotional Tags */}
      {memory.emotionalTags.length > 0 && (
        <div>
          <h3 className="text-sm font-sans text-sand-500 uppercase tracking-wide mb-3">
            Emotional Context
          </h3>
          <div className="flex flex-wrap gap-2">
            {memory.emotionalTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-sans"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* File Preview */}
      {memory.fileUrl && (
        <div>
          <h3 className="text-sm font-sans text-sand-500 uppercase tracking-wide mb-3">
            Attached File
          </h3>
          <div className="rounded-lg border border-sand-200 p-6 bg-sand-50">
            {memory.type === 'Photo' && memory.thumbnailUrl ? (
              <img
                src={memory.thumbnailUrl}
                alt={memory.title}
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <div className="flex items-center gap-3">
                <TypeIcon className="w-6 h-6 text-sand-400" />
                <a
                  href={memory.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-teal-600 hover:text-teal-800 underline"
                >
                  {memory.fileUrl.split('/').pop()}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Linked Journeys */}
      {memory.linkedJourneys.length > 0 && (
        <div>
          <h3 className="text-sm font-sans text-sand-500 uppercase tracking-wide mb-3">
            Linked Journeys
          </h3>
          <div className="space-y-2">
            {memory.linkedJourneys.map((journeyId) => (
              <Link
                key={journeyId}
                href={`/journeys/${journeyId}`}
                className="block px-4 py-3 rounded-lg border border-sand-200 hover:border-teal-400 hover:bg-teal-50 transition-colors"
              >
                <span className="text-sm font-sans text-sand-700 hover:text-teal-700">
                  Journey {journeyId.slice(0, 8)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lock Condition */}
      {memory.isLocked && memory.unlockCondition && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-sm font-sans text-amber-900 font-medium mb-2">
            Unlock Condition
          </h3>
          <p className="text-sm font-sans text-amber-700">
            {memory.unlockCondition}
          </p>
        </div>
      )}
    </motion.div>
  );
}
