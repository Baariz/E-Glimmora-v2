'use client';

/**
 * DynamicItineraryBanner — Feature #7 (UI only)
 * Surfaces itinerary adjustments for a specific journey. Currently derives
 * signals from the intelligence feed (AVIATION_DISRUPTION, PREDICTIVE_ALERT,
 * TRAVEL_ADVISORY) filtered by related_journey_id. Auto-adjust actions are
 * placeholders until a backend endpoint exists.
 */

import { useEffect, useState } from 'react';
import { CloudRain, Plane, AlertTriangle, X, Wand2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { IntelligenceFeedItem } from '@/lib/types/entities';

interface DynamicItineraryBannerProps {
  journeyId: string;
  userId: string;
}

function iconFor(type: string) {
  if (type === 'AVIATION_DISRUPTION') return Plane;
  if (type === 'TRAVEL_ADVISORY') return CloudRain;
  return AlertTriangle;
}

function severityStyles(sev: string) {
  const s = sev.toUpperCase();
  if (s === 'CRITICAL' || s === 'HIGH') return 'bg-rose-50 border-rose-200 text-rose-800';
  if (s === 'MEDIUM') return 'bg-amber-50 border-amber-200 text-amber-800';
  return 'bg-sand-50 border-sand-200 text-sand-800';
}

export function DynamicItineraryBanner({ journeyId, userId }: DynamicItineraryBannerProps) {
  const services = useServices();
  const [items, setItems] = useState<IntelligenceFeedItem[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const feed = await services.briefing.getIntelligenceFeed(userId);
        if (cancelled) return;
        const matching = (feed.items ?? []).filter(
          (i) =>
            i.related_journey_id === journeyId &&
            (i.type === 'AVIATION_DISRUPTION' || i.type === 'TRAVEL_ADVISORY' || i.type === 'PREDICTIVE_ALERT'),
        );
        setItems(matching);
      } catch (err) {
        console.error('Dynamic itinerary banner feed error', err);
      }
    })();
    return () => { cancelled = true; };
  }, [services, journeyId, userId]);

  const visible = items.filter((i) => !dismissed.has(i.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {visible.map((i) => {
        const Icon = iconFor(i.type);
        return (
          <div
            key={i.id}
            className={`rounded-xl border p-4 flex items-start gap-3 ${severityStyles(i.severity)}`}
          >
            <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-semibold">{i.title}</p>
              <p className="font-sans text-xs mt-1 opacity-90">{i.summary}</p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-[11px] font-sans font-medium cursor-not-allowed"
                  title="Auto-adjust backend pending"
                >
                  <Wand2 className="w-3 h-3" /> Auto-adjust itinerary
                </button>
                <button
                  type="button"
                  onClick={() => setDismissed((prev) => new Set(prev).add(i.id))}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-sans uppercase tracking-wider opacity-70 hover:opacity-100"
                >
                  <X className="w-3 h-3" /> Dismiss
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
