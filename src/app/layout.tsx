import type { Metadata } from 'next'
import { millerDisplay, avenirLT } from './fonts'
import { AuthProvider } from '@/components/providers/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Élan Glimmora',
  description: 'Sovereign lifestyle intelligence for Ultra High Net Worth Individuals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${millerDisplay.variable} ${avenirLT.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
