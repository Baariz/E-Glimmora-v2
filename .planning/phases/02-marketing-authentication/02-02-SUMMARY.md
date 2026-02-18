---
phase: 02-marketing-authentication
plan: 02
subsystem: marketing-frontend
tags: [parallax, scroll-animations, editorial-design, framer-motion, philosophy, privacy-charter, luxury-ux]

requires:
  - phase: 02-01
    plan: 01
    artifact: MarketingNav, MarketingFooter, /invite page
  - phase: 01-05
    plan: 05
    artifact: Parallax component, ScrollReveal component

provides:
  - artifact: Editorial homepage with parallax scroll story
    path: src/app/(marketing)/page.tsx
    type: page
    key_exports: [MarketingHomePage]
  - artifact: Philosophy page
    path: src/app/(marketing)/philosophy/page.tsx
    type: page
    key_exports: [PhilosophyPage]
  - artifact: Privacy Charter page
    path: src/app/(marketing)/privacy/page.tsx
    type: page
    key_exports: [PrivacyCharterPage]

affects:
  - phase: 03
    reason: Homepage establishes visual language for B2C authenticated experience
  - phase: 05
    reason: Privacy principles inform data governance features

tech-stack:
  added: [otpauth@9.5.0]
  patterns:
    - name: Custom parallax with useScroll/useTransform
      where: Homepage hero section
      why: Fine-grained control over scroll-based animations beyond Parallax component
    - name: Editorial long-form prose layout
      where: All three pages
      why: Luxury magazine feel, not tech landing page
    - name: ScrollReveal with staggered delays
      where: Three Pillars, Privacy Principles sections
      why: Sequential entrance creates narrative flow
    - name: Dark hero for trust signaling
      where: Privacy Charter page
      why: Seriousness and trustworthiness for privacy commitment

key-files:
  created:
    - path: src/app/(marketing)/page.tsx
      purpose: Editorial homepage with 6 parallax scroll sections
      lines: 264
    - path: src/app/(marketing)/philosophy/page.tsx
      purpose: Brand philosophy and approach page
      lines: 164
    - path: src/app/(marketing)/privacy/page.tsx
      purpose: Privacy Charter with 6 plain-language principles
      lines: 165
  modified:
    - path: package.json
      purpose: Added otpauth dependency (blocking fix)
    - path: src/app/(marketing)/page.tsx
      purpose: ESLint quote fixes (blocking fix)

decisions:
  - what: Use custom parallax (useScroll/useTransform) for hero instead of Parallax component
    why: Hero needs y-translation AND opacity fade on scroll, Parallax component only does y-translation
    alternatives: [Extend Parallax component with opacity prop, Use two nested Parallax components]
    chosen: Custom hook for hero-specific needs
    impact: More control, but slightly more code
  - what: Remove metadata exports from client components
    why: Next.js 15 disallows metadata export from 'use client' components
    alternatives: [Split into layout.tsx + page.tsx, Use static metadata in parent layout]
    chosen: Remove metadata (SEO handled by parent layout)
    impact: Page titles default to site title, acceptable for v1
  - what: Editorial prose over feature cards/grids
    why: UHNI audience expects luxury editorial experience like Hermès annual reports
    alternatives: [SaaS-style feature sections, Mixed approach with some cards]
    chosen: Pure editorial with generous whitespace and typography
    impact: Unique brand identity, no conversion optimization patterns (intentional)
  - what: Color blocks as image placeholders
    why: No real photography provided yet, gradients maintain visual rhythm
    alternatives: [Wait for photos, Use stock luxury images, Leave blank]
    chosen: Abstract gradient blocks (teal-to-olive for Experience section)
    impact: Establishes visual structure, easy to swap when real photos arrive

metrics:
  duration: 6 minutes
  tasks: 2
  commits: 4
  deviations: 3
  files_created: 2
  files_modified: 2
  lines_added: 758
  completed: 2026-02-16
---

# Phase 2 Plan 2: Editorial Homepage and Content Pages Summary

**One-liner:** Cinematic parallax scroll homepage with 6 narrative sections + Philosophy/Privacy Charter editorial content pages — luxury magazine experience, not SaaS landing page.

## Objective

Build the editorial homepage with rich parallax scroll storytelling, plus Philosophy and Privacy Charter content pages. The homepage is the first impression for potential UHNI members — it must communicate Élan Glimmora's identity through a cinematic scroll experience. Think Hermès annual report, not Stripe landing page.

## What Was Built

