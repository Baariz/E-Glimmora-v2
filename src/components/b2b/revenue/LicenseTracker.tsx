'use client';

/**
 * License Tracker Component (REVN-01)
 * Enterprise license tracking with utilization metrics
 */

import { Contract } from '@/lib/types';
import { Card } from '@/components/shared/Card';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LicenseTrackerProps {
  contracts: Contract[];
  activeUsers: number;
  totalUsers: number;
}

export function LicenseTracker({ contracts, activeUsers, totalUsers }: LicenseTrackerProps) {
  const activeContracts = contracts.filter(c => c.status === 'Active');
  const totalSeats = activeContracts.reduce((sum, c) => sum + (c.perUserFee > 0 ? 100 : 0), 0);
  const utilizationPercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  const columns: ColumnDef<Contract>[] = [
    {
      accessorKey: 'id',
      header: 'Contract ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id.slice(0, 8)}...</span>
      ),
    },
    {
      accessorKey: 'tier',
      header: 'Tier',
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.tier}
          variant={
            row.original.tier === 'Platinum'
              ? 'purple'
              : row.original.tier === 'Gold'
              ? 'amber'
              : 'slate'
          }
        />
      ),
    },
    {
      accessorKey: 'annualFee',
      header: 'Annual Fee',
      cell: ({ row }) => (
        <span className="font-medium">
          ${row.original.annualFee.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'perUserFee',
      header: 'Per-User Fee',
      cell: ({ row }) => (
        <span>${row.original.perUserFee.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) =>
        row.original.endDate
          ? new Date(row.original.endDate).toLocaleDateString()
          : 'N/A',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          variant={
            row.original.status === 'Active'
              ? 'teal'
              : row.original.status === 'Expired'
              ? 'red'
              : 'amber'
          }
        />
      ),
    },
  ];

  // Mock utilization data over 6 months
  const utilizationData = [
    { month: 'Aug', utilization: 72 },
    { month: 'Sep', utilization: 76 },
    { month: 'Oct', utilization: 78 },
    { month: 'Nov', utilization: 75 },
    { month: 'Dec', utilization: 79 },
    { month: 'Jan', utilization: utilizationPercent },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-white to-purple-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Active Licenses</p>
            <p className="text-3xl font-serif text-slate-900">{activeContracts.length}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-blue-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Total Seats</p>
            <p className="text-3xl font-serif text-slate-900">{totalSeats}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-teal-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Seats Used</p>
            <p className="text-3xl font-serif text-slate-900">{totalUsers}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-rose-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Utilization</p>
            <p className="text-3xl font-serif text-slate-900">{utilizationPercent}%</p>
          </div>
        </Card>
      </div>

      {/* Utilization chart */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">License Utilization Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={utilizationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="utilization" fill="#0891b2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Contracts table */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">Contract Details</h3>
        <DataTable
          columns={columns}
          data={contracts}
          searchColumn="tier"
          searchPlaceholder="Search by tier..."
          emptyMessage="No contracts found"
        />
      </Card>
    </div>
  );
}
