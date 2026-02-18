'use client';

/**
 * Journey Actions Component
 * Action buttons bar for journey detail page.
 * Shows Confirm/Refine/Archive based on journey status.
 */

import { CheckCircle, Edit, Archive } from 'lucide-react';
import { JourneyStatus } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';

interface JourneyActionsProps {
  status: JourneyStatus;
  onConfirm?: () => void;
  onRefine?: () => void;
  onArchive?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function JourneyActions({
  status,
  onConfirm,
  onRefine,
  onArchive,
  isLoading,
  className,
}: JourneyActionsProps) {
  // Can only confirm/refine if not already approved or archived
  const canConfirm = status === JourneyStatus.DRAFT;
  const canRefine = status === JourneyStatus.DRAFT;
  const canArchive = status !== JourneyStatus.ARCHIVED;

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Confirm Journey */}
      {canConfirm && onConfirm && (
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Confirm Journey
        </button>
      )}

      {/* Refine Journey */}
      {canRefine && onRefine && (
        <button
          onClick={onRefine}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-sand-100 text-sand-900 font-sans font-medium rounded-lg hover:bg-sand-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Refine Journey
        </button>
      )}

      {/* Archive Journey */}
      {canArchive && onArchive && (
        <button
          onClick={onArchive}
          disabled={isLoading}
          className="px-6 py-3 bg-sand-100 text-sand-700 font-sans font-medium rounded-lg hover:bg-sand-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Archive className="w-5 h-5" />
          Archive
        </button>
      )}

      {/* Status badge if approved */}
      {status === JourneyStatus.APPROVED && (
        <div className="flex-1 px-6 py-3 bg-emerald-50 text-emerald-900 font-sans font-medium rounded-lg flex items-center justify-center gap-2 border border-emerald-200">
          <CheckCircle className="w-5 h-5" />
          Journey Confirmed
        </div>
      )}

      {/* Status badge if archived */}
      {status === JourneyStatus.ARCHIVED && (
        <div className="flex-1 px-6 py-3 bg-sand-200 text-sand-600 font-sans font-medium rounded-lg flex items-center justify-center gap-2">
          <Archive className="w-5 h-5" />
          Archived
        </div>
      )}
    </div>
  );
}
