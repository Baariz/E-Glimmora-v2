'use client';

/**
 * Post-Journey Reflection
 * Emotional feedback capture after travel
 * Simple, calm, unhurried — like a private journal entry
 */

import { useEffect, useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { useServices } from '@/lib/hooks/useServices';
import { logger } from '@/lib/utils/logger';

const MOODS = [
  { emoji: '\uD83D\uDE14', label: 'Disappointing', value: 1 },
  { emoji: '\uD83D\uDE10', label: 'As Expected', value: 2 },
  { emoji: '\uD83D\uDE42', label: 'Pleasant', value: 3 },
  { emoji: '\uD83D\uDE0A', label: 'Wonderful', value: 4 },
  { emoji: '\u2728', label: 'Transcendent', value: 5 },
];

interface PostJourneyFeedbackProps {
  journeyId: string;
  journeyTitle: string;
  canSubmit?: boolean;
  onSubmitted?: () => void;
}

export function PostJourneyFeedback({ journeyId, canSubmit = true, onSubmitted }: PostJourneyFeedbackProps) {
  const services = useServices();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const existing = await services.journey.getFeedback(journeyId);
        if (!cancelled && existing) {
          setSelectedMood(existing.mood);
          setReflection(existing.reflection ?? '');
          setTags(existing.emotionalTags ?? []);
          setSubmitted(true);
        }
      } catch (err) {
        logger.warn('Feedback', 'load existing failed', { journeyId, err });
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, journeyId]);

  const addTag = (raw: string) => {
    const t = raw.trim().toLowerCase();
    if (!t || tags.includes(t) || tags.length >= 8) return;
    setTags((prev) => [...prev, t]);
    setTagDraft('');
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const onTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === 'Backspace' && !tagDraft && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood || !canSubmit) return;
    setSubmitting(true);
    logger.action('Feedback', 'submit', {
      journeyId,
      mood: selectedMood,
      tagCount: tags.length,
    });
    try {
      await services.journey.submitFeedback(journeyId, {
        mood: selectedMood,
        reflection: reflection || undefined,
        emotional_tags: tags.length ? tags : undefined,
      });
      // Backend auto-archives on feedback submit for EXECUTED journeys (Phase 4 §4.1),
      // but we still fire the explicit SUBMIT_FEEDBACK transition for mock-mode parity.
      try {
        await services.journey.transitionJourney(journeyId, 'SUBMIT_FEEDBACK');
      } catch (transitionErr) {
        logger.debug('Feedback', 'transition skipped (likely auto-archived)', {
          journeyId,
        });
      }
      setSubmitted(true);
      onSubmitted?.();
    } catch (err) {
      logger.error('Feedback', 'submit failed', err, { journeyId });
      toast.error('Unable to submit your reflection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white border border-sand-200/60 rounded-2xl p-8 sm:p-10 flex items-center justify-center gap-2 text-stone-400 text-sm font-sans shadow-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

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

      {/* Emotional tags (Phase 4 §4.1) */}
      <div className="mb-7">
        <label className="block text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-2.5">
          Emotional Tags <span className="text-stone-300 normal-case tracking-normal">(optional, up to 8)</span>
        </label>
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-xl border border-sand-200/60 bg-sand-50 min-h-[44px]">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-[11px] font-sans tracking-wide"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="text-rose-400 hover:text-rose-700"
                aria-label={`Remove tag ${t}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            onKeyDown={onTagKeyDown}
            onBlur={() => tagDraft && addTag(tagDraft)}
            placeholder={tags.length ? '' : 'profound, stillness, gratitude...'}
            disabled={tags.length >= 8}
            className="flex-1 min-w-[120px] bg-transparent text-stone-700 font-sans text-sm placeholder-stone-300 focus:outline-none tracking-wide"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedMood || submitting || !canSubmit}
        className={cn(
          'w-full py-3.5 rounded-full font-sans text-[13px] font-semibold tracking-wide transition-all flex items-center justify-center gap-2.5',
          selectedMood && canSubmit && !submitting
            ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg'
            : 'bg-sand-100 text-stone-300 cursor-not-allowed'
        )}
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? 'Submitting…' : 'Share My Reflection'}
      </button>
    </div>
  );
}
