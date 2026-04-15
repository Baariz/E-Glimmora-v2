'use client';

/**
 * AGI Intelligence Brief Panel — Advisor View
 * Phase 6: POST /api/intelligence/hotel-scoring
 * Dark-themed, collapsible. Internal-only. NEVER shown to UHNI client.
 */

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Cpu, Loader2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { HotelScore, IntelligenceSource } from '@/lib/types/entities';

interface AGIBriefPanelProps {
  /** UHNI client's user id — forwarded as `user_id` in POST body */
  clientUserId: string;
  clientName: string;
}

function riskBadge(risk: string) {
  const r = risk.toLowerCase();
  if (r === 'low') return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40';
  if (r === 'medium') return 'bg-amber-900/40 text-amber-300 border-amber-700/40';
  if (r === 'high') return 'bg-rose-900/40 text-rose-300 border-rose-700/40';
  return 'bg-slate-700/40 text-slate-300 border-slate-600';
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-sans uppercase tracking-wider text-slate-400">{label}</span>
        <span className="text-xs font-sans text-slate-200 font-medium">{pct}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} stroke="currentColor" strokeWidth="5" fill="none" className="text-slate-700" />
        <circle
          cx="32"
          cy="32"
          r={r}
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-amber-400 transition-all duration-700 ease-out"
        />
      </svg>
      <div className="text-center">
        <div className="font-serif text-xl text-white leading-none">{pct}</div>
        <div className="text-[9px] font-sans text-slate-400 uppercase tracking-wider">score</div>
      </div>
    </div>
  );
}

function HotelCard({ score }: { score: HotelScore }) {
  const [openReason, setOpenReason] = useState(false);
  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
      <div className="flex items-start gap-4">
        <Gauge value={score.overall_score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-base text-white truncate">{score.hotel_name}</h3>
            <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full border ${riskBadge(score.risk_level)} flex-shrink-0`}>
              {score.risk_level}
            </span>
          </div>
          <div className="space-y-2">
            <Bar label="Privacy match" value={score.privacy_match} />
            <Bar label="Emotional match" value={score.emotional_match} />
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-slate-700 pt-2">
        <button
          onClick={() => setOpenReason((v) => !v)}
          className="w-full flex items-center justify-between text-[11px] font-sans uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>AI Reasoning</span>
          {openReason ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openReason && (
          <p className="text-xs font-sans text-slate-300 leading-relaxed mt-2 whitespace-pre-wrap">
            {score.reasoning || 'No reasoning provided.'}
          </p>
        )}
      </div>
    </div>
  );
}

function SourcePill({ source }: { source: IntelligenceSource }) {
  const isAi = source === 'ai';
  return (
    <span className={`text-[10px] font-sans px-2 py-1 rounded-full border inline-flex items-center gap-1 ${
      isAi
        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        : 'bg-slate-700/50 text-slate-300 border-slate-600'
    }`}>
      {isAi ? <Sparkles size={11} /> : <Cpu size={11} />}
      {isAi ? 'AI Scored' : 'Algorithmic'}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="p-4 rounded-lg border border-slate-700 bg-slate-900/50 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-700" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-2/3 bg-slate-700 rounded" />
              <div className="h-2 w-full bg-slate-700 rounded" />
              <div className="h-2 w-5/6 bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AGIBriefPanel({ clientUserId, clientName }: AGIBriefPanelProps) {
  const services = useServices();
  const [collapsed, setCollapsed] = useState(false);
  const [scores, setScores] = useState<HotelScore[]>([]);
  const [source, setSource] = useState<IntelligenceSource>('fallback');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientUserId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await services.intelligence.scoreHotels(clientUserId);
        if (cancelled) return;
        setScores((res.scores ?? []).slice(0, 3));
        setSource(res.source ?? 'fallback');
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to score hotels', err);
          setError(err instanceof Error ? err.message : 'Unable to load hotel scoring.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, clientUserId]);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-700 hover:bg-slate-700/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-lg">{'\u25C8'}</span>
          <div className="text-left">
            <p className="text-white font-sans font-medium text-sm">AGI Intelligence Brief — Hotel Scoring</p>
            <p className="text-slate-400 text-xs font-sans">For {clientName} — Internal Only</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!loading && !error && <SourcePill source={source} />}
          {collapsed ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
        </div>
      </button>

      {!collapsed && (
        <div className="p-6">
          {loading && <Skeleton />}
          {error && !loading && (
            <div className="flex items-center gap-2 text-rose-300 text-sm font-sans py-4">
              <Loader2 size={14} /> {error}
            </div>
          )}
          {!loading && !error && scores.length === 0 && (
            <p className="text-slate-400 text-sm font-sans py-6 text-center">
              No hotel scores available for this client yet.
            </p>
          )}
          {!loading && !error && scores.length > 0 && (
            <div className="space-y-3">
              {scores.map((s) => <HotelCard key={s.hotel_id} score={s} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
