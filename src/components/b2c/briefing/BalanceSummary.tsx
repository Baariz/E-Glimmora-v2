'use client';

/**
 * Balance Summary (BREF-02)
 * Light luxury radar card with warm rose/amber accents.
 * Refined narrative and balance score.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
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

function generateNarrative(drivers: EmotionalDrivers): string {
  const entries = Object.entries(drivers) as [string, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const labels: Record<string, string> = {
    security: 'Security', adventure: 'Adventure', legacy: 'Legacy',
    recognition: 'Recognition', autonomy: 'Autonomy',
  };
  const top = sorted.slice(0, 2).map(([key]) => labels[key]);
  const third = sorted[2] ? labels[sorted[2][0]] : null;

  if (third) {
    return `Driven by ${top[0]} and ${top[1]}, with ${third} as an undercurrent — lasting impact guided by personal conviction.`;
  }
  return `Driven by ${top[0]} and ${top[1]} — lasting impact and the freedom to shape your own path.`;
}

export function BalanceSummary({ intentProfile, isLoading }: BalanceSummaryProps) {
  const defaultDrivers: EmotionalDrivers = {
    security: 70, adventure: 40, legacy: 80, recognition: 30, autonomy: 55,
  };
  const drivers = intentProfile?.emotionalDrivers ?? defaultDrivers;

  const chartData = useMemo(() => [
    { driver: 'Security', value: drivers.security },
    { driver: 'Adventure', value: drivers.adventure },
    { driver: 'Legacy', value: drivers.legacy },
    { driver: 'Recognition', value: drivers.recognition },
    { driver: 'Autonomy', value: drivers.autonomy },
  ], [drivers]);

  const narrative = useMemo(() => generateNarrative(drivers), [drivers]);

  const values = Object.values(drivers);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  const balanceScore = Math.round(100 - Math.sqrt(variance));

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white border border-sand-200/60 p-10 animate-pulse h-full min-h-[420px] shadow-sm">
        <div className="h-3 w-24 bg-sand-200 rounded mb-10" />
        <div className="h-44 bg-sand-100 rounded-lg mb-6" />
        <div className="h-3 w-full bg-sand-100 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-sand-200/60 overflow-hidden h-full flex flex-col shadow-sm">
      <div className="p-8 sm:p-10 lg:p-12 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <p className="text-rose-400 text-[10px] font-sans font-medium uppercase tracking-[5px]">
            Inner Compass
          </p>
          <div className="text-right">
            <span className="font-serif text-4xl text-rose-300 leading-none">{balanceScore}</span>
            <p className="text-stone-300 text-[9px] font-sans uppercase tracking-[3px] mt-1">Balance</p>
          </div>
        </div>

        {/* Radar chart */}
        <div className="flex-1 min-h-0 flex items-center justify-center -mx-4">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={chartData} outerRadius="70%">
              <PolarGrid stroke="rgba(214,204,194,0.3)" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="driver"
                tick={{ fill: 'rgba(120,113,108,0.6)', fontSize: 9, fontFamily: 'inherit' }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Emotional DNA"
                dataKey="value"
                stroke="rgba(244,63,94,0.5)"
                fill="rgba(244,63,94,0.08)"
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Narrative */}
        <motion.div
          className="mt-auto pt-6 border-t border-sand-200/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <p className="text-stone-400 text-[12px] font-sans leading-[1.8] tracking-wide italic">
            &ldquo;{narrative}&rdquo;
          </p>
        </motion.div>
      </div>
    </div>
  );
}
