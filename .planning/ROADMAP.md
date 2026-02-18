# Roadmap: Élan Glimmora

## Overview

Élan Glimmora transforms from empty repository to polished luxury UHNI platform across six phases. Foundation establishes the design system, types, services, and RBAC architecture that everything else depends on. Marketing and authentication create the invite-only entry point with NextAuth security. B2C delivers the sovereign UHNI experience — intent intelligence, journey narratives, memory vault, and privacy controls with a luxury magazine feel. B2B builds the institutional dashboard for relationship managers, compliance officers, and private bankers to manage multiple UHNI clients with governance workflows. Platform Admin provides the meta-layer for invite management, institution onboarding, and system monitoring. Polish ensures Dribbble-level quality with motion design, responsive refinement, accessibility, and comprehensive testing.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Design System** - Architectural foundation with types, services, RBAC, design tokens, and UI primitives
- [x] **Phase 2: Marketing & Authentication** - Public brand website with invite-only NextAuth security
- [x] **Phase 3: B2C Sovereign Experience** - UHNI narrative experience with intent/journey intelligence, memory vault, privacy controls
- [x] **Phase 4: B2B Institutional Portal** - Premium dashboard for multi-client management, governance workflows, risk intelligence
- [x] **Phase 5: Platform Administration** - Meta-layer for invite codes, member management, institution onboarding, system monitoring
- [x] **Phase 6: Polish & Quality Assurance** - Motion design, responsive refinement, accessibility, performance optimization, E2E testing

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: Establish architectural foundation that all features depend on — design system, type safety, service abstraction, and context-aware RBAC
**Depends on**: Nothing (first phase)
**Requirements**: FNDX-01, FNDX-02, FNDX-03, FNDX-04, FNDX-05, FNDX-06, FNDX-07, FNDX-08, FNDX-09, FNDX-10
**Success Criteria** (what must be TRUE):
  1. Next.js 15 app scaffolded with TypeScript strict mode, Tailwind CSS, and ESLint configured
  2. Design tokens defined with client color palette (Rose, Sand, Olive, Teal, Gold) and typography (Miller Display + Avenir LT Std)
  3. Radix UI primitives (Button, Input, Card, Modal, Dropdown, Accordion, Tabs) styled with luxury aesthetic
  4. Framer Motion animation system configured with page transition variants and scroll-triggered utilities
  5. Four route group layouts established — (marketing), (b2c), (b2b), (admin) with domain isolation
  6. TypeScript entity types defined for all 15+ data entities (User, Role, Journey, MemoryItem, etc.)
  7. Service abstraction layer with interface contracts and mock localStorage implementations
  8. RBAC engine with permission matrices for 11 roles across B2C/B2B/Admin contexts
  9. Audit event system emitting immutable logs with entity/action/user/timestamp tracking
**Plans**: 5 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 15 with TypeScript, Tailwind luxury tokens, font loading (Wave 1)
- [x] 01-02-PLAN.md — Radix UI shared primitives: Button, Input, Card, Modal, Dropdown, Accordion, Tabs, Select (Wave 2)
- [x] 01-03-PLAN.md — Framer Motion animation system and 4 route group layouts (Wave 2)
- [x] 01-04-PLAN.md — TypeScript entity types, Zod validation, service interfaces, mock localStorage services (Wave 1)
- [x] 01-05-PLAN.md — RBAC permission matrices for 11 roles, audit event system (Wave 2)

### Phase 2: Marketing & Authentication
**Goal**: Create public brand entry point with editorial luxury aesthetic and secure invite-only authentication
**Depends on**: Phase 1
**Requirements**: MKTG-01, MKTG-02, MKTG-03, MKTG-04, MKTG-05, MKTG-06, AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06
**Success Criteria** (what must be TRUE):
  1. User can view editorial homepage with rich parallax scroll story and luxury navigation
  2. User can read philosophy and privacy charter pages
  3. User can enter invite code and see validation feedback (valid/invalid)
  4. User with valid invite code can complete guided registration flow end-to-end
  5. User can set up multi-factor authentication during onboarding
  6. User can log in with email/password + MFA and stay logged in across browser sessions
  7. User can manage trusted devices and revoke device access
  8. User can log out from any page
  9. User is assigned B2C/B2B/Admin roles on registration based on invite code type
  10. User with multiple roles can switch between B2C and B2B contexts with appropriate permissions
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md -- Marketing editorial layout with luxury nav, footer, and invite code entry page (Wave 1)
- [x] 02-02-PLAN.md -- Homepage parallax scroll story, Philosophy page, Privacy Charter page (Wave 2)
- [x] 02-03-PLAN.md -- NextAuth v5 with JWT sessions, Credentials provider, invite code validation, registration page (Wave 1)
- [x] 02-04-PLAN.md -- MFA setup/verify, device recognition, trusted device management, context switching (Wave 2)

