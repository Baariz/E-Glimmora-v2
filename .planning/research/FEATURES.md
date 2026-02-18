# Features Research
## Luxury UHNI Lifestyle Intelligence Platform

**Research Date:** February 15, 2026
**Context:** Élan Glimmora - Sovereign lifestyle intelligence platform for UHNI
**Competitive Set:** Quintessentially, Knightsbridge Circle, John Paul Group, Velocity Black, private wealth management platforms

---

## Table Stakes (Must Have)

These features are baseline expectations. Without them, UHNI users will immediately churn or never adopt.

### B2C Features (UHNI-Facing)

#### 1. **24/7 Dedicated Concierge Access**
- **What:** Human touchpoint available around the clock
- **Why Table Stakes:** UHNI expect immediate response regardless of timezone or time of day
- **Complexity:** Medium (requires staffing model, handoff protocols)
- **Dependencies:** Advisor Collaboration module, notification system

#### 2. **Secure Authentication & Biometric Access**
- **What:** Multi-factor auth, biometric (Face ID, Touch ID), device trust
- **Why Table Stakes:** Privacy and security are non-negotiable at this wealth level
- **Complexity:** Medium (standard implementation, but must be flawless)
- **Dependencies:** Privacy & Access Control module

#### 3. **Preference Memory & Profile Management**
- **What:** Dietary restrictions, travel preferences, allergies, style preferences, relationship details
- **Why Table Stakes:** UHNI expect to never repeat themselves
- **Complexity:** High (requires comprehensive data model + Memory Vault integration)
- **Dependencies:** Memory Vault, Intent Intelligence

#### 4. **Lifestyle Request Fulfillment**
- **What:** Restaurant reservations, travel booking, event access, shopping assistance
- **Why Table Stakes:** Core value proposition of any concierge service
- **Complexity:** High (requires vendor network, booking integrations, payment handling)
- **Dependencies:** Advisor Collaboration, external vendor APIs

#### 5. **Communication Channel Flexibility**
- **What:** Web app, mobile app, SMS, WhatsApp, email, phone
- **Why Table Stakes:** UHNI use multiple devices and prefer different channels for different contexts
- **Complexity:** High (omnichannel architecture with message routing)
- **Dependencies:** All communication modules

#### 6. **Calendar & Itinerary Management**
- **What:** Synchronized calendar, travel itineraries, event schedules
- **Why Table Stakes:** Expected by all premium concierge services
- **Complexity:** Medium (calendar sync, conflict detection)
- **Dependencies:** Journey Intelligence integration

#### 7. **Expense Tracking & Billing Transparency**
- **What:** Clear billing, expense reports, payment method management
- **Why Table Stakes:** Even UHNI want transparency on what they're paying for
- **Complexity:** Medium (payment processing, reporting)
- **Dependencies:** Revenue & Contracts (B2B side)

#### 8. **Privacy Controls & Data Ownership**
- **What:** Granular control over data sharing, export, deletion
- **Why Table Stakes:** Regulatory requirement (GDPR, CCPA) + UHNI expectation
- **Complexity:** High (requires robust permission system)
- **Dependencies:** Privacy & Access Control module

#### 9. **Mobile-First Experience**
- **What:** Native iOS/Android apps with offline capability
- **Why Table Stakes:** UHNI are mobile-first, often traveling
- **Complexity:** High (native app development, sync)
- **Dependencies:** All B2C modules

#### 10. **Relationship Management (Family/Staff)**
- **What:** Manage access for spouse, children, personal assistants, household staff
- **Why Table Stakes:** UHNI operate as family units with delegated authority
- **Complexity:** High (role-based access, delegation workflows)
- **Dependencies:** Privacy & Access Control, Auth module

### B2B Features (Institutional-Facing)

#### 1. **Client Relationship Management (CRM)**
- **What:** Client profiles, interaction history, relationship strength tracking
- **Why Table Stakes:** Financial institutions can't operate without CRM
- **Complexity:** High (comprehensive data model)
- **Dependencies:** Client Profile Management module