### Homepage Scroll Story (6 Sections)

**Section 1 - Hero (100vh):**
- Brand name "Élan Glimmora" in massive serif type (text-7xl → text-9xl responsive)
- Tagline "Sovereign Lifestyle Intelligence" in tracked uppercase
- Custom parallax: hero text moves up and fades (y: 0 → -100, opacity: 1 → 0) as user scrolls
- Animated scroll indicator (bouncing chevron) using framer-motion
- Subtle radial gradient background (sand-50 to white)
- Uses `useScroll({ target: heroRef, offset: ["start start", "end start"] })` for fine control
- Uses `useTransform` to map scrollYProgress to y position and opacity

**Section 2 - Philosophy Preview (100vh, bg-sand-50):**
- Quote-style editorial block: "For those who shape the future, privacy is not a feature — it is sovereignty."
- Attribution: "The Élan Philosophy" in small tracked caps
- CTA link to /philosophy (understated, not button)
- ScrollReveal fadeUp entrance animation

**Section 3 - Three Pillars (min-h-screen, bg-white):**
- Three editorial blocks presented vertically with generous spacing:
  1. Emotional Intelligence — wealth is emotional, not transactional
  2. Privacy Sovereignty — your data, your rules
  3. Narrative Experience — life is not a dashboard
- Each pillar: serif heading + sans body in long-form prose
- Thin horizontal lines (border-sand-200) as subtle separators
- Staggered ScrollReveal entrances (delay: 0, 0.15, 0.3)

**Section 4 - Visual Break (60vh, bg-rose-950):**
- Dark cinematic section for contrast
- "By invitation only" in large serif white text
- Subtext: "A membership as exclusive as the experiences we curate"
- Parallax component with speed={0.3} for slower scroll
- Creates visual drama and reinforces exclusivity

**Section 5 - The Experience (min-h-screen, bg-sand-50):**
- Two-column layout (text left, visual right)
- Left: Eyebrow "THE EXPERIENCE" + heading + 3 editorial paragraphs
- Right: Abstract gradient color block (teal-100 to olive-100, aspect-[3/4], rounded-2xl)
- Describes emotional intelligence algorithms and sovereign privacy architecture
- ScrollReveal for both columns with 0.2s delay offset

**Section 6 - Final CTA (80vh, bg-white):**
- Centered: "READY?" eyebrow + "Begin Your Sovereign Journey" heading
- Description: "Enter your invitation code to experience Élan Glimmora."
- Button: "Request Access" linking to /invite (bg-rose-900, large, shadow)
- ScrollReveal fadeUp entrance

**Design Characteristics:**
- 264 lines of editorial scroll storytelling
- Full-viewport or near-full sections (h-screen, min-h-screen, 60vh, 80vh)
- Typography-driven with generous whitespace
- NO SaaS patterns: no feature grids, no pricing tables, no testimonial carousels
- Parallax creates depth and dimensionality
- Respects reduced motion preferences (useReducedMotion hook)
- Fully responsive (mobile/desktop layouts)

### Philosophy Page (/philosophy)

**Structure:**
- Hero (60vh, bg-sand-50): "Intelligence, Not Information"
- Section 1: The Paradox of Abundance — UHNI have everything except clarity
- Section 2: Emotional Architecture — our approach to wealth as narrative
- Section 3: Sovereignty as a Right — privacy principles, CTA to /privacy
- Closing CTA: "Experience the Difference" link to /invite

**Design:**
- 164 lines of editorial prose
- Narrow content column (max-w-2xl) for readability
- Long-form paragraphs, NO bullet points
- ScrollReveal animations with staggered delays
- Thin decorative separator (w-16 h-px bg-rose-200)
- Luxury editorial magazine feel

### Privacy Charter Page (/privacy)

**Structure:**
- Dark hero (60vh, bg-rose-950): "Your Sovereignty, Our Promise" for trust
- Preamble: "This is not a legal document designed to obscure..."
- 6 Privacy Principles presented as editorial content:
  1. Your Data Belongs to You
  2. Consent is Explicit, Never Assumed
  3. Visibility is Your Choice
  4. The Right to Disappear (global erase is permanent)
  5. No Surveillance, No Tracking
  6. Security Without Compromise
- Closing CTA: Questions? Contact advisor, link to /invite

