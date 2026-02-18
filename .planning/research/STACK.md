# Stack Research
**Élan Glimmora — Luxury UHNI Lifestyle Intelligence Platform**
Research Date: February 15, 2026
Context: Greenfield development, Dribbble-level UI quality, no compromise on experience

---

## Recommended Stack

### Framework & Runtime
**Next.js 15.1+ (App Router)**
- **Rationale**: Already confirmed. App Router provides RSC (React Server Components), streaming, and optimized bundle sizes critical for luxury web experiences
- **Version**: `next@15.1.0` or latest stable
- **React**: `react@19.x` (supports React Compiler for automatic memoization)
- **Node**: `20.x LTS` minimum (ESM support, performance improvements)

**Why this matters for UHNI platform:**
- Server Components reduce client JS for faster perceived performance
- Parallel routes enable sophisticated B2C/B2B/Admin separation
- Middleware for context-aware RBAC routing
- Edge runtime support for global low-latency experiences

---

### Styling & UI

**Primary: Tailwind CSS v4.x (with design tokens)**
- **Package**: `tailwindcss@4.0.0-alpha.x` → stable when released, otherwise `3.4.x`
- **Rationale**:
  - Utility-first with custom design system integration
  - Excellent for responsive parity (desktop + mobile)
  - JIT compiler eliminates unused styles
  - Perfect for animation variants with Framer Motion
- **Config strategy**:
  - Custom color palette (Rose, Sand, Olive Green, Teal, Gold)
  - Typography scale with Miller Display + Avenir LT Std
  - Custom container queries for responsive layouts

**UI Component Foundation: Radix UI v1.x**
- **Package**: `@radix-ui/react-*@1.x` (headless primitives)
- **Rationale**:
  - Unstyled, accessible primitives (Dialog, Dropdown, Accordion, etc.)
  - Full control over luxury aesthetic
  - WAI-ARIA compliant (critical for institutional B2B clients)
  - No visual opinions — style with Tailwind

**Typography Management**
- **Package**: `@next/font` (built into Next.js 15)
- **Fonts**: Miller Display (serif), Avenir LT Std (sans)
- **Rationale**:
  - Self-hosted licensed fonts with automatic optimization
  - Variable font loading with `font-display: swap`
  - Subset generation to reduce file sizes

**Icon System: Lucide React**
- **Package**: `lucide-react@0.460.x` or latest
- **Rationale**:
  - Tree-shakeable, consistent design language
  - Better than Heroicons for luxury feel (smoother curves)
  - 1000+ icons with customizable stroke width
  - SVG-based for crisp rendering at all resolutions

**Alternative Considered**: Custom SVG sprite system
- **Why not**: Overhead of maintaining custom icons outweighs benefits unless brand requires it

---

### Animation & Motion

**Framer Motion v11.x**
- **Package**: `framer-motion@11.x` (already confirmed)
- **Rationale**:
  - Declarative animations with layout animations
  - Scroll-triggered animations (critical for B2C narrative flow)
  - Gesture support (drag, pan for mobile interactions)
  - AnimatePresence for route transitions

**Advanced Patterns for UHNI Platform:**
```typescript
// Page transition orchestration
// Stagger animations for luxury "reveal" effects
// Parallax scrolling for B2C storytelling
// Micro-interactions on all CTAs (hover, press states)
```

**Performance Strategy:**
- Use `useReducedMotion` hook for accessibility
- Hardware-accelerated properties only (transform, opacity)
- Intersection Observer API for scroll-triggered animations
- `will-change` CSS property sparingly

**Complementary: GSAP (optional, for complex sequences)**
- **Package**: `gsap@3.12.x` with ScrollTrigger plugin
- **Use case**: If B2C requires cinematic timeline-based sequences beyond Framer Motion
- **Trade-off**: Bundle size (~40KB) — only add if truly needed

---

### State Management

**Zustand v4.x (Global Client State)**
- **Package**: `zustand@4.5.x` or latest
- **Rationale**:
  - Minimal boilerplate compared to Redux/Context
  - Perfect for UI state (modals, sidebar, theme preferences)
  - DevTools support with middleware
  - 1.2KB gzipped — negligible impact

