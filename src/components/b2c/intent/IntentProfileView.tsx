'use client';

/**
 * Intent Profile View Component (INTN-07)
 * Luxury editorial display — private UHNI dossier style.
 * Full-bleed hero → Emotional DNA section → Coherence → Life Context → Values → CTA
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IntentProfile } from '@/lib/types';
import { useServices } from '@/lib/hooks/useServices';
import { cn } from '@/lib/utils/cn';
import { Edit2, RefreshCw, Loader2, Shield, Compass, Heart, Gem, Crown, Mountain, Palette, Key, ArrowRight } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { IMAGES } from '@/lib/constants/imagery';
import { ParallaxSection } from '@/components/ui/ParallaxSection';
import Link from 'next/link';

interface IntentProfileViewProps {
  profile: IntentProfile;
}

const LIFE_STAGE_ICONS: Record<string, typeof Shield> = {
  Building: Gem,
  Preserving: Shield,
  Transitioning: Compass,
  'Legacy Planning': Heart,
};

const TRAVEL_MODE_ICONS: Record<string, typeof Crown> = {
  Luxury: Crown,
  Adventure: Mountain,
  Wellness: Heart,
  Cultural: Palette,
  'Exclusive Access': Key,
};



const driverLabels: Record<string, string> = {
  security: 'Security',
  adventure: 'Adventure',
  legacy: 'Legacy',
  recognition: 'Recognition',
  autonomy: 'Autonomy',
};

function derivePhase(drivers: IntentProfile['emotionalDrivers']): { name: string; description: string; accent: string } {
  const entries = Object.entries(drivers) as [string, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0];
  const secondary = sorted[1]?.[0];

  if (dominant === 'legacy' || (dominant === 'security' && secondary === 'legacy')) {
    return { name: 'Consolidation', description: 'A season of securing what matters most — legacy, stability, and lasting impact.', accent: 'text-teal-700' };
  }
  if (dominant === 'adventure' || (dominant === 'autonomy' && secondary === 'adventure')) {
    return { name: 'Exploration', description: 'Drawn toward new horizons and fresh experiences. A time for bold choices.', accent: 'text-rose-700' };
  }
  if (dominant === 'recognition') {
    return { name: 'Ascendance', description: 'Focus on visibility, influence, and the life you have built.', accent: 'text-amber-700' };
  }
  return { name: 'Renewal', description: 'A focus on reflection and new beginnings. A quiet season of inner clarity.', accent: 'text-teal-700' };
}

export function IntentProfileView({ profile }: IntentProfileViewProps) {
  const router = useRouter();
  const services = useServices();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const alignmentScore = services.intent.calculateAlignmentBaseline(profile);

  const radarData = Object.entries(profile.emotionalDrivers).map(([key, value]) => ({
    driver: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  const sortedDrivers = (Object.entries(profile.emotionalDrivers) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const phase = derivePhase(profile.emotionalDrivers);

  const handleEdit = () => router.push('/intent/wizard#wizard-content');

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await services.intent.updateIntentProfile(profile.userId, { updatedAt: new Date().toISOString() });
      router.refresh();
    } catch (error) {
      console.error('Failed to regenerate profile:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const LifeStageIcon = LIFE_STAGE_ICONS[profile.lifeStage] || Compass;
  const TravelModeIcon = TRAVEL_MODE_ICONS[profile.travelMode || ''] || Compass;

  const getScoreColor = (s: number) => {
    if (s < 40) return 'text-amber-500';
    if (s < 70) return 'text-teal-500';
    return 'text-rose-500';
  };
  const getScoreLabel = (s: number) => {
    if (s < 40) return 'Developing';
    if (s < 70) return 'Aligned';
    return 'Exceptional';
  };
  const getBarGradient = (s: number) => {
    if (s < 40) return 'from-amber-400 to-amber-300';
    if (s < 70) return 'from-teal-400 to-teal-300';
    return 'from-rose-400 to-amber-400';
  };
  const getNarrative = (s: number) => {
    if (s < 40) return 'Your profile is still developing. As you take journeys and refine your preferences, this alignment will strengthen naturally over time.';
    if (s < 70) return 'Strong coherence between your emotional drivers and stated preferences. Recommendations will be well-matched to your inner landscape.';
    return 'Exceptional alignment. Your emotional drivers, lifestyle priorities, and preferences create a deeply coherent foundation for extraordinary experiences.';
  };

  return (
    <div>
      {/* ═══════════════════════ FULL-BLEED HERO ═══ */}
      <ParallaxSection
        imageUrl={IMAGES.heroAerial}
        className="min-h-[50vh] sm:min-h-[55vh]"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-32 pb-12 sm:pb-16 min-h-[50vh] sm:min-h-[55vh]">
          <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
          <p className="text-amber-300/60 text-[10px] font-sans uppercase tracking-[5px] mb-3">Your Emotional Travel DNA</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-[0.9] tracking-[-0.02em] mb-6 max-w-2xl">Your Intent Profile</h1>
          <p className="text-white/40 font-sans text-sm max-w-md leading-[1.7] tracking-wide mb-8">
            A private emotional blueprint that shapes every journey, recommendation, and experience curated for you.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-[13px] font-sans font-medium border border-white/20 hover:bg-white/20 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Refine Profile
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-rose-900 text-[13px] font-sans font-semibold hover:bg-amber-50 transition-all disabled:opacity-50 shadow-lg"
            >
              {isRegenerating ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Regenerating...</>
              ) : (
                <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
              )}
            </button>
          </div>
        </div>
      </ParallaxSection>

      {/* ═══════════════════════ EMOTIONAL DNA SECTION ═══ */}
      <div className="bg-sand-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 sm:mb-18"
          >
            <div className="w-10 h-px bg-rose-300 mb-5" />
            <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">Your Inner Landscape</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[0.95]">Emotional DNA.</h2>
          </motion.div>

          {/* Asymmetric grid — drivers + radar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left: Phase + Driver bars (3 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3"
            >
              <div className="bg-white border border-sand-200/60 rounded-2xl p-8 sm:p-10 shadow-sm h-full flex flex-col">
                <p className="text-rose-400 text-[10px] font-sans font-medium uppercase tracking-[5px] mb-8">Current Phase</p>

                {/* Phase name */}
                <h3 className={cn('font-serif text-5xl sm:text-6xl leading-[0.9] tracking-[-0.02em] mb-3', phase.accent)}>
                  {phase.name}
                </h3>
                <div className="flex items-center gap-3 mt-3 mb-6">
                  <div className="flex-1 h-1 bg-sand-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-400 to-amber-400 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(...Object.values(profile.emotionalDrivers))}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="text-stone-400 text-[11px] font-sans tabular-nums">
                    {Math.max(...Object.values(profile.emotionalDrivers))}
                  </span>
                </div>

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
                          whileInView={{ width: `${value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span className="text-stone-300 text-[10px] font-sans tabular-nums w-6 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Radar chart (2 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2"
            >
              <div className="bg-white border border-sand-200/60 rounded-2xl p-8 sm:p-10 shadow-sm h-full flex flex-col">
                <p className="text-amber-500 text-[10px] font-sans font-medium uppercase tracking-[5px] mb-6">Inner Compass</p>

                <div className="flex-1 min-h-0 flex items-center justify-center -mx-4">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData} outerRadius="72%">
                      <PolarGrid stroke="rgba(214,204,194,0.3)" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="driver" tick={{ fill: 'rgba(120,113,108,0.5)', fontSize: 10, fontFamily: 'inherit' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Drivers" dataKey="value" stroke="rgba(244,63,94,0.5)" fill="rgba(244,63,94,0.08)" strokeWidth={1.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Profile type label */}
                <div className="mt-auto pt-6 border-t border-sand-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400 text-[10px] font-sans uppercase tracking-[3px]">Profile Type</span>
                    <span className="text-stone-900 font-serif text-base">
                      {profile.travelMode ? `${profile.lifeStage} · ${profile.travelMode}` : profile.lifeStage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-stone-400 text-[10px] font-sans uppercase tracking-[3px]">Established</span>
                    <span className="text-stone-500 font-sans text-xs">
                      {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ COHERENCE SCORE ═══ */}
      <div className="bg-white border-y border-sand-200/40">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row lg:items-center lg:gap-20"
          >
            {/* Score */}
            <div className="flex-shrink-0 mb-10 lg:mb-0">
              <div className="w-10 h-px bg-amber-400 mb-5" />
              <p className="text-amber-500 text-[10px] font-sans font-medium uppercase tracking-[5px] mb-6">Coherence Score</p>
              <div className="flex items-baseline gap-3">
                <span className={cn('font-serif text-8xl sm:text-9xl leading-none', getScoreColor(alignmentScore))}>
                  {alignmentScore}
                </span>
                <span className="text-stone-200 font-sans text-2xl">/100</span>
              </div>
              <p className="text-stone-400 font-sans text-[10px] uppercase tracking-[3px] mt-3">{getScoreLabel(alignmentScore)}</p>
            </div>

            {/* Narrative + bar */}
            <div className="flex-1">
              <div className="h-1 bg-sand-100 rounded-full mb-8">
                <motion.div
                  className={cn('h-full rounded-full bg-gradient-to-r', getBarGradient(alignmentScore))}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${alignmentScore}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="text-stone-400 text-base font-sans leading-[1.8] tracking-wide max-w-lg">
                {getNarrative(alignmentScore)}
              </p>
              <div className="mt-6 pt-5 border-t border-sand-200/60 flex items-center justify-between max-w-lg">
                <span className="text-stone-400 text-[10px] font-sans uppercase tracking-[3px]">Dominant driver</span>
                <span className="text-stone-900 font-serif text-lg capitalize">{sortedDrivers[0]?.[0]}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════ LIFE CONTEXT ═══ */}
      <div className="bg-sand-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14"
          >
            <div className="w-10 h-px bg-rose-300 mb-5" />
            <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">Your Context</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[0.95]">Life landscape.</h2>
          </motion.div>

          {/* ── ATTRIBUTE GRID ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                label: 'Life Stage',
                value: profile.lifeStage,
                Icon: LifeStageIcon,
                accent: 'from-rose-500/10 to-amber-500/5',
                iconBg: 'bg-rose-50',
                iconColor: 'text-rose-700',
              },
              {
                label: 'Travel Mode',
                value: profile.travelMode || '\u2014',
                Icon: TravelModeIcon,
                accent: 'from-teal-500/10 to-emerald-500/5',
                iconBg: 'bg-teal-50',
                iconColor: 'text-teal-700',
              },
              {
                label: 'Discretion',
                value: profile.discretionPreference || 'High',
                Icon: Shield,
                accent: 'from-stone-500/[0.08] to-stone-500/[0.03]',
                iconBg: 'bg-stone-100',
                iconColor: 'text-stone-600',
              },
              {
                label: 'Risk Tolerance',
                value: profile.riskTolerance || 'Moderate',
                Icon: Compass,
                accent: 'from-amber-500/10 to-amber-500/5',
                iconBg: 'bg-amber-50',
                iconColor: 'text-amber-700',
              },
            ].map((attr) => (
              <motion.div
                key={attr.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'relative rounded-2xl bg-gradient-to-br border border-stone-200/60 p-6 sm:p-7 overflow-hidden group hover:shadow-lg transition-all duration-500',
                  attr.accent
                )}
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-white/40 group-hover:bg-white/60 transition-colors" />

                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-5', attr.iconBg)}>
                  <attr.Icon size={18} className={attr.iconColor} />
                </div>
                <p className="text-stone-400 text-[10px] font-sans uppercase tracking-[4px] mb-2">
                  {attr.label}
                </p>
                <h4 className="font-serif text-2xl sm:text-3xl text-stone-900 leading-tight">
                  {attr.value}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════ PRIORITIES & VALUES ═══ */}
      {((profile.priorities && profile.priorities.length > 0) || (profile.values && profile.values.length > 0)) && (
        <div className="bg-white border-t border-sand-200/40">
          <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-14"
            >
              <div className="w-10 h-px bg-teal-300 mb-5" />
              <p className="text-teal-500 text-[10px] font-sans uppercase tracking-[5px] mb-3">Your Foundation</p>
              <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-[0.95]">What guides you.</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {profile.priorities && profile.priorities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <p className="text-rose-400 text-[10px] font-sans font-medium uppercase tracking-[4px] mb-5">Lifestyle Priorities</p>
                  <div className="flex flex-wrap gap-3">
                    {profile.priorities.map((priority) => (
                      <span
                        key={priority}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/60 text-rose-800 font-sans text-sm font-medium tracking-wide"
                      >
                        {priority}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {profile.values && profile.values.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <p className="text-teal-500 text-[10px] font-sans font-medium uppercase tracking-[4px] mb-5">Personal Values</p>
                  <div className="flex flex-wrap gap-3">
                    {profile.values.map((value) => (
                      <span
                        key={value}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 text-teal-800 font-sans text-sm font-medium tracking-wide"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════ FOOTER CTA ═══ */}
      <ParallaxSection
        imageUrl={IMAGES.heroMaldives}
        className="py-28 sm:py-36"
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <div className="w-12 h-px bg-amber-400/50 mx-auto mb-8" />
          <p className="text-amber-300/50 text-[10px] font-sans uppercase tracking-[6px] mb-5">Continue</p>
          <h3 className="font-serif text-3xl sm:text-4xl text-white leading-[0.95] mb-5">
            Your profile shapes<br />every experience.
          </h3>
          <p className="text-white/40 font-sans text-sm mb-10 leading-[1.8] tracking-wide max-w-sm mx-auto">
            Explore journeys curated by your emotional DNA, or refine your profile to unlock new possibilities.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/journeys"
              className="group inline-flex items-center gap-3 bg-white text-rose-900 font-sans text-[13px] font-semibold tracking-wide px-8 py-3.5 rounded-full hover:bg-amber-50 transition-all shadow-2xl"
            >
              Explore Journeys
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={handleEdit}
              className="group inline-flex items-center gap-2 text-white/50 font-sans text-[13px] tracking-wide hover:text-white transition-colors"
            >
              Refine Profile
              <span className="w-4 h-px bg-white/30 group-hover:w-6 group-hover:bg-white transition-all" />
            </button>
          </div>
        </div>
      </ParallaxSection>
    </div>
  );
}
