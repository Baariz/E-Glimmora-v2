# 🏛️ Élan Glimmora — Full System Map

*Generated 2026-04-16 · Actors · Features · Workflows · Routes*

---

## 1. The big picture — who sits where

```
╔═══════════════════════════════════════════════════════════════════╗
║                  🌐 ÉLAN GLIMMORA PLATFORM                        ║
║                                                                   ║
║   ┌─────────────────────────────────────────────────────────┐   ║
║   │  🛠️  SUPERADMIN  (Élan HQ staff)                         │   ║
║   │  Runs the platform itself. Sees everything.             │   ║
║   └─────────────────────────────────────────────────────────┘   ║
║                              │                                    ║
║                              │ creates & oversees                  ║
║                              ▼                                    ║
║   ╔═════════════════════════════════════════════════════════╗   ║
║   ║  🏛️  INSTITUTION  (e.g. "Private Bank")                  ║   ║
║   ║                                                          ║   ║
║   ║  ┌───────────────────────────────────────────────────┐  ║   ║
║   ║  │  👔  InstitutionalAdmin  ← the ops chief          │  ║   ║
║   ║  └───────────────────────────────────────────────────┘  ║   ║
║   ║                                                          ║   ║
║   ║  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       ║   ║
║   ║  │ 👨‍💼 RM      │ │ 🏦 Private  │ │ ⚖️ Compliance│       ║   ║
║   ║  │             │ │    Banker   │ │    Officer   │       ║   ║
║   ║  └─────────────┘ └─────────────┘ └─────────────┘       ║   ║
║   ║                                                          ║   ║
║   ║  ┌────────────────────────────────────┐                 ║   ║
║   ║  │ 🎩 Family Office Director          │                 ║   ║
║   ║  └────────────────────────────────────┘                 ║   ║
║   ║        │                                                 ║   ║
║   ║        │ serves / coordinates                            ║   ║
║   ║        ▼                                                 ║   ║
║   ║  ┌─────────────────┐         ┌────────────────────┐    ║   ║
║   ║  │ 🧑 UHNI (Ravi)   │ ── ←── │ ✈️🛡️🏥🏨 Vendors    │    ║   ║
║   ║  │ 👩 Spouse        │         │ (JetLux, Kroll,    │    ║   ║
║   ║  │ 👦 Legacy Heir   │         │  MedEvac, Mandarin)│    ║   ║
║   ║  └─────────────────┘         └────────────────────┘    ║   ║
║   ║  (sees RM only — NEVER vendors)                         ║   ║
║   ╚═════════════════════════════════════════════════════════╝   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 2. Feature × Role matrix

Legend: **✅ Full** · **👁 Read** · **✎ Own only** · **❌ None** · **⚙️ Configure**

### A. Platform management

| Feature | SuperAdmin | InstAdmin | RM | Banker | FOD | Compliance | UHNI |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Institutions (`/institutions`) | ✅ | ⚙️ own | ❌ | ❌ | ⚙️ | ❌ | ❌ |
| Invites (`/invites`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Members (`/members`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Audit Trail (`/audit`) | ✅ | 👁 | 👁 | 👁 | 👁 | ✅ export | ❌ |
| Platform Revenue | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| System Health | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### B. Supply catalog (B2C-facing offerings)

| Feature | SuperAdmin | InstAdmin | RM | Banker | FOD | Compliance | UHNI |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Hotels CRUD (`/hotels`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 👁 discovery |
| Packages CRUD (`/packages`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 👁 discovery |

### C. Vendor management

| Feature | SuperAdmin | InstAdmin | RM | Banker | FOD | Compliance | UHNI |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| View vendor list | ✅ all | 👁 own | 👁 | 👁 | 👁 | 👁 | ❌ |
| Contract Value + NDA | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Add Vendor | ✅ any inst. | ✅ own | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit Vendor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Vendor | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Change Status | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Run Screening | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Scorecards | ✅ | ✅ | 👁 | 👁 | 👁 | 👁 export | ❌ |
| Alerts tab | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Notes (add/view) | ✅ any | ✅ any | ✎ own | ✎ own | ✎ own | ✎ own | ❌ |

### D. B2C core experience

| Feature | SuperAdmin | InstAdmin | RM | Banker | FOD | Compliance | UHNI |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Intent Profile (`/intent`) | ❌ | ❌ | 👁 summary | 👁 | 👁 | ❌ | ✅ own |
| Journeys (`/journeys`) | ❌ | ❌ | ✅ create | 👁 | 👁 | 👁 + approve | ✅ own |
| Journey Approve | ❌ | ❌ | ✅ RM review | ❌ | ✅ | ✅ compliance | ❌ |
| Experiences AGI | ❌ | ❌ | 👁 | ❌ | ❌ | ❌ | ✅ |
| Bookings | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | 👁 own |
| Vault | ❌ | ❌ | 👁 shared | ❌ | ❌ | ❌ | ✅ own |
| Intelligence Feed | ❌ | ❌ | 👁 | ❌ | ❌ | ❌ | ✅ |
| Messages | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Privacy Settings | ❌ | ⚙️ policy | ❌ | ❌ | ❌ | ❌ | ✅ own |

### E. B2B governance

| Feature | SuperAdmin | InstAdmin | RM | Banker | FOD | Compliance | UHNI |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Portfolio dashboard | 👁 | 👁 | ✅ own | 👁 | 👁 | ❌ | ❌ |
| Clients | ❌ | ❌ | ✅ | 👁 | 👁 | 👁 | ❌ |
| Risk | ❌ | ❌ | ✅ | 👁 | 👁 | 👁 | ❌ |
| Predictive | ❌ | ❌ | ✅ | 👁 | ⚙️ | 👁 | ❌ |
| Crisis | ❌ | ⚙️ | ✅ | 👁 | ✅ approve | ✅ approve | ❌ |
| Conflicts | ❌ | ⚙️ | ✅ | 👁 | 👁 | ✅ approve | ❌ |
| Integrations | ⚙️ | ⚙️ | 👁 | ❌ | 👁 | 👁 | ❌ |

---

## 3. Primary workflows

### Workflow 1 — Onboarding a new Institution

```
  🛠️ SuperAdmin                 👔 InstAdmin                 👨‍💼 RM
  ─────────────                 ─────────────                ──────
  1. Create Institution
     /institutions
            │
            ▼
  2. Generate invite
     (type=b2b, role=InstAdmin,
      institutionId=<new>)
     /invites → Generate
            │
            ▼
  3. Share code ──────────────▶ 4. Register via /invite
                                   Now has InstAdmin role
                                         │
                                         ▼
                                5. Generate more invites
                                   (RM, Banker, Compliance)
                                         │
                                         ▼
                                6. Share codes ────────────▶ 7. Register
                                                              via /invite
