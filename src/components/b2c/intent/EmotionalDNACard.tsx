'use client';

/**
 * Emotional DNA Card (INTN-06)
 * Cinematic visual summary of the generated emotional profile
 */

import { IntentProfile } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { Sparkles } from 'lucide-react';

interface EmotionalDNACardProps {
  profile: IntentProfile;
  className?: string;
}

export function EmotionalDNACard({ profile, className }: EmotionalDNACardProps) {
  const drivers = Object.entries(profile.emotionalDrivers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

  const typeLabel = profile.travelMode
    ? `${profile.lifeStage} ${profile.travelMode}`
    : profile.lifeStage;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl min-h-[280px] flex flex-col justify-end bg-cover bg-center shadow-xl',
        className
      )}
      style={{ backgroundImage: `url(https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80)` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-900/50 to-black/20" />

      {/* Content */}
      <div className="relative z-10 p-8 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-amber-300 text-xs font-sans font-semibold uppercase tracking-[3px]">
            Your DNA
          </span>
        </div>

        <div>
          <h3 className="font-serif text-3xl text-white mb-2">{typeLabel}</h3>
          <p className="text-white/70 text-sm font-sans">
            Driven by <span className="font-medium text-white">{drivers[0]}</span> and{' '}
            <span className="font-medium text-white">{drivers[1]}</span>
          </p>
        </div>

        <div className="pt-3 border-t border-white/15">
          <p className="text-white/40 text-xs font-sans">
            Profile established {new Date(profile.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
