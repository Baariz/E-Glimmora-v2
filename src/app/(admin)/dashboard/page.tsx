'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Users, Building2, Ticket, Activity, AlertTriangle, DollarSign, Loader2 } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { useServices } from '@/lib/hooks/useServices';
import { ApiError } from '@/lib/services/api/client';
import type { AdminDashboard } from '@/lib/types/entities';

export default function AdminDashboardPage() {
  const services = useServices();
  const router = useRouter();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setForbidden(false);
      setError(null);
      try {
        const res = await services.briefing.getAdminDashboard();
        if (!cancelled) setData(res);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          router.push('/login');
          return;
        }
        if (err instanceof ApiError && err.status === 403) {
          setForbidden(true);
        } else {
          console.error('Failed to load admin dashboard', err);
          setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-sand-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-sand-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (<div key={i} className="h-32 bg-sand-200 rounded-lg animate-pulse" />))}
        </div>
        <div className="h-48 bg-sand-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="p-10 text-center text-sand-600 font-sans">
        <p className="text-lg">Not available for your role.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-rose-700 font-sans text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-900 text-white text-sm font-sans font-medium rounded-lg hover:bg-rose-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { users, institutions, journey_pipeline, invites, system_health, recent_audit, revenue_summary } = data;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-light text-rose-900">Platform Administration</h1>
        <p className="text-base font-sans text-sand-600">Platform-wide overview for operators</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-rose-50 border-rose-100">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-rose-700 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-sans text-sand-600">Users</p>
              <p className="text-3xl font-serif text-rose-900">{users.total}</p>
              <p className="text-xs font-sans text-sand-500">{users.active} active · {users.new_this_week} new this week</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-olive-50 border-olive-100">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-olive-700 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-sans text-sand-600">Institutions</p>
              <p className="text-3xl font-serif text-rose-900">{institutions.total}</p>
              <p className="text-xs font-sans text-sand-500">
                {Object.entries(institutions.by_tier).map(([tier, n]) => `${tier}: ${n}`).join(' · ') || '—'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-amber-50 border-amber-100">
          <div className="flex items-start gap-3">
            <Ticket className="w-5 h-5 text-amber-700 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-sans text-sand-600">Invite Codes</p>
              <p className="text-3xl font-serif text-rose-900">{invites.total}</p>
              <p className="text-xs font-sans text-sand-500">
                {invites.active} active · {invites.used} used · {invites.expiring_soon} expiring
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-teal-50 border-teal-100">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-teal-700 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-sans text-sand-600">Revenue (YTD)</p>
              <p className="text-3xl font-serif text-rose-900">
                {revenue_summary.currency} {revenue_summary.ytd_total.toLocaleString()}
              </p>
              <p className="text-xs font-sans text-sand-500">{revenue_summary.active_contracts} active contracts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users by role */}
      <Card header="Users by Role">
        <div className="flex flex-wrap gap-2">
          {Object.keys(users.by_role).length === 0 ? (
            <span className="text-sm font-sans text-sand-500">No role breakdown available.</span>
          ) : (
            Object.entries(users.by_role).map(([role, count]) => (
              <span key={role} className="px-3 py-1 bg-sand-100 text-sand-700 rounded-full text-xs font-sans">
                {role}: <b>{count}</b>
              </span>
            ))
          )}
        </div>
      </Card>

      {/* Journey pipeline */}
      <Card header="Journey Pipeline">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-sans text-sand-600">Total: <b className="text-rose-900">{journey_pipeline.total}</b></span>
            {Object.entries(journey_pipeline.by_status).map(([status, count]) => (
              <span key={status} className="text-xs font-sans px-2 py-1 rounded-full bg-rose-50 text-rose-700">
                {status.replace('_', ' ')}: {count}
              </span>
            ))}
          </div>
          {journey_pipeline.needs_attention.length > 0 && (
            <div>
              <p className="text-xs font-sans uppercase tracking-wider text-sand-500 mb-2">Needs Attention</p>
              <ul className="space-y-2">
                {journey_pipeline.needs_attention.map((j) => (
                  <li key={j.id} className="flex items-start gap-2 text-sm font-sans">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-rose-900 font-medium">{j.title}</span>{' '}
                      <span className="text-sand-500 text-xs">· {j.category} · {j.status.replace('_', ' ')}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* System health */}
      <Card header="System Health">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-sans uppercase tracking-wider text-sand-500">Database</p>
            <span className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans ${system_health.db === 'ok' || system_health.db === 'healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              <Activity className="w-3 h-3" /> {system_health.db}
            </span>
          </div>
          <div>
            <p className="text-xs font-sans uppercase tracking-wider text-sand-500">LLM</p>
            <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-sans ${system_health.llm_configured ? 'bg-emerald-100 text-emerald-800' : 'bg-sand-100 text-sand-700'}`}>
              {system_health.llm_configured ? 'Configured' : 'Not configured'}
            </span>
          </div>
          <div>
            <p className="text-xs font-sans uppercase tracking-wider text-sand-500">Routers</p>
            <p className="text-xl font-serif text-rose-900">{system_health.router_count}</p>
          </div>
          <div>
            <p className="text-xs font-sans uppercase tracking-wider text-sand-500">Endpoints</p>
            <p className="text-xl font-serif text-rose-900">{system_health.endpoint_count}</p>
          </div>
        </div>
      </Card>

      {/* Recent audit */}
      <Card header="Recent Audit (last 10)">
        {recent_audit.length === 0 ? (
          <p className="text-sm font-sans text-sand-500">No recent activity.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="text-left text-xs font-sans uppercase tracking-wider text-sand-500 border-b border-sand-200">
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Action</th>
                  <th className="py-2 pr-4">Resource</th>
                  <th className="py-2">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {recent_audit.slice(0, 10).map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 pr-4 text-rose-900">{e.event}</td>
                    <td className="py-2 pr-4 text-sand-700">{e.action}</td>
                    <td className="py-2 pr-4 text-sand-600">{e.resource_type}</td>
                    <td className="py-2 text-sand-500">{formatDistanceToNow(new Date(e.timestamp), { addSuffix: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
