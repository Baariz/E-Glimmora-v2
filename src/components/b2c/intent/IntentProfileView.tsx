'use client';

/**
 * Intent Profile View Component (INTN-07)
 * Displays complete intent profile with visualizations
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IntentProfile } from '@/lib/types';
import { useServices } from '@/lib/hooks/useServices';
import { AlignmentBaseline } from './AlignmentBaseline';
import { EmotionalDNACard } from './EmotionalDNACard';
import { cn } from '@/lib/utils/cn';
import { Edit2, RefreshCw, Loader2 } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface IntentProfileViewProps {
  profile: IntentProfile;
}

export function IntentProfileView({ profile }: IntentProfileViewProps) {
  const router = useRouter();
  const services = useServices();
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Calculate alignment baseline
  const alignmentScore = services.intent.calculateAlignmentBaseline(profile);

  // Prepare radar chart data
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
      // Recalculate alignment (in real implementation, this might trigger more complex logic)
      await services.intent.updateIntentProfile(profile.userId, {
        updatedAt: new Date().toISOString(),
      });
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error('Failed to regenerate profile:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-2">Your Intent Profile</h1>
          <p className="text-lg text-stone-600">
            A comprehensive view of your emotional landscape and preferences
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-stone-300',
              'text-stone-700 font-medium hover:border-stone-400 hover:bg-stone-50 transition-all'
            )}
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg',
              'bg-rose-600 text-white font-medium hover:bg-rose-700 transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isRegenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmotionalDNACard profile={profile} />
        <AlignmentBaseline profile={profile} score={alignmentScore} />
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emotional Drivers Radar Chart */}
        <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-stone-200">
          <h3 className="font-serif text-2xl text-stone-900 mb-6">Emotional Balance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e7e5e4" />
              <PolarAngleAxis
                dataKey="driver"
                tick={{ fill: '#78716c', fontSize: 12, fontFamily: 'system-ui' }}
              />
              <Radar
                name="Emotional Drivers"
                dataKey="value"
                stroke="#f43f5e"
                fill="#f43f5e"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Life Stage & Travel Mode */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200">
            <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">Life Stage</div>
            <div className="font-serif text-2xl text-stone-900">{profile.lifeStage}</div>
          </div>

          {profile.travelMode && (
            <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200">
              <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">Travel Mode</div>
              <div className="font-serif text-2xl text-stone-900">{profile.travelMode}</div>
            </div>
          )}

          {profile.discretionPreference && (
            <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200">
              <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">
                Discretion Preference
              </div>
              <div className="font-serif text-2xl text-stone-900">{profile.discretionPreference}</div>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200">
            <div className="text-xs uppercase tracking-wider text-stone-500 mb-2">Risk Tolerance</div>
            <div className="font-serif text-2xl text-stone-900">{profile.riskTolerance}</div>
          </div>
        </div>
      </div>

      {/* Priorities & Values */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {profile.priorities && profile.priorities.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-stone-200">
            <h3 className="font-serif text-2xl text-stone-900 mb-4">Lifestyle Priorities</h3>
            <div className="flex flex-wrap gap-2">
              {profile.priorities.map((priority) => (
                <div
                  key={priority}
                  className="px-4 py-2 rounded-full bg-rose-50 text-rose-700 font-medium text-sm"
                >
                  {priority}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.values && profile.values.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-stone-200">
            <h3 className="font-serif text-2xl text-stone-900 mb-4">Personal Values</h3>
            <div className="flex flex-wrap gap-2">
              {profile.values.map((value) => (
                <div
                  key={value}
                  className="px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-medium text-sm"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
