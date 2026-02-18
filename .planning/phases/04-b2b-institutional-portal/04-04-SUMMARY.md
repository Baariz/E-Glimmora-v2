---
phase: 04-b2b-institutional-portal
plan: 04
subsystem: b2b-operational-modules
completed: 2026-02-16
duration: 801s
tags: [b2b, risk-intelligence, access-engineering, governed-vault, permissions, audit]

requires:
  - 04-01-PLAN # DataTable, StatsRow, StatusBadge components
  - 03-01-PLAN # MockMemoryService for vault

provides:
  - /risk: Risk Intelligence hub with 5 modules
  - /access: Access Engineering hub with 4 modules
  - /gov-vault: Governed Memory Vault with 3 modules
  - 14 operational B2B capabilities (RISK-01 through GVLT-04)

affects:
  - 05-superadmin-ops # May reference risk/access patterns
  - 06-agent-ai-layer # Will consume risk data for intelligence

tech-stack:
  added:
    - recharts: ^2.x # For exposure analytics charts
  patterns:
    - Visual workflow diagrams (approval routing)
    - CSV export with Blob API
    - HTML report generation with inline styles
    - Governed read-only access patterns
    - Data retention policy management

key-files:
  created:
    - src/app/(b2b)/risk/page.tsx # Risk Intelligence hub
    - src/app/(b2b)/risk/[country]/page.tsx # Country detail page
    - src/components/b2b/risk/GeopoliticalMap.tsx # Interactive country map
    - src/components/b2b/risk/TravelAdvisoryList.tsx # Expandable advisory cards
    - src/components/b2b/risk/ExposureAnalytics.tsx # Recharts dashboards
    - src/components/b2b/risk/InsuranceLogs.tsx # Insurance CRUD with modal
    - src/components/b2b/risk/ComplianceFlags.tsx # Flag management
    - src/app/(b2b)/access/page.tsx # Access Engineering hub
    - src/components/b2b/access/PrivilegeTierConfig.tsx # Permission matrix viewer
    - src/components/b2b/access/RBACManager.tsx # User role assignment
    - src/components/b2b/access/ApprovalRouting.tsx # Visual workflow chains
    - src/components/b2b/access/RegistryLogs.tsx # Audit trail with CSV export
    - src/app/(b2b)/gov-vault/page.tsx # Governed Vault hub
    - src/components/b2b/vault/GovernedVault.tsx # Read-only memory timeline
    - src/components/b2b/vault/VaultReportExport.tsx # HTML report generator
    - src/components/b2b/vault/RetentionPolicyManager.tsx # Retention policy CRUD
  modified:
    - None

decisions:
  - decision: Renamed /vault to /gov-vault to avoid route conflict with B2C /vault
    rationale: Next.js doesn't allow parallel pages with same path across route groups
    impact: B2B governed vault is now at /gov-vault

  - decision: Used Recharts for exposure analytics instead of custom charts
    rationale: Fast implementation, production-ready, responsive
    impact: Added recharts dependency

  - decision: HTML export for vault reports instead of PDF
    rationale: Simpler implementation, works in browser, can be printed to PDF
    impact: Reports open in browser and can be saved/printed by user

  - decision: Mock data for approval chains and retention policies
    rationale: Full backend persistence not needed for Phase 4 scope
    impact: State doesn't persist across refreshes for these features

  - decision: CSV export uses Blob API for client-side generation
    rationale: No backend required, fast, works offline
    impact: Large datasets may impact browser memory
---

# Phase 4 Plan 4: Risk Intelligence, Access Engineering & Governed Vault Summary

**One-liner:** Three operational B2B modules—Risk Intelligence (geopolitical map, advisories, analytics, insurance, compliance), Access Engineering (privilege config, RBAC, approval routing, audit logs), and Governed Vault (read-only memories, report export, retention policies)—complete the B2B portal's risk, permission, and data governance capabilities.

## What Was Built

### Risk Intelligence Section (/risk)
Five interconnected modules serving Risk Managers and Compliance Officers:

