---
phase: 02-marketing-authentication
plan: 03
subsystem: auth
tags: [nextauth, jwt, bcryptjs, jose, credentials-provider, invite-codes, session-management, route-protection]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: Service abstraction layer, mock localStorage services, entity types, Zod validation schemas
provides:
  - NextAuth v5 with JWT sessions (30-day)
  - Invite-only registration flow with backend validation
  - Credentials provider with dual-path authorize (registration/login)
  - Password hashing with bcryptjs (12 salt rounds)
  - Route protection middleware (edge-compatible)
  - Role assignment from invite codes persisted in JWT
  - MockInviteCodeService with 3 seeded test codes
  - AuthProvider upgraded from mock to NextAuth SessionProvider
  - Domain context support (B2C/B2B/Admin switching)
affects: [03-b2c-sovereign-experience, 04-b2b-institutional-portal, 05-platform-administration]

# Tech tracking
tech-stack:
  added: [next-auth@beta, jose, bcryptjs, @types/bcryptjs]
  patterns:
    - "NextAuth v5 authorize callback with dual-path logic (registration vs login)"
    - "Error prefixing in authorize callback for specific error messages (INVITE_INVALID, EMAIL_EXISTS)"
    - "Pre-validation of invite codes before signIn to prevent bypass"
    - "SessionProvider + DomainContextProvider composition for multi-context auth"
    - "JWT callbacks for role assignment from invite codes"
    - "Edge-compatible middleware with authConfig separation"

key-files:
  created:
    - src/auth.ts
    - src/auth.config.ts
    - src/auth.d.ts
    - src/middleware.ts
    - src/lib/auth/password.ts
    - src/lib/auth/invite-codes.ts
    - src/lib/services/interfaces/IInviteCodeService.ts
    - src/lib/services/mock/invite-code.mock.ts
    - src/app/api/auth/[...nextauth]/route.ts
    - src/app/(marketing)/invite/register/page.tsx
  modified:
    - src/app/api/invite/validate/route.ts
    - src/lib/types/entities.ts
    - src/lib/services/mock/user.mock.ts
    - src/lib/services/config.ts
    - src/components/providers/AuthProvider.tsx
    - src/lib/hooks/useAuth.ts
    - src/app/layout.tsx

key-decisions:
  - "NextAuth v5 beta for modern App Router compatibility"
  - "JWT sessions (30-day) over database sessions for mock-first development"
  - "Credentials provider dual-path authorize callback (isRegistration flag)"
  - "Error prefixing (INVITE_INVALID:, EMAIL_EXISTS:) for client-side parsing"
  - "Pre-validation of invite code before signIn to prevent stale sessionStorage bypass"
  - "3 seeded test codes in MockInviteCodeService (B2C UHNI, B2B RM, Admin SuperAdmin)"
  - "Edge-compatible authConfig separation for middleware"
  - "SessionProvider + DomainContextProvider composition for multi-context support"

patterns-established:
  - "Auth flow: invite validation → registration → role assignment → JWT session"
  - "Mock service seeding pattern for development test data"
  - "Error response parsing with prefixes for specific user-friendly messages"
  - "Pre-validation pattern before critical operations (invite code check before signIn)"
  - "Domain context switching preserved across NextAuth upgrade"

# Metrics
duration: 10min
completed: 2026-02-16
---

# Phase [2] Plan [3]: NextAuth v5 Integration Summary

**NextAuth v5 with invite-only registration, JWT sessions (30-day), Credentials provider dual-path authorize, role assignment from invite codes, and edge-compatible route protection**

## Performance

- **Duration:** 10 min
- **Started:** 2026-02-16T04:41:14Z
- **Completed:** 2026-02-16T04:50:42Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments

- Complete NextAuth v5 authentication infrastructure with invite code validation
- Invite-only registration gates access behind validated invite codes with backend validation
- Role assignment from invite codes persisted in JWT sessions (30-day)
- Registration page with luxury UX, password requirements, and error handling
- AuthProvider upgraded from mock to NextAuth SessionProvider with domain context support
- Protected route middleware redirects unauthenticated users to /invite

## Task Commits

Each task was committed atomically:

1. **Task 1: Install NextAuth v5 and create auth infrastructure** - `7125dfb` (feat)
   - Install next-auth@beta, jose, bcryptjs dependencies
   - Create IInviteCodeService interface and MockInviteCodeService with 3 seeded test codes
   - Create password utilities (hashPassword, verifyPassword with bcryptjs)
   - Create invite code validation logic (validateInviteCode)
   - Upgrade /api/invite/validate from format-only to real backend validation
   - Add passwordHash field to User entity type
   - Create NextAuth type declarations (User, Session, JWT with roles)
   - Create auth.config.ts for edge-compatible middleware config
   - Create auth.ts with Credentials provider, invite validation, registration/login
   - Create NextAuth API route handler at /api/auth/[...nextauth]
   - Create middleware.ts for route protection

