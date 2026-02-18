'use client';

/**
 * Client Portfolio List Page
 * Displays all clients assigned to the current RM with search, filters, and DataTable
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import { ClientRecord } from '@/lib/types';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { Button } from '@/components/shared/Button';
import { Users } from 'lucide-react';

// Hardcoded mock RM ID for development
const MOCK_RM_USER_ID = 'b2b-rm-001-uuid-placeholder';

// Risk category color map
const RISK_COLOR_MAP: Record<string, string> = {
  Low: 'bg-olive-100 text-olive-800',
  Medium: 'bg-gold-100 text-gold-800',
  High: 'bg-rose-100 text-rose-800',
  Critical: 'bg-red-100 text-red-800',
};

// NDA status color map
const NDA_COLOR_MAP: Record<string, string> = {
  Active: 'bg-teal-100 text-teal-800',
  Pending: 'bg-gold-100 text-gold-800',
  Expired: 'bg-rose-100 text-rose-800',
  None: 'bg-slate-100 text-slate-500',
};

export default function ClientsPage() {
  const router = useRouter();
  const services = useServices();
  const { can } = useCan();
  const canReadClient = can(Permission.READ, 'client');
  const canWriteClient = can(Permission.WRITE, 'client');

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientRecord[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      const data = await services.client.getClientsByRM(MOCK_RM_USER_ID);
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  }

  // Permission gate
  if (!canReadClient) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-slate-900 mb-2">Access Denied</h2>
          <p className="font-sans text-slate-600">
            You do not have permission to view client records.
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const pendingOnboarding = clients.filter(
    c => c.status === 'Onboarding' || c.status === 'Pending'
  ).length;
  const highRisk = clients.filter(
    c => c.riskCategory === 'High' || c.riskCategory === 'Critical'
  ).length;

  const stats: StatCard[] = [
    {
      label: 'Total Clients',
      value: totalClients,
      colorClass: 'from-white to-slate-50',
    },
    {
      label: 'Active',
      value: activeClients,
      subtitle: 'Currently engaged',
      colorClass: 'from-white to-teal-50',
    },
    {
      label: 'Pending Onboarding',
      value: pendingOnboarding,
      subtitle: 'Requires attention',
      colorClass: 'from-white to-gold-50',
    },
    {
      label: 'High Risk',
      value: highRisk,
      subtitle: 'Enhanced monitoring',
      colorClass: 'from-white to-rose-50',
    },
  ];

  // DataTable columns
  const columns: ColumnDef<ClientRecord>[] = [
    {
      accessorKey: 'name',
      header: 'Client Name',
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'riskCategory',
      header: 'Risk Level',
      cell: ({ row }) => (
        <StatusBadge status={row.original.riskCategory} colorMap={RISK_COLOR_MAP} />
      ),
    },
    {
      accessorKey: 'activeJourneyCount',
      header: 'Active Journeys',
      cell: ({ row }) => (
        <span className="font-sans text-sm">{row.original.activeJourneyCount}</span>
      ),
    },
    {
      accessorKey: 'ndaStatus',
      header: 'NDA Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.ndaStatus} colorMap={NDA_COLOR_MAP} />
      ),
    },
    {
      accessorKey: 'lastActivity',
      header: 'Last Activity',
      cell: ({ row }) => {
        try {
          const distance = formatDistanceToNow(new Date(row.original.lastActivity), {
            addSuffix: true,
          });
          return <span className="font-sans text-sm text-slate-600">{distance}</span>;
        } catch {
          return <span className="font-sans text-sm text-slate-400">N/A</span>;
        }
      },
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-slate-900 mb-2">Client Portfolio</h1>
          <p className="font-sans text-slate-600">
            Manage your UHNI client relationships and profiles
          </p>
        </div>
        {canWriteClient && (
          <Button
            variant="primary"
            onClick={() => router.push('/clients/new')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            New Client
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <StatsRow stats={stats} />

      {/* Client Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4" />
            <p className="font-sans text-sm text-slate-600">Loading clients...</p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={clients}
          searchColumn="name"
          searchPlaceholder="Search clients..."
          pageSize={25}
          onRowClick={(row) => router.push(`/clients/${row.id}`)}
          emptyMessage="No clients found. Create your first client to get started."
        />
      )}
    </div>
  );
}
