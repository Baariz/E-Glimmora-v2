# Élan Glimmora — Client Presentation Document

> **Sovereign Lifestyle Intelligence Platform for Ultra High Net Worth Individuals**
> Version 1.0 · Confidential

---

## Table of Contents

1. [What is Élan Glimmora?](#1-what-is-élan-glimmora)
2. [Platform Architecture — The Three Layers](#2-platform-architecture--the-three-layers)
3. [Portal 1 — Marketing & Brand Website](#3-portal-1--marketing--brand-website)
4. [Portal 2 — B2C Sovereign Experience (UHNI Private Suite)](#4-portal-2--b2c-sovereign-experience-uhni-private-suite)
5. [Portal 3 — B2B Institutional Portal](#5-portal-3--b2b-institutional-portal)
6. [Portal 4 — Platform Administration](#6-portal-4--platform-administration)
7. [Roles & Access — Complete Breakdown](#7-roles--access--complete-breakdown)
8. [Security & Privacy Architecture](#8-security--privacy-architecture)
9. [Design Philosophy & Technology](#9-design-philosophy--technology)
10. [Feature Completion Summary](#10-feature-completion-summary)

---

## 1. What is Élan Glimmora?

Élan Glimmora is a **sovereign lifestyle intelligence platform** built exclusively for Ultra High Net Worth Individuals (UHNI). It is not a travel booking tool, not a CRM, and not a generic wealth management dashboard. It is something entirely different:

> A private digital environment where a UHNI's life journey — their emotional states, curated experiences, memories, and trusted relationships — is orchestrated with complete privacy and absolute personal control.

### The Core Problem It Solves

UHNI clients interact with multiple private banks, family offices, advisors, and concierge services — each holding a fragment of their life. There is no unified, private, emotionally intelligent space that belongs to the client alone. Élan Glimmora creates that space.

### Two Modes of Access

| Mode | Who Uses It | What It Does |
|------|-------------|--------------|
| **B2C — Private Suite** | The UHNI themselves, their spouse, heir, or advisor | Sovereign personal experience — journeys, memories, intelligence, privacy |
| **B2B — Institutional Portal** | Private banks, family offices, relationship managers | Manage multiple UHNI clients with governance, compliance, and risk tools |

A third layer — **Platform Administration** — manages the entire ecosystem: onboarding institutions, generating invite codes, monitoring system health.

---

## 2. Platform Architecture — The Three Layers

```
┌─────────────────────────────────────────────────────────┐
│               PLATFORM ADMINISTRATION                    │
│    Super Admin · Invite Codes · Institutions · Audit     │
├──────────────────────────┬──────────────────────────────┤
│   B2C SOVEREIGN SUITE    │   B2B INSTITUTIONAL PORTAL   │
│   UHNI Private Portal    │   Private Banks · Family     │
│   Spouse · Heir          │   Offices · Relationship     │
│   Élan Advisor           │   Managers · Compliance      │
├──────────────────────────┴──────────────────────────────┤
│              MARKETING & BRAND WEBSITE                   │
│       Public Editorial Presence · Invite-Only Entry      │
└─────────────────────────────────────────────────────────┘
```

### Invite-Only by Design

The platform is **not publicly accessible**. Every member enters through an invite code issued by the Platform Administrator. This single design decision communicates exclusivity from the first interaction.

---

## 3. Portal 1 — Marketing & Brand Website

### Purpose
The public-facing editorial website. This is the first thing a prospective UHNI member or institution sees — it must communicate the brand's philosophy before any feature is shown.

### Pages & Features

#### 3.1 Editorial Homepage
- **Parallax scroll story** — multiple rich scroll sections that unfold the brand narrative as the user scrolls
- Luxury editorial navigation — minimal, typographically driven
- Full cinematic motion design with Framer Motion transitions
- The homepage does not look like software — it reads like a luxury editorial magazine

#### 3.2 Philosophy Page
- Brand philosophy and approach to UHNI lifestyle intelligence
- Explains the emotional intelligence model in narrative form
- No feature lists — storytelling only

#### 3.3 Privacy Charter Page
- Detailed commitment to data sovereignty
- Explains what data is collected, who can see it, and how clients maintain control
- A trust document, not a legal disclaimer

#### 3.4 Invite-Only Membership Flow
- Invite code entry field — prominent but understated
- Real-time validation: the code is verified before proceeding
- Valid code unlocks the guided registration sequence
- Invalid code shows dignified error feedback (no generic "error 404" messages)

#### 3.5 Guided Registration (Onboarding)
- Multi-step guided onboarding after invite code validation
- Collects personal details in a luxury, low-friction form experience
- MFA setup is part of onboarding — not bolted on after
- Upon completion, user is assigned their role (UHNI, RM, etc.) based on invite code type and redirected to the appropriate portal

---

## 4. Portal 2 — B2C Sovereign Experience (UHNI Private Suite)

### Purpose
This is the UHNI's private digital home. Every screen prioritises the feeling of a personal luxury journal, not a software dashboard. Low information density, narrative-driven layouts, editorial typography.

### 4.1 Sovereign Briefing (Dashboard Overview)

The first screen after login. Gives the UHNI a calm, comprehensive overview of their world:

| Section | What It Shows |
|---------|---------------|
| **Emotional Phase Indicator** | Visual display of the UHNI's current life phase (Exploration, Consolidation, Renewal, etc.) |
| **Emotional Balance Summary** | Narrative-style paragraph summarising the client's emotional state and trajectory |
| **Upcoming Journey Preview** | Cards for journeys in planning or confirmed state |
| **Risk Status** | Simplified risk overview — no technical jargon |
| **Discretion Tier** | Current privacy level (e.g., Sovereign, Confidential, Discreet) visually displayed |
| **Advisor Message Preview** | Latest unread message from their Élan Advisor |

---

### 4.2 Intent Intelligence Module

Before any journey can be generated, the system needs to understand the UHNI as a person. This module captures that understanding through a **5-step intake wizard**:

**Step 1 — Life Phase Selection**
What stage of life is the UHNI currently in? (e.g., Establishing, Thriving, Transitioning, Legacy)

**Step 2 — Desired Emotional Outcome**
What emotional experience do they seek? (e.g., Deep Restoration, Bold Discovery, Quiet Reflection, Creative Stimulation)

**Step 3 — Travel Mode**
How do they wish to travel? (Solo, With Family, With Network/Associates)

**Step 4 — Lifestyle Priorities Ranking**
The UHNI ranks a set of priorities — Privacy, Wellness, Culture, Adventure, Status, Simplicity — in order of personal importance.

**Step 5 — Discretion Preferences**
How private does this client wish to be? Three tier options with full explanations of what each means for data visibility.

**Output: Emotional Travel DNA**
The five intake steps generate an "Emotional Travel DNA" — a personal profile that drives all journey generation. It is stored as their Intent Profile.

**Intent Profile Features:**
- View their full Emotional Travel DNA at any time
- Alignment baseline — a calculated score showing how well current journeys match their DNA
- Edit and regenerate their profile whenever life changes

---

### 4.3 Journey Intelligence Engine

The core feature of the B2C experience. Based on the Intent Profile, the system generates **3 to 5 narrative journeys** — not itineraries, but story-driven experiences.

**What each Journey contains:**

| Element | Description |
|---------|-------------|
| **Emotional Objective** | The feeling this journey is designed to create |
| **Strategic Reasoning** | Why this journey aligns with the client's current life phase |
| **Risk Summary** | Geopolitical, health, or logistical risks — presented simply |
| **Discretion Annotation** | Notes on privacy implications of this destination/experience |
| **Full Narrative** | The journey described in editorial prose, not a bullet list |

**Journey Actions:**

- **Confirm** — Accept the journey. State changes to Confirmed with a confirmation screen.
- **Refine** — Request modifications. Opens modification UI → regenerates journey with changes.
- **Invisible Itinerary Toggle** — Make this journey completely hidden from all other roles (spouse, heir, advisor, RM). The UHNI's most private option.
- **Archive** — Move a journey to the archive when it is complete or no longer relevant.
- **Journey Detail Page** — Full narrative view with all elements in magazine layout.

---

### 4.4 Intelligence Brief

A magazine-style page that gives the UHNI a deeper analytical view of themselves and their world:

- **Emotional Trend Insights** — How their emotional profile has shifted over time, presented as narrative
- **Lifestyle Pattern Mapping** — Visual representation of recurring patterns in their choices and journeys
- **Renewal Cycle Signals** — Indicators suggesting the UHNI may be due for a renewal journey or life recalibration
- **Exposure Risk Overview** — A simplified view of geopolitical, health, and financial risk relevant to their lifestyle — no alarming dashboards, editorial calm

---

### 4.5 Memory Vault

A private, sovereign archive of the UHNI's most significant life experiences, memories, and milestones.

**Timeline View**
All memories displayed chronologically on a visual timeline. Emotional tags and milestone markers visible at a glance.

**Memory Entry Features:**

| Feature | Description |
|---------|-------------|
| **Create Entry** | Add a new memory with date, description, emotional context |
| **Emotional Tagging** | Assign emotional tags (Joy, Grief, Achievement, Wonder, etc.) to each memory |
| **Milestone Marking** | Flag a memory as a life milestone — displayed distinctly on the timeline |
| **Edit Entry** | Modify any unlocked memory |
| **Lock Entry** | Prevent any further modification to a memory — a permanent record |
| **Unlock Entry** | Reverse a lock with intentional confirmation |
| **Export** | Download a memory entry as a formatted document |
| **Erase Permanently** | Delete a memory with a confirmation dialog and complete cascade deletion across all related data |

**Family Sharing Permissions**
The UHNI controls exactly which entries are visible to their invited Spouse or Legacy Heir. Each entry can independently be shared or kept private.

---

### 4.6 Advisor Collaboration

Structured secure messaging between the UHNI and their Élan Advisor, tied to specific journeys:

- **Journey Thread** — Each journey has its own messaging thread. Conversations stay contextual.
- **Full Message History** — Every message is persisted and visible in chronological order
- **System State Messages** — Automated messages appear when journey state changes (e.g., "Journey confirmed on 14 Feb 2026")
- **Controlled Visibility** — The UHNI configures what the advisor can and cannot see
- **Restrict/Remove Advisor Access** — Full control to narrow or revoke advisor access at any time

---

### 4.7 Privacy & Access Control

The most powerful section of the B2C suite. The UHNI has absolute sovereignty over their data.

**Discretion Tier Selector**
Three tiers with full plain-English explanations of what each means:
- **Sovereign** — Maximum privacy. Advisors see nothing. Spouse and heir see only what is explicitly shared.
- **Confidential** — Advisor sees journey summaries only. Family sees shared memories.
- **Discreet** — Advisor sees full journey context. Family sees broader access.

**Invisible Itinerary Default**
Toggle: all new journeys are hidden from all roles by default until the UHNI explicitly makes them visible.

**Advisor Visibility Scope**
Granular control over exactly what the Élan Advisor can access:
- Journey details (full / summary only / hidden)
- Intelligence Brief access (yes / no)
- Memory Vault (never accessible — always private)

**Invite Family & Advisor**
- Invite Spouse — generates an invite link, assigns Spouse role on registration
- Invite Legacy Heir — same flow with Heir role
- Invite Élan Advisor — same flow with Advisor role
- Remove access — revoke any invited role at any time

**Data Visibility Rules**
A reference screen showing clearly what each role can currently access — a trust-building transparency feature.

**Global Erase**
The most serious privacy feature on the platform. The UHNI can trigger a complete erasure of all their data:
- Confirmation dialog requiring deliberate action
- Cascade deletion across all entities: journeys, memories, messages, intent profiles, audit logs
- Automatic logout and account termination upon completion
- Irreversible — the system makes this crystal clear

---

## 5. Portal 3 — B2B Institutional Portal

### Purpose
A premium operational dashboard for private banks, family offices, and wealth management institutions managing portfolios of UHNI clients. Higher data density than B2C, structured layouts, institutional aesthetic (deep navy, warm beige, data tables).

### 5.1 Institutional Dashboard (Portfolio Overview)

The landing page for all B2B roles. A complete view across the institution's UHNI client portfolio:

| Widget | What It Shows |
|--------|---------------|
| **Portfolio Overview** | All assigned UHNI clients with current status indicators |
| **Risk Heat Map** | Visual grid showing risk levels across the client portfolio |
| **Journey Pipeline Tracker** | All client journeys and their current state (Draft, Under Review, Approved, Active, Complete) |
| **Emotional Insight Comparison** | Side-by-side emotional profile cards for clients — for relationship managers to spot patterns |
| **NDA Tracker** | Active non-disclosure agreements with status and expiry |
| **Compliance Alerts** | Flagged items requiring immediate attention |
| **Revenue Metrics** | Contribution per client, billing overview, month-on-month comparison |

---

### 5.2 UHNI Client Profile Management

Relationship Managers have full tools to manage their client roster:

**Create Client Record**
Full end-to-end UHNI onboarding flow within the B2B context:
- Create the UHNI profile with all personal and relationship details
- The RM conducts the emotional intake wizard on behalf of the client (same 5-step process as B2C)
- Assigns an Élan Advisor to the client

**Client Profile Features:**

| Feature | Description |
|---------|-------------|
| **Advisor Assignment** | Assign or reassign an Élan Advisor to a client at any time |
| **Journey Lifecycle Tracker** | Per-client timeline of all journeys from draft to completion |
| **Client Intelligence History** | Historical view of the client's emotional profile evolution, journey patterns, risk exposure over time |

---

### 5.3 Journey Governance Workflow

The most structured part of the B2B portal. Every UHNI journey managed through institutional channels goes through a formal state machine:

```
DRAFT → RM_REVIEW → COMPLIANCE_REVIEW → APPROVED → ACTIVE → COMPLETE
                         ↓
                      REJECTED (returns to RM_REVIEW)
```

**Step-by-Step:**

1. **Generate Journey Simulation** — The RM creates a journey draft for their client using the intelligence engine
2. **RM Review & Modification** — The RM reviews, edits, and refines the journey before submission
3. **Compliance Review** — The Compliance Officer reviews the journey and approves or rejects with documented reasoning
4. **Version History with Diffs** — Every version of a journey is stored immutably. The RM can see exactly what changed between versions.
5. **Client Presentation Export** — Generate a formatted, presentable document of the approved journey for client delivery
6. **Execution Status Tracking** — Post-approval tracking of the journey as it moves from confirmed to active to complete

---

### 5.4 Risk Intelligence (Enterprise)

A comprehensive risk monitoring suite for institutional use:

| Feature | Description |
|---------|-------------|
| **Geopolitical Risk Map** | Visual map showing risk levels by region relevant to active client journeys |
| **Travel Advisories** | Per-region risk information and updated advisories |
| **Exposure Risk Analytics** | Calculated exposure risk scores across the client portfolio |
| **Insurance Logs** | Document and track insurance records for client journeys |
| **Compliance Flags** | Flag and track compliance issues — linked to specific clients or journeys |

---

### 5.5 Access Engineering

The Institutional Admin has complete control over who inside the institution can see what:

| Feature | Description |
|---------|-------------|
| **Privilege Tier Assignment** | Configure permission levels per staff role within the institution |
| **Multi-Role RBAC Management** | Assign multiple roles to institutional users (e.g., someone can be both RM and Private Banker) |
| **Approval Routing Configuration** | Define the approval chain: which role approves what, in what order |
| **Registry Logs** | Complete history of access requests and permission changes |
| **Access Audit Trail** | Immutable log of who accessed which client record, when, and what action they took |

---

### 5.6 Memory Vault (Governed Mode)

The B2B version of the Memory Vault — a governed, institutional view:

| Feature | Description |
|---------|-------------|
| **Shared Visibility** | RM can see the client's memory entries that have been made visible to the institution |
| **Report Export** | Generate formatted memory vault reports for client review meetings |
| **Audit Tracking** | Every access to the governed vault is logged |
| **Retention Policy Management** | Configure how long client memory data is retained per institutional compliance requirements |

---

### 5.7 Revenue & Contracts

For Institutional Admins managing the commercial relationship with the platform:

| Feature | Description |
|---------|-------------|
| **Enterprise License Tracking** | Active licence count, seat usage, available seats |
| **Client Billing Overview** | Per-client billing summary — what each UHNI relationship costs |
| **SLA Monitoring** | Track service level agreement compliance and flag breaches |
| **Usage Metrics** | Platform usage statistics — logins, journeys created, vault entries |
| **Contract Renewal Tracking** | Upcoming contract renewals with status indicators |

---

## 6. Portal 4 — Platform Administration

### Purpose
The meta-layer. The Platform Super Admin manages the entire Élan Glimmora ecosystem from here — no institution-specific constraints. This is the operational centre for the platform owner.

### 6.1 Dashboard
Real-time statistics across the entire platform:
- Total active members, institutions, journeys in progress
- System health indicators
- Recent audit activity feed
- Revenue summary across all institutions

### 6.2 Invite Code Management

| Feature | Description |
|---------|-------------|
| **Generate Invite Code** | Create new codes with configurable expiry date and maximum usage count |
| **Code Types** | Codes can be typed: UHNI, Relationship Manager, Institutional Admin — the invite code determines which role is assigned on registration |
| **Track Status** | Each code shows: Pending / Used / Expired with full usage history |
| **Revoke Code** | Cancel an unused invite code immediately |

### 6.3 UHNI Member Management

| Feature | Description |
|---------|-------------|
| **Member List** | All UHNI members across all institutions with search and filter |
| **Member Detail** | View a member's profile, institution, status, and recent activity |
| **Approve Member** | Manually approve a pending registration |
| **Suspend Member** | Temporarily disable a member's access — reversible |
| **Remove Member** | Permanently remove a member with full audit trail |

Every status change (approve, suspend, remove) creates an immutable audit entry.

### 6.4 Institution Management

| Feature | Description |
|---------|-------------|
| **Institution List** | All onboarded institutions with status |
| **Onboarding Wizard** | Guided multi-step setup for a new institution: details → branding → admin assignment → licence configuration |
| **Edit Institution** | Modify institution details, branding, or configuration |
| **Suspend Institution** | Disable all access for an institution — reversible |
| **Remove Institution** | Permanently offboard an institution with data handling confirmation |
| **Custom Branding** | Each institution can have custom branding applied to their B2B portal |

### 6.5 Platform-Wide Audit Logs

Every state change across the entire platform is logged immutably. The Super Admin can:
- Search by entity (User, Journey, Memory, Institution)
- Filter by action type (Create, Update, Delete, Approve, Suspend)
- Filter by user who performed the action
- Filter by timestamp range
- Export audit logs for compliance reporting

### 6.6 System Health Monitoring

- Uptime tracking with historical record
- Performance metrics (response times, error rates)
- Real-time error tracking and alerts
- Visual charts for trend analysis (Recharts-powered)

### 6.7 Revenue & Billing Overview

Cross-institution financial summary for the platform owner:
- Revenue per institution
- Total platform revenue trends
- Licence utilisation across all institutions
- Billing status overview

---

## 7. Roles & Access — Complete Breakdown

Élan Glimmora has **11 roles** across three domains. The same person can hold roles in multiple domains (e.g., a UHNI who is also seen through an institutional lens).

---

### B2C Roles (4)

#### Role 1 — UHNI (Ultra High Net Worth Individual)
**The sovereign.** Absolute control over everything in their private suite.

| Capability | Access Level |
|------------|-------------|
| Sovereign Briefing | Full |
| Intent Intelligence | Full — create, edit, regenerate |
| Journey Intelligence | Full — view, confirm, refine, archive, invisible toggle |
| Intelligence Brief | Full |
| Memory Vault | Full — create, edit, lock, export, erase |
| Advisor Collaboration | Full — initiate, message, restrict, remove |
| Privacy Controls | Full — all settings, invite flows, global erase |

---

#### Role 2 — Spouse
**Invited by the UHNI.** Sees only what the UHNI has explicitly shared.

| Capability | Access Level |
|------------|-------------|
| Sovereign Briefing | Restricted view — no emotional phase or risk details |
| Journeys | Only journeys not marked invisible and explicitly shared |
| Memory Vault | Only entries marked as shared with spouse |
| Intelligence Brief | No access |
| Privacy Controls | No access — cannot modify UHNI's settings |
| Messaging | Can view and send messages on shared journey threads |

---

#### Role 3 — Legacy Heir
**Invited by the UHNI.** View-only access to selected content for succession planning.

| Capability | Access Level |
|------------|-------------|
| Journeys | View-only on journeys explicitly shared |
| Memory Vault | View-only on entries marked as shared with heir |
| Intelligence Brief | No access |
| Intent Profile | No access |
| Privacy Controls | No access |
| Messaging | No access |

---

#### Role 4 — Élan Advisor
**Invited by the UHNI.** Collaboration-focused access for the trusted advisor.

| Capability | Access Level |
|------------|-------------|
| Journeys | View based on UHNI's visibility configuration (full / summary / hidden) |
| Messaging | Full access to journey threads the UHNI has opened |
| Intelligence Brief | View if UHNI has granted access |
| Memory Vault | Never — this is permanently off-limits to advisors |
| Intent Profile | View — cannot edit |
| Privacy Controls | No access |

---

### B2B Roles (6)

#### Role 5 — Relationship Manager (RM)
**Day-to-day operational control** of the client relationship.

| Capability | Access |
|------------|--------|
| Portfolio Dashboard | Full |
| Client Profile Management | Full — create, conduct intake, assign advisors |
| Journey Governance | Create simulations, review and modify, submit for compliance, track execution |
| Risk Intelligence | Full |
| Governed Memory Vault | View and export |
| Revenue & Contracts | View only |

---

#### Role 6 — Private Banker
**Strategic oversight** across the client portfolio. Senior to the RM.

| Capability | Access |
|------------|--------|
| Portfolio Dashboard | Full |
| Client Profiles | View + strategic notes |
| Journey Governance | Approve or escalate (above RM, below Compliance) |
| Risk Intelligence | Full |
| Revenue & Contracts | Full view including profitability metrics |
| Access Engineering | View only |

---

#### Role 7 — Family Office Director
**Supervisory role** for family office contexts. Oversees multiple RMs.

| Capability | Access |
|------------|--------|
| Portfolio Dashboard | Full — across all RMs they supervise |
| Client Profiles | View only |
| Journey Governance | View and final approval sign-off |
| Risk Intelligence | Full |
| Revenue & Contracts | Full |
| Access Engineering | Configure team-level permissions |

---

#### Role 8 — Compliance Officer
**Governance gatekeeper.** The only role that can formally approve or reject journeys.

| Capability | Access |
|------------|--------|
| Journey Governance | Compliance Review stage — approve / reject with documented reasoning |
| Risk Intelligence | Full — primary user of compliance flags |
| Access Engineering | Full audit trail access |
| Client Profiles | View only — no modification |
| Revenue & Contracts | View compliance-related metrics |
| Compliance Flags | Create, update, resolve |

---

#### Role 9 — Institutional Admin
**Institution-scoped platform control.** Manages everything within their institution.

| Capability | Access |
|------------|--------|
| Access Engineering | Full — privilege tiers, role assignments, approval routing |
| Revenue & Contracts | Full — licences, billing, SLA, renewals |
| Member Management | Within their institution |
| Branding Controls | Configure institutional branding |
| Audit Logs | Institution-scoped audit trail |
| Journey Governance | View only |

---

#### Role 10 — UHNI Portal (B2B View)
**Enterprise view for the UHNI themselves** when accessing through the institutional portal.

| Capability | Access |
|------------|--------|
| Their own journey summaries | View only |
| Their own intelligence brief | View only |
| Messaging with RM | View and send |
| Journey approval status | View |
| No modification of governance | Blocked |
| Memory Vault | View shared entries only |

---

### Platform Role (1)

#### Role 11 — Super Admin
**Full platform access.** No restrictions.

| Capability | Access |
|------------|--------|
| Invite Code Management | Full |
| UHNI Member Management | Full — across all institutions |
| Institution Management | Full |
| Platform-Wide Audit Logs | Full |
| System Health Monitoring | Full |
| Revenue Overview | Full — cross-institution |
| All B2B and B2C portals | Read access for monitoring |

---

## 8. Security & Privacy Architecture

### Authentication
- **Invite-Only Registration** — No public sign-up. Every user enters via an admin-issued invite code.
- **Multi-Factor Authentication (MFA)** — Required setup during onboarding. Time-based OTP (TOTP).
- **Device Recognition** — Trusted devices are remembered. Unrecognised devices trigger additional verification.
- **Session Management** — Persistent sessions with configurable timeout. Global logout available from any page.
- **Role Assignment at Registration** — The invite code type determines which role is assigned, removing manual admin steps.

### Data Sovereignty
- **Discretion Tiers** — UHNI controls the visibility of their data at three levels: Sovereign, Confidential, Discreet.
- **Invisible Itinerary** — Any journey can be made completely invisible to all other roles — including institutional staff.
- **Granular Advisor Scope** — UHNI defines exactly what their advisor can see, independent of their discretion tier.
- **Global Erase** — UHNI can permanently delete all their data at any time. Cascade deletion removes every entity.

### Audit & Compliance
- **Immutable Audit Logs** — Every state change across the platform is logged with entity, action, user, timestamp. Logs cannot be edited or deleted.
- **Version History** — All governed journeys and client records maintain complete version history with diffs.
- **Access Registry** — Every access to a client record is logged. Institutional Admins and Compliance Officers can query this at any time.
- **Approval State Machine** — Journey governance follows a strict state machine. No journey moves from one stage to another without the correct role performing the correct action.

---

## 9. Design Philosophy & Technology

### Design Principles

| Principle | What It Means |
|-----------|---------------|
| **The UI is the product** | For UHNI, the experience of using the platform IS the value. Every screen must feel like a luxury object. |
| **No SaaS dashboard feel (B2C)** | The private UHNI suite is a magazine/journal experience — narrative, low density, editorial typography. |
| **Premium dashboard (B2B)** | The institutional portal earns its complexity — structured, data-rich, but never clinical. |
| **Motion as communication** | Animations communicate state, guide attention, and create the sensation of quality. |
| **Privacy-first visual language** | Privacy controls feel powerful, not technical. Luxury means discretion. |

### Visual Identity
- **Color Palette** — Dusty Rose (#B5877E), Sand (#C4AA82), Deep Olive (#5E6B4A), Muted Teal (#6A8E92), Ochre Gold (#B5A24C)
- **Typography** — Miller Display (serif headings, editorial character) + Avenir LT Std (sans-serif body, clarity)
- **Motion** — Framer Motion throughout: page transitions, parallax scroll, micro-interactions on every CTA, scroll-triggered reveals
- **Responsiveness** — Desktop and mobile receive equal design attention. The luxury experience is not compromised on any device.

### Technology Stack
- **Framework** — Next.js 15 with App Router (React 19)
- **Language** — TypeScript with strict mode
- **Styling** — Tailwind CSS with custom design tokens
- **UI Primitives** — Radix UI (accessible, unstyled base components)
- **Animation** — Framer Motion
- **Authentication** — NextAuth v5 with JWT sessions
- **State Management** — Zustand
- **Data Visualisation** — Recharts
- **Testing** — Vitest (unit) + Playwright (E2E + visual regression)
- **Data Layer** — Mock API with localStorage (service abstraction layer ready for real backend swap)

---

## 10. Feature Completion Summary

### v1.0 — All 116 Requirements Complete

| Portal / Module | Requirements | Status |
|-----------------|-------------|--------|
| Foundation & Design System | 10 | ✅ Complete |
| Marketing & Brand Website | 6 | ✅ Complete |
| Authentication & Access | 6 | ✅ Complete |
| B2C — Sovereign Briefing | 6 | ✅ Complete |
| B2C — Intent Intelligence | 9 | ✅ Complete |
| B2C — Journey Intelligence | 10 | ✅ Complete |
| B2C — Advisor Collaboration | 6 | ✅ Complete |
| B2C — Intelligence Brief | 5 | ✅ Complete |
| B2C — Memory Vault | 9 | ✅ Complete |
| B2C — Privacy & Access Control | 9 | ✅ Complete |
| B2C — Role Enforcement (4 roles) | 4 | ✅ Complete |
| B2B — Institutional Dashboard | 7 | ✅ Complete |
| B2B — Client Profile Management | 5 | ✅ Complete |
| B2B — Journey Governance | 6 | ✅ Complete |
| B2B — Risk Intelligence | 5 | ✅ Complete |
| B2B — Access Engineering | 5 | ✅ Complete |
| B2B — Memory Vault (Governed) | 4 | ✅ Complete |
| B2B — Revenue & Contracts | 5 | ✅ Complete |
| B2B — Role Enforcement (6 roles) | 6 | ✅ Complete |
| Platform Administration | 9 | ✅ Complete |
| Governance Infrastructure | 6 | ✅ Complete |
| **Total** | **116** | **✅ 100%** |

### Quality Assurance
- Framer Motion page transitions across all 4 route groups ✅
- Parallax scroll on marketing homepage and B2C pages ✅
- Micro-interactions on all CTAs (hover, click, loading) ✅
- Mobile and desktop responsive layouts ✅
- ARIA labels, keyboard navigation, screen reader support ✅
- WCAG AAA color contrast compliance ✅
- Playwright E2E tests: B2C intake → journey generation, B2B onboarding → compliance approval, Admin invite → member activation ✅
- Vitest unit tests: RBAC (all 11 roles), service contracts, cascade deletion ✅
- Visual regression tests ✅

---

### What Comes in v2 (Future Phases)

| Feature | Notes |
|---------|-------|
| Real AI Inference Engine | Replace mock narratives with live AI |
| Real Geopolitical Data Feeds | Live risk intelligence |
| Backend API Server | Replace localStorage with real database |
| Real Payment Processing | Live billing |
| Push Notifications | Real-time alerts |
| Mobile Native App | Currently: responsive web |

---

*Document prepared: February 2026*
*Platform: Élan Glimmora v1.0*
*Classification: Confidential — Client Presentation*