#### 2. **Compliance & Audit Trail**
- **What:** Complete audit logs, regulatory reporting, KYC/AML integration
- **Why Table Stakes:** Non-negotiable for regulated financial institutions
- **Complexity:** Very High (regulatory complexity varies by jurisdiction)
- **Dependencies:** Risk Intelligence, audit logs, Journey Governance Workflow

#### 3. **Multi-Client Portfolio View**
- **What:** Dashboard showing all assigned UHNI clients, health scores, action items
- **Why Table Stakes:** RMs/advisors manage multiple relationships
- **Complexity:** Medium (aggregation + filtering)
- **Dependencies:** Institutional Dashboard

#### 4. **Task & Workflow Management**
- **What:** Assignment, tracking, escalation of requests and responsibilities
- **Why Table Stakes:** Required for operational efficiency
- **Complexity:** High (workflow engine, notifications, SLAs)
- **Dependencies:** Journey Governance Workflow

#### 5. **Reporting & Analytics**
- **What:** Usage reports, engagement metrics, revenue attribution, risk reports
- **Why Table Stakes:** Institutions need ROI visibility and risk monitoring
- **Complexity:** High (data warehouse, BI tools)
- **Dependencies:** All B2B modules, analytics infrastructure

#### 6. **Access Management & Permissions**
- **What:** Role-based access control (RBAC), team hierarchies, approval chains
- **Why Table Stakes:** Security and governance requirement
- **Complexity:** High (fine-grained permissions)
- **Dependencies:** Access Engineering, Privacy & Access Control

#### 7. **Communication Logging**
- **What:** All interactions with UHNI logged and searchable
- **Why Table Stakes:** Compliance requirement, relationship continuity
- **Complexity:** Medium (storage, search, retention policies)
- **Dependencies:** Audit logs, Governed Memory Vault

#### 8. **Integration with Core Banking Systems**
- **What:** SSO, account data sync, transaction visibility (where permitted)
- **Why Table Stakes:** Institutions won't adopt standalone systems
- **Complexity:** Very High (each institution has different core systems)
- **Dependencies:** Auth, Client Profile Management

#### 9. **Revenue Management & Billing**
- **What:** Subscription management, usage tracking, invoicing
- **Why Table Stakes:** Commercial operation requirement
- **Complexity:** High (billing engine, contract management)
- **Dependencies:** Revenue & Contracts module

#### 10. **Multi-Tenant Architecture**
- **What:** Data isolation between institutions, white-labeling options
- **Why Table Stakes:** Multiple institutions on one platform
- **Complexity:** Very High (architectural foundation)
- **Dependencies:** Platform Admin, all modules

### Platform Features (Admin-Facing)

#### 1. **Institution Onboarding Workflow**
- **What:** Guided setup, configuration, user provisioning
- **Why Table Stakes:** Can't scale without efficient onboarding
- **Complexity:** High (orchestration of many setup steps)
- **Dependencies:** Platform Admin, invite management

#### 2. **System Monitoring & Health**
- **What:** Uptime monitoring, performance metrics, error tracking
- **Why Table Stakes:** Platform reliability is critical
- **Complexity:** Medium (APM tools, dashboards)
- **Dependencies:** System monitoring module

#### 3. **User & Invite Management**
- **What:** Create/revoke access, manage pending invites, user lifecycle
- **Why Table Stakes:** Basic admin capability
- **Complexity:** Medium (CRUD operations with workflow)
- **Dependencies:** Invite management, Auth

#### 4. **Audit Logs & Compliance Reporting**
- **What:** Platform-wide audit trail, compliance report generation
- **Why Table Stakes:** Regulatory and operational requirement
- **Complexity:** High (comprehensive logging, retention)
- **Dependencies:** Audit logs module

#### 5. **Feature Flagging & Configuration**
- **What:** Enable/disable features per institution or user
- **Why Table Stakes:** Needed for gradual rollouts and customization
- **Complexity:** Medium (feature flag infrastructure)
- **Dependencies:** All modules

