

# ÉLAN GLIMMORA — Claude Agent Implementation Prompt V2
# New Features: Season, Advisor Assignment, Status Timeline, Payment, Travel Monitoring
# Codebase: Z:\E-Glimmora-v2

---

## CRITICAL RULES — READ BEFORE ANYTHING ELSE

1. DO NOT TOUCH any existing file unless it appears in "Files to Modify" below
2. DO NOT change any existing component logic, styles, or data
3. ALL data is MOCK/STATIC — no backend, no API calls
4. Follow existing code patterns exactly — same imports, same animation variants, same className conventions
5. This is a CLIENT DEMO for UHNI (Ultra High Net Worth Individuals) — every word, every color, every interaction must feel like a sovereign luxury service
6. Run `pnpm tsc --noEmit` after implementation to verify zero TypeScript errors

---

## LANGUAGE RULES — APPLIES TO EVERY STRING YOU WRITE

UHNI clients are the most discerning people in the world. Every word matters.

| NEVER USE | ALWAYS USE INSTEAD |
|---|---|
| "Journey status: DRAFT" | "Your experience is being shaped" |
| "Submitted successfully" | "Received. Your curation begins now." |
| "Please wait..." | "A moment of patience." |
| "Confirm journey" | "Approve this experience" |
| "Archive" | "Rest this journey" |
| "Error loading" | "We're preparing your view. One moment." |
| "No data found" | "Your next chapter awaits." |
| "Settings" | "Your Preferences" |
| "Processing..." | "Preparing..." |
| "Submit" | "Complete" or context-specific wording |

---

## EXISTING PATTERNS TO FOLLOW

### Animation variants (copy exactly):
```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
```

### B2C color palette:
- Page background: `bg-sand-50`
- Cards: `bg-white border border-sand-200 rounded-2xl`
- Primary text: `text-rose-900`
- Secondary text: `text-sand-600`
- Accent button: `bg-rose-900 text-white hover:bg-rose-800`
- Gold accent: `border-amber-200 text-amber-700 bg-amber-50`

### B2B color palette:
- Page background: `bg-slate-50`
- Cards: `bg-white border border-slate-200 rounded-xl shadow-sm`
- Primary text: `text-slate-800`
- Secondary: `text-slate-500`
- Accent: `bg-blue-600 text-white`
- AGI/Intelligence panels: `bg-slate-800 text-white` (dark — signals intelligence)

### Step component pattern (copy from TravelModeStep.tsx):
```tsx
'use client';
import { UseFormReturn } from 'react-hook-form';didb
import { StepNData } from '@/lib/validation/intent-schemas';

interface StepNProps { form: UseFormReturn<StepNData>; }

export function StepNName({ form }: StepNProps) {
  const selectedValue = form.watch('fieldName');
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Title</h2>
        <p className="text-stone-600 text-lg">Subtitle</p>
      </div>
      {/* card grid */}
    </div>
  );
}
```

---

## PART 1 — INTENT WIZARD: MERGE SEASON INTO TRAVEL MODE (STEP 3)

The wizard currently has 5 steps. We are NOT adding a new step.
Instead, we are merging the Season question INTO the existing Step 3 (Travel Mode).
Step 3 becomes "Travel Style" — one screen, two questions. Wizard stays at 5 steps total.

```
BEFORE (6 steps — too long):          AFTER (5 steps — clean):
Step 1 — Life Phase                   Step 1 — Life Phase
Step 2 — Emotional Drivers            Step 2 — Emotional Drivers
Step 3 — Travel Mode                  Step 3 — Travel Style (MERGED)
Step 4 — Season (separate)                     top: Travel Mode cards
Step 5 — Priorities                            bottom: Season cards
Step 6 — Discretion                   Step 4 — Priorities
                                       Step 5 — Discretion
```

This keeps the wizard feeling effortless. UHNI never feels like they are filling a long form.

### MODIFY FILE: `src/lib/types/entities.ts`

Find the `IntentProfile` interface and add ONE new optional field after `travelMode`:
```tsx
preferredSeason?: 'Summer' | 'Autumn' | 'Winter' | 'Spring' | 'Timeless';
```

### MODIFY FILE: `src/lib/validation/intent-schemas.ts`

Replace the existing Step3Schema with this merged version (travelMode + preferredSeason together).
No renaming of Step4 or Step5 needed — wizard stays at 5 steps:

```tsx
// ============================================================================
// Step 3: Travel Style (Travel Mode + Season — merged into one step)
// ============================================================================

export const Step3Schema = z.object({
  travelMode: z.enum(['Luxury', 'Adventure', 'Wellness', 'Cultural', 'Exclusive Access'], {
    required_error: 'Please select your preferred travel mode',
  }),
  preferredSeason: z.enum(['Summer', 'Autumn', 'Winter', 'Spring', 'Timeless'], {
    required_error: 'Please share your seasonal preference',
  }),
});

export type Step3Data = z.infer<typeof Step3Schema>;
```

Update `IntentProfileMasterSchema` to include preferredSeason — no other changes:
```tsx
export const IntentProfileMasterSchema = z.object({
  lifeStage: Step1Schema.shape.lifeStage,
  emotionalDrivers: Step2Schema.shape.emotionalDrivers,
  travelMode: Step3Schema.shape.travelMode,
  preferredSeason: Step3Schema.shape.preferredSeason,
  priorities: Step4Schema.shape.priorities,
  values: Step4Schema.shape.values,
  discretionPreference: Step5Schema.shape.discretionPreference,
  riskTolerance: Step5Schema.shape.riskTolerance,
});

export type IntentProfileMasterData = z.infer<typeof IntentProfileMasterSchema>;
```

### REPLACE FILE: `src/components/b2c/wizards/steps/TravelModeStep.tsx`

Replace the ENTIRE existing file with this merged version.
Do NOT create a new SeasonStep.tsx — everything lives here in one component:

