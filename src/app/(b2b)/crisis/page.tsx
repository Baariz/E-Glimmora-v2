'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { Shield } from 'lucide-react';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { ActiveCrisesDashboard } from '@/components/b2b/crisis/ActiveCrisesDashboard';
import { AviationDisruptionForecast } from '@/components/b2b/crisis/AviationDisruptionForecast';
import { ExtractionProtocolList } from '@/components/b2b/crisis/ExtractionProtocolList';
import { CrisisResources } from '@/components/b2b/crisis/CrisisResources';
import type { AviationDisruption, ExtractionProtocol, SafeHouse, EmergencyContact } from '@/lib/types';
import { logger } from '@/lib/utils/logger';

export default function CrisisResponsePage() {
  const { can } = useCan();
  const services = useServices();
  const { user: currentUser } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [disruptions, setDisruptions] = useState<AviationDisruption[]>([]);
  const [protocols, setProtocols] = useState<ExtractionProtocol[]>([]);
  const [safeHouses, setSafeHouses] = useState<SafeHouse[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  const userId = currentUser?.id;
  const institutionId = currentUser?.institutionId ?? '';

  const loadCrisisData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    logger.info('Crisis', 'load start', { institutionId });
    try {
      const [disruptionData, protocolData, safeHouseData] = await Promise.all([
        services.crisis.getDisruptions(institutionId),
        services.crisis.getProtocols(institutionId),
        services.crisis.getSafeHouses(),
      ]);
      setDisruptions(disruptionData);
      setProtocols(protocolData);
      setSafeHouses(safeHouseData);
      // Emergency contacts live on the ExtractionProtocol objects per
      // the Frontend Integration Guide §4.5; flatten + dedupe here.
      const flattened = new Map<string, EmergencyContact>();
      for (const p of protocolData) {
        for (const c of p.emergencyContacts ?? []) flattened.set(c.id, c);
      }
      setContacts(Array.from(flattened.values()));
      logger.info('Crisis', 'load done', {
        disruptionCount: disruptionData.length,
        protocolCount: protocolData.length,
        safeHouseCount: safeHouseData.length,
        contactCount: flattened.size,
      });
    } catch (error) {
      logger.error('Crisis', 'load failed', error, { institutionId });
    } finally {
      setLoading(false);
    }
  }, [services, userId, institutionId]);

  useEffect(() => {
    void loadCrisisData();
  }, [loadCrisisData]);

  if (!can(Permission.READ, 'crisis')) {
    return (
      <div className="p-8">
        <Card className="bg-rose-50">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-rose-900 mb-2">Access Restricted</h2>
            <p className="font-sans text-sm text-rose-700">
              You do not have permission to access Crisis Response.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const activeCrises = disruptions.filter(d => d.status === 'Active' || d.status === 'Escalated').length;
  const standbyProtocols = protocols.filter(p => p.status === 'Standby').length;
  const affectedClients = new Set(disruptions.flatMap(d => d.affectedClients)).size;
  const availableSafeHouses = safeHouses.filter(s => s.availableNow).length;

  const stats: StatCard[] = [
    { label: 'Active Crises', value: activeCrises, colorClass: 'from-white to-rose-50' },
    { label: 'Protocols on Standby', value: standbyProtocols, colorClass: 'from-white to-amber-50' },
    { label: 'Affected Clients', value: affectedClients, colorClass: 'from-white to-purple-50' },
    { label: 'Safe Houses Available', value: availableSafeHouses, colorClass: 'from-white to-teal-50' },
  ];

  const tabs = [
    { value: 'crises', label: 'Active Crises', content: <ActiveCrisesDashboard disruptions={disruptions} /> },
    { value: 'forecast', label: 'Aviation Forecast', content: <AviationDisruptionForecast disruptions={disruptions} /> },
    { value: 'protocols', label: 'Extraction Protocols', content: <ExtractionProtocolList protocols={protocols} onActivated={loadCrisisData} /> },
    { value: 'resources', label: 'Resources', content: <CrisisResources safeHouses={safeHouses} contacts={contacts} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Crisis Response</h1>
        <p className="text-sm font-sans text-slate-600 mt-1">
          Aviation disruption forecasting, extraction protocols, and emergency resources
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-sans">Loading crisis data...</div>
      ) : (
        <>
          <StatsRow stats={stats} />
          <Card>
            <Tabs items={tabs} defaultValue="crises" />
          </Card>
        </>
      )}
    </div>
  );
}
