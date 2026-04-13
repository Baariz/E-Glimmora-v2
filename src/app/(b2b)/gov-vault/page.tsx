'use client';

/**
 * Governed Memory Vault Hub
 * GVLT-01 through GVLT-04: Governed vault view, report export, retention policies
 */

import { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { GovernedVault } from '@/components/b2b/vault/GovernedVault';
import { VaultReportExport } from '@/components/b2b/vault/VaultReportExport';
import { RetentionPolicyManager } from '@/components/b2b/vault/RetentionPolicyManager';
import { Shield, FileText, Settings } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { ClientRecord } from '@/lib/types';

export default function GovernedMemoryVaultPage() {
  const { can } = useCan();
  const services = useServices();
  const { user: currentUser } = useCurrentUser();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    if (!currentUser?.institutionId) return;
    services.client
      .getClientsByInstitution(currentUser.institutionId)
      .then((list) => {
        setClients(list);
        if (list[0]?.userId) setSelectedClient(list[0].userId);
      })
      .catch((err) => console.error('Failed to load clients:', err));
  }, [currentUser?.institutionId, services.client]);

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
      content: <GovernedVault clientId={selectedClient} clientName={clients.find((c) => c.userId === selectedClient)?.name} />
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
              disabled={clients.length === 0}
              className="px-4 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-slate-100"
            >
              {clients.length === 0 && <option>No clients available</option>}
              {clients.map((c) => (
                <option key={c.id} value={c.userId}>
                  {c.name || c.email || c.userId}
                </option>
              ))}
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
        {selectedClient ? (
          <Tabs items={tabs} defaultValue="vault" />
        ) : (
          <div className="text-center py-8 text-slate-500 font-sans text-sm">
            Select a client to view their vault.
          </div>
        )}
      </Card>
    </div>
  );
}