```tsx
'use client';

/**
 * Step 3: Travel Style (Merged — Travel Mode + Preferred Season)
 * Two questions, one screen — feels effortless, not like a long form
 * Top half: how you travel | Bottom half: when you travel
 */

import { UseFormReturn } from 'react-hook-form';
import { Step3Data } from '@/lib/validation/intent-schemas';
import { cn } from '@/lib/utils/cn';
import { Crown, Mountain, Heart, Palette, Key } from 'lucide-react';

const TRAVEL_MODES = [
  {
    value: 'Luxury' as const,
    icon: Crown,
    title: 'Luxury',
    description: 'Exceptional service, comfort, and refinement in every detail.',
  },
  {
    value: 'Adventure' as const,
    icon: Mountain,
    title: 'Adventure',
    description: 'Unique experiences that challenge and inspire beyond convention.',
  },
  {
    value: 'Wellness' as const,
    icon: Heart,
    title: 'Wellness',
    description: 'Restorative journeys focused on health, balance, and rejuvenation.',
  },
  {
    value: 'Cultural' as const,
    icon: Palette,
    title: 'Cultural',
    description: 'Deep immersion in art, history, and authentic local traditions.',
  },
  {
    value: 'Exclusive Access' as const,
    icon: Key,
    title: 'Exclusive Access',
    description: 'Private experiences and invitation-only opportunities unavailable to most.',
  },
];

const SEASONS = [
  { value: 'Summer' as const,   emoji: '☀️', title: 'Summer',                     feeling: 'Vibrant & Expansive'   },
  { value: 'Autumn' as const,   emoji: '🍂', title: 'Autumn',                     feeling: 'Rich & Contemplative'  },
  { value: 'Winter' as const,   emoji: '❄️', title: 'Winter',                     feeling: 'Rare & Immersive'      },
  { value: 'Spring' as const,   emoji: '🌸', title: 'Spring',                     feeling: 'Hopeful & Alive'       },
  { value: 'Timeless' as const, emoji: '∞',  title: 'When the moment calls',      feeling: 'Sovereign & Fluid'     },
];

interface TravelModeStepProps {
  form: UseFormReturn<Step3Data>;
}

export function TravelModeStep({ form }: TravelModeStepProps) {
  const selectedMode   = form.watch('travelMode');
  const selectedSeason = form.watch('preferredSeason');

  return (
    <div className="space-y-10">

      {/* ── Section 1: Travel Mode ── */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-3">
            How do you prefer to travel?
          </h2>
          <p className="text-stone-600 text-base">
            Select the style that best reflects your ideal experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {TRAVEL_MODES.map((mode) => {
            const Icon       = mode.icon;
            const isSelected = selectedMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => form.setValue('travelMode', mode.value, { shouldValidate: true })}
                className={cn(
                  'text-left p-5 rounded-2xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-rose-500 bg-rose-50 shadow-md scale-[1.01]'
                    : 'border-stone-200 bg-white hover:border-rose-300 hover:shadow-sm'
                )}
              >
                <Icon className={cn('w-6 h-6 mb-3', isSelected ? 'text-rose-600' : 'text-stone-400')} />
                <h3 className="font-serif text-lg text-stone-900 mb-1">{mode.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{mode.description}</p>
              </button>
            );
          })}
        </div>

        {form.formState.errors.travelMode && (
          <p className="text-center text-rose-600 text-sm mt-2">
            {form.formState.errors.travelMode.message}
          </p>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4 max-w-3xl mx-auto">
        <div className="flex-1 h-px bg-stone-100" />
        <p className="text-stone-400 text-xs font-sans uppercase tracking-widest">And</p>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      {/* ── Section 2: Season ── */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mb-2">
            When does your soul feel most alive?
          </h2>
          <p className="text-stone-600 text-base">
            This shapes the texture and timing of every experience we curate.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-3xl mx-auto">
          {SEASONS.map((season) => {
            const isSelected = selectedSeason === season.value;
            return (
              <button
                key={season.value}
                type="button"
                onClick={() => form.setValue('preferredSeason', season.value, { shouldValidate: true })}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
                  isSelected
                    ? 'border-rose-500 bg-rose-50 shadow-md scale-[1.02]'
                    : 'border-stone-200 bg-white hover:border-rose-300 hover:shadow-sm'
                )}
              >
                <span className="text-2xl">{season.emoji}</span>
                <span className={cn(
                  'font-serif text-sm text-center leading-tight',
                  isSelected ? 'text-rose-900' : 'text-stone-700'
                )}>
                  {season.title}
                </span>
                <span className={cn(
                  'text-xs text-center leading-tight',
                  isSelected ? 'text-rose-500' : 'text-stone-400'
                )}>
                  {season.feeling}
                </span>
              </button>
            );
          })}
        </div>

        {form.formState.errors.preferredSeason && (
          <p className="text-center text-rose-600 text-sm mt-2">
            {form.formState.errors.preferredSeason.message}
          </p>
        )}
      </div>

    </div>
  );
}
```

### MODIFY FILE: `src/components/b2c/wizards/IntentWizard.tsx`

Only ONE change needed — in the final submission block, add `preferredSeason`:
```tsx
preferredSeason: validatedData.preferredSeason,
```

Everything else in IntentWizard.tsx stays exactly the same:
- `totalSteps: 5` — no change
- Schema imports Step1–Step5 — no change
- `getCurrentStepSchema()` switch — no change
- `renderStep()` case 3 still renders `<TravelModeStep>` — no change
- No SeasonStep import needed

---

---

## PART 2 — B2C: JOURNEY STATUS TIMELINE

### NEW FILE: `src/components/b2c/journeys/JourneyStatusTimeline.tsx`

```tsx
'use client';

/**
 * Journey Status Timeline
 * 10-step calm, luxury progress view for UHNI
 * Shows current step with expected timing — no percentages, no progress bars
 * Language is warm and confident, like a private secretary speaking
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { JourneyStatus } from '@/lib/types/entities';

interface Step {
  number: number;
  label: string;
  clientMessage: string;     // What UHNI sees as status message
  expectedTiming: string;    // Calm estimate — no hard dates
}

const JOURNEY_STEPS: Step[] = [
  {
    number: 1,
    label: 'Intent Received',
    clientMessage: 'Your experience is being shaped.',
    expectedTiming: 'Immediate',
  },
  {
    number: 2,
    label: 'Intelligence Preparing',
    clientMessage: 'Our intelligence is preparing your curated brief.',
    expectedTiming: 'Within a few hours',
  },
  {
    number: 3,
    label: 'Advisor Review',
    clientMessage: 'Your advisor is reviewing the finest options for you.',
    expectedTiming: 'Typically within 24 hours',
  },
  {
    number: 4,
    label: 'Awaiting Your Conversation',
    clientMessage: 'Your advisor will be in touch to present your options.',
    expectedTiming: 'Within 1–2 days',
  },
  {
    number: 5,
    label: 'Securing Your Access',
    clientMessage: 'Your exclusive access is being locked in.',
    expectedTiming: 'Typically 2–3 days',
  },
  {
    number: 6,
    label: 'Confirmation',
    clientMessage: 'A private confirmation is ready for your approval.',
    expectedTiming: 'At your convenience',
  },
  {
    number: 7,
    label: 'Pre-Departure Brief',
    clientMessage: 'Your advisor is preparing your arrival summary.',
    expectedTiming: '48 hours before travel',
  },
  {
    number: 8,
    label: 'Your Journey',
    clientMessage: 'Enjoy your experience. We are quietly here if needed.',
    expectedTiming: 'During travel',
  },
  {
    number: 9,
    label: 'Welcome Back',
    clientMessage: 'We hope your experience was everything it should be.',
    expectedTiming: 'On your return',
  },
  {
    number: 10,
    label: 'Reflection',
    clientMessage: 'Share how it felt. Your future experiences begin here.',
    expectedTiming: 'When you are ready',
  },
];

// Map existing JourneyStatus enum to step numbers
export function getStepFromStatus(status: JourneyStatus): number {
  const map: Record<JourneyStatus, number> = {
    [JourneyStatus.DRAFT]: 1,
    [JourneyStatus.RM_REVIEW]: 3,
    [JourneyStatus.COMPLIANCE_REVIEW]: 5,
    [JourneyStatus.APPROVED]: 6,
    [JourneyStatus.PRESENTED]: 7,
    [JourneyStatus.EXECUTED]: 8,
    [JourneyStatus.ARCHIVED]: 9,
  };
  return map[status] ?? 1;
}

interface JourneyStatusTimelineProps {
  status: JourneyStatus;
  journeyTitle: string;
}

export function JourneyStatusTimeline({ status, journeyTitle }: JourneyStatusTimelineProps) {
  const currentStep = getStepFromStatus(status);
  const currentStepData = JOURNEY_STEPS[currentStep - 1];

  return (
    <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-800 px-8 py-6">
        <p className="text-rose-200 text-xs font-sans uppercase tracking-widest mb-1">
          Your Experience
        </p>
        <h3 className="font-serif text-xl text-white mb-3">{journeyTitle}</h3>
        {/* Current status message */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-rose-100 font-sans text-sm">{currentStepData.clientMessage}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-8 py-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-sand-200" />

          <div className="space-y-0">
            {JOURNEY_STEPS.map((step, index) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isFuture = step.number > currentStep;

              // Only show current step ±3 steps — hide distant future steps to keep clean
              const isVisible = Math.abs(step.number - currentStep) <= 3;
              if (!isVisible && isFuture) return null;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex items-start gap-5 pb-5"
                >
                  {/* Step dot */}
                  <div className={cn(
                    'relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                    isCompleted && 'bg-emerald-100 border-2 border-emerald-500',
                    isCurrent && 'bg-rose-900 border-2 border-rose-900 shadow-md shadow-rose-200',
                    isFuture && 'bg-white border-2 border-sand-200',
                  )}>
                    {isCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                    {isCurrent && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                    {isFuture && (
                      <span className="text-xs text-sand-400 font-sans">{step.number}</span>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between gap-4">
                      <p className={cn(
                        'font-sans text-sm font-medium',
                        isCompleted && 'text-emerald-700',
                        isCurrent && 'text-rose-900',
                        isFuture && 'text-sand-400',
                      )}>
                        {step.label}
                      </p>
                      {/* Timing — only show for current and immediate next */}
                      {(isCurrent || (isFuture && step.number === currentStep + 1)) && (
                        <span className={cn(
                          'text-xs font-sans px-2 py-0.5 rounded-full',
                          isCurrent
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-sand-50 text-sand-500 border border-sand-200'
                        )}>
                          {step.expectedTiming}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-xs font-sans text-emerald-600">Completed</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Show remaining count if hidden steps exist */}
        {currentStep < 7 && (
          <p className="text-xs text-sand-400 font-sans text-center mt-2">
            {10 - currentStep - 3} further steps ahead
          </p>
        )}
      </div>
    </div>
  );
}
```

