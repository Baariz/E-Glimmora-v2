# Élan Glimmora

## What This Is

Élan Glimmora is a sovereign lifestyle intelligence platform for Ultra High Net Worth Individuals (UHNI). It orchestrates emotionally aligned experiences — journeys, memories, risk awareness — through two modes: a private B2C suite where the UHNI has absolute control, and a B2B institutional portal where private banks and family offices manage multiple UHNI clients with governance and compliance workflows. A platform admin layer manages the entire ecosystem.

## Core Value

Every UHNI interaction must feel like a luxury experience, not software — emotionally intelligent, privacy-sovereign, and narratively driven. The UI is the product.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Marketing & Brand**
- [ ] Public editorial brand website with philosophy, privacy charter
- [ ] Editorial scroll story hero with rich parallax
- [ ] Invite-only membership flow with invite code entry
- [ ] Invite-only onboarding sequence

**Authentication & Access**
- [ ] Invite-only registration (real auth via NextAuth)
- [ ] Multi-factor authentication
- [ ] Device recognition
- [ ] Session management
- [ ] Role assignment per context (B2C/B2B/Admin)

**B2C — Sovereign Briefing (Overview)**
- [ ] Current emotional phase indicator
- [ ] Emotional balance summary
- [ ] Upcoming journey preview
- [ ] Risk status (simplified)
- [ ] Discretion tier display
- [ ] Advisor message preview

**B2C — Intent Intelligence Module**
- [ ] Multi-step intake: life phase, emotional outcome, travel mode, priorities, discretion
- [ ] Emotional Travel DNA generation
- [ ] Intent Profile creation and storage
- [ ] Alignment baseline calculation

**B2C — Journey Intelligence Engine**
- [ ] AI-generated 3–5 narrative journeys (mock AI for Phase 1)
- [ ] Emotional objective per journey
- [ ] Strategic reasoning display
- [ ] Risk summary per journey
- [ ] Discretion annotation
- [ ] Confirm / Refine actions (end-to-end)
- [ ] Invisible itinerary toggle

**B2C — Advisor Collaboration**
- [ ] Journey-based secure messaging thread
- [ ] Controlled visibility per role
- [ ] Message persistence
- [ ] System state messages

**B2C — Intelligence Brief**
- [ ] Emotional trend insights
- [ ] Lifestyle pattern mapping
- [ ] Renewal cycle signals
- [ ] Exposure risk overview
- [ ] Narrative-style intelligence presentation

**B2C — Memory Vault**
- [ ] Timeline view of memories
- [ ] Emotional tagging
- [ ] Milestone marking
- [ ] Family sharing permissions (spouse/heir)
- [ ] Lock entry
- [ ] Export option
- [ ] Erase permanently (with confirmation)

**B2C — Privacy & Access Control**
- [ ] Discretion tier selector
- [ ] Invisible itinerary default toggle
- [ ] Advisor visibility scope configuration
- [ ] Invite spouse/heir/advisor
- [ ] Global erase action (with cascade)
- [ ] Data visibility rules per role

**B2C — RBAC (4 roles)**
- [ ] UHNI: absolute sovereign control
- [ ] Spouse: restricted partial access
- [ ] Legacy Heir: view-only access
- [ ] Élan Advisor: contextual collaboration access

**B2B — Institutional Dashboard**
- [ ] Portfolio overview (multiple UHNI clients)
- [ ] Risk heat map
- [ ] Journey pipeline tracker
- [ ] Emotional insight comparison
- [ ] NDA tracker
- [ ] Compliance alerts
- [ ] Revenue metrics

**B2B — UHNI Client Profile Management**
- [ ] Create UHNI records
- [ ] Conduct emotional intake (RM-led)
- [ ] Assign advisors
- [ ] Track journey lifecycle
- [ ] View client intelligence history

**B2B — Journey Governance Workflow**
- [ ] Generate journey simulation
- [ ] RM review & modification
- [ ] Compliance approval flow
- [ ] Version control for journeys
- [ ] Client presentation export
- [ ] Execution status tracking

**B2B — Risk Intelligence (Enterprise)**
- [ ] Geopolitical mapping
- [ ] Travel advisories
- [ ] Exposure risk analytics
- [ ] Insurance logs
- [ ] Compliance flags

**B2B — Access Engineering**
- [ ] Privilege tier assignment
- [ ] Multi-role RBAC
- [ ] Approval routing
- [ ] Registry logs
- [ ] Access audit trail

**B2B — Memory Vault (Governed)**
- [ ] Shared visibility between RM + client
- [ ] Report export
- [ ] Audit tracking
- [ ] Retention policy management

**B2B — Revenue & Contracts**
- [ ] Enterprise license tracking
- [ ] Client billing overview
- [ ] SLA monitoring
- [ ] Usage metrics
- [ ] Contract renewal tracking

**B2B — RBAC (6 roles)**
- [ ] Relationship Manager: operational control
- [ ] Private Banker: strategic oversight
- [ ] Family Office Director: supervisory
- [ ] Compliance Officer: governance gatekeeper
- [ ] Institutional Admin: platform control (institution-scoped)
- [ ] UHNI Portal: view-only enterprise view

