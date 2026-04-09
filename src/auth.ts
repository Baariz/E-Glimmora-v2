/**
 * NextAuth v5 configuration
 * JWT sessions, Credentials provider, real API backend integration
 *
 * Login/Register calls the real Elan Glimmora API.
 * NextAuth is used purely for session management (JWT tokens).
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { UserRoles } from '@/lib/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://elan-glimmora-api.onrender.com';

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  inviteCode: z.string().optional(),
  isRegistration: z.string().optional(),
});

/** Response shape from POST /api/auth/login and /api/auth/register */
interface AuthApiResponse {
  success: boolean;
  data?: {
    access_token: string;
    token_type: string;
    user: {
      id: string;
      email: string;
      name: string;
      roles: UserRoles;
      mfaEnabled: boolean;
      mfaVerified: boolean;
    };
  };
  error?: {
    code: string;
    message: string;
    status: number;
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        inviteCode: {},
        isRegistration: {},
      },
      async authorize(credentials) {
        // Validate input
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password, inviteCode, isRegistration } = parsed.data;

        try {
          let response: Response;

          if (isRegistration === 'true' && inviteCode) {
            // REGISTRATION PATH — call real API
            response = await fetch(`${API_BASE_URL}/api/auth/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                password,
                name: email.split('@')[0], // Temporary name, updated in registration flow
                invite_code: inviteCode,
              }),
            });
          } else {
            // LOGIN PATH — call real API
            response = await fetch(`${API_BASE_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
          }

          const result: AuthApiResponse = await response.json();

          if (!result.success || !result.data) {
            const errorMsg = result.error?.message || 'Authentication failed';
            const errorCode = result.error?.code || 'AUTH_FAILED';

            // Map backend error codes to frontend error messages
            if (errorCode === 'INVALID_CREDENTIALS') {
              return null; // NextAuth shows generic "invalid credentials"
            }
            if (errorCode === 'EMAIL_EXISTS') {
              throw new Error('EMAIL_EXISTS: An account with this email already exists');
            }
            if (errorCode === 'INVALID_INVITE' || errorCode === 'INVITE_INVALID') {
              throw new Error(`INVITE_INVALID: ${errorMsg}`);
            }
            // For other errors, return null (generic auth failure)
            return null;
          }

          const { user, access_token } = result.data;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            mfaEnabled: user.mfaEnabled,
            mfaVerified: user.mfaVerified,
            // Store the API token so it can be propagated to the session
            apiToken: access_token,
          };
        } catch (error) {
          // Re-throw known errors (INVITE_INVALID, EMAIL_EXISTS)
          if (error instanceof Error && (
            error.message.startsWith('INVITE_INVALID:') ||
            error.message.startsWith('EMAIL_EXISTS:')
          )) {
            throw error;
          }
          console.error('Auth API error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On sign in, copy user data to token
      if (user) {
        const userWithRoles = user as typeof user & {
          roles?: UserRoles;
          mfaEnabled?: boolean;
          mfaVerified?: boolean;
          apiToken?: string;
        };
        if (userWithRoles.roles) {
          token.userId = user.id!;
          token.roles = userWithRoles.roles;
          token.mfaEnabled = userWithRoles.mfaEnabled;
          token.mfaVerified = userWithRoles.mfaVerified ?? true;
        }
        // Store the API JWT in the NextAuth token
        if (userWithRoles.apiToken) {
          token.apiToken = userWithRoles.apiToken;
        }
      }

      // Handle session update trigger for MFA verification
      if (trigger === 'update' && session?.mfaVerified === true) {
        token.mfaVerified = true;
      }

      return token;
    },
    async session({ session, token }) {
      // Copy token data to session
      if (token && token.userId && token.roles) {
        (session.user as any).id = token.userId as string;
        (session.user as any).roles = token.roles;
        (session.user as any).mfaEnabled = token.mfaEnabled;
        (session.user as any).mfaVerified = token.mfaVerified;
        // Expose API token to client so it can be used for direct API calls
        (session as any).apiToken = token.apiToken;
      }
      return session;
    },
  },
});
