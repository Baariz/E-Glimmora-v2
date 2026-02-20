'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { Shield } from 'lucide-react';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { ConflictAlertList } from '@/components/b2b/conflicts/ConflictAlertList';
import { ConflictMatrix } from '@/components/b2b/conflicts/ConflictMatrix';
import { ResolutionTracker } from '@/components/b2b/conflicts/ResolutionTracker';
import type { ConflictAlert, ConflictMatrixEntry } from '@/lib/types';
import type { ConflictStats } from '@/lib/services/interfaces/IConflictService';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export default function ConflictDetectionPage() {
  const { can } = useCan();
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [conflicts, setConflicts] = useState<ConflictAlert[]>([]);
  const [matrix, setMatrix] = useState<ConflictMatrixEntry[]>([]);
  const [conflictStats, setConflictStats] = useState<ConflictStats | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [conflictData, matrixData, statsData] = await Promise.all([
        services.conflict.getConflictAlerts(MOCK_INSTITUTION_ID),
        services.conflict.getConflictMatrix(MOCK_INSTITUTION_ID),
        services.conflict.getConflictStats(MOCK_INSTITUTION_ID),
      ]);
      setConflicts(conflictData);
      setMatrix(matrixData);
      setConflictStats(statsData);
    } catch (error) {
      console.error('Failed to load conflict data:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  const handleAcknowledge = async (conflictId: string) => {
    await services.conflict.acknowledgeConflict(conflictId, 'current-user');
    await loadData();
  };

  const handleResolve = async (conflictId: string, action: string, notes: string) => {
    await services.conflict.resolveConflict(conflictId, {
      resolvedBy: 'current-user',
      action,
      notes,
    });
    await loadData();
  };

  if (!can(Permission.READ, 'conflict')) {
    return (
      <div className="p-8">
        <Card className="bg-rose-50">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-rose-900 mb-2">Access Restricted</h2>
            <p className="font-sans text-sm text-rose-700">
              You do not have permission to access Conflict Detection.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const statCards: StatCard[] = [
    { label: 'Active Conflicts', value: conflictStats?.totalActive ?? 0, colorClass: 'from-white to-rose-50' },
    { label: 'Critical Alerts', value: conflictStats?.criticalCount ?? 0, colorClass: 'from-white to-red-50' },
    { label: 'Resolved This Month', value: conflictStats?.totalResolved ?? 0, colorClass: 'from-white to-teal-50' },
    { label: 'Avg Resolution (hrs)', value: conflictStats?.averageResolutionHours ?? 0, colorClass: 'from-white to-amber-50' },
  ];

  const resolvedConflicts = conflicts.filter(c => c.status === 'Resolved');

  const tabs = [
    { value: 'alerts', label: 'Active Alerts', content: <ConflictAlertList conflicts={conflicts.filter(c => c.status !== 'Resolved')} onAcknowledge={handleAcknowledge} onResolve={handleResolve} /> },
    { value: 'matrix', label: 'Conflict Matrix', content: <ConflictMatrix entries={matrix} /> },
    { value: 'resolved', label: 'Resolution Tracker', content: <ResolutionTracker conflicts={resolvedConflicts} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Conflict Detection</h1>
        <p className="text-sm font-sans text-slate-600 mt-1">
          Cross-UHNI conflict monitoring with privacy-safe alerting and resolution tracking
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-sans">Loading conflict data...</div>
      ) : (
        <>
          <StatsRow stats={statCards} />
          <Card>
            <Tabs items={tabs} defaultValue="alerts" />
          </Card>
        </>
      )}
    </div>
  );
}