---

## Differentiators (Competitive Advantage)

These features set Élan Glimmora apart from traditional concierge and wealth platforms.

### 1. **Intent Intelligence (Emotional DNA)**
- **What:** AI-powered emotional profiling that understands UHNI's underlying motivations, values, and decision-making patterns
- **Why Differentiating:** Goes beyond preferences to understand *why* someone makes choices
- **Competitive Gap:** Traditional platforms are transactional; they don't understand emotional drivers
- **Complexity:** Very High (requires ML models, ongoing training, sensitive data handling)
- **Example:** Understanding a client's risk aversion stems from childhood scarcity vs. inheritance responsibility changes how advisors approach investment discussions

### 2. **Journey Intelligence (AI-Generated Narratives)**
- **What:** Auto-generated life narrative that connects events, decisions, and relationships into coherent story
- **Why Differentiating:** UHNI see their lives as legacy stories, not transactional events
- **Competitive Gap:** No platform offers narrative intelligence at scale
- **Complexity:** Very High (NLP, narrative generation, temporal reasoning)
- **Example:** "Your Aspen acquisition coincided with Sarah's college acceptance—both represent investment in next-generation foundations"

### 3. **Sovereign Data Architecture**
- **What:** UHNI has absolute ownership—can export, delete, or move data with zero institutional retention
- **Why Differentiating:** True privacy, not just privacy theater
- **Competitive Gap:** All competitors retain data for business intelligence; this doesn't
- **Complexity:** Very High (architectural implications, business model implications)
- **Example:** UHNI can switch institutions without losing their intelligence layer

### 4. **Proactive Intelligence Briefs**
- **What:** AI-curated, personalized intelligence on topics relevant to UHNI's interests, investments, family
- **Why Differentiating:** Shifts from reactive service to proactive intelligence
- **Competitive Gap:** Concierge platforms are reactive; this anticipates needs
- **Complexity:** Very High (curation algorithms, personalization, content sourcing)
- **Example:** "Three Napa wineries matching your acquisition criteria just entered quiet sale processes"

### 5. **Multi-Generational Orchestration**
- **What:** Coordinate across UHNI, spouse, legacy heirs with different access levels and age-appropriate interfaces
- **Why Differentiating:** Recognizes wealth management is multi-generational
- **Competitive Gap:** Platforms treat each user independently
- **Complexity:** High (complex permission model, age-gating, transition workflows)
- **Example:** Heir gets curated view of family foundation work; spouse has financial co-control

### 6. **Institutional Transparency & Alignment Scoring**
- **What:** UHNI can see how institutions use their data, alignment scores on values/investments
- **Why Differentiating:** Radical transparency builds trust
- **Competitive Gap:** Institutions typically obscure their use of client data
- **Complexity:** High (comprehensive logging, scoring algorithms, ethical implications)
- **Example:** "Your RM accessed your profile 3 times this month to prepare for quarterly review"

### 7. **Contextual Memory Vault**
- **What:** Not just document storage—rich context, relationships, temporal connections, access reasoning
- **Why Differentiating:** Traditional document vaults are dumb file systems
- **Competitive Gap:** No platform connects memory to intelligence
- **Complexity:** Very High (knowledge graph, context extraction, semantic search)
- **Example:** Searching "Dubai property" surfaces documents + conversation where you mentioned architect preference + RM's note about Emaar contact

### 8. **Journey Governance Workflow**
- **What:** Institutions can propose journeys/experiences; UHNI approves/modifies with full visibility
- **Why Differentiating:** Inverts power dynamic—UHNI is in control
- **Competitive Gap:** Traditional platforms have institutions driving; this is UHNI-sovereign
- **Complexity:** High (workflow engine, approval chains, modification tracking)
- **Example:** Bank proposes art investment journey; UHNI adjusts focus to emerging Asian artists; advisor adapts

