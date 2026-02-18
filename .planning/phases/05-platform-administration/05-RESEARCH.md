# Phase 05: Platform Administration - Research

**Researched:** 2026-02-16
**Domain:** Multi-tenant SaaS administration, system monitoring, governance infrastructure
**Confidence:** HIGH

## Summary

Phase 5 implements the meta-layer for platform operations, enabling Super Admins to manage the entire Élan platform across multiple institutions. This includes invite code management, institution and member lifecycle management, platform-wide audit logging, system health monitoring, revenue oversight, and governance infrastructure (multi-level approval routing, version history, role-based UI exposure, and institutional branding).

The research reveals that this phase extends existing patterns rather than introducing new ones. The project already has:
- Service abstraction layer with mock implementations (localStorage-backed)
- RBAC with permission matrices and `useCan()` hook
- DataTable component pattern (TanStack Table wrapper)
- Existing audit event system (append-only, immutable)
- State machine pattern for workflow management (journey-workflow.ts)
- Chart components using Recharts (revenue/usage metrics established in B2B)
- Admin route group and basic layout structure

The primary tasks involve expanding service implementations (invite, institution, audit), creating new admin UI pages following established B2B patterns, enhancing the existing state machine for configurable approval routing, and implementing UI theming/branding controls.

**Primary recommendation:** Build on existing patterns—DataTable for lists, Recharts for monitoring charts, configuration-driven state machines for approval routing, design tokens/CSS variables for institutional branding. No new libraries needed; extend existing service layer and create admin-specific UI pages using proven B2B component patterns.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js 14 App Router | 14.x | Framework | Already in use, (admin) route group exists |
| TypeScript | 5.x | Type safety | Entire project is TypeScript |
| Tailwind CSS | 3.x | Styling | Design system already built on Tailwind |
| TanStack Table | 8.x | Data tables | Proven in B2B (DataTable wrapper exists) |
| Recharts | 2.x | Charts/graphs | Already used for revenue/usage metrics in B2B |
| Radix UI | Latest | Accessible primitives | Project standard for modals, dropdowns, etc. |
| Framer Motion | 11.x | Animations | Project standard for transitions |
| date-fns | 3.x | Date formatting | Already used throughout B2B |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 3.x | Validation | Existing in project for form validation |
| lucide-react | Latest | Icons | Project icon library |
| NextAuth v5 beta | 5.x (beta) | Authentication | Already configured with mock provider |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TanStack Table | AG Grid | AG Grid is enterprise-grade but overkill for admin panels; TanStack Table already proven in B2B clients page |
| Recharts | Chart.js | Chart.js more performant but Recharts already used in revenue/usage components |
| CSS Variables for branding | Styled Components | CSS Variables simpler for runtime theming; avoids SSR complexity |

**Installation:**
```bash
# No new dependencies needed
# All required libraries already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── (admin)/              # Admin route group (exists)
│       ├── layout.tsx        # Admin layout (exists, needs enhancement)
│       ├── dashboard/        # Platform overview
│       ├── invites/          # Invite code management
│       ├── members/          # UHNI member management
│       ├── institutions/     # Institution management
│       ├── audit/            # Platform-wide audit logs
│       ├── system/           # System health monitoring
│       └── revenue/          # Revenue/billing overview
├── components/
│   └── admin/                # Admin-specific components
│       ├── invites/          # Invite code components
│       ├── members/          # Member management components
│       ├── institutions/     # Institution components
│       ├── audit/            # Audit log components
│       ├── monitoring/       # System health components
│       └── governance/       # Governance infrastructure components
├── lib/
│   ├── services/
│   │   ├── interfaces/
│   │   │   ├── IInviteCodeService.ts      # (exists)
│   │   │   ├── IInstitutionService.ts     # (exists)
│   │   │   ├── IAuditService.ts           # (exists)
│   │   │   └── ISystemHealthService.ts    # (needs creation)
│   │   └── mock/
│   │       ├── invite-code.mock.ts        # (exists, needs enhancement)
│   │       ├── institution.mock.ts        # (exists, needs enhancement)
│   │       ├── audit.mock.ts              # (exists, needs enhancement)
│   │       └── system-health.mock.ts      # (needs creation)
│   ├── state-machines/
│   │   ├── journey-workflow.ts            # (exists)
│   │   └── approval-routing-config.ts     # (needs creation - GVRN-01)
│   └── branding/
│       ├── theme-tokens.ts                # (needs creation - GVRN-06)
│       └── institutional-themes.ts        # (needs creation - GVRN-06)
```

