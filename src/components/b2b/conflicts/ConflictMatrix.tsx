'use client';

import { Card } from '@/components/shared/Card';
import type { ConflictMatrixEntry } from '@/lib/types';

interface ConflictMatrixProps {
  entries: ConflictMatrixEntry[];
}

function heatColor(count: number): string {
  if (count === 0) return 'bg-slate-50 text-slate-300';
  if (count === 1) return 'bg-amber-50 text-amber-700';
  if (count === 2) return 'bg-orange-50 text-orange-700';
  return 'bg-rose-50 text-rose-700';
}

export function ConflictMatrix({ entries }: ConflictMatrixProps) {
  if (entries.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No conflict matrix data available</p>;
  }

  const sorted = [...entries].sort((a, b) => b.conflictCount - a.conflictCount);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map(entry => (
          <Card key={entry.clientId}>
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h5 className="font-sans text-xs font-semibold text-slate-900">{entry.clientLabel}</h5>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-sans font-bold ${heatColor(entry.conflictCount)}`}>
                  {entry.conflictCount}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-sans text-[10px] text-slate-500">Total</p>
                  <p className="font-sans text-sm font-medium text-slate-900">{entry.conflictCount}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] text-slate-500">High Severity</p>
                  <p className={`font-sans text-sm font-medium ${entry.highSeverityCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {entry.highSeverityCount}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[10px] text-slate-500">Active</p>
                  <p className={`font-sans text-sm font-medium ${entry.activeConflicts > 0 ? 'text-amber-600' : 'text-teal-600'}`}>
                    {entry.activeConflicts}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h4 className="font-sans text-xs font-semibold text-slate-700 mb-3">Risk Heatmap</h4>
        <div className="flex flex-wrap gap-2">
          {sorted.map(entry => (
            <div
              key={entry.clientId}
              className={`px-3 py-2 rounded-lg ${heatColor(entry.conflictCount)} text-center min-w-[100px]`}
            >
              <p className="font-sans text-[10px] font-medium">{entry.clientLabel}</p>
              <p className="font-sans text-lg font-bold">{entry.conflictCount}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3 text-[10px] font-sans text-slate-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-50 border border-slate-200" /> 0</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-50" /> 1</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-50" /> 2</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-50" /> 3+</span>
        </div>
      </Card>
    </div>
  );
}
