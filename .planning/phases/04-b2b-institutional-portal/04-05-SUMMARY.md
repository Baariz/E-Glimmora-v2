---
phase: 04-b2b-institutional-portal
plan: 05
subsystem: b2b-portal
tags: [revenue, contracts, licensing, sla, rbac, role-enforcement, recharts, tanstack-table]

# Dependency graph
requires:
  - phase: 04-01
    provides: DataTable component, StatsRow component, StatusBadge component, B2B layout
  - phase: 01-05
    provides: Permission matrices for all 6 B2B roles, hasPermission function
provides:
  - Revenue & Contracts section with 5 sub-modules (licenses, billing, SLA, usage, renewals)
  - MockContractService extended with usage metrics and SLA tracking methods
  - B2B role enforcement infrastructure (route guards, dynamic sidebar)
  - Complete RBAC implementation across all B2B portal pages
affects: [future-b2b-portal-features, contract-management, billing-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Role-based route access control with canAccessB2BRoute"
    - "Dynamic sidebar navigation filtered per role permissions"
    - "Permission-gated page sections with useCan hook"
    - "Multi-chart revenue dashboard with Recharts"

key-files:
  created:
    - src/app/(b2b)/revenue/page.tsx
    - src/components/b2b/revenue/LicenseTracker.tsx
    - src/components/b2b/revenue/BillingOverview.tsx
    - src/components/b2b/revenue/SLAMonitor.tsx
    - src/components/b2b/revenue/UsageMetrics.tsx
    - src/components/b2b/revenue/ContractRenewals.tsx
    - src/lib/rbac/b2b-role-guards.tsx
    - src/components/b2b/layouts/B2BRoleGuard.tsx
  modified:
    - src/lib/services/interfaces/IContractService.ts
    - src/lib/services/mock/contract.mock.ts
    - src/components/b2b/layouts/StatusBadge.tsx
    - src/app/(b2b)/layout.tsx

key-decisions:
  - "Portfolio page accessible to all B2B roles as universal landing page"
  - "Role enforcement at layout level with B2BRoleGuard HOC"
  - "Dynamic sidebar using getB2BNavItems function per role"
  - "Revenue page requires contract READ OR revenue READ permission"

patterns-established:
  - "Revenue dashboard with tabbed interface for multiple sub-sections"
  - "Role guard returns access denied UI with redirect to default route"
  - "Route access configuration maps paths to permission requirements"

# Metrics
duration: 9min
completed: 2026-02-16
---

# Phase 04 Plan 05: Revenue & Contracts Summary

**Revenue & Contracts section with 5 sub-modules plus comprehensive B2B role enforcement locking down portal access per permission matrices**

## Performance

- **Duration:** 9 min
- **Started:** 2026-02-16T13:34:26Z
- **Completed:** 2026-02-16T13:43:51Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Revenue & Contracts section with 5 tabs: license tracking, billing overview, SLA monitoring, usage metrics, contract renewals
- B2B role enforcement across all portal pages with dynamic sidebar and route guards
- All 6 B2B roles enforced per permission matrices (RM, PrivateBanker, FamilyOfficeDirector, ComplianceOfficer, InstitutionalAdmin, UHNIPortal)

## Task Commits

Each task was committed atomically:

1. **Task 1: Revenue & Contracts section** - `59374ee` (feat)
2. **Task 2: B2B role enforcement** - `924b25e` (feat)

_Note: No separate metadata commit needed as all work completed in task commits_

## Files Created/Modified

**Revenue Components:**
- `src/app/(b2b)/revenue/page.tsx` - Revenue hub with 5 tabs, permission gate, stats row
- `src/components/b2b/revenue/LicenseTracker.tsx` - License tracking with utilization chart
- `src/components/b2b/revenue/BillingOverview.tsx` - Revenue trends, breakdown pie chart, transaction history
- `src/components/b2b/revenue/SLAMonitor.tsx` - Uptime metrics, trend chart, incident log
- `src/components/b2b/revenue/UsageMetrics.tsx` - Active users, API calls, storage, feature usage
- `src/components/b2b/revenue/ContractRenewals.tsx` - Upcoming renewals table, expiry warnings, renewal calendar

**Role Enforcement:**
- `src/lib/rbac/b2b-role-guards.tsx` - Route access configuration, canAccessB2BRoute, getB2BNavItems
- `src/components/b2b/layouts/B2BRoleGuard.tsx` - Role guard HOC enforcing route access
- `src/app/(b2b)/layout.tsx` - Updated with role guard and dynamic sidebar

**Service Extensions:**
- `src/lib/services/interfaces/IContractService.ts` - Added UsageMetrics, SLAMetrics interfaces
- `src/lib/services/mock/contract.mock.ts` - Added getActiveLicenses, getUsageMetrics, getSLAMetrics

**Component Updates:**
- `src/components/b2b/layouts/StatusBadge.tsx` - Added variant prop for flexible color coding

## Decisions Made

**1. Portfolio accessible to all B2B roles**
- Rationale: Portfolio serves as universal landing page, should be accessible to all roles for orientation
- Implementation: Special case in canAccessB2BRoute allowing portfolio without permission check

**2. Revenue permission gate uses OR logic**
- Rationale: Both contract READ and revenue READ permissions grant access (InstitutionalAdmin has contract, PrivateBanker has revenue)
- Implementation: `can(Permission.READ, 'contract') || can(Permission.READ, 'revenue')`

**3. StatusBadge variant prop addition**
- Rationale: Revenue components need consistent color coding across different badge uses
- Implementation: Added variant prop ('teal' | 'amber' | 'red' | 'slate' | 'purple' | 'blue')

**4. Role name displayed in sidebar**
- Rationale: Clear indication of current role for debugging and user awareness
- Implementation: Format role name from enum (e.g., "RelationshipManager" → "Relationship Manager")

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**1. TypeScript formatter type errors in Recharts**
- Issue: Recharts Tooltip/Pie formatter expects `(value: number | undefined)` but TypeScript inferred strict `number`
- Resolution: Changed formatter from `(value: number)` to `(value) => Number(value)...` for type flexibility
- Files: BillingOverview.tsx, SLAMonitor.tsx

**2. ContractStatus type conflict**
- Issue: TypeScript wouldn't allow assigning "Expiring Soon" to variable typed as ContractStatus
- Resolution: Explicitly typed statusText as `string` instead of inferring from contract.status
- Files: ContractRenewals.tsx

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**B2B portal complete:**
- All 6 core sections built: Portfolio, Clients, Journeys, Risk, Access, Revenue
- Role enforcement active across entire portal
- Permission matrices fully enforced
- Dynamic navigation per role

**Ready for:**
- B2C portal development (Phase 5)
- Admin panel (Phase 6)
- Integration testing across all 3 contexts

**No blockers.**

---
*Phase: 04-b2b-institutional-portal*
*Completed: 2026-02-16*
