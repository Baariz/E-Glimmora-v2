'use client';

/**
 * Revenue & Contracts Page
 * Enterprise license tracking, billing overview, SLA monitoring, usage metrics, contract renewals
 */

import { useState, useEffect } from 'react';
import { Permission } from '@/lib/types/permissions';
import { useCan } from '@/lib/rbac/usePermission';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { LicenseTracker } from '@/components/b2b/revenue/LicenseTracker';
import { BillingOverview } from '@/components/b2b/revenue/BillingOverview';
import { SLAMonitor } from '@/components/b2b/revenue/SLAMonitor';
import { UsageMetrics } from '@/components/b2b/revenue/UsageMetrics';
import { ContractRenewals } from '@/components/b2b/revenue/ContractRenewals';
import { services } from '@/lib/services';
import { Contract, RevenueRecord } from '@/lib/types';
import { UsageMetrics as UsageMetricsType, SLAMetrics } from '@/lib/services/interfaces/IContractService';

type TabId = 'licenses' | 'billing' | 'sla' | 'usage' | 'renewals';

export default function RevenuePage() {
  const { can } = useCan();
  const [activeTab, setActiveTab] = useState<TabId>('licenses');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetricsType | null>(null);
  const [slaMetrics, setSlaMetrics] = useState<SLAMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Permission gate: Revenue section requires contract READ OR revenue READ
  const canViewRevenue = can(Permission.READ, 'contract') || can(Permission.READ, 'revenue');

  useEffect(() => {
    async function loadData() {
      try {
        // Mock institution ID (in real app, get from auth context)
        const institutionId = 'inst-001-uuid-placeholder';

        const [contractsData, revenueData, usage, sla] = await Promise.all([
          services.contract.getContracts(institutionId),
          services.contract.getRevenueRecords(institutionId),
          services.contract.getUsageMetrics(institutionId),
          services.contract.getSLAMetrics(institutionId),
        ]);

        setContracts(contractsData);
        setRevenueRecords(revenueData);
        setUsageMetrics(usage);
        setSlaMetrics(sla);
      } catch (error) {
        console.error('Failed to load revenue data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (canViewRevenue) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [canViewRevenue]);

  if (!canViewRevenue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl text-rose-600">!</span>
        </div>
        <h2 className="text-2xl font-serif text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-600 font-sans max-w-md">
          You do not have permission to view revenue and contracts. This section is available to
          Institutional Admins, Private Bankers, and Family Office Directors.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-700 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-sans text-slate-600">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalRevenue = revenueRecords.reduce((sum, r) => sum + r.amount, 0);
  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  const licenseUtilization = usageMetrics
    ? Math.round((usageMetrics.activeUsers / usageMetrics.totalUsers) * 100)
    : 0;
  const slaCompliance = slaMetrics ? slaMetrics.uptimePercent : 0;

  const stats: StatCard[] = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      subtitle: 'Last 6 months',
      colorClass: 'from-white to-teal-50',
    },
    {
      label: 'Active Contracts',
      value: activeContracts,
      colorClass: 'from-white to-blue-50',
    },
    {
      label: 'License Utilization',
      value: `${licenseUtilization}%`,
      colorClass: 'from-white to-purple-50',
    },
    {
      label: 'SLA Compliance',
      value: `${slaCompliance}%`,
      subtitle: 'Uptime',
      colorClass: slaCompliance >= (slaMetrics?.slaTarget || 99.9) ? 'from-white to-teal-50' : 'from-white to-red-50',
    },
  ];

  const tabs = [
    { id: 'licenses' as TabId, label: 'Licenses' },
    { id: 'billing' as TabId, label: 'Billing' },
    { id: 'sla' as TabId, label: 'SLA' },
    { id: 'usage' as TabId, label: 'Usage' },
    { id: 'renewals' as TabId, label: 'Renewals' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Revenue & Contracts</h1>
        <p className="text-sm font-sans text-slate-600 mt-2">
          Enterprise license tracking, billing, SLA compliance, and contract renewals
        </p>
      </div>

      {/* Stats row */}
      <StatsRow stats={stats} />

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 font-sans text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-rose-700 text-rose-700 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'licenses' && usageMetrics && (
          <LicenseTracker
            contracts={contracts}
            activeUsers={usageMetrics.activeUsers}
            totalUsers={usageMetrics.totalUsers}
          />
        )}
        {activeTab === 'billing' && <BillingOverview revenueRecords={revenueRecords} />}
        {activeTab === 'sla' && slaMetrics && <SLAMonitor slaMetrics={slaMetrics} />}
        {activeTab === 'usage' && usageMetrics && <UsageMetrics metrics={usageMetrics} />}
        {activeTab === 'renewals' && <ContractRenewals contracts={contracts} />}
      </div>
    </div>
  );
}