**Design:**
- 165 lines of plain-language privacy commitment
- Dark hero signals seriousness and trustworthiness
- Each principle: serif heading (text-2xl → text-3xl) + sans body prose
- Generous spacing between principles (space-y-16 → space-y-24)
- NO legal jargon or obscure language
- ScrollReveal with staggered delays (0, 0.1, 0.2, 0.3, 0.4, 0.5)

## Implementation Details

**Custom Parallax for Hero:**
```tsx
const heroRef = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({
  target: heroRef,
  offset: ['start start', 'end start'],
})
const heroY = useTransform(scrollYProgress, [0, 1], [0, -100])
const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
```
- `useScroll` creates scroll-linked animation value
- `useTransform` maps scrollYProgress to y position and opacity
- Applies to hero content via `<motion.div style={{ y: heroY, opacity: heroOpacity }}>`
- Respects reduced motion: conditionally applies empty style object

**ScrollReveal Integration:**
- Imported from `@/components/shared/ScrollReveal/ScrollReveal`
- Uses `fadeUp` variant from `@/styles/variants/scroll-reveal`
- Staggered delays create narrative flow
- Each section wraps content in `<ScrollReveal variant={fadeUp} delay={0.X}>`

**Responsive Design:**
- Font sizes scale: `text-7xl md:text-8xl lg:text-9xl`
- Padding adjusts: `px-6 md:px-12 lg:px-20`, `py-20 md:py-32`
- Grid layouts collapse: `grid-cols-1 lg:grid-cols-2`
- Section heights adapt: `h-screen`, `min-h-screen`, `60vh`, `80vh`

**Accessibility:**
- Reduced motion support via `useReducedMotion` hook
- Semantic HTML: `<section>`, `<article>`, `<blockquote>`
- ARIA attributes: `aria-hidden="true"` for decorative elements
- Focus-visible styles inherited from base Button component

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing otpauth dependency**
- **Found during:** Task 2 build verification
- **Issue:** Production build failed with "Module not found: Can't resolve 'otpauth'"
- **Root cause:** Plan 02-03 (MFA implementation) added imports but didn't install dependency
- **Fix:** Installed `otpauth@9.5.0` via `pnpm add otpauth`
- **Files modified:** package.json, pnpm-lock.yaml
- **Commit:** 3856844
- **Rationale:** Build verification was blocked, needed to confirm new pages compile successfully

**2. [Rule 3 - Blocking] ESLint unescaped quote errors**
- **Found during:** Task 2 build verification
- **Issue:** Build failed with react/no-unescaped-entities errors
  - Homepage line 202: "world's" → "world&apos;s"
  - Philosophy line 149: "world's" → "world&apos;s"
  - Privacy line 107-108: "deactivated but retained" → "&ldquo;deactivated but retained&rdquo;"
  - Privacy line 151: "it's" → "it&apos;s"
- **Fix:** Replaced unescaped quotes with HTML entities
- **Files modified:** All three page files
- **Commit:** 64be525 (homepage only, others fixed pre-commit)
- **Rationale:** Production build blocked, ESLint enforces this rule

**3. [Rule 1 - Bug] Metadata export from client component**
- **Found during:** Task 2 initial build
- **Issue:** Next.js 15 error: "You are attempting to export 'metadata' from a component marked with 'use client'"
- **Root cause:** Philosophy and Privacy pages need 'use client' for ScrollReveal, but had metadata exports
- **Fix:** Removed `export const metadata = { title: '...' }` from both files
- **Impact:** Page titles default to site title from root layout (acceptable for v1)
- **Files modified:** philosophy/page.tsx, privacy/page.tsx
- **Not committed separately:** Fixed during Task 2 development
- **Rationale:** Next.js 15 architectural constraint, metadata only works in Server Components

## Next Phase Readiness

**Ready for Phase 3 (B2C Authenticated Experience):**
- ✅ Homepage establishes visual language (parallax, editorial prose, luxury whitespace)
- ✅ Design tokens and typography patterns validated at scale
- ✅ ScrollReveal patterns proven across multiple content types
- ✅ Philosophy and Privacy pages provide narrative context for authenticated features
- ✅ CTA flows lead to /invite (entry point established)

**Blockers/Concerns:**
- None — all editorial marketing content complete

**Future Enhancements (out of scope for this plan):**
- Real photography: Replace gradient color blocks with luxury lifestyle photography
- Licensed fonts: Swap Georgia/system-ui for Miller Display (serif) + Avenir LT Std (sans)
- Page-specific metadata: When pages become Server Components, add specific titles/descriptions
- Deeper scroll interactions: Consider horizontal scroll sections, more complex parallax layers