**Use cases:**
- Modal open/close state
- B2B sidebar navigation state
- User preferences (view modes, filters)
- Ephemeral UI state NOT in URL

**TanStack Query v5.x (Server State)**
- **Package**: `@tanstack/react-query@5.x`
- **Rationale**:
  - Industry standard for async state (mock API + localStorage layer)
  - Built-in caching, revalidation, optimistic updates
  - DevTools for debugging data flows
  - Plays perfectly with Next.js Server Components

**Cache strategy:**
```typescript
// B2C: Longer stale times (luxury content changes slowly)
// B2B: Shorter stale times (financial data must be fresh)
// Admin: Aggressive revalidation (operational data)
```

**What NOT to use:**
- Redux/Redux Toolkit: Overkill for this scope, ceremony tax too high
- Recoil: Development velocity has slowed, community smaller
- MobX: Observable pattern conflicts with React 19 idioms

---

### Authentication

**NextAuth.js v5 (Auth.js)**
- **Package**: `next-auth@5.x` (beta as of Feb 2026, stable soon)
- **Rationale**: Already confirmed for real auth
- **Strategy**:
  - JWT sessions (stateless, scales globally)
  - Database adapter for persistent sessions (PostgreSQL or Prisma)
  - OAuth providers (Google, LinkedIn for B2B institutions)
  - Magic link for passwordless UHNI experience

**RBAC Implementation:**
```typescript
// 11 roles across 3 domains
// Middleware-based route protection
// Server-side role checks in API routes
// Client-side UI conditional rendering (UX optimization)
```

**Session Storage:**
- **Recommended**: PostgreSQL with Prisma adapter
- **Alternative**: Upstash Redis (edge-compatible, global low-latency)

**Security Hardening:**
- CSRF protection (built into NextAuth)
- Secure cookie flags (httpOnly, sameSite, secure)
- Rate limiting on auth endpoints (next-rate-limit or Upstash)

---

### Data Layer

**Mock API + localStorage Abstraction**
- **Pattern**: Service layer with interface contracts
```typescript
// services/api.interface.ts
interface ILifestyleService {
  getRecommendations(userId: string): Promise<Recommendation[]>
}

// services/api.mock.ts (Phase 1)
class MockLifestyleService implements ILifestyleService { ... }

// services/api.real.ts (Phase 2)
class RealLifestyleService implements ILifestyleService { ... }
```

**Data Validation: Zod v3.x**
- **Package**: `zod@3.23.x` or latest
- **Rationale**:
  - Runtime type validation (TypeScript only validates at compile time)
  - Schema-driven API contracts
  - Integrates with React Hook Form for form validation
  - Error messages customizable for luxury UX

**Optional: Prisma ORM (when moving to real DB)**
- **Package**: `prisma@5.x`, `@prisma/client@5.x`
- **Use case**: Type-safe DB access, migrations, multi-schema support
- **Database**: PostgreSQL 16+ (JSON support, full-text search, performance)

**localStorage Wrapper:**
```typescript
// utils/storage.ts
// Typed localStorage with encryption for sensitive data
// TTL support for cache invalidation
// Versioning for schema migrations
```

---

### Forms & Validation

**React Hook Form v7.x**
- **Package**: `react-hook-form@7.53.x` or latest
- **Rationale**:
  - Minimal re-renders (uncontrolled components)
  - Excellent UX for complex multi-step forms
  - Built-in error handling and field validation
  - DevTools for debugging form state

**Zod Integration**
- **Package**: `@hookform/resolvers@3.x`
- **Pattern**: Schema-first validation
```typescript
const schema = z.object({
  investmentPreference: z.enum(['conservative', 'balanced', 'aggressive']),
  liquidNetWorth: z.number().min(30_000_000) // UHNI threshold
})

type FormData = z.infer<typeof schema>
```

**Luxury Form UX Patterns:**
- Inline validation (debounced, non-intrusive)
- Progress indicators for multi-step flows
- Auto-save drafts to localStorage
- Conditional field rendering based on role context

---

### Testing

