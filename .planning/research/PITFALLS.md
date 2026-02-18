# Pitfalls Research
**Project:** Élan Glimmora - Sovereign Lifestyle Intelligence Platform
**Date:** 2026-02-15
**Purpose:** Identify and prevent critical mistakes in luxury UHNI platform development

---

## Critical Pitfalls

### 1. Dashboard-First Design for B2C Experience
- **Risk Level:** HIGH
- **Warning Signs:**
  - Early wireframes showing data tables, cards, or widgets in B2C routes
  - Navigation patterns that resemble admin panels
  - Dense information displays rather than editorial/magazine layouts
  - Copy-paste component reuse between B2B and B2C
  - Designers defaulting to shadcn/ui components without customization
- **Prevention Strategy:**
  - Establish B2C as "digital magazine meets concierge" from day one
  - Reference luxury brand websites (not SaaS dashboards) during design
  - Create separate component libraries for B2C vs B2B contexts
  - Use large-format imagery, cinematic transitions, editorial typography
  - Never show raw data in B2C - everything must be narrative/story-driven
  - Design reviews must include "does this feel like Ritz-Carlton or Salesforce?"
- **Phase to Address:** Phase 0 (Design System) & Phase 1 (Foundation)
- **Impact if Ignored:** UHNI users will perceive platform as "tech product" not "luxury service" - immediate trust/credibility loss

### 2. Mock Service Architecture That Can't Scale to Production
- **Risk Level:** HIGH
- **Warning Signs:**
  - Hardcoded mock data directly in components
  - Business logic mixed with presentation layer
  - No service layer abstraction
  - Different data shapes in mocks vs planned backend contracts
  - Temporal logic (versioning, state machines) implemented in frontend
  - No separation between data access and data transformation
- **Prevention Strategy:**
  - Design production service interfaces first, then mock them
  - Use dependency injection or service locator pattern
  - Keep all data access behind service facades
  - Mock services should return production-shaped data
  - Implement state machines in dedicated service layer (not components)
  - Document expected backend contracts in TypeScript interfaces
  - Use feature flags to swap mock/real services without code changes
- **Phase to Address:** Phase 1 (Foundation) - Architecture must be right from start
- **Impact if Ignored:** Complete rewrite required when backend arrives - 3-6 month delay, loss of all temporal/versioning logic

### 3. Incomplete CTA Flow Implementation
- **Risk Level:** HIGH
- **Warning Signs:**
  - Buttons that trigger toast notifications instead of flows
  - "Coming soon" or disabled states in production
  - Forms that don't actually submit
  - Navigation that dead-ends at placeholder pages
  - Missing confirmation/success states
  - No error handling for failed actions
- **Prevention Strategy:**
  - Map every CTA to a complete user flow before implementation
  - Define success criteria: CTA click → state change → feedback → next state
  - Build "walking skeleton" for each flow domain before adding features
  - QA checklist: "Can user complete intended action and see result?"
  - Use Storybook or similar to document all flow states
  - Track CTA completion as acceptance criteria, not presence
- **Phase to Address:** Phase 2-4 (Every feature phase)
- **Impact if Ignored:** Platform feels like vaporware, destroys credibility with UHNI clientele who expect flawless execution

### 4. RBAC Permissions as Afterthought
- **Risk Level:** HIGH
- **Warning Signs:**
  - Building features first, adding permissions later
  - UI conditionals scattered throughout components (if user.role === 'admin')
  - Permission checks at page level only, not action level
  - Same component rendering different content based on role (kitchen-sink components)
  - No clear permission naming convention
  - Authorization logic duplicated across routes
- **Prevention Strategy:**
  - Define permission model before any feature work (Phase 1)
  - Use permission-based rendering, not role-based (check 'can_edit_journey' not 'is_admin')
  - Centralize authorization in middleware + service layer
  - Create permission boundary components (RequirePermission wrapper)
  - Build RBAC testing matrix (role × action × expected outcome)
  - Document permission inheritance and context switching rules
  - Handle dual-context users from day one (B2C → B2B role transitions)
- **Phase to Address:** Phase 1 (Foundation) - RBAC must be architectural
- **Impact if Ignored:** Security vulnerabilities, unmaintainable authorization code, failed audits, cannot prove compliance

