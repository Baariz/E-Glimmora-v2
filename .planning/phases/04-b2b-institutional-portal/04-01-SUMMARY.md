---
phase: 04-b2b-institutional-portal
plan: 01
subsystem: b2b
tags: [tanstack-react-table, sonner, recharts, mock-services, rbac, state-machine]

# Dependency graph
requires:
  - phase: 01-core-ui-rbac
    provides: RBAC permission system, usePermission hooks, mock service architecture
  - phase: 03-b2c-uhni-portal
    provides: useServices pattern, Card component, luxury design system
provides:
  - B2B mock service layer (client, risk, contract, audit)
  - Journey workflow state machine with permission-gated transitions
  - DataTable component with sorting, filtering, pagination
  - Full Portfolio Dashboard with 7 DASH requirements
  - StatsRow and StatusBadge reusable components
  - Sonner toast integration for B2B
affects: [04-02-client-details, 04-03-journey-approval, 04-04-risk-compliance, 04-05-revenue-reporting]

# Tech tracking
tech-stack:
  added: [@tanstack/react-table, sonner]
  patterns: [configuration-driven state machine, TanStack Table wrapper pattern, RBAC-gated dashboard sections]

key-files:
  created:
    - src/lib/services/mock/client.mock.ts
    - src/lib/services/mock/risk.mock.ts
    - src/lib/services/mock/contract.mock.ts
    - src/lib/services/mock/audit.mock.ts
    - src/lib/services/interfaces/IClientService.ts
    - src/lib/state-machines/journey-workflow.ts
    - src/components/b2b/tables/DataTable.tsx
    - src/components/b2b/layouts/StatsRow.tsx
    - src/components/b2b/layouts/StatusBadge.tsx
  modified:
    - package.json (added @tanstack/react-table, sonner)
    - src/lib/types/entities.ts (ClientRecord, InsuranceLog, GeopoliticalRisk, TravelAdvisory, RetentionPolicy)
    - src/lib/types/validation.ts (CreateClientRecordSchema)
    - src/lib/services/config.ts (registered 4 new services)
    - src/lib/hooks/useServices.ts (added client, risk, contract, audit)
    - src/app/(b2b)/layout.tsx (Sonner integration)
    - src/app/(b2b)/portfolio/page.tsx (full dashboard implementation)

key-decisions:
  - "Configuration-driven state machine over XState - simpler for permission-gated workflow"
  - "TanStack Table wrapper pattern - single DataTable component for all B2B tables"
  - "RBAC-gated dashboard sections - Revenue and Risk sections respect user permissions"
  - "Hardcoded MOCK_RM_USER_ID pattern - consistent with B2C's MOCK_UHNI_USER_ID approach"

patterns-established:
  - "Journey state machine: DRAFT → RM_REVIEW → COMPLIANCE_REVIEW → APPROVED → PRESENTED → EXECUTED → ARCHIVED"
  - "DataTable component: Reusable table with sorting, filtering, pagination for all B2B pages"
  - "Dashboard section gating: Use useCan() hook to conditionally render sections based on RBAC"
  - "Mock service seeding: Idempotent seedIfEmpty() pattern checks localStorage before seeding"

# Metrics
duration: 25min
completed: 2026-02-16
---

# Phase 4 Plan 1: B2B Infrastructure & Portfolio Dashboard Summary

**B2B mock service layer with 4 services (client, risk, contract, audit), journey workflow state machine with permission-gated transitions, and full Portfolio Dashboard with all 7 DASH requirements using TanStack Table and Recharts**

## Performance

- **Duration:** 25 min
- **Started:** 2026-02-16T13:51:14Z
- **Completed:** 2026-02-16T14:16:09Z
- **Tasks:** 2/2
- **Files modified:** 19

## Accomplishments
- Created 4 new B2B mock services (client, risk, contract, audit) with realistic seed data
- Built journey workflow state machine with permission-based transition validation
- Created reusable DataTable component with sorting, filtering, and pagination
- Delivered full Portfolio Dashboard with all 7 DASH requirements (client table, risk heat map, journey pipeline, emotional insights, NDA tracker, compliance alerts, revenue metrics)
- Integrated Sonner for B2B toast notifications

## Task Commits

Each task was committed atomically:

1. **Task 1: Install deps, create B2B mock services, state machine, and types** - `94d7143` (feat)
   - Installed @tanstack/react-table and sonner dependencies
   - Created ClientRecord, InsuranceLog, GeopoliticalRisk, TravelAdvisory, RetentionPolicy types
   - Created IClientService interface and MockClientService with 8 seeded UHNI clients
   - Created MockRiskService with risk record management and portfolio aggregation
   - Created MockContractService with contract and revenue tracking
   - Created MockAuditService with append-only audit logging
   - Registered all 4 services in config.ts and useServices hook
   - Created journey-workflow state machine with permission-gated transitions

