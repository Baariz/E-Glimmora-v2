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
          <h3 className="font-sans text-sm font-semibold text-slate-700">Governance Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current State Indicator */}
            <div className="text-center py-4 border-b border-slate-200">
              <p className="font-sans text-xs text-slate-600 mb-2">Current Status</p>
              <span
                className={`inline-block px-4 py-2 rounded-full bg-${stateColor}-100 text-${stateColor}-800 font-sans text-sm font-medium`}
              >
                {getStateLabel(journey.status)}
              </span>
            </div>

            {/* State Flow Visualization */}
            <StateFlowIndicator currentStatus={journey.status} />

            {/* Available Actions */}
            {availableTransitions.length > 0 ? (
              <div className="space-y-2">
                <p className="font-sans text-xs font-semibold text-slate-700 mb-2">Available Actions:</p>
                {availableTransitions.map((event) => {
                  const label = getTransitionLabel(event);
                  const isDestructive = event === 'REJECT' || event === 'REQUEST_CHANGES';

                  return (
                    <Button
                      key={event}
                      variant={isDestructive ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handleTransition(event)}
                      disabled={processing}
                      className="w-full"
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <p className="font-sans text-xs text-slate-500 text-center py-4">
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

// State Flow Visualization Component
function StateFlowIndicator({ currentStatus }: { currentStatus: JourneyStatus }) {
  const allStates = [
    JourneyStatus.DRAFT,
    JourneyStatus.RM_REVIEW,
    JourneyStatus.COMPLIANCE_REVIEW,
    JourneyStatus.APPROVED,
    JourneyStatus.PRESENTED,
    JourneyStatus.EXECUTED,
  ];

  const currentIndex = allStates.indexOf(currentStatus);

  return (
    <div className="py-4">
      <p className="font-sans text-xs text-slate-600 mb-3 text-center">Workflow Progress</p>
      <div className="flex items-center justify-between">
        {allStates.map((state, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const color = getStateColor(state);

          return (
            <div key={state} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCurrent
                      ? `bg-${color}-500`
                      : isPast
                        ? 'bg-teal-500'
                        : 'bg-slate-300'
                  }`}
                />
                <p
                  className={`mt-1 font-sans text-[10px] text-center max-w-[60px] ${
                    isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {getStateLabel(state).split(' ')[0]}
                </p>
              </div>
              {index < allStates.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 ${
                    isPast ? 'bg-teal-500' : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
