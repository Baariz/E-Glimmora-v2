# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-15)

**Core value:** Every UHNI interaction must feel like a luxury experience, not software — emotionally intelligent, privacy-sovereign, and narratively driven. The UI is the product.
**Current focus:** Phase 5 complete, Phase 6 next

## Current Position

Phase: 6 of 6 (Polish & Quality Assurance) — COMPLETE
Plan: 3 of 3 in phase
Status: Phase complete
Last activity: 2026-02-16 — Completed 06-03-PLAN.md (Testing & Accessibility)

Progress: [██████████] 100% - PROJECT COMPLETE

## Performance Metrics

**Velocity:**
- Total plans completed: 29
- Average duration: 8.9 minutes
- Total execution time: 4.4 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 5 | 25 min | 5.0 min |
| 02 | 4 | 29 min | 7.3 min |
| 03 | 7 | 88 min | 12.6 min |
| 04 | 5 | 76 min | 15.2 min |
| 05 | 3 | 21 min | 7.0 min |
| 06 | 3 | 31 min | 10.3 min |

**Recent Trend:**
- Last 5 plans: 05-02 (7m), 05-03 (8m), 06-01 (13m), 06-02 (5m), 06-03 (13m)
- Trend: Phase 6 complete with excellent velocity. Testing infrastructure (06-03) took 13min due to comprehensive test suite (75 unit tests + E2E + visual regression), but responsive design (06-02) was lightning-fast at 5min. Average 10.3min/plan for polish phase.

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 0 (Planning): B2C as website experience (not dashboard) — narrative-driven layouts for UHNI, no SaaS dashboard feeling
- Phase 0 (Planning): B2B as premium dashboard — higher data density, sidebar nav, structured layout for operational needs
- Phase 0 (Planning): Mock API + localStorage for v1 — service abstraction layer ready for future API swap
- Phase 0 (Planning): Real auth via NextAuth — security non-negotiable for UHNI platform (invite-only, MFA, device recognition)
- Phase 0 (Planning): Rich & cinematic motion design — Framer Motion for page transitions, parallax, micro-interactions
- Phase 0 (Planning): Equal responsive priority — UHNI access from any device, both desktop and mobile get full luxury treatment
- Plan 01-04: Mock-first development approach — localStorage-based mock services enable parallel frontend/backend work
- Plan 01-04: Service abstraction layer — Interface-based design enables seamless mock → API transition
- Plan 01-04: Zod for runtime validation — Type-safe input validation with inferred TypeScript types
- Plan 01-01: Tailwind CSS v3.4 (stable) over v4 (beta) — Production-ready design system, will migrate when v4 stable
- Plan 01-01: Mock font exports until licensed fonts provided — Graceful fallback to Georgia/system-ui
- Plan 01-02: cn() utility pattern (clsx + tailwind-merge) — Industry standard for Tailwind class merging
- Plan 01-02: Radix UI primitives for accessibility — Keyboard nav, focus management, ARIA built-in
- Plan 01-02: Consistent focus ring styling (rose-500) — All interactive components use luxury palette for accessibility
- Plan 01-03: Marketing owns root route — Deleted old page.tsx, marketing layout handles root (/)
- Plan 01-03: B2C website-style navigation — Top nav (NOT sidebar) to maintain luxury website feel
- Plan 01-03: PageTransition selective application — Wraps B2C, B2B, Admin (marketing uses scroll-based editorial animations)
- Plan 01-03: Route groups for domain separation — Four layouts (marketing, B2C, B2B, admin) with distinct visual identities
- Plan 01-05: Permission matrices over role hierarchy — Explicit matrices clearer to audit, no inheritance confusion
- Plan 01-05: Append-only audit with no delete — True immutability ensures audit trail integrity, GDPR via anonymization
- Plan 01-05: Mock auth provider for Phase 1 — Enables RBAC testing, switchable context for all 11 roles
- Plan 02-01: Glassmorphism scroll navigation — Transparent on hero, solid with backdrop-blur-xl on scroll
- Plan 02-01: Invite code format ELAN-XXXX-XXXX-XXXX — Auto-formatting with dash insertion every 4 chars
- Plan 02-01: Full-screen mobile menu overlay — Editorial luxury feel, not slide-out drawer
- Plan 02-03: NextAuth v5 beta over v4 — Modern App Router compatibility, edge runtime support
- Plan 02-03: JWT sessions (30-day) over database sessions — Mock-first development, no DB dependency yet
- Plan 02-03: SessionProvider + DomainContextProvider composition — NextAuth + B2C/B2B/Admin context switching
- Plan 02-04: JWT flag-based MFA flow — NextAuth JWT sessions enable mid-session flag updates
- Plan 02-04: Middleware MFA routing in auth.config.ts — Edge-compatible, centralized route protection logic
- Plan 03-01: useServices hook with memoized instances (no Context) — Simpler mock-first pattern, single swap point for real APIs
- Plan 03-01: Hardcoded MOCK_UHNI_USER_ID for B2C development — Consistent UUID across all B2C pages
- Plan 03-01: Recharts RadarChart for emotional balance — Composable React chart for driver visualization
- Plan 03-02: useWizard hook pattern for multi-step forms — localStorage persistence, per-step validation, reusable across features
- Plan 03-02: Per-step Zod validation for wizards — Immediate feedback, granular error handling
- Plan 03-02: Large card-based selection for luxury wizards — Matches premium brand feel
- Plan 03-03: Template-based AI simulation — Narrative templates with scoring algorithm
- Plan 03-03: Editorial magazine card design — Journey cards as travel magazine covers
- Plan 03-03: Modal flow pattern — trigger → modal → action → success state → close + callback
- Plan 03-04: Emotional tag taxonomy (10 tags) — Joy, Growth, Peace, Connection, Achievement, Gratitude, Wonder, Renewal, Legacy, Love
- Plan 03-04: Lock != Hide — Lock preserves immutability for legacy but allows viewing
- Plan 03-06: Three-tier discretion levels — High/Medium/Standard with plain language descriptions
- Plan 03-06: Advisor resource permissions structure — { [advisorId]: { journeys, intelligence, memories } }
- Plan 03-06: Global erase as nuclear option — executeGlobalErase deletes ALL localStorage for GDPR compliance
- Plan 03-07: useRef pattern for stable initialData in useWizard — Prevents infinite re-render loops from default parameter objects
- Plan 04-01: Configuration-driven state machine over XState — Simpler for permission-gated workflow, easier to maintain
- Plan 04-01: TanStack Table wrapper pattern — Single DataTable component for all B2B tables ensures consistency
- Plan 04-01: RBAC-gated dashboard sections — Use useCan() to conditionally render sections based on user permissions
- Plan 04-01: Hardcoded MOCK_RM_USER_ID pattern — Consistent with B2C's MOCK_UHNI_USER_ID approach
- Plan 04-02: Modal-based intake wizard — Keeps user on detail page during emotional assessment
- Plan 04-02: Reuse useWizard hook from B2C — Consistent pattern for multi-step forms across domains
- Plan 04-02: Radar chart for emotional drivers — Visual representation of client emotional profile
- Plan 04-03: /governance route for B2B journeys — Avoids conflict with B2C /journeys, semantic improvement emphasizing workflow
- Plan 04-03: Template-based journey narrative generation — Mimics AI output with client profile integration
- Plan 04-03: Modal confirmation for destructive transitions — Prevents accidental reject/request changes actions
- Plan 04-03: Printable HTML presentation export — Client-ready documents via window.print()
- Plan 04-04: Renamed /vault to /gov-vault — Next.js doesn't allow parallel pages with same path (/(b2b)/vault vs /(b2c)/vault)
- Plan 04-04: Recharts for B2B analytics — Fast implementation, production-ready, responsive charts
- Plan 04-04: HTML report export for vault — Simpler than PDF, browser-native print-to-PDF available
- Plan 04-04: CSV export with Blob API — Client-side generation, no backend required, works offline
- Plan 04-05: Portfolio accessible to all B2B roles — Universal landing page for orientation, no permission gate
- Plan 04-05: Role enforcement at layout level — B2BRoleGuard HOC wraps children for centralized access control
- Plan 04-05: Dynamic sidebar per role — getB2BNavItems filters navigation based on permission matrices
- Plan 04-05: Revenue permission OR logic — Both contract READ and revenue READ grant access (InstitutionalAdmin/PrivateBanker)
- Plan 05-01: Reuse B2B DataTable component for admin tables — Consistency across platform, proven pattern from Phase 4
- Plan 05-01: Modal-based invite generation workflow — Matches B2B modal patterns, keeps user on page, success view with copy button
- Plan 05-01: Expandable detail panels for invite codes — Reduces clutter, allows quick scanning of table, detail on demand
- Plan 05-02: User status via erasedAt field encoding — SUSPENDED:/REMOVED: prefixes reuse existing field, avoid schema changes
- Plan 05-02: Pending users = empty roles array — Natural state representation, approval assigns first role (defaults to UHNI)
- Plan 05-02: Inline edit mode for institutions — Toggle vs modal reduces cognitive load, full context visible
- Plan 05-02: Wizard-based institution onboarding — 3-step guided setup (Details → Configuration → Review) with localStorage persistence
- Plan 05-03: Approval routing config-driven — Configuration-based approval chains enable per-institution customization without code changes
- Plan 05-03: CSS variable branding — CSS custom properties enable dynamic theme switching without page reload
- Plan 05-03: Admin role guard at layout — Layout-level enforcement provides centralized access control for all admin routes
- Plan 05-03: Expandable audit details — Keeps table scannable while allowing drill-down into metadata/previousState
- Plan 06-02: Container queries over breakpoint-only design — Components can adapt to their container, not just viewport for flexible layouts
- Plan 06-02: Slide-out drawer for B2B mobile sidebar — Preserves desktop sidebar navigation while providing clean mobile experience
- Plan 06-02: Hamburger dropdown for B2C mobile nav — Maintains luxury website feel (not app feel) while being touch-friendly
- Plan 06-02: AVIF + WebP formats in Next.js image config — Modern formats significantly reduce image payload for Lighthouse scores
- Plan 06-03: Vitest for unit tests over Jest — Faster, ESM-native, better Vite integration
- Plan 06-03: Playwright for E2E over Cypress — Superior TypeScript support, multi-browser, built-in visual regression
- Plan 06-03: Semantic selectors (getByRole, getByLabel) over data-testid — More resilient E2E tests
- Plan 06-03: WCAG contrast audit in test setup — Single source of truth for accessibility compliance
- Plan 06-03: localStorage mock in setup.ts — Enables testing mock services
- Plan 06-03: E2E tests skip auth-gated pages gracefully — Document flows, skip if redirected to login

### Pending Todos

None yet.

### Blockers/Concerns

- Licensed font files (Miller Display + Avenir LT Std) not yet provided by client
  - Impact: Using fallback fonts (Georgia/system-ui) until real fonts provided
  - Resolution: Client to provide .woff2 files, then uncomment localFont code in src/app/fonts.ts

## Session Continuity

Last session: 2026-02-16
Stopped at: Completed 06-03-PLAN.md — Testing infrastructure and accessibility compliance delivered
Resume file: None

## Project Completion

**Status:** All 6 phases complete (29 plans total)
**Final deliverables:**
- Full-stack UHNI platform with B2C, B2B, and Admin domains
- Mock API + localStorage for v1 (ready for production API swap)
- NextAuth authentication with invite-only access and MFA
- RBAC system with 11 roles across 3 domains
- Comprehensive test infrastructure (75 unit tests + E2E + visual regression)
- WCAG AA/AAA accessibility compliance
- Responsive design (desktop + mobile) with container queries
- Rich motion design with Framer Motion

**Ready for:**
- Production backend integration (service abstraction layer prepared)
- Licensed font integration (Miller Display + Avenir LT Std)
- E2E auth configuration (storageState setup for full coverage)
- CI/CD pipeline integration (test scripts ready)
