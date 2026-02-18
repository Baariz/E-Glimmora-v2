'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { Button } from '@/components/shared/Button/Button'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Privacy Charter', href: '/privacy' },
]

export function MarketingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()

  // Detect scroll position for glassmorphism effect
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 80)
  })

  const isActive = (href: string) => pathname === href

  // Close mobile menu when pathname changes
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: isScrolled
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(255, 255, 255, 0)',
          borderBottomColor: isScrolled
            ? 'rgba(196, 170, 130, 0.2)'
            : 'rgba(196, 170, 130, 0)',
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.5,
          ease: [0, 0, 0.2, 1],
        }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'border-b',
          isScrolled && 'backdrop-blur-xl'
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-16">
          <div className="flex h-20 items-center justify-between">
            {/* Brand wordmark */}
            <Link
              href="/"
              className={cn(
                'font-serif text-sm uppercase tracking-widest transition-colors duration-300',
                isScrolled ? 'text-rose-900' : 'text-white'
              )}
            >
              Élan Glimmora
            </Link>

            {/* Desktop navigation - center */}
            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative font-sans text-xs uppercase tracking-[0.2em] transition-opacity duration-300',
                    isScrolled ? 'text-rose-900' : 'text-white',
                    isActive(link.href) ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className={cn(
                        'absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                        isScrolled ? 'bg-rose-900' : 'bg-white'
                      )}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/invite/login"
                className={cn(
                  'font-sans text-xs uppercase tracking-[0.2em] transition-opacity duration-300',
                  isScrolled ? 'text-rose-900' : 'text-white',
                  'opacity-70 hover:opacity-100'
                )}
              >
                Sign In
              </Link>
              <Link href="/invite">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'border transition-all duration-300',
                    isScrolled
                      ? 'border-rose-200 text-rose-900 hover:border-rose-300 hover:bg-rose-50'
                      : 'border-white/30 text-white hover:border-white/50 hover:bg-white/10'
                  )}
                >
                  Request Access
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'md:hidden p-2 transition-colors duration-300 touch-target',
                isScrolled ? 'text-rose-900' : 'text-white'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="fixed inset-0 z-40 bg-white md:hidden"
        >
          <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
            {/* Mobile nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                  'font-sans text-2xl uppercase tracking-[0.2em] text-rose-900 transition-opacity duration-200 touch-target',
                  isActive(link.href) ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTAs */}
            <Link
              href="/invite/login"
              onClick={handleLinkClick}
              className="font-sans text-2xl uppercase tracking-[0.2em] text-rose-900 opacity-70 hover:opacity-100 transition-opacity duration-200 touch-target"
            >
              Sign In
            </Link>
            <Link href="/invite" onClick={handleLinkClick} className="mt-4">
              <Button variant="primary" size="lg">
                Request Access
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </>
  )
}
