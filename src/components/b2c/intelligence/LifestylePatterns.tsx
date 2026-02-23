'use client';

/**
 * LifestylePatterns — Radar chart with lifestyle dimensions
 * Refined slate/analytical palette
 */

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const lifestyleData = [
  { dimension: 'Travel', value: 85 },
  { dimension: 'Wellness', value: 72 },
  { dimension: 'Cultural', value: 68 },
  { dimension: 'Philanthropy', value: 80 },
  { dimension: 'Family', value: 90 },
  { dimension: 'Professional', value: 65 },
];

export function LifestylePatterns() {
  return (
    <div>
      {/* Section header */}
      <div className="mb-10">
        <div className="w-10 h-px bg-gradient-to-r from-slate-400 to-slate-300 mb-5" />
        <p className="text-slate-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
          Section II
        </p>
        <h2 className="font-serif text-3xl text-stone-900 mb-3">
          Lifestyle Patterns
        </h2>
        <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-2xl">
          A comprehensive view of your lifestyle priorities and how they shape your journeys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Chart in card */}
        <div className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          <ResponsiveContainer width="100%" height={380}>
            <RadarChart data={lifestyleData}>
              <PolarGrid stroke="#e7e5e4" />
              <PolarAngleAxis
                dataKey="dimension"
                stroke="#78716c"
                tick={{ fontSize: 12, fontFamily: 'var(--font-sans)' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                stroke="#d6d3d1"
                tick={{ fontSize: 10, fontFamily: 'var(--font-sans)' }}
              />
              <Radar
                name="Lifestyle"
                dataKey="value"
                stroke="#334155"
                fill="#6366f1"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Narrative */}
        <div className="space-y-4">
          <p className="font-serif text-lg text-stone-700 leading-[1.8]">
            Your lifestyle profile reveals a strong emphasis on{' '}
            <strong className="text-stone-900">family</strong> (90%) and{' '}
            <strong className="text-stone-900">travel</strong> (85%)—two dimensions that
            often intersect in multi-generational journey planning.
          </p>
          <p className="font-serif text-lg text-stone-700 leading-[1.8]">
            Your <strong className="text-stone-900">philanthropic</strong> engagement (80%)
            suggests a readiness to explore impact-driven opportunities, particularly in
            areas aligned with your values: education access and environmental preservation.
          </p>
          <p className="font-serif text-lg text-stone-700 leading-[1.8]">
            While your <strong className="text-stone-900">professional</strong> engagement
            remains moderate (65%), this indicates a healthy transition toward legacy and
            family focus—a common pattern at this life stage.
          </p>
        </div>
      </div>
    </div>
  );
}
