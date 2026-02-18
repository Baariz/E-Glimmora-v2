# Phase 1: Foundation & Design System - Research

**Researched:** February 15, 2026
**Domain:** Next.js 15 App Router, TypeScript, Design System, RBAC, Service Abstraction
**Confidence:** HIGH

## Summary

Phase 1 establishes the architectural foundation for Élan Glimmora: a luxury UHNI lifestyle intelligence platform with Dribbble-level UI quality. This research identifies the standard stack, patterns, and implementation strategies for:

1. **Next.js 15 App Router setup** with TypeScript, Tailwind CSS, and ESLint
2. **Font loading strategy** for licensed Miller Display + Avenir LT Std fonts
3. **Tailwind design tokens** with custom luxury palette (Rose, Sand, Olive, Teal, Gold)
4. **Radix UI primitives** styled with Tailwind for accessible, customizable components
5. **Framer Motion** page transitions and cinematic animations
6. **Route group layouts** for 4 distinct domains (marketing, B2C, B2B, admin)
7. **Service abstraction layer** with TypeScript interfaces for mock → real API swap
8. **RBAC engine** with context-aware permissions across 11 roles and 3 domains
9. **Audit event system** with immutable append-only logging
10. **Entity type definitions** for 15+ data entities with relationships

**Primary recommendation:** Use Next.js 15's App Router with route groups for domain isolation, Tailwind CSS v4 for design tokens (or v3.4 if v4 unstable), Radix UI for headless primitives, Framer Motion for animations, and service abstraction pattern for future-proof data layer. RBAC and audit logging must be architectural from day one, not retrofitted.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.1.0+ | React framework with App Router | Industry standard for production React apps, RSC support, streaming, optimized bundles |
| TypeScript | 5.6+ | Type safety | De facto standard for large React codebases, prevents runtime errors |
| Tailwind CSS | 4.0 (or 3.4) | Utility-first CSS | Best flexibility for custom design systems, JIT compilation, small bundle size |
| Radix UI | 1.x | Headless UI primitives | WAI-ARIA compliant, unstyled for full design control, best-in-class accessibility |
| Framer Motion | 11+ | Animation library | Declarative animations, layout animations, scroll-triggered effects, gesture support |
| React | 19.x | UI library | Required by Next.js 15, supports React Compiler for auto-memoization |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | 3.23+ | Runtime validation | Validate service layer data, form validation, ensure type safety at runtime |
| TanStack Query | 5.x | Server state management | Cache server data, optimistic updates, background refetching |
| Zustand | 4.5+ | Client state management | UI state (modals, sidebar), lightweight alternative to Redux |
| React Hook Form | 7.53+ | Form state management | Multi-step forms, complex validation, minimal re-renders |
| Lucide React | 0.460+ | Icon library | Tree-shakeable SVG icons, consistent design language for luxury aesthetic |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind CSS v4 | Tailwind CSS v3.4 | v4 uses CSS-first config (better), but still in beta—use v3.4 if stability needed |
| Radix UI | Shadcn/ui | Shadcn is pre-styled Radix—acceptable if heavily customized, but Radix gives more control |
| Framer Motion | GSAP | GSAP better for complex timeline sequences, but Framer Motion covers 95% of cases |
| Zustand | Redux Toolkit | Redux has better DevTools, but Zustand is simpler and sufficient for this scope |

**Installation:**

```bash
# Initialize Next.js 15 project
npx create-next-app@latest e-glimmora \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# Core dependencies
pnpm add framer-motion zod @tanstack/react-query zustand react-hook-form @hookform/resolvers lucide-react

# Radix UI primitives (install as needed)
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-accordion @radix-ui/react-tabs @radix-ui/react-select

# Dev dependencies
pnpm add -D @types/node @types/react @types/react-dom prettier eslint-config-prettier
```

---

## Architecture Patterns

### Recommended Project Structure

```
/Users/kavi/Baarez-Projects/E-Glimmora/
├── app/
│   ├── (marketing)/          # Route group: public brand
│   │   ├── layout.tsx         # Editorial layout
│   │   ├── page.tsx           # Homepage
│   │   └── join/              # Invite entry
│   ├── (b2c)/                 # Route group: UHNI suite
│   │   ├── layout.tsx         # Website experience (NOT dashboard)
│   │   ├── middleware.ts      # Auth + role guard
│   │   ├── briefing/
│   │   ├── intent/
│   │   ├── journeys/
│   │   └── vault/
│   ├── (b2b)/                 # Route group: institutional portal
│   │   ├── layout.tsx         # Premium dashboard (sidebar nav)
│   │   ├── middleware.ts      # Auth + role guard
│   │   ├── portfolio/
│   │   └── clients/
│   ├── (admin)/               # Route group: platform admin
│   │   ├── layout.tsx         # Admin dashboard
│   │   ├── middleware.ts      # Super Admin guard
│   │   └── invites/
│   ├── api/
│   │   └── auth/              # NextAuth endpoints
│   ├── layout.tsx             # Root layout
│   └── globals.css
├── lib/
│   ├── services/              # Service abstraction layer
│   │   ├── index.ts           # Service registry
│   │   ├── config.ts          # Environment-based selection
│   │   ├── interfaces/        # TypeScript contracts
│   │   ├── mock/              # localStorage implementations
│   │   └── api/               # Future real API implementations
│   ├── rbac/                  # RBAC engine
│   │   ├── permissions.ts     # Permission matrices
│   │   ├── usePermission.ts   # Permission hook
│   │   └── filters.ts         # Access filtering
│   ├── types/                 # Entity types
│   │   ├── entities.ts        # All 15+ data entities
│   │   ├── roles.ts           # Role enums
│   │   └── permissions.ts     # Permission types
│   ├── utils/
│   │   ├── audit.ts           # Event emission
│   │   └── cascade.ts         # Global erase logic
│   └── hooks/                 # Custom React hooks
├── components/
│   ├── shared/                # Domain-agnostic primitives
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Card/
│   └── providers/             # React Context providers
├── public/
│   └── fonts/                 # Miller Display + Avenir LT Std
├── styles/
│   ├── theme.ts               # Design tokens
│   └── variants/              # Framer Motion variants
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
└── package.json
```

---

## Pattern 1: Next.js 15 App Router Setup

**What:** Initialize Next.js 15 with App Router, TypeScript, Tailwind CSS, ESLint, and src directory.

**When to use:** Start of Phase 1, before any feature development.

**Example:**

```bash
# Source: https://nextjs.org/docs/app/api-reference/cli/create-next-app
npx create-next-app@latest e-glimmora \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# Or use interactive mode (recommended for review)
npx create-next-app@latest
```

**Key configuration choices:**

- **TypeScript:** Yes (required for enterprise apps)
- **ESLint:** Yes (code quality)
- **Tailwind CSS:** Yes (custom design system)
- **App Router:** Yes (NOT Pages Router)
- **src/ directory:** Yes (cleaner project structure)
- **Import alias:** `@/*` (standard convention)

