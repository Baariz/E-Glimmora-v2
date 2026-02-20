'use client';

import { Card } from '@/components/shared/Card';
import { AlertTriangle, Info, AlertCircle, Check, Clock, Shield, FileWarning } from 'lucide-react';
import type { VendorAlert } from '@/lib/types';

interface VendorAlertsListProps {
  alerts: VendorAlert[];
  onAcknowledge: (alertId: string) => void;
}

const severityConfig: Record<string, { bg: string; text: string }> = {
  critical: { bg: 'bg-rose-50', text: 'text-rose-700' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700' },
  info: { bg: 'bg-blue-50', text: 'text-blue-700' },
};

const typeLabels: Record<string, string> = {
  screening_expiry: 'Screening Expiry',
  sla_breach: 'SLA Breach',
  financial_deterioration: 'Financial Risk',
  security_incident: 'Security Incident',
  contract_expiry: 'Contract Expiry',
};

export function VendorAlertsList({ alerts, onAcknowledge }: VendorAlertsListProps) {
  const sorted = [...alerts].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1;
    const order = { critical: 0, warning: 1, info: 2 };
    return (order[a.severity] ?? 2) - (order[b.severity] ?? 2);
  });

  if (sorted.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No vendor alerts</p>;
  }

  return (
    <div className="space-y-3">
      {sorted.map(alert => {
        const config = severityConfig[alert.severity] ?? { bg: 'bg-blue-50', text: 'text-blue-700' };
        return (
          <Card key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <AlertTriangle className={`w-4 h-4 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{alert.title}</h4>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${config.bg} ${config.text}`}>
                    {alert.severity}
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans bg-slate-100 text-slate-600">
                    {typeLabels[alert.type] || alert.type}
                  </span>
                </div>
                <p className="font-sans text-xs text-slate-600 mt-1">{alert.message}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-sans text-[10px] text-slate-400">{alert.vendorName}</span>
                  <span className="font-sans text-[10px] text-slate-400">{new Date(alert.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {alert.acknowledged ? (
                  <span className="inline-flex items-center gap-1 text-xs font-sans text-teal-600">
                    <Check className="w-3 h-3" /> Done
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
