'use client';

/**
 * Privilege Tier Configuration Component (ACCS-01)
 * Permission grid per B2B role with edit capability
 */

import { useState } from 'react';
import { B2BRole } from '@/lib/types/roles';
import { Permission, Resource } from '@/lib/types/permissions';
import { getPermissionMatrix } from '@/lib/rbac/permissions';
import { Check, X, Info } from 'lucide-react';

const B2B_ROLES = [
  B2BRole.RelationshipManager,
  B2BRole.PrivateBanker,
  B2BRole.FamilyOfficeDirector,
  B2BRole.ComplianceOfficer,
  B2BRole.InstitutionalAdmin,
  B2BRole.UHNIPortal,
];

const RESOURCES: Resource[] = [
  'client',
  'journey',
  'risk',
  'vault',
  'audit',
  'message',
  'revenue',
  'institution',
  'user',
  'contract',
  'privacy',
];

const PERMISSIONS = [
  Permission.READ,
  Permission.WRITE,
  Permission.DELETE,
  Permission.APPROVE,
  Permission.EXPORT,
  Permission.CONFIGURE,
  Permission.ASSIGN,
];

export function PrivilegeTierConfig() {
  const [selectedRole, setSelectedRole] = useState<B2BRole>(B2BRole.RelationshipManager);
  const matrix = getPermissionMatrix('b2b');

  const rolePermissions = matrix[selectedRole] || {};

  const hasPermission = (resource: Resource, permission: Permission): boolean => {
    const perms = rolePermissions[resource] || [];
    return perms.includes(permission);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-slate-900 mb-1">Privilege Tier Configuration</h3>
        <p className="font-sans text-sm text-slate-600">
          View and understand permission matrices for each B2B role
        </p>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-sans text-sm font-semibold text-blue-900 mb-1">
              Permission Matrix System
            </h4>
            <p className="font-sans text-sm text-blue-800">
              E-Glimmora uses role-based access control (RBAC) with permission matrices.
              Each role has specific permissions on resources. This configuration is read-only;
              changes require code deployment for security.
            </p>
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div>
        <label className="block font-sans text-sm font-medium text-slate-700 mb-2">
          Select Role to View Permissions
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as B2BRole)}
          className="px-4 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 max-w-md"
        >
          {B2B_ROLES.map(role => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Permission Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-200 rounded-lg">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-sans text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                Resource
              </th>
              {PERMISSIONS.map(permission => (
                <th
                  key={permission}
                  className="px-4 py-3 text-center font-sans text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200"
                >
                  {permission}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {RESOURCES.map(resource => (
              <tr key={resource} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-sans text-sm font-medium text-slate-900">
                  {resource}
                </td>
                {PERMISSIONS.map(permission => {
                  const has = hasPermission(resource, permission);
                  return (
                    <td key={permission} className="px-4 py-3 text-center">
                      {has ? (
                        <Check className="w-5 h-5 text-teal-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Summary */}
      <div className="p-4 bg-slate-50 rounded-lg">
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3">
          {selectedRole} Permission Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(rolePermissions).map(([resource, perms]) => (
            <div key={resource} className="flex items-start gap-2">
              <span className="font-mono text-xs text-slate-600 mt-0.5">{resource}:</span>
              <div className="flex flex-wrap gap-1">
                {(perms as Permission[]).map(p => (
                  <span
                    key={p}
                    className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded text-xs font-sans"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
