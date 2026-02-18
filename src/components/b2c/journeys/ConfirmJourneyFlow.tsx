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
      // Don't fail the entire operation if system messages fail
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
          className="flex-1 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Confirm Journey
        </button>
      )}

      {/* Confirmation Modal */}
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
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {!showSuccess ? (
                <>
                  {/* Close button */}
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-sand-400 hover:text-sand-600 transition-colors"
                    disabled={isConfirming}
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Modal content */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-50 rounded-full mb-4">
                      <CheckCircle className="w-6 h-6 text-rose-900" />
                    </div>
                    <h2 className="text-2xl font-serif font-light text-rose-900 mb-2">
                      Confirm Journey
                    </h2>
                    <p className="text-base font-sans text-sand-700 leading-relaxed">
                      You&apos;re about to confirm <strong>{journey.title}</strong>. Once confirmed,
                      your relationship manager will be notified and can begin coordinating
                      the details.
                    </p>
                  </div>

                  {/* Journey summary */}
                  <div className="p-4 bg-sand-50 rounded-lg mb-6">
                    <p className="text-sm font-sans text-sand-600 mb-1">
                      <span className="font-semibold">Category:</span> {journey.category}
                    </p>
                    {journey.emotionalObjective && (
                      <p className="text-sm font-sans text-sand-600 italic">
                        &quot;{journey.emotionalObjective}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleCloseModal}
                      disabled={isConfirming}
                      className="flex-1 px-6 py-3 bg-sand-100 text-sand-900 font-sans font-medium rounded-lg hover:bg-sand-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={isConfirming}
                      className="flex-1 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isConfirming ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-rose-50 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Confirm
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
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-2xl font-serif font-light text-emerald-900 mb-2">
                    Journey Confirmed
                  </h2>
                  <p className="text-base font-sans text-sand-700">
                    Your journey has been confirmed successfully.
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
