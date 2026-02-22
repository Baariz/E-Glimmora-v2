import Link from 'next/link'
import Image from 'next/image'

export function MarketingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-rose-800/30 bg-rose-950 text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <Image
              src="/Logo/elan-glimmora.png"
              alt="Élan Glimmora"
              width={160}
              height={44}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="font-serif text-sm italic text-white/60">
              Sovereign Lifestyle Intelligence
            </p>
          </div>

          {/* Links column */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs uppercase tracking-wider text-white/50">
              Navigation
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/philosophy"
                className="font-sans text-xs uppercase tracking-wider text-white/70 transition-colors hover:text-white"
              >
                Philosophy
              </Link>
              <Link
                href="/privacy"
                className="font-sans text-xs uppercase tracking-wider text-white/70 transition-colors hover:text-white"
              >
                Privacy Charter
              </Link>
              <Link
                href="/invite"
                className="font-sans text-xs uppercase tracking-wider text-white/70 transition-colors hover:text-white"
              >
                Request Access
              </Link>
            </nav>
          </div>

          {/* Legal column */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs uppercase tracking-wider text-white/50">
              Membership
            </h3>
            <p className="font-sans text-xs leading-relaxed text-white/60">
              By invitation only. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-rose-800/20 pt-8">
          <p className="font-sans text-xs tracking-wider text-white/50">
            &copy; {currentYear} Élan Glimmora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
