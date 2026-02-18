'use client'

import { ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { fadeUp } from '@/styles/variants/scroll-reveal'

interface ScrollRevealProps {
  children: ReactNode
  variant?: typeof fadeUp
  delay?: number
  once?: boolean
  amount?: number
  className?: string
}

/**
 * ScrollReveal component triggers animations when element enters viewport
 * Uses useInView hook to detect viewport intersection
 */
export function ScrollReveal({
  children,
  variant = fadeUp,
  delay = 0,
  once = true,
  amount = 0.3,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })
  const prefersReducedMotion = useReducedMotion()

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? 'visible' : 'initial'}
      variants={variant}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