**Vitest (Unit/Integration)**
- **Package**: `vitest@2.x`, `@vitest/ui@2.x`
- **Rationale**:
  - Vite-native (faster than Jest for modern stacks)
  - ESM-first (aligns with Next.js 15)
  - Compatible with Jest ecosystem (matchers, assertions)
  - Excellent DX with UI mode

**Playwright (E2E)**
- **Package**: `@playwright/test@1.48.x` or latest
- **Rationale**:
  - Cross-browser testing (critical for UHNI global audience)
  - Visual regression testing (UI quality assurance)
  - Network interception (mock API layer validation)
  - Trace viewer for debugging

**E2E Test Strategy:**
```typescript
// Critical paths:
// 1. B2C: Lifestyle quiz → recommendations → CTA flows
// 2. B2B: Login → dashboard → client portfolio view
// 3. Admin: User management → role assignment → audit logs
```

**Testing Library**
- **Package**: `@testing-library/react@16.x`, `@testing-library/user-event@14.x`
- **Rationale**: User-centric testing (how users interact, not implementation details)

**Visual Regression (Optional):**
- **Package**: `@playwright/test` built-in screenshots
- **Alternative**: Percy, Chromatic (if budget allows)

---

### Dev Tools

**Type Safety**
- **TypeScript**: `typescript@5.6.x` or latest
- **Config**: Strict mode enabled, `noUncheckedIndexedAccess: true`
- **Path aliases**: `@/components`, `@/services`, `@/lib`

**Code Quality**
- **ESLint**: `eslint@9.x` with Next.js config
- **Prettier**: `prettier@3.x` (formatting only, no opinion conflicts)
- **Husky**: `husky@9.x` (pre-commit hooks)
- **lint-staged**: `lint-staged@15.x` (staged files only)

**Git Hooks Strategy:**
```bash
# pre-commit: lint-staged (ESLint + Prettier on staged files)
# pre-push: type-check (tsc --noEmit) + unit tests
```

**Package Manager: pnpm**
- **Version**: `pnpm@9.x`
- **Rationale**:
  - Faster installs (content-addressable storage)
  - Strict node_modules (no phantom dependencies)
  - Monorepo support if platform scales
  - Disk space efficient

**Environment Management**
- **Package**: `dotenv@16.x` (built into Next.js)
- **Pattern**: `.env.local` for secrets, `.env.example` for reference

**Documentation**
- **Storybook**: `storybook@8.x` (component library documentation)
- **Use case**: B2B/Admin components, design system showcase
- **Trade-off**: Overhead for small teams — consider Ladle as lightweight alternative

---

## What NOT to Use

### Avoid: Full Component Libraries
**Shadcn/ui, Material-UI, Ant Design, Chakra UI**
- **Why**: Pre-styled components compromise "UI is the product" principle
- **Exception**: Shadcn copy-paste pattern acceptable IF heavily customized
- **Reality**: For Dribbble-level quality, build on Radix primitives directly

### Avoid: CSS-in-JS (Styled Components, Emotion)
**Why**:
- Runtime overhead (styles injected via JS)
- Conflicts with React Server Components
- Slower hydration compared to Tailwind
- Harder to optimize for Lighthouse scores

### Avoid: Client-Heavy Frameworks
**Remix, Astro (for this use case)**
- Remix: SPA-first mental model conflicts with narrative B2C flow
- Astro: Better for content sites, lacks sophistication for B2B dashboard needs

### Avoid: GraphQL (for now)
**Apollo Client, urql, Relay**
- **Why**: Overkill for mock API + localStorage phase
- **Future**: Consider when real backend scales to complex data graphs

### Avoid: Monorepo Tools (Turborepo, Nx)
**Why**: Single Next.js app doesn't need monorepo complexity yet
- **Future**: Revisit if platform expands to mobile apps, separate marketing site

### Avoid: Animation Libraries (GSAP unless needed)
**Anime.js, Three.js (unless 3D required)**
- **Why**: Framer Motion covers 95% of use cases
- **Exception**: Add GSAP only if B2C demands complex timeline orchestration

---

## Confidence Levels

### High Confidence (Battle-Tested for Luxury Web)
- **Next.js 15 App Router**: Industry standard, proven at scale
- **Tailwind CSS**: Flexibility for custom design systems
- **Framer Motion**: Best-in-class animation library for React
- **React Hook Form + Zod**: De facto standard for form validation
- **Radix UI**: Accessibility + full design control
- **TanStack Query**: Server state management gold standard

