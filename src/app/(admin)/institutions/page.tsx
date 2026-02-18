'use client';

/**
 * Institution Management Page
 * List view with DataTable, stats, search, and actions
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { useServices } from '@/lib/hooks/useServices';
import type { Institution } from '@/lib/types';
import { toast } from 'sonner';

export default function InstitutionsPage() {
  const services = useServices();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const loadInstitutions = async () => {
    setLoading(true);
    try {
      const data = await services.institution.getInstitutions();
      setInstitutions(data);
    } catch (error) {
      console.error('Failed to load institutions:', error);
      toast.error('Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  // Calculate stats
  const stats: StatCard[] = [
    {
      label: 'Total Institutions',
      value: institutions.length,
      colorClass: 'from-white to-slate-50',
    },
    {
      label: 'Active',
      value: institutions.filter((i) => i.status === 'Active').length,
      colorClass: 'from-white to-green-50',
    },
    {
      label: 'Pending',
      value: institutions.filter((i) => i.status === 'Pending').length,
      colorClass: 'from-white to-gold-50',
    },
    {
      label: 'Suspended',
      value: institutions.filter((i) => i.status === 'Suspended').length,
      colorClass: 'from-white to-red-50',
    },
  ];

  // Table columns
  const columns: ColumnDef<Institution>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/institutions/${row.original.id}`)}
          className="text-rose-600 hover:text-rose-700 font-sans text-sm font-medium underline"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="text-sm font-sans text-slate-900">{row.original.type}</span>
      ),
    },
    {
      accessorKey: 'tier',
      header: 'Tier',
      cell: ({ row }) => {
        const tierColors = {
          Platinum: 'purple',
          Gold: 'amber',
          Silver: 'slate',
        };
        return (
          <StatusBadge
            status={row.original.tier}
            variant={tierColors[row.original.tier] as any}
          />
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const colorMap = {
          Active: 'bg-teal-100 text-teal-800',
          Pending: 'bg-gold-100 text-gold-800',
          Suspended: 'bg-red-100 text-red-800',
        };
        return <StatusBadge status={row.original.status} colorMap={colorMap} />;
      },
    },
    {
      accessorKey: 'contractStart',
      header: 'Contract Start',
      cell: ({ row }) => (
        <span className="text-sm font-sans text-slate-600">
          {formatDistanceToNow(new Date(row.original.contractStart), { addSuffix: true })}
        </span>
      ),
    },
    {
      accessorKey: 'contractEnd',
      header: 'Contract End',
      cell: ({ row }) => (
        <span className="text-sm font-sans text-slate-600">
          {row.original.contractEnd
            ? formatDistanceToNow(new Date(row.original.contractEnd), { addSuffix: true })
            : 'Ongoing'}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-light text-gray-900">
            Institution Management
          </h1>
          <p className="text-base font-sans text-gray-600">
            Onboard, manage, and monitor financial institutions
          </p>
        </div>
        <button
          onClick={() => router.push('/institutions/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-sans rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Onboard Institution
        </button>
      </div>

      {/* Stats row */}
      <StatsRow stats={stats} />

      {/* DataTable */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <DataTable
          columns={columns}
          data={institutions}
          searchColumn="name"
          searchPlaceholder="Search by name..."
          emptyMessage="No institutions found"
        />
      </div>
    </div>
  );
}
