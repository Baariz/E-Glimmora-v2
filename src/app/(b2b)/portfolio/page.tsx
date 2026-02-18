'use client';

/**
 * B2B Portfolio Dashboard
 * Complete dashboard with all 7 DASH requirements
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';

import { useServices } from '@/lib/hooks/useServices';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { ClientRecord, Journey, JourneyStatus, RiskCategory } from '@/lib/types';
import { Card } from '@/components/shared/Card';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatsRow } from '@/components/b2b/layouts/StatsRow';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';

// Hardcoded mock IDs for development
const MOCK_RM_USER_ID = 'b2b-rm-001-uuid-placeholder';
const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export default function PortfolioPage() {
  const router = useRouter();
  const services = useServices();
  const { can } = useCan();
  const canReadRisk = can(Permission.READ, 'risk');
  const canReadRevenue = can(Permission.READ, 'revenue');
  const canReadJourney = can(Permission.READ, 'journey');

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<any>(null);
  const [revenueRecords, setRevenueRecords] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // Load clients
      const clientData = await services.client.getClientsByRM(MOCK_RM_USER_ID);
      setClients(clientData);

      // Load journeys for all clients
      if (canReadJourney) {
        const allJourneys: Journey[] = [];
        for (const client of clientData) {
          const clientJourneys = await services.journey.getJourneys(client.userId, 'b2b');
          allJourneys.push(...clientJourneys);
        }
        setJourneys(allJourneys);
      }

      // Load risk metrics
      if (canReadRisk) {
        const risk = await services.risk.getPortfolioRisk(MOCK_INSTITUTION_ID);
        setRiskMetrics(risk);
      }

      // Load revenue records
      if (canReadRevenue) {
        const revenue = await services.contract.getRevenueRecords(MOCK_INSTITUTION_ID);
        setRevenueRecords(revenue);
      }
    } catch (error) {
      toast.error('Failed to load portfolio data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  }

  // DASH-01: Client table columns
  const clientColumns: ColumnDef<ClientRecord>[] = [
    {
      accessorKey: 'name',
      header: 'Client Name',
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      enableSorting: true,
    },
    {
      accessorKey: 'riskCategory',
      header: 'Risk',
      cell: ({ row }) => <StatusBadge status={row.original.riskCategory} />,
      enableSorting: true,
    },
    {
      accessorKey: 'activeJourneyCount',
      header: 'Active Journeys',
      enableSorting: true,
    },
    {
      accessorKey: 'ndaStatus',
      header: 'NDA Status',
      cell: ({ row }) => <StatusBadge status={row.original.ndaStatus} size="sm" />,
      enableSorting: true,
    },
    {
      accessorKey: 'lastActivity',
      header: 'Last Activity',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {formatDistanceToNow(new Date(row.original.lastActivity), { addSuffix: true })}
        </span>
      ),
      enableSorting: true,
    },
  ];

  // Calculate stats
  const totalClients = clients.length;
  const activeJourneys = journeys.filter(j =>
    j.status !== JourneyStatus.ARCHIVED && j.status !== JourneyStatus.EXECUTED
  ).length;
  const riskAlerts = clients.filter(c =>
    c.riskCategory === 'High' || c.riskCategory === 'Critical'
  ).length;
  const quarterlyRevenue = revenueRecords
    .filter(r => r.period.includes('2026-Q1'))
    .reduce((sum, r) => sum + r.amount, 0);

  // DASH-03: Journey pipeline data
  const journeyPipeline = Object.values(JourneyStatus).map(status => ({
    status: status.replace('_', ' '),
    count: journeys.filter(j => j.status === status).length,
    color: getStatusColor(status),
  }));

  // DASH-02: Risk heat map data
  const riskHeatMapData = clients.map((client, index) => ({
    x: index,
    y: client.riskScore,
    name: client.name,
    category: client.riskCategory,
    fill: getRiskColor(client.riskCategory),
  }));

  // DASH-04: Emotional insights data
  const clientsWithEmotionalProfile = clients.filter(c => c.emotionalProfile);

  // DASH-05: NDA tracker data
  const ndaClients = clients.filter(c => c.ndaStatus !== 'None');

  // DASH-06: Compliance alerts
  const complianceAlerts = [
    ...clients.filter(c => c.riskCategory === 'High' || c.riskCategory === 'Critical')
      .map(c => ({ type: 'Risk', message: `${c.name} has ${c.riskCategory} risk rating` })),
    ...clients.filter(c => c.ndaStatus === 'Expired')
      .map(c => ({ type: 'NDA', message: `${c.name} NDA expired` })),
    ...journeys.filter(j => {
      if (j.status !== JourneyStatus.COMPLIANCE_REVIEW) return false;
      const created = new Date(j.createdAt);
      const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 7;
    }).map(j => ({ type: 'Journey', message: `Journey "${j.title}" stuck in compliance review for >7 days` })),
  ];

  // DASH-07: Revenue by month (last 6 months)
  const revenueByMonth = revenueRecords
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-6)
    .map(r => ({
      period: r.period,
      amount: r.amount,
    }));

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-light text-slate-900">Portfolio Dashboard</h1>
          <p className="text-base font-sans text-slate-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-light text-slate-900">Portfolio Dashboard</h1>
        <p className="text-base font-sans text-slate-600">
          Overview of client portfolio, active journeys, and risk metrics
        </p>
      </div>

      {/* DASH-01 & DASH-07: Stats Row */}
      <StatsRow
        stats={[
          {
            label: 'Total Clients',
            value: totalClients,
            subtitle: `${clients.filter(c => c.status === 'Active').length} active`,
            colorClass: 'from-white to-rose-50',
          },
          {
            label: 'Active Journeys',
            value: activeJourneys,
            subtitle: `Across ${new Set(journeys.map(j => j.userId)).size} clients`,
            colorClass: 'from-white to-teal-50',
          },
          {
            label: 'Risk Alerts',
            value: riskAlerts,
            subtitle: 'Requires attention',
            colorClass: 'from-white to-gold-50',
          },
          {
            label: 'Quarterly Revenue',
            value: canReadRevenue ? `$${(quarterlyRevenue / 1000).toFixed(0)}K` : 'N/A',
            subtitle: canReadRevenue ? 'Q1 2026' : 'No access',
            colorClass: 'from-white to-olive-50',
          },
        ]}
      />

      {/* DASH-01: Portfolio Client Table */}
      <Card header="Client Portfolio">
        <DataTable
          columns={clientColumns}
          data={clients}
          searchPlaceholder="Search clients..."
          searchColumn="name"
          onRowClick={(client) => router.push(`/clients/${client.id}`)}
          emptyMessage="No clients found"
        />
      </Card>

      {/* DASH-02: Risk Heat Map */}
      {canReadRisk && (
        <Card header="Portfolio Risk Heat Map">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Client" hide />
              <YAxis type="number" dataKey="y" name="Risk Score" domain={[0, 100]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-slate-200 rounded shadow-lg">
                      <p className="font-sans text-sm font-semibold">{data.name}</p>
                      <p className="font-sans text-xs text-slate-600">
                        Risk Score: {data.y} ({data.category})
                      </p>
                    </div>
                  );
                }}
              />
              <Scatter data={riskHeatMapData} />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* DASH-03: Journey Pipeline Tracker */}
      {canReadJourney && (
        <Card header="Journey Pipeline">
          <div className="space-y-4">
            {journeyPipeline.map((stage) => (
              <div key={stage.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-sans text-slate-700">{stage.status}</span>
                  <span className="text-sm font-sans font-semibold text-slate-900">{stage.count}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stage.color}`}
                    style={{ width: `${(stage.count / Math.max(...journeyPipeline.map(s => s.count), 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* DASH-04: Emotional Insight Comparison */}
      {clientsWithEmotionalProfile.length > 0 && (
        <Card header="Client Emotional Profiles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientsWithEmotionalProfile.slice(0, 6).map((client) => (
              <div key={client.id} className="border border-slate-200 rounded-lg p-4">
                <p className="font-sans text-sm font-semibold text-slate-900 mb-3">{client.name}</p>
                <ResponsiveContainer width="100%" height={150}>
                  <RadarChart data={Object.entries(client.emotionalProfile!).map(([key, value]) => ({
                    subject: key.charAt(0).toUpperCase() + key.slice(1),
                    value,
                  }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} />
                    <Radar dataKey="value" stroke="#be185d" fill="#be185d" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* DASH-05 & DASH-06: NDA Tracker + Compliance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header="NDA Tracker">
          <div className="space-y-3">
            {ndaClients.length === 0 ? (
              <p className="text-sm font-sans text-slate-500">No active NDAs</p>
            ) : (
              ndaClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-sans font-medium text-slate-900">{client.name}</p>
                    {client.ndaExpiresAt && (
                      <p className="text-xs font-sans text-slate-500">
                        Expires {formatDistanceToNow(new Date(client.ndaExpiresAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={client.ndaStatus} size="sm" />
                </div>
              ))
            )}
          </div>
        </Card>

        <Card header={`Compliance Alerts (${complianceAlerts.length})`}>
          <div className="space-y-3">
            {complianceAlerts.length === 0 ? (
              <p className="text-sm font-sans text-slate-500">No alerts</p>
            ) : (
              complianceAlerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-shrink-0 mt-0.5">
                    <StatusBadge status={alert.type} size="sm" />
                  </div>
                  <p className="text-sm font-sans text-slate-700">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* DASH-07: Revenue Metrics */}
      {canReadRevenue && revenueRecords.length > 0 && (
        <Card header="Revenue Metrics">
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="#0d9488" />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs font-sans text-slate-500">Total Revenue</p>
                <p className="text-2xl font-serif text-slate-900">
                  ${(revenueRecords.reduce((sum, r) => sum + r.amount, 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-xs font-sans text-slate-500">Avg per Client</p>
                <p className="text-2xl font-serif text-slate-900">
                  ${totalClients > 0 ? (revenueRecords.reduce((sum, r) => sum + r.amount, 0) / totalClients / 1000).toFixed(0) : 0}K
                </p>
              </div>
              <div>
                <p className="text-xs font-sans text-slate-500">This Quarter</p>
                <p className="text-2xl font-serif text-slate-900">${(quarterlyRevenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function getStatusColor(status: JourneyStatus): string {
  const colors: Record<JourneyStatus, string> = {
    [JourneyStatus.DRAFT]: 'bg-slate-300',
    [JourneyStatus.RM_REVIEW]: 'bg-gold-400',
    [JourneyStatus.COMPLIANCE_REVIEW]: 'bg-amber-400',
    [JourneyStatus.APPROVED]: 'bg-teal-400',
    [JourneyStatus.PRESENTED]: 'bg-olive-400',
    [JourneyStatus.EXECUTED]: 'bg-emerald-400',
    [JourneyStatus.ARCHIVED]: 'bg-gray-300',
  };
  return colors[status] || 'bg-slate-300';
}

function getRiskColor(category: RiskCategory): string {
  const colors: Record<RiskCategory, string> = {
    Low: '#84cc16',
    Medium: '#eab308',
    High: '#f43f5e',
    Critical: '#dc2626',
  };
  return colors[category] || '#94a3b8';
}
