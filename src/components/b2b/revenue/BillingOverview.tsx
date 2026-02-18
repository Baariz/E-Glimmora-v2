'use client';

/**
 * Billing Overview Component (REVN-02)
 * Revenue trends and billing breakdown
 */

import { RevenueRecord } from '@/lib/types';
import { Card } from '@/components/shared/Card';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface BillingOverviewProps {
  revenueRecords: RevenueRecord[];
}

export function BillingOverview({ revenueRecords }: BillingOverviewProps) {
  const totalBilled = revenueRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalPaid = revenueRecords.filter(r => r.paidAt).reduce((sum, r) => sum + r.amount, 0);
  const outstanding = totalBilled - totalPaid;

  const columns: ColumnDef<RevenueRecord>[] = [
    {
      accessorKey: 'period',
      header: 'Period',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-medium">
          ${row.original.amount.toLocaleString()} {row.original.currency}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'paidAt',
      header: 'Payment Status',
      cell: ({ row }) =>
        row.original.paidAt ? (
          <span className="text-teal-600 text-sm">
            Paid {new Date(row.original.paidAt).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-amber-600 text-sm font-medium">Pending</span>
        ),
    },
    {
      accessorKey: 'contractId',
      header: 'Contract',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.contractId.slice(0, 8)}...</span>
      ),
    },
  ];

  // Revenue trend data (aggregate by period)
  const trendData = revenueRecords
    .sort((a, b) => a.period.localeCompare(b.period))
    .reduce((acc, record) => {
      const existing = acc.find(item => item.period === record.period);
      if (existing) {
        existing.amount += record.amount;
      } else {
        acc.push({ period: record.period, amount: record.amount });
      }
      return acc;
    }, [] as { period: string; amount: number }[]);

  // Revenue breakdown by type
  const typeBreakdown = revenueRecords.reduce((acc, record) => {
    const existing = acc.find(item => item.type === record.type);
    if (existing) {
      existing.amount += record.amount;
    } else {
      acc.push({ type: record.type, amount: record.amount });
    }
    return acc;
  }, [] as { type: string; amount: number }[]);

  const COLORS = ['#0891b2', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-white to-blue-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Total Billed</p>
            <p className="text-3xl font-serif text-slate-900">
              ${totalBilled.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-teal-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Total Paid</p>
            <p className="text-3xl font-serif text-slate-900">
              ${totalPaid.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-white to-amber-50">
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">Outstanding</p>
            <p className="text-3xl font-serif text-slate-900">
              ${outstanding.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Revenue trend chart */}
      <Card>
        <h3 className="text-lg font-serif text-slate-900 mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#0891b2"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue breakdown pie chart */}
        <Card>
          <h3 className="text-lg font-serif text-slate-900 mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) =>
                  `${entry.type}: ${(entry.percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {typeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue records table */}
        <Card>
          <h3 className="text-lg font-serif text-slate-900 mb-4">Recent Transactions</h3>
          <div className="overflow-auto max-h-[300px]">
            <DataTable
              columns={columns}
              data={revenueRecords.slice(0, 5)}
              emptyMessage="No revenue records found"
              pageSize={5}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
