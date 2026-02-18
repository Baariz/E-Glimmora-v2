'use client';

/**
 * Advisor Assignment Component
 * Manage advisor assignments for a client
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { useServices } from '@/lib/hooks/useServices';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { Select } from '@/components/shared/Select';
import { UserPlus, UserMinus, Users } from 'lucide-react';

interface AdvisorAssignmentProps {
  clientId: string;
  assignedAdvisors: string[];
  onUpdate: () => void;
}

// Mock advisor list - in production this would come from services.user
const MOCK_ADVISORS = [
  { id: 'advisor-001', name: 'Dr. Eleanor Chen', role: 'Senior Wealth Advisor' },
  { id: 'advisor-002', name: 'Marcus Whitfield', role: 'Investment Strategist' },
  { id: 'advisor-003', name: 'Sophia Rodriguez', role: 'Estate Planning Specialist' },
  { id: 'advisor-004', name: 'James Hamilton', role: 'Tax Advisor' },
  { id: 'advisor-005', name: 'Priya Patel', role: 'Philanthropy Consultant' },
];

export function AdvisorAssignment({
  clientId,
  assignedAdvisors,
  onUpdate,
}: AdvisorAssignmentProps) {
  const services = useServices();
  const { can } = useCan();
  const canAssign = can(Permission.ASSIGN, 'client');

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState('');
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedAdvisorId) return;

    setLoading(true);
    try {
      await services.client.assignAdvisor(clientId, selectedAdvisorId);
      toast.success('Advisor assigned successfully');
      setAssignModalOpen(false);
      setSelectedAdvisorId('');
      onUpdate();
    } catch (error) {
      console.error('Failed to assign advisor:', error);
      toast.error('Failed to assign advisor');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (advisorId: string) => {
    setLoading(true);
    try {
      await services.client.removeAdvisor(clientId, advisorId);
      toast.success('Advisor removed successfully');
      setConfirmRemoveId(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to remove advisor:', error);
      toast.error('Failed to remove advisor');
    } finally {
      setLoading(false);
    }
  };

  const assignedAdvisorsList = MOCK_ADVISORS.filter((advisor) =>
    assignedAdvisors.includes(advisor.id)
  );

  const availableAdvisors = MOCK_ADVISORS.filter(
    (advisor) => !assignedAdvisors.includes(advisor.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-slate-900">Assigned Advisors</h3>
        {canAssign && availableAdvisors.length > 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAssignModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Assign Advisor
          </Button>
        )}
      </div>

      {assignedAdvisorsList.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="font-sans text-slate-600 mb-4">No advisors assigned yet</p>
          {canAssign && (
            <Button variant="outline" onClick={() => setAssignModalOpen(true)}>
              Assign First Advisor
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {assignedAdvisorsList.map((advisor) => (
            <Card key={advisor.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans font-semibold text-slate-900">{advisor.name}</p>
                  <p className="font-sans text-sm text-slate-600">{advisor.role}</p>
                  <p className="font-sans text-xs text-slate-500 mt-1">
                    Assigned: {new Date().toLocaleDateString()}
                  </p>
                </div>
                {canAssign && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmRemoveId(advisor.id)}
                    className="flex items-center gap-2 text-rose-600 hover:text-rose-700"
                  >
                    <UserMinus className="w-4 h-4" />
                    Remove
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Assign Advisor Modal */}
      <Modal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        title="Assign Advisor"
        description="Select an advisor to assign to this client"
      >
        <div className="space-y-4">
          <Select
            value={selectedAdvisorId}
            onValueChange={setSelectedAdvisorId}
            options={availableAdvisors.map((advisor) => ({
              value: advisor.id,
              label: `${advisor.name} - ${advisor.role}`,
            }))}
            placeholder="Select an advisor..."
          />

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              disabled={!selectedAdvisorId || loading}
            >
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        open={confirmRemoveId !== null}
        onOpenChange={(open) => !open && setConfirmRemoveId(null)}
        title="Remove Advisor"
        description="Are you sure you want to remove this advisor from the client?"
      >
        <div className="space-y-4">
          <p className="font-sans text-sm text-slate-600">
            This will remove their access to this client&apos;s information and journeys.
          </p>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setConfirmRemoveId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmRemoveId && handleRemove(confirmRemoveId)}
              disabled={loading}
            >
              {loading ? 'Removing...' : 'Remove Advisor'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
