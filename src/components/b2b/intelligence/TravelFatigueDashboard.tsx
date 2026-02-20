'use client';

import { Card } from '@/components/shared/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TravelFatigueAssessment } from '@/lib/types';

interface TravelFatigueDashboardProps {
  assessments: TravelFatigueAssessment[];
}

const levelColors: Record<string, string> = {
  Minimal: 'bg-teal-100 text-teal-800',
  Low: 'bg-blue-100 text-blue-800',
  Moderate: 'bg-amber-100 text-amber-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-rose-100 text-rose-800',
};

function scoreColor(score: number): string {
  if (score < 30) return 'bg-teal-500';
  if (score < 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

export function TravelFatigueDashboard({ assessments }: TravelFatigueDashboardProps) {
  const chartData = assessments.map(a => ({
    name: a.clientName.split(' ')[0],
    score: a.fatigueScore,
    fill: a.fatigueScore < 30 ? '#14b8a6' : a.fatigueScore < 60 ? '#f59e0b' : '#f43f5e',
  }));

  return (
    <div className="space-y-6">
      {assessments.length > 0 && (
        <Card>
          <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3">Portfolio Fatigue Scores</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map(a => (
          <Card key={a.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{a.clientName}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-sans mt-1 ${levelColors[a.fatigueLevel]}`}>
                    {a.fatigueLevel}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-slate-900">{a.fatigueScore}</p>
                  <div className="flex items-center gap-1 justify-end text-xs font-sans text-slate-500">
                    {a.trendDirection === 'worsening' && <TrendingUp className="w-3 h-3 text-rose-500" />}
                    {a.trendDirection === 'improving' && <TrendingDown className="w-3 h-3 text-teal-500" />}
                    {a.trendDirection === 'stable' && <Minus className="w-3 h-3 text-slate-400" />}
                    {a.trendDirection}
                  </div>
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${scoreColor(a.fatigueScore)}`} style={{ width: `${a.fatigueScore}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-sans text-xs text-slate-500">Trips (30d)</p>
                  <p className="font-sans text-sm font-medium text-slate-900">{a.tripsLast30Days}</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-slate-500">Trips (90d)</p>
                  <p className="font-sans text-sm font-medium text-slate-900">{a.tripsLast90Days}</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-slate-500">Burnout Risk</p>
                  <p className={`font-sans text-sm font-medium ${a.burnoutRiskPercent > 60 ? 'text-rose-600' : 'text-slate-900'}`}>{a.burnoutRiskPercent}%</p>
                </div>
              </div>

              {a.recommendations.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
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
    </div>
  );
}
