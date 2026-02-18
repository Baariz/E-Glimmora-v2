'use client'

import { ReactNode, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

/**
 * Parallax component creates scroll-based motion effects
 * Elements move at a different speed than the scroll rate
 * Speed: 0 = no movement, 0.5 = half scroll speed, 1 = normal scroll speed
 */
export function Parallax({
  children,
  speed = 0.5,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Transform scroll progress to y position based on speed
  // Higher speed = more movement
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])

  // Skip parallax if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
