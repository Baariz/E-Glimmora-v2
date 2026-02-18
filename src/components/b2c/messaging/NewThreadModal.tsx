'use client';

/**
 * NewThreadModal Component (COLB-05)
 * Modal for creating new message thread
 * - Journey selector dropdown
 * - Advisor selector
 * - Creates thread, sends initial system message, redirects to thread view
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCirclePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useServices } from '@/lib/hooks/useServices';
import { MOCK_UHNI_USER_ID } from '@/lib/hooks/useCurrentUser';
import { cn } from '@/lib/utils/cn';

import type { Journey, User } from '@/lib/types/entities';

interface NewThreadModalProps {
  journeys: Journey[];
  advisors: User[];
  trigger?: React.ReactNode;
  onThreadCreated?: () => void;
}

export function NewThreadModal({
  journeys,
  advisors,
  trigger,
  onThreadCreated,
}: NewThreadModalProps) {
  const services = useServices();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState('');
  const [selectedAdvisorId, setSelectedAdvisorId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    if (!isCreating) {
      setIsOpen(false);
      setSelectedJourneyId('');
      setSelectedAdvisorId('');
    }
  };

  const handleCreateThread = async () => {
    if (!selectedJourneyId || !selectedAdvisorId || isCreating) return;

    setIsCreating(true);

    try {
      const selectedJourney = journeys.find((j) => j.id === selectedJourneyId);
      if (!selectedJourney) {
        throw new Error('Journey not found');
      }

      // Create thread with journey link
      const thread = await services.message.createThread(
        [MOCK_UHNI_USER_ID, selectedAdvisorId],
        'b2c',
        selectedJourneyId
      );

      // Send initial system message
      await services.message.sendMessage({
        threadId: thread.id,
        senderId: 'system',
        content: `Conversation started about journey: ${selectedJourney.title}`,
      });

      // Close modal
      handleCloseModal();

      // Notify parent
      onThreadCreated?.();

      // Redirect to thread view
      router.push(`/messages/${thread.id}`);
    } catch (error) {
      console.error('Failed to create thread:', error);
      alert('Failed to create conversation. Please try again.');
      setIsCreating(false);
    }
  };

  const canCreate = selectedJourneyId && selectedAdvisorId && !isCreating;

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        <div onClick={handleOpenModal}>{trigger}</div>
      ) : (
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
        >
          <MessageCirclePlus className="w-5 h-5" />
          New Conversation
        </button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
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
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-sand-400 hover:text-sand-600 transition-colors"
                disabled={isCreating}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal content */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-50 rounded-full mb-4">
                  <MessageCirclePlus className="w-6 h-6 text-rose-900" />
                </div>
                <h2 className="text-2xl font-serif font-light text-rose-900 mb-2">
                  Start Conversation
                </h2>
                <p className="text-sm font-sans text-sand-600 leading-relaxed">
                  Create a private conversation with your advisor about a specific journey.
                </p>
              </div>

              {/* Journey selector */}
              <div className="mb-6">
                <label
                  htmlFor="journey-select"
                  className="block text-sm font-sans font-medium text-sand-900 mb-2"
                >
                  Select Journey
                </label>
                <select
                  id="journey-select"
                  value={selectedJourneyId}
                  onChange={(e) => setSelectedJourneyId(e.target.value)}
                  disabled={isCreating}
                  className={cn(
                    'w-full px-4 py-3 bg-sand-50 border border-sand-200 rounded-lg',
                    'font-sans text-sm text-sand-900',
                    'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <option value="">Choose a journey...</option>
                  {journeys.map((journey) => (
                    <option key={journey.id} value={journey.id}>
                      {journey.title} ({journey.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Advisor selector */}
              <div className="mb-6">
                <label
                  htmlFor="advisor-select"
                  className="block text-sm font-sans font-medium text-sand-900 mb-2"
                >
                  Select Advisor
                </label>
                <select
                  id="advisor-select"
                  value={selectedAdvisorId}
                  onChange={(e) => setSelectedAdvisorId(e.target.value)}
                  disabled={isCreating}
                  className={cn(
                    'w-full px-4 py-3 bg-sand-50 border border-sand-200 rounded-lg',
                    'font-sans text-sm text-sand-900',
                    'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <option value="">Choose an advisor...</option>
                  {advisors.map((advisor) => (
                    <option key={advisor.id} value={advisor.id}>
                      {advisor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleCloseModal}
                  disabled={isCreating}
                  className="flex-1 px-6 py-3 bg-sand-100 text-sand-900 font-sans font-medium rounded-lg hover:bg-sand-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateThread}
                  disabled={!canCreate}
                  className="flex-1 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-rose-50 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <MessageCirclePlus className="w-5 h-5" />
                      Create
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
