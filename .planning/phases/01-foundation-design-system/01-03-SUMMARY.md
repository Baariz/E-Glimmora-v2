---
phase: 01-foundation-design-system
plan: 03
subsystem: ui
tags: [framer-motion, animations, page-transitions, route-groups, next.js]

# Dependency graph
requires:
  - phase: 01-01
    provides: Tailwind config, font setup, base design tokens
provides:
  - Framer Motion animation system with variants and utilities
  - PageTransition provider with AnimatePresence
  - ScrollReveal component for viewport-triggered animations
  - Parallax component for scroll-based motion
  - useReducedMotion hook for accessibility
  - Four route group layouts (marketing, B2C, B2B, admin)
  - Domain-specific chrome and navigation patterns
affects: [02-onboarding, 03-client-experience, 04-partner-ops, 05-admin]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Route group layouts for domain separation"
    - "AnimatePresence for page transitions"
    - "Reduced motion detection for accessibility"
    - "Website-style vs dashboard-style navigation patterns"

key-files:
  created:
    - src/lib/hooks/useReducedMotion.ts
    - src/styles/variants/page-transitions.ts
    - src/styles/variants/scroll-reveal.ts
    - src/styles/variants/micro-interactions.ts
    - src/components/providers/PageTransition.tsx
    - src/components/shared/ScrollReveal/ScrollReveal.tsx
    - src/components/shared/Parallax/Parallax.tsx
    - src/app/(marketing)/layout.tsx
    - src/app/(marketing)/page.tsx
    - src/app/(b2c)/layout.tsx
    - src/app/(b2c)/briefing/page.tsx
    - src/app/(b2b)/layout.tsx
    - src/app/(b2b)/portfolio/page.tsx
    - src/app/(admin)/layout.tsx
    - src/app/(admin)/dashboard/page.tsx
  modified: []

key-decisions:
  - "Marketing layout has NO persistent navigation (editorial pages own their nav)"
  - "B2C uses website-style top nav (NOT dashboard) for luxury website feel"
  - "B2B uses sidebar navigation for premium dashboard density"
  - "Admin uses functional top nav for operational efficiency"
  - "PageTransition wraps B2C, B2B, Admin (marketing uses scroll-based editorial animations)"
  - "Marketing page owns root (/) route, old root page.tsx removed"

patterns-established:
  - "Route groups do NOT affect URL structure (e.g., /briefing not /b2c/briefing)"
  - "Each route group has distinct visual identity via layout chrome and background color"
  - "All animations respect prefers-reduced-motion preference"
  - "Framer Motion variants are centralized in src/styles/variants/"

# Metrics
duration: 4min
completed: 2026-02-15
---

# Phase 01 Plan 03: Animation System & Route Groups Summary

**Framer Motion animation system with 13 reusable variants plus four route group layouts with domain-specific chrome (editorial, website, dashboard, admin)**

## Performance

- **Duration:** 4 minutes
- **Started:** 2026-02-15T17:46:49Z
- **Completed:** 2026-02-15T17:51:11Z
- **Tasks:** 2
- **Files modified:** 19

## Accomplishments
- Complete Framer Motion animation system with 4 page transition variants, 4 scroll reveal variants, 5 micro-interaction presets
- PageTransition provider with AnimatePresence for smooth route changes
- ScrollReveal and Parallax components for cinematic motion design
- Four route group layouts with distinct visual identities and navigation patterns
- Domain separation via Next.js route groups without affecting URL structure

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Framer Motion animation system** - `ef01962` (feat)
2. **Task 2: Establish four route group layouts** - `d77115e` (feat)

## Files Created/Modified

### Animation System
- `src/lib/hooks/useReducedMotion.ts` - SSR-safe reduced motion detection hook
- `src/styles/variants/page-transitions.ts` - Page transition variants (fadeSlide, fadeScale, slideFromRight, slideFromLeft)
- `src/styles/variants/scroll-reveal.ts` - Scroll reveal variants (fadeUp, fadeIn, scaleIn, staggerChildren)
- `src/styles/variants/micro-interactions.ts` - Micro-interaction variants (buttonTap, buttonHover, cardHover, pulseOnce, shimmer)
- `src/styles/variants/index.ts` - Barrel export for all variants
- `src/components/providers/PageTransition.tsx` - AnimatePresence wrapper keyed by pathname
- `src/components/shared/ScrollReveal/ScrollReveal.tsx` - Viewport-triggered fade-in component
- `src/components/shared/Parallax/Parallax.tsx` - Scroll-based parallax component

### Route Group Layouts
- `src/app/(marketing)/layout.tsx` - Editorial layout, minimal chrome, full-width
- `src/app/(marketing)/page.tsx` - Marketing homepage (owns root /)
- `src/app/(b2c)/layout.tsx` - Website-style top nav, warm sand background
- `src/app/(b2c)/briefing/page.tsx` - B2C briefing placeholder (/briefing)
- `src/app/(b2b)/layout.tsx` - Premium dashboard with 260px sidebar
- `src/app/(b2b)/portfolio/page.tsx` - B2B portfolio placeholder (/portfolio)
- `src/app/(admin)/layout.tsx` - Functional top nav, operational feel
- `src/app/(admin)/dashboard/page.tsx` - Admin dashboard placeholder (/dashboard)

## Decisions Made

1. **Marketing owns root route:** Deleted old `src/app/page.tsx` and moved homepage to `src/app/(marketing)/page.tsx` to align with route group architecture
2. **B2C navigation pattern:** Website-style horizontal top nav (NOT sidebar) to maintain luxury website feel vs. dashboard SaaS feel
3. **PageTransition selective application:** Wraps B2C, B2B, and Admin layouts but NOT marketing (marketing will use scroll-based editorial animations)
4. **Inline navigation components:** Built nav components inline within layouts for now (can be extracted later if reused)
5. **Placeholder content domain-appropriate:** Each route group's placeholder page matches its intended audience and use case

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - build succeeded on first attempt, all routes generated correctly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 2 (Onboarding):**
- Animation system available for onboarding flow transitions
- Route groups established for domain-specific pages
- PageTransition provider ready to wrap authenticated routes

**Ready for Phase 3 (Client Experience):**
- B2C layout ready for Sovereign Briefing implementation
- Card component available for briefing sections
- ScrollReveal ready for cinematic content reveals

**Ready for Phase 4 (Partner Operations):**
- B2B layout ready for Portfolio Dashboard implementation
- Sidebar navigation pattern established
- Data table structure prototyped

**Ready for Phase 5 (Admin):**
- Admin layout ready for platform administration
- Top nav pattern established
- Metrics card layout prototyped

**No blockers or concerns.**

---
*Phase: 01-foundation-design-system*
*Completed: 2026-02-15*
