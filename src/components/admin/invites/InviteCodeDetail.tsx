'use client'

import { formatDistanceToNow } from 'date-fns'
import { Copy, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useServices } from '@/lib/hooks/useServices'
import type { InviteCode } from '@/lib/types'
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge'

interface InviteCodeDetailProps {
  inviteCode: InviteCode
  onRevoke?: () => void
}

export function InviteCodeDetail({ inviteCode, onRevoke }: InviteCodeDetailProps) {
  const services = useServices()

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode.code)
      toast.success('Invite code copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const handleRevoke = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to revoke this invite code? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      await services.inviteCode.revokeInviteCode(inviteCode.id)
      toast.success('Invite code revoked')
      onRevoke?.()
    } catch (error) {
      console.error('Failed to revoke invite code:', error)
      toast.error('Failed to revoke invite code')
    }
  }

  const getRolesDisplay = () => {
    if (inviteCode.assignedRoles.b2c) {
      return `B2C: ${inviteCode.assignedRoles.b2c}`
    }
    if (inviteCode.assignedRoles.b2b) {
      return `B2B: ${inviteCode.assignedRoles.b2b}`
    }
    if (inviteCode.assignedRoles.admin) {
      return `Admin: ${inviteCode.assignedRoles.admin}`
    }
    return 'Unknown'
  }

  const usagePercentage = (inviteCode.usedCount / inviteCode.maxUses) * 100

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50 p-6 space-y-6">
      {/* Code display */}
      <div>
        <p className="text-xs font-sans text-gray-600 mb-2 uppercase tracking-wide">
          Invite Code
        </p>
        <div className="flex items-center gap-3">
          <p className="text-xl font-mono text-gray-900 break-all">
            {inviteCode.code}
          </p>
          <button
            onClick={handleCopyCode}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Copy code"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-sans text-gray-600 mb-1">Type</p>
          <p className="text-sm font-sans text-gray-900 capitalize">{inviteCode.type}</p>
        </div>
        <div>
          <p className="text-xs font-sans text-gray-600 mb-1">Status</p>
          <StatusBadge
            status={inviteCode.status}
            colorMap={{
              active: 'bg-green-100 text-green-800',
              used: 'bg-gray-100 text-gray-600',
              expired: 'bg-amber-100 text-amber-800',
              revoked: 'bg-red-100 text-red-800',
            }}
          />
        </div>
        <div>
          <p className="text-xs font-sans text-gray-600 mb-1">Assigned Roles</p>
          <p className="text-sm font-sans text-gray-900">{getRolesDisplay()}</p>
        </div>
        <div>
          <p className="text-xs font-sans text-gray-600 mb-1">Created By</p>
          <p className="text-sm font-sans text-gray-900">{inviteCode.createdBy}</p>
        </div>
        <div>
          <p className="text-xs font-sans text-gray-600 mb-1">Created</p>
          <p className="text-sm font-sans text-gray-900">
            {formatDistanceToNow(new Date(inviteCode.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div>
          <p className="text-xs font-sans text-gray-600 mb-1">Expires</p>
          <p className="text-sm font-sans text-gray-900">
            {inviteCode.expiresAt
              ? formatDistanceToNow(new Date(inviteCode.expiresAt), { addSuffix: true })
              : 'Never'}
          </p>
        </div>
      </div>

      {/* Usage bar */}
      <div>
        <div className="flex justify-between mb-2">
          <p className="text-xs font-sans text-gray-600">Usage</p>
          <p className="text-xs font-sans text-gray-900">
            {inviteCode.usedCount} / {inviteCode.maxUses}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-900 h-2 rounded-full transition-all"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* Institution ID (if applicable) */}
      {inviteCode.institutionId && (
        <div>
          <p className="text-xs font-sans text-gray-600 mb-1">Institution ID</p>
          <p className="text-sm font-mono text-gray-900">{inviteCode.institutionId}</p>
        </div>
      )}

      {/* Actions */}
      {inviteCode.status === 'active' && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleRevoke}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-sans rounded-md hover:bg-red-700 transition-colors"
          >
            <XCircle size={16} />
            Revoke
          </button>
        </div>
      )}
    </div>
  )
}
