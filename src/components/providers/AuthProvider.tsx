'use client';

/**
 * Auth Provider with NextAuth SessionProvider
 * Wraps NextAuth session with domain context support (B2C/B2B/Admin switching)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { DomainContext, UserRoles } from '@/lib/types';

interface DomainContextValue {
  context: DomainContext;
  setContext: (context: DomainContext) => void;
}

const DomainCtx = createContext<DomainContextValue | undefined>(undefined);

function DomainContextProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<DomainContext>('b2c');
  const [initialized, setInitialized] = useState(false);
  const { data: session } = useSession();

  // Auto-detect initial context from user's roles on first load
  useEffect(() => {
    if (initialized || !session?.user) return;
    const roles = (session.user as any).roles as UserRoles | undefined;
    if (!roles) return;

    // Set context to the user's first available domain
    if (roles.b2c) {
      setContext('b2c');
    } else if (roles.b2b) {
      setContext('b2b');
    } else if (roles.admin) {
      setContext('admin');
    }
    setInitialized(true);
  }, [session, initialized]);

  return (
    <DomainCtx.Provider value={{ context, setContext }}>
      {children}
    </DomainCtx.Provider>
  );
}

export function useDomainContext() {
  const ctx = useContext(DomainCtx);
  if (!ctx) throw new Error('useDomainContext must be used within AuthProvider');
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <DomainContextProvider>
        {children}
      </DomainContextProvider>
    </SessionProvider>
  );
}
