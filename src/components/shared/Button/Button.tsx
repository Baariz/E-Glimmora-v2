'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { buttonHover, buttonTap, loadingPulse } from '@/styles/variants'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  disabled?: boolean
  loading?: boolean
}

const variantStyles = {
  primary: 'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700 focus:ring-rose-500',
  secondary: 'bg-sand-500 text-white hover:bg-sand-600 active:bg-sand-700 focus:ring-sand-500',
  ghost: 'bg-transparent text-rose-700 hover:bg-rose-50 active:bg-rose-100 focus:ring-rose-500',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
  outline:
    'bg-transparent border border-rose-300 text-rose-700 hover:bg-rose-50 active:bg-rose-100 focus:ring-rose-500',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm min-h-[44px]',
  md: 'px-4 py-2 text-base min-h-[44px]',
  lg: 'px-6 py-3 text-lg min-h-[44px]',
}

const baseStyles = [
  'inline-flex items-center justify-center',
  'font-sans font-medium',
  'rounded-md',
  'transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  'min-w-[44px]',
].join(' ')

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, disabled, loading, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion()
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        whileHover={!isDisabled && !prefersReducedMotion ? buttonHover : undefined}
        whileTap={!isDisabled && !prefersReducedMotion ? buttonTap : undefined}
        animate={loading && !prefersReducedMotion ? loadingPulse : undefined}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