### Medium Confidence (Good Fit, Monitor Ecosystem)
- **NextAuth v5**: Still beta, but v4 is stable fallback
- **Zustand**: Lightweight, but lacks time-travel debugging (vs Redux DevTools)
- **Vitest**: Newer than Jest, but momentum is strong
- **pnpm**: Less adopted than npm/yarn, but technically superior

### Experimental (Evaluate, Don't Commit Yet)
- **Tailwind v4**: Still in alpha, stick with v3.4.x until stable
- **React 19**: Compiler is powerful, but ecosystem still catching up
- **Partial Prerendering (Next.js)**: Experimental feature, monitor for perf gains

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Next.js 15 + TypeScript + Tailwind setup
- Font loading (Miller Display + Avenir LT Std)
- Color palette tokens
- Radix UI primitives installed
- Mock API service layer skeleton

### Phase 2: Core Features (Week 3-6)
- NextAuth integration (real auth)
- Framer Motion animation system
- React Hook Form + Zod validation
- Zustand for UI state
- TanStack Query for server state

### Phase 3: Testing & Optimization (Week 7-8)
- Playwright E2E setup
- Vitest unit tests for critical paths
- Lighthouse optimization (95+ scores)
- Accessibility audit (WCAG AA minimum)

---

## Key Architectural Decisions

### 1. Monolithic Next.js App (Not Microservices)
**Rationale**:
- B2C, B2B, Admin share auth, design system, data layer
- Parallel routes + middleware for separation of concerns
- Easier to maintain with small team
- Can extract later if needed

### 2. Edge Runtime for Auth Middleware
**Rationale**:
- Global low-latency for UHNI international audience
- Context-aware RBAC routing before page load
- Reduced server costs vs traditional Node.js runtime

### 3. Service Abstraction for Data Layer
**Rationale**:
- Swap mock → real API without touching components
- Easier testing (inject mock services)
- Future-proof for backend changes

### 4. Server Components by Default
**Rationale**:
- Reduce client JS bundle (faster TTI)
- SEO benefits for B2C narrative pages
- Use Client Components only when needed (forms, animations)

---

## Bundle Size Budget

### Critical Metrics
- **Initial JS**: < 200KB (gzipped)
- **FCP**: < 1.2s (luxury audience expects speed)
- **LCP**: < 2.0s
- **CLS**: < 0.1 (animations must be stable)

### Library Weights (Approximate)
```
Next.js runtime:       ~80KB
React 19:              ~45KB
Framer Motion:         ~35KB
Radix UI (5 components): ~20KB
Zustand:               ~1KB
TanStack Query:        ~13KB
React Hook Form:       ~9KB
Zod:                   ~8KB
Lucide (10 icons):     ~5KB
---
Total (estimated):     ~220KB (within budget)
```

### Optimization Strategy
- Tree-shaking via ESM imports
- Dynamic imports for heavy components (admin dashboard charts)
- Server Components for static content
- Image optimization via next/image
- Font subsetting (Latin only if no intl requirement)

---

## Rationale Summary

This stack balances:
1. **Performance**: RSC, edge runtime, minimal client JS
2. **DX**: TypeScript, Vitest, ESLint, Prettier
3. **Flexibility**: Headless UI (Radix), Tailwind for custom design
4. **Future-Proof**: Service abstraction, Next.js ecosystem momentum
5. **Quality**: No compromises on animation (Framer Motion), validation (Zod), testing (Playwright)

**Alignment with UHNI Platform Goals:**
- Dribbble-level UI: Tailwind + Radix + Framer Motion = full creative control
- Luxury feel: Custom fonts, cinematic animations, no generic dashboard vibes
- RBAC complexity: NextAuth + middleware + TanStack Query for role-aware data fetching
- Responsive parity: Tailwind's mobile-first approach, container queries
- End-to-end flows: React Hook Form orchestrates multi-step CTAs

**This stack ships fast, scales well, and won't compromise on experience.**

---

*Next Step: Use this to create roadmap with specific library integration milestones.*
