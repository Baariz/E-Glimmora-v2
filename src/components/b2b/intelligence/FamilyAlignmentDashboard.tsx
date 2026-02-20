'use client';

import { Card } from '@/components/shared/Card';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import type { FamilyAlignmentAssessment } from '@/lib/types';

interface FamilyAlignmentDashboardProps {
  assessments: FamilyAlignmentAssessment[];
}

const severityColors: Record<string, string> = {
  Aligned: 'bg-teal-100 text-teal-800',
  Minor: 'bg-blue-100 text-blue-800',
  Moderate: 'bg-amber-100 text-amber-800',
  Significant: 'bg-orange-100 text-orange-800',
  Critical: 'bg-rose-100 text-rose-800',
};

function alignmentColor(score: number): string {
  if (score >= 70) return 'bg-teal-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

export function FamilyAlignmentDashboard({ assessments }: FamilyAlignmentDashboardProps) {
  return (
    <div className="space-y-4">
      {assessments.length === 0 && (
        <p className="text-center py-8 text-sm font-sans text-slate-500">No family alignment data available</p>
      )}

      {assessments.map(a => (
        <Card key={a.id}>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-sans text-sm font-semibold text-slate-900">{a.clientName} Family</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-sans ${severityColors[a.driftSeverity]}`}>
                    {a.driftSeverity} Drift
                  </span>
                  <span className="text-xs font-sans text-slate-500">{a.familyMembers.length} members tracked</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif text-3xl text-slate-900">{a.overallAlignmentScore}</p>
                <p className="font-sans text-xs text-slate-500">alignment score</p>
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${alignmentColor(a.overallAlignmentScore)}`} style={{ width: `${a.overallAlignmentScore}%` }} />
            </div>

            {/* Drift Areas */}
            <div>
              <p className="font-sans text-xs font-semibold text-slate-700 mb-2">Drift Areas</p>
              <div className="space-y-2">
                {a.driftAreas.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-sans text-xs text-slate-600 w-40 flex-shrink-0">{d.area}</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${d.currentDriftPercent > 60 ? 'bg-rose-500' : d.currentDriftPercent > 30 ? 'bg-amber-500' : 'bg-teal-500'}`}
                        style={{ width: `${d.currentDriftPercent}%` }}
                      />
                    </div>
                    <span className="font-sans text-xs text-slate-600 w-10 text-right">{d.currentDriftPercent}%</span>
                    <div className="w-4">
                      {d.trendDirection === 'diverging' && <TrendingUp className="w-3 h-3 text-rose-500" />}
                      {d.trendDirection === 'converging' && <TrendingDown className="w-3 h-3 text-teal-500" />}
                      {d.trendDirection === 'stable' && <Minus className="w-3 h-3 text-slate-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            {a.alerts.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <p className="font-sans text-xs font-semibold text-slate-700 mb-2">Active Alerts</p>
                {a.alerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-2 mb-2 p-2 bg-rose-50 rounded">
                    <AlertTriangle className="w-3 h-3 text-rose-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-xs text-slate-800">{alert.message}</p>
                      <p className="font-sans text-[10px] text-slate-500 mt-0.5">{alert.area} • {new Date(alert.triggeredAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {a.recommendations.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <p className="font-sans text-xs font-semibold text-slate-700 mb-1">Recommendations</p>
                {a.recommendations.map((r, i) => (
                  <p key={i} className="font-sans text-xs text-slate-600 flex items-start gap-1.5 mb-0.5">
                    <span className="text-rose-400 mt-0.5 flex-shrink-0">•</span>{r}
                  </p>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
