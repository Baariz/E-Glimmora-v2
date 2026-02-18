'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { cardLift } from '@/styles/variants'

export interface CardProps {
  children: React.ReactNode
  className?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  interactive?: boolean
  'aria-label'?: string
}

const baseCardStyles = [
  'bg-white',
  'rounded-lg',
  'shadow-md',
  'border border-sand-200',
  'overflow-hidden',
].join(' ')

export const Card = ({ children, className, header, footer, interactive = false, 'aria-label': ariaLabel }: CardProps) => {
  const prefersReducedMotion = useReducedMotion()

  const content = (
    <>
      {header && (
        <div className="border-b border-sand-200 px-6 py-4 bg-sand-50">
          <div className="font-serif text-lg font-medium text-rose-900">{header}</div>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="border-t border-sand-200 px-6 py-4 bg-sand-50">
          <div className="font-sans text-sm text-sand-700">{footer}</div>
        </div>
      )}
    </>
  )

  if (interactive) {
    return (
      <motion.div
        className={cn(baseCardStyles, className)}
        role="article"
        tabIndex={0}
        aria-label={ariaLabel}
        whileHover={!prefersReducedMotion ? cardLift : undefined}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <div className={cn(baseCardStyles, className)} role="region" aria-label={ariaLabel}>
      {content}
    </div>
  )
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader = ({ children, className }: CardHeaderProps) => {
  return (
    <div className={cn('border-b border-sand-200 px-6 py-4 bg-sand-50', className)}>
      <div className="font-serif text-lg font-medium text-rose-900">{children}</div>
    </div>
  )
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent = ({ children, className }: CardContentProps) => {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter = ({ children, className }: CardFooterProps) => {
  return (
    <div className={cn('border-t border-sand-200 px-6 py-4 bg-sand-50', className)}>
      <div className="font-sans text-sm text-sand-700">{children}</div>
    </div>
  )
}
