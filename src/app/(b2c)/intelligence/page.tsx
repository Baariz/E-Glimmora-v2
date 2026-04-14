'use client';

/**
 * Intelligence Feed — UHNI View
 * Phase 5 — backed by GET /api/intelligence/feed
 * Items arrive pre-sorted by relevance_score DESC. We do NOT re-sort.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Globe, Plane, Brain, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { IntelligenceFeed, IntelligenceFeedItem, FeedItemType } from '@/lib/types/entities';

const TYPE_ICON: Record<FeedItemType, React.ElementType> = {
  GEOPOLITICAL_RISK: Globe,
  TRAVEL_ADVISORY: Plane,
  PREDICTIVE_ALERT: Brain,
  AVIATION_DISRUPTION: AlertTriangle,
};

const SEVERITY_FALLBACK = { bg: 'bg-blue-50', text: 'text-blue-800', ring: 'ring-blue-200' } as const;
const SEVERITY_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  CRITICAL: { bg: 'bg-red-50', text: 'text-red-800', ring: 'ring-red-200' },
  HIGH: { bg: 'bg-orange-50', text: 'text-orange-800', ring: 'ring-orange-200' },
  MEDIUM: { bg: 'bg-yellow-50', text: 'text-yellow-800', ring: 'ring-yellow-200' },
  LOW: SEVERITY_FALLBACK,
};

function severityClass(sev: string): { bg: string; text: string; ring: string } {
  return SEVERITY_COLORS[sev.toUpperCase()] ?? SEVERITY_FALLBACK;
}

function HeroCard({ item }: { item: IntelligenceFeedItem }) {
  const Icon = TYPE_ICON[item.type];
  const sev = severityClass(item.severity);
  const Wrapper = item.related_journey_id ? Link : 'div';
  const wrapperProps = item.related_journey_id ? { href: `/journeys/${item.related_journey_id}` } : {};
  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className={`block p-8 rounded-2xl bg-gradient-to-br from-white via-sand-50 to-rose-50/40 border border-sand-200 ring-1 ${sev.ring} hover:shadow-xl transition-all`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-full ${sev.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-7 h-7 ${sev.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>{item.severity}</span>
            {item.country_or_region && (
              <span className="text-xs font-sans text-sand-600">{item.country_or_region}</span>
            )}
            <span className="text-xs font-sans text-sand-400">· {format(new Date(item.created_at), 'MMM d')}</span>
            <span className="text-xs font-sans text-sand-400 ml-auto">Relevance {item.relevance_score}</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-rose-900 mb-2">{item.title}</h3>
          <p className="font-sans text-sand-700 text-sm sm:text-base leading-relaxed">{item.summary}</p>
        </div>
      </div>
    </Wrapper>
  );
}

function StandardCard({ item }: { item: IntelligenceFeedItem }) {
  const Icon = TYPE_ICON[item.type];
  const sev = severityClass(item.severity);
  const Wrapper = item.related_journey_id ? Link : 'div';
  const wrapperProps = item.related_journey_id ? { href: `/journeys/${item.related_journey_id}` } : {};
  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="block p-5 rounded-xl bg-white border border-sand-200 hover:border-sand-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${sev.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${sev.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>{item.severity}</span>
            {item.country_or_region && (
              <span className="text-xs font-sans text-sand-600">{item.country_or_region}</span>
            )}
            <span className="text-xs font-sans text-sand-400">· {format(new Date(item.created_at), 'MMM d')}</span>
            <span className="text-xs font-sans text-sand-400 ml-auto">Relevance {item.relevance_score}</span>
          </div>
          <h4 className="font-serif text-lg text-rose-900 mb-1">{item.title}</h4>
          <p className="font-sans text-sand-600 text-sm leading-relaxed">{item.summary}</p>
        </div>
      </div>
    </Wrapper>
  );
}

function CompactRow({ item }: { item: IntelligenceFeedItem }) {
  const Icon = TYPE_ICON[item.type];
  const sev = severityClass(item.severity);
  const Wrapper = item.related_journey_id ? Link : 'div';
  const wrapperProps = item.related_journey_id ? { href: `/journeys/${item.related_journey_id}` } : {};
  return (
    <Wrapper
      {...(wrapperProps as { href: string })}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sand-50 transition-colors"
    >
      <div className={`w-7 h-7 rounded-full ${sev.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${sev.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm text-sand-800 truncate">{item.title}</p>
        <p className="font-sans text-xs text-sand-500 truncate">
          {item.severity}{item.country_or_region ? ` · ${item.country_or_region}` : ''} · {format(new Date(item.created_at), 'MMM d')}
        </p>
      </div>
      <span className="text-xs font-sans text-sand-400 flex-shrink-0">{item.relevance_score}</span>
    </Wrapper>
  );
}

export default function IntelligencePage() {
  const services = useServices();
  const [feed, setFeed] = useState<IntelligenceFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await services.briefing.getIntelligenceFeed();
        if (!cancelled) setFeed(res);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load intelligence feed', err);
          setError(err instanceof Error ? err.message : 'Failed to load intelligence feed');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-4">
        <div className="h-10 w-72 bg-sand-200 rounded animate-pulse" />
        <div className="h-40 bg-sand-200 rounded-xl animate-pulse" />
        <div className="h-24 bg-sand-200 rounded-xl animate-pulse" />
        <div className="h-24 bg-sand-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center">
        <p className="text-rose-700 font-sans text-sm">{error}</p>
      </div>
    );
  }

  const items = feed?.items ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 space-y-6">
      <header>
        <p className="text-[10px] font-sans uppercase tracking-[4px] text-rose-400 mb-2">Intelligence</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-rose-900">Your private feed</h1>
        <p className="font-sans text-sand-600 text-sm mt-2">
          {items.length > 0 ? `${items.length} signals curated for you` : 'Nothing requires your attention right now.'}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="bg-white border border-sand-200 rounded-2xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <p className="font-serif text-xl text-rose-900">All clear — nothing requires attention.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            if (item.relevance_score >= 80) return <HeroCard key={item.id} item={item} />;
            if (item.relevance_score >= 60) return <StandardCard key={item.id} item={item} />;
            return <CompactRow key={item.id} item={item} />;
          })}
        </div>
      )}
    </div>
  );
}
