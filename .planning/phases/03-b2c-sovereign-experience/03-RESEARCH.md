# Phase 3: B2C Sovereign Experience - Research

**Researched:** 2026-02-16
**Domain:** Luxury B2C Web Experience, Multi-Step Wizards, Privacy-First UX, Data Visualization
**Confidence:** HIGH

## Summary

Phase 3 delivers the complete B2C sovereign experience for UHNI clients, featuring eight major capability areas: Sovereign Briefing (emotional overview), Intent Intelligence (5-step intake wizard), Journey Intelligence (AI-generated narratives), Advisor Collaboration (messaging), Intelligence Brief (lifestyle analytics), Memory Vault (timeline with emotional tags), Privacy & Access (granular controls), and Role Enforcement (4 B2C roles).

The standard approach for 2026 combines React Hook Form with Zod validation for multi-step wizards, Recharts for financial/lifestyle data visualization, Framer Motion for narrative-driven page transitions, and localStorage with service abstraction for mock-first development. The architecture emphasizes progressive disclosure for complex forms, privacy-first UX patterns with granular visibility controls, and website-style layouts (NOT dashboard aesthetics).

**Primary recommendation:** Use React Hook Form + Zod for wizard validation with per-step schemas, Recharts for emotional/lifestyle charts, react-loading-skeleton for loading states, and leverage existing Radix UI components (Tabs, Accordion, Dialog) for consistent UX. Implement privacy controls with explicit opt-in flows and granular permission toggles following 2026 GDPR best practices.

## Standard Stack

The established libraries/tools for luxury B2C web experiences with complex forms and data visualization:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Hook Form | 7.53+ | Form state management, multi-step wizards | Industry standard for complex forms; minimal re-renders; works with Zod validation |
| Zod | 3.23+ | Runtime validation schemas | Type-safe validation; per-step schemas; already in project |
| Framer Motion | 11.0+ | Page transitions, layout animations, micro-interactions | Already in project; shared element transitions; layout animations |
| Recharts | 2.x | Data visualization (emotional drivers, lifestyle trends) | Composable React components; 13M+ weekly downloads; easy customization |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-loading-skeleton | 3.x | Skeleton loading states | Large data lists (journeys, memories, messages) |
| @radix-ui/react-* | 1.x+ | Headless UI primitives | Already in project (Dialog, Accordion, Tabs, Select) |
| react-dropzone | 14.x | File upload with drag-drop | Memory vault uploads (photos, documents, videos) |
| date-fns | 3.x | Date formatting and manipulation | Timeline rendering, date pickers |
| DayPicker (react-day-picker) | 9.x | Date picker component | Journey date selection, memory timestamps |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Nivo | Nivo has better aesthetics but smaller bundle (2.4K vs 13.8M downloads); Recharts easier API |
| React Hook Form | Formik | Formik more mature but worse performance; RHF is 2026 standard |
| localStorage | IndexedDB | IndexedDB for large data (>5MB) but adds complexity; localStorage sufficient for v1 mocks |
| DayPicker | MUI X Date Picker | MUI requires full Material UI; DayPicker lightweight, used by shadcn/ui |

**Installation:**
```bash
npm install react-hook-form @hookform/resolvers zod
npm install recharts
npm install react-loading-skeleton
npm install react-dropzone
npm install date-fns
npm install react-day-picker
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/(b2c)/
│   ├── briefing/              # BREF: Sovereign briefing overview
│   ├── intent/                # INTN: 5-step wizard
│   │   ├── steps/             # Step1.tsx, Step2.tsx, etc.
│   │   └── schemas/           # Per-step Zod schemas
│   ├── journeys/              # JRNY: Journey intelligence
│   │   ├── [id]/              # Detail page
│   │   └── archive/           # Archived journeys
│   ├── intelligence/          # INTL: Intelligence brief
│   ├── vault/                 # VALT: Memory vault timeline
│   ├── privacy/               # PRIV: Privacy & access controls
│   └── messages/              # COLB: Advisor collaboration
├── components/
│   ├── b2c/
│   │   ├── wizards/           # IntentWizard, JourneyWizard
│   │   ├── charts/            # EmotionalDriversChart, LifestyleTrendsChart
│   │   ├── timeline/          # MemoryTimeline, TimelineItem
│   │   ├── messaging/         # ThreadList, MessageBubble, ThreadView
│   │   └── privacy/           # PrivacyControls, VisibilityToggle
│   └── shared/                # Existing: Button, Card, Modal, etc.
└── lib/
    ├── hooks/
    │   ├── useWizard.ts       # Multi-step navigation logic
    │   ├── useLocalStorage.ts # Persist wizard state
    │   └── useMessageThread.ts# Message thread state
    └── utils/
        ├── validation/        # Shared validators
        └── privacy/           # Privacy calculation helpers
```

