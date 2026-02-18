import { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'

export const metadata: Metadata = {
  title: {
    template: '%s | Élan Glimmora',
    default: 'Élan Glimmora',
  },
  description: 'Sovereign lifestyle intelligence for Ultra High Net Worth Individuals',
}

/**
 * Marketing layout: Editorial luxury experience with scroll-aware navigation
 * Fixed navigation transforms from transparent to glassmorphism on scroll
 * Full-width canvas for narrative-driven editorial content
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="w-full pt-0">{children}</main>
      <MarketingFooter />
    </div>
  )
}
