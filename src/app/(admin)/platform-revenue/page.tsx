'use client';

/**
 * Revenue Overview Page
 * Super Admin can view cross-institution revenue, billing, and contract metrics
 */

import { useEffect, useState, useMemo } from 'react';
import { formatDistanceToNow, format, isAfter, parseISO, addMonths } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, Building2, Clock } from 'lucide-react';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { Card } from '@/components/shared/Card';
import { useServices } from '@/lib/hooks/useServices';
import type { Contract, Institution, InstitutionTier } from '@/lib/types';
import { toast } from 'sonner';

/**
 * Revenue Overview Page
 * Cross-institution billing and contract analytics
 */
export default function RevenueOverviewPage() {
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allInstitutions = await services.institution.getInstitutions();
      // Load contracts for each institution and flatten
      const contractArrays = await Promise.all(
        allInstitutions.map((inst) => services.contract.getContracts(inst.id))
      );
      const allContracts = contractArrays.flat();
      setInstitutions(allInstitutions);
      setContracts(allContracts);
    } catch (error) {
      console.error('Failed to load revenue data:', error);
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate aggregations
  const totalRevenue = useMemo(() => {
    return contracts
      .filter((c) => c.status === 'Active')
      .reduce((sum, c) => sum + c.annualFee, 0);
  }, [contracts]);

  const activeContracts = useMemo(() => {
    return contracts.filter((c) => c.status === 'Active').length;
  }, [contracts]);

  const activeInstitutions = useMemo(() => {
    return institutions.filter((i) => i.status === 'Active').length;
  }, [institutions]);

  const pendingRenewals = useMemo(() => {
    const now = new Date();
    const threeMonthsFromNow = addMonths(now, 3);
    return contracts.filter((c) => {
      if (c.status !== 'Active' || !c.endDate) return false;
      const endDate = parseISO(c.endDate);
      return isAfter(endDate, now) && !isAfter(endDate, threeMonthsFromNow);
    }).length;
  }, [contracts]);

  // Revenue by tier
  const revenueByTier = useMemo(() => {
    const tierRevenue: Record<InstitutionTier, number> = {
      Platinum: 0,
      Gold: 0,
      Silver: 0,
    };

    contracts
      .filter((c) => c.status === 'Active')
      .forEach((c) => {
        tierRevenue[c.tier] += c.annualFee;
      });

    return [
      { tier: 'Platinum', revenue: tierRevenue.Platinum, fill: '#d4af37' },
      { tier: 'Gold', revenue: tierRevenue.Gold, fill: '#f59e0b' },
      { tier: 'Silver', revenue: tierRevenue.Silver, fill: '#94a3b8' },
    ];
  }, [contracts]);

  // Stats cards
  const stats: StatCard[] = [
    {
      label: 'Total Annual Revenue',
      value: `$${(totalRevenue / 1_000_000).toFixed(2)}M`,
      colorClass: 'from-white to-teal-50',
    },
    {
      label: 'Active Contracts',
      value: activeContracts,
      colorClass: 'from-white to-blue-50',
    },
    {
      label: 'Active Institutions',
      value: activeInstitutions,
      colorClass: 'from-white to-purple-50',
    },
    {
      label: 'Pending Renewals',
      value: pendingRenewals,
      subtitle: 'Next 3 months',
      colorClass: 'from-white to-amber-50',
    },
  ];

  // Merge institutions and contracts for table
  const institutionData = useMemo(() => {
    return institutions.map((inst) => {
      const contract = contracts.find(
        (c) => c.institutionId === inst.id && c.status === 'Active'
      );
      return {
        ...inst,
        contract,
      };
    });
  }, [institutions, contracts]);

  // Table columns
  const columns: ColumnDef<(typeof institutionData)[0]>[] = [
    {
      accessorKey: 'name',
      header: 'Institution',
      cell: ({ row }) => (
        <span className="font-sans text-sm text-slate-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'tier',
      header: 'Tier',
      cell: ({ row }) => {
        const tier = row.original.tier;
        const colorMap: Record<string, string> = {
          Platinum: 'bg-amber-50 text-amber-800',
          Gold: 'bg-amber-100 text-amber-700',
          Silver: 'bg-slate-100 text-slate-600',
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-sans ${
              colorMap[tier] || 'bg-slate-100 text-slate-600'
            }`}
          >
            {tier}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} size="sm" />,
    },
    {
      accessorKey: 'contract.annualFee',
      header: 'Annual Fee',
      cell: ({ row }) => {
        const fee = row.original.contract?.annualFee;
        if (!fee) return <span className="text-slate-400 text-sm">—</span>;
        return (
          <span className="font-sans text-sm text-slate-900">
            ${(fee / 1_000_000).toFixed(2)}M
          </span>
        );
      },
    },
    {
      accessorKey: 'contract.perUserFee',
      header: 'Per User Fee',
      cell: ({ row }) => {
        const fee = row.original.contract?.perUserFee;
        if (!fee) return <span className="text-slate-400 text-sm">—</span>;
        return (
          <span className="font-sans text-sm text-slate-900">
            ${fee.toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: 'contractStart',
      header: 'Contract Period',
      cell: ({ row }) => {
        const start = row.original.contractStart;
        const end = row.original.contractEnd;
        return (
          <div className="font-sans text-xs space-y-0.5">
            <div className="text-slate-900">{format(parseISO(start), 'MMM d, yyyy')}</div>
            {end && (
              <div className="text-slate-500">
                to {format(parseISO(end), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Revenue Overview</h1>
        <p className="text-sm font-sans text-slate-600 mt-1">
          Cross-institution billing and contract analytics
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-sans">
          Loading revenue data...
        </div>
      ) : (
        <>
          {/* Stats */}
          <StatsRow stats={stats} />

          {/* Revenue by Tier Chart */}
          <Card>
            <h3 className="text-lg font-sans font-medium text-slate-900 mb-4">
              Annual Revenue by Tier
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByTier}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="tier"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value) => `$${(Number(value) / 1_000_000).toFixed(2)}M`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Institution/Contract Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-sans font-medium text-slate-900">
                Institution Contracts
              </h3>
            </div>
            <DataTable
              columns={columns}
              data={institutionData}
              pageSize={25}
              emptyMessage="No institutions found"
            />
          </div>
        </>
      )}
    </div>
  );
}