### Pattern 1: Multi-Step Wizard with Per-Step Validation
**What:** Each step is a separate component with its own Zod schema, validated independently
**When to use:** Intent wizard (5 steps), journey refinement wizard
**Example:**
```typescript
// Source: https://claritydev.net/blog/build-a-multistep-form-with-react-hook-form
// Verified with: https://github.com/react-hook-form/react-hook-form/discussions/4028

// Step 1 Schema
const Step1Schema = z.object({
  emotionalDrivers: z.object({
    security: z.number().min(0).max(100),
    adventure: z.number().min(0).max(100),
    legacy: z.number().min(0).max(100),
    recognition: z.number().min(0).max(100),
    autonomy: z.number().min(0).max(100),
  }),
});

// Step 2 Schema
const Step2Schema = z.object({
  riskTolerance: z.enum(['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive']),
  lifeStage: z.enum(['Building', 'Preserving', 'Transitioning', 'Legacy Planning']),
});

// Master Schema (for final submission)
const IntentProfileSchema = Step1Schema.merge(Step2Schema).merge(Step3Schema);

// Wizard Component
function IntentWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const form = useForm({
    resolver: zodResolver(getCurrentSchema(step)),
    defaultValues: formData,
  });

  const onStepSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Final validation with master schema
      const result = IntentProfileSchema.safeParse({ ...formData, ...data });
      if (result.success) {
        submitIntentProfile(result.data);
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onStepSubmit)}>
      {step === 1 && <Step1 form={form} />}
      {step === 2 && <Step2 form={form} />}
      {/* ... */}
    </form>
  );
}
```

### Pattern 2: Progressive Disclosure for Privacy Controls
**What:** Start with simple toggles, reveal granular controls only when requested
**When to use:** Privacy settings, advisor visibility controls
**Example:**
```typescript
// Source: https://www.nngroup.com/articles/progressive-disclosure/
// Pattern: https://ui-patterns.com/patterns/ProgressiveDisclosure

function PrivacyControls() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div>
      {/* Level 1: Simple discretion tier */}
      <Select
        label="Discretion Level"
        options={['High', 'Medium', 'Standard']}
      />

      {/* Level 2: Advanced controls (hidden by default) */}
      <button onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
      </button>

      {showAdvanced && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
        >
          <Checkbox label="Invisible itinerary default" />
          <MultiSelect label="Advisor visibility scope" />
          <Input label="Data retention (days)" type="number" />
        </motion.div>
      )}
    </div>
  );
}
```

### Pattern 3: Timeline with Emotional Tags
**What:** Vertical timeline with filterable emotional tags and linked journeys
**When to use:** Memory vault, journey history
**Example:**
```typescript
// Source: Aceternity UI Timeline component pattern
// Custom implementation for luxury aesthetic

function MemoryTimeline({ memories }: { memories: MemoryItem[] }) {
  const [filter, setFilter] = useState<string[]>([]);

  const filtered = memories.filter(m =>
    filter.length === 0 || m.emotionalTags.some(tag => filter.includes(tag))
  );

  return (
    <div className="relative">
      {/* Filter by emotional tags */}
      <div className="mb-8 flex gap-2">
        {['Joy', 'Growth', 'Peace', 'Connection', 'Achievement'].map(tag => (
          <button
            key={tag}
            onClick={() => toggleFilter(tag)}
            className={cn(
              'px-3 py-1 rounded-full text-sm',
              filter.includes(tag)
                ? 'bg-rose-500 text-white'
                : 'bg-sand-100 text-sand-700'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {filtered.map((memory, idx) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-8 border-l-2 border-rose-200"
          >
            <div className="absolute -left-2 w-4 h-4 rounded-full bg-rose-500" />
            <TimelineItem memory={memory} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

### Pattern 4: Threaded Messaging with Context
**What:** Message threads linked to journeys/resources with role-based visibility
**When to use:** Advisor collaboration (COLB requirements)
**Example:**
```typescript
// Source: https://getstream.io/chat/docs/sdk/react/components/core-components/thread/
// Adapted pattern for custom implementation