**Platform Admin**
- [ ] Invite code generation & management
- [ ] UHNI membership management (approve/suspend/remove)
- [ ] Institution onboarding & management
- [ ] Platform-wide audit logs
- [ ] System health monitoring
- [ ] Revenue/billing overview across all clients
- [ ] Marketing site content controls
- [ ] Super Admin role with full platform access

**Core Infrastructure**
- [ ] Emotional AI Engine (mock for v1)
- [ ] Experience Intelligence Graph (mock for v1)
- [ ] Risk Intelligence Engine (mock for v1)
- [ ] Access Registry System
- [ ] Memory Vault Infrastructure
- [ ] Messaging & Collaboration Engine
- [ ] Role-Based Access Control engine (context-aware B2C/B2B)
- [ ] Audit & Event Tracking System (immutable logs)
- [ ] Data Privacy & Sovereignty Layer
- [ ] Service abstraction layer (backend-agnostic)

**Data Model (15+ entities)**
- [ ] User, Role, Institution, IntentProfile
- [ ] Journey, JourneyVersion, RiskRecord
- [ ] MemoryItem, MessageThread, Message
- [ ] PrivacySettings, AccessPermission, AuditLog
- [ ] Contract, RevenueRecord

### Out of Scope

- Real AI inference engine — mock narratives for v1, real AI in Phase 3
- Mobile native app — responsive web only
- Real payment processing — mock billing/revenue tracking
- Real geopolitical data feeds — mock risk data
- Real-time notifications (push) — in-app only for v1
- Backend API server — frontend with mock services, real backend later

## Context

- Greenfield project — empty git repo, building from scratch
- Client's primary focus is **UI quality** — Dribbble-level, no compromise
- Every CTA must have end-to-end flow — no dead buttons, no "coming soon"
- Complete feature implementation — nothing from SOW should be missing
- Client provided moodboard with specific color palette and typography
- Dual-context RBAC is the hardest architectural piece — same user can exist in B2C and B2B
- Memory Vault global erase has cascade implications across all entities
- Journey versioning + compliance approval is a state machine
- Service abstraction layer is critical — must mirror eventual API contracts

## Constraints

- **Tech Stack**: Next.js App Router — specified in SOW
- **Route Structure**: `/marketing`, `/b2c`, `/b2b`, `/admin` — modular route groups
- **Typography**: Miller Display (serif headings) + Avenir LT Std (sans body) — client-specified, licensed fonts, files to be provided
- **Color Palette**: Dusty Rose (#B5877E), Sand (#C4AA82), Deep Olive (#5E6B4A), Muted Teal (#6A8E92), Ochre Gold (#B5A24C) — from client moodboard
- **B2C UX**: Website experience — narrative-driven, low density, NO SaaS dashboard feel
- **B2B UX**: Premium dashboard — corporate luxury, sidebar nav, navy + beige, higher data density
- **Admin UX**: Admin dashboard — functional operations panel
- **Marketing UX**: Editorial scroll story with rich parallax sections
- **Motion**: Rich & cinematic — Framer Motion, page transitions, parallax, micro-interactions
- **Responsive**: Equal priority — desktop and mobile both get full luxury treatment
- **Data Layer**: Mock API + localStorage with service abstraction layer (no real backend yet)
- **Auth**: Real authentication via NextAuth — invite-only, MFA, device recognition
- **Privacy**: Data ownership client-controlled, encryption ready, audit logs for all state changes
- **Roles**: 11 roles across 3 domains (B2C: 4, B2B: 6, Platform: 1)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Light editorial tone for B2C | Client moodboard shows organic, nature-driven, earthy luxury. Cream/ivory backgrounds with earth-tone palette | — Pending |
| B2C as website experience, not dashboard | SOW section 4.3 explicitly says "no SaaS dashboard feeling". Narrative-driven layouts for UHNI | — Pending |
| B2B as premium dashboard | SOW section 5.4 specifies higher data density, sidebar nav, structured layout. Operational needs require dashboard | — Pending |
| Miller Display + Avenir LT Std | Client-specified typography from moodboard. Licensed fonts, files to be provided | — Pending |
| 5-color palette from moodboard | Rose, Sand, Olive, Teal, Gold — replaces generic "earth tones" from SOW | — Pending |
| Mock API + localStorage for v1 | No real backend yet. Service abstraction layer ready for future API swap | — Pending |
| Real auth via NextAuth | Security is non-negotiable for UHNI platform. Invite-only, MFA, device recognition | — Pending |
| Platform Admin role added | SOW gap — no super admin defined. Added for invite management, institution onboarding, platform monitoring | — Pending |
| Rich & cinematic motion design | Framer Motion for page transitions, parallax, micro-interactions. Luxury feel requires polish | — Pending |
| Equal responsive priority | UHNI access from any device. Both desktop and mobile get full treatment | — Pending |

---
*Last updated: 2026-02-15 after initialization*