### 5. Performance Degradation from Luxury Aesthetics
- **Risk Level:** HIGH
- **Warning Signs:**
  - Large unoptimized images (>500KB) in critical paths
  - Complex animations blocking interaction
  - Custom fonts causing layout shift or long load times
  - Client-side animation libraries (GSAP, Framer Motion) without code splitting
  - Video backgrounds auto-playing on mobile
  - No lazy loading for below-fold cinematic content
- **Prevention Strategy:**
  - Establish performance budget: LCP <2.5s, FID <100ms, CLS <0.1
  - Use Next.js Image component for all media
  - Implement font subsetting for Miller Display + Avenir LT Std
  - Lazy load animation libraries, initialize only when needed
  - Use CSS transforms for animations (GPU-accelerated)
  - Implement progressive loading: show structure → content → enhancements
  - Test on real UHNI device profiles (latest iPhone/MacBook, fast connections)
- **Phase to Address:** Phase 0 (Design System) + ongoing monitoring
- **Impact if Ignored:** Beautiful but unusable - UHNI users have zero tolerance for jank or loading delays

### 6. Missing SOW Requirements Discovery at End
- **Risk Level:** HIGH
- **Warning Signs:**
  - Features mentioned in SOW not in backlog/roadmap
  - Vague requirements not broken down into implementable stories
  - "We'll figure that out later" for complex features
  - No traceability from SOW to roadmap to tasks
  - Assumptions about "implied" functionality without validation
- **Prevention Strategy:**
  - Create SOW traceability matrix (SOW item → Epic → Stories)
  - Review every SOW paragraph for features, constraints, and requirements
  - Flag ambiguous requirements for clarification before Phase 1
  - Include all "system shall..." statements as acceptance criteria
  - Schedule SOW validation checkpoint before each phase kickoff
  - Maintain "SOW coverage" metric - track percentage implemented
- **Phase to Address:** Phase 0 (Planning) - Complete before any development
- **Impact if Ignored:** Scope explosion in late phases, missed launch dates, contract disputes, rebuild work

---

## Architecture Pitfalls

### 7. Route Group Boundary Violations
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Importing components from /marketing into /b2c or vice versa
  - Shared state that spans route groups
  - Navigation logic that doesn't respect route group boundaries
  - Layout components duplicated instead of composed
  - Hardcoded route paths instead of route constants
- **Prevention Strategy:**
  - Establish import rules: route groups can import from /lib, not from each other
  - Use path aliases: @marketing, @b2c, @b2b, @admin, @lib
  - Shared components must live in /lib or /components
  - Create route group adapter layer for cross-boundary navigation
  - Use TypeScript path restrictions (no-restricted-imports ESLint rule)
  - Document which code is route-group-specific vs shared
- **Phase to Address:** Phase 1 (Foundation)
- **Impact if Ignored:** Tangled dependencies, cannot deploy/scale route groups independently, difficult refactoring

### 8. Dual-Context User State Management Failures
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Session state assumes single role per user
  - Hard refreshes required when switching B2C ↔ B2B
  - User context lost during role transitions
  - Permissions cached incorrectly across contexts
  - Navigation state reset when changing domains
- **Prevention Strategy:**
  - Design user context to hold multiple active roles
  - Implement context-switching API with state preservation
  - Use domain-scoped permissions (b2c:read_journey vs b2b:edit_journey)
  - Store context preference in user session
  - Build context switcher UI component early
  - Test all flows with dual-context users, not just single-role
- **Phase to Address:** Phase 1 (Foundation) - Auth/context architecture
- **Impact if Ignored:** Poor UX for most valuable users (who have both B2C + B2B access), data leakage between contexts

### 9. Memory Vault Global Erase Not Truly Sovereign
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - "Deleted" data still in database with soft-delete flag
  - Backup systems retaining erased data
  - Third-party services (analytics, monitoring) keeping copies
  - Audit logs containing PII from erased data
  - Cache layers not invalidated on erase
  - No verification that erase completed across all systems
