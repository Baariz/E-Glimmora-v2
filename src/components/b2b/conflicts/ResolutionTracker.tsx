'use client';

import { Card } from '@/components/shared/Card';
import { CheckCircle, Clock } from 'lucide-react';
import type { ConflictAlert } from '@/lib/types';

interface ResolutionTrackerProps {
  conflicts: ConflictAlert[];
}

const typeLabels: Record<string, string> = {
  scheduling: 'Scheduling Overlap',
  venue: 'Venue Conflict',
  relationship: 'Relationship',
  business: 'Business Rivalry',
  social_circle: 'Social Circle',
};

export function ResolutionTracker({ conflicts }: ResolutionTrackerProps) {
  const resolved = conflicts.filter(c => c.status === 'Resolved');

  if (resolved.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No resolved conflicts to display</p>;
  }

  return (
    <div className="space-y-3">
      {resolved.map(c => {
        const detectedDate = new Date(c.detectedAt);
        const resolvedDate = c.resolvedAt ? new Date(c.resolvedAt) : null;
        const hours = resolvedDate
          ? Math.round((resolvedDate.getTime() - detectedDate.getTime()) / (1000 * 60 * 60))
          : null;

        return (
          <Card key={c.id}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-50">
                <CheckCircle className="w-4 h-4 text-teal-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{c.title}</h4>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans bg-teal-100 text-teal-700 font-medium">
                    Resolved
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans bg-slate-100 text-slate-600">
                    {typeLabels[c.conflictType] || c.conflictType}
                  </span>
                </div>
                <p className="font-sans text-xs text-slate-600 mt-1">{c.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-sans text-slate-400">
                  <span>Parties: {c.partyALabel} / {c.partyBLabel}</span>
                  {c.venue && <span>Venue: {c.venue}</span>}
                </div>

                {c.resolutionNotes && (
                  <div className="mt-2 bg-teal-50 rounded p-2">
                    <p className="font-sans text-[10px] text-teal-800">
                      <span className="font-semibold">Resolution:</span> {c.resolutionNotes}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-2 text-[10px] font-sans text-slate-400">
                  <span>Detected: {detectedDate.toLocaleDateString()}</span>
                  {resolvedDate && <span>Resolved: {resolvedDate.toLocaleDateString()}</span>}
                  {hours !== null && (
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {hours}h resolution time
                    </span>
                  )}
                  {c.resolvedBy && <span>By: {c.resolvedBy}</span>}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