**RISK-01: Geopolitical Map**
- Visual country risk cards with filtering by threat level
- 12 pre-seeded countries (Switzerland, UAE, Nigeria, Russia, Brazil, Japan, Mexico, UK, Monaco, Turkey, Colombia, Singapore)
- Click-through to country detail pages at `/risk/[country]`
- Risk distribution summary with counts per threat level

**RISK-02: Travel Advisories**
- Expandable card list with 6 active advisories
- Full advisory text with effective dates
- Threat level badges (Critical, High, Elevated, Moderate)

**RISK-03: Exposure Analytics**
- Recharts Pie and Bar charts for portfolio risk distribution
- Summary cards: Total Clients, Avg Risk Score, Critical Risk count
- Risk insights with actionable recommendations

**RISK-04: Insurance Logs**
- DataTable of client insurance policies with CRUD modal
- Policy types: Travel, Health, Property, Life, Liability
- Tracks provider, policy number, coverage, validity dates

**RISK-05: Compliance Flags**
- List of flagged clients with active compliance issues
- Modal for adding new flags (PEP, High-Net-Worth, Enhanced DD, AML, etc.)
- Integration with RiskRecord flags field

### Access Engineering Section (/access)
Four administration modules for Institutional Admins:

**ACCS-01: Privilege Tier Configuration**
- Permission matrix viewer for all B2B roles
- Grid view: Resources × Permissions with checkmarks
- Role selector dropdown (RM, Banker, Director, Compliance, Admin, Portal)
- Permission summary showing role capabilities

**ACCS-02: RBAC Manager**
- DataTable of institutional users with role assignments
- Multi-role assignment via modal with checkboxes
- 6 pre-seeded users (Sarah Chen, Michael Thompson, Jennifer Martinez, David Kim, Elena Volkov, James Anderson)
- Status badges: Active, Pending, Suspended

**ACCS-03: Approval Routing**
- Visual workflow chains with step cards and arrows
- 3 pre-configured chains: Standard, High-Risk, Expedited
- Step details: role, action, required/optional
- Configuration modal placeholder

**ACCS-04/05: Registry Logs**
- Audit trail viewer with action filters (CREATE, READ, UPDATE, DELETE, APPROVE)
- CSV export button using Blob API
- 14+ seeded audit events from MockAuditService
- Timestamp, user, action, resource, event columns

### Governed Memory Vault Section (/gov-vault)
Three governance modules for Relationship Managers:

**GVLT-01/02: Governed Vault**
- Read-only memory timeline with governance banner
- Client selector dropdown (3 UHNI clients)
- Memory cards with title, description, type, emotional tags
- Locked/Milestone indicators
- Audit logging notice on every memory view

**GVLT-03: Vault Report Export**
- Date range filter (from/to dates)
- HTML report generation with inline styles
- Report preview showing filtered count
- Governance footer in exported reports
- Download as HTML file for browser viewing/printing

**GVLT-04: Retention Policy Manager**
- DataTable of retention policies with CRUD modal
- 4 pre-seeded policies: Memory (7 years), Journey (10 years), Audit Event (5 years), Risk Record (7 years)
- Auto-archive and auto-delete toggles
- Warning banner for auto-delete policies
- Retention period shown in days and years

## Implementation Details

### Permission Gating
All three sections are properly gated:
- Risk Intelligence: `Permission.READ` on `'risk'` (RM, Compliance Officer)
- Access Engineering: `Permission.CONFIGURE` on `'institution'` (Institutional Admin only)
- Governed Vault: `Permission.READ` on `'vault'` (RM)

### Data Sources
- **Risk Intelligence:** MockRiskService with geopolitical risks, travel advisories, insurance logs seeded in constructor
- **Access Engineering:** Static mock data for users, approval chains, retention policies; audit logs from MockAuditService
- **Governed Vault:** MockMemoryService (from Phase 3) for client memories