- **Prevention Strategy:**
  - Design hard-delete cascade from day one
  - Document every system that touches user data (map data flow)
  - Implement erase verification workflow
  - Use data retention policies that respect sovereignty
  - Audit logs must not contain PII - use pseudonymous identifiers
  - Test global erase in staging with full stack (when backend exists)
  - Provide erase completion certificate to user
- **Phase to Address:** Phase 1 (Architecture) + Phase 3 (Memory Vault implementation)
- **Impact if Ignored:** Not truly sovereign, GDPR/privacy compliance failures, legal liability, reputation damage

### 10. Journey Versioning Without Immutability Guarantees
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Version history implemented as snapshots that can be edited
  - No cryptographic proof of version integrity
  - Version timestamps client-generated (can be faked)
  - Ability to delete versions from history
  - No tamper detection
  - Version diffs computed at read time (not stored)
- **Prevention Strategy:**
  - Use event sourcing pattern for journey changes
  - Store immutable version records with hash chains
  - Server-side timestamp generation only
  - Append-only version log (no deletes)
  - Compute and store diffs at write time
  - Consider content-addressing for version identity
  - Build compliance state machine that enforces immutability
- **Phase to Address:** Phase 2 (Journey Versioning)
- **Impact if Ignored:** Cannot prove data integrity for compliance/legal, versions can be tampered with, audit trail unreliable

---

## UX/UI Pitfalls

### 11. Typography System Not Optimized for Licensed Fonts
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Miller Display + Avenir LT Std loaded as full font families (all weights)
  - No font subsetting for unused glyphs
  - FOUT (flash of unstyled text) during page load
  - Font files not preloaded
  - No fallback font stack that matches metrics
  - Font loading blocking render
- **Prevention Strategy:**
  - Subset fonts to only needed characters + weights
  - Use Next.js font optimization with local fonts
  - Define fallback fonts with similar metrics (font-size-adjust)
  - Implement font-display: swap with size-adjust for smooth transition
  - Preload critical font files in <head>
  - Test on slow 3G to verify fallback experience
  - Document font usage rules in design system
- **Phase to Address:** Phase 0 (Design System)
- **Impact if Ignored:** Poor load performance, layout shift, increased licensing costs (serving unused font data)

### 12. Animation Overload Causing Cognitive Fatigue
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Every element animates on every page
  - Animations that don't convey meaning (decoration only)
  - Long animation durations (>500ms for common interactions)
  - Parallax effects that make content hard to read
  - No reduced-motion support
  - Animations competing for attention
- **Prevention Strategy:**
  - Use animation hierarchy: critical interactions animate, rest is static
  - Keep interaction animations under 200ms
  - Cinematic animations for key moments only (entry, major state changes)
  - Respect prefers-reduced-motion media query
  - User preference for "cinematic mode" vs "focused mode"
  - Animation design principle: guide attention, don't distract
  - Test with actual UHNI users - get feedback on fatigue
- **Phase to Address:** Phase 0 (Design System) - establish animation principles
- **Impact if Ignored:** Platform feels gimmicky not luxurious, accessibility issues, user fatigue

### 13. Color Palette Inconsistency from Moodboard
- **Risk Level:** LOW
- **Warning Signs:**
  - Designers picking colors "close to" moodboard
  - No defined color tokens in design system
  - RGB values copy-pasted instead of named variables
  - Different shades of "same" color across designs
  - Accessibility issues (insufficient contrast) with client palette
  - No semantic color mapping (what color means what?)
- **Prevention Strategy:**
  - Extract exact hex values from client moodboard
  - Create named color tokens (CSS variables/Tailwind config)
  - Test all color combinations for WCAG AAA contrast
  - Define semantic usage (primary, accent, error, etc.)
  - Lock color palette in design tool + code
  - Design system review for any non-standard color use
- **Phase to Address:** Phase 0 (Design System)
- **Impact if Ignored:** Brand inconsistency, client pushback, rework, accessibility failures

### 14. Luxury vs. Usability False Dichotomy
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Low contrast text "for aesthetics"
  - Tiny clickable areas (icons <24px)
  - Navigation hidden behind hamburger on desktop
  - Form fields without labels (placeholder-only)
  - Cryptic luxury jargon instead of clear CTAs
  - Multi-step processes without progress indication
