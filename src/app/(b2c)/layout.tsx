'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageTransition } from '@/components/providers/PageTransition'
import { ContextSwitcher } from '@/components/auth/ContextSwitcher'
import { AIChatWidget } from '@/components/b2c/chat/AIChatWidget'
import { useAuth } from '@/lib/hooks/useAuth'
import { getNavLinksForRole, getRoleBadge } from '@/lib/rbac/b2c-role-filters'
import { B2CRole } from '@/lib/types/roles'
import { cn } from '@/lib/utils/cn'

/** Routes where the nav is hidden (immersive wizard flows) */
const NAV_HIDDEN_ROUTES = ['/intent/wizard'];

/**
 * B2C Client Portal Navigation
 * Transparent → solid on scroll. Fixed over hero content.
 * Role-aware navigation using B2C role filters.
 * Mobile-responsive with hamburger menu.
 */
function B2CNav() {
  const { currentRole, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const role = currentRole as B2CRole || B2CRole.UHNI;
  const navLinks = getNavLinksForRole(role);
  const roleBadge = getRoleBadge(role);

  const linkColor = scrolled
    ? 'text-rose-800 hover:text-rose-600'
    : 'text-white/90 hover:text-white';

  const iconColor = scrolled ? 'text-rose-900' : 'text-white';

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-sand-200 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      )}
      aria-label="B2C navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="touch-target flex-shrink-0">
            <Image
              src="/Logo/elan-glimmora.png"
              alt="Élan Glimmora"
              width={140}
              height={40}
              className={cn(
                'h-9 w-auto transition-all duration-300',
                !scrolled && 'brightness-0 invert'
              )}
              priority
            />
          </Link>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('font-sans text-sm transition-colors', linkColor)}
              >
                {link.label}
              </Link>
            ))}

            {role === B2CRole.UHNI && (
              <Link
                href="/privacy-settings"
                className={cn('font-sans text-sm transition-colors', linkColor)}
              >
                Privacy
              </Link>
            )}

            {roleBadge && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                {roleBadge.label}
              </div>
            )}

            {role === B2CRole.UHNI && <ContextSwitcher />}

            {/* User menu */}
            <div className={cn(
              'ml-4 pl-4 border-l flex items-center gap-3 transition-colors',
              scrolled ? 'border-sand-300' : 'border-white/20'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                scrolled ? 'bg-rose-100' : 'bg-white/15'
              )}>
                <span className={cn(
                  'text-xs font-sans transition-colors',
                  scrolled ? 'text-rose-700' : 'text-white'
                )}>
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <button
                onClick={logout}
                className={cn(
                  'flex items-center gap-1.5 font-sans text-sm transition-colors',
                  scrolled ? 'text-sand-500 hover:text-rose-700' : 'text-white/70 hover:text-white'
                )}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn('md:hidden p-2 touch-target transition-colors', iconColor)}
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

              {role === B2CRole.UHNI && (
                <Link
                  href="/privacy-settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-sans text-sm text-rose-800 hover:text-rose-600 transition-colors py-2 touch-target"
                >
                  Privacy
                </Link>
              )}

              {roleBadge && (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color} mt-2`}>
                  {roleBadge.label}
                </div>
              )}

              {role === B2CRole.UHNI && (
                <div className="pt-3 border-t border-sand-200">
                  <ContextSwitcher />
                </div>
              )}

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
 * B2C Layout: Luxury narrative-driven experience.
 * Fixed nav overlays content; main has top padding to compensate.
 * Nav is hidden on immersive wizard flows for distraction-free UX.
 */
export default function B2CLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = NAV_HIDDEN_ROUTES.some((r) => pathname?.startsWith(r));

  return (
    <div className="min-h-screen bg-sand-50 overflow-x-hidden">
      {!hideNav && <B2CNav />}
      <main
        className={cn(
          'aria-label-b2c',
          hideNav
            ? ''
            : 'max-w-7xl mx-auto px-4 md:px-6 pt-[5.5rem] md:pt-24 pb-6 md:pb-8'
        )}
        aria-label="B2C content"
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <AIChatWidget />
    </div>
  )
}
