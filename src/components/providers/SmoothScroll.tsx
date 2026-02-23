'use client';

/**
 * Scroll Restoration Provider
 * Scrolls to top on route change so every page starts at the hero.
 * Skips hash-based navigation (e.g. #wizard-content).
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