- **Prevention Strategy:**
  - Luxury = attention to detail, not obscurity
  - All interactive elements meet accessibility size guidelines
  - Clear information hierarchy with luxury aesthetics
  - User testing with UHNI demographic (they expect both beauty AND function)
  - Reference luxury brands that nail usability (Apple, Porsche, Four Seasons)
  - Accessibility as quality signal, not constraint
- **Phase to Address:** Phase 0 (Design System) + all feature phases
- **Impact if Ignored:** Beautiful but frustrating, high abandonment, support costs

---

## RBAC Pitfalls

### 15. Permission Explosion from Fine-Grained Access
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - 100+ discrete permissions defined
  - No permission grouping/inheritance
  - Permissions named inconsistently (view_x, read_y, see_z)
  - Complex permission combinations required for common tasks
  - No role templates for common permission sets
  - Permission assignment UI is overwhelming
- **Prevention Strategy:**
  - Use capability-based permissions (actions on resources)
  - Group permissions into logical sets (journey_read, journey_write, journey_delete)
  - Define role presets that match real user archetypes
  - Permission naming convention: resource:action (journey:edit, vault:delete)
  - Limit permission granularity to what's actually needed
  - Build permission management UI with role templates
  - Document permission model with decision tree
- **Phase to Address:** Phase 1 (Foundation) - RBAC design
- **Impact if Ignored:** Unmaintainable permission system, admin confusion, security gaps from complexity

### 16. Context-Aware RBAC Not Truly Context-Aware
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Same permission means same thing in all contexts
  - No domain scoping (B2C vs B2B vs Admin)
  - User can see all data they have permission for (no context filtering)
  - Navigation shows all routes user *might* access (across all contexts)
  - Permission checks don't consider current domain
- **Prevention Strategy:**
  - Namespace permissions by domain (b2c:journey:read vs b2b:journey:edit)
  - Context middleware that filters available permissions
  - Navigation components that show only current-context routes
  - Permission evaluation includes current context as input
  - Test switching contexts to verify permission isolation
  - Document permission behavior per context
- **Phase to Address:** Phase 1 (Foundation) - RBAC architecture
- **Impact if Ignored:** Confusing UX, data leakage between contexts, security vulnerabilities

### 17. No Admin Impersonation for Support
- **Risk Level:** LOW
- **Warning Signs:**
  - No way for support to see user's view
  - Debugging requires user screenshots
  - Cannot reproduce user-reported issues
  - No audit trail of admin access to user accounts
  - Impersonation feature added hastily without security controls
- **Prevention Strategy:**
  - Design impersonation feature in Phase 1 (before needed)
  - Require explicit permission (impersonate:user)
  - Log all impersonation sessions immutably
  - Visual indicator when admin is impersonating
  - Auto-timeout for impersonation sessions
  - User notification of impersonation (optional, configurable)
  - Cannot impersonate to gain higher permissions
- **Phase to Address:** Phase 1 (Foundation) or Phase 4 (Admin)
- **Impact if Ignored:** Poor support experience, security risk if added quickly without controls

---

## Data Layer Pitfalls

### 18. Audit Logs That Aren't Actually Immutable
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Audit records in same database as operational data
  - No write-protection on audit tables
  - Audit log implementation allows updates/deletes
  - No tamper detection
  - Logs stored in format that can be edited (plain JSON files)
  - No off-site backup of audit data
- **Prevention Strategy:**
  - Use append-only data store for audit logs
  - Separate audit database/storage from operational data
  - Write-once permissions on audit storage
  - Hash chaining to detect tampering
  - Automated backup to immutable storage (S3 with object lock)
  - Regular audit log integrity verification
  - Document audit log retention policy
- **Phase to Address:** Phase 1 (Foundation) - when mock services defined
- **Impact if Ignored:** Compliance failures, cannot prove data integrity, legal liability

### 19. State Machine Transitions Not Validated
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - State changes set directly (setState('approved')) without validation
  - Can skip states or go backward when shouldn't be possible
  - No guard conditions for state transitions
  - State transition logic scattered across components
  - Race conditions allow invalid state combinations
  - No rollback on failed transitions
