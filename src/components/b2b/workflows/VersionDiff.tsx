'use client';

/**
 * Version Diff Component
 * Modal showing word-level diff between two journey versions
 */

import { JourneyVersion } from '@/lib/types/entities';
import { Modal } from '@/components/shared/Modal';
import { getStateLabel } from '@/lib/state-machines/journey-workflow';

interface VersionDiffProps {
  oldVersion: JourneyVersion;
  newVersion: JourneyVersion;
  onClose: () => void;
}

export function VersionDiff({ oldVersion, newVersion, onClose }: VersionDiffProps) {
  const diffs = computeWordDiff(oldVersion.narrative, newVersion.narrative);

  return (
    <Modal
      open={true}
      onOpenChange={onClose}
      title="Compare Versions"
      description={`Version ${oldVersion.versionNumber} → Version ${newVersion.versionNumber}`}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Version metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
          <div>
            <h4 className="font-sans text-xs font-semibold text-slate-700 mb-2">
              Version {oldVersion.versionNumber}
            </h4>
            <div className="space-y-1 font-sans text-xs text-slate-600">
              <p>Status: {getStateLabel(oldVersion.status)}</p>
              <p>Modified by: {oldVersion.modifiedBy.slice(0, 16)}...</p>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold text-slate-700 mb-2">
              Version {newVersion.versionNumber}
            </h4>
            <div className="space-y-1 font-sans text-xs text-slate-600">
              <p>Status: {getStateLabel(newVersion.status)}</p>
              <p>Modified by: {newVersion.modifiedBy.slice(0, 16)}...</p>
            </div>
          </div>
        </div>

        {/* Diff visualization */}
        <div>
          <h4 className="font-sans text-sm font-semibold text-slate-900 mb-3">Changes</h4>
          <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="font-serif text-sm leading-relaxed">
              {diffs.map((part, index) => {
                if (part.type === 'removed') {
                  return (
                    <span
                      key={index}
                      className="bg-rose-100 text-rose-900 line-through decoration-rose-500"
                    >
                      {part.value}
                    </span>
                  );
                } else if (part.type === 'added') {
                  return (
                    <span key={index} className="bg-teal-100 text-teal-900">
                      {part.value}
                    </span>
                  );
                } else {
                  return <span key={index}>{part.value}</span>;
                }
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 sm:gap-6 pt-4 border-t border-slate-200 font-sans text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-rose-100 border border-rose-300 rounded" />
            <span className="text-slate-600">Removed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-teal-100 border border-teal-300 rounded" />
            <span className="text-slate-600">Added</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Simple word-level diff algorithm
interface DiffPart {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

function computeWordDiff(oldText: string, newText: string): DiffPart[] {
  const oldWords = oldText.split(/(\s+)/); // Split on whitespace but keep it
  const newWords = newText.split(/(\s+)/);

  const diffs: DiffPart[] = [];

  // Very simple diff: just compare word by word
  // In production, use a proper diff library like diff-match-patch or jsdiff
  const maxLength = Math.max(oldWords.length, newWords.length);

  for (let i = 0; i < maxLength; i++) {
    const oldWord = oldWords[i];
    const newWord = newWords[i];

    if (oldWord === newWord) {
      if (oldWord) {
        diffs.push({ type: 'unchanged', value: oldWord });
      }
    } else {
      if (oldWord && !newWord) {
        diffs.push({ type: 'removed', value: oldWord });
      } else if (!oldWord && newWord) {
        diffs.push({ type: 'added', value: newWord });
      } else if (oldWord && newWord) {
        // Both exist but different - mark as removed then added
        diffs.push({ type: 'removed', value: oldWord });
        diffs.push({ type: 'added', value: newWord });
      }
    }
  }

  return diffs;
}
