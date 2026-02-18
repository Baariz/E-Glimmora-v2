# Architecture Research

## System Overview

Élan Glimmora is a multi-tenant, multi-domain lifestyle intelligence platform with three distinct operational contexts (B2C, B2B, Platform Admin) served from a single Next.js App Router application. The architecture must support:

- **4 route groups** with distinct UX paradigms and security boundaries
- **11 roles across 3 domains** with context-aware permissions (same user can have different roles in B2C vs B2B)
- **15+ data entities** with complex relationships and cascade rules
- **Service abstraction layer** enabling mock services now, real backend later
- **Immutable audit logging** for all state changes
- **Privacy sovereignty** with global erase capability and entity cascade

**Core Architectural Principles:**

1. **Domain Isolation**: Marketing, B2C, B2B, and Admin are separate domains with distinct layouts, navigation, and security models
2. **Context-Aware RBAC**: Permission checks must consider both user role AND operational context (B2C vs B2B)
3. **Service Abstraction**: All data operations flow through service interfaces that abstract mock vs real backend
4. **Event Sourcing**: State changes emit events captured in immutable audit logs
5. **Privacy-First Design**: Data ownership boundaries enforced at query level, cascade deletes follow sovereignty rules

---

## Route Group Architecture

Next.js App Router supports route groups via `(groupName)` folder syntax. Each route group operates as an isolated domain with its own layout, middleware, and security boundary.

### Route Group Structure

```
app/
├── (marketing)/          # Public brand website
│   ├── layout.tsx        # Editorial layout: full-bleed, parallax-ready
│   ├── page.tsx          # Homepage: editorial scroll hero
│   ├── philosophy/
│   ├── privacy-charter/
│   └── join/             # Invite code entry
│
├── (b2c)/                # Private UHNI suite
│   ├── layout.tsx        # Website experience: narrative-driven, low density
│   ├── middleware.ts     # Auth guard: require UHNI/Spouse/Heir/Advisor role
│   ├── briefing/         # Current state overview
│   ├── intent/           # Multi-step intake wizard
│   ├── journeys/         # Journey intelligence + refinement
│   ├── intelligence/     # Emotional trend insights
│   ├── vault/            # Memory vault timeline
│   ├── collaboration/    # Advisor messaging
│   └── privacy/          # Access control + global erase
│
├── (b2b)/                # Institutional portal
│   ├── layout.tsx        # Premium dashboard: sidebar nav, higher density
│   ├── middleware.ts     # Auth guard: require RM/PB/FO/Compliance/InstAdmin/UHNI Portal role
│   ├── portfolio/        # Multi-client overview
│   ├── clients/          # UHNI profile management
│   ├── journeys/         # Journey governance workflow
│   ├── risk/             # Risk intelligence + compliance
│   ├── vault/            # Governed memory vault access
│   ├── contracts/        # Revenue + SLA tracking
│   └── access/           # RBAC assignment + audit logs
│
├── (admin)/              # Platform admin
│   ├── layout.tsx        # Admin dashboard: functional operations panel
│   ├── middleware.ts     # Auth guard: require Super Admin role
│   ├── invites/          # Invite code generation
│   ├── members/          # UHNI membership management
│   ├── institutions/     # Institution onboarding
│   ├── audit/            # Platform-wide audit logs
│   └── system/           # Health monitoring + revenue overview
│
└── api/
    ├── auth/             # NextAuth endpoints
    └── services/         # Service abstraction endpoints (mock)
```

### Layout Inheritance

Each route group defines a root layout that controls:
- **Navigation paradigm**: Marketing (none), B2C (website nav), B2B (sidebar), Admin (top nav)
- **Visual theme**: Color palette, typography, layout density
- **Authentication boundary**: Middleware enforces role requirements
- **Motion config**: Page transition variants per domain

**Key Decision**: Route groups do NOT share layouts. Each domain is visually and functionally isolated.

---

## Component Boundaries

### Layer 1: Route Group Domains

**Boundary**: Route group folders. Each domain is a module.

**Isolation**: Domains do NOT import from each other. Shared code lives in `/lib`, `/components/shared`, or service layer.

**Communication**: Inter-domain navigation uses Next.js routing. No direct component imports across groups.

### Layer 2: Service Abstraction

