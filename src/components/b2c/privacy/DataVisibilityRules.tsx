'use client';

/**
 * Data Visibility Rules Component (PRIV-09)
 * Matrix showing what each role can access
 */

import { B2CRole } from '@/lib/types/roles';
import { Resource, Permission } from '@/lib/types/permissions';
import { B2C_PERMISSIONS } from '@/lib/rbac/permissions';
import { cn } from '@/lib/utils/cn';
import { Eye, EyeOff, Lock, Edit, Trash2 } from 'lucide-react';

type AccessLevel = 'Full Access' | 'View Only' | 'Limited' | 'No Access';

interface AccessLevelConfig {
  label: string;
  color: string;
  bgColor: string;
  Icon: typeof Eye;
}

const ACCESS_LEVELS: Record<AccessLevel, AccessLevelConfig> = {
  'Full Access': {
    label: 'Full Access',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    Icon: Edit,
  },
  'View Only': {
    label: 'View Only',
    color: 'text-sand-700',
    bgColor: 'bg-sand-50',
    Icon: Eye,
  },
  'Limited': {
    label: 'Limited',
    color: 'text-stone-600',
    bgColor: 'bg-stone-50',
    Icon: Lock,
  },
  'No Access': {
    label: 'No Access',
    color: 'text-stone-400',
    bgColor: 'bg-stone-50',
    Icon: EyeOff,
  },
};

interface ResourceRow {
  resource: string;
  description: string;
  uhni: AccessLevel;
  spouse: AccessLevel;
  heir: AccessLevel;
  advisor: AccessLevel;
}

function getAccessLevel(role: B2CRole, resource: Resource): AccessLevel {
  const permissions = B2C_PERMISSIONS[role]?.[resource] || [];

  if (permissions.length === 0) {
    return 'No Access';
  }

  const hasWrite = permissions.includes(Permission.WRITE);
  const hasDelete = permissions.includes(Permission.DELETE);
  const hasRead = permissions.includes(Permission.READ);
  const hasExport = permissions.includes(Permission.EXPORT);

  if (hasWrite && hasDelete && hasExport) {
    return 'Full Access';
  }

  if (hasRead && !hasWrite) {
    if (role === 'Spouse' || role === 'LegacyHeir') {
      return 'Limited';
    }
    return 'View Only';
  }

  if (hasRead) {
    return 'View Only';
  }

  return 'No Access';
}

const RESOURCE_ROWS: ResourceRow[] = [
  {
    resource: 'Journeys',
    description: 'Travel plans, investments, and life events',
    uhni: getAccessLevel(B2CRole.UHNI, 'journey'),
    spouse: getAccessLevel(B2CRole.Spouse, 'journey'),
    heir: getAccessLevel(B2CRole.LegacyHeir, 'journey'),
    advisor: getAccessLevel(B2CRole.ElanAdvisor, 'journey'),
  },
  {
    resource: 'Memory Vault',
    description: 'Photos, documents, and personal memories',
    uhni: getAccessLevel(B2CRole.UHNI, 'vault'),
    spouse: getAccessLevel(B2CRole.Spouse, 'vault'),
    heir: getAccessLevel(B2CRole.LegacyHeir, 'vault'),
    advisor: 'No Access',
  },
  {
    resource: 'Intent Profile',
    description: 'Emotional drivers and preferences',
    uhni: getAccessLevel(B2CRole.UHNI, 'intent'),
    spouse: 'No Access',
    heir: 'No Access',
    advisor: getAccessLevel(B2CRole.ElanAdvisor, 'intent'),
  },
  {
    resource: 'Privacy Settings',
    description: 'Access controls and data preferences',
    uhni: getAccessLevel(B2CRole.UHNI, 'privacy'),
    spouse: 'No Access',
    heir: 'No Access',
    advisor: 'No Access',
  },
  {
    resource: 'Messages',
    description: 'Conversations with advisors and institution',
    uhni: getAccessLevel(B2CRole.UHNI, 'message'),
    spouse: 'No Access',
    heir: 'No Access',
    advisor: getAccessLevel(B2CRole.ElanAdvisor, 'message'),
  },
];

interface AccessCellProps {
  level: AccessLevel;
}

function AccessCell({ level }: AccessCellProps) {
  const config = ACCESS_LEVELS[level];
  const Icon = config.Icon;

  return (
    <div className={cn('flex items-center justify-center gap-2 px-3 py-2 rounded-lg', config.bgColor)}>
      <Icon className={cn('w-4 h-4', config.color)} />
      <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
    </div>
  );
}

export function DataVisibilityRules() {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-stone-200 overflow-hidden">
      <div className="p-6 border-b border-stone-200">
        <h3 className="font-serif text-2xl text-stone-900 mb-2">Data Visibility Rules</h3>
        <p className="text-stone-600">
          This matrix shows what each role in your circle can access. Access levels are based on your privacy settings and role permissions.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-stone-700 uppercase tracking-wider">
                You (UHNI)
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Spouse
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Heir
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Advisor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {RESOURCE_ROWS.map((row) => (
              <tr key={row.resource} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-stone-900">{row.resource}</div>
                  <div className="text-sm text-stone-500">{row.description}</div>
                </td>
                <td className="px-6 py-4">
                  <AccessCell level={row.uhni} />
                </td>
                <td className="px-6 py-4">
                  <AccessCell level={row.spouse} />
                </td>
                <td className="px-6 py-4">
                  <AccessCell level={row.heir} />
                </td>
                <td className="px-6 py-4">
                  <AccessCell level={row.advisor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-6 space-y-6">
        {RESOURCE_ROWS.map((row) => (
          <div key={row.resource} className="border border-stone-200 rounded-lg p-4">
            <div className="mb-4">
              <div className="font-medium text-stone-900 mb-1">{row.resource}</div>
              <div className="text-sm text-stone-500">{row.description}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">You (UHNI)</span>
                <AccessCell level={row.uhni} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Spouse</span>
                <AccessCell level={row.spouse} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Heir</span>
                <AccessCell level={row.heir} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-600">Advisor</span>
                <AccessCell level={row.advisor} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
