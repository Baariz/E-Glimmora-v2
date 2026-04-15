'use client';

/**
 * BudgetBreakdown — cost split for a package or journey.
 * Feature #2: flights / accommodation / activities / local transport.
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plane, Hotel, MapPinned, Car, Wallet } from 'lucide-react';
import type { BudgetBreakdown as BudgetData, BudgetLine } from '@/lib/types/entities';

interface BudgetBreakdownProps {
  budget: BudgetData;
  title?: string;
  className?: string;
}

const SECTION_META: Record<keyof Omit<BudgetData, 'currency' | 'total'>, { label: string; icon: React.ElementType }> = {
  flights: { label: 'Flights', icon: Plane },
  accommodation: { label: 'Accommodation', icon: Hotel },
  activities: { label: 'Activities', icon: MapPinned },
  local_transport: { label: 'Local Transport', icon: Car },
  other: { label: 'Other', icon: Wallet },
};

const fmt = (n: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

function sectionTotal(lines?: BudgetLine[]): number {
  if (!lines) return 0;
  return lines.reduce((s, l) => s + (l.amount || 0), 0);
}

export function BudgetBreakdown({ budget, title = 'Budget Breakdown', className = '' }: BudgetBreakdownProps) {
  const [open, setOpen] = useState<string | null>(null);

  const keys = (Object.keys(SECTION_META) as Array<keyof typeof SECTION_META>).filter(
    (k) => (budget[k] && budget[k]!.length > 0),
  );
  if (keys.length === 0) return null;

  const computedTotal = keys.reduce((s, k) => s + sectionTotal(budget[k]), 0);
  const total = typeof budget.total === 'number' ? budget.total : computedTotal;

  return (
    <div className={`bg-white border border-sand-200 rounded-xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-sand-100">
        <h3 className="font-serif text-lg text-rose-900">{title}</h3>
        <div className="text-right">
          <p className="text-[10px] font-sans uppercase tracking-wider text-sand-500">Estimated Total</p>
          <p className="font-serif text-xl text-rose-900">{fmt(total, budget.currency)}</p>
        </div>
      </div>

      <div className="divide-y divide-sand-100">
        {keys.map((key) => {
          const lines = budget[key]!;
          const meta = SECTION_META[key];
          const Icon = meta.icon;
          const subtotal = sectionTotal(lines);
          const pct = total > 0 ? (subtotal / total) * 100 : 0;
          const isOpen = open === key;
          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : key)}
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-sand-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-rose-700" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-sans text-sm text-slate-800 font-medium">{meta.label}</span>
                    <span className="font-sans text-sm text-slate-800">{fmt(subtotal, budget.currency)}</span>
                  </div>
                  <div className="mt-1.5 h-1 bg-sand-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-300 rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-sand-400" /> : <ChevronDown className="w-4 h-4 text-sand-400" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pl-16 space-y-1.5">
                  {lines.map((l, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-sans">
                      <div className="min-w-0">
                        <p className="text-slate-700">{l.label}</p>
                        {l.note && <p className="text-sand-500 text-[11px]">{l.note}</p>}
                      </div>
                      <span className="text-slate-700 font-medium">{fmt(l.amount, budget.currency)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