### Phase 3: B2C Sovereign Experience
**Goal**: Deliver complete UHNI narrative experience with intent intelligence, journey generation, memory vault, advisor collaboration, and privacy-sovereign controls
**Depends on**: Phase 2
**Requirements**: BREF-01, BREF-02, BREF-03, BREF-04, BREF-05, BREF-06, INTN-01, INTN-02, INTN-03, INTN-04, INTN-05, INTN-06, INTN-07, INTN-08, INTN-09, JRNY-01, JRNY-02, JRNY-03, JRNY-04, JRNY-05, JRNY-06, JRNY-07, JRNY-08, JRNY-09, JRNY-10, COLB-01, COLB-02, COLB-03, COLB-04, COLB-05, COLB-06, INTL-01, INTL-02, INTL-03, INTL-04, INTL-05, VALT-01, VALT-02, VALT-03, VALT-04, VALT-05, VALT-06, VALT-07, VALT-08, VALT-09, PRIV-01, PRIV-02, PRIV-03, PRIV-04, PRIV-05, PRIV-06, PRIV-07, PRIV-08, PRIV-09, ROLE-01, ROLE-02, ROLE-03, ROLE-04
**Success Criteria** (what must be TRUE):
  1. UHNI can view Sovereign Briefing overview with emotional phase indicator, balance summary, upcoming journeys, risk status, discretion tier, and advisor message preview
  2. UHNI can complete multi-step intake wizard (life phase -> emotional outcome -> travel mode -> priorities -> discretion) and generate Emotional Travel DNA
  3. UHNI can view Intent Profile with alignment baseline calculation and edit/regenerate flow
  4. UHNI can view 3-5 AI-generated narrative journeys with emotional objective, strategic reasoning, risk summary, and discretion annotation
  5. UHNI can confirm journey (end-to-end flow: CTA -> state change -> confirmation display)
  6. UHNI can refine journey (end-to-end flow: CTA -> modification UI -> regeneration)
  7. UHNI can toggle invisible itinerary to hide journey details from all other roles
  8. UHNI can view journey detail page with full narrative and archive journey
  9. UHNI can initiate secure messaging thread per journey and see full message history
  10. UHNI can configure advisor visibility scope and restrict/remove advisor access
  11. UHNI can view Intelligence Brief with emotional trends, lifestyle patterns, renewal signals, and exposure risk overview in magazine-style layout
  12. UHNI can view memory vault timeline chronologically with emotional tags and milestone markers
  13. UHNI can create, edit, lock, and export memory entries
  14. UHNI can configure family sharing permissions (spouse/heir visibility per entry)
  15. UHNI can erase memory entries permanently with confirmation and cascade deletion
  16. UHNI can select discretion tier with explanations and set invisible itinerary default toggle
  17. UHNI can invite spouse/heir/advisor with end-to-end flows (email invite -> role assignment)
  18. UHNI can trigger global erase action with complete data deletion, cascade across all entities, confirmation dialog, and logout
  19. UHNI can view data visibility rules showing what each role can access
  20. Spouse role sees restricted partial access per UHNI configuration
  21. Legacy Heir role sees view-only access to shared memories and selected journeys
  22. Elan Advisor role sees contextual collaboration access with journey thread visibility and limited intel view
**Plans**: 7 plans

Plans:
- [x] 03-01-PLAN.md — Install Phase 3 deps, Sovereign Briefing overview with 6 data sections (Wave 1)
- [x] 03-02-PLAN.md — Intent Intelligence 5-step wizard, Emotional Travel DNA, Intent Profile view (Wave 2)
- [x] 03-03-PLAN.md — Journey Intelligence engine, narrative generation, confirm/refine/archive/invisible flows (Wave 2)
- [x] 03-04-PLAN.md — Memory Vault timeline, CRUD flows, family sharing, lock/export/erase with cascade (Wave 2)
- [x] 03-05-PLAN.md — Advisor Collaboration messaging, Intelligence Brief magazine layout (Wave 3)
- [x] 03-06-PLAN.md — Privacy controls, invite flows, advisor visibility, data visibility rules (Wave 3)
- [x] 03-07-PLAN.md — Global erase with cascade, B2C role enforcement for Spouse/Heir/Advisor (Wave 4)