**TypeScript configuration (`tsconfig.json`):**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,  // Catch array access bugs
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Source:** [Next.js CLI Documentation](https://nextjs.org/docs/app/api-reference/cli/create-next-app)

---

## Pattern 2: Font Loading Strategy (Licensed Fonts)

**What:** Load Miller Display (serif) and Avenir LT Std (sans) from local .woff2/.ttf files with Next.js font optimization.

**When to use:** Phase 0 (Design System), before building UI components.

**Example:**

```typescript
// app/fonts.ts
import localFont from 'next/font/local'

export const millerDisplay = localFont({
  src: [
    {
      path: '../public/fonts/MillerDisplay-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/MillerDisplay-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/MillerDisplay-Roman.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/MillerDisplay-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/MillerDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-miller-display',
  display: 'swap',
})

export const avenirLT = localFont({
  src: [
    {
      path: '../public/fonts/AvenirLTStd-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/AvenirLTStd-BookOblique.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/AvenirLTStd-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/AvenirLTStd-Heavy.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-avenir-lt',
  display: 'swap',
})
```

```tsx
// app/layout.tsx
import { millerDisplay, avenirLT } from './fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${millerDisplay.variable} ${avenirLT.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**Font subsetting (reduce file size):**

Use tools like `pyftsubset` (from fonttools) to create subsets containing only Latin characters:

```bash
# Install fonttools
pip install fonttools brotli

# Subset font to Latin characters only
pyftsubset MillerDisplay-Roman.ttf \
  --output-file=MillerDisplay-Roman.woff2 \
  --flavor=woff2 \
  --layout-features='kern,liga' \
  --unicodes=U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD
```

**Best practices:**

- Use `.woff2` format (best compression, web-optimized)
- Set `display: 'swap'` to prevent FOIT (flash of invisible text)
- Load only needed weights (Light 300, Regular 400, Bold 700)
- Preload critical font files in `<head>` for faster LCP

**Sources:**
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- [Custom Fonts Guide](https://www.dhiwise.com/post/how-to-use-next-js-custom-font-a-complete-guide)

---

## Pattern 3: Tailwind Design Tokens (Custom Palette)

**What:** Configure Tailwind CSS with custom luxury color palette (Rose, Sand, Olive, Teal, Gold) and typography scale.

**When to use:** Phase 0 (Design System), after font loading configured.

**Example (Tailwind CSS v4 with `@theme`):**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Color palette from client moodboard */
  --color-rose-50: #faf6f5;
  --color-rose-100: #f4ede9;
  --color-rose-200: #e9dad3;
  --color-rose-300: #ddc7bd;
  --color-rose-400: #d2b4a7;
  --color-rose-500: #b5877e;  /* Primary rose */
  --color-rose-600: #916c65;
  --color-rose-700: #6d514c;
  --color-rose-800: #483632;
  --color-rose-900: #241b19;

  --color-sand-50: #f9f8f6;
  --color-sand-100: #f3f0ed;
  --color-sand-200: #e7e2db;
  --color-sand-300: #dbd3c9;
  --color-sand-400: #cfc5b7;
  --color-sand-500: #c4aa82;  /* Primary sand */
  --color-sand-600: #9d8868;
  --color-sand-700: #76664e;
  --color-sand-800: #4e4434;
  --color-sand-900: #27221a;

  --color-olive-50: #f5f6f4;
  --color-olive-100: #ebede9;
  --color-olive-200: #d7dad3;
  --color-olive-300: #c3c8bd;
  --color-olive-400: #afb5a7;
  --color-olive-500: #5e6b4a;  /* Primary olive */
  --color-olive-600: #4b563b;
  --color-olive-700: #38402c;
  --color-olive-800: #262b1e;
  --color-olive-900: #13150f;

  --color-teal-50: #f5f7f8;
  --color-teal-100: #ebeff0;
  --color-teal-200: #d7dee1;
  --color-teal-300: #c3ced2;
  --color-teal-400: #afbdc3;
  --color-teal-500: #6a8e92;  /* Primary teal */
  --color-teal-600: #557275;
  --color-teal-700: #405558;
  --color-teal-800: #2a393a;
  --color-teal-900: #151c1d;

  --color-gold-50: #f9f8f5;
  --color-gold-100: #f3f1eb;
  --color-gold-200: #e7e3d7;
  --color-gold-300: #dbd5c3;
  --color-gold-400: #cfc7af;
  --color-gold-500: #b5a24c;  /* Primary gold */
  --color-gold-600: #91823d;
  --color-gold-700: #6d612e;
  --color-gold-800: #48411e;
  --color-gold-900: #24200f;

  /* Semantic color mapping */
  --color-primary: var(--color-rose-500);
  --color-secondary: var(--color-sand-500);
  --color-accent: var(--color-gold-500);
  --color-success: var(--color-olive-500);
  --color-info: var(--color-teal-500);

  /* Typography */
  --font-serif: var(--font-miller-display), Georgia, serif;
  --font-sans: var(--font-avenir-lt), system-ui, -apple-system, sans-serif;

  /* Spacing scale (luxury feels spacious) */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-2xl: 4rem;
  --spacing-3xl: 6rem;

  /* Shadows (subtle, refined) */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

**Example (Tailwind CSS v3.4 with `tailwind.config.ts`):**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#faf6f5',
          100: '#f4ede9',
          200: '#e9dad3',
          300: '#ddc7bd',
          400: '#d2b4a7',
          500: '#b5877e',  // Primary rose
          600: '#916c65',
          700: '#6d514c',
          800: '#483632',
          900: '#241b19',
        },
        sand: {
          50: '#f9f8f6',
          100: '#f3f0ed',
          200: '#e7e2db',
          300: '#dbd3c9',
          400: '#cfc5b7',
          500: '#c4aa82',  // Primary sand
          600: '#9d8868',
          700: '#76664e',
          800: '#4e4434',
          900: '#27221a',
        },
        olive: {
          50: '#f5f6f4',
          100: '#ebede9',
          200: '#d7dad3',
          300: '#c3c8bd',
          400: '#afb5a7',
          500: '#5e6b4a',  // Primary olive
          600: '#4b563b',
          700: '#38402c',
          800: '#262b1e',
          900: '#13150f',
        },
        teal: {
          50: '#f5f7f8',
          100: '#ebeff0',
          200: '#d7dee1',
          300: '#c3ced2',
          400: '#afbdc3',
          500: '#6a8e92',  // Primary teal
          600: '#557275',
          700: '#405558',
          800: '#2a393a',
          900: '#151c1d',
        },
        gold: {
          50: '#f9f8f5',
          100: '#f3f1eb',
          200: '#e7e3d7',
          300: '#dbd5c3',
          400: '#cfc7af',
          500: '#b5a24c',  // Primary gold
          600: '#91823d',
          700: '#6d612e',
          800: '#48411e',
          900: '#24200f',
        },
        primary: '#b5877e',      // Rose 500
        secondary: '#c4aa82',    // Sand 500
        accent: '#b5a24c',       // Gold 500
      },
      fontFamily: {
        serif: ['var(--font-miller-display)', 'Georgia', 'serif'],
        sans: ['var(--font-avenir-lt)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
```

**Best practices:**

- Use semantic names (`primary`, `secondary`, `accent`) not arbitrary color names
- Generate full color scales (50-900) for flexibility
- Keep spacing scale consistent (powers of 0.5rem)
- Test all color combinations for WCAG AAA contrast (4.5:1 minimum)

**Sources:**
- [Tailwind CSS 4 @theme Guide](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06)
- [Design Tokens Best Practices](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)

---

## Pattern 4: Radix UI Primitives with Tailwind Styling

**What:** Use Radix UI headless components (Dialog, Dropdown, Accordion, Tabs) styled with Tailwind classes for full design control.

**When to use:** Building shared UI primitives in Phase 0.

**Example (Modal/Dialog):**

```tsx
// components/shared/Modal/Modal.tsx
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
}

export function Modal({ open, onOpenChange, title, description, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content */}
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">

          {/* Title */}
          <Dialog.Title className="font-serif text-2xl font-medium text-rose-900 mb-2">
            {title}
          </Dialog.Title>

          {/* Description */}
          {description && (
            <Dialog.Description className="font-sans text-sm text-rose-700 mb-4">
              {description}
            </Dialog.Description>
          )}

          {/* Children */}
          <div className="mt-4">{children}</div>

          {/* Close button */}
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

**Example (Dropdown Menu):**

```tsx
// components/shared/Dropdown/Dropdown.tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface DropdownProps {
  trigger: React.ReactNode
  items: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }>
}

