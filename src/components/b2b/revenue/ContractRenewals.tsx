'use client';

/**
 * Contract Renewals Component (REVN-05)
 * Upcoming contract renewals and expiration tracking
 */

import { useState } from 'react';
import { Contract } from '@/lib/types';
import { Card } from '@/components/shared/Card';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

interface ContractRenewalsProps {
  contracts: Contract[];
}

export function ContractRenewals({ contracts }: ContractRenewalsProps) {
  const [renewingContract, setRenewingContract] = useState<string | null>(null);

  // Calculate days until renewal
  const contractsWithDays = contracts.map(contract => {
    const endDate = contract.endDate ? new Date(contract.endDate) : null;
    const now = new Date();
    const daysUntil = endDate
      ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      ...contract,
      daysUntilRenewal: daysUntil,
    };
  });

  // Sort by soonest expiration
  const sortedContracts = [...contractsWithDays].sort((a, b) => {
    if (a.daysUntilRenewal === null) return 1;
    if (b.daysUntilRenewal === null) return -1;
    return a.daysUntilRenewal - b.daysUntilRenewal;
  });

  const handleInitiateRenewal = (contractId: string) => {
    setRenewingContract(contractId);
    // Mock renewal initiation
    setTimeout(() => {
      toast.success('Renewal initiated successfully', {
        description: 'Contract has been marked for renewal. The client will be notified.',
      });
      setRenewingContract(null);
    }, 1000);
  };

  const columns: ColumnDef<typeof contractsWithDays[0]>[] = [
    {
      accessorKey: 'id',
      header: 'Contract',
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
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) =>
        row.original.endDate
          ? new Date(row.original.endDate).toLocaleDateString()
          : 'N/A',
    },
    {
      accessorKey: 'daysUntilRenewal',
      header: 'Days Until Renewal',
      cell: ({ row }) => {
        const days = row.original.daysUntilRenewal;
        if (days === null) return <span className="text-slate-400">N/A</span>;

        let colorClass = 'text-slate-900';
        if (days < 0) colorClass = 'text-red-600 font-bold';
        else if (days <= 30) colorClass = 'text-amber-600 font-semibold';

        return <span className={colorClass}>{days}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const days = row.original.daysUntilRenewal;
        let statusText: string = row.original.status;
        let variant: 'teal' | 'amber' | 'red' = 'teal';

        if (days !== null && days < 0) {
          statusText = 'Expired';
          variant = 'red';
        } else if (days !== null && days <= 30) {
          statusText = 'Expiring Soon';
          variant = 'amber';
        }

        return <StatusBadge status={statusText} variant={variant} />;
      },
    },
    {
      accessorKey: 'annualFee',
      header: 'Annual Value',
      cell: ({ row }) => (
        <span className="font-medium">
          ${row.original.annualFee.toLocaleString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const isRenewing = renewingContract === row.original.id;
        return (
          <button
            onClick={() => handleInitiateRenewal(row.original.id)}
            disabled={isRenewing || row.original.status === 'Pending Renewal'}
            className="px-3 py-1 bg-rose-700 text-white rounded-md text-xs font-sans hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRenewing ? 'Initiating...' : 'Initiate Renewal'}
          </button>
        );
      },
    },
  ];

  // Group by renewal month for calendar view
  const renewalsByMonth = contractsWithDays.reduce((acc, contract) => {
    if (!contract.endDate) return acc;

    const date = new Date(contract.endDate);
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(contract);

    return acc;
  }, {} as Record<string, typeof contractsWithDays>);

  const upcomingMonths = Object.entries(renewalsByMonth)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(0, 6); // Next 6 months

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-white to-amber-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Expiring Within 30 Days</p>
            <p className="text-3xl font-serif text-amber-600">
              {contractsWithDays.filter(c => c.daysUntilRenewal !== null && c.daysUntilRenewal <= 30 && c.daysUntilRenewal >= 0).length}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-red-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Expired</p>
            <p className="text-3xl font-serif text-red-600">
              {contractsWithDays.filter(c => c.daysUntilRenewal !== null && c.daysUntilRenewal < 0).length}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-teal-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Total Renewal Value</p>
            <p className="text-3xl font-serif text-slate-900">
              ${sortedContracts
                .filter(c => c.daysUntilRenewal !== null && c.daysUntilRenewal <= 90)
                .reduce((sum, c) => sum + c.annualFee, 0)
                .toLocaleString()}
            </p>
            <p className="text-xs font-sans text-slate-500">Next 90 days</p>
          </div>
        </Card>
      </div>

      {/* Contracts table with color-coded rows */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">Contract Renewals</h3>
        <div className="space-y-2">
          <DataTable
            columns={columns}
            data={sortedContracts}
            searchColumn="tier"
            searchPlaceholder="Search by tier..."
            emptyMessage="No contracts found"
          />
        </div>
      </Card>

      {/* Calendar-style upcoming renewals */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">Renewal Calendar</h3>
        <div className="space-y-4">
          {upcomingMonths.length === 0 ? (
            <p className="text-sm font-sans text-slate-500">No upcoming renewals scheduled</p>
          ) : (
            upcomingMonths.map(([month, contracts]) => (
              <div key={month} className="border-l-4 border-rose-500 pl-4">
                <h4 className="font-sans font-semibold text-slate-900 mb-2">{month}</h4>
                <div className="space-y-1">
                  {contracts.map(contract => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span className="font-sans text-slate-700">
                        {contract.tier} - {contract.institutionId.slice(0, 12)}...
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        ${contract.annualFee.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
