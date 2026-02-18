import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

export interface ModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export const Modal = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn([
            'fixed inset-0 bg-black/50 backdrop-blur-sm',
            'data-[state=open]:animate-fade-in',
            'data-[state=closed]:animate-fade-out',
          ])}
        />
        <Dialog.Content
          className={cn(
            [
              'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
              'w-full max-w-lg max-h-[85vh]',
              'bg-white rounded-lg shadow-xl',
              'p-6',
              'focus:outline-none focus:ring-2 focus:ring-rose-500',
              'data-[state=open]:animate-slide-up',
              'data-[state=closed]:animate-fade-out',
            ],
            className
          )}
        >
          {(title || description) && (
            <div className="mb-4">
              {title && (
                <Dialog.Title className="font-serif text-2xl font-medium text-rose-900 mb-2">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="font-sans text-sm text-sand-700">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}
          <div className="overflow-y-auto max-h-[calc(85vh-8rem)]">{children}</div>
          {showCloseButton && (
            <Dialog.Close
              className={cn([
                'absolute right-4 top-4',
                'inline-flex items-center justify-center',
                'w-8 h-8 rounded-md',
                'text-sand-500 hover:text-rose-900 hover:bg-rose-50',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-rose-500',
              ])}
              aria-label="Close"
            >
              <X size={20} />
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
