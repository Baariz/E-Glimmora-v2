'use client';

/**
 * NextJourneyPanel — B2C suggestions rail
 * Phase 6: GET /api/intelligence/suggestions/{userId}
 * Only renders if the user has at least one EXECUTED or ARCHIVED journey.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import { TrustChrome } from '@/components/shared/TrustChrome';
import {
  type Journey,
  JourneyStatus,
  type JourneySuggestion,
  type IntelligenceSource,
} from '@/lib/types/entities';

interface NextJourneyPanelProps {
  userId: string;
  journeys: Journey[];
}

function MatchDots({ score }: { score: number }) {
  const filled = score >= 80 ? 3 : score >= 60 ? 2 : 1;
  return (
    <div className="flex items-center gap-1" aria-label={`Match ${score}/100`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < filled ? 'bg-stone-900' : 'bg-stone-300'}`}
        />
      ))}
    </div>
  );
}

function SourcePill({ source }: { source: IntelligenceSource }) {
  if (source !== 'ai') return null;
  return (
    <span className="text-[9px] font-sans uppercase tracking-[2px] text-amber-700 inline-flex items-center gap-1">
      <Sparkles size={9} /> AI Curated
    </span>
  );
}

function SuggestionCard({ s }: { s: JourneySuggestion }) {
  return (
    <div className="flex flex-col justify-between p-6 rounded-xl bg-white border border-stone-200/70 hover:border-stone-300 transition-colors min-h-[220px]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <MatchDots score={s.match_score} />
          {s.recommended && (
            <span className="text-[9px] font-sans uppercase tracking-[2px] text-stone-500">Recommended</span>
          )}
        </div>
        <h3 className="font-serif text-xl text-stone-900 leading-tight mb-3 line-clamp-2">
          {s.package_name}
        </h3>
        <p className="font-sans text-sm text-stone-500 leading-relaxed line-clamp-4">
          {s.emotional_resonance}
        </p>
        <div className="mt-3">
          <TrustChrome
            variant="light"
            compact
            sources={s.sources}
            rating={s.rating}
            review_count={s.review_count}
            distance_km={s.distance_km}
            advisor_approved={s.advisor_approved}
            confidence={s.confidence}
          />
        </div>
      </div>
      <Link
        href="/intent"
        className="mt-5 inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[3px] text-stone-900 hover:text-stone-600 transition-colors"
      >
        Begin Curation <ArrowUpRight size={12} />
      </Link>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="p-6 rounded-xl bg-white border border-stone-200 animate-pulse min-h-[220px]">
          <div className="h-3 w-16 bg-stone-200 rounded mb-4" />
          <div className="h-5 w-3/4 bg-stone-200 rounded mb-3" />
          <div className="h-3 w-full bg-stone-200 rounded mb-2" />
          <div className="h-3 w-5/6 bg-stone-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function NextJourneyPanel({ userId, journeys }: NextJourneyPanelProps) {
  const services = useServices();
  const [suggestions, setSuggestions] = useState<JourneySuggestion[] | null>(null);
  const [source, setSource] = useState<IntelligenceSource>('fallback');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const hasCompleted = journeys.some(
    (j) => j.status === JourneyStatus.EXECUTED || j.status === JourneyStatus.ARCHIVED,
  );

  useEffect(() => {
    if (!hasCompleted || !userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await services.intelligence.getSuggestions(userId);
        if (cancelled) return;
        setSuggestions((res.suggestions ?? []).slice(0, 3));
        setSource(res.source ?? 'fallback');
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load journey suggestions', err);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, userId, hasCompleted]);

  if (!hasCompleted) return null;
  if (error) return null;
  if (!loading && suggestions && suggestions.length === 0) return null;

  return (
    <section className="mb-12 sm:mb-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2">
            Curated Next
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900">
            Where your story could go
          </h2>
        </div>
        {!loading && <SourcePill source={source} />}
      </div>

      {loading || !suggestions ? (
        <Skeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((s) => <SuggestionCard key={s.package_id} s={s} />)}
        </div>
      )}
    </section>
  );
}
