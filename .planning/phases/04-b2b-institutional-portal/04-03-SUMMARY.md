---
phase: 04-b2b-institutional-portal
plan: 03
subsystem: b2b-governance
tags: [state-machine, governance-workflow, version-control, compliance, rbac, tanstack-table]

# Dependency graph
requires:
  - phase: 04-01
    provides: State machine infrastructure, DataTable component, RBAC hooks, StatusBadge
  - phase: 01-04
    provides: MockJourneyService with version support
  - phase: 01-05
    provides: Permission system and useCan() hook
provides:
  - Journey governance list with pipeline and table views
  - Journey simulation form with narrative generation
  - State machine-driven approval workflow
  - Immutable version history with diff visualization
  - Client presentation export
  - Execution timeline tracking
affects: [04-04-risk-analytics, 04-05-vault-governance]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - State machine permission-gated workflow
    - Template-based journey narrative generation
    - Word-level diff visualization
    - Printable HTML document generation

key-files:
  created:
    - src/app/(b2b)/governance/page.tsx
    - src/app/(b2b)/governance/simulate/page.tsx
    - src/app/(b2b)/governance/[id]/page.tsx
    - src/components/b2b/forms/JourneySimulatorForm.tsx
    - src/components/b2b/workflows/JourneyGovernancePanel.tsx
    - src/components/b2b/workflows/VersionHistory.tsx
    - src/components/b2b/workflows/VersionDiff.tsx
    - src/components/b2b/workflows/ExecutionTracker.tsx
    - src/components/b2b/workflows/PresentationExport.tsx
  modified:
    - src/app/(b2b)/layout.tsx

key-decisions:
  - "/governance route instead of /journeys to avoid conflict with B2C /journeys"
  - "Template-based narrative generation for journey simulation (mimics AI output)"
  - "Word-level diff algorithm for version comparison (simple split-based approach)"
  - "Printable HTML presentation using window.open() and window.print()"
  - "Modal confirmation for destructive transitions (reject/request changes)"

patterns-established:
  - "State machine workflow panel: Permission-gated action buttons based on getAvailableTransitions()"
  - "Version timeline: Vertical timeline with milestone dots and connecting lines"
  - "Execution tracker: Three-phase milestone visualization (Approved → Presented → Executed)"
  - "Route separation: B2B governance at /governance, B2C journeys at /journeys"

# Metrics
duration: 9min
completed: 2026-02-16
---

# Phase 04 Plan 03: Journey Governance Workflow Summary

**Full state machine-driven journey approval workflow with version control, compliance gates, and client presentation export**

## Performance

- **Duration:** 9 minutes
- **Started:** 2026-02-16T09:12:19Z
- **Completed:** 2026-02-16T09:21:24Z
- **Tasks:** 2/2 complete
- **Files modified:** 10 files created, 1 modified

## Accomplishments

- Complete journey governance lifecycle from draft generation to execution tracking
- State machine-driven workflow with formal approval pipeline (DRAFT → RM_REVIEW → COMPLIANCE_REVIEW → APPROVED → PRESENTED → EXECUTED)
- Immutable version history with word-level diff visualization for audit trail
- Permission-gated governance actions using RBAC and state machine integration
- Client-ready presentation export with printable HTML format

## Task Commits

Each task was committed atomically:

1. **Task 1: Journey list and simulation form** - `e2b6935` (feat)
   - Journey governance list page at /governance
   - Pipeline view (Kanban-style status columns) and table view (DataTable with sorting)
   - Journey simulator form with client selection, emotional objective, discretion level
   - Template-based narrative generation with emotional profile alignment

2. **Task 2: Journey detail with governance workflow** - `7fb6d3e` (feat)
   - Journey detail page with two-column layout
   - JourneyGovernancePanel with state machine transitions
   - VersionHistory with vertical timeline
   - VersionDiff with word-level comparison
   - ExecutionTracker with milestone visualization
   - PresentationExport with printable HTML generation

## Files Created/Modified

