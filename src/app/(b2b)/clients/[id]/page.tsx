'use client';

/**
 * Client Detail Page
 * Shows client overview, journeys, intelligence, and advisor assignments
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { ClientRecord } from '@/lib/types';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Tabs, TabItem } from '@/components/shared/Tabs';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { RMIntakeWizard } from '@/components/b2b/clients/RMIntakeWizard';
import { AdvisorAssignment } from '@/components/b2b/clients/AdvisorAssignment';
import { JourneyTimeline } from '@/components/b2b/clients/JourneyTimeline';
import { IntelligenceHistory } from '@/components/b2b/clients/IntelligenceHistory';
import { ChevronRight, User, Edit, Heart } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const RISK_COLOR_MAP: Record<string, string> = {
  Low: 'bg-olive-100 text-olive-800',
  Medium: 'bg-gold-100 text-gold-800',
  High: 'bg-rose-100 text-rose-800',
  Critical: 'bg-red-100 text-red-800',
};

interface ClientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const [clientId, setClientId] = useState<string>('');

  // Unwrap params promise
  useEffect(() => {
    params.then((p) => setClientId(p.id));
  }, [params]);
  const router = useRouter();
  const services = useServices();
  const { can } = useCan();
  const canReadClient = can(Permission.READ, 'client');

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadClient();
  }, [clientId]);

  async function loadClient() {
    if (!clientId) return;
    try {
      setLoading(true);
      const data = await services.client.getClientById(clientId);
      setClient(data);
    } catch (error) {
      console.error('Failed to load client:', error);
    } finally {
      setLoading(false);
    }
  }

  // Permission gate
  if (!canReadClient) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto text-center">
          <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-slate-900 mb-2">Access Denied</h2>
          <p className="font-sans text-slate-600">
            You do not have permission to view this client.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4" />
          <p className="font-sans text-sm text-slate-600">Loading client...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto text-center">
          <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-slate-900 mb-2">Client Not Found</h2>
          <p className="font-sans text-slate-600 mb-4">
            The client you are looking for does not exist.
          </p>
          <Button variant="primary" onClick={() => router.push('/clients')}>
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  // Prepare emotional drivers radar chart data
  const emotionalChartData = client.emotionalProfile
    ? [
        { driver: 'Security', value: client.emotionalProfile.security },
        { driver: 'Adventure', value: client.emotionalProfile.adventure },
        { driver: 'Legacy', value: client.emotionalProfile.legacy },
        { driver: 'Recognition', value: client.emotionalProfile.recognition },
        { driver: 'Autonomy', value: client.emotionalProfile.autonomy },
      ]
    : [];

  const tabs: TabItem[] = [
    {
      value: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Client Summary Card */}
          <Card className="p-6">
            <h3 className="font-serif text-xl text-slate-900 mb-4">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-sans text-slate-500 uppercase mb-1">Full Name</p>
                <p className="font-sans text-slate-900">{client.name}</p>
              </div>
              <div>
                <p className="text-xs font-sans text-slate-500 uppercase mb-1">Email</p>
                <p className="font-sans text-slate-900">{client.email}</p>
              </div>
              <div>
                <p className="text-xs font-sans text-slate-500 uppercase mb-1">Status</p>
                <StatusBadge status={client.status} />
              </div>
              <div>
                <p className="text-xs font-sans text-slate-500 uppercase mb-1">Risk Level</p>
                <StatusBadge status={client.riskCategory} colorMap={RISK_COLOR_MAP} />
              </div>
              <div>
                <p className="text-xs font-sans text-slate-500 uppercase mb-1">NDA Status</p>
                <StatusBadge status={client.ndaStatus} />
              </div>
              <div>
                <p className="text-xs font-sans text-slate-500 uppercase mb-1">Onboarded</p>
                <p className="font-sans text-slate-900">
                  {new Date(client.onboardedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Emotional Profile */}
          {client.emotionalProfile ? (
            <Card className="p-6">
              <h3 className="font-serif text-xl text-slate-900 mb-4">Emotional Profile</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={emotionalChartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="driver" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar
                    name="Emotional Drivers"
                    dataKey="value"
                    stroke="#f43f5e"
                    fill="#f43f5e"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-slate-900 mb-2">No Emotional Profile</h3>
              <p className="font-sans text-slate-600 mb-4">
                Conduct an emotional intake to understand this client&apos;s drivers and preferences.
              </p>
              <Button variant="primary" onClick={() => setIntakeModalOpen(true)}>
                Start Emotional Intake
              </Button>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-xs font-sans text-slate-500 uppercase mb-1">Active Journeys</p>
              <p className="text-3xl font-serif text-slate-900">{client.activeJourneyCount}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-sans text-slate-500 uppercase mb-1">Total Journeys</p>
              <p className="text-3xl font-serif text-slate-900">{client.totalJourneyCount}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-sans text-slate-500 uppercase mb-1">Assigned Advisors</p>
              <p className="text-3xl font-serif text-slate-900">{client.assignedAdvisors.length}</p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      value: 'journeys',
      label: 'Journeys',
      content: <JourneyTimeline clientId={client.id} userId={client.userId} />,
    },
    {
      value: 'intelligence',
      label: 'Intelligence',
      content: <IntelligenceHistory clientId={client.id} userId={client.userId} />,
    },
    {
      value: 'advisors',
      label: 'Advisors',
      content: <AdvisorAssignment clientId={client.id} assignedAdvisors={client.assignedAdvisors} onUpdate={loadClient} />,
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-sans text-slate-600">
        <button
          onClick={() => router.push('/portfolio')}
          className="hover:text-rose-600 transition-colors"
        >
          Portfolio
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() => router.push('/clients')}
          className="hover:text-rose-600 transition-colors"
        >
          Clients
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900">{client.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <h1 className="font-serif text-4xl text-slate-900 mb-2">{client.name}</h1>
            <div className="flex items-center gap-2">
              <StatusBadge status={client.status} />
              <StatusBadge status={client.riskCategory} colorMap={RISK_COLOR_MAP} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIntakeModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            {client.emotionalProfile ? 'Re-assess' : 'Emotional Intake'}
          </Button>
          {can(Permission.WRITE, 'client') && (
            <Button variant="ghost" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs items={tabs} value={activeTab} onValueChange={setActiveTab} />

      {/* RM Intake Modal */}
      <RMIntakeWizard
        open={intakeModalOpen}
        onOpenChange={setIntakeModalOpen}
        clientId={client.id}
        clientName={client.name}
        userId={client.userId}
        onComplete={() => {
          setIntakeModalOpen(false);
          loadClient();
        }}
      />
    </div>
  );
}
