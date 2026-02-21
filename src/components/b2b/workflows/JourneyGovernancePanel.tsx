'use client';

/**
 * Journey Governance Panel
 * State machine-driven approval/rejection panel with permission gates
 */

import { useState } from 'react';
import { Journey, JourneyStatus } from '@/lib/types/entities';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { useServices } from '@/lib/hooks/useServices';
import {
  getAvailableTransitions,
  executeTransition,
  getTransitionLabel,
  getStateLabel,
  getStateColor,
} from '@/lib/state-machines/journey-workflow';
import { Card, CardHeader, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { toast } from 'sonner';

interface JourneyGovernancePanelProps {
  journey: Journey;
  onStateChange: () => void;
}

const MOCK_RM_USER_ID = 'b2b-rm-001-uuid-placeholder';

export function JourneyGovernancePanel({ journey, onStateChange }: JourneyGovernancePanelProps) {
  const { currentRole, context } = useAuth();
  const { can } = useCan();
  const services = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!currentRole) {
    return null;
  }

  const availableTransitions = getAvailableTransitions(journey.status, currentRole, context);

  const handleTransition = async (event: string) => {
    // If it's a rejection/request changes, show modal for reason
    if (event === 'REJECT' || event === 'REQUEST_CHANGES') {
      setSelectedTransition(event);
      setIsModalOpen(true);
      return;
    }

    await executeTransitionAction(event);
  };

  const executeTransitionAction = async (event: string, reason?: string) => {
    if (!currentRole) return;

    try {
      setProcessing(true);

      // Execute state transition
      const nextState = executeTransition(journey.status, event, currentRole, context);

      // Create new version with new state
      await services.journey.createJourneyVersion(journey.id, {
        title: journey.title,
        narrative: journey.narrative,
        status: nextState,
        modifiedBy: MOCK_RM_USER_ID,
        rejectionReason: reason,
        ...(event === 'APPROVE' && { approvedBy: MOCK_RM_USER_ID }),
        ...(event === 'REJECT' && { rejectedBy: MOCK_RM_USER_ID }),
      });

      // Update journey status
      await services.journey.updateJourney(journey.id, {
        status: nextState,
      });

      // Log audit event
      await services.audit.log({
        event: `journey_${event.toLowerCase()}`,
        userId: MOCK_RM_USER_ID,
        resourceId: journey.id,
        resourceType: 'journey',
        context: 'b2b',
        action: 'UPDATE',
        metadata: {
          fromState: journey.status,
          toState: nextState,
          transition: event,
          ...(reason && { reason }),
        },
      });

      toast.success(`Journey ${getTransitionLabel(event).toLowerCase()} successfully`);
      onStateChange();
    } catch (error) {
      console.error('Failed to execute transition:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to execute transition');
    } finally {
      setProcessing(false);
      setIsModalOpen(false);
      setRejectionReason('');
      setSelectedTransition(null);
    }
  };

  const handleModalConfirm = async () => {
    if (!selectedTransition) return;
    if ((selectedTransition === 'REJECT' || selectedTransition === 'REQUEST_CHANGES') && !rejectionReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    await executeTransitionAction(selectedTransition, rejectionReason);
  };

  const stateColor = getStateColor(journey.status);

  return (
    <>
      <Card>
        <CardHeader>
          <h3 className="font-sans text-sm font-semibold text-slate-800">Governance Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Current State Badge */}
            <div className="pb-3 border-b border-slate-200">
              <p className="font-sans text-xs text-slate-500 mb-2">Current Status</p>
              <span
                className={`inline-block px-3 py-1.5 rounded-md bg-${stateColor}-100 text-${stateColor}-800 font-sans text-sm font-medium`}
              >
                {getStateLabel(journey.status)}
              </span>
            </div>

            {/* Vertical State Flow */}
            <StateFlowIndicator currentStatus={journey.status} />

            {/* Available Actions */}
            {availableTransitions.length > 0 ? (
              <div className="pt-1 space-y-2">
                <p className="font-sans text-xs text-slate-500 mb-1">Available Actions</p>
                {availableTransitions.map((event) => {
                  const label = getTransitionLabel(event);
                  const isDestructive = event === 'REJECT' || event === 'REQUEST_CHANGES';

                  return (
                    <button
                      key={event}
                      onClick={() => handleTransition(event)}
                      disabled={processing}
                      className={`w-full px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors disabled:opacity-50 ${
                        isDestructive
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-rose-900 text-white hover:bg-rose-800'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="font-sans text-xs text-slate-400 text-center py-3">
                {can(Permission.APPROVE, 'journey')
                  ? 'No actions available at current state'
                  : 'You do not have permission to modify this journey'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rejection/Request Changes Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedTransition === 'REJECT' ? 'Reject Journey' : 'Request Changes'}
        description="Please provide a reason for this action"
      >
        <div className="space-y-4">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            placeholder="Enter reason..."
            className="w-full px-4 py-3 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
          />
          <div className="flex items-center gap-3">
            <Button variant="primary" size="md" onClick={handleModalConfirm} disabled={processing}>
              {processing ? 'Processing...' : 'Confirm'}
            </Button>
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)} disabled={processing}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// State Flow Visualization — vertical stepper for sidebar
function StateFlowIndicator({ currentStatus }: { currentStatus: JourneyStatus }) {
  const allStates = [
    { key: JourneyStatus.DRAFT, label: 'Draft' },
    { key: JourneyStatus.RM_REVIEW, label: 'RM Review' },
    { key: JourneyStatus.COMPLIANCE_REVIEW, label: 'Compliance' },
    { key: JourneyStatus.APPROVED, label: 'Approved' },
    { key: JourneyStatus.PRESENTED, label: 'Presented' },
    { key: JourneyStatus.EXECUTED, label: 'Executed' },
  ];

  const currentIndex = allStates.findIndex(s => s.key === currentStatus);

  return (
    <div className="py-3 border-b border-slate-200">
      <p className="font-sans text-xs text-slate-500 mb-3">Workflow Progress</p>
      <div className="space-y-0">
        {allStates.map((state, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={state.key} className="flex items-start gap-3">
              {/* Dot + vertical line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${
                    isCurrent
                      ? 'bg-rose-600 ring-2 ring-rose-200'
                      : isPast
                        ? 'bg-teal-500'
                        : 'bg-slate-300'
                  }`}
                />
                {index < allStates.length - 1 && (
                  <div
                    className={`w-px h-5 ${isPast ? 'bg-teal-400' : 'bg-slate-200'}`}
                  />
                )}
              </div>
              {/* Label */}
              <p
                className={`font-sans text-xs leading-tight ${
                  isCurrent
                    ? 'text-rose-900 font-semibold'
                    : isPast
                      ? 'text-teal-700'
                      : 'text-slate-400'
                }`}
              >
                {state.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