---

## PART 3 — B2C: POST-JOURNEY FEEDBACK

### NEW FILE: `src/components/b2c/journeys/PostJourneyFeedback.tsx`

```tsx
'use client';

/**
 * Post-Journey Reflection
 * Emotional feedback capture after travel
 * Simple, calm, unhurried — like a private journal entry
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const MOODS = [
  { emoji: '😔', label: 'Disappointing', value: 1 },
  { emoji: '😐', label: 'As expected', value: 2 },
  { emoji: '🙂', label: 'Pleasant', value: 3 },
  { emoji: '😊', label: 'Wonderful', value: 4 },
  { emoji: '✨', label: 'Transcendent', value: 5 },
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
        <p className="text-3xl mb-4">✨</p>
        <h3 className="font-serif text-xl text-rose-900 mb-2">
          Thank you for sharing.
        </h3>
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
        <p className="text-sand-500 text-xs font-sans uppercase tracking-widest mb-1">
          Your Reflection
        </p>
        <h3 className="font-serif text-2xl text-rose-900">
          How was {journeyTitle}?
        </h3>
        <p className="text-sand-600 font-sans text-sm mt-1">
          There are no wrong answers. This is only for you.
        </p>
      </div>

      {/* Mood selector */}
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
            )}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Reflection textarea */}
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
```

---

## PART 4 — B2C: NEXT JOURNEY SUGGESTIONS

### NEW FILE: `src/components/b2c/journeys/NextJourneyPanel.tsx`

```tsx
'use client';

/**
 * Predictive Next Journey Panel
 * AGI anticipates the next experience — shown after journey completion
 * Feels like the platform "knows" you
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const SUGGESTED_JOURNEYS = [
  {
    id: 'next-1',
    destination: 'Aman Venice',
    country: 'Italy',
    category: 'Private Retreat',
    match: 'Aligns with your need for restoration and absolute privacy.',
    score: 4,
    timing: 'Spring — April window suggested',
    emoji: '🇮🇹',
  },
  {
    id: 'next-2',
    destination: 'Kyoto Exclusive Ryokan',
    country: 'Japan',
    category: 'Cultural Immersion',
    match: 'Resonates with your legacy values and contemplative nature.',
    score: 5,
    timing: 'Autumn — October, cherry season ending',
    emoji: '🇯🇵',
  },
  {
    id: 'next-3',
    destination: 'Maldives Private Island',
    country: 'Maldives',
    category: 'Exclusive Seclusion',
    match: 'Matches your desire for complete seclusion and silence.',
    score: 4,
    timing: 'Winter — December through February',
    emoji: '🏝️',
  },
];

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            dot <= score ? 'bg-amber-500' : 'bg-sand-200'
          )}
        />
      ))}
    </div>
  );
}

export function NextJourneyPanel() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-rose-900 rounded-full" />
        <div>
          <p className="text-sand-500 text-xs font-sans uppercase tracking-widest">
            ◈ AGI Anticipates
          </p>
          <h3 className="font-serif text-xl text-rose-900">
            Your next chapter, already taking shape.
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUGGESTED_JOURNEYS.map((journey, i) => (
          <motion.div
            key={journey.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-amber-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{journey.emoji}</span>
              <span className="text-xs font-sans px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {journey.category}
              </span>
            </div>

            <h4 className="font-serif text-lg text-rose-900 mb-1">{journey.destination}</h4>
            <p className="text-sand-500 text-xs font-sans mb-3">{journey.country}</p>

            <p className="text-sand-600 text-sm font-sans leading-relaxed mb-3">
              {journey.match}
            </p>

            <div className="flex items-center justify-between mb-4">
              <ScoreDots score={journey.score} />
              <span className="text-xs text-sand-400 font-sans">{journey.timing}</span>
            </div>

            <Link
              href="/intent"
              className="block w-full text-center py-2 rounded-lg bg-rose-900 text-white text-sm font-sans font-medium hover:bg-rose-800 transition-colors"
            >
              Begin Curation
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

## PART 5 — B2C: AI CHATBOT WIDGET

### NEW FILE: `src/components/b2c/chat/AIChatWidget.tsx`

```tsx
'use client';

