'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { VendorDirectory } from '@/components/b2b/vendors/VendorDirectory';
import { ScreeningDashboard } from '@/components/b2b/vendors/ScreeningDashboard';
import { ScorecardDashboard } from '@/components/b2b/vendors/ScorecardDashboard';
import { VendorAlertsList } from '@/components/b2b/vendors/VendorAlertsList';
import { VendorFormDialog } from '@/components/b2b/vendors/VendorFormDialog';
import { DeleteVendorDialog } from '@/components/b2b/vendors/DeleteVendorDialog';
import { StatusChangeDialog } from '@/components/b2b/vendors/StatusChangeDialog';
import type { Vendor, VendorScreening, VendorScorecard, VendorAlert, VendorStatus } from '@/lib/types';
import type { CreateVendorInput } from '@/lib/services/interfaces/IVendorService';
import { logger } from '@/lib/utils/logger';

export default function VendorGovernancePage() {
  const router = useRouter();
  const { can } = useCan();
  const services = useServices();
  const { user: currentUser } = useCurrentUser();

  const canManage = can(Permission.WRITE, 'vendor');
  const canDelete = can(Permission.DELETE, 'vendor');
  const canSeeContract = canManage;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [screenings, setScreenings] = useState<VendorScreening[]>([]);
  const [scorecards, setScorecards] = useState<VendorScorecard[]>([]);
  const [alerts, setAlerts] = useState<VendorAlert[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<Vendor | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);
  const [statusTarget, setStatusTarget] = useState<Vendor | null>(null);

  const [institutionId, setInstitutionId] = useState<string>('');

  const loadData = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);
    try {
      const fullUser = await services.user.getUserById(currentUser.id);
      const inst = fullUser?.institutionId ?? '';
      setInstitutionId(inst);

      if (!inst) {
        setError('Your account is not associated with an institution. Contact your admin.');
        setVendors([]); setScreenings([]); setScorecards([]); setAlerts([]);
        return;
      }

      // Fetch vendors first, then fan out per-vendor screenings/scorecards/alerts.
      // Backend only exposes /api/vendors/{id}/(screenings|scorecards|alerts) per
      // Frontend_Integration_Guide §5.3 — the flat-list paths returned 500s.
      const vendorData = await services.vendor.getVendors({ institutionId: inst });
      setVendors(vendorData);

      const ids = vendorData.map((v) => v.id);
      logger.info('Vendors', 'fan-out vendor sub-resources', {
        institutionId: inst,
        vendorCount: ids.length,
      });

      const [screeningResults, scorecardResults, alertResults] = await Promise.all([
        Promise.allSettled(ids.map((id) => services.vendor.getScreeningsByVendor(id))),
        Promise.allSettled(ids.map((id) => services.vendor.getScorecardsByVendor(id))),
        Promise.allSettled(ids.map((id) => services.vendor.getAlertsByVendor(id))),
      ]);

      const flatten = <T,>(res: PromiseSettledResult<T[]>[], kind: string): T[] => {
        const out: T[] = [];
        res.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            out.push(...r.value);
          } else {
            logger.warn('Vendors', `${kind} fetch failed`, {
              vendorId: ids[i],
              err: r.reason instanceof Error ? r.reason.message : String(r.reason),
            });
          }
        });
        return out;
      };

      setScreenings(flatten<VendorScreening>(screeningResults, 'screening'));
      setScorecards(flatten<VendorScorecard>(scorecardResults, 'scorecard'));
      setAlerts(flatten<VendorAlert>(alertResults, 'alert'));
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      if (err.status === 401) {
        router.push('/auth/signin');
        return;
      }
      setError(err.message || 'Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  }, [services, currentUser, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await services.vendor.acknowledgeVendorAlert(alertId);
      toast.success('Alert acknowledged');
      await loadData();
    } catch {
      toast.error('Failed to acknowledge alert');
    }
  };

  const openCreate = () => {
    setFormMode('create');
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (v: Vendor) => {
    setFormMode('edit');
    setEditTarget(v);
    setFormOpen(true);
  };

  const submitForm = async (input: CreateVendorInput) => {
    if (formMode === 'edit' && editTarget) {
      await services.vendor.updateVendor(editTarget.id, input);
      toast.success('Vendor updated ✓');
    } else {
      await services.vendor.createVendor(input);
      toast.success('Vendor created successfully ✓');
    }
    await loadData();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await services.vendor.deleteVendor(deleteTarget.id);
      toast.error(`Vendor "${deleteTarget.name}" deleted`);
      await loadData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete vendor');
      throw e;
    }
  };

  const confirmStatus = async (next: VendorStatus) => {
    if (!statusTarget) return;
    try {
      await services.vendor.updateVendorStatus(statusTarget.id, next);
      toast.success(`Status changed to ${next} ✓`);
      await loadData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to change status');
      throw e;
    }
  };

  if (!can(Permission.READ, 'vendor')) {
    return (
      <div className="p-8">
        <Card className="bg-rose-50">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-rose-900 mb-2">Access Restricted</h2>
            <p className="font-sans text-sm text-rose-700">
              You do not have permission to access Vendor Governance.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const passedScreenings = screenings.filter(s => s.overallScreeningStatus === 'Passed').length;
  const avgScore = scorecards.length > 0
    ? Math.round(scorecards.reduce((s, sc) => s + sc.overallScore, 0) / scorecards.length)
    : 0;
  const pendingAlerts = alerts.filter(a => !a.acknowledged).length;

  const stats: StatCard[] = [
    { label: 'Total Vendors', value: vendors.length, colorClass: 'from-white to-blue-50' },
    { label: 'Passed Screenings', value: passedScreenings, colorClass: 'from-white to-teal-50' },
    { label: 'Avg Performance Score', value: avgScore, colorClass: 'from-white to-amber-50' },
    { label: 'Pending Alerts', value: pendingAlerts, colorClass: 'from-white to-rose-50' },
  ];

  const tabs = [
    {
      value: 'directory',
      label: 'Directory',
      content: (
        <VendorDirectory
          vendors={vendors}
          canManage={canManage}
          canSeeContract={canSeeContract}
          onEdit={openEdit}
          onDelete={canDelete ? (v) => setDeleteTarget(v) : undefined}
          onChangeStatus={(v) => setStatusTarget(v)}
        />
      ),
    },
    { value: 'screenings', label: 'Screenings', content: <ScreeningDashboard screenings={screenings} /> },
    { value: 'scorecards', label: 'Scorecards', content: <ScorecardDashboard scorecards={scorecards} /> },
    ...(canManage
      ? [{ value: 'alerts', label: 'Alerts', content: <VendorAlertsList alerts={alerts} onAcknowledge={handleAcknowledgeAlert} /> }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-slate-900">Vendor Governance</h1>
          <p className="text-sm font-sans text-slate-600 mt-1">
            Vendor directory, financial/security screening, and performance scorecards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-sans text-sand-700 bg-white border border-sand-200 rounded-lg hover:bg-sand-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {canManage && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-rose-900 text-white text-sm font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Vendor
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 rounded-lg bg-sand-100 animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-lg bg-sand-100 animate-pulse" />
        </div>
      )}

      {!loading && error && (
        <Card className="bg-rose-50 border-rose-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-rose-600" />
              <p className="text-sm text-rose-800 font-sans">{error}</p>
            </div>
            <button onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-rose-700 bg-white rounded-md hover:bg-rose-100">
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        </Card>
      )}

      {!loading && !error && (
        <>
          <StatsRow stats={stats} />
          <Card>
            <Tabs items={tabs} defaultValue="directory" />
          </Card>
        </>
      )}

      <VendorFormDialog
        open={formOpen}
        mode={formMode}
        initial={editTarget}
        institutionId={institutionId}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
      />

      <DeleteVendorDialog
        open={!!deleteTarget}
        vendorName={deleteTarget?.name ?? ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <StatusChangeDialog
        open={!!statusTarget}
        vendorName={statusTarget?.name ?? ''}
        currentStatus={statusTarget?.status ?? 'Under Review'}
        onClose={() => setStatusTarget(null)}
        onConfirm={confirmStatus}
      />
    </div>
  );
}