**Boundary**: `/lib/services/` folder. All data operations flow through service interfaces.

**Contract**: Each service exposes async methods matching eventual API shape:

```typescript
// /lib/services/journey.service.ts
export interface IJourneyService {
  getJourneys(userId: string, context: 'b2c' | 'b2b'): Promise<Journey[]>
  createJourney(data: CreateJourneyInput): Promise<Journey>
  approveJourney(journeyId: string, approverId: string): Promise<JourneyVersion>
}

// Mock implementation (v1)
export const journeyService: IJourneyService = {
  async getJourneys(userId, context) {
    // localStorage + mock data
  },
  // ...
}

// Real implementation (future)
// export const journeyService: IJourneyService = {
//   async getJourneys(userId, context) {
//     return apiClient.get(`/journeys?userId=${userId}&context=${context}`)
//   }
// }
```

**Boundary Rule**: Components NEVER call localStorage/fetch directly. Always through service layer.

### Layer 3: RBAC Enforcement

**Boundary**: `/lib/rbac/` folder. Permission checks abstracted into hooks and utilities.

**Pattern**: Context-aware permission resolution:

```typescript
// /lib/rbac/usePermission.ts
export function usePermission(action: PermissionType, resource: string) {
  const { user, context } = useAuth() // context = 'b2c' | 'b2b' | 'admin'
  return checkPermission(user.roles[context], action, resource)
}
```

**Boundary Rule**: Components use `usePermission()` hook. Business logic for permission resolution lives in RBAC layer.

### Layer 4: UI Components

**Shared Components** (`/components/shared/`):
- Button, Input, Modal, Card, etc.
- Domain-agnostic primitives
- No business logic

**Domain Components** (within route group folders):
- JourneyCard (B2C vs B2B versions)
- IntentWizard (B2C only)
- ComplianceApprovalFlow (B2B only)
- Business logic embedded

**Boundary Rule**: Shared components imported freely. Domain components stay within route group.

### Layer 5: State Management

**Local State**: React hooks (useState, useReducer) for component-local UI state

**Server State**: Service layer + React Query for async data fetching and caching

**Global State**: Context providers for:
- Auth context (user, roles, session)
- Theme context (domain-specific theming)
- Notification context (toast messages)

**Boundary Rule**: No global state for domain-specific data. Services + React Query handle caching.

---

## Data Flow

### Read Operations (Query Flow)

```
Component
  → useQuery hook (React Query)
    → Service layer (/lib/services/)
      → RBAC filter (context-aware)
        → Mock API (localStorage) OR Real API (future)
          → Transform + validate
            → Return typed data
```

**Example**: Fetching journeys in B2C context

```typescript
// Component
const { data: journeys } = useJourneys('b2c')

// Hook
function useJourneys(context: 'b2c' | 'b2b') {
  const { user } = useAuth()
  return useQuery(['journeys', context, user.id], () =>
    journeyService.getJourneys(user.id, context)
  )
}

// Service
async getJourneys(userId, context) {
  const allJourneys = await mockApi.getJourneys()
  return rbacFilter.filterByContext(allJourneys, userId, context)
}
```

### Write Operations (Command Flow)

```
Component
  → useMutation hook (React Query)
    → Service layer
      → Validation
        → RBAC permission check
          → Mock API (localStorage) OR Real API (future)
            → Emit audit event
              → Invalidate cache
                → Return result
```

**Example**: Creating a journey in B2B context

```typescript
// Component
const createJourney = useCreateJourney()
await createJourney.mutate({ title: 'Paris Renewal', ... })

// Hook
function useCreateJourney() {
  const queryClient = useQueryClient()
  return useMutation(
    (data) => journeyService.createJourney(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['journeys'])
        auditService.log('journey.created', data)
      }
    }
  )
}
```

### Cascade Operations (Global Erase)

When UHNI triggers global erase in B2C privacy settings:

