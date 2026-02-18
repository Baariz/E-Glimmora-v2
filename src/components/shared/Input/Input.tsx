import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
  containerClassName?: string
}

const baseInputStyles = [
  'w-full',
  'px-4 py-2',
  'font-sans text-base',
  'bg-white',
  'border border-sand-300',
  'rounded-md',
  'transition-colors duration-200',
  'placeholder:text-sand-400',
  'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
  'disabled:bg-sand-50 disabled:text-sand-500 disabled:cursor-not-allowed',
].join(' ')

const errorInputStyles = 'border-red-500 focus:ring-red-500'

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, containerClassName, disabled, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            className={cn(
              'font-serif text-sm font-medium text-rose-900',
              disabled && 'text-sand-500'
            )}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(baseInputStyles, error && errorInputStyles, className)}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          aria-required={props.required}
          {...props}
        />
        {error && (
          <span
            id={`${props.id}-error`}
            className="font-sans text-sm text-red-600"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