/**
 * Élan AI Assistant Widget — B2C (UHNI)
 * Floating chat always available on all B2C pages
 * Calm, discreet, never intrusive
 * Mock responses — simulates AGI assistance
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: Date;
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const MOCK_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['status', 'journey', 'where', 'progress'],
    response: "Your experience is actively being curated. Your advisor will be in touch within 24 hours with refined options for your consideration.",
  },
  {
    keywords: ['when', 'time', 'how long', 'wait'],
    response: "Your advisor typically makes contact within 24 hours of intent submission. We never rush — every detail is attended to with complete care.",
  },
  {
    keywords: ['hotel', 'stay', 'accommodation', 'suite'],
    response: "Your accommodation preferences are fully reflected in your profile. Your advisor will present only the most aligned options — you will never see a long list.",
  },
  {
    keywords: ['jet', 'flight', 'aviation', 'fly', 'aircraft'],
    response: "Private aviation arrangements are coordinated entirely by our operations team. All details will be confirmed before your departure — without you needing to coordinate anything.",
  },
  {
    keywords: ['privacy', 'discretion', 'private', 'secure'],
    response: "Your privacy is our highest principle. Your movements, preferences, and arrangements are known only to your Élan team — and only to those who need to know.",
  },
  {
    keywords: ['payment', 'cost', 'price', 'confirm', 'pay'],
    response: "Financial confirmation is always a private, seamless step — handled through your pre-authorized account or a secure link from your advisor. Never a retail checkout.",
  },
  {
    keywords: ['advisor', 'rm', 'contact', 'speak', 'call'],
    response: "Your dedicated advisor is available via the Messages section. For urgent matters, they will always respond within the hour.",
  },
  {
    keywords: ['help', 'assist', 'support', 'question'],
    response: "I'm here for anything you need — journey status, advisor contact, privacy settings, or any question about your Élan experience.",
  },
];

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  const match = MOCK_RESPONSES.find(r => r.keywords.some(k => lower.includes(k)));
  return match?.response ?? "I'm here to assist with your Élan experience. For specific journey details, your advisor is the finest resource — or feel free to ask me anything.";
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init',
  role: 'assistant',
  text: `${getTimeGreeting()}. I'm your Élan assistant. How may I assist with your experience today?`,
  timestamp: new Date(),
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasChatted, setHasChatted] = useState(false); // pulse stops after first open
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AGI thinking delay
    await new Promise(resolve => setTimeout(resolve, 700));

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: getMockResponse(text),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-80 bg-white rounded-2xl shadow-2xl border border-sand-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-rose-900 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-sans text-sm font-medium text-white">Élan Assistant</p>
                <p className="font-sans text-xs text-rose-300">Always here for you</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-rose-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto px-4 py-4 space-y-3 bg-sand-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    'max-w-[85%] px-3 py-2 rounded-xl font-sans text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-rose-900 text-white rounded-br-sm'
                      : 'bg-white border border-sand-200 text-rose-900 rounded-bl-sm shadow-sm'
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-sand-200 px-3 py-2 rounded-xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-sand-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="flex-1 text-sm font-sans px-3 py-2 rounded-lg bg-sand-50 border border-sand-200 text-rose-900 placeholder-sand-400 focus:outline-none focus:border-rose-300"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  inputValue.trim() && !isTyping
                    ? 'bg-rose-900 text-white hover:bg-rose-800'
                    : 'bg-sand-100 text-sand-300 cursor-not-allowed'
                )}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => { setIsOpen(!isOpen); setHasChatted(true); }}
        className="w-12 h-12 bg-rose-900 text-white rounded-full shadow-lg hover:bg-rose-800 transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={!isOpen && !hasChatted ? { boxShadow: ['0 0 0 0 rgba(136,19,55,0.4)', '0 0 0 8px rgba(136,19,55,0)', '0 0 0 0 rgba(136,19,55,0)'] } : {}}
        transition={!isOpen && !hasChatted ? { repeat: Infinity, duration: 2.5 } : {}}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </motion.button>
    </div>
  );
}
```

---

## PART 6 — B2C: PAYMENT CONFIRMATION SCREEN

This appears at Step 6 (JourneyStatus.APPROVED) — replacing the current plain "Journey Confirmed" badge.

### NEW FILE: `src/components/b2c/journeys/PrivateConfirmation.tsx`

```tsx
'use client';

/**
 * Private Confirmation Screen
 * Shown when journey reaches APPROVED status
 * Payment / confirmation step — no itemized costs, no retail checkout
 * Feels like authorizing through a private bank, not shopping online
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ConfirmationMethod = 'wealth_account' | 'secure_link' | null;

interface PrivateConfirmationProps {
  journeyTitle: string;
  onConfirmed?: () => void;
}

export function PrivateConfirmation({ journeyTitle, onConfirmed }: PrivateConfirmationProps) {
  const [method, setMethod] = useState<ConfirmationMethod>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!method) return;
    setConfirmed(true);
    onConfirmed?.();
  };

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-8 text-center"
      >
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="font-serif text-xl text-emerald-900 mb-2">Your experience is confirmed.</h3>
        <p className="text-emerald-700 font-sans text-sm">
          Your Élan team will prepare your pre-departure brief. Expect to hear from your advisor within 48 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-800 px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-4 h-4 text-rose-300" />
          <p className="text-rose-300 text-xs font-sans uppercase tracking-widest">
            Private Confirmation Required
          </p>
        </div>
        <h3 className="font-serif text-xl text-white">{journeyTitle}</h3>
        <p className="text-rose-200 text-sm font-sans mt-1">
          Your experience has been secured. A private confirmation is all that remains.
        </p>
      </div>

      <div className="px-8 py-6">
        <p className="text-sand-600 font-sans text-sm mb-5">
          Select your preferred confirmation method. No card details are required —
          all transactions are handled through your pre-established arrangement.
        </p>

        {/* Method selection */}
        <div className="space-y-3 mb-6">
          {[
            {
              value: 'wealth_account' as const,
              title: 'Authorize from Preferred Account',
              description: 'Settled through your pre-authorized wealth account. No further details required.',
              icon: '🏛️',
            },
            {
              value: 'secure_link' as const,
              title: 'Receive Secure Confirmation Link',
              description: 'A private link will be sent to your registered contact. Valid for 24 hours.',
              icon: '🔐',
            },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMethod(opt.value)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                method === opt.value
                  ? 'border-rose-400 bg-rose-50'
                  : 'border-sand-200 hover:border-sand-300'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{opt.icon}</span>
                <div>
                  <p className="font-sans text-sm font-medium text-rose-900">{opt.title}</p>
                  <p className="font-sans text-xs text-sand-500 mt-0.5">{opt.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!method}
          className={cn(
            'w-full py-3 rounded-xl font-sans font-medium text-sm transition-all',
            method
              ? 'bg-rose-900 text-white hover:bg-rose-800'
              : 'bg-sand-100 text-sand-400 cursor-not-allowed'
          )}
        >
          Approve This Experience
        </button>

        <p className="text-center text-xs text-sand-400 font-sans mt-3">
          Your advisor is available if you have any questions before confirming.
        </p>
      </div>
    </div>
  );
}
```

---

## PART 7 — B2C: TRAVEL MONITORING SCREEN (UHNI SIDE — SILENT)

### NEW FILE: `src/components/b2c/journeys/LiveJourneyCard.tsx`

```tsx
'use client';

/**
 * Live Journey Card — UHNI View
 * Shown when journey status = EXECUTED (actively travelling)
 * Calm, silent, reassuring — NO tracking data shown to UHNI
 * The UHNI should feel held, not monitored
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function LiveJourneyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gradient-to-br from-rose-900 via-rose-800 to-rose-900 rounded-2xl p-8 text-white text-center"
    >
      {/* Subtle ambient animation */}
      <div className="relative mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-white/60" />
          </div>
        </div>
      </div>

      <p className="text-rose-300 text-xs font-sans uppercase tracking-widest mb-2">
        Live Experience
      </p>
      <h3 className="font-serif text-2xl text-white mb-3">
        Your journey is underway.
      </h3>
      <p className="text-rose-200 font-sans text-sm leading-relaxed mb-8 max-w-sm mx-auto">
        Your Élan team is quietly present. Everything is attended to.
        You need only experience.
      </p>

      <Link
        href="/messages"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-sans text-sm font-medium transition-colors"
      >
        <MessageCircle size={16} />
        One message is all it takes
      </Link>
    </motion.div>
  );
}
```

---

## PART 8 — B2B: AGI BRIEF PANEL

### NEW FILE: `src/components/b2b/governance/AGIBriefPanel.tsx`

```tsx
'use client';

