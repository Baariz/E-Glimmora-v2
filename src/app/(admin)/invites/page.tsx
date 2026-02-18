'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Copy, Plus } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/b2b/tables/DataTable'
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow'
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge'
import { GenerateInviteModal } from '@/components/admin/invites/GenerateInviteModal'
import { InviteCodeDetail } from '@/components/admin/invites/InviteCodeDetail'
import { useServices } from '@/lib/hooks/useServices'
import type { InviteCode } from '@/lib/types'
import { toast } from 'sonner'

/**
 * Admin Invite Management Page
 * Full CRUD for invite codes with DataTable, stats, and generate modal
 */
export default function InvitesPage() {
  const services = useServices()
  const [loading, setLoading] = useState(true)
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [selectedCode, setSelectedCode] = useState<InviteCode | null>(null)
  const [generateModalOpen, setGenerateModalOpen] = useState(false)

  const loadInviteCodes = async () => {
    setLoading(true)
    try {
      const codes = await services.inviteCode.getInviteCodes()
      setInviteCodes(codes)
    } catch (error) {
      console.error('Failed to load invite codes:', error)
      toast.error('Failed to load invite codes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInviteCodes()
  }, [])

  const handleCopyCode = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Code copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const handleRowClick = (row: InviteCode) => {
    setSelectedCode(selectedCode?.id === row.id ? null : row)
  }

  const handleGenerateSuccess = () => {
    loadInviteCodes()
  }

  const handleRevoke = () => {
    loadInviteCodes()
    setSelectedCode(null)
  }

  // Calculate stats
  const stats: StatCard[] = [
    {
      label: 'Total Codes',
      value: inviteCodes.length,
      colorClass: 'from-white to-slate-50',
    },
    {
      label: 'Active',
      value: inviteCodes.filter((c) => c.status === 'active').length,
      colorClass: 'from-white to-green-50',
    },
    {
      label: 'Used',
      value: inviteCodes.filter((c) => c.status === 'used').length,
      colorClass: 'from-white to-gray-50',
    },
    {
      label: 'Expired',
      value: inviteCodes.filter((c) => c.status === 'expired').length,
      colorClass: 'from-white to-amber-50',
    },
    {
      label: 'Revoked',
      value: inviteCodes.filter((c) => c.status === 'revoked').length,
      colorClass: 'from-white to-red-50',
    },
  ]

  // Table columns
  const columns: ColumnDef<InviteCode>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-900 max-w-[200px] truncate">
            {row.original.code}
          </span>
          <button
            onClick={(e) => handleCopyCode(row.original.code, e)}
            className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Copy code"
          >
            <Copy size={14} />
          </button>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const colorMap = {
          b2c: 'variant' as const,
          b2b: 'variant' as const,
          admin: 'variant' as const,
        }
        const variantMap = {
          b2c: 'red' as const,
          b2b: 'teal' as const,
          admin: 'slate' as const,
        }
        return (
          <StatusBadge
            status={row.original.type.toUpperCase()}
            variant={variantMap[row.original.type as keyof typeof variantMap]}
          />
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          colorMap={{
            active: 'bg-green-100 text-green-800',
            used: 'bg-gray-100 text-gray-600',
            expired: 'bg-amber-100 text-amber-800',
            revoked: 'bg-red-100 text-red-800',
          }}
        />
      ),
    },
    {
      accessorKey: 'usedCount',
      header: 'Uses',
      cell: ({ row }) => (
        <span className="text-sm font-sans text-gray-900">
          {row.original.usedCount} / {row.original.maxUses}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm font-sans text-gray-600">
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expires',
      cell: ({ row }) => (
        <span className="text-sm font-sans text-gray-600">
          {row.original.expiresAt
            ? formatDistanceToNow(new Date(row.original.expiresAt), { addSuffix: true })
            : 'Never'}
        </span>
      ),
    },
  ]

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
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-light text-gray-900">Invite Codes</h1>
          <p className="text-base font-sans text-gray-600">
            Manage platform access via invite-only registration
          </p>
        </div>
        <button
          onClick={() => setGenerateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-sans rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Generate Invite
        </button>
      </div>

      {/* Stats row */}
      <StatsRow stats={stats} />

      {/* DataTable */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <DataTable
          columns={columns}
          data={inviteCodes}
          searchColumn="code"
          searchPlaceholder="Search by code..."
          onRowClick={handleRowClick}
          emptyMessage="No invite codes found"
        />
      </div>

      {/* Expandable detail panel */}
      {selectedCode && (
        <div className="animate-fade-in">
          <InviteCodeDetail inviteCode={selectedCode} onRevoke={handleRevoke} />
        </div>
      )}

      {/* Generate modal */}
      <GenerateInviteModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
        onSuccess={handleGenerateSuccess}
      />
    </div>
  )
}
