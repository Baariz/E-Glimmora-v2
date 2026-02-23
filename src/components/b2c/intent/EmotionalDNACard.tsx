'use client';

/**
 * Emotional DNA Card (INTN-06)
 * Cinematic visual summary of the generated emotional profile
 */

import { IntentProfile } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { Sparkles } from 'lucide-react';
import { IMAGES } from '@/lib/constants/imagery';

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
    ? `${profile.lifeStage} · ${profile.travelMode}`
    : profile.lifeStage;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl min-h-[320px] flex flex-col justify-end bg-cover bg-center shadow-sm',
        className
      )}
      style={{ backgroundImage: `url(${IMAGES.heroVenice})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Content */}
      <div className="relative z-10 p-8 sm:p-10 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-amber-300/70 text-[10px] font-sans font-medium uppercase tracking-[4px]">
            Your DNA
          </span>
        </div>

        <div>
          <h3 className="font-serif text-3xl sm:text-4xl text-white leading-[0.95] tracking-[-0.01em] mb-3">{typeLabel}</h3>
          <p className="text-white/60 text-sm font-sans tracking-wide">
            Driven by <span className="font-medium text-white/90">{drivers[0]}</span> and{' '}
            <span className="font-medium text-white/90">{drivers[1]}</span>
          </p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-white/30 text-[11px] font-sans tracking-wide">
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