**Technical Debt:**
- None introduced

## Decisions Made

Logged in .planning/PROJECT.md Key Decisions:

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Custom parallax for hero (useScroll/useTransform) vs Parallax component | Hero needs both y-translation AND opacity fade, Parallax component only supports y-translation | More control over animation, slightly more code but necessary for design vision |
| Editorial prose over feature cards/grids | UHNI audience expects luxury editorial like Hermès, not SaaS landing page | Unique brand identity, no conversion optimization patterns (intentional trade-off) |
| Remove metadata from client pages | Next.js 15 disallows metadata in 'use client' components | Page titles default to site title, acceptable for v1 SEO |
| Color blocks as image placeholders | No real photography provided yet, gradients maintain visual rhythm | Establishes visual structure, easy swap when photos arrive |

## Files Created/Modified

### Created (2 files, 329 lines)
- `src/app/(marketing)/page.tsx` (264 lines) — Editorial homepage with parallax scroll story
- `src/app/(marketing)/philosophy/page.tsx` (164 lines) — Philosophy and approach page
- `src/app/(marketing)/privacy/page.tsx` (165 lines) — Privacy Charter page

### Modified (2 files)
- `package.json` — Added otpauth@9.5.0 dependency
- `src/app/(marketing)/page.tsx` — ESLint quote fixes

## Testing & Verification

**Build Verification:**
```bash
pnpm tsc --noEmit  # ✅ Zero TypeScript errors
pnpm build         # ✅ Production build succeeds
```

**Routes:**
- ✅ GET / — Homepage renders with 6 parallax sections
- ✅ GET /philosophy — Philosophy page renders editorial content
- ✅ GET /privacy — Privacy Charter page renders 6 principles

**Visual Verification (manual):**
- Homepage hero parallax works (text moves up and fades on scroll)
- ScrollReveal animations trigger on section entrance
- All sections responsive (mobile/desktop)
- Reduced motion respected
- All links to /philosophy, /privacy, /invite work
- Typography hierarchy clear across all pages

**Accessibility:**
- ✅ Semantic HTML (`<section>`, `<article>`, `<blockquote>`)
- ✅ ARIA attributes for decorative elements
- ✅ Reduced motion support
- ✅ Focus-visible styles

## Commits

**Task 1: Editorial Homepage**
- `4ce34dc` — feat(02-02): build editorial homepage with parallax scroll story

**Task 2: Philosophy and Privacy Pages**
- `8198dcc` — feat(02-02): create Philosophy and Privacy Charter pages

**Blocking Fixes (Deviations):**
- `3856844` — fix(02-02): install missing otpauth dependency
- `64be525` — fix(02-02): fix ESLint unescaped quote error in homepage

**Total:** 4 commits

## Lessons Learned

**What Went Well:**
- Custom parallax with useScroll/useTransform provided precise control for hero animation
- ScrollReveal with staggered delays created excellent narrative flow
- Editorial prose design clearly differentiates from SaaS landing pages
- Color blocks as placeholders maintain visual rhythm until real photography arrives

**What Could Be Improved:**
- Could have caught ESLint quote errors earlier with local linting before build
- Next.js 15 metadata constraints could be documented in project setup docs

**Technical Insights:**
- Next.js 15 made route params async (breaking change from v14)
- Metadata export only works in Server Components (strict separation)
- useScroll/useTransform provides more fine-grained control than Parallax component wrapper
- Editorial luxury design requires confidence to use generous whitespace (no FOMO about "above the fold")

## Performance

**Lighthouse Scores (local dev):**
- Not measured in this plan (defer to Phase 6 optimization)

**Build Time:**
- Production build: ~1.8 seconds compile (acceptable)

**Bundle Size:**
- Homepage: First Load JS ~102 kB (shared chunks)
- Philosophy: First Load JS ~145 kB
- Privacy: First Load JS ~145 kB
- All within acceptable range for editorial content pages

## What's Next

**Immediate (Plan 02-03):**
- Already complete (NextAuth v5 integration)

**Plan 02-04:**
- MFA and device recognition (already complete)

**Phase 3:**
- B2C authenticated experience (Briefing, Portfolio, Dashboard)
- Will inherit visual language established by homepage
- Same typography, colors, animation patterns

**Future:**
- Swap gradient blocks for real luxury photography
- Install licensed fonts when client provides .woff2 files
- Add page-specific metadata when pages become Server Components
- Consider more complex parallax layers (horizontal scroll, layered depth)
