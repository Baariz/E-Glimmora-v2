'use client';

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/providers/PageTransition'
import { ContextSwitcher } from '@/components/auth/ContextSwitcher'
import { Toaster } from 'sonner'
import { useAuth } from '@/lib/hooks/useAuth'
import { B2BRole } from '@/lib/types/roles'
import { getB2BNavItems } from '@/lib/rbac/b2b-role-guards'
import { B2BRoleGuard } from '@/components/b2b/layouts/B2BRoleGuard'

const routeLabels: Record<string, string> = {
  '/portfolio': 'Portfolio',
  '/clients': 'Client Intelligence',
  '/governance': 'Governance',
  '/risk': 'Risk & Compliance',
  '/access': 'Access Control',
  '/vault': 'Document Vault',
  '/revenue': 'Revenue',
}

function Breadcrumb() {
  const pathname = usePathname()

  // Find the matching route label
  const matchedRoute = Object.entries(routeLabels).find(([path]) =>
    pathname.startsWith(path)
  )
  const pageLabel = matchedRoute ? matchedRoute[1] : 'Portfolio'

  return (
    <div className="flex items-center gap-2 text-sm font-sans text-slate-600">
      <span className="text-slate-400">Élan Portal</span>
      <span className="text-slate-300">/</span>
      <span className="text-slate-900 font-medium">{pageLabel}</span>
    </div>
  )
}

/**
 * B2B Sidebar Navigation
 * Premium dashboard feel with fixed sidebar on desktop
 * Slide-out drawer on mobile with hamburger toggle
 * Dynamically filters navigation based on current role
 */
function B2BSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const { currentRole, user } = useAuth();
  const pathname = usePathname();

  // Get nav items for current role
  const navItems = currentRole
    ? getB2BNavItems(currentRole as B2BRole)
    : [];

  // Group items into sections
  const overviewItems = navItems.filter(item =>
    ['/portfolio', '/clients'].includes(item.path)
  );
  const operationsItems = navItems.filter(item =>
    ['/governance', '/risk', '/access'].includes(item.path)
  );
  const resourcesItems = navItems.filter(item =>
    ['/vault', '/revenue'].includes(item.path)
  );

  const navSections = [
    { label: 'Overview', items: overviewItems },
    { label: 'Operations', items: operationsItems },
    { label: 'Resources', items: resourcesItems },
  ].filter(section => section.items.length > 0);

  // Format role name for display
  const roleDisplayName = currentRole
    ? currentRole.replace(/([A-Z])/g, ' $1').trim()
    : 'User';

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-slate-200">
        <Link
          href="/"
          onClick={handleLinkClick}
          className="font-serif text-2xl font-light text-rose-900 hover:text-rose-700 transition-colors"
        >
          Élan
        </Link>
        <p className="text-xs font-sans text-slate-500 mt-1">Partner Portal</p>
        <div className="mt-4">
          <ContextSwitcher />
        </div>
      </div>

      {/* Navigation sections */}
      <nav className="p-4 space-y-6 pb-24" aria-label="B2B sidebar navigation">
        {navSections.map((section) => (
          <div key={section.label}>
            <h3 className="px-3 mb-2 text-xs font-sans font-semibold text-slate-500 uppercase tracking-wider">
              {section.label}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors group touch-target ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-medium'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className={`text-lg transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="font-sans text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-sans text-rose-700">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'IC'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-sans font-medium text-slate-900 truncate">
              {user?.name || 'Institution Rep'}
            </p>
            <p className="text-xs font-sans text-slate-500">{roleDisplayName}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar - fixed, always visible */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile drawer - slide-out from left */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 overflow-y-auto z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * B2B Layout: Premium dashboard with sidebar navigation
 * High data density, professional aesthetic
 * Mobile-responsive with drawer sidebar and top hamburger
 */
export default function B2BLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      <B2BSidebar isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main content area with left margin for sidebar on desktop only */}
      <div className="md:ml-64">
        {/* Header bar with mobile hamburger */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 touch-target"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>

              <Breadcrumb />
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button className="text-sm font-sans text-slate-600 hover:text-slate-900">
                Notifications
              </button>
              <button className="text-sm font-sans text-slate-600 hover:text-slate-900">
                Settings
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8" aria-label="B2B dashboard content">
          <B2BRoleGuard>
            <PageTransition>{children}</PageTransition>
          </B2BRoleGuard>
        </main>
      </div>
    </div>
  )
}
