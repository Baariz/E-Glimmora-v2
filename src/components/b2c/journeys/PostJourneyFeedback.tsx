'use client';

/**
 * Post-Journey Reflection
 * Emotional feedback capture after travel
 * Simple, calm, unhurried — like a private journal entry
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const MOODS = [
  { emoji: '\uD83D\uDE14', label: 'Disappointing', value: 1 },
  { emoji: '\uD83D\uDE10', label: 'As expected', value: 2 },
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
        className="bg-white border border-sand-200 rounded-2xl p-8 text-center"
      >
        <p className="text-3xl mb-4">{'\u2728'}</p>
        <h3 className="font-serif text-xl text-rose-900 mb-2">Thank you for sharing.</h3>
        <p className="text-sand-600 font-sans text-sm leading-relaxed">
          Your reflection has been received. Your Élan profile has been quietly updated
          — your next experience will be even more precisely yours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-8">
      <div className="mb-6">
        <p className="text-sand-500 text-xs font-sans uppercase tracking-widest mb-1">Your Reflection</p>
        <h3 className="font-serif text-2xl text-rose-900">How was {journeyTitle}?</h3>
        <p className="text-sand-600 font-sans text-sm mt-1">There are no wrong answers. This is only for you.</p>
      </div>

      <div className="flex items-center justify-between gap-3 mb-8">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={cn(
              'flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              selectedMood === mood.value
                ? 'border-rose-400 bg-rose-50 scale-105 shadow-sm'
                : 'border-sand-200 bg-white hover:border-sand-300'
            )}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className={cn(
              'text-xs font-sans text-center leading-tight',
              selectedMood === mood.value ? 'text-rose-700' : 'text-sand-500'
            )}>{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="A moment, a feeling, something that stays with you... (optional)"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-sand-50 text-rose-900 font-sans text-sm placeholder-sand-400 resize-none focus:outline-none focus:border-rose-300 focus:ring-1 focus:ring-rose-100"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className={cn(
          'w-full py-3 rounded-xl font-sans font-medium text-sm transition-all',
          selectedMood
            ? 'bg-rose-900 text-white hover:bg-rose-800'
            : 'bg-sand-100 text-sand-400 cursor-not-allowed'
        )}
      >
        Share My Reflection
      </button>
    </div>
  );
}
