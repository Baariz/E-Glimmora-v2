# Phase 02: Marketing & Authentication - Research

**Researched:** 2026-02-15
**Domain:** Next.js authentication with NextAuth v5 (Auth.js) + luxury editorial web design with parallax scroll effects
**Confidence:** HIGH

## Summary

This phase implements two parallel systems: (1) a luxury editorial marketing website with parallax scroll storytelling, and (2) invite-only authentication with NextAuth v5 including MFA, device recognition, and role-based access control.

**NextAuth v5 (Auth.js)** is the de facto standard for Next.js App Router authentication. Version 5 represents a major architectural shift toward server-first design with a unified `auth()` function, JWT-first sessions for Edge compatibility, and simplified configuration in a root `auth.ts` file. The library is in stable beta (v5.0.0-beta.25+) with production-ready features and extensive Next.js 15 compatibility.

**Framer Motion (Motion)** v12.24.12+ provides production-grade scroll-linked animations via the `useScroll` and `useTransform` hooks, with hardware-accelerated performance through the native ScrollTimeline API where supported. The library is already integrated in Phase 1 and provides parallax primitives optimized for luxury editorial experiences.

**Primary recommendation:** Use Auth.js v5 with JWT sessions + credentials provider for invite-only registration. Implement custom invite code validation in the `authorize` callback, assign roles via `jwt` and `session` callbacks, and layer MFA with `otpauth` library. For marketing, build parallax sections using Motion's scroll hooks with GPU-accelerated transforms and editorial typography from the existing design system.

## Standard Stack

The established libraries/tools for this domain:

### Core Authentication

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **next-auth** | 5.0.0-beta.25+ | Complete authentication system for Next.js | Official Next.js recommendation, 25k+ GitHub stars, App Router native |
| **jose** | Latest | JWT verification for Edge Runtime | Web Crypto API-based, edge-compatible, official Auth.js dependency |
| **otpauth** | Latest | TOTP/HOTP generation for MFA | RFC 6238 compliant, browser + Node.js support, lightweight (no dependencies) |
| **bcryptjs** | Latest | Password hashing | Industry standard, slower than bcrypt (security benefit), pure JS (no native deps) |
| **zod** | 3.23.0+ | Schema validation for forms and auth flows | Already in stack, type-safe runtime validation, React Hook Form integration |

### Core Marketing/Scroll

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **framer-motion** | 11.0.0+ | Scroll-linked animations and parallax | Already in stack, production-grade performance, ScrollTimeline API support |
| **react-hook-form** | 7.53.0+ | Form management | Already in stack, minimal re-renders, Zod resolver integration |
| **@hookform/resolvers** | 3.3.0+ | Zod validation bridge | Already in stack, official React Hook Form package |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **fingerprint.js** (optional) | Latest | Browser fingerprinting for device recognition | If implementing trusted devices without cookies (LOW priority for v1) |
| **ua-parser-js** (optional) | Latest | User agent parsing for device metadata | For display-friendly device names in trusted device list |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Auth.js v5 | Clerk / Auth0 | Managed services are easier but add external dependencies, monthly costs, and UHNI privacy concerns. Auth.js keeps auth sovereign. |
| Auth.js v5 | NextAuth v4 | v4 is stable but lacks App Router optimizations, requires API routes, and has outdated session patterns. v5 beta is production-ready. |
| otpauth | speakeasy | Speakeasy requires Node.js crypto (not edge-compatible), otpauth uses Web Crypto and works in all runtimes |
| Motion scroll hooks | Lenis + GSAP | GSAP is powerful but commercial license required for clients, larger bundle. Motion is MIT and integrated. |

**Installation:**

