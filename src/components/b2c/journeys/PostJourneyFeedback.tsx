'use client';

/**
 * Post-Journey Reflection
 * Emotional feedback capture after travel
 * Simple, calm, unhurried — like a private journal entry
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const MOODS = [
  { emoji: '\uD83D\uDE14', label: 'Disappointing', value: 1 },
  { emoji: '\uD83D\uDE10', label: 'As Expected', value: 2 },
  { emoji: '\uD83D\uDE42', label: 'Pleasant', value: 3 },
  { emoji: '\uD83D\uDE0A', label: 'Wonderful', value: 4 },
  { emoji: '\u2728', label: 'Transcendent', value: 5 },
];

interface PostJourneyFeedbackProps {
  journeyTitle: string;
  onSubmitted?: () => void;
}

export function PostJourneyFeedback({ journeyTitle, onSubmitted }: PostJourneyFeedbackProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood) return;
    setSubmitted(true);
    onSubmitted?.();
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-sand-200/60 rounded-2xl p-8 sm:p-10 text-center shadow-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-14 h-14 bg-rose-50 border border-rose-200/60 rounded-full flex items-center justify-center mx-auto mb-5"
        >
          <Sparkles className="w-6 h-6 text-rose-400" />
        </motion.div>
        <h3 className="font-serif text-2xl text-stone-900 mb-3">Thank You for Sharing</h3>
        <p className="text-stone-500 text-sm font-sans leading-[1.7] tracking-wide max-w-sm mx-auto">
          Your reflection has been received. Your profile has been quietly updated
          — your next experience will be even more precisely yours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-sand-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
      <div className="mb-7">
        <div className="w-10 h-px bg-rose-300 mb-5" />
        <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
          Your Reflection
        </p>
        <h3 className="font-serif text-2xl text-stone-900 mb-2">
          How Did It Feel?
        </h3>
        <p className="text-stone-400 text-sm font-sans leading-[1.7] tracking-wide">
          There are no wrong answers. This is only for you.
        </p>
      </div>

      {/* Mood selection */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-8">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={cn(
              'flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-300',
              selectedMood === mood.value
                ? 'border-rose-400 bg-rose-50/40 shadow-sm'
                : 'border-sand-200/60 bg-sand-50/50 hover:border-rose-300'
            )}
          >
            <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
            <span className={cn(
              'text-[10px] font-sans text-center leading-tight hidden sm:block tracking-wide',
              selectedMood === mood.value ? 'text-rose-500' : 'text-stone-400'
            )}>{mood.label}</span>
          </button>
        ))}
      </div>

      {/* Reflection textarea */}
      <div className="mb-7">
        <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5">
          Reflection
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="A moment, a feeling, something that stays with you... (optional)"
          rows={3}
          className="w-full px-5 py-4 rounded-xl border border-sand-200/60 bg-sand-50 text-stone-700 font-sans text-sm placeholder-stone-300 resize-none focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all leading-[1.8] tracking-wide"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className={cn(
          'w-full py-3.5 rounded-full font-sans text-[13px] font-semibold tracking-wide transition-all flex items-center justify-center gap-2.5',
          selectedMood
            ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg'
            : 'bg-sand-100 text-stone-300 cursor-not-allowed'
        )}
      >
        Share My Reflection
      </button>
    </div>
  );
}
