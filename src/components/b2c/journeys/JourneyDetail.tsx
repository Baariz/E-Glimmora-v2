'use client';

/**
 * Journey Detail Component
 * Editorial narrative content — no hero (hero is now in the page).
 * Displays emotional objective, full narrative, reasoning, and risk summary.
 */

import { Target, Lightbulb, AlertTriangle, Sparkles } from 'lucide-react';
import type { Journey } from '@/lib/types/entities';
import { cn } from '@/lib/utils/cn';

interface JourneyDetailProps {
  journey: Journey;
  className?: string;
}

export function JourneyDetail({ journey, className }: JourneyDetailProps) {
  return (
    <article className={cn('max-w-4xl', className)}>
      {/* Emotional Objective */}
      {journey.emotionalObjective && (
        <div className="mb-10 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/60 rounded-2xl p-7 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-rose-400 text-[10px] font-sans font-medium uppercase tracking-[4px] mb-2">
                Emotional Objective
              </p>
              <p className="text-stone-700 text-base font-sans leading-[1.8] tracking-wide">
                {journey.emotionalObjective}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Narrative */}
      <div className="mb-10">
        <div className="w-10 h-px bg-rose-300 mb-5" />
        <div className="flex items-center gap-3 mb-4">
          <p className="text-rose-400 text-[10px] font-sans uppercase tracking-[5px]">The Narrative</p>
          {journey.source === 'ai' && (
            <span className="inline-flex items-center gap-1 text-[9px] font-sans uppercase tracking-[3px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
              <Sparkles size={9} /> AI Curated
            </span>
          )}
        </div>
        <div className="text-stone-600 text-base sm:text-lg font-sans leading-[1.9] tracking-wide whitespace-pre-line">
          {journey.narrative}
        </div>
      </div>

      {/* Strategic Reasoning */}
      {journey.strategicReasoning && (
        <div className="mb-10 bg-white border border-sand-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-amber-500 text-[10px] font-sans font-medium uppercase tracking-[4px] mb-2">
                Strategic Reasoning
              </p>
              <p className="text-stone-600 text-base font-sans leading-[1.8] tracking-wide">
                {journey.strategicReasoning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Summary */}
      {journey.riskSummary && (
        <div className="mb-10 bg-white border border-amber-200/60 rounded-2xl p-7 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-amber-500 text-[10px] font-sans font-medium uppercase tracking-[4px] mb-2">
                Risk Summary
              </p>
              <p className="text-stone-600 text-base font-sans leading-[1.8] tracking-wide">
                {journey.riskSummary}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
