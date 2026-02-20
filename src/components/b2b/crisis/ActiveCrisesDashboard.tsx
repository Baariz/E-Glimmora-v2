'use client';

import { Card } from '@/components/shared/Card';
import { AlertTriangle, MapPin, Users, Clock } from 'lucide-react';
import type { AviationDisruption } from '@/lib/types';

interface ActiveCrisesDashboardProps {
  disruptions: AviationDisruption[];
}

const statusColors: Record<string, string> = {
  Monitoring: 'bg-blue-100 text-blue-800',
  Active: 'bg-rose-100 text-rose-800',
  Escalated: 'bg-red-100 text-red-800',
  Resolved: 'bg-teal-100 text-teal-800',
  Archived: 'bg-slate-100 text-slate-600',
};

const threatColors: Record<string, string> = {
  Low: 'text-teal-600',
  Moderate: 'text-amber-600',
  High: 'text-orange-600',
  Critical: 'text-rose-600',
  Extreme: 'text-red-700',
};

export function ActiveCrisesDashboard({ disruptions }: ActiveCrisesDashboardProps) {
  const active = disruptions.filter(d => d.status !== 'Resolved' && d.status !== 'Archived');

  if (active.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No active crises — all clear</p>;
  }

  return (
    <div className="space-y-4">
      {active.map(d => (
        <Card key={d.id}>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-50">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{d.title}</h4>
                  <p className="font-sans text-xs text-slate-600 mt-0.5">{d.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${statusColors[d.status]}`}>
                  {d.status}
                </span>
                <span className={`font-sans text-xs font-semibold ${threatColors[d.threatLevel]}`}>
                  {d.threatLevel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3 h-3" />
                <span>{d.affectedRegions.join(', ')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="text-slate-400">Airports:</span>
                <span>{d.affectedAirports.join(', ')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Users className="w-3 h-3" />
                <span>{d.affectedClients.length} clients affected</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3 h-3" />
                <span>Est. {d.estimatedImpactHours}h impact</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-[10px] font-sans text-slate-400">
              <span>Type: {d.type}</span>
              <span>Probability: {d.probabilityPercent}%</span>
              <span>Source: {d.forecastSource}</span>
              <span>Created: {new Date(d.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