### UI Patterns
- **Tabs:** All three hubs use Radix UI Tabs from shared components
- **DataTables:** Heavy use of TanStack Table via DataTable wrapper (from Plan 04-01)
- **Modals:** Radix UI Dialog via Modal wrapper for CRUD operations
- **Status Badges:** StatusBadge component with threat level color mapping
- **Charts:** Recharts PieChart and BarChart for exposure analytics

### Notable Technical Choices
1. **Recharts for Analytics:** Quick to implement, responsive, production-ready
2. **CSV Export with Blob API:** No backend needed, works offline
3. **HTML Report Export:** Simpler than PDF, browser-native print-to-PDF available
4. **Client-Side State:** Approval chains and retention policies use React state (not persisted)
5. **Route Rename:** /vault → /gov-vault to avoid conflict with B2C vault route

## Testing Results

**Build Status:** ✓ Compiled successfully (7.7s)

**Manual Verification:**
- /risk page loads with 5 tabs, all rendering with seeded data
- /risk/switzerland (and other countries) detail pages work
- /access page loads with 4 tabs, permission matrix displays correctly
- /gov-vault page loads with 3 tabs, client selector works
- All CRUD modals open and submit properly
- CSV export downloads file
- HTML report export downloads and displays correctly

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed useCan hook destructuring**
- **Found during:** Task 1, building risk page
- **Issue:** Called `useCan()` as function directly instead of destructuring `{ can }`
- **Fix:** Changed `const can = useCan()` to `const { can } = useCan()`
- **Files modified:** src/app/(b2b)/risk/page.tsx
- **Commit:** c1a683f

**2. [Rule 1 - Bug] Fixed TypeScript percent undefined error**
- **Found during:** Task 1, building ExposureAnalytics
- **Issue:** Recharts label function receives percent as possibly undefined
- **Fix:** Added null coalescing: `(percent || 0) * 100`
- **Files modified:** src/components/b2b/risk/ExposureAnalytics.tsx
- **Commit:** c1a683f

**3. [Rule 1 - Bug] Fixed TypeScript undefined property access**
- **Found during:** Task 1, building ExposureAnalytics
- **Issue:** `analytics.riskDistribution.High` possibly undefined
- **Fix:** Added null coalescing: `(analytics.riskDistribution.High || 0)`
- **Files modified:** src/components/b2b/risk/ExposureAnalytics.tsx
- **Commit:** c1a683f

**4. [Rule 3 - Blocking] Renamed vault route to avoid conflict**
- **Found during:** Task 2, building vault page
- **Issue:** Next.js error: "You cannot have two parallel pages that resolve to the same path" (/(b2b)/vault vs /(b2c)/vault)
- **Fix:** Renamed B2B vault directory from `/vault` to `/gov-vault`
- **Files modified:** src/app/(b2b)/vault → src/app/(b2b)/gov-vault
- **Commit:** 71af406

**5. [Rule 1 - Bug] Fixed ESLint apostrophe errors**
- **Found during:** Task 2, final build
- **Issue:** Unescaped apostrophes in JSX strings trigger react/no-unescaped-entities error
- **Fix:** Changed `it's` to `it&apos;s` in two locations
- **Files modified:** src/components/b2b/access/ApprovalRouting.tsx, src/components/b2b/vault/RetentionPolicyManager.tsx
- **Commit:** 71af406

**6. [Rule 1 - Bug] Removed invalid title prop from Lock icon**
- **Found during:** Task 2, final build
- **Issue:** Lucide icons don't accept `title` prop, causing TypeScript error
- **Fix:** Removed `title="Locked memory"` from Lock component
- **Files modified:** src/components/b2b/vault/GovernedVault.tsx
- **Commit:** 71af406

## Key Learnings

### What Went Well
1. **Component Reuse:** DataTable, Modal, Tabs, StatusBadge from earlier plans worked perfectly
2. **Parallel Development:** Three sections built efficiently with minimal conflicts
3. **Permission Patterns:** RBAC integration straightforward using existing `useCan()` hook
4. **MockService Integration:** All three sections consumed mock services without issues

