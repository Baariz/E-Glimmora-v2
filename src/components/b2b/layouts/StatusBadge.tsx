/**
 * StatusBadge Component
 * Generic status badge with color coding
 */

interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>; // status -> tailwind classes
  variant?: 'teal' | 'amber' | 'red' | 'slate' | 'purple' | 'blue';
  size?: 'sm' | 'md';
}

const DEFAULT_COLOR_MAP: Record<string, string> = {
  Active: 'bg-teal-100 text-teal-800',
  Pending: 'bg-gold-100 text-gold-800',
  Onboarding: 'bg-blue-100 text-blue-800',
  Archived: 'bg-slate-100 text-slate-600',
  Draft: 'bg-slate-100 text-slate-600',
  Approved: 'bg-olive-100 text-olive-800',
  Executed: 'bg-emerald-100 text-emerald-800',
  Expired: 'bg-rose-100 text-rose-800',
  Low: 'bg-olive-100 text-olive-800',
  Medium: 'bg-gold-100 text-gold-800',
  High: 'bg-rose-100 text-rose-800',
  Critical: 'bg-red-100 text-red-800',
  None: 'bg-slate-100 text-slate-500',
};

const VARIANT_COLORS: Record<string, string> = {
  teal: 'bg-teal-100 text-teal-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  slate: 'bg-slate-100 text-slate-600',
  purple: 'bg-purple-100 text-purple-800',
  blue: 'bg-blue-100 text-blue-800',
};

export function StatusBadge({ status, colorMap, variant, size = 'sm' }: StatusBadgeProps) {
  let colorClass: string;

  if (variant) {
    colorClass = VARIANT_COLORS[variant] || 'bg-slate-100 text-slate-600';
  } else {
    const colors = colorMap || DEFAULT_COLOR_MAP;
    colorClass = colors[status] || 'bg-slate-100 text-slate-600';
  }

  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center font-sans rounded-full ${colorClass} ${sizeClass}`}
    >
      {status}
    </span>
  );
}
