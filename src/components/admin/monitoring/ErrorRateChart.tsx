/**
 * Error Rate Chart Component
 * Recharts LineChart for visualizing error rate over time
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/shared/Card';
import type { HealthTimePoint } from '@/lib/services/interfaces/ISystemHealthService';

interface ErrorRateChartProps {
  data: HealthTimePoint[];
  title?: string;
  height?: number;
}

export function ErrorRateChart({
  data,
  title = 'Error Rate',
  height = 300,
}: ErrorRateChartProps) {
  // Format data for chart
  const chartData = data.map((point) => ({
    time: new Date(point.time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    errorRate: point.errorRate,
  }));

  return (
    <Card>
      <h3 className="text-lg font-sans font-medium text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
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
            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            formatter={(value) => [
              `${(Number(value) * 100).toFixed(2)}%`,
              'Error Rate',
            ]}
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
  );
}
