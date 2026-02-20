'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle, XCircle } from 'lucide-react';
import type { ExternalIntegration, IntegrationHealthCheck } from '@/lib/types';

interface HealthMonitorProps {
  integrations: ExternalIntegration[];
  services: { integration: { getHealthChecks: (id: string, limit?: number) => Promise<IntegrationHealthCheck[]>; testConnection: (id: string) => Promise<{ success: boolean; latencyMs: number; message: string }> } };
}

export function HealthMonitor({ integrations, services }: HealthMonitorProps) {
  const [selectedId, setSelectedId] = useState<string>(integrations[0]?.id || '');
  const [healthChecks, setHealthChecks] = useState<IntegrationHealthCheck[]>([]);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);

  useEffect(() => {
    if (selectedId) {
      services.integration.getHealthChecks(selectedId, 20).then(setHealthChecks);
    }
  }, [selectedId]);

  const handleTest = async () => {
    if (!selectedId) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await services.integration.testConnection(selectedId);
      setTestResult(result);
    } finally {
      setTesting(false);
    }
  };

  const chartData = healthChecks.map(hc => ({
    time: new Date(hc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: hc.latencyMs,
    healthy: hc.isHealthy ? 1 : 0,
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
        <button
          onClick={handleTest}
          disabled={testing}
          className="px-3 py-1.5 text-xs font-sans font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 disabled:opacity-50 transition-colors"
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        {testResult && (
          <span className={`flex items-center gap-1 text-xs font-sans ${testResult.success ? 'text-teal-600' : 'text-rose-600'}`}>
            {testResult.success ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {testResult.message} ({testResult.latencyMs}ms)
          </span>
        )}
      </div>

      <Card>
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3">Latency Trend</h4>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} unit="ms" />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
              <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Latency (ms)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-8 text-sm font-sans text-slate-500">No health check data</p>
        )}
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full text-xs font-sans">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Timestamp</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Status Code</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Latency</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Healthy</th>
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Error</th>
            </tr>
          </thead>
          <tbody>
            {healthChecks.map(hc => (
              <tr key={hc.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3 text-slate-600">{new Date(hc.timestamp).toLocaleString()}</td>
                <td className="py-2 px-3 text-center text-slate-900 font-medium">{hc.statusCode}</td>
                <td className="py-2 px-3 text-center text-slate-600">{hc.latencyMs}ms</td>
                <td className="py-2 px-3 text-center">
                  {hc.isHealthy ? (
                    <CheckCircle className="w-3.5 h-3.5 text-teal-500 mx-auto" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-2 px-3 text-rose-600">{hc.errorMessage || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