### 9. **Emotional Sentiment Tracking**
- **What:** Track satisfaction, stress, excitement across interactions and journeys
- **Why Differentiating:** Manages relationship health, not just transactions
- **Competitive Gap:** NPS surveys are crude; this is continuous emotional pulse
- **Complexity:** Very High (sentiment analysis, privacy considerations, UI design for sensitivity)
- **Example:** Detect advisor relationship strain before it becomes churn risk

### 10. **Anti-Sales Philosophy**
- **What:** Platform never pushes products; only responds to expressed intent
- **Why Differentiating:** UHNI are exhausted by being "sold to"
- **Competitive Gap:** Every platform is ultimately a sales channel
- **Complexity:** Medium (business model discipline, not technical)
- **Example:** No "recommended products" sections; only "based on your stated goal of X, here are options"

---

## Anti-Features (Do NOT Build)

These are features to deliberately avoid, even if they seem logical or are common in the industry.

### 1. **Gamification & Achievement Badges**
- **Why Avoid:** UHNI are not motivated by points; it's infantilizing and diminishes gravitas
- **Common in:** Consumer fintech, wellness apps
- **Risk if Built:** Immediate brand damage; signals misunderstanding of audience

### 2. **Social Network / Community Features**
- **Why Avoid:** UHNI value privacy and discretion; they don't want to "connect" with other users on a platform
- **Common in:** Most SaaS platforms, some concierge apps (Velocity Black had this)
- **Risk if Built:** Privacy concerns, reputational risk, goes against sovereign positioning
- **Exception:** Family-only private sharing is acceptable

### 3. **Automated Product Recommendations / Cross-Sell**
- **Why Avoid:** Feels like sales automation; UHNI want human curation and choice
- **Common in:** Wealth management platforms, banking apps
- **Risk if Built:** Breaks trust, feels transactional
- **Alternative:** Intelligence briefs that *inform* decisions, never push products

### 4. **Public Reviews or Ratings of Advisors**
- **Why Avoid:** Creates adversarial dynamic; reduces nuanced relationships to scores
- **Common in:** Gig economy platforms, some B2C services
- **Risk if Built:** Advisors become metric-focused rather than relationship-focused
- **Alternative:** Private feedback that only UHNI and senior management see

### 5. **Freemium or Tiered Pricing with Feature Gates**
- **Why Avoid:** UHNI expect full access; tiering creates resentment and status anxiety
- **Common in:** All SaaS products
- **Risk if Built:** Signals mass-market approach, cheapens brand
- **Alternative:** Single premium tier; customization is in service level, not feature access

### 6. **Email Newsletter / Marketing Campaigns**
- **Why Avoid:** UHNI are over-communicated to; unsolicited emails are noise
- **Common in:** Every business
- **Risk if Built:** Immediate unsubscribe/churn; damages relationship
- **Alternative:** Personalized intelligence briefs triggered by relevance, not calendar

### 7. **Chatbot as Primary Interface**
- **Why Avoid:** UHNI expect human interaction; chatbots signal cost-cutting
- **Common in:** Customer service platforms
- **Risk if Built:** Feels cheap, impersonal, frustrating for complex requests
- **Alternative:** AI-augmented human advisors; chatbot only for simple lookups with immediate escalation option

### 8. **Publicly Visible Activity / "Social Proof"**
- **Why Avoid:** Privacy violation; UHNI don't want others seeing "John just booked a trip to Paris"
- **Common in:** Consumer apps, travel platforms
- **Risk if Built:** Catastrophic privacy breach, legal liability

### 9. **Aggressive Onboarding Tutorials / Tooltips**
- **Why Avoid:** Assumes user incompetence; UHNI expect intuitive design or white-glove training
- **Common in:** All SaaS products
- **Risk if Built:** Annoying, feels mass-market
- **Alternative:** Optional guided tours, dedicated onboarding concierge

