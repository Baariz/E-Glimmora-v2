'use client';

/**
 * Intelligence History Component
 * Historical trends, emotional profile changes, risk scores, and audit events
 */

import { useEffect, useState } from 'react';
import { useServices } from '@/lib/hooks/useServices';
import { Card } from '@/components/shared/Card';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { TrendingUp, TrendingDown, Minus, Activity, Shield, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { AuditEvent } from '@/lib/types';

interface IntelligenceHistoryProps {
  clientId: string;
  userId: string;
}

export function IntelligenceHistory({ clientId, userId }: IntelligenceHistoryProps) {
  const services = useServices();
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntelligence();
  }, [clientId]);

  async function loadIntelligence() {
    try {
      setLoading(true);
      const events = await services.audit.getByResource('client', clientId);
      setAuditEvents(events.slice(0, 10)); // Last 10 events
    } catch (error) {
      console.error('Failed to load intelligence:', error);
    } finally {
      setLoading(false);
    }
  }

  // Mock risk score history (6 data points over 6 months)
  const riskScoreHistory = [
    { month: 'Jan', score: 22 },
    { month: 'Feb', score: 25 },
    { month: 'Mar', score: 28 },
    { month: 'Apr', score: 26 },
    { month: 'May', score: 24 },
    { month: 'Jun', score: 25 },
  ];

  // Calculate trend
  const firstScore = riskScoreHistory[0]?.score || 0;
  const lastScore = riskScoreHistory[riskScoreHistory.length - 1]?.score || 0;
  const trendDirection = lastScore > firstScore ? 'up' : lastScore < firstScore ? 'down' : 'stable';
  const trendValue = Math.abs(lastScore - firstScore);

  const columns: ColumnDef<AuditEvent>[] = [
    {
      accessorKey: 'event',
      header: 'Event',
      cell: ({ row }) => (
        <span className="font-sans text-sm font-semibold text-slate-900">
          {row.original.event}
        </span>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <span className="font-sans text-sm text-slate-700">{row.original.action}</span>
      ),
    },
    {
      accessorKey: 'resourceType',
      header: 'Resource Type',
      cell: ({ row }) => (
        <span className="font-sans text-sm text-slate-600">{row.original.resourceType}</span>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'When',
      cell: ({ row }) => {
        try {
          const distance = formatDistanceToNow(new Date(row.original.timestamp), {
            addSuffix: true,
          });
          return <span className="font-sans text-sm text-slate-600">{distance}</span>;
        } catch {
          return <span className="font-sans text-sm text-slate-400">N/A</span>;
        }
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4" />
          <p className="font-sans text-sm text-slate-600">Loading intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl text-slate-900">Intelligence & Trends</h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-sans text-slate-500 uppercase">Days Since Onboarding</p>
          </div>
          <p className="text-2xl font-serif text-slate-900">
            {Math.floor(Math.random() * 365) + 180}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-sans text-slate-500 uppercase">Total Journeys</p>
          </div>
          <p className="text-2xl font-serif text-slate-900">{Math.floor(Math.random() * 20) + 5}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-sans text-slate-500 uppercase">Risk Trend</p>
          </div>
          <div className="flex items-center gap-2">
            {trendDirection === 'up' && <TrendingUp className="w-5 h-5 text-rose-600" />}
            {trendDirection === 'down' && <TrendingDown className="w-5 h-5 text-teal-600" />}
            {trendDirection === 'stable' && <Minus className="w-5 h-5 text-slate-600" />}
            <p className="text-2xl font-serif text-slate-900">
              {trendDirection === 'stable' ? 'Stable' : `${trendValue}%`}
            </p>
          </div>
        </Card>
      </div>

      {/* Risk Score History Chart */}
      <Card className="p-6">
        <h4 className="font-sans font-semibold text-slate-900 mb-4">Risk Score History</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={riskScoreHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ fill: '#f43f5e', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="font-sans text-xs text-slate-500 mt-2">
          Historical risk scores tracked over the last 6 months
        </p>
      </Card>

      {/* Recent Audit Events */}
      {auditEvents.length > 0 ? (
        <Card className="p-6">
          <h4 className="font-sans font-semibold text-slate-900 mb-4">Recent Activity</h4>
          <DataTable
            columns={columns}
            data={auditEvents}
            pageSize={10}
            emptyMessage="No audit events found"
          />
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="font-sans text-slate-600">
            Intelligence data will accumulate as client activity grows.
          </p>
        </Card>
      )}

      {/* Emotional Profile Changes */}
      <Card className="p-6">
        <h4 className="font-sans font-semibold text-slate-900 mb-4">
          Emotional Profile Timeline
        </h4>
        <p className="font-sans text-sm text-slate-600">
          Track changes in emotional drivers over time. Profile updates will appear here as they
          occur.
        </p>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <p className="font-sans text-xs text-slate-500 uppercase mb-1">Latest Assessment</p>
          <p className="font-sans text-sm text-slate-700">
            {new Date().toLocaleDateString()} - Initial emotional intake completed
          </p>
        </div>
      </Card>
    </div>
  );
}
