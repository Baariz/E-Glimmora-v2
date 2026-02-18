import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@/lib/utils/cn'
import { Check, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  error?: string
}

export const Select = ({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select an option',
  disabled,
  className,
  label,
  error,
}: SelectProps) => {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className={cn('font-serif text-sm font-medium text-rose-900', disabled && 'text-sand-500')}>
          {label}
        </label>
      )}
      <SelectPrimitive.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          className={cn([
            'flex items-center justify-between w-full',
            'px-4 py-2',
            'font-sans text-base',
            'bg-white',
            'border border-sand-300',
            'rounded-md',
            'text-left',
            'hover:bg-sand-50',
            'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
            'disabled:bg-sand-50 disabled:text-sand-500 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            error && 'border-red-500 focus:ring-red-500',
          ])}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown size={20} className="text-sand-600" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn([
              'overflow-hidden',
              'bg-white rounded-lg shadow-lg',
              'border border-sand-200',
              'z-50',
            ])}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn([
                    'flex items-center gap-2',
                    'px-3 py-2 rounded-md',
                    'font-sans text-sm text-rose-900',
                    'cursor-pointer outline-none select-none',
                    'hover:bg-rose-50 focus:bg-rose-50',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                    'transition-colors duration-150',
                    'data-[state=checked]:bg-rose-50',
                  ])}
                >
                  <SelectPrimitive.ItemIndicator>
                    <Check size={16} className="text-rose-500" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && (
        <span className="font-sans text-sm text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
