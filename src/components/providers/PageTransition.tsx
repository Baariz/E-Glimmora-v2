'use client'

import { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { fadeSlide } from '@/styles/variants/page-transitions'

interface PageTransitionProps {
  children: ReactNode
  variant?: typeof fadeSlide
}

/**
 * PageTransition provider wraps route children with AnimatePresence
 * Enables smooth page transitions when navigating between routes
 * CRITICAL: Uses pathname as key for exit animations to work
 */
export function PageTransition({
  children,
  variant = fadeSlide,
}: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variant}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