function MessageThreadView({ threadId }: { threadId: string }) {
  const { messages, sendMessage } = useMessageThread(threadId);
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Thread header with context */}
      <div className="border-b border-sand-200 p-4">
        <h3 className="font-serif text-lg">Journey: Tokyo Renewal Experience</h3>
        <p className="text-sm text-sand-600">with Sarah Chen (Élan Advisor)</p>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === user.id}
          />
        ))}
      </div>

      {/* Message input */}
      <div className="border-t border-sand-200 p-4">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
```

### Pattern 5: Data Visualization with Recharts
**What:** Composable chart components for emotional drivers, risk, trends
**When to use:** Briefing overview, intelligence brief
**Example:**
```typescript
// Source: https://recharts.org/en-US/examples
// Emotional drivers radar chart

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

function EmotionalDriversChart({ drivers }: { drivers: EmotionalDrivers }) {
  const data = [
    { driver: 'Security', value: drivers.security },
    { driver: 'Adventure', value: drivers.adventure },
    { driver: 'Legacy', value: drivers.legacy },
    { driver: 'Recognition', value: drivers.recognition },
    { driver: 'Autonomy', value: drivers.autonomy },
  ];

  return (
    <RadarChart width={400} height={400} data={data}>
      <PolarGrid stroke="#e7e2db" />
      <PolarAngleAxis dataKey="driver" tick={{ fill: '#6d514c', fontSize: 12 }} />
      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9d8868' }} />
      <Radar
        name="Emotional DNA"
        dataKey="value"
        stroke="#b5877e"
        fill="#b5877e"
        fillOpacity={0.6}
      />
    </RadarChart>
  );
}
```

### Anti-Patterns to Avoid

- **Centralized wizard data handler:** Don't put all wizard validation/transformation in one component; let each step handle its own data
- **Direct state mutation:** Never mutate localStorage directly; always use service abstraction layer
- **Array index keys:** Don't use array indices for timeline/message list keys; use stable IDs
- **Global layoutId conflicts:** When using Framer Motion layoutId, wrap in LayoutGroup to prevent conflicts across pages
- **Overusing Context API:** Don't put all form state in Context; use React Hook Form's built-in state management
- **Skipping loading states:** Always show skeletons for async data (journeys, memories, messages)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-step form state | Custom step manager with useState | React Hook Form + useForm per step | Edge cases: browser back button, refresh persistence, async validation |
| File upload with preview | Custom input with FileReader | react-dropzone | Handles drag-drop, file validation, multiple files, accessibility |
| Date picker | Custom calendar component | react-day-picker (DayPicker) | Localization, keyboard navigation, accessibility, range selection |
| Message threading | Custom message tree | Existing thread patterns from Stream SDK | Handles unread counts, optimistic updates, scroll positioning |
| Chart legends/tooltips | Custom SVG overlays | Recharts built-in components | Responsive positioning, touch events, animations |
| Skeleton loaders | Manual placeholder divs | react-loading-skeleton | Auto-sizing, shimmer animation, reduced motion support |
| Privacy consent flows | Custom checkbox groups | Privacy pattern libraries | GDPR compliance, explicit opt-in, plain language, audit trails |
| Timeline scrolling | Custom intersection observer | Native CSS scroll-timeline or Framer Motion scroll hooks | Performance, browser optimization, smooth animations |

**Key insight:** Multi-step wizards and privacy UX have significant hidden complexity. Per-step validation seems simple until you handle browser navigation, data persistence across refreshes, and conditional step flows. Privacy controls seem simple until you need GDPR-compliant consent management, data export, and right-to-be-forgotten workflows. Use battle-tested libraries.

## Common Pitfalls

### Pitfall 1: Wizard State Lost on Refresh
**What goes wrong:** User fills 4 of 5 wizard steps, refreshes browser, loses all progress
**Why it happens:** Wizard state only in React component state, not persisted
**How to avoid:** Use localStorage to persist wizard state after each step; restore on mount
**Warning signs:** No useEffect to save state; no defaultValues from localStorage
```typescript
// Solution pattern
function useWizardPersistence(key: string) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  return [data, setData];
}
```

### Pitfall 2: Privacy Controls Don't Match Backend
**What goes wrong:** User clicks "Reject All" but tracking continues; regulators flag violation
**Why it happens:** Frontend toggles don't trigger backend data deletion; no audit trail
**How to avoid:** Every privacy change must call service layer; service logs audit event; verify backend state matches UI
**Warning signs:** Privacy state only in localStorage; no API calls on toggle change; no confirmation UI
```typescript
// Correct pattern
const updatePrivacy = async (settings: UpdatePrivacySettingsInput) => {
  // Call service (mock or real)
  const updated = await services.privacy.updateSettings(userId, settings);

  // Audit event automatically logged by service
  // Verify state matches
  if (updated.invisibleItineraryDefault !== settings.invisibleItineraryDefault) {
    throw new Error('Privacy setting verification failed');
  }

  return updated;
};
```

### Pitfall 3: Timeline Performance Degrades with Large Data
**What goes wrong:** Memory vault with 500+ items becomes sluggish; scroll janks
**Why it happens:** Rendering all timeline items at once; no virtualization
**How to avoid:** Use react-window or react-virtualized for lists >100 items; implement pagination or infinite scroll
**Warning signs:** Rendering all items with .map(); no height constraints; no IntersectionObserver
```typescript
// Solution: Virtualization for large lists
import { FixedSizeList } from 'react-window';

