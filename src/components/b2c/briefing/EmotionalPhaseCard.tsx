'use client';

/**
 * Emotional Phase Card (BREF-01)
 * Displays current emotional phase with visual indicator.
 * Derives phase from intent profile's emotional drivers.
 * Luxury aesthetic: teal/rose palette with editorial feel.
 */

import { motion } from 'framer-motion';
import type { IntentProfile, EmotionalDrivers } from '@/lib/types/entities';

interface EmotionalPhaseCardProps {
  intentProfile: IntentProfile | null;
  isLoading?: boolean;
}

interface Phase {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  ringColor: string;
}

/**
 * Determine emotional phase from dominant drivers.
 * Maps driver combinations to named phases.
 */
function derivePhase(drivers: EmotionalDrivers): Phase {
  const entries = Object.entries(drivers) as [keyof EmotionalDrivers, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0];
  const secondary = sorted[1]?.[0];

  if (dominant === 'legacy' || (dominant === 'security' && secondary === 'legacy')) {
    return {
      name: 'Consolidation',
      description:
        'Your emotional landscape reflects a season of securing what matters most -- legacy, stability, and lasting impact.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      ringColor: 'ring-teal-300',
    };
  }

  if (dominant === 'adventure' || (dominant === 'autonomy' && secondary === 'adventure')) {
    return {
      name: 'Exploration',
      description:
        'You are drawn toward new horizons and fresh experiences. This is a time for bold choices and discovery.',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      ringColor: 'ring-rose-300',
    };
  }

  if (dominant === 'recognition') {
    return {
      name: 'Ascendance',
      description:
        'Your focus is on visibility, influence, and being recognized for the life you have built. A season of outward expression.',
      color: 'text-gold-600',
      bgColor: 'bg-gold-50',
      ringColor: 'ring-gold-300',
    };
  }

  // Default: Renewal
  return {
    name: 'Renewal',
    description:
      'Your current emotional cycle suggests a focus on reflection and new beginnings. A quiet season of inner clarity.',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    ringColor: 'ring-teal-300',
  };
}

/** Compute a 0-100 "phase intensity" from dominant driver strength */
function phaseIntensity(drivers: EmotionalDrivers): number {
  const values = Object.values(drivers);
  const max = Math.max(...values);
  return max;
}

export function EmotionalPhaseCard({ intentProfile, isLoading }: EmotionalPhaseCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 w-32 bg-sand-200 rounded" />
        <div className="h-20 w-20 mx-auto bg-sand-200 rounded-full" />
        <div className="h-4 w-48 bg-sand-200 rounded mx-auto" />
        <div className="h-3 w-full bg-sand-200 rounded" />
      </div>
    );
  }

  const defaultDrivers: EmotionalDrivers = {
    security: 70,
    adventure: 40,
    legacy: 80,
    recognition: 30,
    autonomy: 55,
  };

  const drivers = intentProfile?.emotionalDrivers ?? defaultDrivers;
  const phase = derivePhase(drivers);
  const intensity = phaseIntensity(drivers);

  // SVG ring arc calculation
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (intensity / 100) * circumference;

  return (
    <div className={`rounded-2xl ${phase.bgColor} p-8`}>
      <p className="text-xs font-sans uppercase tracking-widest text-sand-500 mb-6">
        Emotional Phase
      </p>

      {/* Circular indicator */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg width="88" height="88" viewBox="0 0 88 88" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-sand-200"
            />
            {/* Phase ring */}
            <motion.circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className={phase.color}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-serif ${phase.color}`}>
              {intensity}
            </span>
          </div>
        </div>
      </div>

      {/* Phase name */}
      <h3 className={`text-2xl font-serif text-center ${phase.color} mb-3`}>
        {phase.name}
      </h3>

      {/* Narrative description */}
      <p className="text-sm font-sans text-sand-600 leading-relaxed text-center">
        {phase.description}
      </p>
    </div>
  );
}
