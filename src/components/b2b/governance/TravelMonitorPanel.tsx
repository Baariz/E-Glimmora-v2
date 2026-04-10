'use client';

/**
 * Travel Monitor Panel — Advisor / Operations View
 * Silent background monitoring of live journey
 * Dense, operational, professional — like a quiet control room
 * NEVER shown to UHNI. This is internal only.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Plane, Car, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { TravelMonitor } from '@/lib/types';

interface TravelMonitorPanelProps {
  journeyId: string;
}

const FALLBACK_DATA: TravelMonitor = {
  journeyId: '',
  flight: { number: '—', route: 'No flight data', status: 'Pending', departure: '—', arrival: '—' },
  transfer: { type: 'Ground Transfer', route: 'No transfer data', status: 'Pending' },
  accommodation: { property: 'No accommodation data', room: '—', status: 'Pending' },
  alerts: [],
  updatedAt: new Date().toISOString(),
};

const statusIcon = (status: string) => {
  if (['Delayed', 'Pending'].includes(status)) return <AlertCircle size={14} className="text-amber-400" />;
  return <CheckCircle size={14} className="text-emerald-400" />;
};

const statusClass = (status: string) =>
  ['Delayed', 'Pending'].includes(status) ? 'text-amber-400 bg-amber-900/30' : 'text-emerald-400 bg-emerald-900/30';

export function TravelMonitorPanel({ journeyId }: TravelMonitorPanelProps) {
  const services = useServices();
  const [data, setData] = useState<TravelMonitor>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMonitor() {
      try {
        const monitor = await services.journey.getTravelMonitor(journeyId);
        if (monitor) setData(monitor);
      } catch {
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    }
    loadMonitor();
  }, [journeyId, services]);

  const { flight, transfer, accommodation, alerts } = data;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse')} />
          <span className="text-slate-300 font-sans text-sm font-medium">Live Journey Monitor</span>
        </div>
        <span className="text-slate-500 text-xs font-sans">Internal — Not visible to client</span>
      </div>

      <div className="p-5 space-y-3">
        {/* Flight */}
        {flight && (
          <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
            <Plane size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-white font-sans text-xs font-medium">{flight.number} — {flight.route}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(flight.status))}>
                  {statusIcon(flight.status)} {flight.status}
                </span>
              </div>
              <div className="flex gap-2 sm:gap-4 text-slate-400 text-xs flex-wrap">
                <span>Dep: {flight.departure}</span>
                <span>Arr: {flight.arrival}</span>
              </div>
            </div>
          </div>
        )}

        {/* Transfer */}
        {transfer && (
          <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
            <Car size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-white font-sans text-xs font-medium">{transfer.route}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(transfer.status))}>
                  {statusIcon(transfer.status)} {transfer.status}
                </span>
              </div>
              <div className="flex gap-4 text-slate-400 text-xs flex-wrap">
                {transfer.driver && <span>{transfer.driver}</span>}
                {transfer.vehicle && <span>{transfer.vehicle}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Accommodation */}
        {accommodation && (
          <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
            <Building2 size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-white font-sans text-xs font-medium">{accommodation.property} — {accommodation.room}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(accommodation.status))}>
                  {statusIcon(accommodation.status)} {accommodation.status}
                </span>
              </div>
              {accommodation.note && <div className="text-slate-400 text-xs">{accommodation.note}</div>}
            </div>
          </div>
        )}

        {/* Alerts or all-clear */}
        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-sans">All systems nominal. No alerts.</span>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-amber-900/20 border border-amber-700/30 rounded-lg">
              <AlertCircle size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-sans">{alert}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