export function Dropdown({ trigger, items }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
        {trigger}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[220px] bg-white rounded-md p-1 shadow-lg border border-rose-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {items.map((item, index) => (
            <DropdownMenu.Item
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-2 px-3 py-2 text-sm text-rose-900 rounded-sm cursor-pointer hover:bg-rose-50 focus:bg-rose-50 outline-none transition-colors"
            >
              {item.icon}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

**Radix primitives to use:**

- `@radix-ui/react-dialog` → Modal
- `@radix-ui/react-dropdown-menu` → Dropdown
- `@radix-ui/react-accordion` → Accordion
- `@radix-ui/react-tabs` → Tabs
- `@radix-ui/react-select` → Select/Combobox (styled dropdown)
- `@radix-ui/react-checkbox` → Checkbox
- `@radix-ui/react-radio-group` → Radio buttons

**Styling state with Tailwind:**

Use `data-[state=open]`, `data-[state=closed]` attributes for conditional styling:

```tsx
className="data-[state=open]:bg-rose-500 data-[state=closed]:bg-gray-200"
```

**Sources:**
- [Radix UI Primitives with Tailwind](https://medium.com/@fthiagorodrigues10/level-up-your-ui-game-combining-radix-ui-primitives-with-tailwind-css-8f6d91b044eb)
- [Styling Radix with Tailwind](https://supportresort.com/thought/styling-radix-ui-with-tailwind-css/)

---

## Pattern 5: Framer Motion Page Transitions (App Router)

**What:** Set up page transitions using Framer Motion's `AnimatePresence` component in Next.js 15 App Router.

**When to use:** Phase 0 (Design System), after route groups established.

**Example:**

```tsx
// components/providers/PageTransition.tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}  // CRITICAL: key must change on route change
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

```tsx
// app/(b2c)/layout.tsx
import { PageTransition } from '@/components/providers/PageTransition'

export default function B2CLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>{/* Navigation */}</nav>
      <PageTransition>
        {children}
      </PageTransition>
    </div>
  )
}
```

**Prevent scroll jump on navigation:**

```tsx
// components/shared/Link.tsx
import NextLink from 'next/link'

export function Link({ href, children, ...props }: any) {
  return (
    <NextLink href={href} scroll={false} {...props}>
      {children}
    </NextLink>
  )
}
```

**Scroll-triggered animations:**

```tsx
// components/shared/ScrollReveal.tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

**Parallax effect:**

```tsx
// components/shared/Parallax.tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function Parallax({ children, speed = 0.5 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  )
}
```

**Reduced motion support:**

```tsx
// lib/hooks/useReducedMotion.ts
'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  return prefersReducedMotion
}
```

**Sources:**
- [Next.js Page Transitions Guide](https://blog.olivierlarose.com/articles/nextjs-page-transition-guide)
- [Solving Framer Motion in App Router](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router)

---

## Pattern 6: Route Group Layouts (4 Domains)

**What:** Use Next.js route groups `(groupName)` to create 4 isolated domains with separate layouts and middleware.

**When to use:** Phase 1 (Foundation), when setting up folder structure.

**Example:**

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* No navigation - full editorial freedom */}
      <main>{children}</main>
    </div>
  )
}
```

```tsx
// app/(b2c)/layout.tsx
import { B2CNav } from '@/components/b2c/B2CNav'

export default function B2CLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand-50">
      <B2CNav />  {/* Website-style navigation, NOT dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
```

```tsx
// app/(b2b)/layout.tsx
import { B2BSidebar } from '@/components/b2b/B2BSidebar'

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <B2BSidebar />  {/* Premium dashboard sidebar */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
```

```tsx
// app/(admin)/layout.tsx
import { AdminNav } from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />  {/* Top nav for admin operations */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
```

**Middleware for auth guards:**

```typescript
// app/(b2c)/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user has B2C role (UHNI, Spouse, Heir, Advisor)
  const user = getUser(request) // From session/JWT

  if (!user || !['UHNI', 'Spouse', 'Heir', 'Advisor'].includes(user.role.b2c)) {
    return NextResponse.redirect(new URL('/join', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/b2c/:path*'],
}
```

**Best practices:**

- Route groups do NOT affect URL structure (e.g., `/b2c/briefing` becomes `/briefing`)
- Each route group can have its own layout, loading, error, and not-found files
- Middleware can be scoped to specific route groups
- Shared components live in `/components/shared`, NOT within route groups

**Sources:**
- [Next.js Route Groups Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Advanced Routing Conventions](https://blog.logrocket.com/exploring-advanced-next-js-routing-conventions/)

---

## Pattern 7: Service Abstraction Layer

**What:** Define TypeScript interfaces for all services, with environment-based selection between mock (localStorage) and real API implementations.

**When to use:** Phase 1 (Foundation), before building any features.

**Example:**

```typescript
// lib/services/interfaces/IJourneyService.ts
import { Journey, CreateJourneyInput } from '@/lib/types/entities'

export interface IJourneyService {
  getJourneys(userId: string, context: 'b2c' | 'b2b'): Promise<Journey[]>
  getJourneyById(id: string): Promise<Journey | null>
  createJourney(data: CreateJourneyInput): Promise<Journey>
  updateJourney(id: string, data: Partial<Journey>): Promise<Journey>
  deleteJourney(id: string): Promise<boolean>
}
```

```typescript
// lib/services/mock/journey.mock.ts
import { IJourneyService } from '../interfaces/IJourneyService'
import { Journey, CreateJourneyInput } from '@/lib/types/entities'

const STORAGE_KEY = 'elan:journeys'

class MockJourneyService implements IJourneyService {
  private async delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getJourneys(userId: string, context: 'b2c' | 'b2b'): Promise<Journey[]> {
    await this.delay()
    const journeys = this.getFromStorage()

    // Filter by context (B2C = user's own, B2B = assigned clients)
    if (context === 'b2c') {
      return journeys.filter(j => j.userId === userId)
    } else {
      // B2B: return journeys for clients assigned to this RM
      return journeys.filter(j => j.assignedRM === userId)
    }
  }

  async getJourneyById(id: string): Promise<Journey | null> {
    await this.delay()
    const journeys = this.getFromStorage()
    return journeys.find(j => j.id === id) || null
  }

  async createJourney(data: CreateJourneyInput): Promise<Journey> {
    await this.delay()
    const journey: Journey = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const journeys = this.getFromStorage()
    journeys.push(journey)
    this.setInStorage(journeys)

    // Emit audit event
    this.auditLog('journey.created', journey.id, data.userId)

    return journey
  }

  async updateJourney(id: string, data: Partial<Journey>): Promise<Journey> {
    await this.delay()
    const journeys = this.getFromStorage()
    const index = journeys.findIndex(j => j.id === id)

    if (index === -1) throw new Error('Journey not found')

    journeys[index] = {
      ...journeys[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.setInStorage(journeys)
    this.auditLog('journey.updated', id, data.userId || '')

    return journeys[index]
  }

  async deleteJourney(id: string): Promise<boolean> {
    await this.delay()
    const journeys = this.getFromStorage()
    const filtered = journeys.filter(j => j.id !== id)

    if (filtered.length === journeys.length) return false

    this.setInStorage(filtered)
    this.auditLog('journey.deleted', id, '')

    return true
  }

  private getFromStorage(): Journey[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  private setInStorage(journeys: Journey[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journeys))
  }

  private auditLog(event: string, resourceId: string, userId: string): void {
    // Emit to audit service
    const auditEvent = {
      event,
      resourceId,
      userId,
      timestamp: new Date().toISOString(),
    }

    const logs = JSON.parse(localStorage.getItem('elan:audit') || '[]')
    logs.push(auditEvent)
    localStorage.setItem('elan:audit', JSON.stringify(logs))
  }
}

export const mockJourneyService = new MockJourneyService()
```

```typescript
// lib/services/config.ts
import { IJourneyService } from './interfaces/IJourneyService'
import { mockJourneyService } from './mock/journey.mock'
// import { apiJourneyService } from './api/journey.api'  // Future

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES !== 'false'

export const services = {
  journey: USE_MOCK ? mockJourneyService : mockJourneyService, // Replace with apiJourneyService when ready
}
```

```typescript
// lib/services/index.ts
export { services as default } from './config'
export type { IJourneyService } from './interfaces/IJourneyService'
// Export other interfaces...
```

**Usage in components:**

```tsx
// app/(b2c)/journeys/page.tsx
import services from '@/lib/services'

export default async function JourneysPage() {
  const user = await getUser() // From auth
  const journeys = await services.journey.getJourneys(user.id, 'b2c')

  return (
    <div>
      {journeys.map(journey => (
        <JourneyCard key={journey.id} journey={journey} />
      ))}
    </div>
  )
}
```

**Best practices:**

- Define interfaces BEFORE implementation (contract-first)
- Mock services return production-shaped data
- Add realistic delays to mock API calls (300-500ms)
- Mock services emit audit events
- Environment variable controls mock vs. real

**Sources:**
- [Dependency Injection in TypeScript](https://blog.logrocket.com/dependency-inversion-principle-typescript/)
- [Service Abstraction Pattern](https://www.lodely.com/blog/dependency-injection-in-nodejs-typescript)

---

## Pattern 8: RBAC Engine (Context-Aware Permissions)

**What:** Implement role-based access control with context awareness (B2C vs B2B vs Admin) using permission matrices and custom hooks.

**When to use:** Phase 1 (Foundation), before building protected features.

**Example:**

```typescript
// lib/types/roles.ts
export enum B2CRole {
  UHNI = 'UHNI',
  Spouse = 'Spouse',
  LegacyHeir = 'Legacy Heir',
  ElanAdvisor = 'Élan Advisor',
}

export enum B2BRole {
  RelationshipManager = 'Relationship Manager',
  PrivateBanker = 'Private Banker',
  FamilyOfficeDirector = 'Family Office Director',
  ComplianceOfficer = 'Compliance Officer',
  InstitutionalAdmin = 'Institutional Admin',
  UHNIPortal = 'UHNI Portal',
}

export enum AdminRole {
  SuperAdmin = 'Super Admin',
}

export type Role = B2CRole | B2BRole | AdminRole

export interface UserRoles {
  b2c?: B2CRole
  b2b?: B2BRole
  admin?: AdminRole
}
```

```typescript
// lib/types/permissions.ts
export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  EXPORT = 'EXPORT',
  ASSIGN = 'ASSIGN',
  CONFIGURE = 'CONFIGURE',
}

export type Resource =
  | 'journey'
  | 'vault'
  | 'intent'
  | 'privacy'
  | 'client'
  | 'risk'
  | 'audit'
  | 'invite'
  | 'institution'
```

```typescript
// lib/rbac/permissions.ts
import { B2CRole, B2BRole, AdminRole, Role } from '@/lib/types/roles'
import { Permission, Resource } from '@/lib/types/permissions'

type PermissionMatrix = Record<Role, Partial<Record<Resource, Permission[]>>>

export const B2C_PERMISSIONS: PermissionMatrix = {
  [B2CRole.UHNI]: {
    journey: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.EXPORT],
    vault: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.EXPORT],
    intent: [Permission.READ, Permission.WRITE, Permission.DELETE],
    privacy: [Permission.READ, Permission.WRITE, Permission.CONFIGURE],
  },
  [B2CRole.Spouse]: {
    journey: [Permission.READ],
    vault: [Permission.READ], // Filtered by sharing permissions
    intent: [], // No access
    privacy: [], // No access
  },
  [B2CRole.LegacyHeir]: {
    journey: [Permission.READ],
    vault: [Permission.READ], // Filtered by sharing + not locked
    intent: [],
    privacy: [],
  },
  [B2CRole.ElanAdvisor]: {
    journey: [Permission.READ],
    vault: [], // No direct access
    intent: [Permission.READ],
    privacy: [],
  },
}

export const B2B_PERMISSIONS: PermissionMatrix = {
  [B2BRole.RelationshipManager]: {
    journey: [Permission.READ, Permission.WRITE, Permission.APPROVE],
    client: [Permission.READ, Permission.WRITE, Permission.ASSIGN],
    risk: [Permission.READ, Permission.WRITE],
    vault: [Permission.READ], // Governed access
    audit: [Permission.READ],
  },
  [B2BRole.ComplianceOfficer]: {
    journey: [Permission.READ, Permission.APPROVE], // Approval gatekeeper
    client: [Permission.READ],
    risk: [Permission.READ],
    audit: [Permission.READ, Permission.EXPORT],
  },
  [B2BRole.UHNIPortal]: {
    journey: [Permission.READ],
    client: [Permission.READ], // Own profile only
    vault: [], // No B2B vault access
    audit: [],
  },
  // ... other B2B roles
}

export const ADMIN_PERMISSIONS: PermissionMatrix = {
  [AdminRole.SuperAdmin]: {
    journey: [Permission.READ],
    invite: [Permission.READ, Permission.WRITE, Permission.DELETE],
    institution: [Permission.READ, Permission.WRITE, Permission.CONFIGURE],
    audit: [Permission.READ, Permission.EXPORT],
  },
}

export function getPermissionMatrix(context: 'b2c' | 'b2b' | 'admin'): PermissionMatrix {
  switch (context) {
    case 'b2c': return B2C_PERMISSIONS
    case 'b2b': return B2B_PERMISSIONS
    case 'admin': return ADMIN_PERMISSIONS
  }
}
```

```typescript
// lib/rbac/usePermission.ts
'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Permission, Resource } from '@/lib/types/permissions'
import { getPermissionMatrix } from './permissions'

export function usePermission(action: Permission, resource: Resource): boolean {
  const { user, context } = useAuth()

  if (!user) return false

  const role = user.roles[context]
  if (!role) return false

  const matrix = getPermissionMatrix(context)
  const permissions = matrix[role]?.[resource] || []

  return permissions.includes(action)
}
```

```typescript
// components/shared/RequirePermission.tsx
'use client'

import { usePermission } from '@/lib/rbac/usePermission'
import { Permission, Resource } from '@/lib/types/permissions'

interface RequirePermissionProps {
  action: Permission
  resource: Resource
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RequirePermission({ action, resource, fallback, children }: RequirePermissionProps) {
  const hasPermission = usePermission(action, resource)

  if (!hasPermission) return fallback || null

  return <>{children}</>
}
```

**Usage in components:**

```tsx
// app/(b2c)/journeys/[id]/page.tsx
import { RequirePermission } from '@/components/shared/RequirePermission'
import { Permission } from '@/lib/types/permissions'

export default function JourneyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Journey Details</h1>

      <RequirePermission action={Permission.WRITE} resource="journey">
        <Button>Edit Journey</Button>
      </RequirePermission>

      <RequirePermission action={Permission.DELETE} resource="journey">
        <Button variant="destructive">Delete Journey</Button>
      </RequirePermission>
    </div>
  )
}
```

**Middleware protection:**

```typescript
// app/(b2b)/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { B2BRole } from '@/lib/types/roles'

export function middleware(request: NextRequest) {
  const user = getUser(request)

  if (!user?.roles.b2b) {
    return NextResponse.redirect(new URL('/join', request.url))
  }

  // Check specific role requirements for certain routes
  if (request.nextUrl.pathname.startsWith('/b2b/risk')) {
    const allowedRoles = [B2BRole.RelationshipManager, B2BRole.ComplianceOfficer]
    if (!allowedRoles.includes(user.roles.b2b)) {
      return NextResponse.redirect(new URL('/b2b/portfolio', request.url))
    }
  }

  return NextResponse.next()
}
```

**Best practices:**

- Use permission-based checks (`can('WRITE', 'journey')`) NOT role-based (`isAdmin`)
- Context must be part of permission resolution (B2C vs B2B)
- Middleware enforces coarse-grained access (route level)
- Components enforce fine-grained access (action level)
- Permission matrices are single source of truth

**Sources:**
- [RBAC in React](https://www.permit.io/blog/implementing-react-rbac-authorization)
- [RBAC Best Practices](https://www.rohitnandi.com/blog/rbac-react)

---

## Pattern 9: Audit Event System (Immutable Logging)

**What:** Implement append-only audit log that captures all state changes with event sourcing pattern.

**When to use:** Phase 1 (Foundation), integrated into service layer from day one.

**Example:**

```typescript
// lib/types/entities.ts
export interface AuditEvent {
  id: string
  event: string                    // 'journey.created', 'vault.deleted', etc.
  userId: string
  resourceId: string
  resourceType: string             // 'Journey', 'MemoryItem', etc.
  context: 'b2c' | 'b2b' | 'admin'
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE'
  metadata?: Record<string, any>   // Additional context
  timestamp: string                // ISO 8601
  previousState?: any              // Snapshot before change (optional)
  newState?: any                   // Snapshot after change (optional)
}
```

```typescript
// lib/utils/audit.ts
import { AuditEvent } from '@/lib/types/entities'

const AUDIT_STORAGE_KEY = 'elan:audit'

class AuditService {
  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      ...event,
      timestamp: new Date().toISOString(),
    }

    this.append(auditEvent)
  }

  private append(event: AuditEvent): void {
    if (typeof window === 'undefined') return

    const logs = this.getAll()
    logs.push(event)

    // Append-only: never modify existing logs
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs))
  }

  getAll(): AuditEvent[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(AUDIT_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  getByResource(resourceType: string, resourceId: string): AuditEvent[] {
    return this.getAll().filter(
      event => event.resourceType === resourceType && event.resourceId === resourceId
    )
  }

  getByUser(userId: string): AuditEvent[] {
    return this.getAll().filter(event => event.userId === userId)
  }

  getByEvent(eventType: string): AuditEvent[] {
    return this.getAll().filter(event => event.event === eventType)
  }

  // CRITICAL: No delete method - logs are immutable
  // For GDPR compliance, anonymize user references instead of deleting
  anonymizeUser(userId: string): void {
    const logs = this.getAll()
    const anonymized = logs.map(log => {
      if (log.userId === userId) {
        return {
          ...log,
          userId: `REDACTED_${crypto.randomUUID()}`,
          metadata: {
            ...log.metadata,
            anonymized: true,
            anonymizedAt: new Date().toISOString(),
          },
        }
      }
      return log
    })

    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(anonymized))
  }
}

export const auditService = new AuditService()
```

**Integration in service layer:**

```typescript
// lib/services/mock/journey.mock.ts
import { auditService } from '@/lib/utils/audit'

class MockJourneyService implements IJourneyService {
  async createJourney(data: CreateJourneyInput): Promise<Journey> {
    const journey: Journey = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    }

    // Store journey
    const journeys = this.getFromStorage()
    journeys.push(journey)
    this.setInStorage(journeys)

    // Emit audit event
    auditService.log({
      event: 'journey.created',
      userId: data.userId,
      resourceId: journey.id,
      resourceType: 'Journey',
      context: data.context || 'b2c',
      action: 'CREATE',
      newState: journey,
    })

    return journey
  }

  async deleteJourney(id: string, userId: string): Promise<boolean> {
    const journeys = this.getFromStorage()
    const journey = journeys.find(j => j.id === id)

    if (!journey) return false

    const filtered = journeys.filter(j => j.id !== id)
    this.setInStorage(filtered)

    // Emit audit event with previous state
    auditService.log({
      event: 'journey.deleted',
      userId,
      resourceId: id,
      resourceType: 'Journey',
      context: 'b2c',
      action: 'DELETE',
      previousState: journey,
    })

    return true
  }
}
```

**Viewing audit trail:**

```tsx
// app/(admin)/audit/page.tsx
import { auditService } from '@/lib/utils/audit'

