'use client';

/**
 * Compliance Flags Component (RISK-05)
 * Flag list with issue reporting modal for compliance officers
 */

import { useState, useEffect } from 'react';
import { useServices } from '@/lib/hooks/useServices';
import { RiskRecord } from '@/lib/types/entities';
import { Modal } from '@/components/shared/Modal';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { Flag, AlertTriangle, Plus } from 'lucide-react';

interface FlaggedClient {
  id: string;
  userId: string;
  flags: string[];
  riskCategory: string;
  riskScore: number;
}

export function ComplianceFlags() {
  const { risk } = useServices();
  const [flaggedClients, setFlaggedClients] = useState<FlaggedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [newFlag, setNewFlag] = useState('');

  useEffect(() => {
    loadFlaggedClients();
  }, []);

  const loadFlaggedClients = async () => {
    try {
      setLoading(true);
      const mockInstitutionId = 'inst-001-uuid-placeholder';
      const records = await risk.getRiskRecords(mockInstitutionId);

      // Filter to only clients with flags
      const flagged = records
        .filter(r => r.flags.length > 0)
        .map(r => ({
          id: r.id,
          userId: r.userId,
          flags: r.flags,
          riskCategory: r.riskCategory,
          riskScore: r.riskScore,
        }));

      setFlaggedClients(flagged);
    } catch (error) {
      console.error('Failed to load compliance flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newFlag) return;

    try {
      await risk.flagComplianceIssue(selectedClient, newFlag);
      setIsModalOpen(false);
      setSelectedClient('');
      setNewFlag('');
      loadFlaggedClients();
    } catch (error) {
      console.error('Failed to flag compliance issue:', error);
    }
  };

  const commonFlags = [
    'PEP (Politically Exposed Person)',
    'High-Net-Worth',
    'Complex Structures',
    'Multi-Jurisdiction',
    'Enhanced Due Diligence Required',
    'Sanctions Risk',
    'AML Concern',
    'Unusual Transaction Pattern',
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl text-slate-900 mb-1">Compliance Flags</h3>
          <p className="font-sans text-sm text-slate-600">
            Monitor and manage compliance flags across client portfolio ({flaggedClients.length} flagged)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm"
        >
          <Flag className="w-4 h-4" />
          Flag Issue
        </button>
      </div>

      {/* Summary Alert */}
      {flaggedClients.length > 0 && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-sans text-sm font-semibold text-amber-900 mb-1">
                {flaggedClients.length} Client{flaggedClients.length > 1 ? 's' : ''} with Active Flags
              </h4>
              <p className="font-sans text-sm text-amber-800">
                Review flagged clients and take appropriate action based on risk level
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Flagged Clients List */}
      {flaggedClients.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 rounded-lg">
          <Flag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="font-sans text-sm text-slate-500">No compliance flags at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedClients.map(client => (
            <div key={client.id} className="p-4 border border-slate-200 rounded-lg bg-white hover:border-rose-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <Flag className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-base">
                      Client: <span className="font-mono text-sm">{client.userId}</span>
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={client.riskCategory} />
                      <span className="text-xs font-sans text-slate-500">
                        Risk Score: {client.riskScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-sans text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Active Flags ({client.flags.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {client.flags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-sans text-xs"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flag Issue Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Flag Compliance Issue"
        description="Add a compliance flag to a client record"
      >
        <form onSubmit={handleFlagSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Client ID
            </label>
            <input
              type="text"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g., user-uhni-001"
              required
            />
            <p className="mt-1 text-xs text-slate-500 font-sans">
              Enter the client user ID to flag
            </p>
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Flag Type
            </label>
            <select
              value={newFlag}
              onChange={(e) => setNewFlag(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            >
              <option value="">Select a flag type...</option>
              {commonFlags.map(flag => (
                <option key={flag} value={flag.toLowerCase().replace(/\s+/g, '-')}>
                  {flag}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="font-sans text-xs text-amber-900">
              <strong>Note:</strong> Compliance flags are logged to the audit trail and trigger enhanced monitoring.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-md font-sans text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm"
            >
              Add Flag
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
