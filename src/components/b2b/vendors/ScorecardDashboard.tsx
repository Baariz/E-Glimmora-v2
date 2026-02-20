'use client';

import { Card } from '@/components/shared/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { VendorScorecard } from '@/lib/types';

interface ScorecardDashboardProps {
  scorecards: VendorScorecard[];
}

const ratingColors: Record<string, string> = {
  Exceptional: 'bg-teal-100 text-teal-800',
  Good: 'bg-blue-100 text-blue-800',
  Satisfactory: 'bg-amber-100 text-amber-800',
  'Below Expectations': 'bg-orange-100 text-orange-800',
  Unacceptable: 'bg-rose-100 text-rose-800',
};

export function ScorecardDashboard({ scorecards }: ScorecardDashboardProps) {
  if (scorecards.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No scorecards available</p>;
  }

  const chartData = scorecards.map(sc => ({
    name: sc.vendorName.split(' ')[0],
    score: sc.overallScore,
    sla: sc.slaCompliance,
    fill: sc.overallScore >= 80 ? '#14b8a6' : sc.overallScore >= 60 ? '#f59e0b' : '#f43f5e',
  }));

  return (
    <div className="space-y-6">
      <Card>
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3">Performance Comparison</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
            <Bar dataKey="score" name="Overall Score" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scorecards.map(sc => (
          <Card key={sc.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{sc.vendorName}</h4>
                  <p className="font-sans text-[10px] text-slate-400 mt-0.5">Period: {sc.period}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${ratingColors[sc.overallRating]}`}>
                    {sc.overallRating}
                  </span>
                  <p className="font-serif text-xl text-slate-900 mt-1">{sc.overallScore}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 rounded p-2">
                  <p className="font-sans text-[10px] text-slate-500">SLA Compliance</p>
                  <p className="font-sans text-sm font-medium text-slate-900">{sc.slaCompliance}%</p>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <p className="font-sans text-[10px] text-slate-500">Quality</p>
                  <p className="font-sans text-sm font-medium text-slate-900">{sc.qualityRating}/100</p>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <p className="font-sans text-[10px] text-slate-500">Response Time</p>
                  <p className="font-sans text-sm font-medium text-slate-900">{sc.responseTime}ms</p>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <p className="font-sans text-[10px] text-slate-500">Incidents</p>
                  <p className={`font-sans text-sm font-medium ${sc.incidentCount > 3 ? 'text-rose-600' : 'text-slate-900'}`}>{sc.incidentCount}</p>
                </div>
              </div>

              {sc.metrics.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="font-sans text-[10px] font-semibold text-slate-700 mb-1.5">Metrics</p>
                  {sc.metrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-[10px] text-slate-600 w-28 flex-shrink-0">{m.category}</span>
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${m.score >= m.target ? 'bg-teal-500' : 'bg-amber-500'}`}
                          style={{ width: `${m.score}%` }}
                        />
                      </div>
                      <span className="font-sans text-[10px] text-slate-500 w-16 text-right">{m.score}/{m.target}</span>
                    </div>
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
