'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { generateNarrativeJourneys } from '@/lib/utils/narrative-generator';
import { JourneyList } from '@/components/b2c/journeys/JourneyList';
import { IMAGES } from '@/lib/constants/imagery';

type FilterTab = 'all' | 'active' | 'archived';

export default function JourneysPage() {
  const services = useServices();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const profile = await services.intent.getIntentProfile(MOCK_UHNI_USER_ID);
      if (!profile) { alert('Please complete your Intent Profile first.'); return; }
      await generateNarrativeJourneys(profile);
      setRefreshKey(k => k + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8f6f3] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8"
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ CINEMATIC HERO ═══════ */}
      <div
        className="relative min-h-[50vh] sm:min-h-[55vh] flex items-end bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.heroMaldives})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f6f3] via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
            <p className="text-amber-300/50 text-[10px] font-sans uppercase tracking-[5px] mb-4">
              Your Journey Collection
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] text-white leading-[1] tracking-[-0.025em] mb-5 max-w-lg"
          >
            Your Journey<br />Intelligence.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/30 font-sans text-sm max-w-md leading-[1.7] tracking-wide mb-8"
          >
            Narrative experiences shaped around your emotional landscape, values, and life stage.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-white/95 backdrop-blur-sm text-stone-900 font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-white transition-all disabled:opacity-60 shadow-2xl"
            >
              {isGenerating ? (
                <><motion.div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} /> Generating...</>
              ) : (
                <><Sparkles size={14} /> Generate New Journeys</>
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* ═══════ FILTER BAR ═══════ */}
      <div className="sticky top-16 z-20 bg-[#f8f6f3]/95 backdrop-blur-md border-b border-stone-200/40">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="flex items-center gap-1">
            {(['all', 'active', 'archived'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`relative px-5 py-4 font-sans text-[11px] font-medium uppercase tracking-[3px] transition-colors ${
                  activeFilter === tab
                    ? 'text-stone-900'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {tab}
                {activeFilter === tab && (
                  <motion.div
                    layoutId="journeyFilter"
                    className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-stone-900 rounded-full"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ JOURNEY GRID ═══════ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-14">
        <JourneyList key={refreshKey} filter={activeFilter} onGenerateClick={handleGenerate} />
      </div>
    </div>
  );
}
