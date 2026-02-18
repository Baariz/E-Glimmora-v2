/**
 * NextAuth v5 type extensions
 * Adds custom fields to User, Session, and JWT types
 */

import { UserRoles } from '@/lib/types/roles';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    roles?: UserRoles;
    passwordHash?: string;
    mfaEnabled?: boolean;
    mfaSecret?: string;
    mfaVerified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      roles: UserRoles;
      mfaEnabled?: boolean;
      mfaVerified?: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    roles: UserRoles;
    mfaEnabled?: boolean;
    mfaVerified?: boolean;
  }
}
