import React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils/cn'
import { Check, ChevronRight } from 'lucide-react'

export interface DropdownItemProps {
  label: string
  value: string
  disabled?: boolean
  icon?: React.ReactNode
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItemProps[]
  onSelect?: (value: string) => void
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}

export const Dropdown = ({
  trigger,
  items,
  onSelect,
  align = 'start',
  sideOffset = 4,
  className,
}: DropdownProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(
            [
              'min-w-[12rem]',
              'bg-white rounded-lg shadow-lg',
              'border border-sand-200',
              'p-1',
              'animate-slide-down',
              'z-50',
            ],
            className
          )}
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.value}
              disabled={item.disabled}
              onSelect={() => onSelect?.(item.value)}
              className={cn([
                'flex items-center gap-2',
                'px-3 py-2 rounded-md',
                'font-sans text-sm text-rose-900',
                'cursor-pointer outline-none select-none',
                'hover:bg-rose-50 focus:bg-rose-50',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                'transition-colors duration-150',
              ])}
            >
              {item.icon && <span className="text-sand-600">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export interface DropdownCheckboxItemProps extends DropdownItemProps {
  checked?: boolean
}

export interface DropdownWithCheckboxProps extends Omit<DropdownProps, 'items'> {
  items: DropdownCheckboxItemProps[]
  onCheckedChange?: (value: string, checked: boolean) => void
}

export const DropdownWithCheckbox = ({
  trigger,
  items,
  onCheckedChange,
  align = 'start',
  sideOffset = 4,
  className,
}: DropdownWithCheckboxProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(
            [
              'min-w-[12rem]',
              'bg-white rounded-lg shadow-lg',
              'border border-sand-200',
              'p-1',
              'animate-slide-down',
              'z-50',
            ],
            className
          )}
        >
          {items.map((item) => (
            <DropdownMenu.CheckboxItem
              key={item.value}
              checked={item.checked}
              disabled={item.disabled}
              onCheckedChange={(checked) => onCheckedChange?.(item.value, checked)}
              className={cn([
                'flex items-center gap-2',
                'px-3 py-2 rounded-md',
                'font-sans text-sm text-rose-900',
                'cursor-pointer outline-none select-none',
                'hover:bg-rose-50 focus:bg-rose-50',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                'transition-colors duration-150',
              ])}
            >
              <DropdownMenu.ItemIndicator>
                <Check size={16} className="text-rose-500" />
              </DropdownMenu.ItemIndicator>
              {item.icon && <span className="text-sand-600">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
