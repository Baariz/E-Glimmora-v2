'use client';

/**
 * Travel Monitor Panel — Advisor / Operations View
 * Silent background monitoring of live journey
 * Dense, operational, professional — like a quiet control room
 * NEVER shown to UHNI. This is internal only.
 */

import { cn } from '@/lib/utils/cn';
import { Plane, Car, Building2, AlertCircle, CheckCircle } from 'lucide-react';

const MOCK_TRAVEL_DATA = {
  flight: { number: 'EK 203', route: 'Dubai → London Heathrow', status: 'On Schedule' as const, departure: '14:30 GST', arrival: '18:45 GMT (Est.)', aircraft: 'Boeing 777-300ER', terminal: 'T3 Arrival' },
  transfer: { type: 'Ground Transfer', route: 'LHR Terminal 3 → Aman London', status: 'Confirmed' as const, driver: 'Marcus H.', vehicle: 'Mercedes S-Class (Tinted)', contact: '+44 7XXX XXXXXX', eta: '45 minutes from arrival' },
  accommodation: { property: 'Aman London', room: 'Aman Suite — 7th Floor', status: 'Ready' as const, checkIn: 'Private entrance briefed', note: 'Early arrival confirmed. Flowers arranged per preference profile.' },
  alerts: [] as string[],
};

const statusIcon = (status: 'On Schedule' | 'Confirmed' | 'Ready' | 'Delayed' | 'Pending') => {
  if (status === 'Delayed' || status === 'Pending') return <AlertCircle size={14} className="text-amber-400" />;
  return <CheckCircle size={14} className="text-emerald-400" />;
};

const statusClass = (status: string) =>
  ['Delayed', 'Pending'].includes(status) ? 'text-amber-400 bg-amber-900/30' : 'text-emerald-400 bg-emerald-900/30';

export function TravelMonitorPanel() {
  const { flight, transfer, accommodation, alerts } = MOCK_TRAVEL_DATA;

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
        {/* Flight */}
        <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <Plane size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-white font-sans text-xs font-medium">{flight.number} — {flight.route}</span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(flight.status))}>
                {statusIcon(flight.status)} {flight.status}
              </span>
            </div>
            <div className="flex gap-4 text-slate-400 text-xs">
              <span>Dep: {flight.departure}</span>
              <span>Arr: {flight.arrival}</span>
              <span>{flight.terminal}</span>
            </div>
          </div>
        </div>

        {/* Transfer */}
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
              <span>{transfer.driver}</span>
              <span>{transfer.vehicle}</span>
              <span>{transfer.contact}</span>
              <span>ETA: {transfer.eta}</span>
            </div>
          </div>
        </div>

        {/* Accommodation */}
        <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <Building2 size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-white font-sans text-xs font-medium">{accommodation.property} — {accommodation.room}</span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(accommodation.status))}>
                {statusIcon(accommodation.status)} {accommodation.status}
              </span>
            </div>
            <div className="text-slate-400 text-xs">{accommodation.note}</div>
          </div>
        </div>

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
