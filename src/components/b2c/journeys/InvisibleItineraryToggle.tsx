'use client';

/**
 * Invisible Itinerary Toggle (JRNY-08)
 * Toggle journey.isInvisible with lock/unlock icons.
 *
 * Invisible itineraries are hidden from all other roles (RM, advisors, etc.).
 * This is a privacy sovereignty feature.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

import { useServices } from '@/lib/hooks/useServices';
import { cn } from '@/lib/utils/cn';

import type { Journey } from '@/lib/types/entities';

interface InvisibleItineraryToggleProps {
  journey: Journey;
  onToggled: (updatedJourney: Journey) => void;
  className?: string;
}

export function InvisibleItineraryToggle({
  journey,
  onToggled,
  className,
}: InvisibleItineraryToggleProps) {
  const services = useServices();
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = async () => {
    // If making visible, confirm first
    if (journey.isInvisible) {
      setShowConfirm(true);
      return;
    }

    // If making invisible, do it directly
    await performToggle();
  };

  const performToggle = async () => {
    setIsToggling(true);

    try {
      const updatedJourney = await services.journey.updateJourney(journey.id, {
        isInvisible: !journey.isInvisible,
      });

      setShowConfirm(false);
      onToggled(updatedJourney);
    } catch (error) {
      console.error('Failed to toggle invisible itinerary:', error);
      alert('Failed to update visibility. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex items-center gap-2">
          {journey.isInvisible ? (
            <EyeOff className="w-5 h-5 text-rose-900" />
          ) : (
            <Eye className="w-5 h-5 text-sand-600" />
          )}
          <div>
            <p className="text-sm font-sans font-semibold text-sand-900">
              Invisible Itinerary
            </p>
            <p className="text-xs font-sans text-sand-600">
              {journey.isInvisible
                ? 'Hidden from all advisors and relationship managers'
                : 'Visible to your relationship manager'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={cn(
            'relative w-14 h-7 rounded-full transition-colors disabled:opacity-50',
            journey.isInvisible ? 'bg-rose-900' : 'bg-sand-300'
          )}
        >
          <motion.div
            className={cn(
              'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center',
              journey.isInvisible ? 'left-7' : 'left-0.5'
            )}
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {journey.isInvisible ? (
              <Lock className="w-3 h-3 text-rose-900" />
            ) : (
              <Unlock className="w-3 h-3 text-sand-600" />
            )}
          </motion.div>
        </button>
      </div>

      {/* Confirmation modal (only when making visible) */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isToggling && setShowConfirm(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-50 rounded-full mb-4">
                  <Eye className="w-6 h-6 text-rose-900" />
                </div>
                <h2 className="text-2xl font-serif font-light text-rose-900 mb-2">
                  Make Journey Visible?
                </h2>
                <p className="text-base font-sans text-sand-700 leading-relaxed">
                  This journey is currently hidden from all advisors and relationship managers.
                  Making it visible will allow them to see and assist with coordination.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isToggling}
                  className="flex-1 px-6 py-3 bg-sand-100 text-sand-900 font-sans font-medium rounded-lg hover:bg-sand-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={performToggle}
                  disabled={isToggling}
                  className="flex-1 px-6 py-3 bg-rose-900 text-rose-50 font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isToggling ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-rose-50 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      Make Visible
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
