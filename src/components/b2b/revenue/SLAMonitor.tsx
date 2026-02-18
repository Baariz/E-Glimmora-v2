'use client';

/**
 * SLA Monitor Component (REVN-03)
 * Service level agreement compliance tracking
 */

import { Card } from '@/components/shared/Card';
import { SLAMetrics } from '@/lib/services/interfaces/IContractService';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SLAMonitorProps {
  slaMetrics: SLAMetrics;
}

interface Incident {
  id: string;
  date: string;
  description: string;
  durationMinutes: number;
  status: 'Resolved' | 'Open';
}

export function SLAMonitor({ slaMetrics }: SLAMonitorProps) {
  const isBelowTarget = slaMetrics.uptimePercent < slaMetrics.slaTarget;

  // Mock uptime trend data (12 months)
  const uptimeTrend = [
    { month: 'Feb 25', uptime: 99.95 },
    { month: 'Mar 25', uptime: 99.91 },
    { month: 'Apr 25', uptime: 99.98 },
    { month: 'May 25', uptime: 99.94 },
    { month: 'Jun 25', uptime: 99.96 },
    { month: 'Jul 25', uptime: 99.92 },
    { month: 'Aug 25', uptime: 99.99 },
    { month: 'Sep 25', uptime: 99.95 },
    { month: 'Oct 25', uptime: 99.93 },
    { month: 'Nov 25', uptime: 99.98 },
    { month: 'Dec 25', uptime: 99.96 },
    { month: 'Jan 26', uptime: slaMetrics.uptimePercent },
  ];

  // Mock incident data
  const incidents: Incident[] = [
    {
      id: 'INC-001',
      date: '2026-01-15',
      description: 'API gateway timeout',
      durationMinutes: 12,
      status: 'Resolved',
    },
    {
      id: 'INC-002',
      date: '2026-01-08',
      description: 'Database connection pool exhausted',
      durationMinutes: 8,
      status: 'Resolved',
    },
  ];

  const incidentColumns: ColumnDef<Incident>[] = [
    {
      accessorKey: 'id',
      header: 'Incident ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'durationMinutes',
      header: 'Duration',
      cell: ({ row }) => (
        <span>{row.original.durationMinutes} min</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`text-xs font-medium ${
            row.original.status === 'Resolved'
              ? 'text-teal-600'
              : 'text-amber-600'
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
  ];

  const resolutionRate = slaMetrics.incidentCount > 0
    ? Math.round((slaMetrics.resolvedCount / slaMetrics.incidentCount) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Warning banner if below SLA */}
      {isBelowTarget && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-xl">⚠</span>
            <div>
              <h4 className="font-serif text-red-900 font-medium">SLA Target Not Met</h4>
              <p className="text-sm font-sans text-red-700 mt-1">
                Uptime is currently {slaMetrics.uptimePercent}%, below target of {slaMetrics.slaTarget}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`bg-gradient-to-br ${isBelowTarget ? 'from-white to-red-50' : 'from-white to-teal-50'}`}>
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Uptime</p>
            <p className={`text-3xl font-serif ${isBelowTarget ? 'text-red-600' : 'text-teal-600'}`}>
              {slaMetrics.uptimePercent}%
            </p>
            <p className="text-xs font-sans text-slate-500">Target: {slaMetrics.slaTarget}%</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-blue-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Avg Response</p>
            <p className="text-3xl font-serif text-slate-900">{slaMetrics.avgResponseMs}ms</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-amber-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Incidents</p>
            <p className="text-3xl font-serif text-slate-900">{slaMetrics.incidentCount}</p>
            <p className="text-xs font-sans text-slate-500">This month</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-teal-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Resolution Rate</p>
            <p className="text-3xl font-serif text-slate-900">{resolutionRate}%</p>
          </div>
        </Card>
      </div>

      {/* Uptime trend chart */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">Uptime Trend (12 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={uptimeTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis
              domain={[99.85, 100]}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => `${Number(value)}%`}
            />
            <ReferenceLine
              y={slaMetrics.slaTarget}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={{ value: 'SLA Target', position: 'right', fill: '#f59e0b', fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="uptime"
              stroke="#0891b2"
              strokeWidth={2}
              dot={{ fill: '#0891b2', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Incident log */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">Recent Incidents</h3>
        <DataTable
          columns={incidentColumns}
          data={incidents}
          emptyMessage="No incidents recorded"
          pageSize={10}
        />
      </Card>
    </div>
  );
}