/**
 * AGI Intelligence Brief Panel — Advisor View
 * Dark card — signals intelligence, internal-only
 * Shows ranked hotel options, aviation shortlist, risk summary
 * NEVER shown to UHNI client
 */

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, ChevronUp, Shield, Plane, Building2 } from 'lucide-react';

interface AGIBriefPanelProps {
  journeyId: string;
  clientName: string;
}

const MOCK_HOTELS = [
  {
    name: 'Aman Venice',
    location: 'Venice, Italy',
    privacyScore: 96,
    emotionalMatch: 94,
    riskLevel: 'Low' as const,
    note: 'Private canal entrance. Zero press exposure. Aligned with client discretion tier: High.',
    recommended: true,
  },
  {
    name: 'Hotel de Crillon',
    location: 'Paris, France',
    privacyScore: 88,
    emotionalMatch: 91,
    riskLevel: 'Low' as const,
    note: 'Presidential suite with private access. Minor exposure risk during fashion week.',
    recommended: false,
  },
  {
    name: 'Four Seasons George V',
    location: 'Paris, France',
    privacyScore: 82,
    emotionalMatch: 87,
    riskLevel: 'Medium' as const,
    note: 'High-visibility address. Recommend only if prestige outweighs privacy for this client.',
    recommended: false,
  },
];

const MOCK_JETS = [
  {
    operator: 'VistaJet',
    aircraft: 'Global 7500',
    availability: 'Confirmed' as const,
    note: 'Client-preferred operator. NDA: verified.',
  },
  {
    operator: 'NetJets Europe',
    aircraft: 'Bombardier Challenger 350',
    availability: 'Pending' as const,
    note: 'Backup option. Same privacy and security standards.',
  },
];

type SectionKey = 'hotels' | 'aviation' | 'risk';