### Pattern 1: Admin Page with DataTable
**What:** Admin list pages follow the B2B pattern—header with actions, optional stats row, DataTable with search/sort/pagination
**When to use:** All admin list views (invites, members, institutions, audit logs)
**Example:**
```typescript
// Source: Existing B2B pattern from /src/app/(b2b)/clients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { Button } from '@/components/shared/Button';
import { useServices } from '@/lib/hooks/useServices';
import { useCan } from '@/lib/rbac/usePermission';

export default function AdminListPage() {
  const [data, setData] = useState([]);
  const services = useServices();
  const { can } = useCan();

  // Permission check
  if (!can(Permission.READ, 'resource')) {
    return <AccessDenied />;
  }

  // Stats calculation
  const stats: StatCard[] = [/* ... */];

  // Column definitions
  const columns: ColumnDef<Entity>[] = [/* ... */];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-slate-900">Title</h1>
          <p className="font-sans text-slate-600">Description</p>
        </div>
        <Button variant="primary">Action</Button>
      </div>

      <StatsRow stats={stats} />

      <DataTable
        columns={columns}
        data={data}
        searchColumn="name"
        searchPlaceholder="Search..."
        pageSize={25}
      />
    </div>
  );
}
```

### Pattern 2: System Monitoring with Recharts
**What:** System health monitoring pages use Recharts for visualization (area charts, bar charts, line charts)
**When to use:** System health dashboard, uptime monitoring, performance metrics
**Example:**
```typescript
// Source: Existing pattern from /src/components/b2b/revenue/UsageMetrics.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SystemHealthChart({ data }) {
  return (
    <Card>
      <h3 className="text-lg font-serif text-slate-900 mb-4">Uptime</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
          <Tooltip contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }} />
          <Area
            type="monotone"
            dataKey="uptime"
            stroke="#0891b2"
            fillOpacity={1}
            fill="url(#colorUptime)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

### Pattern 3: Configuration-Driven State Machines
**What:** State machines defined as configuration objects with transition rules, permission checks, and labels
**When to use:** Multi-level approval routing (GVRN-01), any workflow with states and transitions
**Example:**
```typescript
// Source: Existing pattern from /src/lib/state-machines/journey-workflow.ts
interface Transition {
  next: State;
  requiredPermission: { action: Permission; resource: Resource };
  label?: string;
}

const WORKFLOW_TRANSITIONS: Record<State, Record<string, Transition>> = {
  PENDING: {
    APPROVE: {
      next: 'APPROVED',
      requiredPermission: { action: Permission.APPROVE, resource: 'resource' },
      label: 'Approve'
    }
  }
};

export function getAvailableTransitions(state: State, role: Role, context: DomainContext) {
  const stateTransitions = WORKFLOW_TRANSITIONS[state];
  return Object.entries(stateTransitions)
    .filter(([_, transition]) => hasPermission(role, transition.requiredPermission.action, transition.requiredPermission.resource, context))
    .map(([event]) => event);
}
```

### Pattern 4: Institutional Branding with CSS Variables
**What:** Runtime theme switching using CSS variables (design tokens) scoped per institution
**When to use:** Institutional branding controls (GVRN-06)
**Reference:** Per [White-labeling React apps](https://krasimirtsonev.com/blog/article/whitelabel-react-apps), design tokens approach allows runtime brand switching without rebuild
**Example:**
```typescript
// Design tokens per institution
interface InstitutionalTheme {
  institutionId: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  logo: string;
}

