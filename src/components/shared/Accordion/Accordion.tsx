import React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils/cn'
import { ChevronDown } from 'lucide-react'

export interface AccordionItemData {
  value: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItemData[]
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  className?: string
  collapsible?: boolean
}

export const Accordion = ({
  items,
  type = 'single',
  defaultValue,
  className,
  collapsible = true,
}: AccordionProps) => {
  return (
    <AccordionPrimitive.Root
      type={type as any}
      defaultValue={defaultValue as any}
      collapsible={type === 'single' ? collapsible : undefined}
      className={cn('w-full', className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.value}
          value={item.value}
          className="border-b border-sand-200 last:border-b-0"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger
              className={cn([
                'flex items-center justify-between w-full',
                'px-4 py-4',
                'font-serif text-base font-medium text-rose-900',
                'text-left',
                'hover:bg-sand-50',
                'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-inset',
                'transition-colors duration-200',
                'group',
              ])}
            >
              <span>{item.title}</span>
              <ChevronDown
                size={20}
                className={cn([
                  'text-sand-600',
                  'transition-transform duration-300',
                  'group-data-[state=open]:rotate-180',
                ])}
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content
            className={cn([
              'overflow-hidden',
              'data-[state=open]:animate-slide-down',
              'data-[state=closed]:animate-slide-up',
            ])}
          >
            <div className="px-4 py-4 font-sans text-sm text-sand-700">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
