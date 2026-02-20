'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { Shield } from 'lucide-react';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { IntegrationOverview } from '@/components/b2b/integrations/IntegrationOverview';
import { HealthMonitor } from '@/components/b2b/integrations/HealthMonitor';
import { DataFlowDashboard } from '@/components/b2b/integrations/DataFlowDashboard';
import { IntegrationConfigPanel } from '@/components/b2b/integrations/IntegrationConfigPanel';
import type { ExternalIntegration } from '@/lib/types';
import type { IntegrationDashboardStats } from '@/lib/services/interfaces/IIntegrationService';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export default function ExternalIntegrationsPage() {
  const { can } = useCan();
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<ExternalIntegration[]>([]);
  const [dashStats, setDashStats] = useState<IntegrationDashboardStats | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [integrationData, statsData] = await Promise.all([
        services.integration.getIntegrations(MOCK_INSTITUTION_ID),
        services.integration.getDashboardStats(MOCK_INSTITUTION_ID),
      ]);
      setIntegrations(integrationData);
      setDashStats(statsData);
    } catch (error) {
      console.error('Failed to load integration data:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  if (!can(Permission.READ, 'integration')) {
    return (
      <div className="p-8">
        <Card className="bg-rose-50">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-rose-900 mb-2">Access Restricted</h2>
            <p className="font-sans text-sm text-rose-700">
              You do not have permission to access External Integrations.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const canConfigure = can(Permission.CONFIGURE, 'integration');

  const stats: StatCard[] = [
    { label: 'Total Integrations', value: dashStats?.totalIntegrations ?? 0, colorClass: 'from-white to-blue-50' },
    { label: 'Connected', value: dashStats?.connectedCount ?? 0, colorClass: 'from-white to-teal-50' },
    { label: 'Degraded / Disconnected', value: (dashStats?.degradedCount ?? 0) + (dashStats?.disconnectedCount ?? 0), colorClass: 'from-white to-amber-50' },
    { label: 'Avg Health Score', value: dashStats?.averageHealthScore ?? 0, colorClass: 'from-white to-purple-50' },
  ];

  const tabs = [
    { value: 'overview', label: 'Overview', content: <IntegrationOverview integrations={integrations} /> },
    { value: 'health', label: 'Health Monitor', content: <HealthMonitor integrations={integrations} services={services} /> },
    { value: 'dataflow', label: 'Data Flow', content: <DataFlowDashboard integrations={integrations} services={services} /> },
    ...(canConfigure ? [{ value: 'config', label: 'Configuration', content: <IntegrationConfigPanel integrations={integrations} services={services} onRefresh={loadData} /> }] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-slate-900">External Integrations</h1>
        <p className="text-sm font-sans text-slate-600 mt-1">
          Government advisory, aviation data, and insurance provider connections
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-sans">Loading integration data...</div>
      ) : (
        <>
          <StatsRow stats={stats} />
          <Card>
            <Tabs items={tabs} defaultValue="overview" />
          </Card>
        </>
      )}
    </div>
  );
}
