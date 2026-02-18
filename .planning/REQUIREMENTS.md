# Requirements: Élan Glimmora

**Defined:** 2026-02-15
**Core Value:** Every UHNI interaction must feel like a luxury experience, not software — emotionally intelligent, privacy-sovereign, and narratively driven. The UI is the product.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Design System

- [x] **FNDX-01**: Project scaffolded with Next.js 15 App Router, TypeScript, Tailwind CSS
- [x] **FNDX-02**: Design system tokens defined — color palette (Rose, Sand, Olive, Teal, Gold), typography (Miller Display + Avenir LT Std), spacing, shadows
- [x] **FNDX-03**: Shared UI primitives built on Radix UI — Button, Input, Card, Modal, Dropdown, Accordion, Tabs
- [x] **FNDX-04**: Framer Motion animation system — page transitions, scroll-triggered animations, micro-interactions, parallax utilities
- [x] **FNDX-05**: Responsive grid system — desktop + mobile equal priority with container queries
- [x] **FNDX-06**: Four route group layouts established — (marketing), (b2c), (b2b), (admin)
- [x] **FNDX-07**: TypeScript entity types defined for all 15+ data entities
- [x] **FNDX-08**: Service abstraction layer with interface contracts — mock implementations backed by localStorage
- [x] **FNDX-09**: RBAC engine — permission matrices for 11 roles across 3 domains, context-aware filtering
- [x] **FNDX-10**: Audit event system — immutable append-only logging with entity/action/user/timestamp/state tracking

### Marketing & Brand Website

- [x] **MKTG-01**: Editorial homepage with rich parallax scroll story sections
- [x] **MKTG-02**: Philosophy & approach page
- [x] **MKTG-03**: Privacy charter page
- [x] **MKTG-04**: Invite-only membership flow — invite code entry field with validation
- [x] **MKTG-05**: Invite-only onboarding sequence — guided registration after valid invite code
- [x] **MKTG-06**: Marketing layout with luxury editorial navigation

### Authentication & Access

- [x] **AUTH-01**: Invite-only registration via NextAuth — user cannot register without valid invite code
- [x] **AUTH-02**: Multi-factor authentication setup and verification
- [x] **AUTH-03**: Device recognition — trusted device management
- [x] **AUTH-04**: Session management — persistent sessions, logout from any page, session timeout
- [x] **AUTH-05**: Role assignment per context — user assigned B2C/B2B/Admin roles on registration
- [x] **AUTH-06**: Context switching — same user can switch between B2C and B2B views with role-appropriate permissions

### B2C — Sovereign Briefing (Overview)

- [x] **BREF-01**: Current emotional phase indicator with visual representation
- [x] **BREF-02**: Emotional balance summary — narrative-style display
- [x] **BREF-03**: Upcoming journey preview cards
- [x] **BREF-04**: Risk status display — simplified, non-technical
- [x] **BREF-05**: Discretion tier display — current privacy level indicator
- [x] **BREF-06**: Advisor message preview — latest thread summary

### B2C — Intent Intelligence Module

- [x] **INTN-01**: Multi-step intake wizard — current life phase selection
- [x] **INTN-02**: Multi-step intake wizard — desired emotional outcome capture
- [x] **INTN-03**: Multi-step intake wizard — travel mode selection (Solo/Family/Network)
- [x] **INTN-04**: Multi-step intake wizard — lifestyle priorities ranking
- [x] **INTN-05**: Multi-step intake wizard — discretion preferences configuration
- [x] **INTN-06**: Emotional Travel DNA generation from intake data (mock AI)
- [x] **INTN-07**: Intent Profile creation, storage, and display
- [x] **INTN-08**: Alignment baseline calculation and visualization
- [x] **INTN-09**: Edit/regenerate intent profile flow

### B2C — Journey Intelligence Engine

- [x] **JRNY-01**: AI-generated 3–5 narrative journeys per intent profile (mock AI narratives)
- [x] **JRNY-02**: Emotional objective display per journey
- [x] **JRNY-03**: Strategic reasoning display per journey
- [x] **JRNY-04**: Risk summary per journey
- [x] **JRNY-05**: Discretion annotation per journey
- [x] **JRNY-06**: Confirm journey action — end-to-end flow (CTA → state change → confirmation)
- [x] **JRNY-07**: Refine journey action — end-to-end flow (CTA → modification UI → regeneration)
- [x] **JRNY-08**: Invisible itinerary toggle — hide journey details from all other roles
- [x] **JRNY-09**: Journey archive flow
- [x] **JRNY-10**: Journey detail page with full narrative view

