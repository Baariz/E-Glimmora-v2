'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { Shield } from 'lucide-react';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { VendorDirectory } from '@/components/b2b/vendors/VendorDirectory';
import { ScreeningDashboard } from '@/components/b2b/vendors/ScreeningDashboard';
import { ScorecardDashboard } from '@/components/b2b/vendors/ScorecardDashboard';
import { VendorAlertsList } from '@/components/b2b/vendors/VendorAlertsList';
import type { Vendor, VendorScreening, VendorScorecard, VendorAlert } from '@/lib/types';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export default function VendorGovernancePage() {
  const { can } = useCan();
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [screenings, setScreenings] = useState<VendorScreening[]>([]);
  const [scorecards, setScorecards] = useState<VendorScorecard[]>([]);
  const [alerts, setAlerts] = useState<VendorAlert[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vendorData, screeningData, scorecardData, alertData] = await Promise.all([
        services.vendor.getVendors(MOCK_INSTITUTION_ID),
        services.vendor.getScreenings(MOCK_INSTITUTION_ID),
        services.vendor.getScorecards(MOCK_INSTITUTION_ID),
        services.vendor.getVendorAlerts(MOCK_INSTITUTION_ID),
      ]);
      setVendors(vendorData);
      setScreenings(screeningData);
      setScorecards(scorecardData);
      setAlerts(alertData);
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  const handleAcknowledgeAlert = async (alertId: string) => {
    await services.vendor.acknowledgeVendorAlert(alertId);
    await loadData();
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
    { value: 'directory', label: 'Directory', content: <VendorDirectory vendors={vendors} /> },
    { value: 'screenings', label: 'Screenings', content: <ScreeningDashboard screenings={screenings} /> },
    { value: 'scorecards', label: 'Scorecards', content: <ScorecardDashboard scorecards={scorecards} /> },
    { value: 'alerts', label: 'Alerts', content: <VendorAlertsList alerts={alerts} onAcknowledge={handleAcknowledgeAlert} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Vendor Governance</h1>
        <p className="text-sm font-sans text-slate-600 mt-1">
          Vendor directory, financial/security screening, and performance scorecards
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-sans">Loading vendor data...</div>
      ) : (
        <>
          <StatsRow stats={stats} />
          <Card>
            <Tabs items={tabs} defaultValue="directory" />
          </Card>
        </>
      )}
    </div>
  );
}