// Apply theme at runtime
function applyInstitutionalTheme(theme: InstitutionalTheme) {
  document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
  document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary);
  document.documentElement.style.setProperty('--font-heading', theme.typography.headingFont);
  // ... etc
}
```

### Pattern 5: Audit Log Filtering
**What:** Multi-dimensional filtering for audit logs—entity type, action, user, timestamp range, context
**When to use:** Platform-wide audit log viewer (ADMN-06)
**Reference:** Per [ra-audit-log documentation](https://react-admin-ee.marmelab.com/documentation/ra-audit-log), audit events should have consistent schema with resource, action, user, timestamp
**Example:**
```typescript
interface AuditLogFilters {
  resourceType?: string;
  action?: AuditAction;
  userId?: string;
  context?: DomainContext;
  startDate?: string;
  endDate?: string;
}

function filterAuditLogs(logs: AuditEvent[], filters: AuditLogFilters): AuditEvent[] {
  return logs.filter(log => {
    if (filters.resourceType && log.resourceType !== filters.resourceType) return false;
    if (filters.action && log.action !== filters.action) return false;
    if (filters.userId && log.userId !== filters.userId) return false;
    if (filters.context && log.context !== filters.context) return false;
    if (filters.startDate && log.timestamp < filters.startDate) return false;
    if (filters.endDate && log.timestamp > filters.endDate) return false;
    return true;
  });
}
```

### Anti-Patterns to Avoid
- **Building custom table components:** DataTable wrapper already proven—don't reinvent
- **Hand-rolling chart components:** Recharts handles all admin dashboard chart needs
- **Hardcoding approval chains:** Use configuration-driven state machines for flexibility
- **Server-side branding logic:** CSS variables enable runtime theme switching without API calls
- **Creating separate admin component library:** Reuse B2B components (Card, Button, Modal, etc.)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Invite code generation | Custom random string generator | Existing pattern: `ELAN-${section}-${section}-${section}` format with uppercase, dashes every 4 chars | Already implemented in Phase 2, proven format |
| Data tables with sort/filter | Custom table component | DataTable wrapper (`/src/components/b2b/tables/DataTable.tsx`) | Already supports sorting, filtering, pagination, search |
| Charts for monitoring | Custom SVG charts | Recharts (`AreaChart`, `BarChart`, `LineChart`) | Already used in revenue/usage pages, proven responsive |
| State machines | Custom workflow logic | Configuration object pattern from `journey-workflow.ts` | Declarative, permission-aware, proven in governance |
| Audit event structure | Custom logging format | Existing `AuditEvent` type | Immutable, append-only, already integrated with IAuditService |
| Permission checks | Inline if/else | `useCan()` hook | Centralized, tested, consistent across B2C/B2B/Admin |
| Form validation | Custom validators | Zod schemas | Type-safe, already used in project |

**Key insight:** This phase extends existing infrastructure. The heavy lifting (RBAC, services, components, charts) is done. Admin pages follow proven B2B patterns with different data sources.

## Common Pitfalls

### Pitfall 1: Over-engineering Approval Routing
**What goes wrong:** Building a visual drag-and-drop approval chain builder for v1 when configuration suffices
**Why it happens:** "Multi-level approval routing" sounds complex, temptation to build complex UI
**How to avoid:** Start with configuration-driven state machine (like `journey-workflow.ts`). Approval chains are just state transitions with role-based permission checks. UI can display configured chains read-only; editing via JSON config is acceptable for v1.
**Warning signs:** Spending days on drag-and-drop chain builder when no institutions exist yet in mock data

### Pitfall 2: Real-Time Monitoring Complexity
**What goes wrong:** Attempting to build real monitoring with WebSockets, live metrics, complex alerting
**Why it happens:** "System health monitoring" sounds like production observability (Grafana, Datadog)
**How to avoid:** Mock system health data (uptime %, error count, performance metrics) in localStorage. Charts show mock trends. No real monitoring needed for v1—this is UI demonstration only.
**Warning signs:** Researching Prometheus, setting up monitoring endpoints, building alert systems
**Reference:** Per [Monitoring Dashboards Best Practices](https://infraon.io/blog/effective-monitoring-dashboards/), focus on key metrics that matter; avoid overwhelming with data

### Pitfall 3: Institutional Branding Premature Optimization
**What goes wrong:** Building complex white-label system with per-institution asset bundles, dynamic imports, theme compilation
**Why it happens:** "Institutional branding controls" sounds like full white-label SaaS platform
**How to avoid:** CSS variables for colors/fonts, simple theme object per institution. No build-time customization needed for v1. Store theme config in Institution entity, apply at runtime.
**Warning signs:** Setting up webpack configurations for multi-tenant builds, researching Module Federation
**Reference:** Per [White-labeling React apps](https://krasimirtsonev.com/blog/article/whitelabel-react-apps), runtime configuration simpler than compile-time

### Pitfall 4: Audit Log Performance Assumptions
**What goes wrong:** Building complex audit log indexing, pagination backend, search optimization for mock localStorage data
**Why it happens:** "Platform-wide audit logs" sounds like enterprise-scale log aggregation
**How to avoid:** With localStorage mocks, simple array filter is fine. TanStack Table handles sorting/filtering. No database queries to optimize. Real backend (future) will handle indexing.
**Warning signs:** Building custom pagination logic when DataTable already provides it
**Reference:** Per [ra-audit-log](https://react-admin-ee.marmelab.com/documentation/ra-audit-log), event logs recommended server-side but client-side filtering works for development

### Pitfall 5: Super Admin Permission Bypassing RBAC
**What goes wrong:** Hard-coding Super Admin to bypass all permission checks, creating maintenance burden
**Why it happens:** "Super Admin has full platform access" sounds like special case outside RBAC
**How to avoid:** Super Admin is a role with explicit permissions in permission matrices. Grant all permissions in `ADMIN_PERMISSIONS` matrix. Use same `useCan()` hook—no special cases.
**Warning signs:** Adding `if (role === 'SuperAdmin') return true;` bypass logic in permission checks

## Code Examples

Verified patterns from official sources and existing codebase:

### Invite Code Management UI
```typescript
// Invite code generation modal (follows existing Modal pattern)
'use client';

import { useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { useServices } from '@/lib/hooks/useServices';
import { InviteType, UserRoles } from '@/lib/types';

export function GenerateInviteModal({ open, onOpenChange }) {
  const [inviteType, setInviteType] = useState<InviteType>('b2c');
  const [maxUses, setMaxUses] = useState(1);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const services = useServices();

  const handleGenerate = async () => {
    const assignedRoles: UserRoles = inviteType === 'b2c'
      ? { b2c: 'UHNI' }
      : inviteType === 'b2b'
      ? { b2b: 'RelationshipManager' }
      : { admin: 'SuperAdmin' };

    await services.inviteCode.createInviteCode({
      type: inviteType,
      assignedRoles,
      maxUses,
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
    });

    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Generate Invite Code">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-sans text-slate-700 mb-2">Invite Type</label>
          <select value={inviteType} onChange={(e) => setInviteType(e.target.value as InviteType)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md">
            <option value="b2c">B2C (UHNI)</option>
            <option value="b2b">B2B (Institution)</option>
            <option value="admin">Admin (Super Admin)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-sans text-slate-700 mb-2">Max Uses</label>
          <input type="number" value={maxUses} onChange={(e) => setMaxUses(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-sans text-slate-700 mb-2">Expires In (days)</label>
          <input type="number" value={expiresInDays} onChange={(e) => setExpiresInDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-md" />
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleGenerate}>Generate Code</Button>
        </div>
      </div>
    </Modal>
  );
}
```

### System Health Monitoring Card
```typescript
// System health summary card (follows existing Card + stats pattern)
import { Card } from '@/components/shared/Card';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SystemHealthProps {
  uptime: number;      // percentage 0-100
  errorRate: number;   // percentage 0-100
  avgResponseTime: number; // milliseconds
}

export function SystemHealthCard({ uptime, errorRate, avgResponseTime }: SystemHealthProps) {
  const isHealthy = uptime >= 99.9 && errorRate < 0.1 && avgResponseTime < 200;
  const isWarning = uptime >= 99.0 && errorRate < 1.0 && avgResponseTime < 500;

  return (
    <Card className="bg-gradient-to-br from-white to-teal-50">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-sans text-slate-600">System Health</p>
          <div className="flex items-center gap-2">
            {isHealthy ? (
              <CheckCircle className="w-8 h-8 text-teal-600" />
            ) : isWarning ? (
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-600" />
            )}
            <span className="text-2xl font-serif text-slate-900">
              {isHealthy ? 'Healthy' : isWarning ? 'Degraded' : 'Critical'}
            </span>
          </div>
          <div className="text-xs font-sans text-slate-500 space-y-1">
            <p>Uptime: {uptime.toFixed(2)}%</p>
            <p>Error Rate: {errorRate.toFixed(2)}%</p>
            <p>Avg Response: {avgResponseTime}ms</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

### Configurable Approval Routing
```typescript
// Multi-level approval routing configuration (extends journey-workflow pattern)
import { JourneyStatus } from '@/lib/types/entities';
import { Permission, Resource } from '@/lib/types/permissions';
import { Role } from '@/lib/types/roles';

interface ApprovalStep {
  role: Role;
  requiredPermission: { action: Permission; resource: Resource };
  label: string;
  required: boolean; // If false, step is optional
}

interface ApprovalChain {
  id: string;
  name: string;
  resourceType: Resource;
  steps: ApprovalStep[];
  active: boolean;
}

// Example: Configurable approval chains per institution
const APPROVAL_CHAINS: ApprovalChain[] = [
  {
    id: 'standard-journey',
    name: 'Standard Journey Approval',
    resourceType: 'journey',
    steps: [
      {
        role: 'RelationshipManager',
        requiredPermission: { action: Permission.WRITE, resource: 'journey' },
        label: 'RM Review',
        required: true,
      },
      {
        role: 'ComplianceOfficer',
        requiredPermission: { action: Permission.APPROVE, resource: 'journey' },
        label: 'Compliance Approval',
        required: true,
      },
    ],
    active: true,
  },
];

// Get approval chain for a resource
export function getApprovalChain(resourceType: Resource, institutionId: string): ApprovalChain | null {
  // In real implementation, filter by institutionId
  return APPROVAL_CHAINS.find(chain => chain.resourceType === resourceType && chain.active) || null;
}
```

### Institutional Branding Theme Application
```typescript
// Runtime theme switching for institutional branding (GVRN-06)
interface BrandingTheme {
  institutionId: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  logo?: string;
}

const DEFAULT_THEME: BrandingTheme = {
  institutionId: 'default',
  colors: {
    primary: '#9f1239', // rose-800
    secondary: '#0f766e', // teal-700
    accent: '#ca8a04',  // gold-600
  },
  typography: {
    headingFont: '"Miller Display", serif',
    bodyFont: '"Avenir LT Std", sans-serif',
  },
};

export function applyInstitutionalTheme(theme: BrandingTheme = DEFAULT_THEME) {
  const root = document.documentElement;

  // Apply color tokens
  root.style.setProperty('--color-brand-primary', theme.colors.primary);
  root.style.setProperty('--color-brand-secondary', theme.colors.secondary);
  root.style.setProperty('--color-brand-accent', theme.colors.accent);

  // Apply typography
  root.style.setProperty('--font-heading', theme.typography.headingFont);
  root.style.setProperty('--font-body', theme.typography.bodyFont);

  // Store active theme in localStorage for persistence
  localStorage.setItem('activeInstitutionTheme', JSON.stringify(theme));
}

// Load theme on app initialization
export function loadInstitutionalTheme(institutionId: string) {
  // Fetch theme from institution service
  // For mock: retrieve from localStorage or use default
  const savedTheme = localStorage.getItem('activeInstitutionTheme');
  if (savedTheme) {
    const theme = JSON.parse(savedTheme) as BrandingTheme;
    if (theme.institutionId === institutionId) {
      applyInstitutionalTheme(theme);
      return;
    }
  }
  applyInstitutionalTheme(DEFAULT_THEME);
}
```

### Version History Display
```typescript
// Version history component for governed entities (GVRN-04)
import { JourneyVersion } from '@/lib/types/entities';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryProps {
  versions: JourneyVersion[];
  currentVersionId: string;
  onSelectVersion: (versionId: string) => void;
}

export function VersionHistory({ versions, currentVersionId, onSelectVersion }: VersionHistoryProps) {
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="space-y-3">
      <h3 className="font-serif text-lg text-slate-900">Version History</h3>
      <div className="space-y-2">
        {sortedVersions.map(version => (
          <button
            key={version.id}
            onClick={() => onSelectVersion(version.id)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              version.id === currentVersionId
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-sans text-sm font-medium text-slate-900">
                Version {version.versionNumber}
                {version.id === currentVersionId && (
                  <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-xs">
                    Current
                  </span>
                )}
              </span>
              <span className="text-xs font-sans text-slate-500">
                {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-xs font-sans text-slate-600">
              Modified by: {version.modifiedBy.slice(0, 12)}...
            </p>
            {version.approvedBy && (
              <p className="text-xs font-sans text-teal-600 mt-1">
                ✓ Approved
              </p>
            )}
            {version.rejectedBy && (
              <p className="text-xs font-sans text-rose-600 mt-1">
                ✗ Rejected: {version.rejectionReason}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hard-coded admin panels | Role-based admin with permission matrices | 2024-2025 | Admin access now granular, auditable |
| Real-time monitoring dashboards | Mock health metrics with chart visualization | v1 scope (2026) | Demonstrates UI without infrastructure complexity |
| Build-time white-labeling | Runtime CSS variable theming | 2025-2026 | Simpler deployment, no per-tenant builds needed |
| XState for workflows | Configuration-driven state machines | Project decision | Lighter weight, easier to reason about |
| Custom logging systems | Structured audit events (append-only) | Industry standard | Immutable, GDPR-compliant via anonymization |

**Deprecated/outdated:**
- **Heavy admin frameworks (Active Admin, Django Admin):** Modern SaaS uses custom React dashboards with design system consistency
- **Monolithic approval systems:** Configurable routing via state machines more flexible than hardcoded workflows
- **Server-rendered admin panels:** Client-side React admin with API calls now standard for SaaS platforms
- **Real-time WebSocket dashboards for v1:** Mock data with static charts sufficient for demonstration

## Open Questions

Things that couldn't be fully resolved:

1. **System Health Metrics Sources**
   - What we know: Need uptime %, error rate, avg response time, performance metrics for display
   - What's unclear: Which specific metrics matter most for v1 demonstration (no real backend)
   - Recommendation: Mock 4-6 key metrics (uptime, error rate, response time, active sessions, API calls, storage usage). Use static/trending data patterns similar to revenue/usage metrics.

2. **Approval Chain Complexity**
   - What we know: GVRN-01 requires "configurable approval chains"
   - What's unclear: Should v1 support conditional routing (e.g., high-risk journeys use different chain)?
   - Recommendation: Start with simple chain selection by resource type. One active chain per resource type per institution. Conditional routing (based on risk, amount, etc.) can be Phase 6+ enhancement.

3. **Institutional Branding Scope**
   - What we know: GVRN-06 requires "custom branding per institution"
   - What's unclear: How deep does branding go? Logo only? Full color scheme? Typography? Component styling?
   - Recommendation: Start with logo, primary/secondary colors, and heading/body fonts. Store in Institution entity as `branding` field. Apply via CSS variables. Component shapes/layouts stay consistent across institutions.

4. **Audit Log Retention**
   - What we know: Append-only audit trail, GDPR via anonymization
   - What's unclear: Should admin be able to purge old audit logs, or truly immutable forever?
   - Recommendation: Display all logs in admin view (no purge function). "Anonymize user" function replaces userId with "ERASED-{timestamp}" across all audit events. True deletion deferred to real backend with compliance controls.

## Sources

### Primary (HIGH confidence)
- Existing codebase patterns:
  - `/src/app/(b2b)/clients/page.tsx` - Admin list page pattern
  - `/src/components/b2b/tables/DataTable.tsx` - TanStack Table wrapper
  - `/src/components/b2b/revenue/UsageMetrics.tsx` - Recharts chart patterns
  - `/src/lib/state-machines/journey-workflow.ts` - Configuration-driven state machine
  - `/src/lib/rbac/permissions.ts` - Permission matrix implementation
  - `/src/lib/types/entities.ts` - All entity types including InviteCode, Institution, AuditEvent
- Project documentation:
  - `/Users/kavi/Baarez-Projects/E-Glimmora/.planning/REQUIREMENTS.md` - ADMN-01 through ADMN-09, GVRN-01 through GVRN-06
  - `/Users/kavi/Baarez-Projects/E-Glimmora/.planning/ROADMAP.md` - Phase 5 scope and dependencies

### Secondary (MEDIUM confidence)
- [Admin Dashboard: Ultimate Guide, Templates & Examples (2026)](https://www.weweb.io/blog/admin-dashboard-ultimate-guide-templates-examples) - Admin dashboard best practices
- [Security Dashboards Explained with Key Features for 2026](https://www.fanruan.com/en/blog/security-dashboard-key-features-real-time-monitoring) - Real-time monitoring and security dashboard patterns
- [Monitoring Dashboards: How to Build Effective, Real-Time Insights](https://infraon.io/blog/effective-monitoring-dashboards/) - Dashboard design and key metrics selection
- [SaaS Multitenancy: Components, Pros and Cons and 5 Best Practices](https://frontegg.com/blog/saas-multitenancy) - Multi-tenant architecture best practices
- [The developer's guide to SaaS multi-tenant architecture — WorkOS](https://workos.com/blog/developers-guide-saas-multi-tenant-architecture) - Tenant isolation, IAM, resource management
- [Multi-Tenant SaaS Explained: Architecture, Benefits, and Best Practices](https://medium.com/@pawannanaware3115/multi-tenant-saas-explained-architecture-benefits-and-best-practices-4cb77a064286) - 2026 multi-tenant trends
- [Audit Trail: Tracking User Activity with React & .NET Core](https://elanchezhiyan-p.medium.com/audit-trail-tracking-user-activity-with-react-net-core-59204a07aa65) - Audit logging implementation patterns
- [ra-audit-log documentation | React-Admin Enterprise Edition](https://react-admin-ee.marmelab.com/documentation/ra-audit-log) - Audit event schema and server-side recommendations
- [White-labeling React apps](https://krasimirtsonev.com/blog/article/whitelabel-react-apps) - Runtime vs compile-time theming approaches
- [Building a White Label App: Pros and Cons in 2026](https://relevant.software/blog/building-white-label-app-architecture/) - White-label market trends and implementation
- [White Label React with Material UI ThemeProvider](https://flatirons.com/blog/white-label-react-material-u/) - Theme nesting and brand-specific properties

### Tertiary (LOW confidence)
- General web searches on invite code management, system monitoring—no specific authoritative sources found; relied on existing codebase patterns instead

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use, proven in B2B phase
- Architecture: HIGH - Patterns directly from existing B2B implementation
- Pitfalls: HIGH - Based on common anti-patterns in admin panel development + prior decisions document
- Code examples: HIGH - Adapted from existing codebase files
- Governance infrastructure: MEDIUM - GVRN requirements new, but patterns (state machines, versioning) exist in codebase
- System monitoring specifics: MEDIUM - Mock approach clear, but specific metrics choices somewhat subjective

**Research date:** 2026-02-16
**Valid until:** 60 days (stable domain, existing patterns well-established in project)
