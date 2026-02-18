import React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils/cn'

export interface TabItem {
  value: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const Tabs = ({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  orientation = 'horizontal',
}: TabsProps) => {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue || items[0]?.value}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn('w-full', className)}
    >
      <TabsPrimitive.List
        className={cn(
          'flex',
          orientation === 'horizontal'
            ? 'border-b border-sand-200'
            : 'flex-col border-r border-sand-200 w-48'
        )}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn([
              'px-4 py-2',
              'font-sans text-sm font-medium',
              'text-sand-700',
              'border-b-2 border-transparent',
              'hover:text-rose-900 hover:bg-rose-50',
              'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-inset',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
              'transition-colors duration-200',
              'data-[state=active]:text-rose-900 data-[state=active]:border-rose-500',
              orientation === 'vertical' &&
                'border-b-0 border-r-2 text-left justify-start',
            ])}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content
          key={item.value}
          value={item.value}
          className={cn([
            'px-4 py-4',
            'font-sans text-sm text-sand-700',
            'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-inset',
            'data-[state=active]:animate-fade-in',
          ])}
        >
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
