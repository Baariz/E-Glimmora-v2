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
import { Lock, Users, Star, FileText, Image, Video, StickyNote, Music, ExternalLink } from 'lucide-react';

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

export function MemoryDetail({ memory }: MemoryDetailProps) {
  const TypeIcon = typeIcons[memory.type];
  const hasSharing = memory.sharingPermissions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* ─── Header card ─── */}
      <div className="bg-white border border-stone-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
              <TypeIcon size={15} className="text-stone-400" />
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400">
                {memory.type}
              </p>
              <time className="text-[11px] font-sans text-stone-400 tracking-wide">
                {format(new Date(memory.createdAt), 'MMMM d, yyyy')}
              </time>
            </div>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-5 leading-[1.15] tracking-[-0.02em]">
          {memory.title}
        </h1>

        {/* Status badges */}
        <div className="flex items-center gap-3 flex-wrap">
          {memory.isMilestone && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/60">
              <Star size={12} className="text-rose-400 fill-rose-400" />
              <span className="text-[11px] font-sans font-medium text-rose-600 tracking-wide">Milestone</span>
            </div>
          )}

          {memory.isLocked && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/60">
              <Lock size={12} className="text-amber-500" />
              <span className="text-[11px] font-sans font-medium text-amber-700 tracking-wide">Locked</span>
            </div>
          )}

          {hasSharing && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-50 border border-stone-200/60">
              <Users size={12} className="text-stone-400" />
              <span className="text-[11px] font-sans font-medium text-stone-500 tracking-wide">
                Shared with {memory.sharingPermissions.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Description ─── */}
      {memory.description && (
        <div className="bg-white border border-stone-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
          <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-4">
            Description
          </p>
          <p className="font-serif text-lg text-stone-700 leading-[1.8] whitespace-pre-wrap">
            {memory.description}
          </p>
        </div>
      )}

      {/* ─── Emotional Tags ─── */}
      {memory.emotionalTags.length > 0 && (
        <div className="bg-white border border-stone-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
          <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-4">
            Emotional Context
          </p>
          <div className="flex flex-wrap gap-2">
            {memory.emotionalTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-rose-50 text-rose-600/80 text-[12px] font-sans tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ─── File Preview ─── */}
      {memory.fileUrl && (
        <div className="bg-white border border-stone-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
          <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-4">
            Attached File
          </p>
          <div className="rounded-xl border border-stone-200/60 overflow-hidden bg-stone-50">
            {memory.type === 'Photo' && memory.thumbnailUrl ? (
              <img
                src={memory.thumbnailUrl}
                alt={memory.title}
                className="max-w-full h-auto"
              />
            ) : (
              <div className="flex items-center gap-3 p-5">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                  <TypeIcon size={16} className="text-stone-400" />
                </div>
                <a
                  href={memory.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-[#3d2024] hover:text-rose-700 transition-colors flex items-center gap-2"
                >
                  {memory.fileUrl.split('/').pop()}
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Linked Journeys ─── */}
      {memory.linkedJourneys.length > 0 && (
        <div className="bg-white border border-stone-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
          <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-4">
            Linked Journeys
          </p>
          <div className="space-y-2">
            {memory.linkedJourneys.map((journeyId) => (
              <Link
                key={journeyId}
                href={`/journeys/${journeyId}`}
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-stone-200/60 hover:border-stone-300 hover:shadow-sm transition-all group"
              >
                <span className="text-sm font-sans text-stone-600 group-hover:text-stone-800">
                  Journey {journeyId.slice(0, 8)}
                </span>
                <ExternalLink size={13} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ─── Lock Condition ─── */}
      {memory.isLocked && memory.unlockCondition && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-7 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Lock size={13} className="text-amber-600" />
            </div>
            <p className="text-[10px] font-sans uppercase tracking-[4px] text-amber-600">
              Unlock Condition
            </p>
          </div>
          <p className="text-sm font-sans text-amber-800 leading-[1.7] tracking-wide">
            {memory.unlockCondition}
          </p>
        </div>
      )}
    </motion.div>
  );
}