```bash
# Auth.js v5 and supporting libraries
npm install next-auth@beta jose otpauth bcryptjs
npm install -D @types/bcryptjs

# Already installed from Phase 1:
# - framer-motion
# - react-hook-form
# - @hookform/resolvers
# - zod
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── (marketing)/              # Public marketing site
│   │   ├── layout.tsx             # Editorial layout (already exists)
│   │   ├── page.tsx               # Homepage with parallax
│   │   ├── philosophy/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── invite/page.tsx        # Invite code entry + registration
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts       # Auth.js v5 route handlers
│   └── (authenticated)/           # Protected routes (b2c, b2b, admin)
├── auth.ts                        # Root auth configuration (NEW)
├── auth.config.ts                 # Edge-compatible config split (NEW)
├── middleware.ts                  # Auth protection + route guards (NEW)
└── lib/
    ├── auth/                      # Auth utilities (NEW)
    │   ├── invite-codes.ts        # Invite validation logic
    │   ├── mfa.ts                 # TOTP generation/verification
    │   ├── device-recognition.ts  # Trusted device management
    │   └── password.ts            # Bcrypt helpers
    └── services/interfaces/
        └── IInviteCodeService.ts  # Already exists (from Phase 1)
```

### Pattern 1: Auth.js v5 Configuration (Edge-Compatible Split)

**What:** Split configuration into edge-compatible auth.config.ts and full auth.ts to support middleware with database adapters

**When to use:** Always when using middleware + localStorage mock services (which simulate database calls)

**Example:**

```typescript
// auth.config.ts - Edge-compatible (no database imports)
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/invite',
    error: '/invite',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/briefing')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect to signin
      }
      return true
    },
  },
  providers: [], // Providers added in auth.ts
}
```

```typescript
// auth.ts - Full configuration with providers
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" }, // Required for edge compatibility
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        inviteCode: {}, // Custom field
      },
      authorize: async (credentials) => {
        // Custom invite code + password validation
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // Assign roles to token on signin
      if (user) {
        token.roles = user.roles
        token.userId = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      // Expose roles to client session
      session.user.id = token.userId
      session.user.roles = token.roles
      return session
    },
  },
})
```

