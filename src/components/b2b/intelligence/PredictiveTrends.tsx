'use client';

import { Card } from '@/components/shared/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { TravelFatigueAssessment, FamilyAlignmentAssessment } from '@/lib/types';

interface PredictiveTrendsProps {
  fatigueAssessments: TravelFatigueAssessment[];
  alignmentAssessments: FamilyAlignmentAssessment[];
}

export function PredictiveTrends({ fatigueAssessments, alignmentAssessments }: PredictiveTrendsProps) {
  const fatigueChartData = fatigueAssessments.map(a => ({
    name: a.clientName.split(' ')[0],
    fatigue: a.fatigueScore,
    burnout: a.burnoutRiskPercent,
  }));

  const alignmentChartData = alignmentAssessments.map(a => ({
    name: a.clientName.split(' ')[0],
    alignment: a.overallAlignmentScore,
    driftAvg: a.driftAreas.length > 0
      ? Math.round(a.driftAreas.reduce((s, d) => s + d.currentDriftPercent, 0) / a.driftAreas.length)
      : 0,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-4">Fatigue & Burnout Risk Comparison</h4>
        {fatigueChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={fatigueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
              <Line type="monotone" dataKey="fatigue" stroke="#f59e0b" strokeWidth={2} name="Fatigue Score" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="burnout" stroke="#f43f5e" strokeWidth={2} name="Burnout Risk %" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-8 text-sm font-sans text-slate-500">No fatigue data available</p>
        )}
      </Card>

      <Card>
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-4">Alignment & Drift Overview</h4>
        {alignmentChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={alignmentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
              <Area type="monotone" dataKey="alignment" fill="#14b8a6" fillOpacity={0.2} stroke="#14b8a6" strokeWidth={2} name="Alignment Score" />
              <Area type="monotone" dataKey="driftAvg" fill="#f43f5e" fillOpacity={0.15} stroke="#f43f5e" strokeWidth={2} name="Avg Drift %" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-8 text-sm font-sans text-slate-500">No alignment data available</p>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h4 className="font-sans text-xs font-semibold text-slate-700 mb-3">Key Insights</h4>
          <div className="space-y-2">
            {fatigueAssessments.filter(a => a.fatigueScore >= 70).map(a => (
              <p key={a.id} className="font-sans text-xs text-rose-600">
                <span className="font-medium">{a.clientName}</span> — Critical fatigue ({a.fatigueScore}/100), {a.burnoutRiskPercent}% burnout risk
              </p>
            ))}
            {alignmentAssessments.filter(a => a.overallAlignmentScore < 50).map(a => (
              <p key={a.id} className="font-sans text-xs text-amber-600">
                <span className="font-medium">{a.clientName}</span> — Low alignment ({a.overallAlignmentScore}/100), {a.driftSeverity} drift
              </p>
            ))}
            {fatigueAssessments.filter(a => a.fatigueScore < 70).length === fatigueAssessments.length &&
             alignmentAssessments.filter(a => a.overallAlignmentScore >= 50).length === alignmentAssessments.length && (
              <p className="font-sans text-xs text-teal-600">All clients within acceptable thresholds</p>
            )}
          </div>
        </Card>
        <Card>
          <h4 className="font-sans text-xs font-semibold text-slate-700 mb-3">Portfolio Summary</h4>
          <div className="space-y-1.5">
            <div className="flex justify-between font-sans text-xs">
              <span className="text-slate-500">Clients Tracked (Fatigue)</span>
              <span className="text-slate-900 font-medium">{fatigueAssessments.length}</span>
            </div>
            <div className="flex justify-between font-sans text-xs">
              <span className="text-slate-500">Clients Tracked (Alignment)</span>
              <span className="text-slate-900 font-medium">{alignmentAssessments.length}</span>
            </div>
            <div className="flex justify-between font-sans text-xs">
              <span className="text-slate-500">High Fatigue Clients</span>
              <span className="text-rose-600 font-medium">{fatigueAssessments.filter(a => a.fatigueScore >= 70).length}</span>
            </div>
            <div className="flex justify-between font-sans text-xs">
              <span className="text-slate-500">Significant Drift Cases</span>
              <span className="text-amber-600 font-medium">{alignmentAssessments.filter(a => a.driftSeverity === 'Significant' || a.driftSeverity === 'Critical').length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
