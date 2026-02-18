/**
 * NextAuth v5 configuration
 * JWT sessions, Credentials provider, invite code validation
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { services } from '@/lib/services';
import { validateInviteCode } from '@/lib/auth/invite-codes';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { z } from 'zod';
import type { UserRoles } from '@/lib/types';

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  inviteCode: z.string().optional(),
  isRegistration: z.string().optional(),
});

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

        // REGISTRATION PATH
        if (isRegistration === 'true' && inviteCode) {
          // Validate invite code
          const validation = await validateInviteCode(inviteCode);
          if (!validation.valid || !validation.inviteCode) {
            throw new Error(`INVITE_INVALID: ${validation.error}`);
          }

          // Check if user already exists
          const existingUser = await services.user.getUserByEmail(email);
          if (existingUser) {
            throw new Error('EMAIL_EXISTS: An account with this email already exists');
          }

          // Hash password
          const passwordHash = await hashPassword(password);

          // Create user with roles from invite code
          const user = await services.user.createUser({
            email,
            name: email.split('@')[0], // Temporary name, will be updated in registration flow
            roles: validation.inviteCode.assignedRoles,
            passwordHash,
          } as any);

          // Mark invite code as used
          await services.inviteCode.markAsUsed(validation.inviteCode.id, user.id);

          // Log audit event (would be implemented with audit service)
          // await services.audit.logEvent({ event: 'user.registered', userId: user.id, ... })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
          };
        }

        // LOGIN PATH
        const user = await services.user.getUserByEmail(email);
        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Check if MFA is enabled for this user
        // If MFA is enabled, set mfaVerified to false (will need to verify TOTP)
        // If MFA is not enabled, set mfaVerified to true (no MFA needed)
        const mfaVerified = !user.mfaEnabled;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          mfaEnabled: user.mfaEnabled,
          mfaVerified,
        };
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
        };
        if (userWithRoles.roles) {
          token.userId = user.id!;
          token.roles = userWithRoles.roles;
          token.mfaEnabled = userWithRoles.mfaEnabled;
          token.mfaVerified = userWithRoles.mfaVerified ?? true;
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
      }
      return session;
    },
  },
});
