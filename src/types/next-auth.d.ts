import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';
import type { UserRoles } from '@/lib/types/roles';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      roles: UserRoles;
      mfaEnabled?: boolean;
      mfaVerified?: boolean;
      institutionId?: string | null;
      linkedUhniId?: string | null;
    } & DefaultSession['user'];
    apiToken?: string;
  }

  interface User extends DefaultUser {
    roles?: UserRoles;
    mfaEnabled?: boolean;
    mfaVerified?: boolean;
    apiToken?: string;
    institutionId?: string | null;
    linkedUhniId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId?: string;
    roles?: UserRoles;
    mfaEnabled?: boolean;
    mfaVerified?: boolean;
    apiToken?: string;
    institutionId?: string | null;
    linkedUhniId?: string | null;
  }
}
