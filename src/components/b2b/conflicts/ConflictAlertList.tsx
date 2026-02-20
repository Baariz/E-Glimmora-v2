'use client';

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { AlertTriangle, Users, MapPin, Calendar, Check } from 'lucide-react';
import type { ConflictAlert } from '@/lib/types';

interface ConflictAlertListProps {
  conflicts: ConflictAlert[];
  onAcknowledge: (conflictId: string) => void;
  onResolve: (conflictId: string, action: string, notes: string) => void;
}

const severityColors: Record<string, string> = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-rose-100 text-rose-800',
};

const typeLabels: Record<string, string> = {
  scheduling: 'Scheduling Overlap',
  venue: 'Venue Conflict',
  relationship: 'Relationship',
  business: 'Business Rivalry',
  social_circle: 'Social Circle',
};

export function ConflictAlertList({ conflicts, onAcknowledge, onResolve }: ConflictAlertListProps) {
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveAction, setResolveAction] = useState('');
  const [resolveNotes, setResolveNotes] = useState('');

  const sorted = [...conflicts].sort((a, b) => {
    const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
  });

  if (sorted.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No active conflicts detected</p>;
  }

  const handleSubmitResolve = (conflictId: string) => {
    if (resolveAction.trim()) {
      onResolve(conflictId, resolveAction, resolveNotes);
      setResolveId(null);
      setResolveAction('');
      setResolveNotes('');
    }
  };

  return (
    <div className="space-y-3">
      {sorted.map(c => (
        <Card key={c.id}>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-50">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{c.title}</h4>
                  <p className="font-sans text-xs text-slate-600 mt-0.5">{c.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${severityColors[c.severity]}`}>
                  {c.severity}
                </span>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans bg-slate-100 text-slate-600">
                  {typeLabels[c.conflictType] || c.conflictType}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-sans text-slate-600">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{c.partyALabel} vs {c.partyBLabel}</span>
              </div>
              {c.venue && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{c.venue}</span>
                </div>
              )}
              {c.eventDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(c.eventDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {c.recommendedActions.length > 0 && (
              <div className="bg-slate-50 rounded p-2">
                <p className="font-sans text-[10px] font-semibold text-slate-700 mb-1">Recommended Actions</p>
                {c.recommendedActions.map((action, i) => (
                  <p key={i} className="font-sans text-[10px] text-slate-600 flex items-start gap-1 mb-0.5">
                    <span className="text-rose-400 mt-0.5 flex-shrink-0">•</span>{action}
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              {c.status === 'Active' && (
                <button
                  onClick={() => onAcknowledge(c.id)}
                  className="px-3 py-1 text-xs font-sans font-medium text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors"
                >
                  Acknowledge
                </button>
              )}
              {resolveId === c.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Resolution action taken..."
                    value={resolveAction}
                    onChange={e => setResolveAction(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-sans border border-slate-200 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={resolveNotes}
                    onChange={e => setResolveNotes(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-sans border border-slate-200 rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmitResolve(c.id)}
                      className="px-3 py-1 text-xs font-sans font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setResolveId(null)}
                      className="px-3 py-1 text-xs font-sans text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setResolveId(c.id)}
                  className="px-3 py-1 text-xs font-sans font-medium text-teal-700 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors"
                >
                  Resolve
                </button>
              )}
              <span className="ml-auto font-sans text-[10px] text-slate-400">
                Detected: {new Date(c.detectedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
