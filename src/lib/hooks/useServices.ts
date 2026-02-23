'use client';

/**
 * Service Access Hook
 * Returns the module-level singleton services object.
 * Stable reference — never triggers useEffect re-runs on navigation.
 */

import { services } from '@/lib/services/singleton';

export function useServices() {
  return services;
}