2. **Task 2: Create registration page and upgrade AuthProvider to NextAuth** - `137bae7` (feat)
   - Create /invite/register page with luxury registration form
   - Pre-validates invite code from sessionStorage against /api/invite/validate before signIn
   - Parses error responses with INVITE_INVALID and EMAIL_EXISTS prefixes for specific messages
   - Shows password requirements with visual indicators
   - Replace mock AuthProvider with NextAuth SessionProvider wrapper
   - Add DomainContextProvider for B2C/B2B/Admin context switching
   - Update useAuth hook to use NextAuth useSession with role resolution
   - Wrap root layout children in AuthProvider for global session access

## Files Created/Modified

**Authentication Core:**
- `src/auth.ts` - NextAuth v5 configuration with Credentials provider, dual-path authorize (registration/login), JWT callbacks for role assignment
- `src/auth.config.ts` - Edge-compatible auth configuration for middleware with authorized callback
- `src/auth.d.ts` - NextAuth type extensions for User, Session, JWT with roles
- `src/middleware.ts` - Route protection middleware using NextAuth edge-compatible config

**Auth Utilities:**
- `src/lib/auth/password.ts` - Password hashing and verification with bcryptjs (12 salt rounds)
- `src/lib/auth/invite-codes.ts` - Invite code validation logic (status, usage limits, expiry)

**Service Layer:**
- `src/lib/services/interfaces/IInviteCodeService.ts` - Invite code service interface with CRUD + markAsUsed methods
- `src/lib/services/mock/invite-code.mock.ts` - Mock invite code service with 3 seeded test codes (B2C/B2B/Admin)
- `src/lib/services/config.ts` - Added inviteCode service to registry
- `src/lib/services/interfaces/index.ts` - Export IInviteCodeService
- `src/lib/types/entities.ts` - Added passwordHash field to User entity

**API Routes:**
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route handlers
- `src/app/api/invite/validate/route.ts` - Upgraded from format-only to real backend validation

**User Interface:**
- `src/app/(marketing)/invite/register/page.tsx` - Registration page with luxury form, password requirements, error handling
- `src/components/providers/AuthProvider.tsx` - Upgraded from mock to NextAuth SessionProvider with DomainContextProvider
- `src/lib/hooks/useAuth.ts` - Updated to use NextAuth useSession with role resolution
- `src/app/layout.tsx` - Wrapped children in AuthProvider

**Mock Services:**
- `src/lib/services/mock/user.mock.ts` - Updated createUser to accept passwordHash

## Decisions Made

1. **NextAuth v5 beta over v4**: Modern App Router compatibility, edge runtime support, improved DX
2. **JWT sessions (30-day) over database sessions**: Mock-first development approach, no database dependency yet
3. **Credentials provider dual-path authorize**: Single authorize callback handles both registration and login via isRegistration flag
4. **Error prefixing pattern**: INVITE_INVALID: and EMAIL_EXISTS: prefixes enable client-side parsing for specific error messages
5. **Pre-validation before signIn**: Registration page calls /api/invite/validate before signIn to prevent stale/manipulated sessionStorage bypass
6. **3 seeded test codes**: MockInviteCodeService seeds ELAN-TEST-B2CC-CODE (UHNI), ELAN-TEST-B2BB-CODE (RM), ELAN-TEST-ADMN-CODE (SuperAdmin) on initialization
7. **Edge-compatible authConfig separation**: authConfig in separate file for middleware, full auth config in auth.ts
8. **SessionProvider + DomainContextProvider composition**: Nested providers enable NextAuth session + B2C/B2B/Admin context switching

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**TypeScript type compatibility with NextAuth types:**
- **Issue:** NextAuth v5 User type extends base User which doesn't have roles field initially
- **Solution:** Used type casting in jwt and session callbacks to access custom fields (roles, mfaEnabled)
- **Impact:** Minor - added `as any` casts where NextAuth's type inference couldn't detect custom fields from auth.d.ts

**MockInviteCodeService array access type safety:**
- **Issue:** TypeScript inferred `codes[index]` as possibly undefined even after index check
- **Solution:** Added non-null assertion `codes[index]!` after index !== -1 check
- **Impact:** None - code is safe due to guard clause

## User Setup Required

**Environment variables to add to .env.local:**

```bash
# NextAuth Configuration
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

**Note:** `.env.local` is gitignored. The plan auto-generated AUTH_SECRET during execution. Users cloning the repo must generate their own.

**Test invite codes available** (seeded automatically by MockInviteCodeService):
- `ELAN-TEST-B2CC-CODE` - B2C UHNI role (single use)
- `ELAN-TEST-B2BB-CODE` - B2B Relationship Manager role (single use)
- `ELAN-TEST-ADMN-CODE` - Admin SuperAdmin role (single use)

## Next Phase Readiness

**Ready for Phase 2 Plan 04** (MFA, device recognition, context switching):
- NextAuth v5 infrastructure in place
- JWT sessions support additional claims (mfaEnabled field already in auth.d.ts)
- User entity has mfaSecret field placeholder
- Session callbacks can be extended for MFA verification

**Blockers/Concerns:**
- None - auth foundation complete and verified

**What's Next:**
- Plan 02-04: Add MFA setup/verify, device recognition, trusted device management, context switching UI
- Future: Swap mock services for real API once backend ready

---
*Phase: 02-marketing-authentication*
*Completed: 2026-02-16*
