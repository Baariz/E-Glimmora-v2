'use client';

/**
 * Data Visibility Rules Component (PRIV-09)
 * Matrix showing what each role can access — luxury editorial table
 */

import { B2CRole } from '@/lib/types/roles';
import { Resource, Permission } from '@/lib/types/permissions';
import { B2C_PERMISSIONS } from '@/lib/rbac/permissions';
import { cn } from '@/lib/utils/cn';
import { Eye, EyeOff, Lock, Edit } from 'lucide-react';

type AccessLevel = 'Full Access' | 'View Only' | 'Limited' | 'No Access';

interface AccessLevelConfig {
  label: string;
  color: string;
  bgColor: string;
  Icon: typeof Eye;
}

const ACCESS_LEVELS: Record<AccessLevel, AccessLevelConfig> = {
  'Full Access': {
    label: 'Full',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border border-emerald-200/60',
    Icon: Edit,
  },
  'View Only': {
    label: 'View',
    color: 'text-stone-600',
    bgColor: 'bg-stone-100 border border-stone-200/60',
    Icon: Eye,
  },
  'Limited': {
    label: 'Limited',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border border-amber-200/60',
    Icon: Lock,
  },
  'No Access': {
    label: 'None',
    color: 'text-stone-400',
    bgColor: 'bg-stone-50 border border-stone-200/40',
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

  if (permissions.length === 0) return 'No Access';

  const hasWrite = permissions.includes(Permission.WRITE);
  const hasDelete = permissions.includes(Permission.DELETE);
  const hasRead = permissions.includes(Permission.READ);
  const hasExport = permissions.includes(Permission.EXPORT);

  if (hasWrite && hasDelete && hasExport) return 'Full Access';

  if (hasRead && !hasWrite) {
    if (role === 'Spouse' || role === 'LegacyHeir') return 'Limited';
    return 'View Only';
  }

  if (hasRead) return 'View Only';

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

function AccessCell({ level }: { level: AccessLevel }) {
  const config = ACCESS_LEVELS[level];
  const Icon = config.Icon;

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-sans font-medium tracking-wide', config.bgColor, config.color)}>
      <Icon size={11} />
      {config.label}
    </div>
  );
}

export function DataVisibilityRules() {
  return (
    <div className="bg-white border border-stone-200/60 rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200/60">
              <th className="px-7 py-5 text-left text-[10px] font-sans uppercase tracking-[4px] text-stone-400">
                Resource
              </th>
              <th className="px-5 py-5 text-center text-[10px] font-sans uppercase tracking-[4px] text-stone-400">
                You
              </th>
              <th className="px-5 py-5 text-center text-[10px] font-sans uppercase tracking-[4px] text-stone-400">
                Spouse
              </th>
              <th className="px-5 py-5 text-center text-[10px] font-sans uppercase tracking-[4px] text-stone-400">
                Heir
              </th>
              <th className="px-5 py-5 text-center text-[10px] font-sans uppercase tracking-[4px] text-stone-400">
                Advisor
              </th>
            </tr>
          </thead>
          <tbody>
            {RESOURCE_ROWS.map((row, idx) => (
              <tr
                key={row.resource}
                className={cn(
                  'transition-colors hover:bg-stone-50/50',
                  idx < RESOURCE_ROWS.length - 1 && 'border-b border-stone-200/40'
                )}
              >
                <td className="px-7 py-5">
                  <p className="font-sans text-sm font-medium text-stone-900">{row.resource}</p>
                  <p className="text-[11px] font-sans text-stone-400 tracking-wide mt-0.5">{row.description}</p>
                </td>
                <td className="px-5 py-5 text-center">
                  <AccessCell level={row.uhni} />
                </td>
                <td className="px-5 py-5 text-center">
                  <AccessCell level={row.spouse} />
                </td>
                <td className="px-5 py-5 text-center">
                  <AccessCell level={row.heir} />
                </td>
                <td className="px-5 py-5 text-center">
                  <AccessCell level={row.advisor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-5 space-y-4">
        {RESOURCE_ROWS.map((row) => (
          <div key={row.resource} className="border border-stone-200/60 rounded-xl p-5">
            <div className="mb-4">
              <p className="font-sans text-sm font-medium text-stone-900 mb-0.5">{row.resource}</p>
              <p className="text-[11px] font-sans text-stone-400 tracking-wide">{row.description}</p>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'You', level: row.uhni },
                { label: 'Spouse', level: row.spouse },
                { label: 'Heir', level: row.heir },
                { label: 'Advisor', level: row.advisor },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[11px] font-sans text-stone-500 tracking-wide">{item.label}</span>
                  <AccessCell level={item.level} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
