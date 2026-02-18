'use client';

/**
 * Member Detail Page
 * Profile info, role assignments, audit history timeline
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Calendar, Shield } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { MemberActions } from '@/components/admin/members/MemberActions';
import { useServices } from '@/lib/hooks/useServices';
import type { User, AuditEvent } from '@/lib/types';
import { toast } from 'sonner';

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditEvent[]>([]);

  const loadMemberData = async () => {
    setLoading(true);
    try {
      const userId = params.id as string;
      const userData = await services.user.getUserById(userId);

      if (!userData) {
        toast.error('Member not found');
        router.push('/members');
        return;
      }

      setUser(userData);

      // Load audit history for this user
      const audit = services.audit.getByUser(userId);
      setAuditHistory(audit.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Failed to load member:', error);
      toast.error('Failed to load member details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push('/members')}
          className="flex items-center gap-2 text-sm font-sans text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Members
        </button>
        <div className="text-center py-12">
          <p className="text-lg font-sans text-gray-600">Member not found</p>
        </div>
      </div>
    );
  }

  // Determine user status
  const roleValues = Object.values(user.roles).filter(Boolean);
  const isPending = roleValues.length === 0;
  const isSuspended = user.erasedAt?.startsWith('SUSPENDED:');
  const isRemoved = user.erasedAt?.startsWith('REMOVED:');
  const isActive = !user.erasedAt && roleValues.length > 0;

  const getStatus = (): string => {
    if (isRemoved) return 'Removed';
    if (isSuspended) return 'Suspended';
    if (isPending) return 'Pending';
    return 'Active';
  };

  const statusColorMap = {
    Active: 'bg-teal-100 text-teal-800',
    Pending: 'bg-gold-100 text-gold-800',
    Suspended: 'bg-amber-100 text-amber-800',
    Removed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => router.push('/members')}
        className="flex items-center gap-2 text-sm font-sans text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Members
      </button>

      {/* Profile section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-serif font-light text-gray-900">{user.name}</h1>
              <StatusBadge status={getStatus()} colorMap={statusColorMap} size="md" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-sans text-gray-600">
                <Mail size={16} />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm font-sans text-gray-600">
                <Calendar size={16} />
                Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </div>
              {user.institutionId && (
                <div className="flex items-center gap-2 text-sm font-sans text-gray-600">
                  <Shield size={16} />
                  Institution: {user.institutionId}
                </div>
              )}
            </div>
          </div>

          <MemberActions user={user} onAction={loadMemberData} />
        </div>
      </div>

      {/* Role assignments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-serif font-light text-gray-900 mb-4">Role Assignments</h2>
        {roleValues.length === 0 ? (
          <p className="text-sm font-sans text-gray-600">No roles assigned (pending approval)</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {roleValues.map((role) => (
              <StatusBadge key={role} status={role} variant="teal" size="md" />
            ))}
          </div>
        )}
      </div>

      {/* Audit history */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-serif font-light text-gray-900 mb-4">Audit History</h2>

        {auditHistory.length === 0 ? (
          <p className="text-sm font-sans text-gray-600">No audit events yet</p>
        ) : (
          <div className="space-y-4">
            {auditHistory.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-rose-500" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-sans font-medium text-gray-900">
                      {event.event}
                    </span>
                    <span className="text-xs font-sans text-gray-500">
                      {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm font-sans text-gray-600">
                    Action: <span className="font-medium">{event.action}</span>
                  </p>
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded">
                      {JSON.stringify(event.metadata, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
