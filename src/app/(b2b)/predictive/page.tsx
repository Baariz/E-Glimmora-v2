'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { Shield } from 'lucide-react';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { TravelFatigueDashboard } from '@/components/b2b/intelligence/TravelFatigueDashboard';
import { FamilyAlignmentDashboard } from '@/components/b2b/intelligence/FamilyAlignmentDashboard';
import { PredictiveAlertsList } from '@/components/b2b/intelligence/PredictiveAlertsList';
import { PredictiveTrends } from '@/components/b2b/intelligence/PredictiveTrends';
import type { TravelFatigueAssessment, FamilyAlignmentAssessment, PredictiveAlert } from '@/lib/types';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export default function PredictiveIntelligencePage() {
  const { can } = useCan();
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [fatigueData, setFatigueData] = useState<TravelFatigueAssessment[]>([]);
  const [alignmentData, setAlignmentData] = useState<FamilyAlignmentAssessment[]>([]);
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fatigue, alignment, alertsData] = await Promise.all([
        services.predictive.getTravelFatigueAssessments(MOCK_INSTITUTION_ID),
        services.predictive.getFamilyAlignmentAssessments(MOCK_INSTITUTION_ID),
        services.predictive.getPredictiveAlerts(MOCK_INSTITUTION_ID),
      ]);
      setFatigueData(fatigue);
      setAlignmentData(alignment);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to load predictive data:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  const handleAcknowledge = async (alertId: string) => {
    await services.predictive.acknowledgeAlert(alertId);
    await loadData();
  };

  if (!can(Permission.READ, 'predictive')) {
    return (
      <div className="p-8">
        <Card className="bg-rose-50">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-rose-900 mb-2">Access Restricted</h2>
            <p className="font-sans text-sm text-rose-700">
              You do not have permission to access Predictive Intelligence.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => !a.acknowledged).length;
  const avgFatigue = fatigueData.length > 0
    ? Math.round(fatigueData.reduce((s, a) => s + a.fatigueScore, 0) / fatigueData.length)
    : 0;
  const driftCases = alignmentData.filter(a => a.driftSeverity !== 'Aligned' && a.driftSeverity !== 'Minor').length;

  const stats: StatCard[] = [
    { label: 'Active Alerts', value: activeAlerts, colorClass: 'from-white to-rose-50' },
    { label: 'Avg Fatigue Score', value: avgFatigue, colorClass: 'from-white to-amber-50' },
    { label: 'Family Drift Cases', value: driftCases, colorClass: 'from-white to-purple-50' },
    { label: 'Prediction Accuracy', value: '87%', colorClass: 'from-white to-teal-50' },
  ];

  const tabs = [
    { value: 'fatigue', label: 'Travel Fatigue', content: <TravelFatigueDashboard assessments={fatigueData} /> },
    { value: 'alignment', label: 'Family Alignment', content: <FamilyAlignmentDashboard assessments={alignmentData} /> },
    { value: 'alerts', label: 'Alerts', content: <PredictiveAlertsList alerts={alerts} onAcknowledge={handleAcknowledge} /> },
    { value: 'trends', label: 'Trends', content: <PredictiveTrends fatigueAssessments={fatigueData} alignmentAssessments={alignmentData} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Predictive Intelligence</h1>
        <p className="text-sm font-sans text-slate-600 mt-1">
          Travel fatigue detection, family alignment monitoring, and predictive alerts
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-sans">Loading predictive data...</div>
      ) : (
        <>
          <StatsRow stats={stats} />
          <Card>
            <Tabs items={tabs} defaultValue="fatigue" />
          </Card>
        </>
      )}
    </div>
  );
}
