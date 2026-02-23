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
import { Lock, Unlock, Eye, EyeOff, Shield, X } from 'lucide-react';

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
      {/* Toggle section */}
      <div className={cn('flex items-center gap-5', className)}>
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          journey.isInvisible ? 'bg-rose-50' : 'bg-stone-100'
        )}>
          {journey.isInvisible ? (
            <Shield className="w-5 h-5 text-rose-500" />
          ) : (
            <Eye className="w-5 h-5 text-stone-400" />
          )}
        </div>

        <div className="flex-1">
          <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-1">
            Privacy Control
          </p>
          <p className="text-stone-700 text-sm font-sans font-medium mb-0.5">
            Invisible Itinerary
          </p>
          <p className="text-stone-400 text-[11px] font-sans leading-[1.7] tracking-wide">
            {journey.isInvisible
              ? 'This journey is hidden from all advisors and relationship managers'
              : 'Your relationship manager can view and assist with this journey'}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={cn(
            'relative w-14 h-7 rounded-full transition-colors duration-300 disabled:opacity-50 flex-shrink-0',
            journey.isInvisible ? 'bg-rose-500' : 'bg-sand-200'
          )}
        >
          <motion.div
            className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
            animate={{ left: journey.isInvisible ? 28 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {journey.isInvisible ? (
              <Lock className="w-3 h-3 text-rose-500" />
            ) : (
              <Unlock className="w-3 h-3 text-stone-400" />
            )}
          </motion.div>
        </button>
      </div>

      {/* Confirmation modal (only when making visible) */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isToggling && setShowConfirm(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowConfirm(false)}
                className="absolute top-5 right-5 text-stone-300 hover:text-stone-500 transition-colors"
                disabled={isToggling}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-7">
                <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  <Eye className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="font-serif text-2xl text-stone-900 mb-3">
                  Make Journey Visible?
                </h2>
                <p className="text-stone-500 text-sm font-sans leading-[1.7] tracking-wide">
                  This journey is currently hidden from all advisors and relationship managers.
                  Making it visible will allow them to see and assist with coordination.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isToggling}
                  className="text-stone-400 hover:text-stone-600 font-sans text-[13px] font-medium transition-colors disabled:opacity-40"
                >
                  Keep Hidden
                </button>
                <button
                  onClick={performToggle}
                  disabled={isToggling}
                  className="flex-1 px-8 py-3.5 bg-rose-600 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-rose-700 transition-all disabled:opacity-40 flex items-center justify-center gap-2.5 shadow-lg"
                >
                  {isToggling ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
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