### B2C — Advisor Collaboration

- [x] **COLB-01**: Journey-based secure messaging thread — one thread per journey
- [x] **COLB-02**: Controlled visibility per role — UHNI controls what advisor sees
- [x] **COLB-03**: Message persistence — full history maintained
- [x] **COLB-04**: System state messages — automated messages for journey state changes
- [x] **COLB-05**: Initiate new thread flow
- [x] **COLB-06**: Restrict/remove advisor access flow

### B2C — Intelligence Brief

- [x] **INTL-01**: Emotional trend insights — narrative-style presentation
- [x] **INTL-02**: Lifestyle pattern mapping — visual representation
- [x] **INTL-03**: Renewal cycle signals display
- [x] **INTL-04**: Exposure risk overview — simplified for B2C
- [x] **INTL-05**: Full intelligence brief page — magazine-style layout

### B2C — Memory Vault

- [x] **VALT-01**: Timeline view of all memories — chronological with visual timeline
- [x] **VALT-02**: Emotional tagging — assign emotional context to entries
- [x] **VALT-03**: Milestone marking — flag significant life events
- [x] **VALT-04**: Family sharing permissions — configure which entries spouse/heir can see
- [x] **VALT-05**: Lock entry — prevent modification (with unlock flow)
- [x] **VALT-06**: Export option — download memory entries
- [x] **VALT-07**: Erase permanently — delete with confirmation dialog and cascade
- [x] **VALT-08**: Create new memory entry flow
- [x] **VALT-09**: Edit existing memory entry flow

### B2C — Privacy & Access Control

- [x] **PRIV-01**: Discretion tier selector — choose privacy level with explanations
- [x] **PRIV-02**: Invisible itinerary default toggle — all new journeys hidden by default
- [x] **PRIV-03**: Advisor visibility scope configuration — granular control over what advisor sees
- [x] **PRIV-04**: Invite spouse flow — end-to-end (CTA → email invite → role assignment)
- [x] **PRIV-05**: Invite heir flow — end-to-end
- [x] **PRIV-06**: Invite advisor flow — end-to-end
- [x] **PRIV-07**: Remove access flow — revoke any invited role
- [x] **PRIV-08**: Global erase action — complete data deletion with cascade, confirmation, and logout
- [x] **PRIV-09**: Data visibility rules display — see what each role can access

### B2C — Role Enforcement

- [x] **ROLE-01**: UHNI role — absolute sovereign control, all B2C features accessible
- [x] **ROLE-02**: Spouse role — restricted partial access per UHNI configuration
- [x] **ROLE-03**: Legacy Heir role — view-only access to shared memories and selected journeys
- [x] **ROLE-04**: Élan Advisor role — contextual collaboration, journey thread access, limited intel view

### B2B — Institutional Dashboard

- [x] **DASH-01**: Portfolio overview — all assigned UHNI clients with status indicators
- [x] **DASH-02**: Risk heat map — visual risk level across client portfolio
- [x] **DASH-03**: Journey pipeline tracker — journey states across all clients
- [x] **DASH-04**: Emotional insight comparison — client emotional profile cards
- [x] **DASH-05**: NDA tracker — active NDAs with status
- [x] **DASH-06**: Compliance alerts — flagged items requiring attention
- [x] **DASH-07**: Revenue metrics — contribution and billing overview

### B2B — UHNI Client Profile Management

- [x] **CLNT-01**: Create UHNI records — end-to-end client onboarding flow
- [x] **CLNT-02**: Conduct emotional intake (RM-led) — guided intake wizard on behalf of client
- [x] **CLNT-03**: Assign advisors — assign/reassign advisors to clients
- [x] **CLNT-04**: Track journey lifecycle — per-client journey status timeline
- [x] **CLNT-05**: View client intelligence history — historical data and trends

### B2B — Journey Governance Workflow

