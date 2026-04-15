'use client';

/**
 * NotificationBell — Feature #5 (UI only)
 * Surfaces real-time travel assistance events. Currently backed by the
 * existing /api/intelligence/feed (aviation disruptions, travel advisories).
 * When a dedicated /api/notifications endpoint ships, swap the source.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Plane, Hotel, MapPinned, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { TravelNotification, IntelligenceFeedItem } from '@/lib/types/entities';

interface NotificationBellProps {
  invert?: boolean;
}

const KIND_ICON: Record<TravelNotification['kind'], React.ElementType> = {
  flight_delay: Plane,
  hotel_change: Hotel,
  activity_availability: MapPinned,
  itinerary_adjust: Sparkles,
  info: AlertTriangle,
};

function mapFeedItem(i: IntelligenceFeedItem): TravelNotification {
  let kind: TravelNotification['kind'] = 'info';
  if (i.type === 'AVIATION_DISRUPTION') kind = 'flight_delay';
  else if (i.type === 'PREDICTIVE_ALERT') kind = 'itinerary_adjust';
  const sev = i.severity.toUpperCase();
  const severity: TravelNotification['severity'] =
    sev === 'CRITICAL' || sev === 'HIGH' ? 'critical' : sev === 'MEDIUM' ? 'warning' : 'info';
  return {
    id: i.id,
    kind,
    title: i.title,
    body: i.summary,
    severity,
    created_at: i.created_at,
    related_journey_id: i.related_journey_id,
  };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell({ invert = false }: NotificationBellProps) {
  const services = useServices();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<TravelNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const feed = await services.briefing.getIntelligenceFeed();
        if (cancelled) return;
        setItems((feed.items ?? []).slice(0, 15).map(mapFeedItem));
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load notifications', err);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const unread = items.filter((i) => !i.read).length;

  const bellCls = invert ? 'text-white/90 hover:text-white' : 'text-rose-900 hover:text-rose-700';

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2 rounded-full transition-colors ${bellCls}`}
        aria-label="Notifications"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 text-[9px] font-sans font-bold rounded-full bg-rose-600 text-white flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-sand-200 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-sand-100 flex items-center justify-between">
            <p className="font-sans text-sm font-semibold text-rose-900">Travel Assistant</p>
            <Link href="/intelligence" className="text-[10px] font-sans uppercase tracking-[3px] text-sand-500 hover:text-sand-700">
              View feed
            </Link>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading && (
              <div className="p-5 text-center text-sand-500 text-sm font-sans">Loading…</div>
            )}
            {error && !loading && (
              <div className="p-5 text-center text-rose-700 text-sm font-sans">Unable to load notifications.</div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-sans text-sm text-rose-900">All clear</p>
                <p className="font-sans text-xs text-sand-500 mt-1">Nothing requires your attention.</p>
              </div>
            )}
            {!loading && !error && items.map((n) => {
              const Icon = KIND_ICON[n.kind];
              const sevCls =
                n.severity === 'critical'
                  ? 'bg-rose-50 text-rose-700'
                  : n.severity === 'warning'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-sand-50 text-sand-700';
              return (
                <Link
                  key={n.id}
                  href={n.related_journey_id ? `/journeys/${n.related_journey_id}` : '/intelligence'}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-sand-50 transition-colors border-b border-sand-100 last:border-b-0"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${sevCls}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-slate-800 font-medium truncate">{n.title}</p>
                    <p className="font-sans text-xs text-sand-600 line-clamp-2 mt-0.5">{n.body}</p>
                    <p className="font-sans text-[10px] text-sand-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
