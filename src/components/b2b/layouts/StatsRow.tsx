/**
 * StatsRow Component
 * Responsive grid of stat cards for dashboard metrics
 */

import { Card } from '@/components/shared/Card';

export interface StatCard {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  colorClass?: string; // e.g., 'from-white to-rose-50'
}

interface StatsRowProps {
  stats: StatCard[];
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${stat.colorClass || 'from-white to-slate-50'}`}
        >
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-600">{stat.label}</p>
            <p className="text-3xl font-serif text-slate-900">{stat.value}</p>
            {stat.subtitle && (
              <p className="text-xs font-sans text-slate-500">{stat.subtitle}</p>
            )}
            {stat.trend && (
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs font-sans ${
                    stat.trend.positive ? 'text-teal-600' : 'text-rose-600'
                  }`}
                >
                  {stat.trend.positive ? '↑' : '↓'} {stat.trend.value}
                </span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
