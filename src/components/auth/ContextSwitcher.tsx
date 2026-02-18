'use client';

/**
 * Context Switcher Component
 * Allows users with multiple roles to switch between B2C, B2B, and Admin contexts
 */

import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { DomainContext } from '@/lib/types';
import { Dropdown } from '@/components/shared/Dropdown/Dropdown';
import { cn } from '@/lib/utils/cn';

const contextLabels: Record<DomainContext, string> = {
  b2c: 'Personal',
  b2b: 'Institutional',
  admin: 'Admin'
};

const contextRoutes: Record<DomainContext, string> = {
  b2c: '/briefing',
  b2b: '/portfolio',
  admin: '/dashboard'
};

export function ContextSwitcher() {
  const router = useRouter();
  const { user, context, setContext } = useAuth();

  // Don't render if user doesn't have multiple roles
  if (!user?.roles) return null;

  const availableContexts: DomainContext[] = [];
  if (user.roles.b2c) availableContexts.push('b2c');
  if (user.roles.b2b) availableContexts.push('b2b');
  if (user.roles.admin) availableContexts.push('admin');

  // Only show if user has multiple contexts
  if (availableContexts.length <= 1) return null;

  const handleContextSwitch = (value: string) => {
    const newContext = value as DomainContext;
    if (newContext === context) return;

    // Update context
    setContext(newContext);

    // Navigate to appropriate route
    router.push(contextRoutes[newContext]);
  };

  const dropdownItems = availableContexts.map(ctx => ({
    label: contextLabels[ctx],
    value: ctx,
  }));

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sand-100 transition-colors group">
          <Globe className="w-4 h-4 text-charcoal-600 group-hover:text-charcoal-900 transition-colors" />
          <span className="text-xs font-medium tracking-wider uppercase text-charcoal-700 group-hover:text-charcoal-900 transition-colors">
            {contextLabels[context]}
          </span>
        </button>
      }
      items={dropdownItems}
      onSelect={handleContextSwitch}
    />
  );
}
