'use client';

/**
 * Risk Intelligence Hub
 * RISK-01 through RISK-05: Geopolitical map, travel advisories, exposure analytics,
 * insurance logs, and compliance flags
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { GeopoliticalMap } from '@/components/b2b/risk/GeopoliticalMap';
import { TravelAdvisoryList } from '@/components/b2b/risk/TravelAdvisoryList';
import { ExposureAnalytics } from '@/components/b2b/risk/ExposureAnalytics';
import { InsuranceLogs } from '@/components/b2b/risk/InsuranceLogs';
import { ComplianceFlags } from '@/components/b2b/risk/ComplianceFlags';
import { Shield, AlertTriangle, BarChart3, FileText, Flag } from 'lucide-react';

export default function RiskIntelligencePage() {
  const { can } = useCan();
  const { risk } = useServices();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading risk data
    const loadData = async () => {
      try {
        await risk.getGeopoliticalRisks();
        setLoading(false);
      } catch (error) {
        console.error('Failed to load risk data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, [risk]);

  // Permission gate: can(Permission.READ, 'risk')
  if (!can(Permission.READ, 'risk')) {
    return (
      <div className="p-8">
        <Card className="bg-rose-50">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-rose-900 mb-2">Access Restricted</h2>
            <p className="font-sans text-sm text-rose-700">
              You do not have permission to view Risk Intelligence.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      value: 'map',
      label: 'Geopolitical Map',
      content: <GeopoliticalMap />
    },
    {
      value: 'advisories',
      label: 'Travel Advisories',
      content: <TravelAdvisoryList />
    },
    {
      value: 'analytics',
      label: 'Exposure Analytics',
      content: <ExposureAnalytics />
    },
    {
      value: 'insurance',
      label: 'Insurance Logs',
      content: <InsuranceLogs />
    },
    {
      value: 'compliance',
      label: 'Compliance Flags',
      content: <ComplianceFlags />
    }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-slate-900 mb-2">
          Risk Intelligence
        </h1>
        <p className="font-sans text-sm text-slate-600">
          Geopolitical risk assessment, travel advisories, client exposure analytics, insurance management, and compliance monitoring
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Shield className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-sans text-slate-600">Countries Monitored</p>
              <p className="text-2xl font-serif text-slate-900">12</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-sans text-slate-600">Active Advisories</p>
              <p className="text-2xl font-serif text-slate-900">6</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-sans text-slate-600">High Risk Clients</p>
              <p className="text-2xl font-serif text-slate-900">3</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-teal-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-sans text-slate-600">Insurance Policies</p>
              <p className="text-2xl font-serif text-slate-900">5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Card>
        <Tabs items={tabs} defaultValue="map" />
      </Card>
    </div>
  );
}