- [x] **GOVN-01**: Generate journey simulation — create journey draft for client
- [x] **GOVN-02**: RM review & modification — edit journey before submission
- [x] **GOVN-03**: Compliance approval flow — submit → review → approve/reject state machine
- [x] **GOVN-04**: Version control for journeys — immutable version history with diffs
- [x] **GOVN-05**: Client presentation export — generate presentable journey document
- [x] **GOVN-06**: Execution status tracking — post-approval journey lifecycle tracking

### B2B — Risk Intelligence (Enterprise)

- [x] **RISK-01**: Geopolitical mapping — visual risk map display (mock data)
- [x] **RISK-02**: Travel advisories — per-region risk information
- [x] **RISK-03**: Exposure risk analytics — client risk exposure calculations
- [x] **RISK-04**: Insurance logs — document insurance records
- [x] **RISK-05**: Compliance flags — flag and track compliance issues

### B2B — Access Engineering

- [x] **ACCS-01**: Privilege tier assignment — configure role permissions per institution
- [x] **ACCS-02**: Multi-role RBAC management — assign multiple roles to institutional users
- [x] **ACCS-03**: Approval routing — configure approval chain workflows
- [x] **ACCS-04**: Registry logs — access request/change history
- [x] **ACCS-05**: Access audit trail — who accessed what, when, with full history

### B2B — Memory Vault (Governed Mode)

- [x] **GVLT-01**: Shared visibility between RM + client — governed view of client memories
- [x] **GVLT-02**: Report export — generate memory vault reports
- [x] **GVLT-03**: Audit tracking — track all vault access in governed mode
- [x] **GVLT-04**: Retention policy management — configure data retention rules

### B2B — Revenue & Contracts

- [x] **REVN-01**: Enterprise license tracking — active licenses per institution
- [x] **REVN-02**: Client billing overview — per-client billing summary
- [x] **REVN-03**: SLA monitoring — service level agreement tracking
- [x] **REVN-04**: Usage metrics — platform usage statistics
- [x] **REVN-05**: Contract renewal tracking — upcoming renewals and status

### B2B — Role Enforcement

- [x] **BRLE-01**: Relationship Manager role — operational control per permissions matrix
- [x] **BRLE-02**: Private Banker role — strategic oversight per permissions matrix
- [x] **BRLE-03**: Family Office Director role — supervisory per permissions matrix
- [x] **BRLE-04**: Compliance Officer role — governance gatekeeper per permissions matrix
- [x] **BRLE-05**: Institutional Admin role — platform control (institution-scoped)
- [x] **BRLE-06**: UHNI Portal role — view-only enterprise view

### Platform Admin

- [x] **ADMN-01**: Invite code generation — create and manage invite codes
- [x] **ADMN-02**: Invite code tracking — status, usage, expiry
- [x] **ADMN-03**: UHNI membership management — approve, suspend, remove members
- [x] **ADMN-04**: Institution onboarding — guided setup for new institutions
- [x] **ADMN-05**: Institution management — edit, suspend, remove institutions
- [x] **ADMN-06**: Platform-wide audit logs — searchable, filterable audit trail
- [x] **ADMN-07**: System health monitoring — uptime, performance, error tracking
- [x] **ADMN-08**: Revenue/billing overview — cross-institution financial summary
- [x] **ADMN-09**: Super Admin role enforcement — full platform access

### B2B Governance Requirements

- [x] **GVRN-01**: Multi-level approval routing — configurable approval chains
- [x] **GVRN-02**: Audit trail logging — every state change logged immutably
- [x] **GVRN-03**: Compliance workflow — integrated compliance review gates
- [x] **GVRN-04**: Version history tracking — full history for all governed entities
- [x] **GVRN-05**: Role-based UI exposure — UI elements shown/hidden per role
- [x] **GVRN-06**: Institutional branding controls — custom branding per institution

## v2 Requirements

Deferred per SOW Phase 2/3 scope.

### Advanced Intelligence (SOW Phase 3)

- **ADVI-01**: Predictive emotional modeling — real AI replacing mocks
- **ADVI-02**: Graph intelligence engine — relationship mapping across entities
- **ADVI-03**: Real-time risk engine — live data feeds replacing mock risk data
- **ADVI-04**: Enhanced encryption layer — additional security hardening

