'use client'

import { useState } from 'react'
import { Modal } from '@/components/shared/Modal/Modal'
import { useServices } from '@/lib/hooks/useServices'
import { B2BRole } from '@/lib/types'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

interface GenerateInviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

type InviteType = 'b2c' | 'b2b' | 'admin'

export function GenerateInviteModal({ open, onOpenChange, onSuccess }: GenerateInviteModalProps) {
  const services = useServices()
  const [loading, setLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)

  // Form state
  const [inviteType, setInviteType] = useState<InviteType>('b2c')
  const [b2bRole, setB2bRole] = useState<B2BRole>(B2BRole.RelationshipManager)
  const [maxUses, setMaxUses] = useState(1)
  const [expiresIn, setExpiresIn] = useState<string>('30')
  const [institutionId, setInstitutionId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Calculate expiry date
      let expiresAt: string | undefined
      if (expiresIn !== 'never') {
        const days = parseInt(expiresIn)
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + days)
        expiresAt = expiryDate.toISOString()
      }

      // Determine assigned roles based on type
      let assignedRoles: any
      if (inviteType === 'b2c') {
        assignedRoles = { b2c: 'UHNI' }
      } else if (inviteType === 'b2b') {
        assignedRoles = { b2b: b2bRole }
      } else {
        assignedRoles = { admin: 'SuperAdmin' }
      }

      const inviteCode = await services.inviteCode.createInviteCode({
        type: inviteType,
        createdBy: 'super-admin',
        assignedRoles,
        maxUses,
        expiresAt,
        institutionId: inviteType === 'b2b' && institutionId ? institutionId : undefined,
      })

      setGeneratedCode(inviteCode.code)
      toast.success('Invite code generated successfully')
    } catch (error) {
      console.error('Failed to generate invite code:', error)
      toast.error('Failed to generate invite code')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = async () => {
    if (generatedCode) {
      try {
        await navigator.clipboard.writeText(generatedCode)
        toast.success('Invite code copied to clipboard')
      } catch (error) {
        toast.error('Failed to copy code')
      }
    }
  }

  const handleClose = () => {
    setGeneratedCode(null)
    setInviteType('b2c')
    setB2bRole(B2BRole.RelationshipManager)
    setMaxUses(1)
    setExpiresIn('30')
    setInstitutionId('')
    onOpenChange(false)
    if (generatedCode && onSuccess) {
      onSuccess()
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={generatedCode ? 'Invite Code Generated' : 'Generate Invite Code'}
      description={
        generatedCode
          ? 'Share this code with the invitee to create their account'
          : 'Create a new invite code for platform access'
      }
    >
      {generatedCode ? (
        // Success view
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-xs font-sans text-gray-600 mb-2 uppercase tracking-wide">
              Invite Code
            </p>
            <p className="text-2xl font-mono text-gray-900 mb-4 break-all">
              {generatedCode}
            </p>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-sans rounded-md hover:bg-gray-800 transition-colors"
            >
              <Copy size={16} />
              Copy to Clipboard
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-sans rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        // Form view
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Invite Type */}
          <div>
            <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
              Invite Type
            </label>
            <select
              value={inviteType}
              onChange={(e) => setInviteType(e.target.value as InviteType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="b2c">B2C (UHNI)</option>
              <option value="b2b">B2B (select role below)</option>
              <option value="admin">Admin (SuperAdmin)</option>
            </select>
          </div>

          {/* B2B Role (shown only when B2B selected) */}
          {inviteType === 'b2b' && (
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                B2B Role
              </label>
              <select
                value={b2bRole}
                onChange={(e) => setB2bRole(e.target.value as B2BRole)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value={B2BRole.RelationshipManager}>Relationship Manager (RM)</option>
                <option value={B2BRole.PrivateBanker}>Private Banker</option>
                <option value={B2BRole.FamilyOfficeDirector}>Family Office Director</option>
                <option value={B2BRole.ComplianceOfficer}>Compliance Officer</option>
                <option value={B2BRole.InstitutionalAdmin}>Institutional Admin</option>
                <option value={B2BRole.UHNIPortal}>UHNI Portal</option>
              </select>
            </div>
          )}

          {/* Institution ID (shown only when B2B selected) */}
          {inviteType === 'b2b' && (
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Institution ID (optional)
              </label>
              <input
                type="text"
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                placeholder="Leave blank for cross-institution"
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Max Uses */}
          <div>
            <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
              Max Uses
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={maxUses}
              onChange={(e) => setMaxUses(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Expires In */}
          <div>
            <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
              Expires In
            </label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="never">Never</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-sans rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-sans rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Invite'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