### Phase 4: B2B Institutional Portal
**Goal**: Build premium institutional dashboard for relationship managers and compliance officers to manage multiple UHNI clients with governance workflows and risk intelligence
**Depends on**: Phase 3
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, CLNT-01, CLNT-02, CLNT-03, CLNT-04, CLNT-05, GOVN-01, GOVN-02, GOVN-03, GOVN-04, GOVN-05, GOVN-06, RISK-01, RISK-02, RISK-03, RISK-04, RISK-05, ACCS-01, ACCS-02, ACCS-03, ACCS-04, ACCS-05, GVLT-01, GVLT-02, GVLT-03, GVLT-04, REVN-01, REVN-02, REVN-03, REVN-04, REVN-05, BRLE-01, BRLE-02, BRLE-03, BRLE-04, BRLE-05, BRLE-06
**Success Criteria** (what must be TRUE):
  1. Relationship Manager can view portfolio overview with all assigned UHNI clients and status indicators
  2. RM can view risk heat map showing risk levels across client portfolio
  3. RM can view journey pipeline tracker showing journey states across all clients
  4. RM can view emotional insight comparison with client emotional profile cards
  5. RM can view NDA tracker and compliance alerts
  6. RM can view revenue metrics with contribution and billing overview
  7. RM can create UHNI client records with end-to-end onboarding flow
  8. RM can conduct emotional intake wizard on behalf of client
  9. RM can assign/reassign advisors to clients
  10. RM can track journey lifecycle per client with status timeline
  11. RM can view client intelligence history with historical data and trends
  12. RM can generate journey simulation draft for client
  13. RM can review and modify journey before submission
  14. Compliance Officer can approve/reject journeys in formal state machine workflow (DRAFT -> RM_REVIEW -> COMPLIANCE_REVIEW -> APPROVED)
  15. RM can view immutable version history for journeys with diffs
  16. RM can export client presentation document for journey
  17. RM can track post-approval journey execution status
  18. RM can view geopolitical risk map and travel advisories (mock data)
  19. Compliance Officer can view exposure risk analytics and flag compliance issues
  20. RM can document insurance logs
  21. Institutional Admin can assign privilege tiers and configure role permissions
  22. Institutional Admin can manage multi-role RBAC assignments
  23. Institutional Admin can configure approval routing chains
  24. Institutional Admin can view access registry logs and audit trail (who accessed what, when)
  25. RM can view governed memory vault with shared visibility between RM and client
  26. RM can export memory vault reports with audit tracking
  27. Institutional Admin can configure retention policy management
  28. Institutional Admin can track enterprise licenses per institution
  29. Institutional Admin can view client billing overview and usage metrics
  30. Institutional Admin can monitor SLA compliance and contract renewals
  31. Relationship Manager role enforced per permissions matrix (operational control)
  32. Private Banker role enforced per permissions matrix (strategic oversight)
  33. Family Office Director role enforced per permissions matrix (supervisory)
  34. Compliance Officer role enforced per permissions matrix (governance gatekeeper)
  35. Institutional Admin role enforced per permissions matrix (institution-scoped platform control)
  36. UHNI Portal role enforced per permissions matrix (view-only enterprise view)
**Plans**: 5 plans

Plans:
- [x] 04-01-PLAN.md — Install deps, B2B mock services (client/risk/contract/audit), journey state machine, DataTable component, full Portfolio Dashboard (Wave 1)
- [x] 04-02-PLAN.md — Client Management: client list, onboarding wizard, RM-led intake, advisor assignment, journey timeline, intelligence history (Wave 2)
- [x] 04-03-PLAN.md — Journey Governance: pipeline view, journey simulation, state machine approval workflow, version history with diffs, presentation export, execution tracking (Wave 2)
- [x] 04-04-PLAN.md — Risk Intelligence (geopolitical map, advisories, analytics, insurance, compliance flags), Access Engineering (RBAC, routing, audit), Governed Memory Vault (Wave 2)
- [x] 04-05-PLAN.md — Revenue & Contracts (licenses, billing, SLA, usage, renewals), B2B role enforcement across all routes (Wave 3)

