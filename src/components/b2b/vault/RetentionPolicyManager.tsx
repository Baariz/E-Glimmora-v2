'use client';

/**
 * Retention Policy Manager Component (GVLT-04)
 * DataTable of retention policies with CRUD modal
 */

import { useState } from 'react';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { Modal } from '@/components/shared/Modal';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Clock } from 'lucide-react';

interface RetentionPolicy {
  id: string;
  entityType: string;
  retentionDays: number;
  autoArchive: boolean;
  autoDelete: boolean;
  createdAt: string;
}

const MOCK_POLICIES: RetentionPolicy[] = [
  {
    id: 'policy-1',
    entityType: 'Memory',
    retentionDays: 2555, // ~7 years
    autoArchive: true,
    autoDelete: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'policy-2',
    entityType: 'Journey',
    retentionDays: 3650, // 10 years
    autoArchive: true,
    autoDelete: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'policy-3',
    entityType: 'Audit Event',
    retentionDays: 1825, // 5 years
    autoArchive: false,
    autoDelete: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'policy-4',
    entityType: 'Risk Record',
    retentionDays: 2555, // ~7 years
    autoArchive: true,
    autoDelete: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export function RetentionPolicyManager() {
  const [policies, setPolicies] = useState<RetentionPolicy[]>(MOCK_POLICIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    entityType: '',
    retentionDays: 2555,
    autoArchive: true,
    autoDelete: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPolicy: RetentionPolicy = {
      id: `policy-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setPolicies([...policies, newPolicy]);
    setIsModalOpen(false);
    setFormData({
      entityType: '',
      retentionDays: 2555,
      autoArchive: true,
      autoDelete: false,
    });
  };

  const columns: ColumnDef<RetentionPolicy, any>[] = [
    {
      accessorKey: 'entityType',
      header: 'Entity Type',
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">{row.original.entityType}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'retentionDays',
      header: 'Retention Period',
      cell: ({ row }) => {
        const days = row.original.retentionDays;
        const years = (days / 365).toFixed(1);
        return (
          <span className="text-slate-600">
            {days} days ({years} years)
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'autoArchive',
      header: 'Auto Archive',
      cell: ({ row }) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-sans ${
            row.original.autoArchive
              ? 'bg-teal-100 text-teal-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.original.autoArchive ? 'Enabled' : 'Disabled'}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'autoDelete',
      header: 'Auto Delete',
      cell: ({ row }) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-sans ${
            row.original.autoDelete
              ? 'bg-rose-100 text-rose-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.original.autoDelete ? 'Enabled' : 'Disabled'}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-slate-600 text-xs">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
      enableSorting: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl text-slate-900 mb-1">Retention Policy Management</h3>
          <p className="font-sans text-sm text-slate-600">
            Configure data lifecycle rules for entity types ({policies.length} policies)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Policy
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-sans text-sm font-semibold text-blue-900 mb-1">
              Data Retention & Lifecycle
            </h4>
            <p className="font-sans text-sm text-blue-800">
              Retention policies define how long data is kept and whether it&apos;s automatically
              archived or deleted. These policies ensure compliance with regulatory requirements
              and institutional data governance standards.
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={policies}
        searchColumn="entityType"
        searchPlaceholder="Search entity types..."
      />

      {/* Add Policy Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Retention Policy"
        description="Configure data retention rules for an entity type"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Entity Type
            </label>
            <select
              value={formData.entityType}
              onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            >
              <option value="">Select entity type...</option>
              <option value="Memory">Memory</option>
              <option value="Journey">Journey</option>
              <option value="Audit Event">Audit Event</option>
              <option value="Risk Record">Risk Record</option>
              <option value="Message">Message</option>
              <option value="Client Record">Client Record</option>
            </select>
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-1">
              Retention Period (Days)
            </label>
            <input
              type="number"
              value={formData.retentionDays}
              onChange={(e) => setFormData({ ...formData, retentionDays: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              min="1"
              required
            />
            <p className="mt-1 text-xs text-slate-500 font-sans">
              Approximately {(formData.retentionDays / 365).toFixed(1)} years
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoArchive}
                onChange={(e) => setFormData({ ...formData, autoArchive: e.target.checked })}
                className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-2 focus:ring-rose-500"
              />
              <div>
                <span className="font-sans text-sm text-slate-900">Auto Archive</span>
                <p className="text-xs text-slate-600">
                  Automatically move records to archive after retention period
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoDelete}
                onChange={(e) => setFormData({ ...formData, autoDelete: e.target.checked })}
                className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-2 focus:ring-rose-500"
              />
              <div>
                <span className="font-sans text-sm text-slate-900">Auto Delete</span>
                <p className="text-xs text-slate-600">
                  Permanently delete records after retention period (use with caution)
                </p>
              </div>
            </label>
          </div>

          {formData.autoDelete && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md">
              <p className="font-sans text-xs text-rose-900">
                <strong>Warning:</strong> Auto-delete permanently removes data. Ensure this complies
                with legal and regulatory requirements before enabling.
              </p>
            </div>
          )}

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
              Add Policy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
