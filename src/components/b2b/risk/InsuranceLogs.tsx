'use client';

/**
 * Insurance Logs Component (RISK-04)
 * DataTable with CRUD modal for managing client insurance policies
 */

import { useState, useEffect } from 'react';
import { useServices } from '@/lib/hooks/useServices';
import { InsuranceLog } from '@/lib/types/entities';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { Modal } from '@/components/shared/Modal';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, FileText } from 'lucide-react';

export function InsuranceLogs() {
  const { risk } = useServices();
  const [logs, setLogs] = useState<InsuranceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsuranceLog>>({
    type: 'Travel Insurance',
    provider: '',
    policyNumber: '',
    coverage: '',
    validFrom: '',
    validUntil: '',
    notes: '',
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await risk.getInsuranceLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to load insurance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mockInstitutionId = 'inst-001-uuid-placeholder';
      const mockCreatedBy = 'b2b-rm-001-uuid-placeholder';

      await risk.createInsuranceLog({
        ...formData,
        clientId: 'user-uhni-001', // Default for demo
        institutionId: mockInstitutionId,
        createdBy: mockCreatedBy,
      });

      setIsModalOpen(false);
      setFormData({
        type: 'Travel Insurance',
        provider: '',
        policyNumber: '',
        coverage: '',
        validFrom: '',
        validUntil: '',
        notes: '',
      });
      loadLogs();
    } catch (error) {
      console.error('Failed to create insurance log:', error);
    }
  };

  const columns: ColumnDef<InsuranceLog, any>[] = [
    {
      accessorKey: 'clientId',
      header: 'Client ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-600">{row.original.clientId}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">{row.original.type}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
      cell: ({ row }) => (
        <span className="text-slate-600">{row.original.provider}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'policyNumber',
      header: 'Policy Number',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-700">{row.original.policyNumber}</span>
      ),
    },
    {
      accessorKey: 'validFrom',
      header: 'Valid Period',
      cell: ({ row }) => (
        <span className="text-slate-600 text-xs">
          {new Date(row.original.validFrom).toLocaleDateString()} -{' '}
          {new Date(row.original.validUntil).toLocaleDateString()}
        </span>
      ),
      enableSorting: true,
    },
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
          <h3 className="font-serif text-xl text-slate-900 mb-1">Insurance Logs</h3>
          <p className="font-sans text-sm text-slate-600">
            Track client insurance policies and coverage details ({logs.length} total)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Insurance Log
        </button>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchColumn="provider"
        searchPlaceholder="Search by provider..."
      />

      {/* Add Insurance Log Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Insurance Log"
        description="Document a new insurance policy for a client"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Insurance Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            >
              <option value="Travel Insurance">Travel Insurance</option>
              <option value="Health Coverage">Health Coverage</option>
              <option value="Property Insurance">Property Insurance</option>
              <option value="Life Insurance">Life Insurance</option>
              <option value="Liability Insurance">Liability Insurance</option>
            </select>
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Provider
            </label>
            <input
              type="text"
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g., Zurich International"
              required
            />
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Policy Number
            </label>
            <input
              type="text"
              value={formData.policyNumber}
              onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g., ZI-UHNI-2026-00145"
              required
            />
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Coverage Details
            </label>
            <textarea
              value={formData.coverage}
              onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              rows={3}
              placeholder="Describe coverage details..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
                Valid From
              </label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              rows={2}
              placeholder="Additional notes..."
            />
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
              Add Insurance Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
