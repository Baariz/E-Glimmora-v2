/**
 * System Health Card Component
 * Summary card with status indicator for system health overview
 */

import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import type { SystemMetrics } from '@/lib/services/interfaces/ISystemHealthService';

interface SystemHealthCardProps {
  metrics: SystemMetrics;
}

export function SystemHealthCard({ metrics }: SystemHealthCardProps) {
  // Determine overall health status
  const getHealthStatus = () => {
    if (
      metrics.uptime >= 99.9 &&
      metrics.errorRate < 0.1 &&
      metrics.avgResponseTime < 200
    ) {
      return {
        status: 'healthy',
        label: 'Healthy',
        icon: CheckCircle,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
      };
    }

    if (
      metrics.uptime >= 99.5 &&
      metrics.errorRate < 0.5 &&
      metrics.avgResponseTime < 500
    ) {
      return {
        status: 'degraded',
        label: 'Degraded',
        icon: AlertTriangle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
      };
    }

    return {
      status: 'critical',
      label: 'Critical',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
    };
  };

  const health = getHealthStatus();
  const StatusIcon = health.icon;

  return (
    <Card className={`${health.bgColor} border-2 ${health.borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <StatusIcon className={health.color} size={24} />
            <h3 className={`text-lg font-sans font-medium ${health.color}`}>
              {health.label}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs font-sans text-slate-600 mb-1">Uptime</p>
              <p className="text-xl font-serif text-slate-900">
                {metrics.uptime.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs font-sans text-slate-600 mb-1">Error Rate</p>
              <p className="text-xl font-serif text-slate-900">
                {metrics.errorRate.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs font-sans text-slate-600 mb-1">Response Time</p>
              <p className="text-xl font-serif text-slate-900">
                {Math.round(metrics.avgResponseTime)}ms
              </p>
            </div>
            <div>
              <p className="text-xs font-sans text-slate-600 mb-1">Active Sessions</p>
              <p className="text-xl font-serif text-slate-900">
                {metrics.activeSessions}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-full ${health.bgColor}`}>
          <Activity className={health.color} size={28} />
        </div>
      </div>
    </Card>
  );
}