### Created
- `src/app/(b2b)/governance/page.tsx` - Journey list with pipeline and table views, status-based grouping
- `src/app/(b2b)/governance/simulate/page.tsx` - Journey simulation page with breadcrumb navigation
- `src/app/(b2b)/governance/[id]/page.tsx` - Journey detail with full governance interface
- `src/components/b2b/forms/JourneySimulatorForm.tsx` - Journey generation form with client selection, narrative generation
- `src/components/b2b/workflows/JourneyGovernancePanel.tsx` - State machine action panel with permission gates
- `src/components/b2b/workflows/VersionHistory.tsx` - Immutable version timeline with diff capability
- `src/components/b2b/workflows/VersionDiff.tsx` - Word-level diff visualization modal
- `src/components/b2b/workflows/ExecutionTracker.tsx` - Post-approval milestone timeline
- `src/components/b2b/workflows/PresentationExport.tsx` - Client presentation HTML generator

### Modified
- `src/app/(b2b)/layout.tsx` - Updated sidebar navigation to point to /governance

## Decisions Made

**Route naming:** Used `/governance` instead of `/journeys` for B2B to avoid path conflict with B2C `/journeys`. Next.js route groups don't create separate namespaces, so both (b2b) and (b2c) route groups resolve to the same root path. Solution: Distinct route names with semantic meaning ("governance" emphasizes the workflow nature).

**Narrative generation approach:** Template-based generation with client emotional profile integration and category-specific content. Mimics AI output for v1 mock development. Real AI integration will swap in same service interface.

**Diff algorithm:** Simple word-level diff by splitting on whitespace and comparing arrays. Sufficient for version comparison visualization. Could upgrade to library like `diff-match-patch` or `jsdiff` for production if more sophisticated diffing needed.

**Presentation export:** Used `window.open()` with formatted HTML and `window.print()` for client presentation generation. Avoids server-side PDF generation complexity while providing print-optimized formatting. Client can save as PDF via browser print dialog.

**Destructive action confirmation:** Modal confirmation for REJECT and REQUEST_CHANGES transitions with required reason field. Prevents accidental destructive actions and captures audit context.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Route conflict with B2C journeys**
- **Found during:** Task 1 (build failure)
- **Issue:** Next.js error "You cannot have two parallel pages that resolve to the same path" for /(b2b)/journeys and /(b2c)/journeys. Route groups don't create URL prefixes, so paths collide.
- **Fix:** Renamed B2B journey routes from `/journeys` to `/governance`. Updated all links and navigation. Semantic improvement - "governance" better describes the B2B workflow nature.
- **Files modified:**
  - Created `src/app/(b2b)/governance/` directory instead of `src/app/(b2b)/journeys/`
  - Updated `src/app/(b2b)/layout.tsx` sidebar link
  - Updated `JourneySimulatorForm` navigation targets
- **Verification:** Build successful after route rename
- **Committed in:** e2b6935 (Task 1 commit)

**2. [Rule 1 - Bug] Unescaped apostrophe in JSX**
- **Found during:** Task 1 (ESLint error during build)
- **Issue:** React/no-unescaped-entities error for apostrophe in "client's profile"
- **Fix:** Replaced `'` with `&apos;` HTML entity
- **Files modified:** `src/app/(b2b)/governance/simulate/page.tsx`
- **Verification:** Build successful
- **Committed in:** e2b6935 (Task 1 commit fix)

## Next Phase Readiness

**Ready for:** 04-04 (Risk Analytics Dashboard)

**Provides:**
- Journey entity with full version history and state machine workflow
- Governance workflow patterns that can be reused for other approval processes
- Template for building other B2B operational features

**Notes:**
- All 6 GOVN requirements met (GOVN-01 through GOVN-06)
- State machine enforces valid transitions with RBAC permission gates
- Version history is immutable (append-only) - supports audit requirements
- Execution tracker shows post-approval progress for operational visibility

**No blockers for subsequent plans.**
