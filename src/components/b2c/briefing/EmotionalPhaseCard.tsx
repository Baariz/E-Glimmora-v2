'use client';

/**
 * Emotional Phase Card (BREF-01)
 * Light luxury card with warm accents — the hero of the emotional section.
 * Large editorial phase name with animated rose/amber driver bars.
 */

import { motion } from 'framer-motion';
import type { IntentProfile, EmotionalDrivers } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';

interface EmotionalPhaseCardProps {
  intentProfile: IntentProfile | null;
  isLoading?: boolean;
}

interface Phase {
  name: string;
  description: string;
  accent: string;
  bgAccent: string;
}

function derivePhase(drivers: EmotionalDrivers): Phase {
  const entries = Object.entries(drivers) as [keyof EmotionalDrivers, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0];
  const secondary = sorted[1]?.[0];

  if (dominant === 'legacy' || (dominant === 'security' && secondary === 'legacy')) {
    return {
      name: 'Consolidation',
      description: 'A season of securing what matters most — legacy, stability, and lasting impact.',
      accent: 'text-teal-700',
      bgAccent: 'bg-teal-50',
    };
  }
  if (dominant === 'adventure' || (dominant === 'autonomy' && secondary === 'adventure')) {
    return {
      name: 'Exploration',
      description: 'Drawn toward new horizons and fresh experiences. A time for bold choices.',
      accent: 'text-rose-700',
      bgAccent: 'bg-rose-50',
    };
  }
  if (dominant === 'recognition') {
    return {
      name: 'Ascendance',
      description: 'Focus on visibility, influence, and the life you have built.',
      accent: 'text-amber-700',
      bgAccent: 'bg-amber-50',
    };
  }
  return {
    name: 'Renewal',
    description: 'A focus on reflection and new beginnings. A quiet season of inner clarity.',
    accent: 'text-teal-700',
    bgAccent: 'bg-teal-50',
  };
}

function phaseIntensity(drivers: EmotionalDrivers): number {
  return Math.max(...Object.values(drivers));
}

const driverLabels: Record<string, string> = {
  security: 'Security',
  adventure: 'Adventure',
  legacy: 'Legacy',
  recognition: 'Recognition',
  autonomy: 'Autonomy',
};

export function EmotionalPhaseCard({ intentProfile, isLoading }: EmotionalPhaseCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white border border-sand-200/60 p-10 animate-pulse h-full min-h-[420px] shadow-sm">
        <div className="h-3 w-20 bg-sand-200 rounded mb-10" />
        <div className="h-14 w-56 bg-sand-100 rounded mb-6" />
        <div className="h-3 w-full bg-sand-100 rounded mb-3" />
        <div className="h-3 w-2/3 bg-sand-100 rounded" />
      </div>
    );
  }

  const defaultDrivers: EmotionalDrivers = {
    security: 70, adventure: 40, legacy: 80, recognition: 30, autonomy: 55,
  };

  const drivers = intentProfile?.emotionalDrivers ?? defaultDrivers;
  const phase = derivePhase(drivers);
  const intensity = phaseIntensity(drivers);
  const sortedDrivers = (Object.entries(drivers) as [string, number][]).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-2xl bg-white border border-sand-200/60 overflow-hidden h-full flex flex-col shadow-sm">
      <div className="p-8 sm:p-10 lg:p-12 flex flex-col flex-1">
        {/* Label */}
        <p className="text-rose-400 text-[10px] font-sans font-medium uppercase tracking-[5px] mb-10">
          Current Phase
        </p>

        {/* Phase name — huge editorial */}
        <div className="mb-8">
          <h3 className={cn('font-serif text-5xl sm:text-6xl leading-[0.9] tracking-[-0.02em] mb-3', phase.accent)}>
            {phase.name}
          </h3>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-1 bg-sand-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${intensity}%` }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-stone-400 text-[11px] font-sans tabular-nums tracking-wider">{intensity}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-stone-400 text-sm font-sans leading-[1.8] tracking-wide italic mb-10 max-w-md">
          &ldquo;{phase.description}&rdquo;
        </p>

        {/* All 5 driver bars */}
        <div className="mt-auto space-y-4">
          {sortedDrivers.map(([key, value], i) => (
            <div key={key} className="group flex items-center gap-4">
              <span className="text-stone-400 text-[10px] font-sans uppercase tracking-[2px] w-24 text-right group-hover:text-stone-600 transition-colors">
                {driverLabels[key]}
              </span>
              <div className="flex-1 h-1 bg-sand-100 rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    i === 0 ? 'bg-gradient-to-r from-rose-400 to-rose-300' :
                    i === 1 ? 'bg-gradient-to-r from-amber-400 to-amber-300' :
                    'bg-stone-200'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="text-stone-300 text-[10px] font-sans tabular-nums w-6 text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
