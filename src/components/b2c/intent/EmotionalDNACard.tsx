'use client';

/**
 * Emotional DNA Card (INTN-06)
 * Visual summary of the generated emotional profile
 */

import { IntentProfile } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { Sparkles } from 'lucide-react';

interface EmotionalDNACardProps {
  profile: IntentProfile;
  className?: string;
}

export function EmotionalDNACard({ profile, className }: EmotionalDNACardProps) {
  // Get top 2 emotional drivers
  const drivers = Object.entries(profile.emotionalDrivers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

  // Generate type label from life stage + travel mode
  const typeLabel = profile.travelMode
    ? `${profile.lifeStage} ${profile.travelMode}`
    : profile.lifeStage;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 p-8 text-white shadow-xl',
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider opacity-90">
            Your Emotional Travel DNA
          </span>
        </div>

        <div>
          <h3 className="font-serif text-3xl mb-2">{typeLabel}</h3>
          <p className="text-rose-100 text-sm">
            Driven by <span className="font-medium text-white">{drivers[0]}</span> and{' '}
            <span className="font-medium text-white">{drivers[1]}</span>
          </p>
        </div>

        <div className="pt-4 border-t border-white/20">
          <div className="text-xs opacity-75">
            Profile created {new Date(profile.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
