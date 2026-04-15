'use client';

/**
 * Bookings Hub — Feature #3 + #4 (UI only)
 * Unified view of flights, stays, activities, local transport.
 * Currently renders an empty/placeholder state until the reservations API is wired.
 */

import { useState } from 'react';
import Link from 'next/link';
import { Plane, Hotel, MapPinned, Car, CreditCard, Plus, Inbox } from 'lucide-react';
import type { Booking, BookingKind, BookingStatus } from '@/lib/types/entities';

const TABS: Array<{ key: BookingKind | 'all'; label: string; icon: React.ElementType }> = [
  { key: 'all', label: 'All', icon: Inbox },
  { key: 'flight', label: 'Flights', icon: Plane },
  { key: 'stay', label: 'Stays', icon: Hotel },
  { key: 'activity', label: 'Activities', icon: MapPinned },
  { key: 'transport', label: 'Transport', icon: Car },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  OnHold: 'bg-sand-100 text-sand-700 border-sand-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const KIND_META: Record<BookingKind, { icon: React.ElementType; label: string }> = {
  flight: { icon: Plane, label: 'Flight' },
  stay: { icon: Hotel, label: 'Stay' },
  activity: { icon: MapPinned, label: 'Activity' },
  transport: { icon: Car, label: 'Transport' },
};

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
const fmtMoney = (amt?: number, cur?: string) =>
  typeof amt === 'number' && cur
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(amt)
    : '—';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingKind | 'all'>('all');
  // Reservations API is not yet wired — render empty state.
  const bookings: Booking[] = [];

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.kind === activeTab);
  const totalDue = filtered
    .filter((b) => b.status === 'Pending')
    .reduce((s, b) => s + (b.amount ?? 0), 0);
  const currency = filtered.find((b) => b.currency)?.currency ?? 'USD';

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 space-y-8">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-sans uppercase tracking-[4px] text-rose-400 mb-2">Bookings</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-rose-900">Your reservations</h1>
          <p className="font-sans text-sand-600 text-sm mt-2">
            Flights, stays, activities, and transport — managed in one place.
          </p>
        </div>
        {totalDue > 0 && (
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-900 text-white text-sm font-sans font-medium hover:bg-rose-800 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Pay all ({fmtMoney(totalDue, currency)})
          </Link>
        )}
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-sand-200 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.key === activeTab;
          const count = t.key === 'all' ? bookings.length : bookings.filter((b) => b.kind === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-3 text-xs font-sans uppercase tracking-[3px] flex items-center gap-2 border-b-2 -mb-px transition-colors ${
                active
                  ? 'border-rose-900 text-rose-900'
                  : 'border-transparent text-sand-500 hover:text-sand-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
              {count > 0 && (
                <span className="ml-1 text-[10px] bg-sand-100 text-sand-700 rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-sand-200 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="font-serif text-xl text-rose-900 mb-2">
            {activeTab === 'all' ? 'No reservations yet' : `No ${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} yet`}
          </h2>
          <p className="font-sans text-sand-600 text-sm max-w-md mx-auto mb-6">
            Once you book a flight, stay, activity, or transfer from a curated journey, it will appear here —
            fully managed and paid for in one place.
          </p>
          <Link
            href="/journeys"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-900 text-white text-sm font-sans font-medium hover:bg-rose-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Browse journeys
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const Icon = KIND_META[b.kind].icon;
            return (
              <div
                key={b.id}
                className="bg-white border border-sand-200 rounded-xl p-5 flex flex-wrap items-center gap-4 hover:border-sand-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-rose-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-sans text-sm font-semibold text-slate-800">{b.title}</h3>
                    <span className="text-[10px] font-sans uppercase tracking-wider text-sand-500">{KIND_META[b.kind].label}</span>
                  </div>
                  <p className="text-xs font-sans text-sand-500 mt-0.5">
                    {b.provider ? `${b.provider} · ` : ''}
                    {fmtDate(b.start_at)} {b.end_at ? `– ${fmtDate(b.end_at)}` : ''}
                    {b.reference ? ` · Ref ${b.reference}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm text-slate-800 font-medium">{fmtMoney(b.amount, b.currency)}</p>
                  <span className={`mt-1 inline-block text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_STYLES[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
