'use client';

/**
 * Execution Tracker Component
 * Timeline showing journey execution milestones
 */

import { Journey, JourneyStatus } from '@/lib/types/entities';
import { Card, CardHeader, CardContent } from '@/components/shared/Card';
import { formatDistanceToNow } from 'date-fns';
import { Check, Circle } from 'lucide-react';

interface ExecutionTrackerProps {
  journey: Journey;
}

interface Milestone {
  status: JourneyStatus;
  label: string;
  description: string;
}

const EXECUTION_MILESTONES: Milestone[] = [
  {
    status: JourneyStatus.APPROVED,
    label: 'Approved',
    description: 'Journey approved by compliance and ready for presentation',
  },
  {
    status: JourneyStatus.PRESENTED,
    label: 'Presented to Client',
    description: 'Journey proposal presented to client for review',
  },
  {
    status: JourneyStatus.EXECUTED,
    label: 'Execution Begun',
    description: 'Journey implementation and execution initiated',
  },
];

export function ExecutionTracker({ journey }: ExecutionTrackerProps) {
  // Find the version for each milestone
  const milestoneVersions = journey.versions
    .filter((v) =>
      [JourneyStatus.APPROVED, JourneyStatus.PRESENTED, JourneyStatus.EXECUTED].includes(v.status)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getMilestoneStatus = (milestoneStatus: JourneyStatus) => {
    const milestoneIndex = EXECUTION_MILESTONES.findIndex((m) => m.status === milestoneStatus);
    const currentIndex = EXECUTION_MILESTONES.findIndex((m) => m.status === journey.status);

    if (milestoneIndex <= currentIndex) {
      return 'completed';
    } else if (milestoneIndex === currentIndex + 1) {
      return 'in-progress';
    } else {
      return 'pending';
    }
  };

  const getMilestoneVersion = (milestoneStatus: JourneyStatus) => {
    return milestoneVersions.find((v) => v.status === milestoneStatus);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="font-serif text-xl text-rose-900">Execution Timeline</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {EXECUTION_MILESTONES.map((milestone, index) => {
            const status = getMilestoneStatus(milestone.status);
            const version = getMilestoneVersion(milestone.status);
            const isLast = index === EXECUTION_MILESTONES.length - 1;

            return (
              <div key={milestone.status} className="relative">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === 'completed'
                          ? 'bg-teal-500'
                          : status === 'in-progress'
                            ? 'bg-gold-500'
                            : 'bg-slate-300'
                      }`}
                    >
                      {status === 'completed' ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Circle
                          className={`w-5 h-5 ${
                            status === 'in-progress' ? 'text-white' : 'text-white'
                          }`}
                        />
                      )}
                    </div>

                    {/* Connecting line */}
                    {!isLast && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-12 ${
                          status === 'completed' ? 'bg-teal-500' : 'bg-slate-300'
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-sans text-sm font-semibold text-slate-900">
                        {milestone.label}
                      </h3>
                      {status === 'completed' && version && (
                        <span className="font-sans text-xs text-slate-500">
                          {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-slate-600 mb-2">{milestone.description}</p>

                    {/* Version details */}
                    {status === 'completed' && version && (
                      <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                        <p className="font-sans text-xs text-slate-600">
                          Modified by: {version.modifiedBy.slice(0, 16)}...
                        </p>
                        {version.approvedBy && (
                          <p className="font-sans text-xs text-teal-700 mt-1">
                            Approved by: {version.approvedBy.slice(0, 16)}...
                          </p>
                        )}
                      </div>
                    )}

                    {status === 'in-progress' && (
                      <div className="mt-2 p-2 bg-gold-50 rounded border border-gold-200">
                        <p className="font-sans text-xs text-gold-800">
                          Currently in progress
                        </p>
                      </div>
                    )}

                    {status === 'pending' && (
                      <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                        <p className="font-sans text-xs text-slate-500">Pending</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
