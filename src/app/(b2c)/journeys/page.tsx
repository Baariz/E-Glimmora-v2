'use client';

/**
 * Journeys Page
 * Journey Intelligence engine -- displays AI-generated narrative journeys.
 * Luxury editorial layout with filter tabs and generation CTA.
 *
 * This is the core value proposition of Elan: personalized narrative
 * experiences that feel like bespoke travel proposals from a luxury concierge.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';

import { ScrollReveal } from '@/components/shared/ScrollReveal/ScrollReveal';
import { fadeUp, staggerChildren } from '@/styles/variants';
import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { generateNarrativeJourneys } from '@/lib/utils/narrative-generator';
import { JourneyList } from '@/components/b2c/journeys/JourneyList';

import type { IntentProfile } from '@/lib/types/entities';

type FilterTab = 'all' | 'active' | 'archived';

export default function JourneysPage() {
  const services = useServices();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGenerateJourneys = async () => {
    setIsGenerating(true);

    try {
      // Fetch user's intent profile
      const intentProfile = await services.intent.getIntentProfile(MOCK_UHNI_USER_ID);

      if (!intentProfile) {
        alert('Please complete your Intent Profile first.');
        return;
      }

      // Generate narrative journeys
      await generateNarrativeJourneys(intentProfile);

      // Refresh the list
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to generate journeys:', error);
      alert('Failed to generate journeys. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                       */}
      {/* ------------------------------------------------------------------ */}
      <motion.header variants={fadeUp} className="mb-12">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-rose-900 mb-3">
              Your Journey Intelligence
            </h1>
            <p className="text-lg font-sans text-sand-600 max-w-2xl">
              AI-generated narrative experiences tailored to your emotional landscape.
              Each journey is a bespoke proposal designed around your values, drivers, and life stage.
            </p>
          </div>

          {/* Generate New Journeys Button */}
          <button
            onClick={handleGenerateJourneys}
            disabled={isGenerating}
            className="px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-rose-50 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate New
              </>
            )}
          </button>
        </div>
      </motion.header>

      {/* ------------------------------------------------------------------ */}
      {/* Filter Tabs                                                        */}
      {/* ------------------------------------------------------------------ */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex gap-4 border-b border-sand-200">
          {(['all', 'active', 'archived'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-3 font-sans font-medium text-sm capitalize transition-colors relative ${
                activeFilter === tab
                  ? 'text-rose-900'
                  : 'text-sand-500 hover:text-sand-700'
              }`}
            >
              {tab}
              {activeFilter === tab && (
                <motion.div
                  layoutId="activeFilterIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-900"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Journey List                                                       */}
      {/* ------------------------------------------------------------------ */}
      <motion.div variants={fadeUp}>
        <JourneyList
          key={refreshKey}
          filter={activeFilter}
          onGenerateClick={handleGenerateJourneys}
        />
      </motion.div>
    </motion.div>
  );
}
