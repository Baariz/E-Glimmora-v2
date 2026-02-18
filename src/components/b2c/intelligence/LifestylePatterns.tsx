'use client';

/**
 * LifestylePatterns Component (INTL-02)
 * Recharts RadarChart for lifestyle dimensions
 * Narrative text explaining patterns
 * Sand/rose coloring
 */

import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Compass } from 'lucide-react';

// Mock data: lifestyle dimensions
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
    <motion.section
      className="py-16 px-8 bg-sand-50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Compass className="w-6 h-6 text-rose-600" />
            <h2 className="text-3xl font-serif font-light text-rose-900">
              Lifestyle Patterns
            </h2>
          </div>
          <p className="text-base font-sans text-sand-600 leading-relaxed italic">
            A comprehensive view of your lifestyle priorities and how they shape your journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chart */}
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={lifestyleData}>
                <PolarGrid stroke="#d6d3d1" />
                <PolarAngleAxis
                  dataKey="dimension"
                  stroke="#78716c"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '13px' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  stroke="#a8a29e"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '11px' }}
                />
                <Radar
                  name="Lifestyle"
                  dataKey="value"
                  stroke="#881337"
                  fill="#e11d48"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Narrative text */}
          <div className="prose prose-lg">
            <p className="font-serif text-lg text-sand-900 leading-relaxed mb-4">
              Your lifestyle profile reveals a strong emphasis on{' '}
              <strong className="text-rose-900">family</strong> (90%) and{' '}
              <strong className="text-rose-900">travel</strong> (85%)—two dimensions that
              often intersect in multi-generational journey planning.
            </p>
            <p className="font-serif text-lg text-sand-900 leading-relaxed mb-4">
              Your <strong className="text-rose-900">philanthropic</strong> engagement (80%)
              suggests a readiness to explore impact-driven opportunities, particularly in
              areas aligned with your values: education access and environmental preservation.
            </p>
            <p className="font-serif text-lg text-sand-900 leading-relaxed">
              While your <strong className="text-rose-900">professional</strong> engagement
              remains moderate (65%), this indicates a healthy transition toward legacy and
              family focus—a common pattern among UHNI clients in your life stage.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