```

### Workflow 2 — UHNI Journey lifecycle

```
  🧑 UHNI            👨‍💼 RM           ⚖️ Compliance      ✈️🛡️ Vendors
  ──────             ──────           ───────────       ─────────────
  1. /intent/wizard
     (5-step profile)
         │
         ▼
  2. /experiences
     (AGI scores hotels)
         │
         ▼
  3. Create Journey        ┌─ status: DRAFT
                           │
                           ▼
                   4. Submit for review
                      status: RM_REVIEW ───▶ 5. Review & approve
                                                status: COMPLIANCE_REVIEW
                                                        │
                                                        ▼
                                             6. Legal / discretion check
                                                status: APPROVED
                                                        │
                                                        ▼
                                             7. InstAdmin/RM
                                                assigns vendors
                                                per booking
                                                        │
                                                        ▼
  8. Receive brief ◀─────── 9. Send Pre-Departure
                              status: PRESENTED
         │
         ▼
 10. Travel              11. Monitor in real-time ◀──── Vendor execution
         │                   (flight, transfer,           (jet, security,
         ▼                    accommodation)               villa)
 12. Submit feedback
     status: EXECUTED → ARCHIVED
                                   │
                                   ▼
                          13. Scorecards update
                              (SLA, quality, incidents)
```

### Workflow 3 — Vendor lifecycle

```
  🛠️ SA / 👔 InstAdmin    ⚖️ Screening        👔 InstAdmin        🛠️ SA / 👔
  ───────────────────   ─────────────       ──────────────     ───────────
  1. Add Vendor (3-step form)
     status: Under Review
            │
            ▼
  2. Run Screening ──────▶ Financial health
                           Security assessment
                           Pass / Fail
                                   │
                 ┌────── Pass ─────┼─── Fail ──┐
                 ▼                             ▼
  3a. Approve vendor              3b. Rejected (terminal)
      status: Approved
            │
            ▼
  4. Activate (contract live)
     status: Active
            │
            ▼                                       Incident/
  5. Ongoing scorecards ◀────────────┐              breach?
     per quarter (SLA, quality,      │                  │
     satisfaction, incidents)        │                  ▼
                                     │        6. Suspend
                                     │           status: Suspended
                                     └────── rehabilitated ──┘

   👨‍💼 RM / Staff add NOTES throughout (internal comms)
   ⚠️ Alerts fire: NDA expiry · contract expiry · SLA breach
