'use client';

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageTransition } from '@/components/providers/PageTransition'
import { ContextSwitcher } from '@/components/auth/ContextSwitcher'
import { useAuth } from '@/lib/hooks/useAuth'
import { getNavLinksForRole, getRoleBadge } from '@/lib/rbac/b2c-role-filters'
import { B2CRole } from '@/lib/types/roles'

/**
 * B2C Client Portal Navigation
 * Website-style horizontal top navigation (NOT dashboard with sidebar)
 * Luxury feel: warm background, generous spacing
 * Role-aware navigation using B2C role filters
 * Mobile-responsive with hamburger menu and touch-friendly targets
 */
function B2CNav() {
  const { currentRole, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get nav links based on current B2C role
  const role = currentRole as B2CRole || B2CRole.UHNI;
  const navLinks = getNavLinksForRole(role);
  const roleBadge = getRoleBadge(role);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-sand-200" aria-label="B2C navigation">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            href="/"
            className="font-serif text-xl font-light text-rose-900 hover:text-rose-700 transition-colors touch-target"
          >
            Élan
          </Link>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-rose-800 hover:text-rose-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Privacy Settings link - UHNI only */}
            {role === B2CRole.UHNI && (
              <Link
                href="/privacy-settings"
                className="font-sans text-sm text-rose-800 hover:text-rose-600 transition-colors"
              >
                Privacy
              </Link>
            )}

            {/* Role Badge for non-UHNI */}
            {roleBadge && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                {roleBadge.label}
              </div>
            )}

            {/* Context Switcher - UHNI only */}
            {role === B2CRole.UHNI && <ContextSwitcher />}

            {/* User menu */}
            <div className="ml-4 pl-4 border-l border-sand-300 flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-sans text-rose-700">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 font-sans text-sm text-sand-500 hover:text-rose-700 transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-rose-900 hover:text-rose-700 touch-target"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-sand-200 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-sans text-sm text-rose-800 hover:text-rose-600 transition-colors py-2 touch-target"
                >
                  {link.label}
                </Link>
              ))}

              {/* Privacy Settings link - UHNI only */}
              {role === B2CRole.UHNI && (
                <Link
                  href="/privacy-settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-sans text-sm text-rose-800 hover:text-rose-600 transition-colors py-2 touch-target"
                >
                  Privacy
                </Link>
              )}

              {/* Role Badge for non-UHNI */}
              {roleBadge && (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color} mt-2`}>
                  {roleBadge.label}
                </div>
              )}

              {/* Context Switcher - UHNI only */}
              {role === B2CRole.UHNI && (
                <div className="pt-3 border-t border-sand-200">
                  <ContextSwitcher />
                </div>
              )}

              {/* Sign Out */}
              <div className="pt-3 border-t border-sand-200">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 font-sans text-sm text-sand-500 hover:text-rose-700 transition-colors py-2 touch-target"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/**
 * B2C Layout: Website-style with warm, inviting aesthetic
 * NOT a dashboard - narrative-driven luxury experience
 * Mobile-optimized with reduced padding on small screens
 */
export default function B2CLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand-50">
      <B2CNav />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8" aria-label="B2C content">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  )
}
