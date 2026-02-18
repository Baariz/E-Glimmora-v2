'use client'

/**
 * Reusable scroll progress hook for parallax and scroll-linked effects
 * Respects prefers-reduced-motion by returning static values
 */

import { useRef, RefObject } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

type ScrollOffset = 'start start' | 'start end' | 'end start' | 'end end'

interface UseScrollProgressOptions {
  offset?: [ScrollOffset, ScrollOffset]
  yRange?: [number, number]
  opacityRange?: [number, number]
}

interface UseScrollProgressReturn {
  scrollYProgress: MotionValue<number>
  y: MotionValue<number>
  opacity: MotionValue<number>
  ref: RefObject<HTMLElement | null>
}

export function useScrollProgress(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn {
  const {
    offset = ['start end', 'end start'] as [ScrollOffset, ScrollOffset],
    yRange = [0, -100],
    opacityRange = [1, 1],
  } = options

  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  // Return static values if reduced motion is preferred
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : yRange
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : opacityRange
  )

  return {
    scrollYProgress,
    y,
    opacity,
    ref,
  }
}
