'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { PageTransition } from '@/components/providers/PageTransition'
import { ContextSwitcher } from '@/components/auth/ContextSwitcher'
import { AdminRoleGuard } from '@/components/admin/AdminRoleGuard'

/**
 * Admin Top Navigation
 * Functional, operational admin panel navigation
 */
function AdminNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/invites', label: 'Invites' },
    { href: '/members', label: 'Members' },
    { href: '/institutions', label: 'Institutions' },
    { href: '/audit', label: 'Audit' },
    { href: '/system', label: 'System' },
    { href: '/platform-revenue', label: 'Revenue' },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-sand-200 shadow-sm" aria-label="Admin navigation">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link
            href="/"
            className="font-serif text-lg font-medium text-rose-900 hover:text-rose-700 transition-colors"
          >
            Élan Admin
          </Link>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm transition-colors border-b-2 ${
                  isActive(link.href)
                    ? 'text-rose-900 font-medium border-rose-700'
                    : 'text-sand-600 border-transparent hover:text-rose-900 hover:border-sand-300'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Context Switcher */}
            <ContextSwitcher />

            {/* User/logout */}
            <div className="ml-4 pl-4 border-l border-sand-200 flex items-center gap-3">
              <span className="text-sm font-sans text-sand-600">Admin User</span>
              <button
                onClick={() => signOut()}
                className="text-sm font-sans text-sand-500 hover:text-rose-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-sand-600 hover:text-rose-900 touch-target"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sand-200 bg-white">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-sans text-sm py-2 touch-target ${
                  isActive(link.href)
                    ? 'text-rose-900 font-medium'
                    : 'text-sand-600 hover:text-rose-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-sand-200">
              <button
                onClick={() => signOut()}
                className="text-sm font-sans text-sand-500 hover:text-rose-900 touch-target"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

/**
 * Admin Layout: Functional operations panel
 * Clean, operational, not luxury-focused
 * Mobile-optimized with responsive padding
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRoleGuard>
      <div className="min-h-screen bg-sand-50">
        <AdminNav />
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6" aria-label="Admin content">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </AdminRoleGuard>
  )
}
