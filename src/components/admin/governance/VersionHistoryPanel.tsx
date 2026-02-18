/**
 * Version History Panel Component
 * Generic vertical timeline showing version history with status badges
 */

import { Clock, User, FileText } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/shared/Card';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';

export interface VersionEntry {
  version: number;
  status: string;
  timestamp: string;
  userId: string;
  userName?: string;
  changes?: string;
  metadata?: Record<string, unknown>;
}

interface VersionHistoryPanelProps {
  versions: VersionEntry[];
  title?: string;
  emptyMessage?: string;
}

export function VersionHistoryPanel({
  versions,
  title = 'Version History',
  emptyMessage = 'No version history available',
}: VersionHistoryPanelProps) {
  if (versions.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-slate-500 font-sans text-sm">
          {emptyMessage}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-lg font-sans font-medium text-slate-900">{title}</h3>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {versions.map((version, index) => {
            const timestamp = new Date(version.timestamp);
            const isLatest = index === 0;

            return (
              <div key={version.version} className="flex gap-4">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isLatest
                        ? 'bg-teal-100 border-2 border-teal-600'
                        : 'bg-slate-100 border-2 border-slate-300'
                    }`}
                  >
                    <span
                      className={`text-sm font-sans font-medium ${
                        isLatest ? 'text-teal-700' : 'text-slate-600'
                      }`}
                    >
                      v{version.version}
                    </span>
                  </div>
                  {index < versions.length - 1 && (
                    <div className="w-0.5 h-full bg-slate-200 mt-2" />
                  )}
                </div>

                {/* Version details */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-sans font-medium text-slate-900">
                        Version {version.version}
                      </span>
                      <StatusBadge status={version.status} size="sm" />
                      {isLatest && (
                        <span className="text-xs font-sans text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-xs font-sans text-slate-500 mb-2">
                    <Clock size={12} />
                    <span>
                      {format(timestamp, 'MMM d, yyyy HH:mm:ss')}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
                  </div>

                  {/* User */}
                  <div className="flex items-center gap-1.5 text-xs font-sans text-slate-600 mb-2">
                    <User size={12} />
                    <span>{version.userName || version.userId}</span>
                  </div>

                  {/* Changes description */}
                  {version.changes && (
                    <div className="flex items-start gap-1.5 text-sm font-sans text-slate-700 mt-2">
                      <FileText size={14} className="mt-0.5 text-slate-400" />
                      <span>{version.changes}</span>
                    </div>
                  )}

                  {/* Metadata (if any) */}
                  {version.metadata && Object.keys(version.metadata).length > 0 && (
                    <div className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded p-2">
                      <pre className="font-mono text-slate-600">
                        {JSON.stringify(version.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
