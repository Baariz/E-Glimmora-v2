'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ExternalIntegration, DataFlowMetric } from '@/lib/types';

interface DataFlowDashboardProps {
  integrations: ExternalIntegration[];
  services: { integration: { getDataFlowMetrics: (id: string, days?: number) => Promise<DataFlowMetric[]> } };
}

export function DataFlowDashboard({ integrations, services }: DataFlowDashboardProps) {
  const [selectedId, setSelectedId] = useState<string>(integrations[0]?.id || '');
  const [metrics, setMetrics] = useState<DataFlowMetric[]>([]);

  useEffect(() => {
    if (selectedId) {
      services.integration.getDataFlowMetrics(selectedId, 14).then(setMetrics);
    }
  }, [selectedId]);

  const chartData = metrics.map(m => ({
    period: m.period,
    ingested: m.recordsIngested,
    failed: m.recordsFailed,
    latency: m.avgLatencyMs,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="px-3 py-1.5 text-xs font-sans border border-slate-200 rounded-md bg-white"
        >
          {integrations.map(i => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
      </div>

      <Card>
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3">Records Ingested / Failed</h4>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="ingested" fill="#14b8a6" name="Ingested" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#f43f5e" name="Failed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-8 text-sm font-sans text-slate-500">No data flow metrics</p>
        )}
      </Card>

      {metrics.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Period</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Ingested</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Failed</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Error Rate</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Avg Latency</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Peak Latency</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => {
                const errorRate = m.recordsIngested > 0
                  ? ((m.recordsFailed / (m.recordsIngested + m.recordsFailed)) * 100).toFixed(1)
                  : '0.0';
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-900 font-medium">{m.period}</td>
                    <td className="py-2 px-3 text-right text-teal-600 font-medium">{m.recordsIngested.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-rose-600 font-medium">{m.recordsFailed}</td>
                    <td className={`py-2 px-3 text-right ${parseFloat(errorRate) > 5 ? 'text-rose-600' : 'text-slate-600'}`}>{errorRate}%</td>
                    <td className="py-2 px-3 text-right text-slate-600">{m.avgLatencyMs}ms</td>
                    <td className="py-2 px-3 text-right text-slate-600">{m.peakLatencyMs}ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
