/**
 * Uptime Chart Component
 * Recharts AreaChart for visualizing system uptime over time
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/shared/Card';
import type { HealthTimePoint } from '@/lib/services/interfaces/ISystemHealthService';

interface UptimeChartProps {
  data: HealthTimePoint[];
  title?: string;
  height?: number;
}

export function UptimeChart({
  data,
  title = 'System Uptime',
  height = 300,
}: UptimeChartProps) {
  // Format data for chart
  const chartData = data.map((point) => ({
    time: new Date(point.time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    uptime: point.uptime,
  }));

  return (
    <Card>
      <h3 className="text-lg font-sans font-medium text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
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
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Uptime']}
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
  );
}
