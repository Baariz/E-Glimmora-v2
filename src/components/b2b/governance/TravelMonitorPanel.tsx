'use client';

/**
 * Travel Monitor Panel — Advisor / Operations View
 * Silent background monitoring of live journey
 * NEVER shown to UHNI. This is internal only.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Plane, Car, Building2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { TravelMonitor } from '@/lib/types/entities';

interface TravelMonitorPanelProps {
  journeyId: string;
}

const statusIcon = (status?: string) => {
  const s = status || '';
  if (['Delayed', 'Pending'].includes(s)) return <AlertCircle size={14} className="text-amber-400" />;
  return <CheckCircle size={14} className="text-emerald-400" />;
};

const statusClass = (status?: string) =>
  ['Delayed', 'Pending'].includes(status || '') ? 'text-amber-400 bg-amber-900/30' : 'text-emerald-400 bg-emerald-900/30';

export function TravelMonitorPanel({ journeyId }: TravelMonitorPanelProps) {
  const services = useServices();
  const [monitor, setMonitor] = useState<TravelMonitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await services.journey.getMonitor(journeyId);
        if (!cancelled) setMonitor(data);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load travel monitor', err);
          setError('Unable to load travel monitor.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, journeyId]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-sans text-sm font-medium">Live Journey Monitor</span>
        </div>
        <span className="text-slate-500 text-xs font-sans">Internal — Not visible to client</span>
      </div>

      <div className="p-5 space-y-3">
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-sans py-4">
            <Loader2 size={14} className="animate-spin" /> Loading live monitor…
          </div>
        )}

        {error && !loading && (
          <p className="text-red-400 text-xs font-sans py-2">{error}</p>
        )}

        {!loading && !error && monitor && (
          <>
            {monitor.flight && (monitor.flight.number || monitor.flight.route) && (
              <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <Plane size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-white font-sans text-xs font-medium">
                      {[monitor.flight.number, monitor.flight.route].filter(Boolean).join(' — ')}
                    </span>
                    {monitor.flight.status && (
                      <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(monitor.flight.status))}>
                        {statusIcon(monitor.flight.status)} {monitor.flight.status}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 sm:gap-4 text-slate-400 text-xs flex-wrap">
                    {monitor.flight.departure && <span>Dep: {monitor.flight.departure}</span>}
                    {monitor.flight.arrival && <span>Arr: {monitor.flight.arrival}</span>}
                    {monitor.flight.terminal && <span>{monitor.flight.terminal}</span>}
                  </div>
                </div>
              </div>
            )}

            {monitor.transfer && (monitor.transfer.route || monitor.transfer.driver) && (
              <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <Car size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-white font-sans text-xs font-medium">{monitor.transfer.route}</span>
                    {monitor.transfer.status && (
                      <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(monitor.transfer.status))}>
                        {statusIcon(monitor.transfer.status)} {monitor.transfer.status}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 text-slate-400 text-xs flex-wrap">
                    {monitor.transfer.driver && <span>{monitor.transfer.driver}</span>}
                    {monitor.transfer.vehicle && <span>{monitor.transfer.vehicle}</span>}
                    {monitor.transfer.contact && <span>{monitor.transfer.contact}</span>}
                    {monitor.transfer.eta && <span>ETA: {monitor.transfer.eta}</span>}
                  </div>
                </div>
              </div>
            )}

            {monitor.accommodation && monitor.accommodation.property && (
              <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <Building2 size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-white font-sans text-xs font-medium">
                      {[monitor.accommodation.property, monitor.accommodation.room].filter(Boolean).join(' — ')}
                    </span>
                    {monitor.accommodation.status && (
                      <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(monitor.accommodation.status))}>
                        {statusIcon(monitor.accommodation.status)} {monitor.accommodation.status}
                      </span>
                    )}
                  </div>
                  {monitor.accommodation.note && (
                    <div className="text-slate-400 text-xs">{monitor.accommodation.note}</div>
                  )}
                </div>
              </div>
            )}

            {(!monitor.alerts || monitor.alerts.length === 0) ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-sans">All systems nominal. No alerts.</span>
              </div>
            ) : (
              monitor.alerts.map((alert, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-amber-900/20 border border-amber-700/30 rounded-lg">
                  <AlertCircle size={14} className="text-amber-400" />
                  <span className="text-amber-400 text-xs font-sans">{alert}</span>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
