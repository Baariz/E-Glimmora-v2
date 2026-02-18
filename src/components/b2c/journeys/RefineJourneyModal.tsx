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
import { Edit, X, Save } from 'lucide-react';

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
          className="flex-1 px-6 py-3 bg-sand-100 text-sand-900 font-sans font-medium rounded-lg hover:bg-sand-200 transition-colors flex items-center justify-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Refine Journey
        </button>
      )}

      {/* Editing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-sand-400 hover:text-sand-600 transition-colors"
                disabled={isSaving}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal header */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-sand-50 rounded-full mb-4">
                  <Edit className="w-6 h-6 text-sand-900" />
                </div>
                <h2 className="text-2xl font-serif font-light text-rose-900 mb-2">
                  Refine Journey
                </h2>
                <p className="text-base font-sans text-sand-700">
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
                    className="block text-sm font-sans font-semibold text-sand-900 mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg font-serif text-lg text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Journey title..."
                  />
                </div>

                {/* Emotional Objective */}
                <div>
                  <label
                    htmlFor="objective"
                    className="block text-sm font-sans font-semibold text-sand-900 mb-2"
                  >
                    Emotional Objective (Optional)
                  </label>
                  <input
                    id="objective"
                    type="text"
                    value={emotionalObjective}
                    onChange={(e) => setEmotionalObjective(e.target.value)}
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg font-sans text-base text-sand-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="What is the emotional purpose of this journey?"
                  />
                </div>

                {/* Narrative */}
                <div>
                  <label
                    htmlFor="narrative"
                    className="block text-sm font-sans font-semibold text-sand-900 mb-2"
                  >
                    Narrative
                  </label>
                  <textarea
                    id="narrative"
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg font-sans text-base text-sand-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                    placeholder="Describe the journey in detail..."
                  />
                  <p className="text-xs font-sans text-sand-500 mt-1">
                    {narrative.length} characters
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-sand-100 text-sand-900 font-sans font-medium rounded-lg hover:bg-sand-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="flex-1 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-rose-50 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
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
