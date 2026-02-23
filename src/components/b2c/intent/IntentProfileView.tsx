'use client';

/**
 * Intent Profile View Component (INTN-07)
 * Luxury cinematic display of complete intent profile
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IntentProfile } from '@/lib/types';
import { useServices } from '@/lib/hooks/useServices';
import { AlignmentBaseline } from './AlignmentBaseline';
import { EmotionalDNACard } from './EmotionalDNACard';
import { cn } from '@/lib/utils/cn';
import { Edit2, RefreshCw, Loader2, Shield, Compass, Heart, Gem } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface IntentProfileViewProps {
  profile: IntentProfile;
}

const LIFE_STAGE_ICONS: Record<string, typeof Shield> = {
  Building: Gem,
  Preserving: Shield,
  Transitioning: Compass,
  'Legacy Planning': Heart,
};

export function IntentProfileView({ profile }: IntentProfileViewProps) {
  const router = useRouter();
  const services = useServices();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const alignmentScore = services.intent.calculateAlignmentBaseline(profile);

  const radarData = Object.entries(profile.emotionalDrivers).map(([key, value]) => ({
    driver: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  const handleEdit = () => {
    router.push('/intent/wizard');
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await services.intent.updateIntentProfile(profile.userId, {
        updatedAt: new Date().toISOString(),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to regenerate profile:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const LifeStageIcon = LIFE_STAGE_ICONS[profile.lifeStage] || Compass;

  return (
    <div className="space-y-10">
      {/* ── Cinematic Header ── */}
      <div
        className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[340px] bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-10 pt-16 sm:pt-24 min-h-[280px] sm:min-h-[340px]">
          <p className="text-amber-300 text-xs font-sans uppercase tracking-[3px] mb-3">Your Emotional Travel DNA</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">Your Intent Profile</h1>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-sans font-medium border border-white/30 hover:bg-white/25 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Refine Profile
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-rose-900 text-sm font-sans font-semibold hover:bg-rose-50 transition-all disabled:opacity-50"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── DNA Card + Alignment ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmotionalDNACard profile={profile} />
        <AlignmentBaseline profile={profile} score={alignmentScore} />
      </div>

      {/* ── Emotional Balance Radar ── */}
      <div className="bg-white border border-stone-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-2">Emotional Balance</p>
        <h3 className="font-serif text-2xl text-stone-900 mb-8">Your inner landscape</h3>
        <div className="max-w-lg mx-auto">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e7e5e4" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="driver"
                tick={{ fill: '#78716c', fontSize: 13, fontFamily: 'inherit' }}
              />
              <Radar
                name="Emotional Drivers"
                dataKey="value"
                stroke="#9f1239"
                fill="#9f1239"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Life Context Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white border border-stone-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-amber-50 border border-rose-200 flex items-center justify-center mb-4">
            <LifeStageIcon className="w-5 h-5 text-rose-700" />
          </div>
          <p className="text-xs font-sans uppercase tracking-wider text-stone-400 mb-1">Life Stage</p>
          <p className="font-serif text-xl text-stone-900">{profile.lifeStage}</p>
        </div>

        {profile.travelMode && (
          <div className="group bg-white border border-stone-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-emerald-50 border border-teal-200 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 text-teal-700" />
            </div>
            <p className="text-xs font-sans uppercase tracking-wider text-stone-400 mb-1">Travel Mode</p>
            <p className="font-serif text-xl text-stone-900">{profile.travelMode}</p>
          </div>
        )}

        {profile.discretionPreference && (
          <div className="group bg-white border border-stone-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-stone-600" />
            </div>
            <p className="text-xs font-sans uppercase tracking-wider text-stone-400 mb-1">Discretion</p>
            <p className="font-serif text-xl text-stone-900">{profile.discretionPreference}</p>
          </div>
        )}

        <div className="group bg-white border border-stone-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-yellow-50 border border-amber-200 flex items-center justify-center mb-4">
            <span className="font-serif text-amber-700 text-sm font-semibold">R</span>
          </div>
          <p className="text-xs font-sans uppercase tracking-wider text-stone-400 mb-1">Risk Tolerance</p>
          <p className="font-serif text-xl text-stone-900">{profile.riskTolerance}</p>
        </div>
      </div>

      {/* ── Priorities & Values ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {profile.priorities && profile.priorities.length > 0 && (
          <div className="bg-white border border-stone-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-2">What Matters Most</p>
            <h3 className="font-serif text-2xl text-stone-900 mb-6">Lifestyle Priorities</h3>
            <div className="flex flex-wrap gap-3">
              {profile.priorities.map((priority) => (
                <span
                  key={priority}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 text-rose-800 font-sans text-sm font-medium"
                >
                  {priority}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.values && profile.values.length > 0 && (
          <div className="bg-white border border-stone-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-teal-600 text-xs font-sans font-semibold uppercase tracking-widest mb-2">Your Foundation</p>
            <h3 className="font-serif text-2xl text-stone-900 mb-6">Personal Values</h3>
            <div className="flex flex-wrap gap-3">
              {profile.values.map((value) => (
                <span
                  key={value}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 text-teal-800 font-sans text-sm font-medium"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
