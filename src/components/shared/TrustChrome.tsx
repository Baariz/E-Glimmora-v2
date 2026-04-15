'use client';

/**
 * TrustChrome — transparent recommendation metadata.
 * Renders sources, rating, distance, advisor-approved, and confidence
 * on any recommendation card. All fields optional; hides when absent.
 */

import { Star, MapPin, CheckCircle2, Link2, ShieldCheck } from 'lucide-react';
import type { RecommendationTrust } from '@/lib/types/entities';

export interface TrustChromeProps extends RecommendationTrust {
  /** Optional free-text reasoning ("Recommended because …"). Rendered below meta row. */
  reasoning?: string;
  /** Visual theme — 'dark' for AGI/B2B panels, 'light' for B2C surfaces. */
  variant?: 'light' | 'dark';
  /** Small/compact layout */
  compact?: boolean;
  className?: string;
}

function confidenceLabel(c: number): { label: string; cls: (dark: boolean) => string } {
  if (c >= 80) return { label: 'High confidence', cls: (d) => d ? 'text-emerald-300 bg-emerald-900/30 border-emerald-700/40' : 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (c >= 60) return { label: 'Medium confidence', cls: (d) => d ? 'text-amber-300 bg-amber-900/30 border-amber-700/40' : 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'Low confidence', cls: (d) => d ? 'text-slate-300 bg-slate-700/40 border-slate-600' : 'text-sand-700 bg-sand-100 border-sand-200' };
}

function sourceIcon(kind?: string) {
  if (kind === 'official') return ShieldCheck;
  if (kind === 'tourism') return MapPin;
  return Link2;
}

export function TrustChrome({
  sources,
  rating,
  review_count,
  distance_km,
  advisor_approved,
  confidence,
  reasoning,
  variant = 'light',
  compact = false,
  className = '',
}: TrustChromeProps) {
  const dark = variant === 'dark';
  const hasAny =
    (sources && sources.length > 0) ||
    typeof rating === 'number' ||
    typeof distance_km === 'number' ||
    advisor_approved ||
    typeof confidence === 'number' ||
    reasoning;
  if (!hasAny) return null;

  const textMuted = dark ? 'text-slate-400' : 'text-sand-600';
  const textBody = dark ? 'text-slate-200' : 'text-sand-800';
  const chipBase = dark
    ? 'bg-slate-700/40 text-slate-200 border-slate-600'
    : 'bg-white text-sand-700 border-sand-200';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {typeof rating === 'number' && (
          <span className={`inline-flex items-center gap-1 ${textBody} text-xs font-sans`}>
            <Star className={`w-3.5 h-3.5 ${dark ? 'text-amber-300' : 'text-amber-500'} fill-current`} />
            <span className="font-medium">{rating.toFixed(1)}</span>
            {typeof review_count === 'number' && (
              <span className={textMuted}>({review_count.toLocaleString()} reviews)</span>
            )}
          </span>
        )}
        {typeof distance_km === 'number' && (
          <span className={`inline-flex items-center gap-1 ${textMuted} text-xs font-sans`}>
            <MapPin className="w-3.5 h-3.5" /> {distance_km < 1 ? `${Math.round(distance_km * 1000)} m` : `${distance_km.toFixed(1)} km`} away
          </span>
        )}
        {advisor_approved && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full border ${dark ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700/40' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
            <CheckCircle2 className="w-3 h-3" /> Advisor Approved
          </span>
        )}
        {typeof confidence === 'number' && (() => {
          const c = confidenceLabel(confidence);
          return (
            <span className={`inline-flex items-center gap-1 text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.cls(dark)}`}>
              {c.label} · {confidence}
            </span>
          );
        })()}
      </div>

      {/* Reasoning */}
      {reasoning && (
        <p className={`${compact ? 'text-xs' : 'text-sm'} font-sans italic leading-relaxed ${dark ? 'text-slate-300' : 'text-sand-700'}`}>
          &ldquo;{reasoning}&rdquo;
        </p>
      )}

      {/* Sources */}
      {sources && sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sources.map((s, i) => {
            const Icon = sourceIcon(s.kind);
            const content = (
              <span className={`inline-flex items-center gap-1 text-[10px] font-sans px-2 py-0.5 rounded-full border ${chipBase}`}>
                <Icon className="w-3 h-3" /> {s.label}
              </span>
            );
            return s.url ? (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                {content}
              </a>
            ) : (
              <span key={i}>{content}</span>
            );
          })}
        </div>
      )}
    </div>
  );
}
