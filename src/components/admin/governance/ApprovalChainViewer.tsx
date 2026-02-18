/**
 * Approval Chain Viewer Component
 * Visual representation of multi-level approval workflows
 */

import { ArrowRight, CheckCircle, Circle } from 'lucide-react';
import { ApprovalChain, ApprovalStep } from '@/lib/state-machines/approval-routing-config';
import { Card } from '@/components/shared/Card';

interface ApprovalChainViewerProps {
  chain: ApprovalChain;
  currentStep?: number; // Current step order (for progress indication)
  completedSteps?: number[]; // Array of completed step orders
}

export function ApprovalChainViewer({
  chain,
  currentStep,
  completedSteps = [],
}: ApprovalChainViewerProps) {
  const isStepComplete = (step: ApprovalStep) => {
    return completedSteps.includes(step.order);
  };

  const isStepCurrent = (step: ApprovalStep) => {
    return currentStep === step.order;
  };

  const isStepPending = (step: ApprovalStep) => {
    return !isStepComplete(step) && !isStepCurrent(step);
  };

  const getStepStatus = (step: ApprovalStep) => {
    if (isStepComplete(step)) return 'complete';
    if (isStepCurrent(step)) return 'current';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-teal-600 border-teal-600 bg-teal-50';
      case 'current':
        return 'text-amber-600 border-amber-600 bg-amber-50';
      case 'pending':
        return 'text-slate-400 border-slate-300 bg-slate-50';
      default:
        return 'text-slate-400 border-slate-300 bg-slate-50';
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Chain Header */}
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-lg font-sans font-medium text-slate-900">
            {chain.name}
          </h3>
          <p className="text-sm font-sans text-slate-600 mt-1">
            {chain.description}
          </p>
        </div>

        {/* Approval Steps - Horizontal Flow */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {chain.steps.map((step, index) => {
            const status = getStepStatus(step);
            const colorClass = getStepColor(status);

            return (
              <div key={step.order} className="flex items-center gap-2 flex-shrink-0">
                {/* Step Card */}
                <div
                  className={`flex flex-col items-center justify-center px-4 py-3 border-2 rounded-lg min-w-[140px] ${colorClass}`}
                >
                  {/* Status Icon */}
                  <div className="mb-2">
                    {status === 'complete' ? (
                      <CheckCircle size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="text-center">
                    <div className="text-xs font-sans font-medium uppercase tracking-wide mb-1">
                      Step {step.order}
                    </div>
                    <div className="text-sm font-sans font-medium mb-1">
                      {step.label}
                    </div>
                    <div className="text-xs font-sans opacity-75">{step.role}</div>
                    {step.required && (
                      <div className="text-xs font-sans mt-1 opacity-60">
                        Required
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow (except after last step) */}
                {index < chain.steps.length - 1 && (
                  <ArrowRight
                    size={20}
                    className={
                      status === 'complete'
                        ? 'text-teal-600'
                        : 'text-slate-300'
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between text-sm font-sans">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900 font-medium">
              {completedSteps.length} of {chain.steps.length} steps complete
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (completedSteps.length / chain.steps.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