### 10. **Performance Leaderboards / Competitive Metrics**
- **Why Avoid:** UHNI don't compete on platforms; creates toxic dynamics
- **Common in:** Fitness apps, some investment platforms
- **Risk if Built:** Misaligned with collaborative, private ethos

### 11. **Advertiser or Third-Party Integrations for Revenue**
- **Why Avoid:** Compromises data sovereignty and privacy
- **Common in:** "Free" platforms
- **Risk if Built:** Destroys trust, violates core promise
- **Business Model:** Revenue must come from subscriptions/fees, never data monetization

### 12. **Intrusive Notifications / Push Marketing**
- **Why Avoid:** UHNI control their attention; unsolicited pings are disrespectful
- **Common in:** Most apps
- **Risk if Built:** App deletion, notification blocking, resentment
- **Alternative:** All notifications are opt-in and contextually triggered by UHNI actions

---

## Feature Dependencies

Understanding how features rely on each other to function.

### Critical Path Dependencies

#### **Intent Intelligence** depends on:
- Memory Vault (stores historical preferences and decisions)
- Privacy & Access Control (sensitive emotional data)
- Advisor Collaboration (human input to train/validate AI)
- Analytics infrastructure (ML model training)

#### **Journey Intelligence** depends on:
- Intent Intelligence (emotional context for narratives)
- Memory Vault (historical events to weave into narrative)
- Calendar/itinerary data (temporal sequencing)
- Journey Governance Workflow (institutional journey proposals)

#### **Intelligence Brief** depends on:
- Intent Intelligence (what topics are relevant)
- Journey Intelligence (narrative context)
- External content APIs (news, market data, etc.)
- Memory Vault (avoiding repetition of known information)

