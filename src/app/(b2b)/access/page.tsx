'use client';

/**
 * Access Engineering Hub
 * ACCS-01 through ACCS-05: Privilege tiers, RBAC management, approval routing,
 * and access registry logs
 */

import { Card } from '@/components/shared/Card';
import { Tabs } from '@/components/shared/Tabs';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { PrivilegeTierConfig } from '@/components/b2b/access/PrivilegeTierConfig';
import { RBACManager } from '@/components/b2b/access/RBACManager';
import { ApprovalRouting } from '@/components/b2b/access/ApprovalRouting';
import { RegistryLogs } from '@/components/b2b/access/RegistryLogs';
import { Shield, Users, GitBranch, FileText } from 'lucide-react';

export default function AccessEngineeringPage() {
  const { can } = useCan();

  // Permission gate: can(Permission.CONFIGURE, 'institution')
  if (!can(Permission.CONFIGURE, 'institution')) {
    return (
      <div className="p-8">
        <Card className="bg-rose-50">
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-rose-900 mb-2">Access Restricted</h2>
            <p className="font-sans text-sm text-rose-700">
              Only Institutional Admins can access Access Engineering.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      value: 'tiers',
      label: 'Privilege Tiers',
      content: <PrivilegeTierConfig />
    },
    {
      value: 'rbac',
      label: 'Role Management',
      content: <RBACManager />
    },
    {
      value: 'routing',
      label: 'Approval Routing',
      content: <ApprovalRouting />
    },
    {
      value: 'logs',
      label: 'Access Logs',
      content: <RegistryLogs />
    }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-slate-900 mb-2">
          Access Engineering
        </h1>
        <p className="font-sans text-sm text-slate-600">
          Configure privilege tiers, manage role-based access control, set approval routing, and audit access logs
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-sans text-slate-600">Permission Matrix</p>
              <p className="text-2xl font-serif text-slate-900">7 Roles</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-teal-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-sans text-slate-600">Active Users</p>
              <p className="text-2xl font-serif text-slate-900">12</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <GitBranch className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-sans text-slate-600">Approval Chains</p>
              <p className="text-2xl font-serif text-slate-900">3</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-sans text-slate-600">Audit Events</p>
              <p className="text-2xl font-serif text-slate-900">203</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Card>
        <Tabs items={tabs} defaultValue="tiers" />
      </Card>
    </div>
  );
}