2. **Task 2: Build DataTable component, B2B layout upgrade, and full Portfolio Dashboard** - `40549b7` (feat)
   - Created DataTable component with TanStack Table (sorting, filtering, pagination)
   - Created StatsRow component for dashboard metrics display
   - Created StatusBadge component with color-coded status rendering
   - Added Sonner toast integration to B2B layout
   - Built full Portfolio Dashboard with all 7 DASH requirements

## Files Created/Modified

**Created:**
- `src/lib/services/mock/client.mock.ts` - MockClientService with 8 seeded UHNI clients (CRUD operations)
- `src/lib/services/mock/risk.mock.ts` - MockRiskService with risk record management and portfolio aggregation
- `src/lib/services/mock/contract.mock.ts` - MockContractService with contract and revenue tracking
- `src/lib/services/mock/audit.mock.ts` - MockAuditService with append-only audit logging
- `src/lib/services/interfaces/IClientService.ts` - Client service interface with RM-centric operations
- `src/lib/state-machines/journey-workflow.ts` - Journey workflow state machine with permission-gated transitions
- `src/components/b2b/tables/DataTable.tsx` - Reusable TanStack Table wrapper with sorting, filtering, pagination
- `src/components/b2b/layouts/StatsRow.tsx` - Responsive grid of stat cards for dashboard metrics
- `src/components/b2b/layouts/StatusBadge.tsx` - Generic status badge with color coding

**Modified:**
- `package.json` - Added @tanstack/react-table and sonner dependencies
- `src/lib/types/entities.ts` - Added ClientRecord, InsuranceLog, GeopoliticalRisk, TravelAdvisory, RetentionPolicy types
- `src/lib/types/validation.ts` - Added CreateClientRecordSchema validation
- `src/lib/services/config.ts` - Registered client, risk, contract, audit services
- `src/lib/hooks/useServices.ts` - Added client, risk, contract, audit service instances
- `src/app/(b2b)/layout.tsx` - Added Sonner Toaster component
- `src/app/(b2b)/portfolio/page.tsx` - Replaced placeholder with full 7-section dashboard

## Decisions Made

**1. Configuration-driven state machine over XState**
- **Rationale:** Journey workflow is straightforward linear progression with permission gates. A simple JOURNEY_TRANSITIONS config object is easier to understand and maintain than XState for this use case. Permission checks integrate cleanly via hasPermission() function.

**2. TanStack Table wrapper pattern**
- **Rationale:** All B2B pages need tables with sorting, filtering, pagination. Creating a single DataTable component that wraps TanStack Table provides consistency and reduces code duplication across future B2B plans.

**3. RBAC-gated dashboard sections**
- **Rationale:** RMs see risk/journey data, PrivateBankers see revenue, ComplianceOfficers have different views. Using `useCan()` to conditionally render sections ensures each role sees appropriate data without separate dashboard implementations.

**4. Hardcoded MOCK_RM_USER_ID pattern**
- **Rationale:** Matches B2C's MOCK_UHNI_USER_ID pattern for consistency. Enables B2B development without auth complexity. All B2B pages will use same mock ID for development.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] npm install auth failures**
- **Found during:** Task 1 (dependency installation)
- **Issue:** npm registry authentication was failing during install of @tanstack/react-table and sonner
- **Fix:** Cleared npm cache with `npm cache clean --force`, removed node_modules and package-lock.json, ran fresh `npm install` which succeeded
- **Files modified:** package-lock.json (regenerated)
- **Verification:** Both packages installed successfully, verified with `ls node_modules/@tanstack/react-table` and `ls node_modules/sonner`
- **Committed in:** 40549b7 (Task 2 commit)

**2. [Rule 1 - Bug] Fixed useCan hook usage**
- **Found during:** Task 2 (Portfolio Dashboard TypeScript compilation)
- **Issue:** Called `useCan(Permission.READ, 'risk')` directly but useCan() returns `{ can }` object, not boolean
- **Fix:** Destructured `can` from `useCan()` then called `can(Permission.READ, 'risk')`
- **Files modified:** src/app/(b2b)/portfolio/page.tsx
- **Verification:** TypeScript compilation succeeded, build passed
- **Committed in:** 40549b7 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both auto-fixes necessary for functionality. No scope creep.

## Issues Encountered

**npm registry authentication failures**
- **Problem:** Multiple npm install attempts failed with "Access token expired or revoked" errors
- **Solution:** Cleared npm cache, removed node_modules and package-lock.json, ran fresh install which succeeded
- **Duration:** ~5 minutes of debugging time

## User Setup Required

None - no external service configuration required. All dependencies are npm packages with no API keys or external services needed.

## Next Phase Readiness

**Ready for next phases:**
- All B2B infrastructure in place for subsequent plans
- DataTable component ready for Client Details page (04-02)
- Journey state machine ready for Journey Approval workflow (04-03)
- Risk services ready for Risk & Compliance tools (04-04)
- Contract/revenue services ready for Revenue Reporting (04-05)

**Blockers/Concerns:**
None. All 7 DASH requirements successfully delivered. Dashboard is functional with real mock data.

---
*Phase: 04-b2b-institutional-portal*
*Completed: 2026-02-16*
