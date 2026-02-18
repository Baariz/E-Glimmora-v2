'use client';

/**
 * Approval Routing Component (ACCS-03)
 * Visual flow diagram of journey approval chain with configuration modal
 */

import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { ArrowRight, Check, Plus, Settings } from 'lucide-react';

interface ApprovalChain {
  id: string;
  name: string;
  steps: ApprovalStep[];
  active: boolean;
}

interface ApprovalStep {
  role: string;
  action: string;
  required: boolean;
}

const MOCK_CHAINS: ApprovalChain[] = [
  {
    id: 'chain-1',
    name: 'Standard Journey Approval',
    steps: [
      { role: 'Relationship Manager', action: 'Review & Submit', required: true },
      { role: 'Compliance Officer', action: 'Compliance Check', required: true },
      { role: 'Family Office Director', action: 'Final Approval', required: false },
    ],
    active: true,
  },
  {
    id: 'chain-2',
    name: 'High-Risk Journey Approval',
    steps: [
      { role: 'Relationship Manager', action: 'Initial Review', required: true },
      { role: 'Compliance Officer', action: 'Enhanced Due Diligence', required: true },
      { role: 'Family Office Director', action: 'Risk Assessment', required: true },
      { role: 'Institutional Admin', action: 'Final Sign-off', required: true },
    ],
    active: true,
  },
  {
    id: 'chain-3',
    name: 'Expedited Approval (Low Risk)',
    steps: [
      { role: 'Relationship Manager', action: 'Review & Approve', required: true },
    ],
    active: false,
  },
];

export function ApprovalRouting() {
  const [chains, setChains] = useState<ApprovalChain[]>(MOCK_CHAINS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<ApprovalChain | null>(null);

  const handleConfigureChain = (chain: ApprovalChain) => {
    setSelectedChain(chain);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl text-slate-900 mb-1">Approval Routing Configuration</h3>
          <p className="font-sans text-sm text-slate-600">
            Configure multi-step approval workflows for journey processing
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedChain(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Chain
        </button>
      </div>

      {/* Approval Chains */}
      <div className="space-y-6">
        {chains.map(chain => (
          <div key={chain.id} className="p-6 border border-slate-200 rounded-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-slate-900 text-lg">{chain.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {chain.steps.length} steps •{' '}
                  {chain.active ? (
                    <span className="text-teal-600">Active</span>
                  ) : (
                    <span className="text-slate-500">Inactive</span>
                  )}
                </p>
              </div>
              <button
                onClick={() => handleConfigureChain(chain)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors font-sans text-sm"
              >
                <Settings className="w-4 h-4" />
                Configure
              </button>
            </div>

            {/* Visual Flow */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {chain.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg min-w-[180px]">
                      <div className="flex items-center gap-2 mb-1">
                        <Check className="w-4 h-4 text-blue-600" />
                        <p className="font-sans text-sm font-medium text-slate-900">{step.role}</p>
                      </div>
                      <p className="text-xs text-slate-600">{step.action}</p>
                      {step.required && (
                        <span className="mt-1 inline-block px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-xs font-sans">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  {idx < chain.steps.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Configure Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedChain ? `Configure: ${selectedChain.name}` : 'Create Approval Chain'}
        description="Configure the approval workflow steps and requirements"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="font-sans text-sm text-blue-900">
              Approval chains define the sequence of reviews required for journey processing.
              Each step specifies a role and whether it&apos;s mandatory.
            </p>
          </div>

          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-sans text-sm text-slate-500">
              Full approval chain configuration interface would be implemented here with:
              drag-and-drop step ordering, role assignment, conditional routing, and SLA settings.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-md font-sans text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
