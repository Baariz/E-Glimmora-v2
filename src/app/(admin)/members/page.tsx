'use client';

/**
 * Member Management Page
 * Super Admin can view all UHNI members, approve/suspend/remove with audit trail
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { MemberActions } from '@/components/admin/members/MemberActions';
import { AdvisorDirectory } from '@/components/admin/advisors/AdvisorDirectory';
import { useServices } from '@/lib/hooks/useServices';
import type { User } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

/**
 * Member Management Page
 * List view with stats, search, actions
 */
export default function MembersPage() {
  const services = useServices();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'advisors'>('members');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await services.user.getUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Calculate stats
  const getRoleValues = (u: User) => Object.values(u.roles).filter(Boolean);
  const isPending = (u: User) => getRoleValues(u).length === 0;
  const isSuspended = (u: User) => u.erasedAt?.startsWith('SUSPENDED:');
  const isRemoved = (u: User) => u.erasedAt?.startsWith('REMOVED:');
  const isActive = (u: User) => !u.erasedAt && getRoleValues(u).length > 0;

  const stats: StatCard[] = [
    {
      label: 'Total Members',
      value: users.length,
      colorClass: 'from-white to-slate-50',
    },
    {
      label: 'Active',
      value: users.filter(isActive).length,
      colorClass: 'from-white to-green-50',
    },
    {
      label: 'Pending Approval',
      value: users.filter(isPending).length,
      colorClass: 'from-white to-gold-50',
    },
    {
      label: 'Suspended',
      value: users.filter(isSuspended).length,
      colorClass: 'from-white to-amber-50',
    },
    {
      label: 'Removed',
      value: users.filter(isRemoved).length,
      colorClass: 'from-white to-red-50',
    },
  ];

  // Helper to get status
  const getStatus = (u: User): string => {
    if (isRemoved(u)) return 'Removed';
    if (isSuspended(u)) return 'Suspended';
    if (isPending(u)) return 'Pending';
    return 'Active';
  };

  // Table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/members/${row.original.id}`)}
          className="text-rose-600 hover:text-rose-700 font-sans text-sm font-medium underline"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-sm font-sans text-slate-900">{row.original.email}</span>
      ),
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {Object.values(row.original.roles).filter(Boolean).length === 0 ? (
            <StatusBadge status="None" variant="slate" />
          ) : (
            Object.values(row.original.roles).filter(Boolean).map((role) => (
              <StatusBadge key={role} status={role} variant="teal" size="sm" />
            ))
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = getStatus(row.original);
        const colorMap = {
          Active: 'bg-teal-100 text-teal-800',
          Pending: 'bg-gold-100 text-gold-800',
          Suspended: 'bg-amber-100 text-amber-800',
          Removed: 'bg-red-100 text-red-800',
        };
        return <StatusBadge status={status} colorMap={colorMap} />;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-sm font-sans text-slate-600">
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <MemberActions user={row.original} onAction={loadUsers} />,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-light text-gray-900">Member Management</h1>
        <p className="text-base font-sans text-gray-600">
          Approve, suspend, or remove UHNI members with full audit trail
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {(['members', 'advisors'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 font-sans text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab
                ? 'border-rose-600 text-rose-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab === 'members' ? 'Members' : 'Advisors'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'members' ? (
        <>
          {/* Stats row */}
          <StatsRow stats={stats} />

          {/* DataTable */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <DataTable
              columns={columns}
              data={users}
              searchColumn="name"
              searchPlaceholder="Search by name..."
              emptyMessage="No members found"
            />
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <AdvisorDirectory highlightMatchFor="Client" />
        </div>
      )}
    </div>
  );
}
