'use client';

import { Card } from '@/components/shared/Card';
import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import type { PredictiveAlert } from '@/lib/types';

interface PredictiveAlertsListProps {
  alerts: PredictiveAlert[];
  onAcknowledge: (alertId: string) => void;
}

const severityConfig: Record<string, { icon: typeof AlertTriangle; bg: string; border: string; text: string }> = {
  critical: { icon: AlertTriangle, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
};

export function PredictiveAlertsList({ alerts, onAcknowledge }: PredictiveAlertsListProps) {
  const sorted = [...alerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
    return (order[a.severity] ?? 2) - (order[b.severity] ?? 2);
  });

  if (sorted.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No predictive alerts</p>;
  }

  return (
    <div className="space-y-3">
      {sorted.map(alert => {
        const defaultConfig = { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' } as const;
        const config = severityConfig[alert.severity] ?? defaultConfig;
        const Icon = config.icon;
        return (
          <Card key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{alert.title}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${config.bg} ${config.text}`}>
                    {alert.severity}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans bg-slate-100 text-slate-600">
                    {alert.type === 'travel_fatigue' ? 'Travel Fatigue' : 'Family Drift'}
                  </span>
                </div>
                <p className="font-sans text-xs text-slate-600 mt-1">{alert.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-sans text-[10px] text-slate-400">{alert.clientName}</span>
                  <span className="font-sans text-[10px] text-slate-400">
                    Confidence: {alert.confidence}%
                  </span>
                  <span className="font-sans text-[10px] text-slate-400">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {alert.acknowledged ? (
                  <span className="inline-flex items-center gap-1 text-xs font-sans text-teal-600">
                    <Check className="w-3 h-3" /> Acknowledged
                  </span>
                ) : (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1.5 text-xs font-sans font-medium text-rose-700 bg-rose-50 rounded-md hover:bg-rose-100 transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
