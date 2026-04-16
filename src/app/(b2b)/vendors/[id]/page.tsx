'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Shield, Edit2, Trash2, RefreshCw,
  Globe, Mail, Phone, MapPin, Building2, Calendar, FileCheck, Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { VendorFormDialog } from '@/components/b2b/vendors/VendorFormDialog';
import { DeleteVendorDialog } from '@/components/b2b/vendors/DeleteVendorDialog';
import { StatusChangeDialog } from '@/components/b2b/vendors/StatusChangeDialog';
import { RunScreeningDialog } from '@/components/b2b/vendors/RunScreeningDialog';
import { VendorNotesTab } from '@/components/b2b/vendors/VendorNotesTab';
import { VendorAlertsList } from '@/components/b2b/vendors/VendorAlertsList';
import type { Vendor, VendorScreening, VendorScorecard, VendorAlert, VendorStatus } from '@/lib/types';
import type { CreateVendorInput } from '@/lib/services/interfaces/IVendorService';

const STATUS_STYLES: Record<VendorStatus, string> = {
  'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
  Approved: 'bg-blue-100 text-blue-800 border-blue-200',
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Suspended: 'bg-rose-100 text-rose-800 border-rose-200',
  Rejected: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { can } = useCan();
  const services = useServices();

  const canManage = can(Permission.WRITE, 'vendor');
  const canDelete = can(Permission.DELETE, 'vendor');
  const canSeeContract = canManage;
  const canSeeAlerts = canManage;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status?: number; message: string } | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [screenings, setScreenings] = useState<VendorScreening[]>([]);
  const [scorecards, setScorecards] = useState<VendorScorecard[]>([]);
  const [alerts, setAlerts] = useState<VendorAlert[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [screeningOpen, setScreeningOpen] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const v = await services.vendor.getVendorById(id);
      if (!v) {
        setError({ status: 404, message: 'Vendor not found' });
        setVendor(null);
        return;
      }
      setVendor(v);

      const tasks: Promise<unknown>[] = [
        services.vendor.getScreeningsByVendor(id).then((list) => setScreenings(list)),
        services.vendor.getScorecardsByVendor(id).then((list) => setScorecards(list)),
      ];
      if (canSeeAlerts) {
        tasks.push(services.vendor.getAlertsByVendor(id).then((list) => setAlerts(list)));
      }
      await Promise.all(tasks);
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      if (err.status === 401) {
        router.push('/auth/signin');
        return;
      }
      setError({ status: err.status, message: err.message || 'Failed to load vendor' });
    } finally {
      setLoading(false);
    }
  }, [id, services, canSeeAlerts, router]);

  useEffect(() => { load(); }, [load]);

  const handleAckAlert = async (alertId: string) => {
    try {
      await services.vendor.acknowledgeVendorAlert(alertId);
      toast.success('Alert acknowledged');
      await load();
    } catch {
      toast.error('Failed to acknowledge alert');
    }
  };

  const handleUpdate = async (input: CreateVendorInput) => {
    if (!vendor) return;
    await services.vendor.updateVendor(vendor.id, input);
    toast.success('Vendor updated ✓');
    await load();
  };

  const handleDelete = async () => {
    if (!vendor) return;
    await services.vendor.deleteVendor(vendor.id);
    toast.error(`Vendor "${vendor.name}" deleted`);
    router.push('/b2b/vendors');
  };

  const handleStatusChange = async (next: VendorStatus) => {
    if (!vendor) return;
    await services.vendor.updateVendorStatus(vendor.id, next);
    toast.success(`Status changed to ${next} ✓`);
    await load();
  };

  const handleRunScreening = async () => {
    if (!vendor) return;
    await services.vendor.runScreening(vendor.id);
    toast.success('Screening started ✓');
    await load();
  };

  const sortedScreenings = useMemo(
    () => [...screenings].sort((a, b) => b.screenedAt.localeCompare(a.screenedAt)),
    [screenings]
  );
  const latestScreening = sortedScreenings[0] ?? null;

  const sortedScorecards = useMemo(
    () => [...scorecards].sort((a, b) => a.period.localeCompare(b.period)),
    [scorecards]
  );
  const currentScorecard = sortedScorecards[sortedScorecards.length - 1] ?? null;

  const chartData = sortedScorecards.slice(-6).map(sc => ({
    period: sc.period, score: sc.overallScore, sla: sc.slaCompliance, quality: sc.qualityRating,
  }));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 bg-sand-100 rounded animate-pulse" />
        <div className="h-40 rounded-xl bg-sand-100 animate-pulse" />
        <div className="h-64 rounded-xl bg-sand-100 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-rose-50 border-rose-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-rose-600" />
            <div>
              <p className="text-sm text-rose-800 font-sans font-medium">{error.message}</p>
              {error.status === 403 && (
                <p className="text-xs text-rose-700 font-sans">You do not have access to this vendor.</p>
              )}
            </div>
          </div>
          <Link href="/b2b/vendors" className="text-xs font-sans text-rose-700 hover:underline">
            ← Back to vendors
          </Link>
        </div>
      </Card>
    );
  }

  if (!vendor) return null;

  const tabs = [
    { value: 'profile', label: 'Profile', content: <ProfileTab vendor={vendor} canSeeContract={canSeeContract} /> },
    { value: 'screening', label: 'Screening', content: <ScreeningTab screening={latestScreening} history={sortedScreenings} canManage={canManage} onRun={() => setScreeningOpen(true)} /> },
    { value: 'scorecard', label: 'Scorecard', content: <ScorecardTab current={currentScorecard} chart={chartData} /> },
    { value: 'notes', label: 'Notes / Communication', content: <VendorNotesTab vendorId={vendor.id} canEditAnyNote={canManage} /> },
    ...(canSeeAlerts
      ? [{ value: 'alerts', label: 'Alerts', content: <VendorAlertsList alerts={alerts} onAcknowledge={handleAckAlert} /> }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <Link href="/b2b/vendors" className="inline-flex items-center gap-1.5 text-sm font-sans text-sand-600 hover:text-rose-900">
        <ArrowLeft className="w-4 h-4" /> All vendors
      </Link>

      <div className="bg-white border border-sand-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-serif text-slate-900">{vendor.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-sans border ${STATUS_STYLES[vendor.status]}`}>{vendor.status}</span>
            </div>
            <p className="text-sm font-sans text-sand-600">{vendor.category} · {vendor.headquartersCountry || '—'}</p>
          </div>
          {canManage && (
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setStatusOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-sand-700 bg-white border border-sand-200 rounded-lg hover:bg-sand-50">
                <RefreshCw className="w-3.5 h-3.5" /> Change Status
              </button>
              <button onClick={() => setFormOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-sand-700 bg-white border border-sand-200 rounded-lg hover:bg-sand-50">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              {canDelete && (
                <button onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Card>
        <Tabs items={tabs} defaultValue="profile" />
      </Card>

      <VendorFormDialog
        open={formOpen}
        mode="edit"
        initial={vendor}
        institutionId={vendor.institutionId}
        onClose={() => setFormOpen(false)}
        onSubmit={handleUpdate}
      />

      <DeleteVendorDialog
        open={deleteOpen}
        vendorName={vendor.name}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <StatusChangeDialog
        open={statusOpen}
        vendorName={vendor.name}
        currentStatus={vendor.status}
        onClose={() => setStatusOpen(false)}
        onConfirm={handleStatusChange}
      />

      <RunScreeningDialog
        open={screeningOpen}
        vendorName={vendor.name}
        onClose={() => setScreeningOpen(false)}
        onConfirm={handleRunScreening}
      />
    </div>
  );
}

// ── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ vendor, canSeeContract }: { vendor: Vendor; canSeeContract: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-5">
        <section>
          <h3 className="font-serif text-sm text-rose-900 mb-2">Contact</h3>
          <ul className="space-y-1.5 text-sm font-sans text-sand-800">
            <li className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-sand-400" /> {vendor.contactName}</li>
            <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-sand-400" /> <a href={`mailto:${vendor.contactEmail}`} className="hover:underline">{vendor.contactEmail}</a></li>
            {vendor.contactPhone && <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-sand-400" /> {vendor.contactPhone}</li>}
            {vendor.website && <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-sand-400" /> <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-rose-900">{vendor.website}</a></li>}
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-sm text-rose-900 mb-2">Operations</h3>
          <p className="text-sm font-sans text-sand-800 flex items-center gap-2 mb-2">
            <MapPin className="w-3.5 h-3.5 text-sand-400" /> {vendor.headquartersCountry || '—'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {vendor.operatingRegions.length > 0 ? (
              vendor.operatingRegions.map((r) => (
                <span key={r} className="px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-full text-xs text-rose-800">{r}</span>
              ))
            ) : (
              <span className="text-xs text-sand-400">No regions listed</span>
            )}
          </div>
        </section>

        {canSeeContract && (
          <section>
            <h3 className="font-serif text-sm text-rose-900 mb-2">Contract <span className="text-[10px] font-sans text-sand-400 tracking-wide ml-2">INSTITUTION ONLY</span></h3>
            <div className="grid grid-cols-2 gap-3 text-sm font-sans">
              <Field label="Value" value={vendor.contractValue ? `$${vendor.contractValue.toLocaleString()}` : '—'} />
              <Field label="Start" value={vendor.contractStart || '—'} />
              <Field label="End" value={vendor.contractEnd || 'Open'} />
              <Field label="NDA" value={vendor.ndaSigned ? `Signed${vendor.ndaExpiresAt ? ' · expires ' + vendor.ndaExpiresAt : ''}` : 'Not signed'} />
            </div>
          </section>
        )}
      </div>

      <div className="space-y-3">
        <Card>
          <h3 className="font-serif text-sm text-rose-900 mb-2">Timeline</h3>
          <ul className="space-y-2 text-xs font-sans text-sand-700">
            <li className="flex items-start gap-2"><Calendar className="w-3.5 h-3.5 text-sand-400 mt-0.5" /><span>Onboarded: <strong>{new Date(vendor.onboardedAt).toLocaleDateString()}</strong></span></li>
            <li className="flex items-start gap-2"><FileCheck className="w-3.5 h-3.5 text-sand-400 mt-0.5" /><span>Current status: <strong>{vendor.status}</strong></span></li>
            <li className="flex items-start gap-2"><RefreshCw className="w-3.5 h-3.5 text-sand-400 mt-0.5" /><span>Last updated: <strong>{new Date(vendor.updatedAt).toLocaleDateString()}</strong></span></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-sand-500">{label}</p>
      <p className="text-sand-900">{value}</p>
    </div>
  );
}

// ── Screening Tab ────────────────────────────────────────────────────────────

function ScreeningTab({
  screening, history, canManage, onRun,
}: {
  screening: VendorScreening | null;
  history: VendorScreening[];
  canManage: boolean;
  onRun: () => void;
}) {
  const statusColors: Record<string, string> = {
    Passed: 'bg-emerald-100 text-emerald-800',
    Failed: 'bg-rose-100 text-rose-800',
    'In Progress': 'bg-blue-100 text-blue-700',
    Expired: 'bg-amber-100 text-amber-800',
    'Not Started': 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm text-rose-900">Latest Screening</h3>
        {canManage && (
          <button onClick={onRun}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-white bg-rose-900 rounded-md hover:bg-rose-800">
            <Shield className="w-3.5 h-3.5" /> Run New Screening
          </button>
        )}
      </div>

      {!screening ? (
        <p className="text-center py-8 text-sm font-sans text-sand-400">No screening records yet.</p>
      ) : (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-sans font-medium ${statusColors[screening.overallScreeningStatus] ?? 'bg-slate-100'}`}>
                {screening.overallScreeningStatus}
              </span>
              <span className="text-[11px] font-sans text-sand-500">
                Screened {new Date(screening.screenedAt).toLocaleDateString()} · by {screening.screenedBy}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScoreMeter label="Financial Health" value={screening.financialHealthScore} />
              <ScoreMeter label="Security Assessment" value={screening.securityAssessmentScore} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-sand-700">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-sand-500 mb-1">Financial Details</p>
                <p>Credit Rating: <strong>{screening.financialHealthDetails.creditRating}</strong></p>
                <p>Debt Ratio: <strong>{screening.financialHealthDetails.debtRatio}%</strong></p>
                <p>Bankruptcy Risk: <strong>{screening.financialHealthDetails.bankruptcyRisk}</strong></p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-sand-500 mb-1">Security Details</p>
                <p>Compliance: <strong>{screening.securityAssessmentDetails.dataProtectionCompliance ? 'Yes' : 'No'}</strong></p>
                <p>Incidents: <strong>{screening.securityAssessmentDetails.incidentHistory}</strong></p>
                <p>Certs: <strong>{screening.securityAssessmentDetails.certifications.join(', ') || '—'}</strong></p>
              </div>
            </div>

            {screening.notes && (
              <p className="text-xs font-sans italic text-sand-600 border-l-2 border-rose-200 pl-3">{screening.notes}</p>
            )}
            <p className="text-[11px] font-sans text-sand-400">Expires {new Date(screening.expiresAt).toLocaleDateString()}</p>
          </div>
        </Card>
      )}

      {history.length > 1 && (
        <div>
          <h4 className="font-serif text-sm text-rose-900 mt-4 mb-2">Screening History</h4>
          <ul className="space-y-1.5">
            {history.slice(1).map(s => (
              <li key={s.id} className="flex items-center justify-between text-xs font-sans text-sand-700 bg-white border border-sand-100 rounded px-3 py-2">
                <span>{new Date(s.screenedAt).toLocaleDateString()}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusColors[s.overallScreeningStatus] ?? 'bg-slate-100'}`}>{s.overallScreeningStatus}</span>
                <span>FIN {s.financialHealthScore} · SEC {s.securityAssessmentScore}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScoreMeter({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-sans text-sand-700">{label}</p>
        <p className="text-xs font-sans font-semibold text-sand-900">{value}/100</p>
      </div>
      <div className="w-full h-2 bg-sand-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ── Scorecard Tab ────────────────────────────────────────────────────────────

function ScorecardTab({
  current,
  chart,
}: {
  current: VendorScorecard | null;
  chart: { period: string; score: number; sla: number; quality: number }[];
}) {
  if (!current) {
    return <p className="text-center py-8 text-sm font-sans text-sand-400">No scorecards yet.</p>;
  }

  const stars = Math.round(current.overallScore / 20);

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-serif text-sm text-rose-900">Current Period</h4>
            <p className="text-xs font-sans text-sand-500">{current.period}</p>
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map(n => (
              <Star key={n} className={`w-4 h-4 ${n <= stars ? 'fill-amber-400 text-amber-400' : 'text-sand-300'}`} />
            ))}
            <span className="ml-2 font-serif text-xl text-sand-900">{current.overallScore}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="SLA" value={`${current.slaCompliance}%`} />
          <Metric label="Quality" value={`${current.qualityRating}/100`} />
          <Metric label="Satisfaction" value={`${current.clientSatisfaction}/100`} />
          <Metric label="Incidents" value={String(current.incidentCount)} tone={current.incidentCount > 2 ? 'warn' : 'ok'} />
        </div>
      </Card>

      <Card>
        <h4 className="font-serif text-sm text-rose-900 mb-3">Performance Trend (last {chart.length})</h4>
        {chart.length < 2 ? (
          <p className="text-xs font-sans text-sand-400">Trend data appears after the second scorecard is recorded.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
              <Line type="monotone" dataKey="score" stroke="#881337" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sla" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
              <Line type="monotone" dataKey="quality" stroke="#059669" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}

function Metric({ label, value, tone = 'ok' }: { label: string; value: string; tone?: 'ok' | 'warn' }) {
  return (
    <div className="bg-sand-50 rounded-lg px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-sand-500">{label}</p>
      <p className={`font-sans font-semibold ${tone === 'warn' ? 'text-rose-700' : 'text-sand-900'}`}>{value}</p>
    </div>
  );
}
