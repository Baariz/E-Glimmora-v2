/**
 * Edge-compatible NextAuth configuration
 * Used by middleware for route protection
 */

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/invite/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isMfaVerified = (auth?.user as any)?.mfaVerified ?? true; // Default true for non-MFA users
      const isMfaEnabled = (auth?.user as any)?.mfaEnabled ?? false;
      const pathname = nextUrl.pathname;

      // Public routes (marketing)
      const isPublicRoute =
        pathname === '/' ||
        pathname === '/philosophy' ||
        pathname === '/privacy' ||
        pathname === '/invite' ||
        pathname.startsWith('/invite/');

      const isVerifyMfaPage = pathname === '/auth/verify-mfa';

      if (isPublicRoute) {
        return true;
      }

      // Protected routes
      const isProtectedRoute =
        pathname.startsWith('/briefing') ||
        pathname.startsWith('/portfolio') ||
        pathname.startsWith('/dashboard');

      // Require authentication for protected routes
      if (isProtectedRoute || isVerifyMfaPage) {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/invite', nextUrl));
        }

        // MFA check: if MFA is enabled but not verified, redirect to verify page
        if (isMfaEnabled && !isMfaVerified && !isVerifyMfaPage) {
          return Response.redirect(new URL('/auth/verify-mfa', nextUrl));
        }

        // Already MFA-verified but on verify page -> redirect to app
        if (isMfaVerified && isVerifyMfaPage) {
          return Response.redirect(new URL('/briefing', nextUrl));
        }

        return true;
      }

      return true;
    },
  },
  providers: [], // Providers defined in auth.ts
} satisfies NextAuthConfig;
