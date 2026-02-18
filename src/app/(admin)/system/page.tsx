'use client';

/**
 * System Health Monitoring Page
 * Super Admin can view platform uptime, error rates, response times, and health trends
 */

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity, AlertCircle, Clock, Users } from 'lucide-react';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { Card } from '@/components/shared/Card';
import { useServices } from '@/lib/hooks/useServices';
import type { SystemMetrics, HealthTimePoint } from '@/lib/services/interfaces/ISystemHealthService';
import { toast } from 'sonner';

/**
 * System Health Monitoring Page
 * Real-time metrics and historical trends
 */
export default function SystemHealthPage() {
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [timeline, setTimeline] = useState<HealthTimePoint[]>([]);

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const [currentMetrics, healthTimeline] = await Promise.all([
        services.systemHealth.getCurrentMetrics(),
        services.systemHealth.getHealthTimeline(24),
      ]);
      setMetrics(currentMetrics);
      setTimeline(healthTimeline);
    } catch (error) {
      console.error('Failed to load system health:', error);
      toast.error('Failed to load system health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
  }, []);

  // Determine status color based on thresholds
  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-teal-600';
    if (uptime >= 99.5) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate < 0.1) return 'text-teal-600';
    if (errorRate < 0.5) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 200) return 'text-teal-600';
    if (responseTime < 500) return 'text-amber-600';
    return 'text-rose-600';
  };

  // Overall system status
  const getOverallStatus = () => {
    if (!metrics) return { text: 'Loading...', color: 'text-slate-500', dot: 'bg-slate-400' };
    if (metrics.uptime >= 99.9 && metrics.errorRate < 0.1 && metrics.avgResponseTime < 200) {
      return { text: 'All Systems Operational', color: 'text-teal-600', dot: 'bg-teal-500' };
    }
    if (metrics.uptime >= 99.5 && metrics.errorRate < 0.5 && metrics.avgResponseTime < 500) {
      return { text: 'Minor Issues Detected', color: 'text-amber-600', dot: 'bg-amber-500' };
    }
    return { text: 'System Degraded', color: 'text-rose-600', dot: 'bg-rose-500' };
  };

  const status = getOverallStatus();

  // Stats cards
  const stats: StatCard[] = metrics
    ? [
        {
          label: 'Uptime',
          value: `${metrics.uptime.toFixed(2)}%`,
          colorClass: 'from-white to-teal-50',
        },
        {
          label: 'Error Rate',
          value: `${metrics.errorRate.toFixed(2)}%`,
          colorClass: 'from-white to-rose-50',
        },
        {
          label: 'Avg Response Time',
          value: `${Math.round(metrics.avgResponseTime)}ms`,
          colorClass: 'from-white to-blue-50',
        },
        {
          label: 'Active Sessions',
          value: metrics.activeSessions,
          colorClass: 'from-white to-purple-50',
        },
      ]
    : [];

  // Format timeline for charts
  const chartData = timeline.map((point) => ({
    time: new Date(point.time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    uptime: point.uptime,
    errorRate: point.errorRate,
    responseTime: point.responseTime,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-slate-900">System Health</h1>
        <p className="text-sm font-sans text-slate-600 mt-1">
          Platform monitoring and performance metrics
        </p>
      </div>

      {/* Status Indicator */}
      <Card className="bg-gradient-to-br from-white to-slate-50">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${status.dot} animate-pulse`} />
          <span className={`text-lg font-sans font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>
      </Card>

      {/* Stats */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 font-sans">
          Loading system metrics...
        </div>
      ) : (
        <>
          <StatsRow stats={stats} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Uptime Chart */}
            <Card>
              <h3 className="text-lg font-sans font-medium text-slate-900 mb-4">
                Uptime (24 hours)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[99.5, 100]}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uptime"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    fill="url(#uptimeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Error Rate Chart */}
            <Card>
              <h3 className="text-lg font-sans font-medium text-slate-900 mb-4">
                Error Rate (24 hours)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 0.1]}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="errorRate"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-white to-blue-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-sans text-slate-600">API Calls Today</p>
                  <p className="text-3xl font-serif text-slate-900 mt-2">
                    {metrics?.apiCallsToday.toLocaleString()}
                  </p>
                </div>
                <Activity className="text-blue-500" size={24} />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-sans text-slate-600">Storage Used</p>
                  <p className="text-3xl font-serif text-slate-900 mt-2">
                    {metrics?.storageUsedGB.toFixed(1)} GB
                  </p>
                  <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((metrics?.storageUsedGB || 0) /
                            (metrics?.storageCapacityGB || 100)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-xs font-sans text-slate-500 mt-1">
                    of {metrics?.storageCapacityGB} GB capacity
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-white to-amber-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-sans text-slate-600">Avg Response Time</p>
                  <p className="text-3xl font-serif text-slate-900 mt-2">
                    {Math.round(metrics?.avgResponseTime || 0)}
                    <span className="text-base text-slate-600"> ms</span>
                  </p>
                </div>
                <Clock className="text-amber-500" size={24} />
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