function VirtualizedTimeline({ memories }: { memories: MemoryItem[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={memories.length}
      itemSize={120}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <TimelineItem memory={memories[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Pitfall 4: Message Threads Don't Handle Optimistic Updates
**What goes wrong:** User sends message, waits 2 seconds for API, sees duplicate or lost message
**Why it happens:** No optimistic UI updates; waiting for server response before showing message
**How to avoid:** Add message to UI immediately with pending state; reconcile with server response
**Warning signs:** No loading indicator; messages flash; duplicates appear
```typescript
const sendMessage = async (content: string) => {
  const tempId = `temp-${Date.now()}`;
  const optimisticMsg = {
    id: tempId,
    threadId,
    senderId: user.id,
    content,
    type: 'user' as const,
    readBy: [user.id],
    sentAt: new Date().toISOString(),
    _pending: true,
  };

  // Add immediately to UI
  setMessages(prev => [...prev, optimisticMsg]);

  try {
    // Send to server
    const serverMsg = await services.message.sendMessage({ threadId, senderId: user.id, content });
    // Replace temp with real
    setMessages(prev => prev.map(m => m.id === tempId ? serverMsg : m));
  } catch (error) {
    // Remove on failure
    setMessages(prev => prev.filter(m => m.id !== tempId));
    toast.error('Failed to send message');
  }
};
```

### Pitfall 5: localStorage Quota Exceeded
**What goes wrong:** App crashes with "QuotaExceededError" after storing large files or long session data
**Why it happens:** localStorage has 5-10MB limit; storing base64 images or large datasets
**How to avoid:** Store file URLs (not base64); use IndexedDB for large data; implement quota monitoring
**Warning signs:** Storing base64 images; no try-catch on localStorage.setItem; no quota checks
```typescript
// Solution: Quota monitoring and graceful degradation
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old data');
      // Clear oldest data or migrate to IndexedDB
      clearOldestEntries();
      return false;
    }
    throw e;
  }
};
```

### Pitfall 6: Emotional Tags Become Unmanageable
**What goes wrong:** Memory vault has 50+ different emotional tags; filter UI is unusable
**Why it happens:** Free-form tag input with no validation; no tag consolidation
**How to avoid:** Predefined tag taxonomy; tag suggestions; limit to 5-10 core emotions; allow custom but review periodically
**Warning signs:** Free text input for tags; no autocomplete; no tag limits
```typescript
// Predefined emotional taxonomy
const EMOTIONAL_TAGS = [
  'Joy', 'Growth', 'Peace', 'Connection', 'Achievement',
  'Gratitude', 'Wonder', 'Renewal', 'Legacy', 'Love'
] as const;

// Tag input with suggestions
<Autocomplete
  options={EMOTIONAL_TAGS}
  maxSelections={5}
  placeholder="Select emotional tags..."
/>
```

## Code Examples

Verified patterns from official sources:

### Multi-Step Wizard Navigation
```typescript
// Source: https://blog.logrocket.com/building-reusable-multi-step-form-react-hook-form-zod/

function useWizard(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const back = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    totalSteps,
    formData,
    next,
    back,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
}
```

### Skeleton Loading for Async Data
```typescript
// Source: https://www.npmjs.com/package/react-loading-skeleton

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function JourneyListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-lg p-6">
          <Skeleton height={24} width="60%" className="mb-2" />
          <Skeleton count={2} className="mb-4" />
          <div className="flex gap-2">
            <Skeleton width={80} height={24} />
            <Skeleton width={100} height={24} />
          </div>
        </div>
      ))}
    </div>
  );
}

function JourneyList() {
  const { data: journeys, isLoading } = useJourneys();

  if (isLoading) return <JourneyListSkeleton />;

  return (
    <div className="space-y-4">
      {journeys.map(journey => (
        <JourneyCard key={journey.id} journey={journey} />
      ))}
    </div>
  );
}
```

### File Upload with Drag-Drop
```typescript
// Source: https://github.com/react-dropzone/react-dropzone

import { useDropzone } from 'react-dropzone';

function MemoryUpload({ onUpload }: { onUpload: (files: File[]) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      onUpload(acceptedFiles);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-rose-500 bg-rose-50'
          : 'border-sand-300 hover:border-rose-300'
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-rose-700">Drop files here...</p>
      ) : (
        <div>
          <p className="text-sand-700 mb-2">Drag & drop files here, or click to select</p>
          <p className="text-sm text-sand-500">Images, videos, PDFs up to 10MB</p>
        </div>
      )}
    </div>
  );
}
```

### Privacy-First Visibility Controls
```typescript
// Source: https://medium.com/@harsh.mudgal_27075/privacy-first-ux-design-systems-for-trust-9f727f69a050
// Pattern: Explicit opt-in with plain language

function AdvisorVisibilityControl() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [saving, setSaving] = useState(false);

  const updateVisibility = async (advisorIds: string[]) => {
    setSaving(true);
    try {
      const updated = await services.privacy.updateSettings(userId, {
        advisorVisibilityScope: advisorIds,
      });
      setSettings(updated);
      toast.success('Visibility settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-sand-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-sand-700">
          Control which advisors can view your journeys and memories.
          You can change this at any time.
        </p>
      </div>

      <div className="space-y-2">
        {advisors.map(advisor => (
          <label key={advisor.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-sand-50">
            <Checkbox
              checked={settings?.advisorVisibilityScope.includes(advisor.id)}
              onChange={(checked) => {
                const newScope = checked
                  ? [...(settings?.advisorVisibilityScope || []), advisor.id]
                  : settings?.advisorVisibilityScope.filter(id => id !== advisor.id) || [];
                updateVisibility(newScope);
              }}
            />
            <div>
              <p className="font-medium text-sand-900">{advisor.name}</p>
              <p className="text-sm text-sand-600">{advisor.role}</p>
            </div>
          </label>
        ))}
      </div>

      {saving && <p className="text-sm text-sand-600">Saving...</p>}
    </div>
  );
}
```

### Framer Motion Shared Element Transition
```typescript
// Source: https://motion.dev/docs/react-layout-animations

import { motion, LayoutGroup } from 'framer-motion';

function JourneyGrid() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <LayoutGroup>
      <div className="grid grid-cols-3 gap-4">
        {journeys.map(journey => (
          <motion.div
            key={journey.id}
            layoutId={`journey-${journey.id}`}
            onClick={() => setSelected(journey.id)}
            className="bg-white rounded-lg p-4 cursor-pointer"
          >
            <h3 className="font-serif text-lg">{journey.title}</h3>
            <p className="text-sm text-sand-600">{journey.category}</p>
          </motion.div>
        ))}
      </div>

      {selected && (
        <motion.div
          layoutId={`journey-${selected}`}
          className="fixed inset-0 bg-white p-8"
          onClick={() => setSelected(null)}
        >
          <JourneyDetailView journeyId={selected} />
        </motion.div>
      )}
    </LayoutGroup>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Formik for forms | React Hook Form | 2022-2023 | Better performance, less re-renders, smaller bundle |
| Redux for all state | Zustand/Jotai for client state, React Query for server | 2024-2025 | Simpler API, less boilerplate, better TypeScript |
| D3 direct manipulation | Recharts/Nivo (D3 wrappers) | 2023-2024 | React-friendly API, easier maintenance |
| react-beautiful-dnd | hello-pangea/dnd or pragmatic-drag-and-drop | 2024 | Original library unmaintained; forks active |
| IndexedDB direct | RxDB or Dexie.js | 2024-2025 | Better error handling, query API, observability |
| Custom date pickers | react-day-picker (DayPicker) | 2025-2026 | Used by shadcn/ui, better accessibility |
| localStorage JSON.stringify | Service abstraction layer | 2025-2026 | Error handling, quota management, migration path |

**Deprecated/outdated:**
- **Formik:** Still works but React Hook Form is faster and lighter (2026 standard)
- **react-virtualized:** Use react-window instead (same author, smaller/faster)
- **Moment.js:** Use date-fns or Temporal API (smaller bundle, better tree-shaking)
- **AnimateSharedLayout (Framer Motion):** Deprecated; use layoutId with LayoutGroup instead
- **Context API for forms:** Overused; React Hook Form has built-in state management

## Open Questions

Things that couldn't be fully resolved:

1. **AI-Generated Journey Narratives (JRNY-01)**
   - What we know: Requirement exists for "AI-generated narrative from intent + context"
   - What's unclear: v1 uses mock API; how to simulate realistic narrative generation in mocks?
   - Recommendation: Mock service should use template-based generation with user's emotional drivers + category to create believable narratives; plan for OpenAI API integration in Phase 4

2. **Invisible Itinerary Implementation (JRNY-03, PRIV-03)**
   - What we know: UHNIs can mark journeys as "invisible" to advisors
   - What's unclear: Does invisibility apply to all metadata (dates, location) or just narrative? Can advisors see "X has 3 invisible journeys" or zero visibility?
   - Recommendation: Start with "zero visibility" (completely hidden from advisor views); add metadata-only visibility if users request it

3. **Family Sharing Permission Model (VALT-05)**
   - What we know: Memories can be shared with spouse/heir roles
   - What's unclear: Can spouse share to heir? Can heir reshare? What about revocation after sharing?
   - Recommendation: Implement "view-only" sharing with no reshare rights; original creator can revoke at any time; document in privacy policy

4. **Global Erase Scope (PRIV-07)**
   - What we know: User can request global data erase
   - What's unclear: Does this erase audit logs? What about journeys shared with advisors (do they keep copies)?
   - Recommendation: Erase user-created content (journeys, memories, messages) but keep anonymized audit trail for compliance; advisors lose access but system keeps "user requested deletion" record

5. **Data Export Format (VALT-07)**
   - What we know: User can export their memory vault
   - What's unclear: What format? JSON? PDF? Include linked journey narratives?
   - Recommendation: JSON for structured data (machine-readable), optional PDF for human-readable report; include everything user created (intent profile, journeys, memories, privacy settings)

## Sources

### Primary (HIGH confidence)

**Multi-Step Wizards:**
- [Build a Multistep Form With React Hook Form - ClarityDev](https://claritydev.net/blog/build-a-multistep-form-with-react-hook-form)
- [Building a reusable multi-step form with React Hook Form and Zod - LogRocket](https://blog.logrocket.com/building-reusable-multi-step-form-react-hook-form-zod/)
- [React Hook Form Discussion #4028 - Multi-Step Validation](https://github.com/orgs/react-hook-form/discussions/4028)

**Data Visualization:**
- [Recharts Official Documentation](https://recharts.org/)
- [Comparing 8 Popular React Charting Libraries - Medium](https://medium.com/@ponshriharini/comparing-8-popular-react-charting-libraries-performance-features-and-use-cases-cc178d80b3ba)
- [NPM Trends: Recharts vs Nivo vs Victory](https://npmtrends.com/nivo-vs-recharts-vs-victory)

**Privacy UX:**
- [Privacy-First UX & Design Systems for Trust - Medium](https://medium.com/@harsh.mudgal_27075/privacy-first-ux-design-systems-for-trust-9f727f69a050)
- [Data privacy week 2026: Why visibility and control matters - Integrity360](https://insights.integrity360.com/data-privacy-week-2026-why-visibility-and-control-matters)
- [Dark Pattern Avoidance 2026 Checklist - SecurePrivacy](https://secureprivacy.ai/blog/dark-pattern-avoidance-2026-checklist)

**Framer Motion:**
- [Layout Animation - Framer Motion Official Docs](https://motion.dev/docs/react-layout-animations)
- [Everything about Framer Motion layout animations - Maxime Heckel](https://blog.maximeheckel.com/posts/framer-motion-layout-animations/)

**File Upload:**
- [react-dropzone GitHub](https://github.com/react-dropzone/react-dropzone)
- [7 Best React File Upload Components (2026) - ReactScript](https://reactscript.com/best-file-upload/)

### Secondary (MEDIUM confidence)

**Timeline Components:**
- [Timeline Component - Aceternity UI](https://ui.aceternity.com/components/timeline)
- [React Timeline - Material UI](https://mui.com/material-ui/react-timeline/)
- [Timeline - PrimeReact](https://primereact.org/timeline/)

**Messaging/Chat:**
- [Thread Component - Stream Chat React SDK](https://getstream.io/chat/docs/sdk/react/components/core-components/thread/)
- [React Chat UI Kit - CometChat](https://www.cometchat.com/react-chat-ui-kit)

**State Management:**
- [Redux vs Zustand vs Context API in 2026 - Medium](https://medium.com/@sparklewebhelp/redux-vs-zustand-vs-context-api-in-2026-7f90a2dc3439)
- [Top 5 React State Management Tools in 2026 - Syncfusion](https://www.syncfusion.com/blogs/post/react-state-management-libraries)

**Performance:**
- [Virtualization in React - Medium](https://medium.com/@ignatovich.dm/virtualization-in-react-improving-performance-for-large-lists-3df0800022ef)
- [List Virtualization with react-window - NamasteDev](https://namastedev.com/blog/react-virtualization-with-react-window/)

**Loading States:**
- [react-loading-skeleton - npm](https://www.npmjs.com/package/react-loading-skeleton)
- [The do's and dont's of Skeleton Loading in React - Ironeko](https://ironeko.com/posts/the-dos-and-donts-of-skeleton-loading-in-react)

### Tertiary (LOW confidence)

**Progressive Disclosure:**
- [Progressive Disclosure - Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/)
- [Progressive disclosure in UX design - LogRocket](https://blog.logrocket.com/ux-design/progressive-disclosure-ux-types-use-cases/)

**Date Pickers:**
- [React DayPicker Official](https://daypicker.dev/)
- [Free React date picker components - Untitled UI](https://www.untitledui.com/react/components/date-pickers)

**GDPR Compliance:**
- [Art. 17 GDPR - Right to erasure](https://gdpr-info.eu/art-17-gdpr/)
- [Right to be Forgotten Guide - ComplyDog](https://complydog.com/blog/right-to-be-forgotten-gdpr-erasure-rights-guide)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Libraries verified with npm trends, official documentation, 2026 usage data
- Architecture: HIGH - Patterns from official React Hook Form docs, Framer Motion docs, Stream SDK
- Pitfalls: MEDIUM - Based on common issues documented in GitHub discussions and blog posts
- Privacy patterns: MEDIUM - General UX principles verified; specific implementation details need validation
- Open questions: LOW - Requires product owner decisions on scope and behavior

**Research date:** 2026-02-16
**Valid until:** ~60 days (stable ecosystem; Framer Motion, React Hook Form, Recharts are mature)

**Notes:**
- All recommended libraries are already in package.json or have 1M+ downloads
- Privacy UX patterns align with 2026 GDPR compliance standards
- Mock-first development supported by existing service abstraction layer
- No new architectural patterns required; builds on Phase 1 & 2 foundations
