'use client';

/**
 * Usage Metrics Component (REVN-04)
 * Platform usage statistics and trends
 */

import { Card } from '@/components/shared/Card';
import { UsageMetrics as UsageMetricsType } from '@/lib/services/interfaces/IContractService';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageMetricsProps {
  metrics: UsageMetricsType;
}

export function UsageMetrics({ metrics }: UsageMetricsProps) {
  const storagePercent = Math.round((metrics.storageUsedMB / metrics.storageCapacityMB) * 100);

  // Mock monthly active users trend (6 months)
  const activeUsersTrend = [
    { month: 'Aug', users: 198 },
    { month: 'Sep', users: 215 },
    { month: 'Oct', users: 227 },
    { month: 'Nov', users: 233 },
    { month: 'Dec', users: 241 },
    { month: 'Jan', users: metrics.activeUsers },
  ];

  // Mock API calls trend (6 months)
  const apiCallsTrend = [
    { month: 'Aug', calls: 9800 },
    { month: 'Sep', calls: 10500 },
    { month: 'Oct', calls: 11200 },
    { month: 'Nov', calls: 11800 },
    { month: 'Dec', calls: 12100 },
    { month: 'Jan', calls: metrics.apiCalls },
  ];

  // Mock top features usage
  const topFeatures = [
    { feature: 'Vault Access', uses: 156 },
    { feature: 'Journey Generation', uses: 89 },
    { feature: 'Client Onboarding', uses: 34 },
    { feature: 'Risk Assessment', uses: 67 },
    { feature: 'Compliance Review', uses: 42 },
  ];

  return (
    <div className="space-y-6">
      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-white to-blue-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Active Users</p>
            <p className="text-3xl font-serif text-slate-900">{metrics.activeUsers}</p>
            <p className="text-xs font-sans text-slate-500">
              of {metrics.totalUsers} total
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-teal-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">API Calls</p>
            <p className="text-3xl font-serif text-slate-900">
              {metrics.apiCalls.toLocaleString()}
            </p>
            <p className="text-xs font-sans text-slate-500">This month</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-purple-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Journeys Created</p>
            <p className="text-3xl font-serif text-slate-900">{metrics.journeysCreated}</p>
          </div>
        </Card>
      </div>

      {/* Storage utilization */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">Storage Utilization</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-sans">
            <span className="text-slate-600">
              {metrics.storageUsedMB} MB used of {metrics.storageCapacityMB} MB
            </span>
            <span className="font-medium text-slate-900">{storagePercent}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                storagePercent > 80
                  ? 'bg-red-500'
                  : storagePercent > 60
                  ? 'bg-amber-500'
                  : 'bg-teal-500'
              }`}
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          {storagePercent > 80 && (
            <p className="text-xs font-sans text-amber-600">
              Storage usage is high. Consider upgrading capacity.
            </p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly active users chart */}
        <Card>
          <h3 className="text-lg font-serif text-slate-900 mb-4">Monthly Active Users</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activeUsersTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* API calls trend chart */}
        <Card>
          <h3 className="text-lg font-serif text-slate-900 mb-4">API Calls Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={apiCallsTrend}>
              <defs>
                <linearGradient id="colorAPICalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#0891b2"
                fillOpacity={1}
                fill="url(#colorAPICalls)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top features list */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">Top Features</h3>
        <div className="space-y-3">
          {topFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between pb-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-sans text-slate-600">{index + 1}</span>
                </div>
                <span className="font-sans text-sm text-slate-900">{feature.feature}</span>
              </div>
              <span className="font-medium text-sm text-slate-600">{feature.uses} uses</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