```

---

## 4. URL map — what lives where

### Public / Marketing
| Route | Purpose |
|---|---|
| `/` | Editorial homepage |
| `/philosophy`, `/privacy` | Brand pages |
| `/invite` | Invite-code registration |
| `/auth/signin`, `/auth/verify-mfa` | Auth flows |

### Admin portal (SuperAdmin only)
| Route | Purpose |
|---|---|
| `/dashboard` | Platform overview |
| `/institutions` | Institution CRUD |
| `/invites` | Invite code mgmt |
| `/members` | User management |
| `/hotels` | Hotel catalog CRUD |
| `/packages` | Package catalog CRUD |
| `/platform-vendors` | Cross-institution vendor CRUD |
| `/audit` | Audit log |
| `/platform-revenue` | Billing |
| `/system` | Infrastructure |

### B2B portal (institution staff)
| Route | Purpose |
|---|---|
| `/portfolio` | RM's book dashboard |
| `/clients` | Client CRUD |
| `/governance` | Journey approval queue |
| `/risk` | Risk assessments |
| `/predictive` | Fatigue/alignment alerts |
| `/crisis` | Extraction protocols |
| `/conflicts` | Cross-UHNI conflicts |
| `/vendors` | Institution vendor mgmt |
| `/vendors/[id]` | Vendor detail (5 tabs) |
| `/revenue` | Institution P&L |
| `/integrations` | External data feeds |
| `/gov-vault` | Institutional documents |

### B2C portal (UHNI + family)
| Route | Purpose |
|---|---|
| `/briefing` | UHNI dashboard |
| `/intent`, `/intent/wizard` | Emotional travel profile |
| `/journeys`, `/journeys/[id]` | Curated experiences |
| `/experiences` | AGI-powered discovery |
| `/bookings` | Flight/stay/activity |
| `/checkout` | Payment (UI only) |
| `/vault` | Private memory |
| `/intelligence` | Travel advisories |
| `/messages` | Chat with advisor |
| `/privacy-settings` | Discretion tiers |

---

## 5. One-page cheat sheet

| If you are… | You live in | Your URL starts | Your superpower |
|---|---|---|---|
| 🛠️ SuperAdmin | Platform | `/dashboard`, `/platform-vendors` | Create anything, see everything, never talk to UHNI |
| 👔 InstitutionalAdmin | One institution | `/vendors`, `/institutions` (own) | Runs the institution: onboard staff, contract vendors |
| 👨‍💼 RelationshipManager | One institution | `/portfolio`, `/clients`, `/journeys` | **UHNI's human contact**, books journeys |
| 🏦 PrivateBanker | One institution | `/portfolio` (view) | Wealth strategy advisor |
| 🎩 FamilyOfficeDirector | One institution | `/governance`, `/crisis` | Multi-generational family strategy |
| ⚖️ ComplianceOfficer | One institution | `/governance`, `/audit` | Legal gatekeeper; approves journeys |
| 🧑 UHNI | Their life | `/briefing`, `/journeys`, `/vault` | The paying client; sees only RM |
| 👩 Spouse / 👦 Heir | Shared UHNI space | Read-only parts | Sees shared journeys/vault only |
| ✈️🛡️ Vendor | Offline | *no login* | Suppliers; contracted via InstAdmin/SuperAdmin |

### Golden rules

1. **UHNI sees ONE human** (their RM). Never vendors.
2. **Vendors have no platform login.** They are managed *about*, not *by*.
3. **Institutions are silos** — staff of Bank A cannot see Bank B's data. Only SuperAdmin crosses that line.
4. **Journey flow:** `DRAFT → RM_REVIEW → COMPLIANCE_REVIEW → APPROVED → PRESENTED → EXECUTED → ARCHIVED`
5. **Vendor flow:** `Under Review → Approved → Active ⇄ Suspended` (or `Rejected`)
