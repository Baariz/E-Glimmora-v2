'use client';

/**
 * Confirm Journey Flow (JRNY-06)
 * End-to-end confirm journey flow:
 * CTA -> confirmation modal -> status change to APPROVED -> success state.
 *
 * This is a critical moment -- UHNI commits to a journey.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Sparkles } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { JourneyStatus } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';

import type { Journey } from '@/lib/types/entities';

interface ConfirmJourneyFlowProps {
  journey: Journey;
  onConfirmed: (updatedJourney: Journey) => void;
  trigger?: React.ReactNode;
}

export function ConfirmJourneyFlow({
  journey,
  onConfirmed,
  trigger,
}: ConfirmJourneyFlowProps) {
  const services = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isConfirming) {
      setIsModalOpen(false);
      setShowSuccess(false);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);

    try {
      // Update journey status to APPROVED
      const updatedJourney = await services.journey.updateJourney(journey.id, {
        status: JourneyStatus.APPROVED,
      });

      // Create system messages in all threads linked to this journey (COLB-04)
      await createSystemMessagesForJourney(journey.id, JourneyStatus.APPROVED);

      // Show success state
      setShowSuccess(true);

      // Wait 2 seconds, then close and notify parent
      setTimeout(() => {
        setIsModalOpen(false);
        setShowSuccess(false);
        onConfirmed(updatedJourney);
      }, 2000);
    } catch (error) {
      console.error('Failed to confirm journey:', error);
      alert('Failed to confirm journey. Please try again.');
      setIsConfirming(false);
    }
  };

  const createSystemMessagesForJourney = async (
    journeyId: string,
    newStatus: JourneyStatus
  ) => {
    try {
      // Get all threads for this user
      const threads = await services.message.getThreads(MOCK_UHNI_USER_ID);

      // Filter threads linked to this journey
      const relatedThreads = threads.filter(
        (thread) => thread.relatedResourceId === journeyId
      );

      // Create system message in each thread
      await Promise.all(
        relatedThreads.map((thread) =>
          services.message.sendMessage({
            threadId: thread.id,
            senderId: 'system',
            content: `Journey status changed to ${newStatus}`,
          })
        )
      );
    } catch (error) {
      console.error('Failed to create system messages:', error);
    }
  };

  return (
    <>
      {/* Trigger (default or custom) */}
      {trigger ? (
        <div onClick={handleOpenModal}>{trigger}</div>
      ) : (
        <button
          onClick={handleOpenModal}
          className="px-8 py-3.5 bg-rose-600 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-rose-700 transition-all shadow-lg flex items-center gap-2.5"
        >
          <Sparkles className="w-4 h-4" />
          Confirm Journey
        </button>
      )}

      {/* Confirmation Modal */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {!showSuccess ? (
                <>
                  {/* Close button */}
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-5 right-5 text-stone-300 hover:text-stone-500 transition-colors"
                    disabled={isConfirming}
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal content */}
                  <div className="mb-7">
                    <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
                    <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
                      Confirmation
                    </p>
                    <h2 className="font-serif text-2xl text-stone-900 mb-3">
                      Confirm Your Journey
                    </h2>
                    <p className="text-stone-500 text-sm font-sans leading-[1.7] tracking-wide">
                      You&apos;re about to confirm <span className="text-stone-700 font-medium">{journey.title}</span>. Once confirmed,
                      your relationship manager will begin coordinating the details.
                    </p>
                  </div>

                  {/* Journey summary */}
                  <div className="bg-sand-50 border border-sand-200/60 rounded-xl p-5 mb-7">
                    <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5">
                      Journey Details
                    </p>
                    <p className="text-stone-700 text-sm font-sans font-medium mb-1">
                      {journey.category}
                    </p>
                    {journey.emotionalObjective && (
                      <p className="text-stone-500 text-sm font-sans italic leading-[1.7]">
                        &ldquo;{journey.emotionalObjective}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCloseModal}
                      disabled={isConfirming}
                      className="text-stone-400 hover:text-stone-600 font-sans text-[13px] font-medium transition-colors disabled:opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isConfirming}
                      className="flex-1 px-8 py-3.5 bg-rose-600 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-rose-700 transition-all disabled:opacity-40 flex items-center justify-center gap-2.5 shadow-lg"
                    >
                      {isConfirming ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Confirm Journey
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* Success state */
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 border border-emerald-200/60 rounded-full mb-5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-7 h-7 text-emerald-500" />
                  </motion.div>
                  <h2 className="font-serif text-2xl text-stone-900 mb-2">
                    Journey Confirmed
                  </h2>
                  <p className="text-stone-500 text-sm font-sans leading-[1.7] tracking-wide">
                    Your journey has been confirmed. Your team will begin preparations shortly.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
