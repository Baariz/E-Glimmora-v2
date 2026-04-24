'use client'

/**
 * Resend invite modal — POST /api/invites/{id}/resend
 * (FRONTEND_EMAIL_INTEGRATION §4.1).
 * The invite_codes table doesn't store the recipient email, so the admin
 * must supply it again on every resend.
 */

import { useEffect, useState } from 'react'
import { Modal } from '@/components/shared/Modal/Modal'
import { useServices } from '@/lib/hooks/useServices'
import { toast } from 'sonner'
import type { InviteCode } from '@/lib/types'
import { Send } from 'lucide-react'

interface ResendInviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invite: InviteCode | null
  onResent?: () => void
}

export function ResendInviteModal({
  open,
  onOpenChange,
  invite,
  onResent,
}: ResendInviteModalProps) {
  const services = useServices()
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset fields when the modal closes or the invite changes.
  useEffect(() => {
    if (!open) {
      setRecipientEmail('')
      setRecipientName('')
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invite) return
    const trimmedEmail = recipientEmail.trim()
    if (!trimmedEmail) {
      toast.error('Recipient email is required.')
      return
    }
    setLoading(true)
    try {
      const result = await services.inviteCode.resendInvite(invite.id, {
        recipientEmail: trimmedEmail,
        recipientName: recipientName.trim() || undefined,
      })
      if (result.resent) {
        toast.success(`Invitation re-sent to ${trimmedEmail}.`)
        onResent?.()
        onOpenChange(false)
      } else {
        toast.error('The backend did not confirm the resend. Please try again.')
      }
    } catch (err: any) {
      // 422 — invite is revoked / used / expired (error.message explains which).
      const msg =
        typeof err?.message === 'string' && err.message.length < 220
          ? err.message
          : 'Could not resend the invitation. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Resend Invitation"
      description="Re-send the invitation email without generating a new code."
    >
      {invite && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-md bg-gray-50 border border-gray-200 px-4 py-3">
            <p className="text-xs font-sans text-gray-600 uppercase tracking-wide mb-1">
              Invite Code
            </p>
            <p className="font-mono text-sm text-gray-900 break-all">
              {invite.code}
            </p>
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
              Recipient Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="robert@privatebank.com"
              required
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
              Recipient Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Robert Chambers"
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <p className="text-xs font-sans text-gray-500">
            They will receive the same code as before. Email delivery is
            best-effort — share the code manually if needed.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-sans rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !recipientEmail.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-sans rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              {loading ? 'Sending…' : 'Resend Invitation'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
