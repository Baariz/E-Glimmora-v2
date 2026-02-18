# Phase 4: B2B Institutional Portal - Research

**Researched:** 2026-02-16
**Domain:** B2B institutional dashboards, relationship management portals, compliance workflows
**Confidence:** HIGH

## Summary

Phase 4 builds the institutional-grade B2B portal for relationship managers, compliance officers, and institutional admins to manage multiple UHNI clients. This is NOT greenfield—Phase 1-3 already built the foundation, auth, RBAC, service abstraction layer, and B2C experience. Phase 4 adds B2B-specific dashboard views, data tables, governance workflows, and operational tools on top of existing infrastructure.

The standard approach for enterprise B2B dashboards in 2026 emphasizes role-based UI customization, progressive disclosure for complex features, data-dense layouts optimized for operational efficiency, and state machine-driven approval workflows. Modern institutional portals use headless UI libraries (Radix, TanStack Table) for full design control, Recharts for data visualization, and React Query for optimistic updates.

**Primary recommendation:** Build on existing infrastructure (service layer, RBAC, design system) with TanStack Table for data grids, finite state machines for compliance workflows, localStorage for v1 persistence (matching existing pattern), and Recharts for dashboards. Leverage existing Card, Button, Modal primitives while adding B2B-specific components (DataTable, StateWorkflow, HeatMap).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TanStack Table | v8.20+ | Headless data table | Industry standard for React tables—headless, performant, feature-complete (sorting, filtering, pagination, column visibility). 15KB size, tree-shakeable. [Source](https://tanstack.com/table/latest) |
| Recharts | v2.13.0+ | Data visualization | Already installed. Declarative, React-native API, perfect for low-density dashboards (<100 data points). Composable chart components. [Source](https://www.syncfusion.com/blogs/post/top-5-react-chart-libraries) |
| React Hook Form | v7.53.0 | Form state management | Already installed. Performant, minimal re-renders, integrates with Zod for validation. Standard for enterprise forms. [Source](https://fygs.dev/en/blog/mastering-form-management-nextjs) |
| Zod | v3.23.0 | Schema validation | Already installed. TypeScript-first validation for forms and API responses. [Source](https://react-hook-form.com/advanced-usage/) |
| date-fns | v4.1.0 | Date manipulation | Already installed. Lightweight, tree-shakeable date utilities for timeline features. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Radix UI primitives | v1.2.0+ | Accessible UI components | Already have @radix-ui/react-dialog, accordion, tabs, etc. Use for new B2B components (Popover, ContextMenu, Separator). |
| Sonner | v1.5+ | Toast notifications | Lightweight (2-3KB), modern, non-intrusive feedback for B2B actions. Integrates with shadcn patterns. [Source](https://medium.com/@rivainasution/shadcn-ui-react-series-part-19-sonner-modern-toast-notifications-done-right-903757c5681f) |
| clsx + tailwind-merge | Already installed | Conditional styling | Already using cn() utility. Continue pattern for B2B components. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TanStack Table | AG Grid React | AG Grid offers more out-of-box features but 200KB+ size, requires commercial license for enterprise features, conflicts with headless design system approach. TanStack better for custom design control. |
| localStorage | IndexedDB | IndexedDB handles >5MB data and complex queries better, but adds complexity. localStorage (5-10MB limit) sufficient for v1 mock data. [Source](https://medium.com/@sriweb/indexeddb-vs-localstorage-when-and-why-to-use-indexeddb-for-data-storage-in-web-applications-93a8a5a39eef) Upgrade to IndexedDB if data exceeds limits. |
| Recharts | Tremor | Tremor is pre-styled chart library built on Recharts + Radix + Tailwind. Faster setup but less design control. Current design system already uses custom-styled Radix primitives, so stick with Recharts for consistency. |
| React Hook Form | Formik | Formik more verbose, worse performance. React Hook Form is current standard for 2026. |

**Installation:**
```bash
npm install @tanstack/react-table sonner
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/(b2b)/                 # B2B route group (already exists)
│   ├── portfolio/             # Portfolio dashboard (exists as placeholder)
│   ├── clients/               # Client management
│   ├── journeys/              # Journey lifecycle management
│   ├── risk/                  # Risk analytics
│   ├── vault/                 # Governed memory vault
│   ├── access/                # Access & permissions management
│   └── revenue/               # Revenue & contracts
├── components/
│   ├── b2b/                   # B2B-specific components
│   │   ├── tables/            # DataTable, FilterBar, ColumnConfig
│   │   ├── workflows/         # StateWorkflow, ApprovalPanel, VersionDiff
│   │   ├── charts/            # PortfolioHeatMap, RiskGauge, RevenueChart
│   │   ├── forms/             # ClientForm, JourneySimulator
│   │   └── layouts/           # DashboardGrid, StatsRow
│   └── shared/                # Already exists - continue using
├── lib/
│   ├── services/              # Already exists - add B2B mock services
│   │   ├── interfaces/        # IClientService, IRiskService (some exist)
│   │   └── mock/              # MockClientService, etc.
│   ├── rbac/                  # Already exists - use existing permission checks
│   ├── hooks/                 # Add useTable, useWorkflow
│   └── state-machines/        # Journey approval state machine
└── types/                     # Add B2B-specific types (ClientRecord, etc.)
```

### Pattern 1: Headless Data Tables with TanStack Table
**What:** Use TanStack Table for all data grids (client lists, journey pipeline, audit logs). Provides state management and logic without imposing UI.

**When to use:** Any tabular data with sorting, filtering, pagination, or column customization needs.

**Example:**
```typescript
// Source: https://tanstack.com/table/latest/docs/framework/react/examples/basic
import { useReactTable, getCoreRowModel, getSortedRowModel,
         getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table'

function ClientTable({ clients }: { clients: ClientRecord[] }) {
  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Client Name' },
    { accessorKey: 'status', header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { accessorKey: 'riskCategory', header: 'Risk',
      cell: ({ getValue }) => <RiskIndicator level={getValue()} /> },
  ], [])

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Card>
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination table={table} />
    </Card>
  )
}
```

### Pattern 2: Finite State Machine for Compliance Workflows
**What:** Use explicit state machine for journey approval workflow (DRAFT → RM_REVIEW → COMPLIANCE_REVIEW → APPROVED). Encapsulates valid transitions, permissions, and history.

**When to use:** Any stateful workflow with approvals, rejections, and audit trails (journey approvals, client onboarding, risk assessments).

**Example:**
```typescript
// State machine definition
type JourneyState = 'DRAFT' | 'RM_REVIEW' | 'COMPLIANCE_REVIEW' | 'APPROVED' | 'PRESENTED'
type JourneyEvent =
  | { type: 'SUBMIT_FOR_REVIEW' }
  | { type: 'REQUEST_CHANGES', reason: string }
  | { type: 'APPROVE' }
  | { type: 'REJECT', reason: string }

const journeyStateMachine = {
  DRAFT: {
    SUBMIT_FOR_REVIEW: { next: 'RM_REVIEW', permission: Permission.WRITE }
  },
  RM_REVIEW: {
    APPROVE: { next: 'COMPLIANCE_REVIEW', permission: Permission.WRITE },
    REQUEST_CHANGES: { next: 'DRAFT', permission: Permission.WRITE }
  },
  COMPLIANCE_REVIEW: {
    APPROVE: { next: 'APPROVED', permission: Permission.APPROVE },
    REJECT: { next: 'DRAFT', permission: Permission.APPROVE }
  },
  APPROVED: {
    PRESENT: { next: 'PRESENTED', permission: Permission.WRITE }
  }
}

// Hook for state management
function useJourneyWorkflow(journey: Journey, user: User) {
  const transition = (event: JourneyEvent) => {
    const currentState = journey.status
    const transition = journeyStateMachine[currentState][event.type]

    if (!transition) throw new Error('Invalid transition')
    if (!hasPermission(user.role, transition.permission, 'journey', 'b2b')) {
      throw new Error('Permission denied')
    }

    // Create new version with state transition
    const newVersion = createJourneyVersion({
      ...journey,
      status: transition.next,
      modifiedBy: user.id,
      ...(event.type === 'REJECT' && { rejectionReason: event.reason })
    })

    return services.journey.updateStatus(journey.id, newVersion)
  }

  const availableActions = Object.keys(journeyStateMachine[journey.status] || {})
  return { transition, availableActions }
}
```

### Pattern 3: Role-Based Dashboard Composition
**What:** Different roles see different dashboard widgets and metrics. Use permission system to conditionally render sections.

**When to use:** Multi-role dashboards where each role has different operational needs (RM sees client portfolio, Compliance sees approval queue, Admin sees licenses).

**Example:**
```typescript
// Dashboard component with role-based sections
function PortfolioDashboard() {
  const { user } = useAuth()
  const { hasPermission } = usePermission()

  return (
    <div className="space-y-6">
      {/* All B2B roles see stats row */}
      <StatsRow metrics={getMetricsForRole(user.role)} />

      {/* RM & Private Banker see client heat map */}
      {hasPermission('client', Permission.READ) && (
        <Card header="Portfolio Risk Heat Map">
          <ClientRiskHeatMap />
        </Card>
      )}

      {/* Compliance Officer sees approval queue */}
      {hasPermission('journey', Permission.APPROVE) && (
        <Card header="Pending Approvals">
          <ApprovalQueue />
        </Card>
      )}

      {/* Institutional Admin sees license tracking */}
      {hasPermission('institution', Permission.CONFIGURE) && (
        <Card header="License Utilization">
          <LicenseTracker />
        </Card>
      )}
    </div>
  )
}
```

### Pattern 4: Service Abstraction for B2B Operations
**What:** Extend existing service pattern with B2B-specific mock services (ClientService, RiskService, ContractService).

**When to use:** All data operations. Maintains consistency with existing Phase 1-3 pattern.

**Example:**
```typescript
// Interface definition
interface IClientService {
  getClientsByRM(rmId: string): Promise<ClientRecord[]>
  createClient(data: CreateClientDTO): Promise<ClientRecord>
  assignAdvisor(clientId: string, advisorId: string): Promise<void>
  getClientHistory(clientId: string): Promise<AuditEvent[]>
}

// Mock implementation (matches existing BaseMockService pattern)
class MockClientService extends BaseMockService implements IClientService {
  private storageKey = 'clients'

  async getClientsByRM(rmId: string): Promise<ClientRecord[]> {
    await this.delay()
    const clients = this.getFromStorage<ClientRecord>(this.storageKey)
    return clients.filter(c => c.assignedRM === rmId)
  }

  async createClient(data: CreateClientDTO): Promise<ClientRecord> {
    await this.delay()
    const clients = this.getFromStorage<ClientRecord>(this.storageKey)
    const newClient = {
      id: this.generateId(),
      ...data,
      createdAt: this.now(),
      updatedAt: this.now()
    }
    this.setInStorage(this.storageKey, [...clients, newClient])
    return newClient
  }
}

// Hook usage (matches existing useServices pattern)
function ClientList() {
  const services = useServices() // Extended to include client service
  const [clients, setClients] = useState<ClientRecord[]>([])

  useEffect(() => {
    services.client.getClientsByRM(currentUser.id).then(setClients)
  }, [])
}
```

### Anti-Patterns to Avoid

- **Don't bypass RBAC checks client-side**: Always check permissions using `hasPermission()` before rendering actions or sections. Client-side checks are UX optimization, not security (server must validate).

- **Don't put business logic in components**: State machines, workflow rules, and data transformations belong in services or hooks, not JSX. Keep components presentational.

- **Don't create multiple table implementations**: Standardize on one DataTable component with TanStack Table. Customize via columns prop, not by creating new table components.

- **Don't manually manage form state**: Use React Hook Form for all forms, even simple ones. Consistency and performance matter at scale.

- **Don't hardcode state transitions**: Use state machine configuration. Hardcoded transitions make workflow changes require component edits instead of config changes.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Data table with sorting/filtering | Custom table with useState for sort/filter | TanStack Table | Sorting, filtering, pagination, column visibility, row selection all require complex state management. TanStack handles edge cases like multi-sort, column pinning, virtualization. |
| Toast notifications | Custom absolute-positioned divs with timers | Sonner | Proper stacking, keyboard navigation, screen reader support, queue management, animation timing are non-trivial. Sonner is 3KB and battle-tested. |
| Form validation | Custom validation functions | React Hook Form + Zod | Field-level validation, async validation, error messages, touched/dirty state, submission handling all have edge cases. RHF is industry standard. |
| Date formatting/manipulation | Custom string parsing | date-fns | Time zones, locales, edge cases (leap years, DST) are complex. date-fns is tree-shakeable and already installed. |
| Heat map visualization | Canvas-based custom heat map | Recharts ScatterChart or dedicated library | Color scaling, tooltips, legends, responsiveness require significant effort. Recharts provides composable primitives. |
| State machine workflow | Switch statements in event handlers | Explicit state machine config | Validation, history, rollback, permission checks per transition become spaghetti code. Config-driven machines are testable and auditable. |
| CSV export | Manual string concatenation | Library like papaparse or csv-stringify | Quote escaping, newline handling, encoding, special characters all have edge cases. Don't hand-roll CSV generation. |

**Key insight:** B2B dashboards have higher complexity than B2C flows. Data tables, workflows, and export features all have dozens of edge cases. Use battle-tested libraries to avoid reinventing solutions to solved problems.

## Common Pitfalls

### Pitfall 1: Performance Degradation with Large Data Sets
**What goes wrong:** Rendering 500+ table rows or complex charts causes lag and freezing.

**Why it happens:** React re-renders entire component trees on state changes. Recharts renders all SVG nodes (5,000 data points = 5,000 DOM nodes = browser freeze).

**How to avoid:**
- Use TanStack Table's pagination (limit to 25-50 rows per page)
- Memoize chart data with `useMemo`
- Keep Recharts charts to <100 data points (aggregate for overview dashboards)
- Use React Query for server state to avoid unnecessary re-renders
- Consider virtualization for very long lists (react-virtual)

**Warning signs:** Dashboard feels sluggish, scroll lag, CPU spikes in DevTools profiler.

### Pitfall 2: Inconsistent State Between localStorage and UI
**What goes wrong:** User performs action, UI updates, but localStorage write fails (quota exceeded, private browsing). Refresh shows old data.

**Why it happens:** localStorage is synchronous and can throw errors. No transaction support. Current BaseMockService doesn't handle errors.

**How to avoid:**
- Wrap localStorage operations in try/catch in BaseMockService
- Implement optimistic UI with rollback on error (React Query pattern)
- Show toast notification if storage operation fails
- Monitor localStorage quota (`navigator.storage.estimate()`)
- Document localStorage limits in mock service comments

**Warning signs:** User reports "changes disappeared after refresh", console shows QuotaExceededError.

### Pitfall 3: Permission Checks Only on Component Mount
**What goes wrong:** User loads page with RM role, sees RM dashboard. Admin changes user to Compliance role in another tab. Dashboard still shows RM view until refresh.

**Why it happens:** Permission checks happen once in `useEffect(() => {}, [])` and never re-evaluate.

**How to avoid:**
- Re-run permission checks when `user.role` changes: `useEffect(() => {...}, [user.role])`
- Use `usePermission()` hook that subscribes to auth state changes
- For multi-role scenarios, check permissions on every action (not just mount)
- Consider implementing role-switch flow that forces page reload

**Warning signs:** Users report seeing features they shouldn't after role changes.

### Pitfall 4: State Machine Transitions Without Version History
**What goes wrong:** Compliance officer rejects journey with feedback. RM makes changes and resubmits. Compliance officer can't see what changed between versions.

**Why it happens:** Journey status updated in place without creating immutable version history.

**How to avoid:**
- Every state transition creates new JourneyVersion record (already defined in entities.ts)
- Store previous state and new state in version record
- Implement diff view comparing version N to version N-1
- Never mutate journey.status directly—always create new version

**Warning signs:** "What changed?" questions, compliance audit failures, inability to trace approval history.

### Pitfall 5: Mock Data Patterns Not Matching Real API Constraints
**What goes wrong:** Mock service allows creating journey without client assignment. Real API requires clientId. Production breaks.

**Why it happens:** Mock services built for convenience, not API contract adherence.

**How to avoid:**
- Define TypeScript interfaces for all API requests/responses (CreateJourneyDTO, UpdateClientDTO)
- Mock services validate DTOs with Zod schemas before "success"
- Throw errors in mocks that match real API error shapes
- Document required fields and validation rules in interface comments
- Use mock services in tests to catch validation issues early

**Warning signs:** "It worked in dev" bugs, validation errors only in production.

### Pitfall 6: Over-Engineering with XState for Simple Workflows
**What goes wrong:** Developers add XState for journey workflow. Now every form step uses XState. Codebase becomes complex and hard to onboard.

**Why it happens:** Excitement about state machines leads to applying them everywhere.

**How to avoid:**
- Use state machines ONLY for multi-step workflows with approvals/rejections (journey lifecycle, client onboarding)
- Do NOT use for simple forms, modals, or UI state (loading/success/error)
- Use React Hook Form's built-in state for forms
- Use simple useState for modal open/close, tab selection
- Ask: "Does this have multiple actors with different permissions?" If no, don't use state machine

**Warning signs:** Junior developers struggle to understand codebase, PRs have large XState config changes for simple features.

## Code Examples

Verified patterns from official sources:

### Client Data Table with TanStack Table
```typescript
// Based on TanStack Table React example
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Card } from '@/components/shared/Card'

interface ClientRecord {
  id: string
  name: string
  status: 'Active' | 'Pending' | 'Archived'
  assignedRM: string
  riskCategory: RiskCategory
  lastActivity: string
}

function ClientDataTable() {
  const services = useServices()
  const [clients, setClients] = useState<ClientRecord[]>([])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Client Name',
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-slate-900">
          {getValue()}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string
        const colors = {
          Active: 'bg-teal-100 text-teal-800',
          Pending: 'bg-gold-100 text-gold-800',
          Archived: 'bg-slate-100 text-slate-600'
        }
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-sans rounded-full ${colors[status]}`}>
            {status}
          </span>
        )
      }
    },
    {
      accessorKey: 'riskCategory',
      header: 'Risk',
      cell: ({ getValue }) => <RiskBadge level={getValue()} />
    },
    {
      accessorKey: 'lastActivity',
      header: 'Last Activity',
      cell: ({ getValue }) => formatDistanceToNow(new Date(getValue()))
    }
  ], [])

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card header="Client Portfolio">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-sans font-semibold text-slate-600 uppercase tracking-wider"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-slate-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
```

### Journey Approval Workflow Component
```typescript
// Compliance officer approval panel with state machine
function JourneyApprovalPanel({ journey }: { journey: Journey }) {
  const { user } = useAuth()
  const { hasPermission } = usePermission()
  const [rejectionReason, setRejectionReason] = useState('')
  const { transition, availableActions } = useJourneyWorkflow(journey, user)

  const canApprove = hasPermission('journey', Permission.APPROVE)
  const currentVersion = journey.versions.find(v => v.id === journey.currentVersionId)

  const handleApprove = async () => {
    await transition({ type: 'APPROVE' })
    toast.success('Journey approved')
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide rejection reason')
      return
    }
    await transition({ type: 'REJECT', reason: rejectionReason })
    toast.success('Journey rejected with feedback')
  }

  return (
    <Card header="Compliance Review">
      <div className="space-y-4">
        {/* Journey details */}
        <div>
          <h3 className="font-serif text-lg text-rose-900">{journey.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{journey.narrative}</p>
        </div>

        {/* Current state */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans text-slate-500">Status:</span>
          <StateBadge status={journey.status} />
        </div>

        {/* Version history */}
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-sm font-sans font-semibold text-slate-700 mb-2">
            Version History
          </h4>
          <VersionTimeline versions={journey.versions} />
        </div>

        {/* Approval actions - only for compliance officers */}
        {canApprove && journey.status === 'COMPLIANCE_REVIEW' && (
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div>
              <label className="block text-sm font-sans font-medium text-slate-700 mb-2">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                rows={3}
                placeholder="Provide feedback for improvements..."
              />
            </div>
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleApprove}>
                Approve Journey
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject & Request Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
```

### Portfolio Heat Map with Recharts
```typescript
// Risk heat map showing client portfolio risk distribution
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts'

interface HeatMapData {
  x: number // Client index
  y: number // Risk score 0-100
  value: number // Risk category numeric
  clientName: string
  riskCategory: RiskCategory
}

function PortfolioRiskHeatMap({ clients }: { clients: ClientRecord[] }) {
  const data: HeatMapData[] = clients.map((client, idx) => ({
    x: idx,
    y: client.riskScore,
    value: riskCategoryToNumeric(client.riskCategory),
    clientName: client.name,
    riskCategory: client.riskCategory
  }))

  const colorScale = {
    Low: '#5e6b4a',      // olive
    Medium: '#b5a24c',   // gold
    High: '#b5877e',     // rose
    Critical: '#dc2626'  // red
  }

  return (
    <Card header="Portfolio Risk Distribution">
      <ScatterChart width={800} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type="number" dataKey="x" name="Client" hide />
        <YAxis type="number" dataKey="y" name="Risk Score" domain={[0, 100]} />
        <ZAxis type="number" dataKey="value" range={[100, 400]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ payload }) => {
            if (!payload?.[0]) return null
            const data = payload[0].payload as HeatMapData
            return (
              <div className="bg-white p-3 border border-slate-200 rounded shadow-lg">
                <p className="font-sans font-medium text-slate-900">{data.clientName}</p>
                <p className="text-sm text-slate-600">Risk: {data.riskCategory}</p>
                <p className="text-sm text-slate-600">Score: {data.y}</p>
              </div>
            )
          }}
        />
        <Scatter data={data}>
          {data.map((entry, index) => (
            <Cell key={index} fill={colorScale[entry.riskCategory]} />
          ))}
        </Scatter>
      </ScatterChart>
    </Card>
  )
}
```

### Toast Notifications with Sonner
```typescript
// Installation: npm install sonner
// Add to root layout
import { Toaster } from 'sonner'

export default function B2BLayout({ children }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  )
}

// Usage in components
import { toast } from 'sonner'

function ClientForm() {
  const handleSubmit = async (data) => {
    const promise = services.client.createClient(data)

    toast.promise(promise, {
      loading: 'Creating client...',
      success: 'Client created successfully',
      error: 'Failed to create client'
    })
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom table components with manual state | TanStack Table (headless) | 2022-2023 | Industry standardized on headless table libraries for design control. TanStack became React standard (formerly React Table). |
| Component libraries (MUI, Ant Design) for B2B dashboards | Headless primitives (Radix) + Tailwind | 2023-2024 | Shift from opinionated component libraries to headless + utility CSS for design system flexibility. |
| localStorage API directly in components | Service abstraction layer | Phase 1 (this project) | Existing codebase already uses BaseMockService pattern. Continue for consistency. |
| Switch statements for workflow logic | State machine configuration | 2024-2025 | Explicit state machines improve testability, auditability, and make workflow changes config-driven. |
| Recharts v1 | Recharts v2 | 2023 | v2 added better TypeScript support, improved performance, tree-shaking. Use v2.13+. |
| react-hot-toast | Sonner | 2024-2025 | Sonner became preferred for modern React apps (smaller, better UX, shadcn integration). |
| Manual form state (useState) | React Hook Form + Zod | 2023-2024 | RHF + Zod is current standard for type-safe forms with minimal re-renders. |

**Deprecated/outdated:**
- **React Table v7**: Renamed to TanStack Table, v8+ is current. Use @tanstack/react-table.
- **Formik**: Still works but React Hook Form is now standard (better performance, smaller bundle).
- **Custom CSV export**: Use libraries (papaparse, csv-stringify) to avoid edge case bugs.
- **XState for everything**: Only use for complex multi-actor workflows. Overuse adds complexity.

## Open Questions

Things that couldn't be fully resolved:

1. **Heat map visualization approach**
   - What we know: Recharts doesn't have native heat map component. Can use ScatterChart with colored cells or custom SVG overlay.
   - What's unclear: Whether custom heat map or third-party library (react-heatmap-grid) is better for client risk visualization.
   - Recommendation: Start with Recharts ScatterChart for consistency. If inadequate, evaluate react-heatmap-grid (4KB) or canvas-based solution.

2. **localStorage quota handling strategy**
   - What we know: localStorage limit is 5-10MB. Current BaseMockService doesn't handle quota errors. Mock data for 200+ clients + journeys + versions could exceed limit.
   - What's unclear: Whether to proactively migrate to IndexedDB now or handle quota errors gracefully and migrate later.
   - Recommendation: Add try/catch + quota monitoring to BaseMockService. If quota exceeded in testing, migrate to IndexedDB. Don't premature optimize.

3. **State machine library choice**
   - What we know: XState is powerful but has steep learning curve. Simple config-based state machines can be hand-rolled with TypeScript.
   - What's unclear: Whether to add XState dependency for journey workflow or use simpler custom state machine.
   - Recommendation: Start with custom state machine config (see Pattern 2). Journey workflow has ~5 states and clear transitions. XState adds 30KB+ and complexity. Only add if workflows become significantly more complex (parallel states, nested states).

4. **Real-time collaboration for multi-RM scenarios**
   - What we know: Multiple RMs might work on same client. localStorage is per-browser, no sync.
   - What's unclear: Whether v1 needs optimistic concurrency control or "last write wins" is acceptable.
   - Recommendation: For v1 mock services, use "last write wins" (simple). Document that real API will need version numbers or timestamps for optimistic locking. Add warning toast if localStorage write happens after long idle (suggests stale data).

## Sources

### Primary (HIGH confidence)
- [TanStack Table Documentation](https://tanstack.com/table/latest) - Official docs for React table API, examples, patterns
- [Recharts Documentation](https://recharts.org) - Official chart library docs
- [React Hook Form Documentation](https://react-hook-form.com/) - Official form library docs
- [Radix UI Primitives](https://www.radix-ui.com/primitives) - Headless UI component library

### Secondary (MEDIUM confidence)
- [Top 5 React Chart Libraries 2026 - Syncfusion](https://www.syncfusion.com/blogs/post/top-5-react-chart-libraries) - Recharts comparison and best practices
- [TanStack Table Guide - Contentful](https://www.contentful.com/blog/tanstack-table-react-table/) - Comprehensive TanStack Table patterns
- [Mastering Form Management in Next.js - FYGS](https://fygs.dev/en/blog/mastering-form-management-nextjs) - Enterprise form patterns with RHF
- [Dashboard Design Principles 2026 - DesignRush](https://www.designrush.com/agency/ui-ux-design/dashboard/trends/dashboard-design-principles) - B2B dashboard UX patterns
- [B2B SaaS UX Design 2026 - Onething Design](https://www.onething.design/post/b2b-saas-ux-design) - Role-based UI patterns
- [Sonner Toast Notifications - Shadcn/ui](https://medium.com/@rivainasution/shadcn-ui-react-series-part-19-sonner-modern-toast-notifications-done-right-903757c5681f) - Modern toast patterns
- [CRM Dashboards 2026 - Monday.com](https://monday.com/blog/crm-and-sales/crm-dashboards/) - Relationship manager portal patterns

### Secondary (MEDIUM confidence) - State Machines & Compliance
- [Compliance Workflow Best Practices - FlowForma](https://www.flowforma.com/blog/business-process-compliance) - State machine workflow patterns
- [Compliance Workflow Automation - Lucinity](https://lucinity.com/blog/transforming-compliance-operations-with-workflow-automation-software) - Approval workflow architecture
- [XState Documentation](https://stately.ai/docs/xstate) - State machine library reference

### Tertiary (LOW confidence)
- [localStorage vs IndexedDB - Medium](https://medium.com/@sriweb/indexeddb-vs-localstorage-when-and-why-to-use-indexeddb-for-data-storage-in-web-applications-93a8a5a39eef) - Storage comparison (not project-specific)
- [React RBAC Patterns - Permit.io](https://www.permit.io/blog/implementing-react-rbac-authorization) - General RBAC guidance (not institutional portal specific)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified with official docs (TanStack Table, Recharts, RHF, Radix already installed or industry standard)
- Architecture: HIGH - Patterns match existing codebase structure (service layer, RBAC, hooks) and verified with official TanStack/Recharts examples
- Pitfalls: HIGH - Based on documented localStorage limits, state machine anti-patterns, and React performance best practices

**Research date:** 2026-02-16
**Valid until:** ~30 days (stable domain - libraries and patterns unlikely to change rapidly, but verify TanStack Table version on implementation)
