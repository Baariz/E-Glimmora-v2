'use client';

/**
 * NewThreadModal — Luxury Modal for Starting Conversations
 * Gold accent line, refined selects, pill-shaped buttons.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, MessageCircle } from 'lucide-react';
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

  const handleOpenModal = () => setIsOpen(true);

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
      if (!selectedJourney) throw new Error('Journey not found');

      const thread = await services.message.createThread(
        [MOCK_UHNI_USER_ID, selectedAdvisorId],
        'b2c',
        selectedJourneyId
      );

      await services.message.sendMessage({
        threadId: thread.id,
        senderId: 'system',
        content: `Conversation started about journey: ${selectedJourney.title}`,
      });

      handleCloseModal();
      onThreadCreated?.();
      router.push(`/messages/${thread.id}`);
    } catch (error) {
      console.error('Failed to create thread:', error);
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
          className="flex items-center gap-2.5 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/15 text-white font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-white/15 transition-all"
        >
          <Plus size={14} />
          New Conversation
        </button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-7 pt-7 pb-5 border-b border-stone-200/60">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-all"
                  disabled={isCreating}
                >
                  <X size={14} />
                </button>

                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center mb-4">
                  <MessageCircle size={17} className="text-white" />
                </div>
                <h2 className="font-serif text-2xl text-stone-900 mb-1.5">
                  New Conversation
                </h2>
                <p className="text-stone-400 text-sm font-sans leading-[1.6] tracking-wide">
                  Start a private dialogue with your advisor.
                </p>
              </div>

              {/* Form */}
              <div className="px-7 py-6 space-y-5">
                {/* Journey selector */}
                <div>
                  <label
                    htmlFor="journey-select"
                    className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2"
                  >
                    Journey
                  </label>
                  <select
                    id="journey-select"
                    value={selectedJourneyId}
                    onChange={(e) => setSelectedJourneyId(e.target.value)}
                    disabled={isCreating}
                    className={cn(
                      'w-full px-4 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl',
                      'font-sans text-sm text-stone-700',
                      'focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      'appearance-none'
                    )}
                  >
                    <option value="">Select a journey...</option>
                    {journeys.map((journey) => (
                      <option key={journey.id} value={journey.id}>
                        {journey.title} ({journey.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Advisor selector */}
                <div>
                  <label
                    htmlFor="advisor-select"
                    className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2"
                  >
                    Advisor
                  </label>
                  <select
                    id="advisor-select"
                    value={selectedAdvisorId}
                    onChange={(e) => setSelectedAdvisorId(e.target.value)}
                    disabled={isCreating}
                    className={cn(
                      'w-full px-4 py-3.5 bg-stone-50 border border-stone-200/60 rounded-xl',
                      'font-sans text-sm text-stone-700',
                      'focus:outline-none focus:ring-2 focus:ring-stone-300/50 focus:border-stone-300',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      'appearance-none'
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
              </div>

              {/* Footer */}
              <div className="px-7 pb-7 flex gap-3">
                <button
                  onClick={handleCloseModal}
                  disabled={isCreating}
                  className="flex-1 py-3.5 bg-stone-100 text-stone-500 font-sans text-[13px] font-medium tracking-wide rounded-full hover:bg-stone-200 transition-all disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateThread}
                  disabled={!canCreate}
                  className={cn(
                    'flex-1 py-3.5 font-sans text-[13px] font-semibold tracking-wide rounded-full transition-all flex items-center justify-center gap-2.5',
                    canCreate
                      ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
                      : 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  )}
                >
                  {isCreating ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Creating...
                    </>
                  ) : (
                    'Start Conversation'
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