### Phase 5: Platform Administration
**Goal**: Provide meta-layer for platform operations — invite management, member/institution management, audit logs, and system monitoring
**Depends on**: Phase 4
**Requirements**: ADMN-01, ADMN-02, ADMN-03, ADMN-04, ADMN-05, ADMN-06, ADMN-07, ADMN-08, ADMN-09, GVRN-01, GVRN-02, GVRN-03, GVRN-04, GVRN-05, GVRN-06
**Success Criteria** (what must be TRUE):
  1. Super Admin can generate invite codes with configurable expiry and usage limits
  2. Super Admin can track invite code status (pending/used/expired) with usage history
  3. Super Admin can approve, suspend, or remove UHNI members with state change audit trail
  4. Super Admin can onboard new institutions with guided setup workflow
  5. Super Admin can edit, suspend, or remove institutions
  6. Super Admin can search and filter platform-wide audit logs with entity/action/user/timestamp filters
  7. Super Admin can view system health monitoring with uptime, performance, and error tracking
  8. Super Admin can view revenue/billing overview across all institutions
  9. Super Admin role enforcement grants full platform access
  10. Multi-level approval routing configured per institution
  11. Every state change logged immutably in audit trail
  12. Compliance workflow integrated with review gates in journey governance
  13. Version history tracked for all governed entities (journeys, client records)
  14. Role-based UI exposure ensures UI elements shown/hidden per role across all contexts
  15. Institutional branding controls allow custom branding per institution
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md — Enhanced admin layout, full dashboard with live stats, invite code management with DataTable/generate/revoke (Wave 1)
- [x] 05-02-PLAN.md — UHNI member management (list/detail/approve/suspend/remove), institution management (list/onboarding wizard/edit/suspend) (Wave 2)
- [x] 05-03-PLAN.md — Platform-wide audit logs with multi-filter, system health monitoring with Recharts, revenue overview, admin role enforcement, governance infrastructure (approval routing, branding, version history) (Wave 3)

### Phase 6: Polish & Quality Assurance
**Goal**: Achieve Dribbble-level UI quality with cinematic motion design, responsive mobile/desktop experiences, accessibility compliance, performance optimization, and comprehensive testing
**Depends on**: Phase 5
**Requirements**: Addresses all features from Phases 1-5 with quality enhancements
**Success Criteria** (what must be TRUE):
  1. Page transitions animate smoothly with Framer Motion across all route groups
  2. Parallax scroll effects work on marketing homepage and B2C narrative pages
  3. Micro-interactions provide feedback on all CTAs (hover, click, loading states)
  4. Mobile layouts render perfectly on iOS/Android with touch-optimized interactions
  5. Desktop layouts use full viewport with luxury spacing and typography
  6. Container queries adapt components responsively within route groups
  7. Lighthouse performance scores 95+ for LCP, FID, CLS across all pages
  8. Images optimized with Next.js Image component and font subsetting applied
  9. ARIA labels, keyboard navigation, and screen reader support implemented across all components
  10. WCAG AAA compliance achieved for color contrast and focus indicators
  11. Playwright E2E tests cover critical paths (B2C intake -> journey generation, B2B client onboarding -> governance approval, Admin invite generation -> member activation)
  12. Vitest unit tests cover RBAC permission resolution, service layer contracts, cascade deletion logic
  13. Visual regression tests catch design system drift
  14. RBAC edge cases tested (dual-context users, permission boundaries, role transitions)
  15. Cascade delete verification tested across all entity dependencies
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md — Parallax variants, useScrollProgress hook, micro-interaction enhancements (Button/Card), marketing homepage parallax polish, B2C scroll-reveals, nav glassmorphism (Wave 1)
- [x] 06-02-PLAN.md — Container queries plugin, responsive mobile layouts for all 4 route groups, touch targets, Next.js Image/Font optimization, performance config (Wave 1)
- [x] 06-03-PLAN.md — Vitest + Playwright setup, ARIA/keyboard/focus accessibility on shared components, RBAC unit tests (11 roles), service contract tests, cascade deletion tests, E2E critical paths (3 flows), visual regression baseline (Wave 2)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 5/5 | Complete | 2026-02-15 |
| 2. Marketing & Authentication | 4/4 | Complete | 2026-02-16 |
| 3. B2C Sovereign Experience | 7/7 | Complete | 2026-02-16 |
| 4. B2B Institutional Portal | 5/5 | Complete | 2026-02-16 |
| 5. Platform Administration | 3/3 | Complete | 2026-02-16 |
| 6. Polish & Quality Assurance | 3/3 | Complete | 2026-02-16 |

---
*Roadmap created: 2026-02-15*
*Last updated: 2026-02-16 — Phase 6 complete (3/3 plans, 15 success criteria verified). All phases complete.*
