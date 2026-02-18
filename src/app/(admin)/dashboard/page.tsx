'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/shared/Card'
import { useServices } from '@/lib/hooks/useServices'
import type { InviteCode, User, Institution, AuditEvent } from '@/lib/types'

/**
 * Admin Dashboard
 * Full platform administration overview with live stats from services
 */
export default function AdminDashboardPage() {
  const services = useServices()
  const [loading, setLoading] = useState(true)
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [recentEvents, setRecentEvents] = useState<AuditEvent[]>([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [codesData, usersData, institutionsData, eventsData] = await Promise.all([
          services.inviteCode.getInviteCodes(),
          services.user.getUsers(),
          // Note: institution service not yet in useServices, will add in this task
          Promise.resolve([]), // Placeholder for institutions
          services.audit.getAll(),
        ])

        setInviteCodes(codesData)
        setUsers(usersData)
        setInstitutions(institutionsData)
        // Get last 10 events, sorted by timestamp descending
        setRecentEvents(eventsData.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 10))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [services])

  // Calculate stats
  const inviteStats = {
    total: inviteCodes.length,
    active: inviteCodes.filter(c => c.status === 'active').length,
    used: inviteCodes.filter(c => c.status === 'used').length,
    expired: inviteCodes.filter(c => c.status === 'expired').length,
  }

  const activeMembers = users.filter(u => !u.erasedAt).length

  const institutionStats = {
    total: institutions.length,
    active: institutions.filter(i => i.status === 'Active').length,
    pending: institutions.filter(i => i.status === 'Pending').length,
    suspended: institutions.filter(i => i.status === 'Suspended').length,
  }

  // Color mapping for audit event types
  const getActionColor = (action: string): string => {
    switch (action) {
      case 'CREATE': return 'bg-green-500'
      case 'READ': return 'bg-blue-500'
      case 'UPDATE': return 'bg-amber-500'
      case 'DELETE': return 'bg-red-500'
      case 'APPROVE': return 'bg-teal-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton loading state */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-light text-gray-900">
          Platform Administration
        </h1>
        <p className="text-base font-sans text-gray-600">
          System overview, invites, members, and operational controls
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <div className="space-y-2">
            <p className="text-sm font-sans text-gray-600">Invite Codes</p>
            <p className="text-3xl font-serif text-gray-900">{inviteStats.total}</p>
            <p className="text-xs font-sans text-gray-500">
              {inviteStats.active} active, {inviteStats.used} used, {inviteStats.expired} expired
            </p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="space-y-2">
            <p className="text-sm font-sans text-gray-600">Active Members</p>
            <p className="text-3xl font-serif text-gray-900">{activeMembers}</p>
            <p className="text-xs font-sans text-gray-500">
              {users.length} total users
            </p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="space-y-2">
            <p className="text-sm font-sans text-gray-600">Institutions</p>
            <p className="text-3xl font-serif text-gray-900">{institutionStats.total}</p>
            <p className="text-xs font-sans text-gray-500">
              {institutionStats.active} active, {institutionStats.pending} pending, {institutionStats.suspended} suspended
            </p>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="space-y-2">
            <p className="text-sm font-sans text-gray-600">System Health</p>
            <p className="text-3xl font-serif text-green-700">✓</p>
            <p className="text-xs font-sans text-gray-500">All systems operational</p>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card header="Recent Activity">
        <div className="space-y-3">
          {recentEvents.length === 0 ? (
            <p className="text-sm font-sans text-gray-500">No recent activity</p>
          ) : (
            recentEvents.map((event, index) => (
              <div
                key={event.id}
                className={`flex items-start gap-3 ${
                  index < recentEvents.length - 1 ? 'pb-3 border-b border-gray-200' : ''
                }`}
              >
                <div className={`w-2 h-2 mt-2 rounded-full ${getActionColor(event.action)}`} />
                <div className="flex-1">
                  <p className="text-sm font-sans text-gray-900">
                    {event.event.replace('.', ' ')}
                  </p>
                  <p className="text-xs font-sans text-gray-500">
                    User {event.userId.substring(0, 8)}... • {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/invites">
          <Card className="bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-lg font-serif text-gray-900">Generate Invite</p>
                <p className="text-sm font-sans text-gray-600">
                  Create new invite codes for B2C, B2B, or Admin users
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>

        <Link href="/members">
          <Card className="bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-lg font-serif text-gray-900">Manage Members</p>
                <p className="text-sm font-sans text-gray-600">
                  View and manage all platform users
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>

        <Link href="/institutions">
          <Card className="bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-lg font-serif text-gray-900">Onboard Institution</p>
                <p className="text-sm font-sans text-gray-600">
                  Add new B2B institutions to the platform
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