export function AGIBriefPanel({ journeyId, clientName }: AGIBriefPanelProps) {
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);
  const [advisorNote, setAdvisorNote] = useState('');

  const toggle = (section: SectionKey) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const riskColor = (level: 'Low' | 'Medium' | 'High') => ({
    Low: 'text-emerald-400 bg-emerald-900/40',
    Medium: 'text-amber-400 bg-amber-900/40',
    High: 'text-red-400 bg-red-900/40',
  }[level]);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-lg">◈</span>
          <div>
            <p className="text-white font-sans font-medium text-sm">AGI Intelligence Brief</p>
            <p className="text-slate-400 text-xs font-sans">For {clientName} — Internal Only</p>
          </div>
        </div>
        <span className="text-xs font-sans px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Confidential
        </span>
      </div>

      <div className="p-6 space-y-4">

        {/* Hotel Recommendations */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle('hotels')}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 text-white">
              <Building2 size={16} className="text-slate-400" />
              <span className="font-sans text-sm font-medium">Hotel Recommendations</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">3 options</span>
            </div>
            {openSection === 'hotels' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {openSection === 'hotels' && (
            <div className="p-4 space-y-3">
              {MOCK_HOTELS.map((hotel, i) => (
                <div key={i} className={cn(
                  'p-4 rounded-lg border',
                  hotel.recommended ? 'border-amber-500/40 bg-amber-900/20' : 'border-slate-600 bg-slate-700/30'
                )}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-sans text-sm font-medium">{hotel.name}</span>
                        {hotel.recommended && (
                          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">AGI Recommended</span>
                        )}
                      </div>
                      <span className="text-slate-400 text-xs">{hotel.location}</span>
                    </div>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', riskColor(hotel.riskLevel))}>
                      {hotel.riskLevel} Risk
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Privacy Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${hotel.privacyScore}%` }} />
                        </div>
                        <span className="text-emerald-400 text-xs font-medium">{hotel.privacyScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Emotional Match</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${hotel.emotionalMatch}%` }} />
                        </div>
                        <span className="text-amber-400 text-xs font-medium">{hotel.emotionalMatch}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{hotel.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aviation */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle('aviation')}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 text-white">
              <Plane size={16} className="text-slate-400" />
              <span className="font-sans text-sm font-medium">Private Aviation Shortlist</span>
            </div>
            {openSection === 'aviation' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {openSection === 'aviation' && (
            <div className="p-4 space-y-2">
              {MOCK_JETS.map((jet, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-sans text-sm font-medium">{jet.operator}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      jet.availability === 'Confirmed' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400'
                    )}>
                      {jet.availability}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{jet.aircraft} — {jet.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Risk Summary */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggle('risk')}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 text-white">
              <Shield size={16} className="text-slate-400" />
              <span className="font-sans text-sm font-medium">Risk & Exposure Summary</span>
            </div>
            {openSection === 'risk' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>

          {openSection === 'risk' && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/40">
                  <p className="text-emerald-400 text-xs font-sans uppercase tracking-wider mb-1">Overall Risk</p>
                  <p className="text-emerald-300 font-sans font-medium">Low</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                  <p className="text-slate-400 text-xs font-sans uppercase tracking-wider mb-1">Privacy Alignment</p>
                  <p className="text-white font-sans font-medium">93 / 100</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                <p className="text-slate-400 text-xs mb-1">Exposure Assessment</p>
                <p className="text-slate-300 text-sm">No known public events during travel window. Political stability: Stable. Media risk: Minimal.</p>
              </div>

              {/* Advisor notes */}
              <div>
                <p className="text-slate-400 text-xs mb-2">Your Notes (Internal)</p>
                <textarea
                  value={advisorNote}
                  onChange={(e) => setAdvisorNote(e.target.value)}
                  placeholder="Add any advisor notes for this brief..."
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 text-xs font-sans placeholder-slate-500 resize-none focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## PART 9 — B2B: SEAMLESS TRAVEL MONITOR (ADVISOR VIEW)

### NEW FILE: `src/components/b2b/governance/TravelMonitorPanel.tsx`

```tsx
'use client';

/**
 * Travel Monitor Panel — Advisor / Operations View
 * Silent background monitoring of live journey
 * Dense, operational, professional — like a quiet control room
 * NEVER shown to UHNI. This is internal only.
 */

import { cn } from '@/lib/utils/cn';
import { Plane, Car, Building2, AlertCircle, CheckCircle } from 'lucide-react';

const MOCK_TRAVEL_DATA = {
  flight: {
    number: 'EK 203',
    route: 'Dubai → London Heathrow',
    status: 'On Schedule' as const,
    departure: '14:30 GST',
    arrival: '18:45 GMT (Est.)',
    aircraft: 'Boeing 777-300ER',
    terminal: 'T3 Arrival',
  },
  transfer: {
    type: 'Ground Transfer',
    route: 'LHR Terminal 3 → Aman London',
    status: 'Confirmed' as const,
    driver: 'Marcus H.',
    vehicle: 'Mercedes S-Class (Tinted)',
    contact: '+44 7XXX XXXXXX',
    eta: '45 minutes from arrival',
  },
  accommodation: {
    property: 'Aman London',
    room: 'Aman Suite — 7th Floor',
    status: 'Ready' as const,
    checkIn: 'Private entrance briefed',
    note: 'Early arrival confirmed. Flowers arranged per preference profile.',
  },
  alerts: [] as string[], // No alerts = all good
};

const statusIcon = (status: 'On Schedule' | 'Confirmed' | 'Ready' | 'Delayed' | 'Pending') => {
  if (status === 'Delayed' || status === 'Pending') return <AlertCircle size={14} className="text-amber-400" />;
  return <CheckCircle size={14} className="text-emerald-400" />;
};

const statusClass = (status: string) =>
  ['Delayed', 'Pending'].includes(status)
    ? 'text-amber-400 bg-amber-900/30'
    : 'text-emerald-400 bg-emerald-900/30';

export function TravelMonitorPanel() {
  const { flight, transfer, accommodation, alerts } = MOCK_TRAVEL_DATA;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-sans text-sm font-medium">Live Journey Monitor</span>
        </div>
        <span className="text-slate-500 text-xs font-sans">Internal — Not visible to client</span>
      </div>

      <div className="p-5 space-y-3">

        {/* Flight */}
        <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <Plane size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-white font-sans text-xs font-medium">
                {flight.number} — {flight.route}
              </span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(flight.status))}>
                {statusIcon(flight.status)} {flight.status}
              </span>
            </div>
            <div className="flex gap-4 text-slate-400 text-xs">
              <span>Dep: {flight.departure}</span>
              <span>Arr: {flight.arrival}</span>
              <span>{flight.terminal}</span>
            </div>
          </div>
        </div>

        {/* Transfer */}
        <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <Car size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-white font-sans text-xs font-medium">{transfer.route}</span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(transfer.status))}>
                {statusIcon(transfer.status)} {transfer.status}
              </span>
            </div>
            <div className="flex gap-4 text-slate-400 text-xs flex-wrap">
              <span>{transfer.driver}</span>
              <span>{transfer.vehicle}</span>
              <span>{transfer.contact}</span>
              <span>ETA: {transfer.eta}</span>
            </div>
          </div>
        </div>

        {/* Accommodation */}
        <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <Building2 size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-white font-sans text-xs font-medium">
                {accommodation.property} — {accommodation.room}
              </span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1', statusClass(accommodation.status))}>
                {statusIcon(accommodation.status)} {accommodation.status}
              </span>
            </div>
            <div className="text-slate-400 text-xs">{accommodation.note}</div>
          </div>
        </div>

        {/* Alerts or all-clear */}
        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-sans">All systems nominal. No alerts.</span>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-amber-900/20 border border-amber-700/30 rounded-lg">
              <AlertCircle size={14} className="text-amber-400" />
              <span className="text-amber-400 text-xs font-sans">{alert}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## PART 10 — B2B: PRE-DEPARTURE BRIEF COMPOSER

### NEW FILE: `src/components/b2b/governance/PreDepartureBrief.tsx`

```tsx
'use client';

/**
 * Pre-Departure Brief Composer
 * Advisor writes a calm, minimal departure summary for the UHNI
 * Split view: editor left, live preview right
 * Feels like drafting a private letter, not filling a form
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { Wand2, Send } from 'lucide-react';

interface PreDepartureBriefProps {
  clientName: string;
  journeyTitle: string;
}

const AGI_TEMPLATE = {
  arrivalSummary: 'Your arrival has been arranged with complete discretion. A dedicated host will greet you privately upon arrival.',
  keyContact: 'Your Élan Experience Host',
  keyContactRole: 'On-Ground Liaison',
  timing: 'All timing has been pre-coordinated. Simply arrive as planned — everything else is handled.',
  discretionLevel: 'High' as const,
  specialInstructions: 'No public-facing itinerary exists. All arrangements are known only to your Élan team and those who need to know.',
};

export function PreDepartureBrief({ clientName, journeyTitle }: PreDepartureBriefProps) {
  const [arrivalSummary, setArrivalSummary] = useState('');
  const [keyContact, setKeyContact] = useState('');
  const [keyContactRole, setKeyContactRole] = useState('');
  const [timing, setTiming] = useState('');
  const [discretionLevel, setDiscretionLevel] = useState<'High' | 'Standard' | 'Custom'>('High');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [sent, setSent] = useState(false);

  const applyTemplate = () => {
    setArrivalSummary(AGI_TEMPLATE.arrivalSummary);
    setKeyContact(AGI_TEMPLATE.keyContact);
    setKeyContactRole(AGI_TEMPLATE.keyContactRole);
    setTiming(AGI_TEMPLATE.timing);
    setDiscretionLevel(AGI_TEMPLATE.discretionLevel);
    setSpecialInstructions(AGI_TEMPLATE.specialInstructions);
  };

  const handleSend = () => {
    setSent(true);
    toast.success('Pre-departure brief sent to client.');
  };

  const hasContent = arrivalSummary || keyContact || timing;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <p className="font-sans text-sm font-medium text-slate-800">Pre-Departure Brief</p>
          <p className="text-slate-500 text-xs font-sans">For {clientName} — {journeyTitle}</p>
        </div>
        <button
          onClick={applyTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 font-sans text-xs font-medium hover:bg-blue-100 transition-colors"
        >
          <Wand2 size={12} />
          Use AGI Template
        </button>
      </div>

      {sent ? (
        <div className="px-6 py-10 text-center">
          <p className="text-emerald-600 font-sans font-medium mb-1">Brief sent successfully.</p>
          <p className="text-slate-400 text-sm font-sans">Client has been notified through their secure channel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Editor */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Arrival Summary
              </label>
              <textarea
                value={arrivalSummary}
                onChange={(e) => setArrivalSummary(e.target.value)}
                rows={3}
                placeholder="Describe the arrival arrangement..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 resize-none focus:outline-none focus:border-blue-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Key Contact
                </label>
                <input
                  value={keyContact}
                  onChange={(e) => setKeyContact(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 focus:outline-none focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <input
                  value={keyContactRole}
                  onChange={(e) => setKeyContactRole(e.target.value)}
                  placeholder="Role / title"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 focus:outline-none focus:border-blue-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Key Timing
              </label>
              <input
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                placeholder="Timing note for client..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 focus:outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Discretion Level
              </label>
              <select
                value={discretionLevel}
                onChange={(e) => setDiscretionLevel(e.target.value as 'High' | 'Standard' | 'Custom')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans focus:outline-none focus:border-blue-300"
              >
                <option value="High">High — Maximum discretion</option>
                <option value="Standard">Standard — Normal privacy</option>
                <option value="Custom">Custom — See instructions</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                placeholder="Any final notes..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 resize-none focus:outline-none focus:border-blue-300"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!hasContent}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-sans text-sm font-medium transition-all',
                hasContent
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              <Send size={14} />
              Send to Client
            </button>
          </div>

          {/* Live Preview */}
          <div className="p-6 bg-sand-50">
            <p className="text-xs font-sans font-medium text-slate-400 uppercase tracking-wider mb-4">
              Client Preview
            </p>
            {hasContent ? (
              <div className="bg-white rounded-xl border border-sand-200 p-5">
                <p className="text-xs text-sand-400 font-sans uppercase tracking-widest mb-1">Élan Glimmora</p>
                <h4 className="font-serif text-lg text-rose-900 mb-4">Your Experience Brief</h4>

                {arrivalSummary && (
                  <div className="mb-3">
                    <p className="text-xs text-sand-400 uppercase tracking-wider font-sans mb-1">Arrival</p>
                    <p className="text-sand-700 font-sans text-sm leading-relaxed">{arrivalSummary}</p>
                  </div>
                )}
                {keyContact && (
                  <div className="mb-3">
                    <p className="text-xs text-sand-400 uppercase tracking-wider font-sans mb-1">Your Contact</p>
                    <p className="text-sand-700 font-sans text-sm">{keyContact}{keyContactRole ? ` — ${keyContactRole}` : ''}</p>
                  </div>
                )}
                {timing && (
                  <div className="mb-3">
                    <p className="text-xs text-sand-400 uppercase tracking-wider font-sans mb-1">Timing</p>
                    <p className="text-sand-700 font-sans text-sm">{timing}</p>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-sand-100 flex items-center gap-2">
                  <span className="text-xs text-sand-400 font-sans">Discretion Level:</span>
                  <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">{discretionLevel}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-sand-200 p-5 text-center">
                <p className="text-sand-400 font-sans text-sm">
                  Begin composing or use the AGI template to see the client preview.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## PART 11 — B2B: RM CHATBOT WIDGET

### NEW FILE: `src/components/b2b/chat/RMChatWidget.tsx`

```tsx
'use client';

/**
 * Élan AGI Assistant — RM / Advisor Mode
 * Floating assistant for the B2B side
 * Professional dark theme — helps advisor with curation decisions
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
}

const RM_RESPONSES: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['brief', 'agi', 'recommendation'],
    response: "The AGI brief is ready on the governance page. Top recommendation: Aman Venice — Privacy Score 96, Emotional Match 94. One strong alternative: Hotel de Crillon.",
  },
  {
    keywords: ['client', 'profile', 'preference'],
    response: "This client's emotional profile shows strong preference for Privacy (89/100) and Legacy (82/100). Wellness journeys score highest for alignment. Avoid high-visibility venues.",
  },
  {
    keywords: ['risk', 'exposure', 'safety'],
    response: "Current risk assessment for the proposed travel window: Low. No known geopolitical events. Political stability: Stable. Media exposure risk: Minimal.",
  },
  {
    keywords: ['hotel', 'accommodation', 'stay', 'property'],
    response: "Based on the client's discretion tier (High), Aman Venice is the strongest option. Hotel de Crillon is a solid secondary. Four Seasons George V carries medium exposure risk.",
  },
  {
    keywords: ['vendor', 'screening', 'nda'],
    response: "All shortlisted vendors have passed financial and security screening. NDA status: confirmed across all. SLA compliance: 98% over last 12 months.",
  },
  {
    keywords: ['depart', 'brief', 'send', 'prepare'],
    response: "The AGI template for the pre-departure brief is available on the journey detail page. It includes arrival arrangements, contact details, and discretion-level notes.",
  },
  {
    keywords: ['season', 'when', 'timing', 'date'],
    response: "The client's preferred season is Spring, with Autumn as a secondary. Current journey window aligns well. No conflicting events detected in the proposed period.",
  },
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  const match = RM_RESPONSES.find(r => r.keywords.some(k => lower.includes(k)));
  return match?.response ?? "I'm ready to assist with this client's journey curation. Ask me about the AGI brief, risk assessment, vendor status, or pre-departure brief.";
}

const INITIAL: ChatMessage = {
  id: 'init',
  role: 'assistant',
  text: 'RM Assistant ready. I have reviewed the client profile and AGI brief. How can I assist with this journey?',
};

export function RMChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 600));

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: getResponse(text),
    }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
              <div>
                <p className="font-sans text-sm font-medium text-white">◈ AGI Assistant</p>
                <p className="font-sans text-xs text-slate-400">RM Mode — Internal</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[85%] px-3 py-2 rounded-xl font-sans text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-slate-700 text-slate-200 rounded-bl-sm'
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 px-3 py-2 rounded-xl rounded-bl-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-slate-700 bg-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about client, brief, risk..."
                className="flex-1 text-sm font-sans px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className={cn('p-2 rounded-lg transition-colors', inputValue.trim() && !isTyping ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-700 text-slate-500 cursor-not-allowed')}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : <BrainCircuit size={20} />}
      </motion.button>
    </div>
  );
}
```

---

## PART 12 — ADMIN: ADVISOR DIRECTORY WITH AGI MATCH

### NEW FILE: `src/components/admin/advisors/AdvisorDirectory.tsx`

```tsx
'use client';

/**
 * Advisor Directory — Admin View
 * Shows all advisors with specializations and AGI auto-assign recommendation
 */

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { UserCheck } from 'lucide-react';

const MOCK_ADVISORS = [
  {
    id: 'adv-001',
    name: 'Sarah Montague',
    specialization: 'European Heritage & Private Estates',
    languages: ['English', 'French', 'Italian'],
    clientLoad: 4,
    maxClients: 6,
    satisfactionScore: 97,
    availability: 'Available' as const,
    regions: ['Europe', 'Mediterranean'],
    matchScore: 94,
  },
  {
    id: 'adv-002',
    name: 'James Okonkwo',
    specialization: 'Asia Pacific & Cultural Immersion',
    languages: ['English', 'Mandarin', 'Japanese'],
    clientLoad: 5,
    maxClients: 6,
    satisfactionScore: 95,
    availability: 'Available' as const,
    regions: ['Asia Pacific', 'Far East'],
    matchScore: 78,
  },
  {
    id: 'adv-003',
    name: 'Isabelle Fontaine',
    specialization: 'Wellness & Private Retreat Journeys',
    languages: ['English', 'French', 'Spanish'],
    clientLoad: 3,
    maxClients: 5,
    satisfactionScore: 98,
    availability: 'Available' as const,
    regions: ['Europe', 'Americas', 'Indian Ocean'],
    matchScore: 88,
  },
  {
    id: 'adv-004',
    name: 'Marcus Lindqvist',
    specialization: 'Nordic & Arctic Exclusive Access',
    languages: ['English', 'Swedish', 'Norwegian'],
    clientLoad: 6,
    maxClients: 6,
    satisfactionScore: 93,
    availability: 'Fully Engaged' as const,
    regions: ['Scandinavia', 'Arctic', 'North Atlantic'],
    matchScore: 62,
  },
];

type Availability = 'Available' | 'Fully Engaged' | 'On Leave';

const availColor = (a: Availability) => ({
  'Available': 'bg-emerald-100 text-emerald-700',
  'Fully Engaged': 'bg-amber-100 text-amber-700',
  'On Leave': 'bg-slate-100 text-slate-500',
}[a]);

interface AdvisorDirectoryProps {
  onAssign?: (advisorId: string, advisorName: string) => void;
  highlightMatchFor?: string; // client name — to show AGI match context
}

export function AdvisorDirectory({ onAssign, highlightMatchFor }: AdvisorDirectoryProps) {
  const [assigned, setAssigned] = useState<string | null>(null);

  const sorted = [...MOCK_ADVISORS].sort((a, b) => b.matchScore - a.matchScore);

  const handleAssign = (id: string, name: string) => {
    setAssigned(id);
    onAssign?.(id, name);
  };

  return (
    <div>
      {highlightMatchFor && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <span className="text-blue-600 text-lg">◈</span>
          <div>
            <p className="text-blue-800 font-sans font-medium text-sm">AGI Advisor Recommendation</p>
            <p className="text-blue-600 font-sans text-xs mt-0.5">
              Based on {highlightMatchFor}'s emotional profile (Privacy: High, Cultural Access, Legacy),
              the optimal advisor match is <strong>Sarah Montague</strong> — Match Score: 94/100.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((advisor, i) => (
          <div
            key={advisor.id}
            className={cn(
              'p-4 rounded-xl border transition-all',
              i === 0 && highlightMatchFor ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-white',
              assigned === advisor.id && 'border-emerald-300 bg-emerald-50'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-sans font-medium text-slate-800 text-sm">{advisor.name}</span>
                  {i === 0 && highlightMatchFor && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">◈ AGI Top Match</span>
                  )}
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', availColor(advisor.availability))}>
                    {advisor.availability}
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-sans mb-2">{advisor.specialization}</p>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">Clients:</span>
                    <span className="text-xs text-slate-600 font-medium">{advisor.clientLoad}/{advisor.maxClients}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">Satisfaction:</span>
                    <span className="text-xs text-emerald-600 font-medium">{advisor.satisfactionScore}%</span>
                  </div>
                  {highlightMatchFor && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Match:</span>
                      <span className={cn('text-xs font-medium', advisor.matchScore >= 85 ? 'text-blue-600' : 'text-slate-500')}>
                        {advisor.matchScore}/100
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-1 mt-2 flex-wrap">
                  {advisor.languages.map(lang => (
                    <span key={lang} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{lang}</span>
                  ))}
                </div>
              </div>

              {assigned === advisor.id ? (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-sans font-medium px-3 py-1.5">
                  <UserCheck size={14} />
                  Assigned
                </div>
              ) : (
                <button
                  onClick={() => handleAssign(advisor.id, advisor.name)}
                  disabled={advisor.availability === 'Fully Engaged'}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-colors flex-shrink-0',
                    advisor.availability !== 'Fully Engaged'
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  )}
                >
                  Assign
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### MODIFY FILE: `src/app/(admin)/members/page.tsx`

Add a new "Advisors" tab at the top of the page using the existing pattern. Import AdvisorDirectory and add a tab that shows the advisor list. Only ADD — do not change the existing members table.

```tsx
import { AdvisorDirectory } from '@/components/admin/advisors/AdvisorDirectory';

// Add a tab system at the top of the page:
// Tab 1: Members (existing content)
// Tab 2: Advisors (new AdvisorDirectory component)
// Use useState to track activeTab: 'members' | 'advisors'
```

---

## MODIFY FILES SUMMARY

### `src/app/(b2c)/journeys/[id]/page.tsx`
Import and add in order after back navigation:
1. `JourneyStatusTimeline` — always show
2. `LiveJourneyCard` — only when `journey.status === JourneyStatus.EXECUTED`
3. `PrivateConfirmation` — only when `journey.status === JourneyStatus.APPROVED`
4. `PostJourneyFeedback` — only when EXECUTED or ARCHIVED
5. `NextJourneyPanel` — only when EXECUTED or ARCHIVED

### `src/app/(b2c)/layout.tsx`
Add `<AIChatWidget />` before closing div in B2CLayout.

### `src/app/(b2b)/governance/[id]/page.tsx`
After existing `<ExecutionTracker>`, add:
1. `<AGIBriefPanel>` — gated on `can(Permission.READ, 'journey')`
2. `<TravelMonitorPanel>` — only when `journey.status === JourneyStatus.EXECUTED`
3. `<PreDepartureBrief>` — only when APPROVED or PRESENTED

### `src/app/(b2b)/layout.tsx`
Add `<RMChatWidget />` before closing div.

### `src/app/(admin)/members/page.tsx`
Add Advisors tab with `<AdvisorDirectory />`.

---

## NEW FILES SUMMARY (14 files)

| File | Purpose |
|---|---|
| `src/components/b2c/wizards/steps/SeasonStep.tsx` | Season selection wizard step |
| `src/components/b2c/journeys/JourneyStatusTimeline.tsx` | 10-step status tracker |
| `src/components/b2c/journeys/PostJourneyFeedback.tsx` | Post-travel emotional feedback |
| `src/components/b2c/journeys/NextJourneyPanel.tsx` | AGI next journey suggestions |
| `src/components/b2c/journeys/PrivateConfirmation.tsx` | Private payment/confirmation |
| `src/components/b2c/journeys/LiveJourneyCard.tsx` | Calm travel underway screen |
| `src/components/b2c/chat/AIChatWidget.tsx` | UHNI floating chat assistant |
| `src/components/b2b/governance/AGIBriefPanel.tsx` | Advisor AGI brief (dark panel) |
| `src/components/b2b/governance/TravelMonitorPanel.tsx` | Advisor silent travel monitor |
| `src/components/b2b/governance/PreDepartureBrief.tsx` | Brief composer with preview |
| `src/components/b2b/chat/RMChatWidget.tsx` | Advisor floating AGI assistant |
| `src/components/admin/advisors/AdvisorDirectory.tsx` | Advisor list with AGI match |

---

## VERIFICATION CHECKLIST

After implementation run: `pnpm tsc --noEmit` — must pass zero errors.

Then verify visually:

**B2C:**
- [ ] Intent wizard now has 6 steps — Season step appears between Travel Mode and Priorities
- [ ] Season cards show emoji, title, feeling badge, description
- [ ] Journey detail page shows status timeline for ALL journeys
- [ ] APPROVED journey shows PrivateConfirmation panel (not just "Journey Confirmed" text)
- [ ] EXECUTED journey shows LiveJourneyCard (calm, no tracking data)
- [ ] EXECUTED or ARCHIVED journey shows PostJourneyFeedback + NextJourneyPanel
- [ ] Rose chat button floats bottom-right on ALL B2C pages
- [ ] Chat responds to: "status", "hotel", "jet", "privacy", "payment", "help"
- [ ] Typing dots appear for ~700ms before response

**B2B:**
- [ ] Governance detail page shows dark AGI Brief Panel below ExecutionTracker
- [ ] AGI Brief accordion sections work: Hotels, Aviation, Risk
- [ ] Hotels show privacy score bars + emotional match bars
- [ ] EXECUTED journey shows TravelMonitorPanel (flight, transfer, accommodation)
- [ ] APPROVED or PRESENTED journey shows PreDepartureBrief composer
- [ ] "Use AGI Template" button fills all fields
- [ ] Live preview updates as advisor types
- [ ] Dark brain icon floats bottom-right on ALL B2B pages
- [ ] RM chat responds to: "brief", "client", "risk", "hotel", "vendor", "depart"

**Admin:**
- [ ] Members page now has "Members" and "Advisors" tabs
- [ ] Advisors tab shows 4 advisors sorted by match score
- [ ] AGI top match badge shows on first advisor
- [ ] Assign button works (shows "Assigned" confirmation)
- [ ] Fully Engaged advisor has disabled assign button

---

## DO NOT TOUCH

- Any existing B2B module pages: `/predictive`, `/crisis`, `/vendors`, `/conflicts`, `/integrations`
- Any existing B2C pages: `/briefing`, `/intelligence`, `/intent`, `/vault`, `/messages`, `/privacy-settings`
- Any existing service files, mock data, types (except the two schema files above)
- Any existing auth, RBAC, or layout logic
- Any existing components not listed in "Modify Files"