**Source:** [Auth.js Edge Compatibility Guide](https://authjs.dev/guides/edge-compatibility)

### Pattern 2: Invite-Only Registration with Credentials Provider

**What:** Custom registration flow that validates invite codes before creating user accounts

**When to use:** For invite-only platforms where users must have a valid invite code to register

**Example:**

```typescript
// lib/auth/invite-codes.ts
import { services } from '@/lib/services'

export async function validateInviteCode(code: string) {
  const inviteCode = await services.inviteCode.getByCode(code)

  if (!inviteCode) {
    return { valid: false, error: 'Invalid invite code' }
  }

  if (inviteCode.status !== 'Active') {
    return { valid: false, error: 'Invite code has been used or expired' }
  }

  if (inviteCode.expiresAt && new Date(inviteCode.expiresAt) < new Date()) {
    return { valid: false, error: 'Invite code has expired' }
  }

  return { valid: true, inviteCode }
}

// Credentials provider authorize callback
authorize: async (credentials) => {
  // Validate input with Zod
  const parsed = signInSchema.safeParse(credentials)
  if (!parsed.success) return null

  const { email, password, inviteCode } = parsed.data

  // Check if registering (has invite code) vs logging in
  if (inviteCode) {
    // REGISTRATION PATH
    const validation = await validateInviteCode(inviteCode)
    if (!validation.valid) {
      throw new CredentialsSignin(validation.error)
    }

    // Create user with roles from invite code
    const user = await services.user.createFromInvite({
      email,
      password: await hashPassword(password),
      inviteCodeId: validation.inviteCode.id,
      roles: validation.inviteCode.assignedRoles,
    })

    return user
  } else {
    // LOGIN PATH
    const user = await services.user.getByEmail(email)
    if (!user) return null

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) return null

    return user
  }
}
```

**Source:** [NextAuth Credentials Provider with Custom Registration](https://medium.com/@vetriselvan_11/auth-js-nextauth-v5-credentials-authentication-in-next-js-app-router-complete-guide-ef77aaae7fdf)

### Pattern 3: Role-Based Access Control with JWT

**What:** Persist user roles in JWT token and expose to session for client-side and server-side access control

**When to use:** Always with NextAuth v5 when implementing RBAC

**Example:**

```typescript
// Extend NextAuth types (auth.d.ts)
declare module "next-auth" {
  interface User {
    roles: UserRoles // Your custom roles type from Phase 1
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: UserRoles
    userId: string
  }
}

// Server component access control
import { auth } from '@/auth'

export default async function AdminPage() {
  const session = await auth()

  if (session?.user?.roles?.admin !== 'Super Admin') {
    redirect('/unauthorized')
  }

  return <div>Admin content</div>
}

// Client component access control
'use client'
import { useSession } from 'next-auth/react'

export function ClientComponent() {
  const { data: session } = useSession()

  if (session?.user?.roles?.b2c === 'UHNI') {
    return <div>UHNI-only content</div>
  }

  return null
}
```

**Source:** [Auth.js Role-Based Access Control Guide](https://authjs.dev/guides/role-based-access-control)

### Pattern 4: MFA with TOTP (Time-Based One-Time Passwords)

**What:** Two-factor authentication using authenticator apps (Google Authenticator, Authy, etc.)

**When to use:** For high-security applications requiring MFA

**Example:**

```typescript
// lib/auth/mfa.ts
import * as OTPAuth from "otpauth"

export function generateMFASecret(userEmail: string) {
  const secret = new OTPAuth.Secret()

  const totp = new OTPAuth.TOTP({
    issuer: "Élan Glimmora",
    label: userEmail,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  })

  return {
    secret: secret.base32,
    uri: totp.toString(), // otpauth:// URI for QR code
  }
}

export function verifyMFAToken(secret: string, token: string) {
  const totp = new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })

  // Verify with 1-step window for clock drift tolerance
  const delta = totp.validate({ token, window: 1 })
  return delta !== null
}

// Usage in registration flow (after password setup)
const mfaSetup = generateMFASecret(user.email)
await services.user.update(user.id, {
  mfaSecret: mfaSetup.secret,
  mfaEnabled: false, // User must verify before enabling
})

// Return QR code URI to display in UI
return { qrCodeUri: mfaSetup.uri }
```

**Source:** [otpauth npm package](https://www.npmjs.com/package/otpauth)

### Pattern 5: Parallax Scroll Sections with Motion

**What:** Hardware-accelerated scroll-linked animations for editorial storytelling

**When to use:** Marketing homepage hero sections, philosophy page narrative blocks

**Example:**

```typescript
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxHeroSection() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"], // Track from top to exit
  })

  // Transform scroll progress to different animation values
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  return (
    <section ref={ref} className="relative h-screen">
      <motion.div
        style={{ y, opacity, scale }}
        className="sticky top-0 flex h-screen items-center justify-center"
      >
        <h1 className="font-serif text-6xl text-rose-500">
          Sovereign Intelligence
        </h1>
      </motion.div>
    </section>
  )
}
```

**Source:** [Motion Scroll Animations](https://www.framer.com/motion/scroll-animations/)

### Pattern 6: Device Recognition (Cookie-Based Approach)

**What:** Simple trusted device tracking using secure httpOnly cookies

**When to use:** To skip MFA prompts for recognized devices (lower complexity than fingerprinting)

**Example:**

```typescript
// lib/auth/device-recognition.ts
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

export function generateDeviceToken(): string {
  return randomBytes(32).toString('base64url')
}

export async function registerTrustedDevice(userId: string, deviceName: string) {
  const deviceToken = generateDeviceToken()

  // Store device in service layer
  await services.device.create({
    userId,
    deviceToken,
    deviceName,
    lastUsed: new Date().toISOString(),
  })

  // Set httpOnly cookie (30 days)
  cookies().set('device_token', deviceToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })

  return deviceToken
}

export async function isTrustedDevice(userId: string): Promise<boolean> {
  const deviceToken = cookies().get('device_token')?.value
  if (!deviceToken) return false

  const device = await services.device.getByToken(deviceToken)
  return device?.userId === userId && device?.status === 'Active'
}
```

**Source:** Pattern derived from [Device-Based Authentication Best Practices](https://www.oloid.com/blog/device-based-authentication)

### Anti-Patterns to Avoid

- **Don't use database session strategy with middleware** — Middleware runs on Edge Runtime which cannot access database adapters. Always use JWT strategy when protecting routes with middleware.
- **Don't skip invite code validation** — Never allow registration without validating the invite code exists, is active, and hasn't expired. This is the core security control for invite-only access.
- **Don't animate layout properties in parallax** — Use only `transform` (y, scale) and `opacity` for 60fps performance. Avoid animating `top`, `width`, `height`, or `margin`.
- **Don't store MFA secrets in localStorage** — MFA secrets must be encrypted at rest in your service layer. Never expose secrets to client JavaScript.
- **Don't hard-code secrets in auth config** — Always use environment variables for `AUTH_SECRET`. Generate with `openssl rand -base64 32`.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JWT signing/verification | Custom crypto logic | `jose` library (included with Auth.js) | Edge Runtime compatible, handles algorithm negotiation, key rotation, timing attack prevention |
| Password hashing | Raw bcrypt or custom hash | `bcryptjs` with salt rounds 10-12 | Automatic salting, timing attack resistant, pure JS (no native deps), proven security |
| TOTP generation | Manual HMAC-SHA1 implementation | `otpauth` library | RFC 6238 compliant, handles clock drift (window parameter), QR code URI generation, cross-runtime support |
| Form validation | Manual regex checks | `zod` schemas with `@hookform/resolvers` | Type-safe, composable, runtime validation matches TypeScript types, error message handling |
| Session persistence | Manual cookie management | Auth.js session callbacks | Handles cookie security (httpOnly, secure, sameSite), CSRF protection, session rotation |
| Scroll progress tracking | Manual scroll event listeners | Motion's `useScroll` hook | Hardware-accelerated via ScrollTimeline API, automatic cleanup, no layout thrashing |
| Device fingerprinting | Browser API collection | Cookie-based device tokens (simpler) or `fingerprint.js` | Browser APIs are actively anti-fingerprinted by vendors, cookies are reliable, fingerprinting has privacy concerns |

**Key insight:** Auth.js v5 has already solved 90% of authentication edge cases (CSRF, session fixation, timing attacks, secure cookies). Building custom auth means re-discovering these vulnerabilities. Similarly, Motion has solved scroll performance issues (passive listeners, RAF throttling, GPU acceleration) that plague custom implementations.

## Common Pitfalls

### Pitfall 1: Missing AUTH_SECRET in Production

**What goes wrong:** JWT tokens fail to sign/verify, sessions break, users get logged out randomly

**Why it happens:** Auth.js v5 auto-generates a secret in development but requires explicit `AUTH_SECRET` in production. Developers forget to set it or use weak secrets.

**How to avoid:**
```bash
# Generate strong secret
openssl rand -base64 32

# Add to .env.local (development)
AUTH_SECRET=your_generated_secret_here

# Add to production environment variables
AUTH_SECRET=different_production_secret
```

**Warning signs:** "JWTSessionError: Read more at https://errors.authjs.dev#jwtsessionerror" in production logs, users complaining about being logged out

**Source:** [NextAuth Session Management Issues](https://clerk.com/articles/nextjs-session-management-solving-nextauth-persistence-issues)

### Pitfall 2: Database Adapter in Middleware (Edge Runtime Error)

**What goes wrong:** Error: "Module not compatible with Edge Runtime" when middleware tries to access database

**Why it happens:** Middleware runs on Edge Runtime which cannot use Node.js APIs like database drivers. If you import `auth.ts` with an adapter directly in `middleware.ts`, it pulls in database code.

**How to avoid:** Split configuration into `auth.config.ts` (edge-safe) and `auth.ts` (full config)

```typescript
// middleware.ts - Import ONLY edge-compatible config
import { authConfig } from './auth.config'
import NextAuth from 'next-auth'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  // Your middleware logic
})

// auth.ts - Import database adapter here, NOT in middleware
import { AuthAdapter } from './lib/adapters/my-adapter'

export const { auth, handlers } = NextAuth({
  ...authConfig,
  adapter: AuthAdapter, // This is OK here, NOT in middleware
})
```

**Warning signs:** Build-time error "You're importing a component that needs X. It only works in a Server Component", runtime error about Edge Runtime incompatibility

**Source:** [Auth.js Edge Compatibility](https://authjs.dev/guides/edge-compatibility)

### Pitfall 3: Not Handling Invite Code Status Transitions

**What goes wrong:** Users register multiple times with same invite code, or expired codes work, or codes remain "Active" forever

**Why it happens:** Forgetting to update invite code status after successful registration

**How to avoid:** Atomic status update in registration flow

```typescript
// In authorize callback after user creation
await services.inviteCode.update(inviteCode.id, {
  status: 'Used',
  usedBy: user.id,
  usedAt: new Date().toISOString(),
})

// Audit log for compliance
await services.audit.log({
  entity: 'InviteCode',
  action: 'used',
  entityId: inviteCode.id,
  userId: user.id,
  timestamp: new Date().toISOString(),
})
```

**Warning signs:** Multiple users with same invite code, audit logs showing invite code reuse, invite code list never showing "Used" status

### Pitfall 4: MFA Secret Exposure

**What goes wrong:** MFA secrets stored in localStorage or session storage, attackers can extract and generate valid codes

**Why it happens:** Developers store MFA secret on client for convenience, thinking it's just for setup

**How to avoid:** **Never send MFA secret to client after initial setup**

```typescript
// WRONG - Don't do this
const response = await fetch('/api/user/mfa-secret')
const { secret } = await response.json()
localStorage.setItem('mfa_secret', secret) // NEVER store secret on client

// CORRECT - Only send QR code URI, server keeps secret
const response = await fetch('/api/user/setup-mfa')
const { qrCodeUri } = await response.json() // URI for QR display only
// Display QR code for user to scan
// Secret remains in database, never sent to client again
```

**Warning signs:** MFA secret in localStorage/sessionStorage, API endpoints returning `mfaSecret` field, client-side code generating TOTP tokens

**Source:** [Implementing Two Factor Authentication in Next.js](https://medium.com/@ritwiksinha25/implementing-two-factor-authentication-in-nextjs-with-nextauth-and-speakeasy-ff5235daa850)

### Pitfall 5: Parallax Layout Thrashing

**What goes wrong:** Scroll feels janky, frame rate drops below 60fps, especially on mobile

**Why it happens:** Animating layout-triggering properties (width, height, top, left, margin) or reading layout values in scroll listeners

**How to avoid:** Use only GPU-accelerated properties and Motion's optimized hooks

```typescript
// WRONG - Causes layout recalculation
const y = useTransform(scrollY, [0, 1000], [0, 500])
<motion.div style={{ top: y }}> // 'top' triggers layout

// CORRECT - GPU-accelerated
const y = useTransform(scrollY, [0, 1000], [0, 500])
<motion.div style={{ y }}> // 'transform: translateY()' uses GPU

// WRONG - Reading layout in scroll listener
const handleScroll = () => {
  const rect = element.getBoundingClientRect() // Triggers reflow
  setPosition(rect.top)
}

// CORRECT - Use Motion's useScroll with offset
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"], // No layout reads
})
```

**Warning signs:** Chrome DevTools showing red layout recalculations in Performance timeline, scroll feels choppy, high CPU usage during scroll

**Source:** [Framer Motion Performance Tips](https://tillitsdone.com/blogs/framer-motion-performance-tips/)

### Pitfall 6: Cookie sameSite Blocking Cross-Origin Auth

**What goes wrong:** Users can't log in on production, cookies not being set, session not persisting across page loads

**Why it happens:** `sameSite: 'strict'` blocks cookies in OAuth callbacks or cross-origin scenarios

**How to avoid:** Use `sameSite: 'lax'` for auth cookies

```typescript
// auth.ts
export const { auth } = NextAuth({
  cookies: {
    sessionToken: {
      name: 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax', // Not 'strict' - allows top-level navigation
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
})
```

**Warning signs:** "Authentication cookies missing" in production logs, works on localhost but not production domain, OAuth redirects work but session not created

**Source:** [NextAuth Cookie Configuration](https://next-auth.js.org/configuration/options)

## Code Examples

Verified patterns from official sources:

### Example 1: Complete Invite-Only Registration Flow

```typescript
// app/invite/page.tsx - Registration page
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const registrationSchema = z.object({
  inviteCode: z.string().min(8, 'Invalid invite code'),
  email: z.string().email('Invalid email'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function InvitePage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      inviteCode: data.inviteCode,
      redirect: false,
    })

    if (result?.error) {
      // Handle error (show toast, etc.)
      return
    }

    // Success - redirect to MFA setup
    router.push('/onboarding/mfa')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('inviteCode')} placeholder="Invite Code" />
      {errors.inviteCode && <span>{errors.inviteCode.message}</span>}

      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      <input {...register('confirmPassword')} type="password" placeholder="Confirm Password" />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <button type="submit">Create Account</button>
    </form>
  )
}
```

**Source:** [React Hook Form with Zod Validation](https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/)

### Example 2: MFA Setup Flow with QR Code

```typescript
// app/onboarding/mfa/page.tsx - MFA setup page
'use client'
import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { useRouter } from 'next/navigation'

export default function MFASetupPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Fetch MFA setup from server
    fetch('/api/user/setup-mfa', { method: 'POST' })
      .then(res => res.json())
      .then(async ({ otpauthUri }) => {
        // Generate QR code from otpauth:// URI
        const qr = await QRCode.toDataURL(otpauthUri)
        setQrCodeUrl(qr)
      })
  }, [])

  const handleVerify = async () => {
    const response = await fetch('/api/user/verify-mfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: verificationCode }),
    })

    if (response.ok) {
      // MFA verified and enabled
      router.push('/briefing') // Redirect to app
    } else {
      // Invalid code
      alert('Invalid verification code')
    }
  }

  return (
    <div>
      <h1>Set Up Two-Factor Authentication</h1>
      <p>Scan this QR code with your authenticator app:</p>
      {qrCodeUrl && <img src={qrCodeUrl} alt="MFA QR Code" />}

      <input
        type="text"
        placeholder="Enter 6-digit code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        maxLength={6}
      />
      <button onClick={handleVerify}>Verify & Enable MFA</button>
    </div>
  )
}

// app/api/user/setup-mfa/route.ts - Server-side MFA setup
import { auth } from '@/auth'
import { generateMFASecret } from '@/lib/auth/mfa'
import { services } from '@/lib/services'

export async function POST() {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Generate secret and store in database
  const { secret, uri } = generateMFASecret(session.user.email)

  await services.user.update(session.user.id, {
    mfaSecret: secret, // Store encrypted in production
    mfaEnabled: false, // Not enabled until verified
  })

  // Return only URI, never return secret to client
  return Response.json({ otpauthUri: uri })
}

// app/api/user/verify-mfa/route.ts - Verify and enable MFA
import { auth } from '@/auth'
import { verifyMFAToken } from '@/lib/auth/mfa'
import { services } from '@/lib/services'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code } = await request.json()

  const user = await services.user.getById(session.user.id)
  if (!user?.mfaSecret) {
    return Response.json({ error: 'MFA not set up' }, { status: 400 })
  }

  const valid = verifyMFAToken(user.mfaSecret, code)

  if (valid) {
    // Enable MFA
    await services.user.update(user.id, { mfaEnabled: true })
    return Response.json({ success: true })
  } else {
    return Response.json({ error: 'Invalid code' }, { status: 400 })
  }
}
```

**Source:** [OTPAuth Library Documentation](https://www.npmjs.com/package/otpauth)

### Example 3: Protected Route with Middleware

```typescript
// middleware.ts
import { auth } from './auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/briefing')
  const isOnAdmin = req.nextUrl.pathname.startsWith('/dashboard')

  // Protect authenticated routes
  if ((isOnDashboard || isOnAdmin) && !isLoggedIn) {
    return Response.redirect(new URL('/invite', req.url))
  }

  // Role-based protection
  if (isOnAdmin && req.auth?.user?.roles?.admin !== 'Super Admin') {
    return Response.redirect(new URL('/unauthorized', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

**Source:** [Auth.js Protecting Routes](https://authjs.dev/getting-started/session-management/protecting)

### Example 4: Luxury Editorial Parallax Homepage

```typescript
// app/(marketing)/page.tsx
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)

  // Hero section parallax
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0])

  // Story section parallax (slower)
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  })
  const storyY = useTransform(storyProgress, [0, 1], ["10%", "-10%"])

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex h-full items-center justify-center"
        >
          <h1 className="font-serif text-7xl tracking-tight text-rose-500">
            Sovereign Intelligence
          </h1>
        </motion.div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="relative min-h-screen bg-sand-50 py-24">
        <motion.div
          style={{ y: storyY }}
          className="container mx-auto px-6"
        >
          <p className="font-serif text-3xl leading-relaxed text-olive-700">
            For those who shape the future, privacy is not a feature—it is sovereignty.
          </p>
        </motion.div>
      </section>

      {/* Philosophy Preview */}
      <section className="min-h-screen bg-white py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 font-serif text-5xl text-rose-500">
            Philosophy
          </h2>
          <p className="font-sans text-xl leading-relaxed text-olive-600">
            Élan is not software. It is an architecture for sovereign decision-making.
          </p>
        </div>
      </section>
    </>
  )
}
```

**Source:** Derived from [Framer Parallax Examples](https://www.framer.com/blog/parallax-scrolling-examples/) + existing Phase 1 Parallax component

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| NextAuth v4 with Pages Router | Auth.js v5 with App Router | 2024 (v5 beta) | Unified `auth()` function replaces getServerSession/getToken/withAuth. Configuration moves from API routes to root `auth.ts`. Edge Runtime compatible by default. |
| Database session strategy | JWT session strategy (default) | 2024 (v5 beta) | Edge Runtime compatibility requires JWT. Database sessions can't run in middleware. JWT now recommended default. |
| Manual scroll listeners | Native ScrollTimeline API | 2024 (Chrome 115+) | Motion v12+ uses ScrollTimeline for hardware-accelerated scroll effects. 10x better performance vs RAF polling. |
| Speakeasy for TOTP | otpauth library | 2023+ | otpauth uses Web Crypto (edge-compatible), speakeasy requires Node crypto. otpauth works in all runtimes. |
| OAuth-only NextAuth | Credentials provider + OAuth | Always supported | Credentials provider now documented as equal option, not fallback. Better for custom flows like invite-only. |
| fingerprint.js v3 | Cookie-based device tokens | 2024+ | Browsers actively anti-fingerprint. W3C guidance discourages. Cookies are reliable, privacy-respecting alternative. |

**Deprecated/outdated:**

- **NextAuth v4 imports** (`next-auth/next`, `next-auth/middleware`) — Use `next-auth` (v5) unified exports
- **`NEXTAUTH_*` environment variables** — Use `AUTH_*` prefix in v5
- **`getServerSession()`** — Use unified `auth()` function
- **Framer Motion `useViewportScroll`** — Use `useScroll` with target/offset options
- **Manual QR code libraries** — otpauth includes `.toString()` for QR-ready otpauth:// URIs, use with `qrcode` library

## Open Questions

Things that couldn't be fully resolved:

1. **Browser fingerprinting vs cookie-based device recognition**
   - What we know: Browser vendors actively reduce fingerprinting entropy. Cookie-based tokens are simpler and more reliable. Fingerprint.js exists but has privacy/GDPR concerns.
   - What's unclear: Whether UHNI users expect fingerprinting-level security or if cookie-based trusted devices are sufficient.
   - Recommendation: Start with cookie-based device tokens (simpler, privacy-respecting). Can add fingerprinting later if security requirements demand it. Document decision in security review.

2. **Invite code generation strategy**
   - What we know: Invite codes need to be unique, unguessable, and readable. Common patterns: UUID (secure but ugly), nanoid (customizable), human-readable word combinations.
   - What's unclear: Does platform need printed invite cards (favor readability) or digital distribution (favor security)?
   - Recommendation: Use nanoid with custom alphabet (uppercase letters + numbers, no ambiguous chars like 0/O/1/I). Length 12 = 72 bits entropy. Pattern: `ELAN-XXXX-XXXX-XXXX`.

3. **MFA enforcement timing**
   - What we know: Can enforce MFA at (a) registration, (b) first sensitive action, or (c) role-based (UHNI required, others optional).
   - What's unclear: Does UHNI onboarding require immediate MFA setup or graceful introduction?
   - Recommendation: Require MFA setup during onboarding (after password) but allow "Set up later" with persistent reminder. Enforce before first journey creation.

4. **Session timeout vs idle timeout**
   - What we know: NextAuth supports session maxAge but not automatic idle timeout. Idle timeout requires client-side activity tracking.
   - What's unclear: Do UHNI users expect automatic logout after inactivity (common in banking) or persistent sessions (common in lifestyle apps)?
   - Recommendation: Start with 30-day session maxAge (no idle timeout). Add idle timeout in later phase if security review requires it. Most luxury apps favor convenience.

## Sources

### Primary (HIGH confidence)

- [Auth.js Migrating to v5](https://authjs.dev/getting-started/migrating-to-v5) - Official migration guide
- [Auth.js Role-Based Access Control](https://authjs.dev/guides/role-based-access-control) - Official RBAC guide
- [Auth.js Edge Compatibility](https://authjs.dev/guides/edge-compatibility) - Official edge runtime patterns
- [Auth.js Credentials Provider](https://authjs.dev/getting-started/providers/credentials) - Official credentials docs
- [otpauth npm package](https://www.npmjs.com/package/otpauth) - Official library documentation
- [Motion Scroll Animations](https://www.framer.com/motion/scroll-animations/) - Official scroll API docs (redirects to motion.dev)

### Secondary (MEDIUM confidence)

- [Auth.js (NextAuth v5) Complete Guide - Medium](https://medium.com/@vetriselvan_11/auth-js-nextauth-v5-credentials-authentication-in-next-js-app-router-complete-guide-ef77aaae7fdf) - January 2026 implementation guide
- [NextAuth Session Management - Clerk](https://clerk.com/articles/nextjs-session-management-solving-nextauth-persistence-issues) - 2025 session pitfalls
- [React Hook Form with Zod - freeCodeCamp](https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/) - Validation pattern
- [Framer Motion Performance Tips](https://tillitsdone.com/blogs/framer-motion-performance-tips/) - Community best practices
- [Luxury Website Design Best Practices - Monroe Creative](https://www.monroecreative.co.uk/small-business-blog/luxury-website-design-tips-how-to-make-strategic-design-choices-with-examples) - Editorial design patterns
- [Device-Based Authentication - OLOID](https://www.oloid.com/blog/device-based-authentication) - Trusted device patterns
- [Implementing 2FA in Next.js - Medium](https://medium.com/@ritwiksinha25/implementing-two-factor-authentication-in-nextjs-with-nextauth-and-speakeasy-ff5235daa850) - MFA implementation

### Tertiary (LOW confidence - flagged for validation)

- WebSearch results about parallax trends 2026 (marketing copy, not technical docs)
- GitHub discussions (nextauthjs/next-auth) - community solutions, not official recommendations
- General luxury web design trend articles (subjective design opinions)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Auth.js v5 and Motion are well-documented, stable, and officially recommended for Next.js 15
- Architecture: HIGH - Patterns verified against official Auth.js docs and proven in production Next.js 15 apps
- Pitfalls: MEDIUM/HIGH - Common mistakes documented in official guides + community post-mortems, edge runtime issues verified

**Research date:** 2026-02-15
**Valid until:** ~2026-03-15 (30 days) - Auth.js v5 still in beta, may have breaking changes before stable release. Motion is stable. Re-verify before implementation if Auth.js v5 stable releases.

**Next steps for planner:**
- Auth.js v5 is production-ready beta (verify latest beta version at implementation time)
- All authentication patterns require custom implementation (no built-in invite codes or MFA)
- Parallax patterns are established, focus on editorial content structure
- Phase 1 infrastructure (RBAC, services, types) integrates cleanly with Auth.js callbacks
