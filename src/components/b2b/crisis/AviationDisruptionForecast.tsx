'use client';

import { Card } from '@/components/shared/Card';
import { Plane, MapPin } from 'lucide-react';
import type { AviationDisruption } from '@/lib/types';

interface AviationDisruptionForecastProps {
  disruptions: AviationDisruption[];
}

const typeIcons: Record<string, string> = {
  Weather: '🌪️',
  Strike: '✊',
  Geopolitical: '🌐',
  Infrastructure: '🏗️',
  Health: '🏥',
  Security: '🔒',
};

const threatBg: Record<string, string> = {
  Low: 'bg-teal-50 text-teal-700',
  Moderate: 'bg-amber-50 text-amber-700',
  High: 'bg-orange-50 text-orange-700',
  Critical: 'bg-rose-50 text-rose-700',
  Extreme: 'bg-red-50 text-red-800',
};

export function AviationDisruptionForecast({ disruptions }: AviationDisruptionForecastProps) {
  if (disruptions.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No aviation disruptions recorded</p>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-sans">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Type</th>
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Title</th>
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Regions</th>
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Airports</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Threat</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Probability</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Impact (h)</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Clients</th>
              <th className="text-left py-2 px-3 text-slate-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {disruptions.map(d => (
              <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2.5 px-3">
                  <span className="text-base">{typeIcons[d.type] || '⚠️'}</span>
                  <span className="ml-1 text-slate-600">{d.type}</span>
                </td>
                <td className="py-2.5 px-3 text-slate-900 font-medium max-w-[200px] truncate">{d.title}</td>
                <td className="py-2.5 px-3 text-slate-600">{d.affectedRegions.join(', ')}</td>
                <td className="py-2.5 px-3 text-slate-600">{d.affectedAirports.join(', ')}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${threatBg[d.threatLevel]}`}>
                    {d.threatLevel}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-slate-900 font-medium">{d.probabilityPercent}%</td>
                <td className="py-2.5 px-3 text-center text-slate-600">{d.estimatedImpactHours}</td>
                <td className="py-2.5 px-3 text-center text-slate-900 font-medium">{d.affectedClients.length}</td>
                <td className="py-2.5 px-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    d.status === 'Active' ? 'bg-rose-100 text-rose-700' :
                    d.status === 'Monitoring' ? 'bg-blue-100 text-blue-700' :
                    d.status === 'Resolved' ? 'bg-teal-100 text-teal-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
