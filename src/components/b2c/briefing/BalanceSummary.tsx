'use client';

/**
 * Balance Summary (BREF-02)
 * Narrative-style emotional balance display with radar chart.
 * Shows emotional drivers visually and as a literary narrative.
 * Sand/rose palette.
 */

import { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import type { IntentProfile, EmotionalDrivers } from '@/lib/types/entities';

interface BalanceSummaryProps {
  intentProfile: IntentProfile | null;
  isLoading?: boolean;
}

/**
 * Generate a narrative sentence from the top 2-3 emotional drivers.
 */
function generateNarrative(drivers: EmotionalDrivers): string {
  const entries = Object.entries(drivers) as [string, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const labels: Record<string, string> = {
    security: 'Security',
    adventure: 'Adventure',
    legacy: 'Legacy',
    recognition: 'Recognition',
    autonomy: 'Autonomy',
  };

  const top = sorted.slice(0, 2).map(([key]) => labels[key]);
  const third = sorted[2] ? labels[sorted[2][0]] : null;

  if (third) {
    return `Your strongest drivers are ${top[0]} and ${top[1]}, with ${third} emerging as a meaningful undercurrent -- suggesting a focus on lasting impact guided by personal conviction.`;
  }

  return `Your strongest drivers are ${top[0]} and ${top[1]}, suggesting a focus on lasting impact and the freedom to shape your path on your own terms.`;
}

export function BalanceSummary({ intentProfile, isLoading }: BalanceSummaryProps) {
  const defaultDrivers: EmotionalDrivers = {
    security: 70,
    adventure: 40,
    legacy: 80,
    recognition: 30,
    autonomy: 55,
  };

  const drivers = intentProfile?.emotionalDrivers ?? defaultDrivers;

  const chartData = useMemo(
    () => [
      { driver: 'Security', value: drivers.security },
      { driver: 'Adventure', value: drivers.adventure },
      { driver: 'Legacy', value: drivers.legacy },
      { driver: 'Recognition', value: drivers.recognition },
      { driver: 'Autonomy', value: drivers.autonomy },
    ],
    [drivers]
  );

  const narrative = useMemo(() => generateNarrative(drivers), [drivers]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 w-40 bg-sand-200 rounded" />
        <div className="h-48 bg-sand-200 rounded-lg" />
        <div className="h-3 w-full bg-sand-200 rounded" />
        <div className="h-3 w-3/4 bg-sand-200 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow p-8">
      <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-2">
        Emotional Balance
      </p>
      <h3 className="font-serif text-lg text-stone-900 mb-6">Your inner compass</h3>

      {/* Radar chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={chartData} outerRadius="75%">
            <PolarGrid stroke="#e7e5e4" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="driver"
              tick={{ fill: '#78716c', fontSize: 11, fontFamily: 'inherit' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Emotional DNA"
              dataKey="value"
              stroke="#9f1239"
              fill="#9f1239"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Narrative */}
      <div className="border-l-2 border-rose-200 pl-4">
        <p className="text-sm font-sans text-stone-500 leading-relaxed italic">
          &ldquo;{narrative}&rdquo;
        </p>
      </div>
    </div>
  );
}