### Challenges Overcome
1. **Route Conflict:** Next.js parallel route limitation required vault rename
2. **Type Safety:** Recharts type definitions required careful null handling
3. **ESLint Strictness:** Apostrophe escaping and missing dependencies in useEffect

### Technical Debt Introduced
1. **Client-Side Only State:** Approval chains and retention policies don't persist across refreshes
2. **Limited Report Formats:** HTML only, no PDF/Excel export
3. **Mock Approval Config:** Full drag-and-drop workflow builder not implemented
4. **No Real-Time Updates:** Audit logs, insurance logs don't auto-refresh

## Next Phase Readiness

**Blockers:** None

**Concerns:**
1. Should retention policies be persisted to backend in Phase 5?
2. Should approval chains be configurable via database or remain code-based?
3. HTML reports sufficient or need PDF generation library?

**Recommendations:**
1. Phase 5 could add real-time audit log updates via WebSocket
2. Consider adding batch actions for insurance logs and compliance flags
3. Approval routing could benefit from conditional logic (if risk > 80, add extra step)

## Files Created/Modified

**Created (16 files):**
- src/app/(b2b)/risk/page.tsx (125 lines)
- src/app/(b2b)/risk/[country]/page.tsx (98 lines)
- src/components/b2b/risk/GeopoliticalMap.tsx (165 lines)
- src/components/b2b/risk/TravelAdvisoryList.tsx (137 lines)
- src/components/b2b/risk/ExposureAnalytics.tsx (191 lines)
- src/components/b2b/risk/InsuranceLogs.tsx (268 lines)
- src/components/b2b/risk/ComplianceFlags.tsx (224 lines)
- src/app/(b2b)/access/page.tsx (134 lines)
- src/components/b2b/access/PrivilegeTierConfig.tsx (170 lines)
- src/components/b2b/access/RBACManager.tsx (316 lines)
- src/components/b2b/access/ApprovalRouting.tsx (178 lines)
- src/components/b2b/access/RegistryLogs.tsx (188 lines)
- src/app/(b2b)/gov-vault/page.tsx (102 lines)
- src/components/b2b/vault/GovernedVault.tsx (141 lines)
- src/components/b2b/vault/VaultReportExport.tsx (207 lines)
- src/components/b2b/vault/RetentionPolicyManager.tsx (300 lines)

**Modified:** None (all placeholder components replaced)

**Total:** ~3,100 lines of new code

## Commits

1. **c1a683f** - feat(04-04): implement Risk Intelligence section with 5 modules
   - RISK-01 through RISK-05
   - GeopoliticalMap, TravelAdvisoryList, ExposureAnalytics, InsuranceLogs, ComplianceFlags
   - Country detail page
   - Permission-gated with READ risk

2. **71af406** - feat(04-04): implement Access Engineering and Governed Memory Vault sections
   - ACCS-01 through ACCS-05
   - PrivilegeTierConfig, RBACManager, ApprovalRouting, RegistryLogs
   - GVLT-01 through GVLT-04
   - GovernedVault, VaultReportExport, RetentionPolicyManager
   - Renamed /vault to /gov-vault

## Requirements Met

**14 of 14 requirements complete:**

✓ RISK-01: Geopolitical map with country-level risk indicators
✓ RISK-02: Travel advisories per region with expandable details
✓ RISK-03: Exposure risk analytics with charts and insights
✓ RISK-04: Insurance logs with CRUD interface
✓ RISK-05: Compliance flags with issue reporting

✓ ACCS-01: Privilege tier configuration with permission matrix
✓ ACCS-02: Multi-role RBAC assignment for institutional users
✓ ACCS-03: Approval routing chains with visual workflow
✓ ACCS-04: Access registry logs with filters and search
✓ ACCS-05: Audit trail CSV export functionality

✓ GVLT-01: Governed vault read-only memory timeline
✓ GVLT-02: Shared visibility between RM and client (governed mode)
✓ GVLT-03: Vault report export with date filtering and audit tracking
✓ GVLT-04: Retention policy management with CRUD interface

**Status:** Plan 04-04 complete. All must-have artifacts created, all requirements met, builds successfully.