- **Prevention Strategy:**
  - Implement formal state machine (XState or similar)
  - Define all valid transitions in state machine config
  - Guard conditions for each transition
  - Centralize state machine logic in service layer
  - State transitions are atomic operations
  - Emit events for state changes (for audit logging)
  - Test all state paths, including error states
- **Phase to Address:** Phase 2 (Journey Versioning) - when state machine introduced
- **Impact if Ignored:** Data corruption, compliance violations, impossible-to-debug state bugs

### 20. No Data Migration Strategy for Mock → Production
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Mock data structure differs from planned backend
  - No plan for migrating beta user data
  - Schema changes require manual data fixes
  - Different data validation in mock vs production
  - No data seeding strategy for development
  - Hard-coded test data in production code paths
- **Prevention Strategy:**
  - Design backend schema during Phase 1 (before mocking)
  - Mock services use production-equivalent data structures
  - Version data schemas with migration scripts
  - Use data validation library (Zod) in both mock and production paths
  - Create data seeding utilities for development/testing
  - Plan beta data migration before production backend launch
  - Document schema evolution strategy
- **Phase to Address:** Phase 1 (Foundation)
- **Impact if Ignored:** Data loss during backend migration, extended downtime, manual data fixes, user frustration

---

## Integration Pitfalls

### 21. Third-Party Dependencies Incompatible with Sovereignty
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Analytics that send PII to external services
  - Third-party components that phone home
  - CDN-hosted libraries (not self-hosted)
  - OAuth providers that don't support PKCE
  - Monitoring tools that log sensitive data
  - No vendor data processing agreements
- **Prevention Strategy:**
  - Audit all dependencies for data sovereignty
  - Self-host critical libraries
  - Use privacy-focused analytics (Plausible, self-hosted Umami)
  - Configure monitoring to redact PII
  - Document data flows to third parties
  - Require DPAs for any external service
  - Prefer open-source, self-hostable alternatives
- **Phase to Address:** Phase 1 (Foundation) - dependency selection
- **Impact if Ignored:** Sovereignty claims undermined, GDPR violations, user trust destroyed

### 22. Environment-Specific Behavior Not Isolated
- **Risk Level:** LOW
- **Warning Signs:**
  - Production checks scattered in code (if process.env.NODE_ENV === 'production')
  - Different behavior in dev vs. production discovered late
  - Secrets committed to repo
  - No environment variable validation
  - Mock services accidentally enabled in production
  - Feature flags hard-coded instead of configurable
- **Prevention Strategy:**
  - Use environment variable validation (Zod schema on startup)
  - Centralize environment config in one module
  - Feature flags via configuration service
  - Mock/production service selection via dependency injection
  - Automated checks for secrets in repo (pre-commit hooks)
  - Document all environment variables
  - Test production builds in staging environment
- **Phase to Address:** Phase 1 (Foundation)
- **Impact if Ignored:** Production incidents, security breaches, debugging nightmares

---

## Testing & Quality Pitfalls

### 23. Testing Luxury Aesthetics Only in Dev Environment
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Animations tested only on high-end dev machines
  - No testing on actual client devices (iPhone, MacBook)
  - Color rendering not verified on calibrated displays
  - Typography rendering differences across browsers ignored
  - No performance testing under realistic network conditions
  - Responsive design tested only in browser DevTools
- **Prevention Strategy:**
  - Test matrix includes actual UHNI device profiles
  - Color QA on calibrated displays (sRGB, P3)
  - Cross-browser testing (Safari, Chrome, Firefox)
  - Network throttling tests (verify on fast and slow connections)
  - Real device testing, not just emulators
  - Client device farm or BrowserStack subscription
  - Visual regression testing for design consistency
- **Phase to Address:** Phase 0 (QA strategy) + ongoing
- **Impact if Ignored:** Platform looks different on client devices, font rendering issues, color inaccuracies, performance problems

### 24. No Accessibility Testing Despite Premium Positioning
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - No screen reader testing
  - Keyboard navigation broken or incomplete
  - Color contrast issues
  - No focus indicators
  - Images without alt text
  - Forms without proper labels
  - Accessibility as "nice to have" not requirement