### Future Enhancements

- **FUTR-01**: Real backend API server (REST or GraphQL)
- **FUTR-02**: Real payment processing
- **FUTR-03**: Real geopolitical data feed integration
- **FUTR-04**: Push notifications (real-time)
- **FUTR-05**: Mobile native app (currently responsive web)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real AI inference engine | Mock narratives for v1 per SOW Phase 3 |
| Mobile native app | Responsive web covers all devices per SOW |
| Real payment processing | Mock billing sufficient for v1 |
| Real geopolitical data feeds | Mock risk data per SOW Phase 3 |
| Push notifications | In-app notifications only for v1 |
| Backend API server | Frontend with mock services per SOW |
| Social features / community | Anti-feature per research — UHNI expect privacy |
| Gamification | Anti-feature — diminishes luxury gravitas |
| Chatbot interface | Anti-feature — UHNI expect human touch |
| Cross-sell / product recommendations | Anti-feature — breaks trust |
| Email marketing campaigns | Anti-feature — UHNI are over-communicated to |

## Traceability

Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FNDX-01 | Phase 1 | Complete |
| FNDX-02 | Phase 1 | Complete |
| FNDX-03 | Phase 1 | Complete |
| FNDX-04 | Phase 1 | Complete |
| FNDX-05 | Phase 1 | Complete |
| FNDX-06 | Phase 1 | Complete |
| FNDX-07 | Phase 1 | Complete |
| FNDX-08 | Phase 1 | Complete |
| FNDX-09 | Phase 1 | Complete |
| FNDX-10 | Phase 1 | Complete |
| MKTG-01 | Phase 2 | Complete |
| MKTG-02 | Phase 2 | Complete |
| MKTG-03 | Phase 2 | Complete |
| MKTG-04 | Phase 2 | Complete |
| MKTG-05 | Phase 2 | Complete |
| MKTG-06 | Phase 2 | Complete |
| AUTH-01 | Phase 2 | Complete |
| AUTH-02 | Phase 2 | Complete |
| AUTH-03 | Phase 2 | Complete |
| AUTH-04 | Phase 2 | Complete |
| AUTH-05 | Phase 2 | Complete |
| AUTH-06 | Phase 2 | Complete |
| BREF-01 | Phase 3 | Complete |
| BREF-02 | Phase 3 | Complete |
| BREF-03 | Phase 3 | Complete |
| BREF-04 | Phase 3 | Complete |
| BREF-05 | Phase 3 | Complete |
| BREF-06 | Phase 3 | Complete |
| INTN-01 | Phase 3 | Complete |
| INTN-02 | Phase 3 | Complete |
| INTN-03 | Phase 3 | Complete |
| INTN-04 | Phase 3 | Complete |
| INTN-05 | Phase 3 | Complete |
| INTN-06 | Phase 3 | Complete |
| INTN-07 | Phase 3 | Complete |
| INTN-08 | Phase 3 | Complete |
| INTN-09 | Phase 3 | Complete |
| JRNY-01 | Phase 3 | Complete |
| JRNY-02 | Phase 3 | Complete |
| JRNY-03 | Phase 3 | Complete |
| JRNY-04 | Phase 3 | Complete |
| JRNY-05 | Phase 3 | Complete |
| JRNY-06 | Phase 3 | Complete |
| JRNY-07 | Phase 3 | Complete |
| JRNY-08 | Phase 3 | Complete |
| JRNY-09 | Phase 3 | Complete |
| JRNY-10 | Phase 3 | Complete |
| COLB-01 | Phase 3 | Complete |
| COLB-02 | Phase 3 | Complete |
| COLB-03 | Phase 3 | Complete |
| COLB-04 | Phase 3 | Complete |
| COLB-05 | Phase 3 | Complete |
| COLB-06 | Phase 3 | Complete |
| INTL-01 | Phase 3 | Complete |
| INTL-02 | Phase 3 | Complete |
| INTL-03 | Phase 3 | Complete |
| INTL-04 | Phase 3 | Complete |
| INTL-05 | Phase 3 | Complete |
| VALT-01 | Phase 3 | Complete |
| VALT-02 | Phase 3 | Complete |
| VALT-03 | Phase 3 | Complete |
| VALT-04 | Phase 3 | Complete |
| VALT-05 | Phase 3 | Complete |
| VALT-06 | Phase 3 | Complete |
| VALT-07 | Phase 3 | Complete |
| VALT-08 | Phase 3 | Complete |
| VALT-09 | Phase 3 | Complete |
| PRIV-01 | Phase 3 | Complete |
| PRIV-02 | Phase 3 | Complete |
| PRIV-03 | Phase 3 | Complete |
| PRIV-04 | Phase 3 | Complete |
| PRIV-05 | Phase 3 | Complete |
| PRIV-06 | Phase 3 | Complete |
| PRIV-07 | Phase 3 | Complete |
| PRIV-08 | Phase 3 | Complete |
| PRIV-09 | Phase 3 | Complete |
| ROLE-01 | Phase 3 | Complete |
| ROLE-02 | Phase 3 | Complete |
| ROLE-03 | Phase 3 | Complete |
| ROLE-04 | Phase 3 | Complete |
| DASH-01 | Phase 4 | Complete |
| DASH-02 | Phase 4 | Complete |
| DASH-03 | Phase 4 | Complete |
| DASH-04 | Phase 4 | Complete |
| DASH-05 | Phase 4 | Complete |
| DASH-06 | Phase 4 | Complete |
| DASH-07 | Phase 4 | Complete |
| CLNT-01 | Phase 4 | Complete |
| CLNT-02 | Phase 4 | Complete |
| CLNT-03 | Phase 4 | Complete |
| CLNT-04 | Phase 4 | Complete |
| CLNT-05 | Phase 4 | Complete |
| GOVN-01 | Phase 4 | Complete |
| GOVN-02 | Phase 4 | Complete |
| GOVN-03 | Phase 4 | Complete |
| GOVN-04 | Phase 4 | Complete |
| GOVN-05 | Phase 4 | Complete |
| GOVN-06 | Phase 4 | Complete |
| RISK-01 | Phase 4 | Complete |
| RISK-02 | Phase 4 | Complete |
| RISK-03 | Phase 4 | Complete |
| RISK-04 | Phase 4 | Complete |
| RISK-05 | Phase 4 | Complete |
| ACCS-01 | Phase 4 | Complete |
| ACCS-02 | Phase 4 | Complete |
| ACCS-03 | Phase 4 | Complete |
| ACCS-04 | Phase 4 | Complete |
| ACCS-05 | Phase 4 | Complete |
| GVLT-01 | Phase 4 | Complete |
| GVLT-02 | Phase 4 | Complete |
| GVLT-03 | Phase 4 | Complete |
| GVLT-04 | Phase 4 | Complete |
| REVN-01 | Phase 4 | Complete |
| REVN-02 | Phase 4 | Complete |
| REVN-03 | Phase 4 | Complete |
| REVN-04 | Phase 4 | Complete |
| REVN-05 | Phase 4 | Complete |
| BRLE-01 | Phase 4 | Complete |
| BRLE-02 | Phase 4 | Complete |
| BRLE-03 | Phase 4 | Complete |
| BRLE-04 | Phase 4 | Complete |
| BRLE-05 | Phase 4 | Complete |
| BRLE-06 | Phase 4 | Complete |
| ADMN-01 | Phase 5 | Complete |
| ADMN-02 | Phase 5 | Complete |
| ADMN-03 | Phase 5 | Complete |
| ADMN-04 | Phase 5 | Complete |
| ADMN-05 | Phase 5 | Complete |
| ADMN-06 | Phase 5 | Complete |
| ADMN-07 | Phase 5 | Complete |
| ADMN-08 | Phase 5 | Complete |
| ADMN-09 | Phase 5 | Complete |
| GVRN-01 | Phase 5 | Complete |
| GVRN-02 | Phase 5 | Complete |
| GVRN-03 | Phase 5 | Complete |
| GVRN-04 | Phase 5 | Complete |
| GVRN-05 | Phase 5 | Complete |
| GVRN-06 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 116 total
- Mapped to phases: 116 (100% coverage)
- Unmapped: 0

---
*Requirements defined: 2026-02-15*
*Last updated: 2026-02-16 — Phase 5 requirements complete (ADMN-01-09, GVRN-01-06)*