```
Privacy Service
  → Cascade planner identifies affected entities:
    - IntentProfile
    - Journey (all versions)
    - MemoryItem
    - MessageThread + Messages
    - PrivacySettings
    - AccessPermission (where UHNI is grantor)
    - AuditLog (anonymize user references, preserve structure)
  → Execute cascade in dependency order:
    1. Delete Messages (children of MessageThread)
    2. Delete MessageThreads
    3. Delete MemoryItems
    4. Delete JourneyVersions (children of Journey)
    5. Delete Journeys
    6. Delete IntentProfile
    7. Delete AccessPermissions
    8. Anonymize AuditLogs
    9. Delete PrivacySettings
    10. Mark User as erased
  → Emit cascade.completed event
  → Logout user
  → Redirect to marketing
```

**Key Decision**: Cascade order matters. Child entities delete before parents. Audit logs anonymize (don't delete) for compliance.

---

## RBAC Architecture

### Context-Aware Permissions

**Challenge**: Same user can exist in both B2C and B2B with different roles.

**Example**:
- UHNI user `alice@example.com` logs in
- In **/b2c**: Role = `UHNI` (full sovereignty)
- In **/b2b**: Role = `UHNI Portal` (view-only enterprise view)

**Solution**: Store roles as context-keyed map in User entity:

```typescript
interface User {
  id: string
  email: string
  roles: {
    b2c?: 'UHNI' | 'Spouse' | 'Legacy Heir' | 'Élan Advisor'
    b2b?: 'Relationship Manager' | 'Private Banker' | 'Family Office Director' |
          'Compliance Officer' | 'Institutional Admin' | 'UHNI Portal'
    admin?: 'Super Admin'
  }
}
```

### Permission Resolution

**Permission Types**: READ, WRITE, APPROVE, DELETE, ASSIGN, EXPORT, CONFIGURE

**Resolution Logic**:

```typescript
function checkPermission(
  role: Role,
  action: PermissionType,
  resource: string,
  context: 'b2c' | 'b2b' | 'admin'
): boolean {
  const permissionMatrix = getPermissionMatrix(context)
  return permissionMatrix[role]?.[resource]?.includes(action) ?? false
}
```

**Permission Matrices** (defined in `/lib/rbac/permissions.ts`):

```typescript
const B2C_PERMISSIONS = {
  UHNI: {
    journey: ['READ', 'WRITE', 'DELETE', 'EXPORT'],
    vault: ['READ', 'WRITE', 'DELETE', 'EXPORT'],
    privacy: ['READ', 'WRITE', 'CONFIGURE'],
    // ...
  },
  Spouse: {
    journey: ['READ'],
    vault: ['READ'], // filtered by sharing permissions
    privacy: [], // no access
  },
  // ...
}

const B2B_PERMISSIONS = {
  'Relationship Manager': {
    journey: ['READ', 'WRITE', 'APPROVE'],
    client: ['READ', 'WRITE', 'ASSIGN'],
    risk: ['READ', 'WRITE'],
    // ...
  },
  'Compliance Officer': {
    journey: ['READ', 'APPROVE'], // approval gatekeeper
    client: ['READ'],
    audit: ['READ', 'EXPORT'],
    // ...
  },
  // ...
}
```

### Access Filtering at Query Level

**Principle**: Users only see data they have permission to access. Filtering happens in service layer, not UI.

**Example**: Memory Vault query in B2C

```typescript
async getMemoryItems(userId: string, viewerRole: Role): Promise<MemoryItem[]> {
  const allItems = await mockApi.getMemoryItems(userId)

  if (viewerRole === 'UHNI') {
    return allItems // sovereign sees everything
  }

  if (viewerRole === 'Spouse') {
    return allItems.filter(item =>
      item.sharingPermissions.includes('spouse')
    )
  }

  if (viewerRole === 'Legacy Heir') {
    return allItems.filter(item =>
      item.sharingPermissions.includes('heir') && item.isLocked === false
    )
  }

  return [] // Advisor has no vault access in B2C
}
```

### Approval State Machine (Journey Governance)

**States**: DRAFT → RM_REVIEW → COMPLIANCE_REVIEW → APPROVED → PRESENTED → EXECUTED

**Transitions**:

```typescript
const JOURNEY_STATE_MACHINE = {
  DRAFT: {
    allowedActions: ['EDIT', 'SUBMIT_FOR_REVIEW'],
    requiredRole: 'Relationship Manager',
  },
  RM_REVIEW: {
    allowedActions: ['APPROVE', 'REJECT', 'MODIFY'],
    requiredRole: 'Relationship Manager',
    onApprove: 'COMPLIANCE_REVIEW',
    onReject: 'DRAFT',
  },
  COMPLIANCE_REVIEW: {
    allowedActions: ['APPROVE', 'REJECT'],
    requiredRole: 'Compliance Officer',
    onApprove: 'APPROVED',
    onReject: 'RM_REVIEW',
  },
  APPROVED: {
    allowedActions: ['PRESENT', 'REVOKE'],
    requiredRole: 'Relationship Manager',
    onPresent: 'PRESENTED',
  },
  PRESENTED: {
    allowedActions: ['EXECUTE', 'CANCEL'],
    requiredRole: 'Relationship Manager',
    onExecute: 'EXECUTED',
  },
  EXECUTED: {
    allowedActions: ['ARCHIVE'],
    requiredRole: 'Relationship Manager',
  },
}
```

**Implementation**: State machine logic in `/lib/workflows/journeyStateMachine.ts`. Service layer enforces transitions.

---

## Service Abstraction Layer

### Design Pattern

**Goal**: Write code once, swap implementation later (mock → real API) without changing components.

**Pattern**: Interface-based services with environment-driven implementation selection.

### Service Structure

```
lib/
├── services/
│   ├── index.ts                 # Service registry + exports
│   ├── interfaces/              # TypeScript interfaces (contracts)
│   │   ├── IJourneyService.ts
│   │   ├── IVaultService.ts
│   │   ├── IUserService.ts
│   │   └── ...
│   ├── mock/                    # Mock implementations (v1)
│   │   ├── journey.mock.ts
│   │   ├── vault.mock.ts
│   │   └── ...
│   ├── api/                     # Real API implementations (future)
│   │   ├── journey.api.ts
│   │   ├── vault.api.ts
│   │   └── ...
│   └── config.ts                # Environment-based service selection
```

### Service Registry

```typescript
// /lib/services/config.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'true'

export const services = {
  journey: USE_MOCK ? mockJourneyService : apiJourneyService,
  vault: USE_MOCK ? mockVaultService : apiVaultService,
  user: USE_MOCK ? mockUserService : apiUserService,
  // ...
}

// /lib/services/index.ts
export { services as default }
```

### Component Usage

```typescript
// Component (implementation-agnostic)
import services from '@/lib/services'

export function JourneyList() {
  const { data } = useQuery(['journeys'], () =>
    services.journey.getJourneys(userId, 'b2c')
  )
  // ...
}
```

### Mock Implementation Strategy

**Data Storage**: localStorage for persistence across sessions

**Data Structure**:

```typescript
// localStorage keys
const STORAGE_KEYS = {
  users: 'elan:users',
  journeys: 'elan:journeys',
  vault: 'elan:vault',
  messages: 'elan:messages',
  audit: 'elan:audit',
  // ...
}

// Mock API helper
class MockStore {
  get<T>(key: string): T[] {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  set<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data))
  }

  add<T extends { id: string }>(key: string, item: T): T {
    const items = this.get<T>(key)
    items.push(item)
    this.set(key, items)
    return item
  }

  update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null {
    const items = this.get<T>(key)
    const index = items.findIndex(item => item.id === id)
    if (index === -1) return null
    items[index] = { ...items[index], ...updates }
    this.set(key, items)
    return items[index]
  }

  delete(key: string, id: string): boolean {
    const items = this.get(key)
    const filtered = items.filter(item => item.id !== id)
    this.set(key, filtered)
    return filtered.length < items.length
  }
}
```

**API Delay Simulation**: Add realistic delays to mock responses:

```typescript
async getJourneys(userId: string): Promise<Journey[]> {
  await delay(300) // simulate network latency
  return mockStore.get(STORAGE_KEYS.journeys)
    .filter(j => j.userId === userId)
}
```

**Seed Data**: Initial data loaded on first app launch:

```typescript
// /lib/services/mock/seed.ts
export function seedMockData() {
  if (mockStore.get(STORAGE_KEYS.users).length > 0) return // already seeded

  // Create demo UHNI user
  mockStore.add(STORAGE_KEYS.users, {
    id: 'uhni-1',
    email: 'demo@elan.example',
    roles: { b2c: 'UHNI' },
    // ...
  })

  // Create demo journey
  mockStore.add(STORAGE_KEYS.journeys, {
    id: 'journey-1',
    userId: 'uhni-1',
    title: 'Mediterranean Renewal',
    // ...
  })
}
```

---

## Folder Structure

```
/Users/kavi/Baarez-Projects/E-Glimmora/
│
├── .planning/                   # Project planning (existing)
│   ├── PROJECT.md
│   ├── research/
│   │   └── ARCHITECTURE.md
│   └── roadmap/
│
├── app/                         # Next.js App Router
│   ├── (marketing)/             # Route group: Public brand
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── philosophy/
│   │   ├── privacy-charter/
│   │   └── join/
│   │
│   ├── (b2c)/                   # Route group: UHNI suite
│   │   ├── layout.tsx
│   │   ├── middleware.ts
│   │   ├── briefing/
│   │   ├── intent/
│   │   ├── journeys/
│   │   ├── intelligence/
│   │   ├── vault/
│   │   ├── collaboration/
│   │   └── privacy/
│   │
│   ├── (b2b)/                   # Route group: Institutional portal
│   │   ├── layout.tsx
│   │   ├── middleware.ts
│   │   ├── portfolio/
│   │   ├── clients/
│   │   ├── journeys/
│   │   ├── risk/
│   │   ├── vault/
│   │   ├── contracts/
│   │   └── access/
│   │
│   ├── (admin)/                 # Route group: Platform admin
│   │   ├── layout.tsx
│   │   ├── middleware.ts
│   │   ├── invites/
│   │   ├── members/
│   │   ├── institutions/
│   │   ├── audit/
│   │   └── system/
│   │
│   ├── api/
│   │   ├── auth/                # NextAuth endpoints
│   │   └── services/            # Mock API endpoints (if needed)
│   │
│   ├── layout.tsx               # Root layout
│   └── globals.css
│
├── components/
│   ├── shared/                  # Domain-agnostic primitives
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Card/
│   │   └── ...
│   └── providers/               # Context providers
│       ├── AuthProvider.tsx
│       ├── ThemeProvider.tsx
│       └── NotificationProvider.tsx
│
├── lib/
│   ├── services/                # Service abstraction layer
│   │   ├── index.ts
│   │   ├── config.ts
│   │   ├── interfaces/
│   │   ├── mock/
│   │   └── api/
│   │
│   ├── rbac/                    # RBAC engine
│   │   ├── permissions.ts       # Permission matrices
│   │   ├── usePermission.ts     # Permission hook
│   │   └── filters.ts           # Access filtering utilities
│   │
│   ├── workflows/               # State machines
│   │   ├── journeyStateMachine.ts
│   │   └── approvalWorkflow.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── entities.ts          # Data entities
│   │   ├── roles.ts
│   │   └── permissions.ts
│   │
│   ├── utils/                   # Utilities
│   │   ├── cascade.ts           # Global erase cascade logic
│   │   ├── audit.ts             # Audit event emission
│   │   └── validators.ts
│   │
│   └── hooks/                   # Custom hooks
│       ├── useAuth.ts
│       ├── useJourneys.ts
│       ├── useVault.ts
│       └── ...
│
├── public/
│   ├── fonts/                   # Miller Display + Avenir LT Std
│   └── images/
│
├── styles/
│   ├── theme.ts                 # Color palette + typography config
│   └── variants/                # Framer Motion variants
│
├── .env.local                   # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Suggested Build Order

### Phase 0: Foundation (Week 1)

**Goal**: Scaffold project structure, configure tooling, establish design system.

**Deliverables**:

1. **Project Initialization**
   - Next.js app with App Router
   - TypeScript, Tailwind CSS, ESLint, Prettier
   - Folder structure per architecture

2. **Design System**
   - `/styles/theme.ts`: Color palette, typography tokens
   - `/public/fonts`: Miller Display + Avenir LT Std fonts
   - `/components/shared`: Button, Input, Card, Modal primitives
   - Framer Motion setup + page transition variants

3. **Type Definitions**
   - `/lib/types/entities.ts`: All 15+ data entities
   - `/lib/types/roles.ts`: Role definitions
   - `/lib/types/permissions.ts`: Permission types

4. **Service Abstraction Layer**
   - `/lib/services/interfaces`: Service contracts
   - `/lib/services/mock`: Mock implementations + localStorage wrapper
   - `/lib/services/config.ts`: Service registry

5. **RBAC Foundation**
   - `/lib/rbac/permissions.ts`: Permission matrices (B2C, B2B, Admin)
   - `/lib/rbac/usePermission.ts`: Permission hook
   - `/lib/rbac/filters.ts`: Access filtering utilities

**Dependencies**: None (greenfield start)

**Why First**: Everything depends on types, services, and RBAC. Build the foundation before features.

---

### Phase 1: Marketing + Auth (Week 2)

**Goal**: Public brand website + invite-only authentication.

**Deliverables**:

1. **Marketing Route Group**
   - `app/(marketing)/layout.tsx`: Editorial layout
   - `app/(marketing)/page.tsx`: Hero with parallax
   - `app/(marketing)/philosophy/page.tsx`
   - `app/(marketing)/privacy-charter/page.tsx`
   - `app/(marketing)/join/page.tsx`: Invite code entry

2. **Authentication**
   - NextAuth setup (`app/api/auth`)
   - `/lib/services/mock/auth.mock.ts`: Mock user authentication
   - `/components/providers/AuthProvider.tsx`
   - `/lib/hooks/useAuth.ts`

3. **Invite System**
   - Invite code validation logic
   - Mock invite code storage (localStorage)
   - Registration flow (post-invite)

**Dependencies**: Phase 0 (foundation)

**Why Second**: Marketing is user entry point. Auth required for all protected routes.

---

### Phase 2: B2C Core (Week 3-4)

**Goal**: UHNI sovereign experience — intent, journeys, vault.

**Deliverables**:

1. **B2C Layout + Navigation**
   - `app/(b2c)/layout.tsx`: Website experience layout
   - `app/(b2c)/middleware.ts`: Auth guard (B2C roles)
   - Navigation component (narrative-driven)

2. **Sovereign Briefing**
   - `app/(b2c)/briefing/page.tsx`: Overview dashboard

3. **Intent Intelligence**
   - `app/(b2c)/intent/page.tsx`: Multi-step wizard
   - `/lib/services/mock/intent.mock.ts`
   - `/lib/hooks/useIntent.ts`

4. **Journey Intelligence**
   - `app/(b2c)/journeys/page.tsx`: Journey list + generation
   - `app/(b2c)/journeys/[id]/page.tsx`: Journey detail + refinement
   - `/lib/services/mock/journey.mock.ts`
   - `/lib/hooks/useJourneys.ts`
   - Mock AI narrative generation

5. **Memory Vault**
   - `app/(b2c)/vault/page.tsx`: Timeline view
   - `/lib/services/mock/vault.mock.ts`
   - `/lib/hooks/useVault.ts`
   - Sharing permissions logic (spouse/heir)

6. **Advisor Collaboration**
   - `app/(b2c)/collaboration/page.tsx`: Message threads
   - `/lib/services/mock/messaging.mock.ts`

7. **Privacy & Access Control**
   - `app/(b2c)/privacy/page.tsx`: Discretion tier, visibility config
   - Global erase flow + cascade
   - `/lib/utils/cascade.ts`: Cascade logic

**Dependencies**: Phase 1 (auth)

**Why Third**: B2C is core UHNI experience. Must feel complete before moving to B2B.

---

### Phase 3: B2B Core (Week 5-6)

**Goal**: Institutional portal — client management, journey governance, compliance.

**Deliverables**:

1. **B2B Layout + Navigation**
   - `app/(b2b)/layout.tsx`: Premium dashboard layout (sidebar nav)
   - `app/(b2b)/middleware.ts`: Auth guard (B2B roles)

2. **Portfolio Dashboard**
   - `app/(b2b)/portfolio/page.tsx`: Multi-client overview

3. **Client Management**
   - `app/(b2b)/clients/page.tsx`: UHNI client list
   - `app/(b2b)/clients/[id]/page.tsx`: Client profile + intake
   - RM-led intent intake

4. **Journey Governance**
   - `app/(b2b)/journeys/page.tsx`: Journey pipeline
   - `app/(b2b)/journeys/[id]/page.tsx`: Journey detail + approval workflow
   - `/lib/workflows/journeyStateMachine.ts`: State machine
   - Version control logic

5. **Risk Intelligence**
   - `app/(b2b)/risk/page.tsx`: Risk heat map + compliance

6. **Governed Memory Vault**
   - `app/(b2b)/vault/page.tsx`: Shared visibility (RM + client)

7. **Access Engineering**
   - `app/(b2b)/access/page.tsx`: RBAC assignment + audit trail

**Dependencies**: Phase 2 (B2C data entities shared)

**Why Fourth**: B2B builds on B2C data model. Governance workflows depend on journey entities.

---

### Phase 4: Platform Admin (Week 7)

**Goal**: Platform operations — invites, members, institutions, audit.

**Deliverables**:

1. **Admin Layout + Navigation**
   - `app/(admin)/layout.tsx`: Admin dashboard layout
   - `app/(admin)/middleware.ts`: Auth guard (Super Admin)

2. **Invite Management**
   - `app/(admin)/invites/page.tsx`: Code generation + tracking

3. **Member Management**
   - `app/(admin)/members/page.tsx`: UHNI membership control

4. **Institution Management**
   - `app/(admin)/institutions/page.tsx`: Institution onboarding

5. **Audit Logs**
   - `app/(admin)/audit/page.tsx`: Platform-wide audit trail
   - `/lib/utils/audit.ts`: Event emission

6. **System Health**
   - `app/(admin)/system/page.tsx`: Monitoring + revenue overview

**Dependencies**: Phase 3 (all data entities exist)

**Why Fifth**: Admin is meta-layer. Requires all domain entities to be auditable.

---

### Phase 5: Polish + Refinement (Week 8)

**Goal**: Motion design, responsive refinement, performance optimization.

**Deliverables**:

1. **Motion Design**
   - Page transitions (Framer Motion)
   - Parallax effects (marketing hero)
   - Micro-interactions (hover states, loading states)

2. **Responsive Design**
   - Mobile layouts for all routes
   - Touch interactions
   - Responsive navigation

3. **Performance Optimization**
   - Image optimization
   - Code splitting
   - React Query cache tuning

4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader testing

5. **Testing**
   - End-to-end flows (Playwright)
   - RBAC edge cases
   - Cascade delete verification

**Dependencies**: Phase 4 (all features built)

**Why Last**: Polish requires complete feature set. Motion/responsive work best when all components exist.

---

## Key Design Patterns

### 1. Context-Aware Data Fetching

**Pattern**: Data hooks accept `context` parameter to filter by operational domain.

```typescript
// Hook
function useJourneys(context: 'b2c' | 'b2b') {
  const { user } = useAuth()
  return useQuery(['journeys', context, user.id], () =>
    services.journey.getJourneys(user.id, context)
  )
}

// B2C usage
const { data: myJourneys } = useJourneys('b2c')

// B2B usage
const { data: clientJourneys } = useJourneys('b2b')
```

**Why**: Same journey entity, different access rules based on context.

---

### 2. Permission-Guarded UI

**Pattern**: Components conditionally render based on permissions.

```typescript
function JourneyCard({ journey }) {
  const canDelete = usePermission('DELETE', 'journey')

  return (
    <Card>
      <h3>{journey.title}</h3>
      {canDelete && (
        <Button onClick={handleDelete}>Delete</Button>
      )}
    </Card>
  )
}
```

**Why**: Declarative permission checks in UI. No conditional logic scattered across components.

---

### 3. Optimistic Updates

**Pattern**: UI updates immediately, rollback on error.

```typescript
function useCreateJourney() {
  const queryClient = useQueryClient()

  return useMutation(
    (data) => services.journey.createJourney(data),
    {
      onMutate: async (newJourney) => {
        await queryClient.cancelQueries(['journeys'])
        const previous = queryClient.getQueryData(['journeys'])
        queryClient.setQueryData(['journeys'], old => [...old, newJourney])
        return { previous }
      },
      onError: (err, newJourney, context) => {
        queryClient.setQueryData(['journeys'], context.previous)
      },
      onSettled: () => {
        queryClient.invalidateQueries(['journeys'])
      },
    }
  )
}
```

**Why**: Instant UI feedback for luxury feel. Network latency hidden.

---

### 4. Event-Driven Audit Trail

**Pattern**: All state changes emit events captured by audit service.

```typescript
// Service layer
async createJourney(data: CreateJourneyInput): Promise<Journey> {
  const journey = await mockStore.add(STORAGE_KEYS.journeys, {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
  })

  auditService.log({
    event: 'journey.created',
    userId: data.userId,
    resourceId: journey.id,
    context: data.context,
    timestamp: new Date().toISOString(),
  })

  return journey
}
```

**Why**: Immutable audit log for compliance. No manual logging scattered across code.

---

### 5. Cascade Delete Planner

**Pattern**: Global erase triggers cascade planner that identifies dependencies and executes in order.

```typescript
// /lib/utils/cascade.ts
export async function executeGlobalErase(userId: string) {
  const plan = buildCascadePlan(userId)

  for (const step of plan) {
    await executeStep(step)
    auditService.log({
      event: 'cascade.step',
      step: step.entity,
      count: step.affectedIds.length,
    })
  }

  auditService.log({
    event: 'cascade.completed',
    userId,
  })
}

function buildCascadePlan(userId: string): CascadeStep[] {
  return [
    { entity: 'Message', affectedIds: findMessages(userId) },
    { entity: 'MessageThread', affectedIds: findThreads(userId) },
    { entity: 'MemoryItem', affectedIds: findMemories(userId) },
    { entity: 'JourneyVersion', affectedIds: findJourneyVersions(userId) },
    { entity: 'Journey', affectedIds: findJourneys(userId) },
    { entity: 'IntentProfile', affectedIds: findIntentProfiles(userId) },
    { entity: 'AccessPermission', affectedIds: findPermissions(userId) },
    { entity: 'AuditLog', affectedIds: findAuditLogs(userId), action: 'anonymize' },
    { entity: 'PrivacySettings', affectedIds: findPrivacySettings(userId) },
    { entity: 'User', affectedIds: [userId], action: 'mark_erased' },
  ]
}
```

**Why**: Privacy sovereignty requires reliable cascade. Declarative plan prevents missed dependencies.

---

### 6. State Machine Workflow

**Pattern**: Journey governance uses explicit state machine with role-based transitions.

```typescript
// /lib/workflows/journeyStateMachine.ts
export function canTransition(
  currentState: JourneyState,
  action: WorkflowAction,
  userRole: Role
): boolean {
  const config = STATE_MACHINE[currentState]
  return (
    config.allowedActions.includes(action) &&
    config.requiredRole === userRole
  )
}

export function executeTransition(
  journeyId: string,
  action: WorkflowAction,
  userId: string,
  userRole: Role
): JourneyVersion {
  const journey = services.journey.getById(journeyId)

  if (!canTransition(journey.state, action, userRole)) {
    throw new Error('Unauthorized transition')
  }

  const nextState = STATE_MACHINE[journey.state].onApprove // or onReject

  return services.journey.createVersion({
    journeyId,
    state: nextState,
    approvedBy: userId,
    timestamp: new Date().toISOString(),
  })
}
```

**Why**: Complex approval workflows need explicit state management. Prevents invalid transitions.

---

### 7. Service-Based Feature Flags

**Pattern**: Environment variable toggles mock vs real services.

```typescript
// .env.local
NEXT_PUBLIC_USE_MOCK_SERVICES=true

// /lib/services/config.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'true'

export const services = {
  journey: USE_MOCK ? mockJourneyService : apiJourneyService,
}
```

**Why**: Swap entire backend with one env variable. Zero component changes.

---

## Summary

This architecture supports:

- **Domain Isolation**: 4 route groups with distinct layouts and security boundaries
- **Context-Aware RBAC**: Same user, different roles in B2C vs B2B
- **Service Abstraction**: Mock now, real API later, zero component changes
- **Privacy Sovereignty**: Global erase with entity cascade planning
- **Compliance Governance**: Journey approval state machine with role-based transitions
- **Audit Trail**: Immutable event log for all state changes
- **Performance**: React Query caching + optimistic updates for luxury feel

The suggested build order ensures dependencies are resolved incrementally: foundation → auth → B2C → B2B → admin → polish.

This architecture document serves as the blueprint for roadmap phase structure and implementation sequencing.