#### **Sovereign Briefing** depends on:
- All B2C modules (it's the orchestration layer)
- Intent Intelligence (personalization)
- Memory Vault (display recent activity)
- Privacy & Access Control (show privacy status)

#### **Advisor Collaboration** depends on:
- Client Profile Management (B2B side needs visibility)
- Journey Governance Workflow (request/approval flow)
- Communication Logging (compliance)
- Privacy & Access Control (UHNI controls what advisors see)

#### **Journey Governance Workflow** depends on:
- Client Profile Management (know who's involved)
- Risk Intelligence (flag high-risk journeys)
- Advisor Collaboration (communication channel)
- Audit logs (track approval chain)

#### **Privacy & Access Control** depends on:
- Auth (identity verification)
- Audit logs (track access changes)
- All modules (every module must respect permissions)

### Data Flow Dependencies

```
UHNI Interaction
    ↓
Memory Vault (stores context)
    ↓
Intent Intelligence (learns patterns)
    ↓
Intelligence Brief (generates insights)
    ↓
Advisor Collaboration (human refinement)
    ↓
Journey Governance (proposes experiences)
    ↓
Journey Intelligence (weaves into narrative)
```

### Infrastructure Dependencies

- **All B2C modules** depend on: Auth, Privacy & Access Control, audit logging
- **All B2B modules** depend on: Institution onboarding, RBAC, compliance logging
- **All AI features** depend on: Data pipeline, ML infrastructure, model versioning
- **All communication features** depend on: Notification system, message routing

---

## Complexity Assessment

Rated on: Technical (T), Regulatory (R), UX (U), Business Model (B)
Scale: Low (1), Medium (2), High (3), Very High (4)

### Very High Complexity (Build Last or Phase)

| Feature | T | R | U | B | Notes |
|---------|---|---|---|---|-------|
| Intent Intelligence (Emotional DNA) | 4 | 4 | 4 | 3 | Requires ML expertise, sensitive data, novel UX |
| Journey Intelligence (Narratives) | 4 | 3 | 4 | 2 | NLP complexity, narrative generation is unsolved |
| Sovereign Data Architecture | 4 | 4 | 3 | 4 | Architectural foundation, business model implications |
| Contextual Memory Vault | 4 | 3 | 3 | 2 | Knowledge graph, semantic search, context extraction |
| Multi-Tenant Core Banking Integration | 4 | 4 | 2 | 3 | Each institution is different; regulatory complexity |
| Compliance & Audit (Multi-Jurisdictional) | 3 | 4 | 2 | 3 | Regulatory variation by country |

### High Complexity (Core Platform Features)

| Feature | T | R | U | B | Notes |
|---------|---|---|---|---|---|
| Journey Governance Workflow | 3 | 3 | 3 | 2 | Complex workflow engine, approval chains |
| Intelligence Brief (Proactive Curation) | 3 | 2 | 3 | 2 | Content sourcing, personalization algorithms |
| Emotional Sentiment Tracking | 3 | 3 | 4 | 2 | Privacy-sensitive, requires careful UX |
| Multi-Generational Orchestration | 3 | 2 | 3 | 2 | Complex permissions, age-gating |
| Omnichannel Communication | 3 | 2 | 3 | 2 | Message routing, state sync |
| Lifestyle Request Fulfillment | 3 | 2 | 3 | 3 | Vendor network, payment integration |
| Preference Memory & Profile | 3 | 2 | 3 | 1 | Comprehensive data model |
| CRM for UHNI | 3 | 3 | 2 | 2 | Data model, relationship scoring |

### Medium Complexity (Standard Enterprise Features)

| Feature | T | R | U | B | Notes |
|---------|---|---|---|---|---|
| 24/7 Concierge Access | 2 | 2 | 2 | 3 | Staffing model complexity |
| Secure Auth & Biometric | 2 | 3 | 2 | 1 | Standard implementation |
| Calendar & Itinerary | 2 | 1 | 3 | 1 | Sync complexity |
| Expense Tracking & Billing | 2 | 2 | 2 | 2 | Payment processing |
| Mobile-First Experience | 3 | 1 | 3 | 1 | Native app development |
| Task & Workflow Management | 2 | 2 | 2 | 1 | Standard workflow engine |
| Reporting & Analytics | 3 | 2 | 2 | 1 | Data warehouse, BI tools |
| Access Management (RBAC) | 2 | 3 | 2 | 1 | Fine-grained permissions |
| Communication Logging | 2 | 3 | 1 | 1 | Compliance requirement |
| System Monitoring | 2 | 1 | 2 | 1 | APM tools |
| Feature Flagging | 2 | 1 | 1 | 1 | Standard infrastructure |

### Low Complexity (Foundational Features)

| Feature | T | R | U | B | Notes |
|---------|---|---|---|---|---|
| User & Invite Management | 1 | 2 | 2 | 1 | CRUD operations |
| Revenue Management | 2 | 2 | 2 | 2 | Billing engine (can use Stripe) |
| Institution Onboarding | 2 | 2 | 2 | 1 | Guided workflow |

---

## Recommendations for Phasing

### Phase 1: Table Stakes Foundation (Months 1-4)
**Goal:** Functional concierge platform that institutions and UHNI can use

**B2C:**
- Auth & Privacy Controls
- Preference Memory & Profile
- Communication channels (mobile, web, SMS)
- Lifestyle Request Fulfillment (manual/basic)
- Calendar & Itinerary

**B2B:**
- Client Profile Management (basic CRM)
- Task & Workflow Management
- Communication Logging
- Access Management (RBAC)
- Compliance & Audit Trail (basic)

**Platform:**
- Institution Onboarding
- User & Invite Management
- System Monitoring
- Audit Logs

### Phase 2: Intelligence Layer (Months 5-9)
**Goal:** Add AI differentiators that make this more than a concierge app

**B2C:**
- Memory Vault (contextual storage)
- Intent Intelligence (MVP emotional profiling)
- Intelligence Brief (basic curation)
- Sovereign Briefing (orchestration dashboard)

**B2B:**
- Journey Governance Workflow
- Risk Intelligence (basic)
- Analytics & Reporting
- Institutional Dashboard

### Phase 3: Advanced Intelligence (Months 10-15)
**Goal:** Full narrative and emotional intelligence

**B2C:**
- Journey Intelligence (AI narratives)
- Advanced Intent Intelligence (deep emotional DNA)
- Multi-Generational Orchestration
- Emotional Sentiment Tracking

**B2B:**
- Advanced Risk Intelligence
- Institutional Transparency & Alignment Scoring
- Revenue Optimization

### Phase 4: Scale & Integration (Months 16+)
**Goal:** Enterprise-grade multi-tenant platform

- Multi-Tenant Core Banking Integration
- White-Label Capabilities
- Advanced Compliance (multi-jurisdictional)
- Platform APIs for third-party integration

---

## Competitive Positioning Matrix

### Traditional Concierge (Quintessentially, Knightsbridge Circle)
- **Their Strengths:** Vendor networks, human touch, established luxury brand
- **Their Weaknesses:** No intelligence layer, transactional, no institutional integration
- **Élan Advantage:** Intelligence + institutional integration + sovereign data

### Wealth Management Platforms (Addepar, Canopy, Altruist)
- **Their Strengths:** Financial data integration, reporting, portfolio management
- **Their Weaknesses:** No lifestyle layer, poor UX, institutional-first (not UHNI-first)
- **Élan Advantage:** Lifestyle + emotional intelligence + UHNI-sovereign

### Family Office Software (Eton Solutions, Masttro)
- **Their Strengths:** Comprehensive financial tools, reporting, multi-generational
- **Their Weaknesses:** Enterprise software feel, no AI, no lifestyle
- **Élan Advantage:** Consumer-grade UX + lifestyle + emotional intelligence

### AI-Powered Personal Assistants (Magic, Invisible, x.ai)
- **Their Strengths:** Convenience, automation, AI-powered
- **Their Weaknesses:** Not UHNI-focused, no financial integration, privacy concerns
- **Élan Advantage:** UHNI-grade privacy + institutional integration + emotional intelligence

---

## Key Insights

### What Makes UHNI Platforms Different from Mass-Market
1. **Human touch is mandatory** - AI augments, never replaces
2. **Privacy is absolute** - Not a feature, it's the foundation
3. **Patience over speed** - UHNI prefer thoughtful over instant
4. **Relationships over transactions** - Every interaction builds narrative
5. **Gravitas over playfulness** - No gamification, no cute copy

### Critical Success Factors
1. **Nailing the B2C UX** - Cannot feel like enterprise software
2. **Institutional trust** - Compliance and security must be flawless
3. **Advisor experience** - If advisors hate it, UHNI won't use it
4. **Data sovereignty** - This is the core differentiator; can't compromise
5. **Emotional intelligence accuracy** - If AI gets emotional reads wrong, trust collapses

### Biggest Risks
1. **Trying to build everything at once** - Scope is enormous; phasing is critical
2. **Underestimating regulatory complexity** - Each jurisdiction adds exponential complexity
3. **AI hallucinations in emotional profiling** - Getting someone's motivations wrong is worse than having no AI
4. **Vendor lock-in for lifestyle fulfillment** - Need diversified vendor networks
5. **Institutional resistance to data sovereignty** - Banks may not want UHNI to own their own data

---

## Summary

**Table Stakes:** ~25 features that are baseline expectations (auth, concierge access, CRM, compliance, mobile apps, etc.)

**Differentiators:** ~10 features that set Élan apart (Intent Intelligence, Journey Intelligence, Sovereign Data, Proactive Briefs, Emotional Tracking)

**Anti-Features:** ~12 things to deliberately NOT build (gamification, social features, chatbots, cross-sell, notifications, etc.)

**Complexity:** 6 features rated "Very High" complexity; these are the moonshots that will take 12-18 months and deep expertise.

**Phasing:** Recommend 4-phase approach over 15+ months, starting with table stakes concierge platform and layering intelligence features.

**Competitive Moat:** The combination of (1) emotional intelligence, (2) sovereign data architecture, and (3) institutional integration creates a defensible position that no current competitor has.
