'use client';

/**
 * Travel Monitor Panel — Advisor / Operations View
 * Phase 4 §7: EXECUTED journeys only; INTERNAL view — never shown to UHNI.
 *
 * Renders 4 operational status cards (flight, accommodation, ground transfer,
 * security), linked package summary, and the pre-departure brief summary.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  Plane,
  Building2,
  Car,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
  Package as PackageIcon,
  FileText,
} from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { TravelMonitor, TravelMonitorStatusCard } from '@/lib/types/entities';
import { logger } from '@/lib/utils/logger';

interface TravelMonitorPanelProps {
  journeyId: string;
}

// ── Status → visual level ────────────────────────────────────────────

function levelFor(status: string): 'green' | 'amber' | 'red' {
  const s = status.toLowerCase();
  if (
    s.includes('disrupt') ||
    s.includes('alert') ||
    s.includes('fail') ||
    s === 'red'
  ) {
    return 'red';
  }
  if (
    s.includes('delay') ||
    s.includes('advisory') ||
    s.includes('pending') ||
    s.includes('partial')
  ) {
    return 'amber';
  }
  return 'green';
}

const LEVEL_STYLES: Record<
  'green' | 'amber' | 'red',
  { badge: string; icon: React.ReactNode }
> = {
  green: {
    badge: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/30',
    icon: <CheckCircle size={12} />,
  },
  amber: {
    badge: 'text-amber-400 bg-amber-900/30 border-amber-700/30',
    icon: <AlertCircle size={12} />,
  },
  red: {
    badge: 'text-rose-400 bg-rose-900/30 border-rose-700/30',
    icon: <AlertCircle size={12} />,
  },
};

interface StatusCardProps {
  label: string;
  icon: React.ReactNode;
  card: TravelMonitorStatusCard;
}

function StatusCard({ label, icon, card }: StatusCardProps) {
  const level = levelFor(card.status);
  const style = LEVEL_STYLES[level];
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
      <div className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-slate-300 font-sans text-[11px] uppercase tracking-wider">
            {label}
          </span>
          <span
            className={cn(
              'text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-sans',
              style.badge
            )}
          >
            {style.icon}
            {card.status}
          </span>
        </div>
        <p className="text-slate-400 text-xs font-sans leading-relaxed">
          {card.details}
        </p>
      </div>
    </div>
  );
}

// ── Panel ────────────────────────────────────────────────────────────

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
          logger.error('TravelMonitor', 'load failed', err, { journeyId });
          setError('Unable to load travel monitor.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [services, journeyId]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
            )}
          />
          <span className="text-slate-300 font-sans text-sm font-medium">
            Live Journey Monitor
          </span>
        </div>
        <span className="text-slate-500 text-xs font-sans">
          Internal — Not visible to client
        </span>
      </div>

      <div className="p-5 space-y-4">
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-sans py-4">
            <Loader2 size={14} className="animate-spin" /> Loading live monitor…
          </div>
        )}

        {error && !loading && (
          <p className="text-rose-400 text-xs font-sans py-2">{error}</p>
        )}

        {!loading && !error && monitor && (
          <>
            {/* Linked package */}
            {monitor.package && (
              <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                <PackageIcon size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 font-sans text-xs font-medium mb-0.5">
                    {monitor.package.packageName}
                  </p>
                  <p className="text-slate-500 text-[11px] font-sans">
                    {monitor.package.duration} · {monitor.package.region}
                  </p>
                </div>
              </div>
            )}

            {/* 4 operational status cards (Phase 4 §7) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatusCard
                label="Flight"
                icon={<Plane size={16} />}
                card={monitor.operationalStatus.flight}
              />
              <StatusCard
                label="Accommodation"
                icon={<Building2 size={16} />}
                card={monitor.operationalStatus.accommodation}
              />
              <StatusCard
                label="Ground Transfer"
                icon={<Car size={16} />}
                card={monitor.operationalStatus.groundTransfer}
              />
              <StatusCard
                label="Security"
                icon={<ShieldCheck size={16} />}
                card={monitor.operationalStatus.security}
              />
            </div>

            {/* Pre-departure brief summary (advisor-side — full view including internal notes) */}
            {monitor.preDepartureBrief && (
              <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText size={12} className="text-slate-500" />
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-sans">
                    Brief
                    {monitor.preDepartureBrief.autoGenerated && (
                      <span className="ml-2 text-amber-400/80 normal-case tracking-normal">
                        (AI-generated)
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-slate-300 text-xs font-sans leading-relaxed whitespace-pre-wrap">
                  {monitor.preDepartureBrief.summary}
                </p>
                {monitor.preDepartureBrief.advisorNotes && (
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-amber-400/80 text-[10px] uppercase tracking-wider font-sans mb-1">
                      Advisor notes (internal)
                    </p>
                    <p className="text-slate-400 text-xs font-sans leading-relaxed">
                      {monitor.preDepartureBrief.advisorNotes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Last updated */}
            <p className="text-slate-500 text-[10px] font-sans text-right">
              Updated {new Date(monitor.lastUpdated).toLocaleString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
