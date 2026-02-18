'use client';

/**
 * Governed Memory Vault Hub
 * GVLT-01 through GVLT-04: Governed vault view, report export, retention policies
 */

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { GovernedVault } from '@/components/b2b/vault/GovernedVault';
import { VaultReportExport } from '@/components/b2b/vault/VaultReportExport';
import { RetentionPolicyManager } from '@/components/b2b/vault/RetentionPolicyManager';
import { Shield, FileText, Settings } from 'lucide-react';

export default function GovernedMemoryVaultPage() {
  const { can } = useCan();
  const [selectedClient, setSelectedClient] = useState('user-uhni-001');

  // Permission gate: can(Permission.READ, 'vault')
  if (!can(Permission.READ, 'vault')) {
    return (
      <div className="p-8">
        <Card className="bg-rose-50">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-rose-900 mb-2">Access Restricted</h2>
            <p className="font-sans text-sm text-rose-700">
              You do not have permission to access the Governed Memory Vault.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      value: 'vault',
      label: 'Vault Entries',
      content: <GovernedVault clientId={selectedClient} />
    },
    {
      value: 'reports',
      label: 'Reports',
      content: <VaultReportExport clientId={selectedClient} />
    },
    {
      value: 'retention',
      label: 'Retention Policies',
      content: <RetentionPolicyManager />
    }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-slate-900 mb-2">
          Governed Memory Vault
        </h1>
        <p className="font-sans text-sm text-slate-600">
          Read-only access to client memories with full governance and audit logging
        </p>
      </div>

      {/* Client Selector */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-l-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
              Select Client to View Vault
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="user-uhni-001">Alexandra Bennett (user-uhni-001)</option>
              <option value="user-uhni-002">Marcus Pemberton-Shaw (user-uhni-002)</option>
              <option value="user-uhni-003">Isabella von Habsburg (user-uhni-003)</option>
            </select>
          </div>
          <div className="text-right">
            <p className="text-xs font-sans text-slate-500">Access Mode</p>
            <p className="text-sm font-sans text-blue-900 font-medium">Governed Read-Only</p>
          </div>
        </div>
      </Card>

      {/* Main Tabs */}
      <Card>
        <Tabs items={tabs} defaultValue="vault" />
      </Card>
    </div>
  );
}
