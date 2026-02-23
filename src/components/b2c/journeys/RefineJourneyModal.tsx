'use client';

/**
 * Refine Journey Modal (JRNY-07)
 * CTA -> editing modal -> save new version -> updated display.
 *
 * Allows UHNI to modify journey narrative and title.
 * Creates a new journey version on save.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, X, Save } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { cn } from '@/lib/utils/cn';

import type { Journey } from '@/lib/types/entities';

interface RefineJourneyModalProps {
  journey: Journey;
  onRefined: (updatedJourney: Journey) => void;
  trigger?: React.ReactNode;
}

export function RefineJourneyModal({
  journey,
  onRefined,
  trigger,
}: RefineJourneyModalProps) {
  const services = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState(journey.title);
  const [narrative, setNarrative] = useState(journey.narrative);
  const [emotionalObjective, setEmotionalObjective] = useState(
    journey.emotionalObjective || ''
  );

  const handleOpenModal = () => {
    // Reset form to current journey values
    setTitle(journey.title);
    setNarrative(journey.narrative);
    setEmotionalObjective(journey.emotionalObjective || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      setIsModalOpen(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Create new journey version
      await services.journey.createJourneyVersion(journey.id, {
        title,
        narrative,
        status: journey.status,
        modifiedBy: MOCK_UHNI_USER_ID,
      });

      // Update journey main fields
      const updatedJourney = await services.journey.updateJourney(journey.id, {
        title,
        narrative,
        emotionalObjective,
      });

      setIsModalOpen(false);
      onRefined(updatedJourney);
    } catch (error) {
      console.error('Failed to refine journey:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    title !== journey.title ||
    narrative !== journey.narrative ||
    emotionalObjective !== (journey.emotionalObjective || '');

  return (
    <>
      {/* Trigger (default or custom) */}
      {trigger ? (
        <div onClick={handleOpenModal}>{trigger}</div>
      ) : (
        <button
          onClick={handleOpenModal}
          className="px-8 py-3.5 bg-white text-stone-600 font-sans text-[13px] font-semibold tracking-wide rounded-full border border-sand-200/60 hover:bg-sand-50 hover:border-sand-300 transition-all flex items-center gap-2.5 shadow-sm"
        >
          <PenLine className="w-4 h-4" />
          Refine Journey
        </button>
      )}

      {/* Editing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-5 right-5 text-stone-300 hover:text-stone-500 transition-colors"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal header */}
              <div className="mb-8">
                <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
                <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
                  Refine
                </p>
                <h2 className="font-serif text-2xl text-stone-900 mb-3">
                  Shape Your Narrative
                </h2>
                <p className="text-stone-500 text-sm font-sans leading-[1.7] tracking-wide max-w-lg">
                  Modify the journey narrative to better align with your vision. Your changes
                  will create a new version while preserving the original.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6 mb-8">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-3.5 bg-sand-50 border border-sand-200/60 rounded-xl font-serif text-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all"
                    placeholder="Journey title..."
                  />
                </div>

                {/* Emotional Objective */}
                <div>
                  <label
                    htmlFor="objective"
                    className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5"
                  >
                    Emotional Objective
                  </label>
                  <input
                    id="objective"
                    type="text"
                    value={emotionalObjective}
                    onChange={(e) => setEmotionalObjective(e.target.value)}
                    className="w-full px-5 py-3.5 bg-sand-50 border border-sand-200/60 rounded-xl font-sans text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all tracking-wide"
                    placeholder="What is the emotional purpose of this journey?"
                  />
                </div>

                {/* Narrative */}
                <div>
                  <label
                    htmlFor="narrative"
                    className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5"
                  >
                    Narrative
                  </label>
                  <textarea
                    id="narrative"
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    rows={10}
                    className="w-full px-5 py-4 bg-sand-50 border border-sand-200/60 rounded-xl font-sans text-sm text-stone-700 leading-[1.8] focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all resize-none tracking-wide"
                    placeholder="Describe the journey in detail..."
                  />
                  <p className="text-[10px] font-sans text-stone-300 mt-2 tracking-wide">
                    {narrative.length} characters
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-6 border-t border-sand-200/60">
                <button
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="text-stone-400 hover:text-stone-600 font-sans text-[13px] font-medium transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="flex-1 px-8 py-3.5 bg-rose-600 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-rose-700 transition-all disabled:opacity-40 flex items-center justify-center gap-2.5 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