- **Prevention Strategy:**
  - Accessibility is quality, not compliance checkbox
  - WCAG AAA target (not just AA)
  - Automated testing (axe-core, Lighthouse)
  - Manual screen reader testing (VoiceOver, NVDA)
  - Keyboard navigation for all interactions
  - Include accessibility in definition of done
  - UHNI users may have accessibility needs (aging, temporary injury)
- **Phase to Address:** Phase 0 (Standards) + every phase
- **Impact if Ignored:** Legal risk, exclusion of users, poor quality perception

---

## Project Management Pitfalls

### 25. Feature Phases Without Integration Testing
- **Risk Level:** MEDIUM
- **Warning Signs:**
  - Each phase delivers features in isolation
  - No end-to-end user journey testing across phases
  - Integration bugs discovered in Phase 5 (too late)
  - Phase dependencies not mapped
  - No "walking skeleton" that exercises all layers
  - Features that look complete but don't connect
- **Prevention Strategy:**
  - Phase 1 includes end-to-end skeleton (one flow, all layers)
  - Integration test suite that grows with each phase
  - Phase completion includes integration testing with prior phases
  - Define cross-phase user journeys (not just per-phase features)
  - Continuous integration testing, not just unit tests
  - Demo days showing integrated flows, not feature lists
- **Phase to Address:** Phase 1 (Foundation) - establish integration testing pattern
- **Impact if Ignored:** Late-stage integration failures, rework, missed deadlines

### 26. Client Moodboard Palette Not Systematized Early
- **Risk Level:** LOW
- **Warning Signs:**
  - Moodboard provided but not translated to design tokens
  - Designers interpreting colors differently
  - No defined color relationships (primary, secondary, accent)
  - Color decisions revisited in every phase
  - Client feedback: "that's not the right color" repeatedly
- **Prevention Strategy:**
  - Phase 0 task: Extract and name all moodboard colors
  - Create color system documentation with examples
  - Client approval of color token system before Phase 1
  - Lock color palette in code and design tools
  - Any new colors require explicit client approval
- **Phase to Address:** Phase 0 (Design System)
- **Impact if Ignored:** Constant rework, design inconsistency, client frustration

### 27. "No Compromise" UI Quality Without Clear Definition
- **Risk Level:** HIGH
- **Warning Signs:**
  - "No compromise" stated but not defined
  - No quality checklist or acceptance criteria
  - Subjective debates about what's "good enough"
  - Quality expectations drift between team members
  - Client rejects work without clear reasoning
  - No reference examples of acceptable quality level
- **Prevention Strategy:**
  - Define quality criteria with client in Phase 0
  - Create reference examples (approved screens)
  - Quality checklist: animation smoothness, typography, spacing, interactions
  - Client review checkpoints at component level (not just page level)
  - Design QA process before development handoff
  - "No compromise" means: matches approved design pixel-perfect
  - Document quality non-negotiables (performance, accessibility, brand consistency)
- **Phase to Address:** Phase 0 (before any development)
- **Impact if Ignored:** Endless revision cycles, team frustration, project delays, client relationship damage

---

## Summary: Top 5 Phase 0 Critical Actions

To prevent the highest-risk pitfalls, complete these in planning phase:

1. **Define "No Compromise" UI Quality** (Pitfall #27)
   - Create quality checklist with client approval
   - Establish B2C ≠ dashboard principle (Pitfall #1)
   - Design system with luxury aesthetic + accessibility

2. **Design Production Service Architecture** (Pitfall #2)
   - Service interfaces defined before mocking
   - Data contracts documented
   - Mock → production migration strategy

3. **Map SOW to Roadmap Completely** (Pitfall #6)
   - Traceability matrix: every SOW requirement → epic → stories
   - Flag all ambiguous requirements for clarification
   - No "we'll figure it out later"

4. **Establish RBAC Model** (Pitfall #4)
   - 11 roles × 3 domains documented
   - Permission naming convention
   - Dual-context user handling designed

5. **Set Performance + Quality Budgets** (Pitfall #5, #11, #23)
   - LCP <2.5s, FID <100ms, CLS <0.1
   - Font optimization strategy
   - Testing on real UHNI devices

These five actions prevent the cascade failures that derail luxury platform projects.
