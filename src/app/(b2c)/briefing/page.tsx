'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, Shield, Mail, Archive, Sparkles, FileText, Loader2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { UhniBriefing } from '@/lib/types/entities';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function BriefingPage() {
  const services = useServices();
  const [data, setData] = useState<UhniBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await services.briefing.getUhniBriefing();
      setData(res);
    } catch (err) {
      console.error('Failed to load briefing', err);
      setError(err instanceof Error ? err.message : 'Failed to load your briefing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <div className="h-10 w-96 bg-sand-200 rounded animate-pulse" />
        <div className="h-6 w-64 bg-sand-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="h-48 bg-sand-200 rounded-xl animate-pulse" />
          <div className="h-48 bg-sand-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center space-y-4">
        <p className="text-rose-700 font-sans text-sm">{error ?? 'Your briefing is unavailable.'}</p>
        <button
          onClick={load}
          className="px-5 py-2.5 bg-rose-900 text-white text-sm font-sans font-medium rounded-full hover:bg-rose-800"
        >
          Retry
        </button>
      </div>
    );
  }

  const { user, emotional_landscape, standing, advisor, journeys, vault, unread_messages, generated_at } = data;
  const firstName = user.name?.split(' ')[0] ?? '';
  const scoreBars = emotional_landscape ? [
    { label: 'Security', value: emotional_landscape.score_security },
    { label: 'Adventure', value: emotional_landscape.score_adventure },
    { label: 'Legacy', value: emotional_landscape.score_legacy },
    { label: 'Recognition', value: emotional_landscape.score_recognition },
    { label: 'Autonomy', value: emotional_landscape.score_autonomy },
  ] : [];

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 space-y-10">
      {/* Welcome */}
      <div className="space-y-2">
        <p className="text-[10px] font-sans uppercase tracking-[4px] text-sand-500">
          {format(new Date(generated_at), 'EEEE, MMMM d, yyyy')}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-rose-900">
          {getGreeting()}, <span className="text-amber-700">{firstName}</span>.
        </h1>
        {advisor && (
          <p className="font-sans text-sand-600 text-sm">
            Your advisor <b className="text-sand-800">{advisor.name}</b> is watching over your portfolio.
          </p>
        )}
      </div>

      {/* Emotional landscape */}
      <section className="bg-white border border-sand-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-rose-900">Emotional Landscape</h2>
          {emotional_landscape && (
            <span className="text-xs font-sans text-sand-500">Alignment: {emotional_landscape.alignment_score}/100</span>
          )}
        </div>
        {!emotional_landscape ? (
          <div className="text-center py-10 space-y-4">
            <p className="font-sans text-sand-600 text-sm">
              We don&rsquo;t have your intent profile yet — a few minutes will help us tailor every experience to you.
            </p>
            <Link
              href="/intent"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-900 text-white text-sm font-sans font-medium rounded-full hover:bg-rose-800"
            >
              Complete your profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scoreBars.map(({ label, value }) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-sans text-sand-600 mb-1">
                  <span>{label}</span><span>{value}</span>
                </div>
                <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-3 flex flex-wrap gap-2 text-xs font-sans">
              {emotional_landscape.values.map((v) => (
                <span key={v} className="px-2 py-0.5 bg-sand-100 text-sand-700 rounded-full">{v}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Standing */}
      <section className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-900 text-white text-xs font-sans rounded-full">
          <Shield className="w-3.5 h-3.5 text-amber-300" /> Discretion · {standing.discretion_tier}
        </span>
        {standing.risk_tier && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900 text-white text-xs font-sans rounded-full">
            Risk · {standing.risk_tier}{standing.risk_score != null ? ` (${standing.risk_score})` : ''}
          </span>
        )}
        {standing.invisible_itinerary_default && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-900 text-xs font-sans rounded-full">
            Invisible itinerary · Default on
          </span>
        )}
      </section>

      {/* Journeys */}
      <section className="bg-white border border-sand-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-rose-900">Your Journeys</h2>
          <span className="text-xs font-sans text-sand-500">{journeys.total} total</span>
        </div>
        {journeys.total === 0 ? (
          <div className="text-center py-10 space-y-4">
            <Sparkles className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="font-sans text-sand-600 text-sm">Begin your first journey — tell us what you seek.</p>
            <Link
              href="/intent"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-900 text-white text-sm font-sans font-medium rounded-full hover:bg-rose-800"
            >
              Start your first journey <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {journeys.active && (
              <Link
                href={`/journeys/${journeys.active.id}`}
                className="block p-4 rounded-lg bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 hover:shadow-md transition-shadow"
              >
                <p className="text-[10px] font-sans uppercase tracking-[3px] text-rose-600 mb-1">Active now</p>
                <p className="font-serif text-lg text-rose-900">{journeys.active.title}</p>
                <p className="text-xs font-sans text-sand-600 mt-1">{journeys.active.category} · {journeys.active.status.replace('_', ' ')}</p>
              </Link>
            )}
            {journeys.upcoming.length > 0 && (
              <div>
                <p className="text-xs font-sans uppercase tracking-wider text-sand-500 mb-2">Upcoming</p>
                <ul className="divide-y divide-sand-100">
                  {journeys.upcoming.slice(0, 3).map((j) => (
                    <li key={j.id}>
                      <Link href={`/journeys/${j.id}`} className="py-3 flex items-center justify-between hover:text-rose-700 transition-colors">
                        <div>
                          <p className="font-sans text-sm font-medium text-sand-800">{j.title}</p>
                          <p className="text-xs font-sans text-sand-500">{j.category} · {j.status.replace('_', ' ')}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-sand-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {journeys.last_archived && (
              <div className="flex items-center gap-2 text-xs font-sans text-sand-500 pt-2">
                <Archive className="w-3.5 h-3.5" /> Last archived: {journeys.last_archived.title}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Vault + Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white border border-sand-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-rose-900">Your Vault</h2>
            <span className="text-xs font-sans text-sand-500">{vault.total_items} items · {vault.milestone_count} milestones</span>
          </div>
          {vault.total_items === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-sand-400 mx-auto mb-3" />
              <p className="text-sm font-sans text-sand-500">Your vault is empty.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {vault.recent.slice(0, 3).map((v) => (
                <li key={v.id}>
                  <Link href={`/vault/${v.id}`} className="flex items-center justify-between py-2 hover:text-rose-700">
                    <div>
                      <p className="font-sans text-sm text-sand-800">{v.title}</p>
                      <p className="text-xs font-sans text-sand-500">{v.type}{v.is_milestone ? ' · Milestone' : ''}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-sand-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-sand-200 rounded-xl p-6 flex flex-col">
          <h2 className="font-serif text-xl text-rose-900 mb-4">Messages</h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Mail className="w-10 h-10 text-rose-400 mb-3" />
            <p className="font-serif text-3xl text-rose-900">{unread_messages}</p>
            <p className="text-xs font-sans text-sand-500 mt-1">unread</p>
          </div>
          <Link
            href="/messages"
            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-900 text-sm font-sans font-medium rounded-full hover:bg-rose-100"
          >
            Open inbox <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