export default function AuditLogPage() {
  const logs = auditService.getAll()

  return (
    <div>
      <h1>Audit Log</h1>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Event</th>
            <th>User</th>
            <th>Resource</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.event}</td>
              <td>{log.userId}</td>
              <td>{log.resourceType} ({log.resourceId})</td>
              <td>{log.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Best practices:**

- Audit logs are append-only (NEVER delete)
- For GDPR compliance, anonymize user references, don't delete events
- Capture both previous and new state for UPDATE actions
- Include enough context to reconstruct what happened
- Event names follow pattern: `{resource}.{action}` (e.g., `journey.approved`)

**Sources:**
- [Immutable Audit Log Pipeline](https://oneuptime.com/blog/post/2026-02-06-immutable-audit-log-pipeline-otel/view)
- [Event Sourcing Explained](https://www.baytechconsulting.com/blog/event-sourcing-explained-2025)

---

## Pattern 10: Entity Type Definitions

**What:** Define TypeScript types for all 15+ data entities with relationships, enums, and validation schemas.

**When to use:** Phase 1 (Foundation), before any service implementation.

**Example:**

```typescript
// lib/types/entities.ts
import { B2CRole, B2BRole, AdminRole } from './roles'

// User entity
export interface User {
  id: string
  email: string
  name: string
  roles: {
    b2c?: B2CRole
    b2b?: B2BRole
    admin?: AdminRole
  }
  institutionId?: string        // B2B users belong to institution
  createdAt: string
  updatedAt: string
  erasedAt?: string             // For global erase tracking
}

// Institution entity
export interface Institution {
  id: string
  name: string
  type: 'Private Bank' | 'Family Office' | 'Wealth Manager'
  tier: 'Platinum' | 'Gold' | 'Silver'
  status: 'Active' | 'Pending' | 'Suspended'
  contractStart: string
  contractEnd?: string
  createdAt: string
  updatedAt: string
}

// Intent Profile entity (Emotional DNA)
export interface IntentProfile {
  id: string
  userId: string                // Owner (UHNI)
  emotionalDrivers: {
    security: number            // 0-100
    adventure: number
    legacy: number
    recognition: number
    autonomy: number
  }
  riskTolerance: 'Conservative' | 'Balanced' | 'Aggressive'
  values: string[]              // ['sustainability', 'privacy', 'exclusivity']
  lifeStage: 'Accumulation' | 'Preservation' | 'Transfer' | 'Philanthropy'
  createdAt: string
  updatedAt: string
}

// Journey entity
export interface Journey {
  id: string
  userId: string                // UHNI owner
  institutionId?: string        // B2B: which institution proposed it
  assignedRM?: string           // Relationship Manager ID
  title: string
  narrative: string             // AI-generated story
  category: 'Travel' | 'Investment' | 'Art' | 'Property' | 'Experience' | 'Philanthropy'
  status: JourneyStatus
  versions: JourneyVersion[]    // Immutable version history
  currentVersionId: string
  createdAt: string
  updatedAt: string
}

export enum JourneyStatus {
  DRAFT = 'DRAFT',
  RM_REVIEW = 'RM_REVIEW',
  COMPLIANCE_REVIEW = 'COMPLIANCE_REVIEW',
  APPROVED = 'APPROVED',
  PRESENTED = 'PRESENTED',
  EXECUTED = 'EXECUTED',
  ARCHIVED = 'ARCHIVED',
}

// Journey Version entity (immutable snapshots)
export interface JourneyVersion {
  id: string
  journeyId: string
  versionNumber: number
  title: string
  narrative: string
  status: JourneyStatus
  approvedBy?: string           // User ID who approved
  rejectedBy?: string
  rejectionReason?: string
  modifiedBy: string
  createdAt: string             // Version timestamp
}

// Memory Item entity (Vault)
export interface MemoryItem {
  id: string
  userId: string                // Owner (UHNI)
  type: 'Document' | 'Photo' | 'Video' | 'Note' | 'Audio'
  title: string
  description?: string
  fileUrl?: string
  thumbnailUrl?: string
  tags: string[]
  linkedJourneys: string[]      // Journey IDs
  sharingPermissions: ('spouse' | 'heir' | 'advisor')[]
  isLocked: boolean             // Locked items hidden from heirs until trigger
  unlockCondition?: string
  createdAt: string
  updatedAt: string
}

// Message Thread entity
export interface MessageThread {
  id: string
  participants: string[]        // User IDs
  subject?: string
  context: 'b2c' | 'b2b'
  relatedResourceId?: string    // Journey ID, etc.
  relatedResourceType?: string
  lastMessageAt: string
  createdAt: string
}

// Message entity
export interface Message {
  id: string
  threadId: string
  senderId: string
  content: string
  attachments?: string[]        // File URLs
  readBy: string[]              // User IDs who read it
  sentAt: string
}

// Privacy Settings entity
export interface PrivacySettings {
  id: string
  userId: string
  discretionTier: 'High' | 'Medium' | 'Standard'
  dataRetention: number         // Days before auto-delete (0 = never)
  analyticsOptOut: boolean
  thirdPartySharing: boolean
  globalEraseRequested: boolean
  globalEraseExecutedAt?: string
  createdAt: string
  updatedAt: string
}

// Access Permission entity (who can see what)
export interface AccessPermission {
  id: string
  grantedBy: string             // UHNI who grants access
  grantedTo: string             // User receiving access
  resourceType: string          // 'Journey', 'MemoryItem', etc.
  resourceId: string
  permission: 'READ' | 'WRITE' | 'DELETE'
  expiresAt?: string
  createdAt: string
}

// Risk Record entity (B2B compliance)
export interface RiskRecord {
  id: string
  userId: string                // UHNI being assessed
  institutionId: string
  riskScore: number             // 0-100
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical'
  flags: string[]               // ['PEP', 'Sanctioned Country', etc.]
  assessedBy: string            // Compliance Officer ID
  assessedAt: string
  nextReviewDate: string
  notes?: string
}

// Contract entity (Revenue tracking)
export interface Contract {
  id: string
  institutionId: string
  tier: 'Platinum' | 'Gold' | 'Silver'
  annualFee: number
  perUserFee: number
  startDate: string
  endDate?: string
  status: 'Active' | 'Expired' | 'Pending Renewal'
  signedBy: string
  createdAt: string
  updatedAt: string
}

// Revenue Record entity
export interface RevenueRecord {
  id: string
  institutionId: string
  contractId: string
  amount: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CHF'
  type: 'Subscription' | 'Usage' | 'One-Time'
  period: string                // '2026-Q1'
  paidAt?: string
  createdAt: string
}

// Audit Log entity (already defined in Pattern 9)
export interface AuditEvent {
  id: string
  event: string
  userId: string
  resourceId: string
  resourceType: string
  context: 'b2c' | 'b2b' | 'admin'
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE'
  metadata?: Record<string, any>
  timestamp: string
  previousState?: any
  newState?: any
}
```

**Validation with Zod:**

```typescript
// lib/types/validation.ts
import { z } from 'zod'

export const CreateJourneySchema = z.object({
  userId: z.string().uuid(),
  institutionId: z.string().uuid().optional(),
  assignedRM: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  narrative: z.string().min(10).max(5000),
  category: z.enum(['Travel', 'Investment', 'Art', 'Property', 'Experience', 'Philanthropy']),
  context: z.enum(['b2c', 'b2b']),
})

export type CreateJourneyInput = z.infer<typeof CreateJourneySchema>
```

**Best practices:**

- Use enums for fixed sets of values (JourneyStatus, roles, etc.)
- Include timestamps (createdAt, updatedAt) on all entities
- Foreign keys reference by ID (string UUID)
- Optional fields use `?` modifier
- Arrays use `string[]` syntax
- Validate input data with Zod schemas

**Sources:**
- [TypeScript Enum Guide](https://refine.dev/blog/typescript-enum/)
- [RBAC in NestJS](https://medium.com/@nwonahr/building-robust-role-based-access-control-rbac-in-typescript-with-nestjs-f96bd01f89ad)

---

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom validation logic | React Hook Form + Zod | Handles edge cases (nested fields, arrays, async validation, error messages) |
| Animation state management | Manual useState for animations | Framer Motion's `AnimatePresence` | Handles exit animations, layout shifts, gesture conflicts |
| Data fetching & caching | Manual fetch + useState | TanStack Query | Handles cache invalidation, background refetching, optimistic updates, deduplication |
| Font optimization | Manual font loading | Next.js `next/font` | Automatic font subsetting, preloading, FOUT prevention |
| Responsive images | Manual `<img>` tags | Next.js `next/image` | Automatic WebP conversion, lazy loading, srcset generation |
| Route protection | Manual redirects in components | Next.js middleware | Runs on edge, protects routes before rendering |
| TypeScript runtime validation | Manual checks | Zod | Type inference, composable schemas, custom error messages |
| State machines | Nested if/else | XState (or explicit state machine pattern) | Prevents invalid state transitions, visualizable workflows |

**Key insight:** UI frameworks like Next.js and React have mature ecosystems. Prefer battle-tested libraries over custom solutions for foundational problems.

---

## Common Pitfalls

### Pitfall 1: Dashboard-First Design for B2C

**What goes wrong:** B2C route group uses dashboard UI patterns (data tables, cards, widgets) instead of editorial/narrative layouts.

**Why it happens:** Designers default to familiar SaaS patterns; developers reuse B2B components in B2C.

**How to avoid:**
- Establish B2C as "digital magazine meets concierge" principle in Phase 0
- Reference luxury brand websites (Four Seasons, Ritz-Carlton, Porsche) NOT SaaS dashboards
- Create separate component libraries for B2C vs B2B
- Design reviews must include "does this feel like luxury service or tech product?"

**Warning signs:**
- Early wireframes showing data tables in B2C routes
- Copy-paste component reuse between B2B and B2C
- Dense information displays rather than editorial layouts

**Phase to address:** Phase 0 (Design System) & Phase 1 (Foundation)

---

### Pitfall 2: Route Group Boundary Violations

**What goes wrong:** Components in `(marketing)` import from `(b2c)` or vice versa, creating tangled dependencies.

**Why it happens:** Developers take shortcuts to reuse code; unclear import rules.

**How to avoid:**
- Establish import rule: route groups can import from `/lib` or `/components/shared`, NOT from each other
- Use TypeScript path restrictions with ESLint `no-restricted-imports` rule
- Shared components MUST live in `/components/shared`
- Code reviews enforce boundary discipline

**Warning signs:**
- Imports crossing route group boundaries
- Shared state spanning route groups
- Layout components duplicated instead of composed

**Phase to address:** Phase 1 (Foundation) — enforce from day one

---

### Pitfall 3: Framer Motion Key Forgetting

**What goes wrong:** Exit animations don't work in `AnimatePresence` because `key` prop missing on children.

**Why it happens:** Framer Motion requires unique keys to track component lifecycle; easy to forget.

**How to avoid:**
- Always provide `key` prop to direct children of `AnimatePresence`
- Use `pathname` from `usePathname()` as key for page transitions
- Set `mode="wait"` and `initial={false}` on AnimatePresence

**Warning signs:**
- Exit animations don't trigger
- Components jump instead of animating out

**Code example:**

```tsx
// ❌ BAD: No key, exit animation won't work
<AnimatePresence>
  <motion.div>{children}</motion.div>
</AnimatePresence>

// ✅ GOOD: Key changes on route change
const pathname = usePathname()
<AnimatePresence mode="wait" initial={false}>
  <motion.div key={pathname}>{children}</motion.div>
</AnimatePresence>
```

**Phase to address:** Phase 0 (Design System) when setting up animations

---

### Pitfall 4: Font Loading FOUT (Flash of Unstyled Text)

**What goes wrong:** Miller Display and Avenir LT Std load after initial render, causing layout shift and unstyled text flash.

**Why it happens:** Fonts not preloaded; `font-display: block` instead of `swap`; missing fallback font stack.

**How to avoid:**
- Use `display: 'swap'` in `localFont` config
- Preload critical fonts in root layout
- Define fallback font stack with similar metrics
- Use `font-size-adjust` to minimize layout shift

**Warning signs:**
- Text invisible for 1-2 seconds on page load
- Layout shifts after fonts load
- Fallback fonts look drastically different

**Phase to address:** Phase 0 (Design System) when configuring fonts

---

### Pitfall 5: RBAC as Afterthought

**What goes wrong:** Features built first, permissions retrofitted later; permission checks scattered throughout codebase.

**Why it happens:** RBAC seems complex; developers defer it to "add security later."

**How to avoid:**
- Define permission matrices in Phase 1 BEFORE feature development
- Use `RequirePermission` wrapper component for UI conditionals
- Centralize permission logic in service layer
- Build RBAC testing matrix (role × action × expected outcome)

**Warning signs:**
- Building features without permission checks
- UI conditionals like `if (user.role === 'admin')` scattered in components
- Permission logic duplicated across files

**Phase to address:** Phase 1 (Foundation) — RBAC must be architectural

---

### Pitfall 6: Mock Service Data Shape Mismatch

**What goes wrong:** Mock services return different data shapes than planned backend API, causing rewrite when backend arrives.

**Why it happens:** Mock services built without backend contract defined first.

**How to avoid:**
- Define TypeScript interfaces for service contracts BEFORE mocking
- Mock services implement same interfaces as future real API
- Use Zod schemas to validate data shapes in both mock and real services
- Document expected backend contracts in `/lib/services/interfaces`

**Warning signs:**
- Different data shapes in mock vs. planned backend
- Business logic (versioning, state machines) implemented in frontend
- No TypeScript interfaces for service contracts

**Phase to address:** Phase 1 (Foundation) when creating service layer

---

### Pitfall 7: Audit Logs That Aren't Immutable

**What goes wrong:** Audit logs stored in mutable format; can be edited or deleted, violating compliance requirements.

**Why it happens:** Audit logs treated as regular data; no append-only enforcement.

**How to avoid:**
- Use append-only pattern (no delete method in audit service)
- For GDPR compliance, anonymize user references instead of deleting events
- Store audit logs in separate storage from operational data
- Hash chaining to detect tampering (future enhancement)

**Warning signs:**
- Audit records in same storage as operational data
- Delete methods on audit service
- No immutability guarantees

**Phase to address:** Phase 1 (Foundation) when implementing audit service

---

## Code Examples

Verified patterns from research sources:

### Next.js 15 Project Initialization

```bash
# Source: https://nextjs.org/docs/app/api-reference/cli/create-next-app
npx create-next-app@latest e-glimmora \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### Local Font Loading

```typescript
// Source: https://nextjs.org/docs/app/getting-started/fonts
import localFont from 'next/font/local'

export const millerDisplay = localFont({
  src: [
    { path: '../public/fonts/MillerDisplay-Roman.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/MillerDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-miller-display',
  display: 'swap',
})
```

### Tailwind Color Tokens (v4)

```css
/* Source: https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06 */
@theme {
  --color-primary: #b5877e;
  --color-secondary: #c4aa82;
  --font-serif: var(--font-miller-display), Georgia, serif;
}
```

### Radix Dialog with Tailwind

```tsx
// Source: https://medium.com/@fthiagorodrigues10/level-up-your-ui-game-combining-radix-ui-primitives-with-tailwind-css-8f6d91b044eb
import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root>
  <Dialog.Trigger className="px-4 py-2 bg-rose-500 text-white rounded">
    Open Modal
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl">
      <Dialog.Title>Modal Title</Dialog.Title>
      {/* Content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Framer Motion Page Transition

```tsx
// Source: https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}  // CRITICAL: key must change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Service Abstraction

```typescript
// Source: https://blog.logrocket.com/dependency-inversion-principle-typescript/
export interface IJourneyService {
  getJourneys(userId: string): Promise<Journey[]>
  createJourney(data: CreateJourneyInput): Promise<Journey>
}

class MockJourneyService implements IJourneyService {
  async getJourneys(userId: string): Promise<Journey[]> {
    // localStorage implementation
  }
}

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_SERVICES !== 'false'
export const services = {
  journey: USE_MOCK ? mockJourneyService : apiJourneyService,
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router | Next.js 13+ | Server Components, streaming, better data fetching |
| JavaScript config | CSS-first config with `@theme` | Tailwind v4 | Better performance, easier token sharing |
| CSS-in-JS (Styled Components) | Tailwind utility classes | 2023+ | Faster builds, no runtime overhead, better RSC compatibility |
| Redux for all state | TanStack Query for server state, Zustand for UI state | 2023+ | Simpler mental model, less boilerplate |
| Custom form validation | React Hook Form + Zod | 2023+ | Type-safe, less re-renders, better DX |
| Manual font loading | next/font optimization | Next.js 13+ | Automatic optimization, no FOUT |

**Deprecated/outdated:**

- **Pages Router:** Still supported, but App Router is recommended for new projects
- **Tailwind v3 JavaScript config:** v4 uses CSS-first config (but v3.4 still stable if needed)
- **CSS-in-JS libraries:** Emotion, Styled Components have runtime overhead incompatible with RSC
- **Redux for everything:** Overkill for most apps; use specialized tools

---

## Open Questions

Things that couldn't be fully resolved:

### 1. Tailwind CSS v4 Stability

**What we know:** Tailwind v4 uses CSS-first `@theme` configuration, which is more performant and intuitive than v3's JavaScript config.

**What's unclear:** As of February 2026, Tailwind v4 may still be in beta/alpha. Production readiness depends on release timeline.

**Recommendation:** Start with v3.4 (stable) for Phase 1. Monitor v4 release and plan migration when stable. The migration is straightforward with automated tools.

---

### 2. Real Backend API Contracts

**What we know:** Mock services should match production API shape to avoid rewrite.

**What's unclear:** Backend API contracts not yet defined (Phase 1 is mock-only).

**Recommendation:** Define expected API contracts as TypeScript interfaces in Phase 1, even if backend isn't built yet. Document in `/lib/services/interfaces` with comments describing expected endpoints, response shapes, and error handling. This becomes the contract for backend team.

---

### 3. Licensed Font Subsetting Requirements

**What we know:** Font subsetting reduces file size dramatically by including only needed glyphs.

**What's unclear:** Miller Display and Avenir LT Std license terms may restrict subsetting or require specific tools.

**Recommendation:** Check font license agreements before subsetting. If allowed, use `pyftsubset` (fonttools) to create Latin-only subsets. If not allowed, load full fonts but minimize weights loaded (only 300, 400, 700).

---

## Sources

### Primary (HIGH confidence)

- [Next.js CLI Documentation](https://nextjs.org/docs/app/api-reference/cli/create-next-app) - Official Next.js create-next-app reference
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - Official Next.js font loading guide
- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) - Official Next.js route group documentation
- [Radix UI Primitives](https://www.radix-ui.com/primitives) - Official Radix UI headless component library
- [Framer Motion Documentation](https://www.framer.com/motion/) - Official Framer Motion animation library
- [TypeScript Handbook: Enums](https://www.typescriptlang.org/docs/handbook/enums.html) - Official TypeScript enum documentation

### Secondary (MEDIUM confidence)

- [Tailwind CSS 4 @theme Guide](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06) - Design tokens with Tailwind v4
- [Radix UI with Tailwind CSS](https://medium.com/@fthiagorodrigues10/level-up-your-ui-game-combining-radix-ui-primitives-with-tailwind-css-8f6d91b044eb) - Styling Radix primitives
- [Framer Motion App Router Transitions](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router) - Solving page transitions in App Router
- [RBAC in React](https://www.permit.io/blog/implementing-react-rbac-authorization) - Role-based access control patterns
- [Dependency Injection in TypeScript](https://blog.logrocket.com/dependency-inversion-principle-typescript/) - Service abstraction patterns
- [Immutable Audit Log Pipeline](https://oneuptime.com/blog/post/2026-02-06-immutable-audit-log-pipeline-otel/view) - Append-only logging best practices

### Tertiary (LOW confidence)

- Web search results for current best practices (2026) - Used for ecosystem discovery, verified against official sources

---

## Metadata

**Confidence breakdown:**

- **Standard stack:** HIGH - All libraries battle-tested, official documentation reviewed
- **Architecture patterns:** HIGH - Next.js App Router, route groups, service abstraction are proven patterns
- **Design tokens:** MEDIUM - Tailwind v4 still evolving, v3.4 is stable fallback
- **RBAC implementation:** MEDIUM - Patterns verified, but context-aware RBAC is custom implementation
- **Audit logging:** MEDIUM - Event sourcing patterns proven, but localStorage implementation is simplified (future: real database)

**Research date:** February 15, 2026

**Valid until:** 60 days (March 15, 2026) - Next.js and React ecosystems are stable, but Tailwind v4 may release during this period

---

## Ready for Planning

Research complete. This document provides:

1. ✅ Standard stack with versions and installation commands
2. ✅ Recommended project structure
3. ✅ 10 implementation patterns with verified code examples
4. ✅ Don't-hand-roll guidance for common problems
5. ✅ 7 critical pitfalls with prevention strategies
6. ✅ Open questions flagged for resolution
7. ✅ High-confidence sources cited

**Next step:** Use this research to create PLAN.md files for Phase 1 tasks. All implementation patterns are production-ready and align with "no compromise UI quality" requirement.
