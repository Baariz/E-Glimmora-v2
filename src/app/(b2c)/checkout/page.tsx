'use client';

/**
 * Unified Checkout — Feature #4 (UI only)
 * Single payment surface that will eventually settle all pending bookings
 * through one PSP. Backend integration pending.
 */

import Link from 'next/link';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 space-y-8">
      <Link href="/bookings" className="inline-flex items-center gap-1 text-xs font-sans uppercase tracking-[3px] text-sand-500 hover:text-sand-700 transition-colors">
        <ArrowLeft className="w-3 h-3" /> Back to bookings
      </Link>

      <header>
        <p className="text-[10px] font-sans uppercase tracking-[4px] text-rose-400 mb-2">Checkout</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-rose-900">One payment, everything.</h1>
        <p className="font-sans text-sand-600 text-sm mt-2">
          Flights, stays, activities, and transport settled together — on your preferred method of payment.
        </p>
      </header>

      <section className="bg-white border border-sand-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-[10px] font-sans uppercase tracking-wider text-sand-500 mb-2">Summary</p>
          <div className="flex items-baseline justify-between">
            <span className="font-sans text-sand-600 text-sm">Total due</span>
            <span className="font-serif text-3xl text-rose-900">—</span>
          </div>
          <p className="text-xs font-sans text-sand-500 mt-1">
            Reservations API is not yet wired. Pending payment amounts will appear here.
          </p>
        </div>

        <div className="border-t border-sand-100 pt-5 space-y-4">
          <p className="text-[10px] font-sans uppercase tracking-wider text-sand-500">Payment method</p>
          <div className="p-4 rounded-xl border border-dashed border-sand-300 bg-sand-50/50 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-sand-500" />
            <div className="flex-1">
              <p className="font-sans text-sm text-slate-800">Card on file</p>
              <p className="text-xs font-sans text-sand-500">Integration with Stripe / Adyen pending.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-sand-100 pt-5 flex items-center justify-between gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-sans text-sand-500">
            <Lock className="w-3 h-3" /> Secure · PCI-compliant processor (TBD)
          </span>
          <button
            type="button"
            disabled
            className="px-6 py-3 rounded-full bg-rose-900/60 text-white text-sm font-sans font-medium cursor-not-allowed"
          >
            Pay all (pending integration)
          </button>
        </div>
      </section>
    </div>
  );
}
