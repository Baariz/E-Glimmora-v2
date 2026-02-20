'use client';

import { Card } from '@/components/shared/Card';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import type { ExternalIntegration } from '@/lib/types';

interface IntegrationStatusCardProps {
  integration: ExternalIntegration;
}

const statusDot: Record<string, string> = {
  Connected: 'bg-teal-500',
  Degraded: 'bg-amber-500',
  Disconnected: 'bg-rose-500',
  Configuring: 'bg-blue-500',
  Maintenance: 'bg-slate-400',
};

const statusBg: Record<string, string> = {
  Connected: 'bg-teal-50 text-teal-700',
  Degraded: 'bg-amber-50 text-amber-700',
  Disconnected: 'bg-rose-50 text-rose-700',
  Configuring: 'bg-blue-50 text-blue-700',
  Maintenance: 'bg-slate-100 text-slate-600',
};

function healthBarColor(score: number): string {
  if (score >= 80) return 'bg-teal-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

export function IntegrationStatusCard({ integration }: IntegrationStatusCardProps) {
  const i = integration;
  return (
    <Card>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusDot[i.status]}`} />
            <h5 className="font-sans text-xs font-semibold text-slate-900">{i.name}</h5>
          </div>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${statusBg[i.status]}`}>
            {i.status}
          </span>
        </div>
        <p className="font-sans text-[10px] text-slate-500">{i.provider}</p>

        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-sans text-[10px] text-slate-500">Health</span>
            <span className="font-sans text-[10px] text-slate-700 font-medium">{i.healthScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${healthBarColor(i.healthScore)}`} style={{ width: `${i.healthScore}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[10px] font-sans text-slate-500">
          <span>Sync: {i.syncFrequency}</span>
          <span>Records: {i.recordsSynced.toLocaleString()}</span>
          <span>Errors: {i.errorCount}</span>
          <span>Last: {i.lastSyncAt ? new Date(i.lastSyncAt).toLocaleDateString() : 'Never'}</span>
        </div>
      </div>
    </Card>
  );
}
