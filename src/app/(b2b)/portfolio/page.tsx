'use client';

/**
 * B2B Advisor Portfolio Dashboard
 * Phase 5 — single aggregated endpoint: GET /api/portfolio
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Users, AlertTriangle, DollarSign, ArrowRight, Shield, Zap, Store, Activity } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { useServices } from '@/lib/hooks/useServices';
import { ApiError } from '@/lib/services/api/client';
import type { AdvisorPortfolio } from '@/lib/types/entities';

export default function PortfolioPage() {
  const services = useServices();
  const router = useRouter();
  const [data, setData] = useState<AdvisorPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await services.briefing.getAdvisorPortfolio();
        if (!cancelled) setData(res);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          router.push('/');
          return;
        }
        console.error('Failed to load portfolio', err);
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, router]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-72 bg-sand-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (<div key={i} className="h-28 bg-sand-200 rounded-lg animate-pulse" />))}
        </div>
        <div className="h-64 bg-sand-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-rose-700 font-sans text-sm">{error ?? 'Portfolio unavailable.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-900 text-white text-sm font-sans font-medium rounded-lg hover:bg-rose-800"
        >
          Retry
        </button>
      </div>
    );
  }

  const { advisor, institution_id, clients, journey_pipeline, revenue, alerts } = data;

  const alertChips: Array<{ label: string; count: number; href: string; icon: React.ElementType; color: string }> = [
    { label: 'Predictive Alerts', count: alerts.predictive_open, href: '/predictive', icon: Zap, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Conflicts', count: alerts.conflicts_open, href: '/conflicts', icon: AlertTriangle, color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { label: 'Crisis', count: alerts.crisis_active, href: '/crisis', icon: Shield, color: 'bg-red-50 text-red-800 border-red-200' },
    { label: 'Vendor Alerts', count: alerts.vendor_alerts_open, href: '/vendors', icon: Store, color: 'bg-slate-50 text-slate-800 border-slate-200' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Advisor header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-light text-rose-900">{advisor.name}</h1>
        <p className="text-sm font-sans text-sand-600">
          {advisor.email}{institution_id ? ` · Institution ${institution_id.slice(0, 8)}` : ''}
        </p>
      </div>

      {/* Alert chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {alertChips.map(({ label, count, href, icon: Icon, color }) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border font-sans text-sm transition-all hover:shadow-sm ${color}`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </div>
            <span className="font-serif text-lg">{count}</span>
          </Link>
        ))}
      </div>

      {/* Clients block */}
      <Card header="Clients">
        {clients.total === 0 ? (
          <div className="py-8 text-center text-sand-500 text-sm font-sans">No clients assigned yet.</div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm font-sans">
              <span className="flex items-center gap-1.5 text-sand-700"><Users className="w-4 h-4" /> {clients.total} total</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs">{clients.active} active</span>
              {Object.entries(clients.by_status).map(([s, n]) => (
                <span key={s} className="px-2 py-0.5 bg-sand-100 text-sand-700 rounded-full text-xs">{s}: {n}</span>
              ))}
            </div>
            <ul className="divide-y divide-sand-100">
              {clients.recent.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link href={`/clients/${c.id}`} className="flex items-center justify-between py-3 hover:text-rose-700">
                    <div>
                      <p className="font-sans text-sm font-medium text-sand-800">{c.name ?? 'Unnamed client'}</p>
                      <p className="text-xs font-sans text-sand-500">
                        {c.status} · {c.active_journey_count} active journey{c.active_journey_count === 1 ? '' : 's'}
                        {c.risk_category != null ? ` · Risk ${c.risk_category}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-sans text-sand-400">{formatDistanceToNow(new Date(c.updated_at), { addSuffix: true })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {/* Journey pipeline — hide entirely if zero */}
      {journey_pipeline.total > 0 && (
        <Card header={
          <div className="flex items-center justify-between w-full">
            <span>Journey Pipeline</span>
            {journey_pipeline.needs_attention.length > 0 && (
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-sans rounded-full">
                {journey_pipeline.needs_attention.length} need attention
              </span>
            )}
          </div>
        }>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs font-sans">
              <span className="px-2 py-1 bg-rose-50 text-rose-900 rounded-full">Total: {journey_pipeline.total}</span>
              {Object.entries(journey_pipeline.by_status).map(([s, n]) => (
                <span key={s} className="px-2 py-1 bg-sand-100 text-sand-700 rounded-full">{s.replace('_', ' ')}: {n}</span>
              ))}
            </div>
            {journey_pipeline.needs_attention.length > 0 && (
              <ul className="space-y-2">
                {journey_pipeline.needs_attention.map((j) => (
                  <li key={j.id}>
                    <Link href={`/governance/${j.id}`} className="flex items-start gap-2 py-2 text-sm font-sans hover:text-rose-700">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-rose-900 font-medium">{j.title}</span>{' '}
                        <span className="text-sand-500 text-xs">· {j.category} · {j.status.replace('_', ' ')}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-sand-400 ml-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}

      {/* Revenue block */}
      <Card header="Revenue">
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-start gap-3">
            <DollarSign className="w-6 h-6 text-teal-700 mt-1" />
            <div>
              <p className="text-xs font-sans uppercase tracking-wider text-sand-500">YTD Total</p>
              <p className="font-serif text-2xl text-rose-900">
                {revenue.currency} {revenue.ytd_total.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Activity className="w-6 h-6 text-rose-700 mt-1" />
            <div>
              <p className="text-xs font-sans uppercase tracking-wider text-sand-500">Active Contracts</p>
              <p className="font-serif text-2xl text-rose-900">{revenue.active_contracts}</p>
            </div>
          </div>
        </div>
        {Object.keys(revenue.by_period).length > 0 && (
          <div>
            <p className="text-xs font-sans uppercase tracking-wider text-sand-500 mb-3">By Period</p>
            <div className="flex items-end gap-2 h-32">
              {(() => {
                const entries = Object.entries(revenue.by_period);
                const max = Math.max(...entries.map(([, v]) => v), 1);
                return entries.map(([period, v]) => (
                  <div key={period} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-rose-400 to-amber-400 rounded-t"
                      style={{ height: `${(v / max) * 100}%`, minHeight: '2px' }}
                      title={`${period}: ${revenue.currency} ${v.toLocaleString()}`}
                    />
                    <span className="text-[10px] font-sans text-sand-500 whitespace-nowrap">{period}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
