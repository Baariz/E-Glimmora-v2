'use client';

/**
 * Version History Component
 * Immutable version timeline with diff capability
 */

import { useState, useEffect } from 'react';
import { Journey, JourneyVersion } from '@/lib/types/entities';
import { useServices } from '@/lib/hooks/useServices';
import { Card, CardHeader, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { VersionDiff } from './VersionDiff';
import { formatDistanceToNow } from 'date-fns';
import { getStateLabel, getStateColor } from '@/lib/state-machines/journey-workflow';

interface VersionHistoryProps {
  journey: Journey;
  onVersionChange: () => void;
}

export function VersionHistory({ journey, onVersionChange }: VersionHistoryProps) {
  const services = useServices();
  const [versions, setVersions] = useState<JourneyVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareVersions, setCompareVersions] = useState<{
    old: JourneyVersion;
    new: JourneyVersion;
  } | null>(null);

  useEffect(() => {
    loadVersions();
  }, [journey.id]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const versionData = await services.journey.getJourneyVersions(journey.id);
      // Sort by version number descending (newest first)
      setVersions(versionData.sort((a, b) => b.versionNumber - a.versionNumber));
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = (oldVersion: JourneyVersion, newVersion: JourneyVersion) => {
    setCompareVersions({ old: oldVersion, new: newVersion });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="font-serif text-xl text-rose-900">Version History</h2>
        </CardHeader>
        <CardContent>
          <p className="font-sans text-sm text-slate-600">Loading versions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="font-serif text-xl text-rose-900">Version History</h2>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <p className="font-sans text-sm text-slate-600">No version history available.</p>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => {
                const isLatest = index === 0;
                const previousVersion = versions[index + 1];
                const color = getStateColor(version.status);

                return (
                  <div
                    key={version.id}
                    className={`relative pl-6 pb-4 ${
                      index < versions.length - 1 ? 'border-l-2 border-slate-200' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white ${
                        isLatest ? `bg-${color}-500` : 'bg-slate-300'
                      }`}
                    />

                    {/* Version content */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-sans text-sm font-semibold text-slate-900">
                              Version {version.versionNumber}
                            </span>
                            {isLatest && (
                              <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-sans text-xs">
                                Current
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full bg-${color}-100 text-${color}-800 font-sans text-xs`}
                            >
                              {getStateLabel(version.status)}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-slate-600">
                            {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Compare button */}
                        {previousVersion && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCompare(previousVersion, version)}
                          >
                            Compare
                          </Button>
                        )}
                      </div>

                      {/* Modified by */}
                      <p className="font-sans text-xs text-slate-600 mb-2">
                        Modified by: {version.modifiedBy.slice(0, 12)}...
                      </p>

                      {/* Approval/Rejection info */}
                      {version.approvedBy && (
                        <p className="font-sans text-xs text-teal-700">
                          Approved by: {version.approvedBy.slice(0, 12)}...
                        </p>
                      )}
                      {version.rejectedBy && version.rejectionReason && (
                        <div className="mt-2 p-2 bg-rose-50 rounded border border-rose-200">
                          <p className="font-sans text-xs text-rose-700 font-semibold mb-1">
                            Rejected by: {version.rejectedBy.slice(0, 12)}...
                          </p>
                          <p className="font-sans text-xs text-rose-600">{version.rejectionReason}</p>
                        </div>
                      )}

                      {/* Narrative preview */}
                      <div className="mt-3 p-3 bg-white rounded border border-slate-200">
                        <p className="font-sans text-xs text-slate-700 line-clamp-3">
                          {version.narrative}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Diff Modal */}
      {compareVersions && (
        <VersionDiff
          oldVersion={compareVersions.old}
          newVersion={compareVersions.new}
          onClose={() => setCompareVersions(null)}
        />
      )}
    </>
  );
}
