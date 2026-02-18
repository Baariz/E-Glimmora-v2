'use client';

/**
 * Institution Detail Page
 * View/edit institution details, actions, audit trail, associated members
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { InstitutionActions } from '@/components/admin/institutions/InstitutionActions';
import { useServices } from '@/lib/hooks/useServices';
import type { Institution, InstitutionType, InstitutionTier, AuditEvent, User } from '@/lib/types';
import { toast } from 'sonner';

export default function InstitutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditEvent[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<Institution>>({});
  const [saving, setSaving] = useState(false);

  const loadInstitutionData = async () => {
    setLoading(true);
    try {
      const institutionId = params.id as string;
      const institutionData = await services.institution.getInstitutionById(institutionId);

      if (!institutionData) {
        toast.error('Institution not found');
        router.push('/institutions');
        return;
      }

      setInstitution(institutionData);
      setEditData({
        name: institutionData.name,
        type: institutionData.type,
        tier: institutionData.tier,
      });

      // Load audit history
      const audit = services.audit.getByResource('institution', institutionId);
      setAuditHistory(
        audit.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      );

      // Load associated members
      const allUsers = await services.user.getUsers();
      const institutionMembers = allUsers.filter((u) => u.institutionId === institutionId);
      setMembers(institutionMembers);
    } catch (error) {
      console.error('Failed to load institution:', error);
      toast.error('Failed to load institution details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutionData();
  }, [params.id]);

  const handleSave = async () => {
    if (!institution) return;

    setSaving(true);
    try {
      await services.institution.updateInstitution(institution.id, editData);

      services.audit.log({
        event: 'institution.update',
        userId: 'admin-super-001',
        resourceId: institution.id,
        resourceType: 'institution',
        context: 'admin',
        action: 'UPDATE',
        previousState: {
          name: institution.name,
          type: institution.type,
          tier: institution.tier,
        },
        newState: editData,
        metadata: {
          changedFields: Object.keys(editData),
        },
      });

      toast.success('Institution updated successfully');
      setEditMode(false);
      loadInstitutionData();
    } catch (error) {
      console.error('Failed to update institution:', error);
      toast.error('Failed to update institution');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!institution) return;
    setEditData({
      name: institution.name,
      type: institution.type,
      tier: institution.tier,
    });
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push('/institutions')}
          className="flex items-center gap-2 text-sm font-sans text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Institutions
        </button>
        <div className="text-center py-12">
          <p className="text-lg font-sans text-gray-600">Institution not found</p>
        </div>
      </div>
    );
  }

  const statusColorMap = {
    Active: 'bg-teal-100 text-teal-800',
    Pending: 'bg-gold-100 text-gold-800',
    Suspended: 'bg-red-100 text-red-800',
  };

  const tierColors = {
    Platinum: 'purple' as const,
    Gold: 'amber' as const,
    Silver: 'slate' as const,
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => router.push('/institutions')}
        className="flex items-center gap-2 text-sm font-sans text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Institutions
      </button>

      {/* Institution details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-4">
            {editMode ? (
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="text-2xl font-serif font-light text-gray-900 border-b border-gray-300 focus:outline-none focus:border-rose-500"
              />
            ) : (
              <h1 className="text-2xl font-serif font-light text-gray-900">{institution.name}</h1>
            )}
            <div className="flex items-center gap-2">
              <StatusBadge status={institution.status} colorMap={statusColorMap} size="md" />
              <StatusBadge status={institution.tier} variant={tierColors[institution.tier]} size="md" />
            </div>
          </div>

          {editMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-900 text-sm font-sans border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <XCircle size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white text-sm font-sans rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <InstitutionActions
              institution={institution}
              onAction={loadInstitutionData}
              onEditToggle={() => setEditMode(true)}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-sans text-gray-600">Type</label>
            {editMode ? (
              <select
                value={editData.type || institution.type}
                onChange={(e) => setEditData({ ...editData, type: e.target.value as InstitutionType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Private Bank">Private Bank</option>
                <option value="Family Office">Family Office</option>
                <option value="Wealth Manager">Wealth Manager</option>
              </select>
            ) : (
              <p className="text-sm font-sans text-gray-900">{institution.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-sans text-gray-600">Tier</label>
            {editMode ? (
              <div className="flex gap-2">
                {(['Platinum', 'Gold', 'Silver'] as InstitutionTier[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setEditData({ ...editData, tier })}
                    className={`px-3 py-2 border rounded-md text-xs font-sans transition-colors ${
                      editData.tier === tier
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm font-sans text-gray-900">{institution.tier}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-sans text-gray-600">Contract Start</label>
            <p className="text-sm font-sans text-gray-900">
              {format(new Date(institution.contractStart), 'MMM d, yyyy')}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-sans text-gray-600">Contract End</label>
            <p className="text-sm font-sans text-gray-900">
              {institution.contractEnd
                ? format(new Date(institution.contractEnd), 'MMM d, yyyy')
                : 'Ongoing'}
            </p>
          </div>
        </div>
      </div>

      {/* Associated members */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-serif font-light text-gray-900 mb-4">
          Associated Members ({members.length})
        </h2>
        {members.length === 0 ? (
          <p className="text-sm font-sans text-gray-600">No members from this institution yet</p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-sans font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs font-sans text-gray-600">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {Object.values(member.roles).filter(Boolean).map((role) => (
                    <StatusBadge key={role} status={role} variant="teal" size="sm" />
                  ))}
                </div>
              </div>
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
