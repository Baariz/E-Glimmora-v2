'use client';

/**
 * EmotionalTrends Component (INTL-01)
 * Recharts AreaChart with 5 emotional drivers over 6-12 months
 * Narrative text explaining trends
 * Luxury palette (rose/sand)
 */

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Mock data: 6 months of emotional driver trends
const mockData = [
  { month: 'Sep', security: 65, adventure: 45, legacy: 70, recognition: 40, autonomy: 80 },
  { month: 'Oct', security: 68, adventure: 52, legacy: 72, recognition: 42, autonomy: 78 },
  { month: 'Nov', security: 70, adventure: 58, legacy: 75, recognition: 45, autonomy: 75 },
  { month: 'Dec', security: 72, adventure: 62, legacy: 78, recognition: 48, autonomy: 72 },
  { month: 'Jan', security: 75, adventure: 68, legacy: 80, recognition: 52, autonomy: 70 },
  { month: 'Feb', security: 78, adventure: 72, legacy: 82, recognition: 55, autonomy: 68 },
];

export function EmotionalTrends() {
  return (
    <motion.section
      className="py-16 px-8 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-rose-600" />
            <h2 className="text-3xl font-serif font-light text-rose-900">
              Emotional Trends
            </h2>
          </div>
          <p className="text-base font-sans text-sand-600 leading-relaxed italic">
            How your emotional drivers have evolved over the past six months.
          </p>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={mockData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSecurity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#881337" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#881337" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAdventure" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#be123c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#be123c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLegacy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRecognition" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a8a29e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a8a29e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAutonomy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#78716c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#78716c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis
                dataKey="month"
                stroke="#78716c"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}
              />
              <YAxis
                stroke="#78716c"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e7e5e4',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                }}
              />
              <Area
                type="monotone"
                dataKey="security"
                stroke="#881337"
                fillOpacity={1}
                fill="url(#colorSecurity)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="adventure"
                stroke="#be123c"
                fillOpacity={1}
                fill="url(#colorAdventure)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="legacy"
                stroke="#e11d48"
                fillOpacity={1}
                fill="url(#colorLegacy)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="recognition"
                stroke="#a8a29e"
                fillOpacity={1}
                fill="url(#colorRecognition)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="autonomy"
                stroke="#78716c"
                fillOpacity={1}
                fill="url(#colorAutonomy)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Narrative text */}
        <div className="prose prose-lg max-w-none">
          <p className="font-serif text-lg text-sand-900 leading-relaxed mb-4">
            Your emotional landscape has shown a steady evolution toward greater{' '}
            <strong className="text-rose-900">security</strong> and{' '}
            <strong className="text-rose-900">legacy</strong> focus. This shift aligns
            with your life stage transition—a natural movement from building wealth to
            preserving it for future generations.
          </p>
          <p className="font-serif text-lg text-sand-900 leading-relaxed mb-4">
            Notably, your <strong className="text-rose-900">adventure</strong> driver has
            increased by 60% since September, suggesting a renewed appetite for experiential
            journeys. This often emerges when clients feel secure in their financial foundation
            and ready to explore new horizons.
          </p>
          <p className="font-serif text-lg text-sand-900 leading-relaxed">
            Your <strong className="text-rose-900">autonomy</strong> scores remain consistently
            high, reflecting your preference for control and sovereignty—traits that inform our
            approach to presenting opportunities rather than directing decisions.
          </p>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {[
            { name: 'Security', color: '#881337' },
            { name: 'Adventure', color: '#be123c' },
            { name: 'Legacy', color: '#e11d48' },
            { name: 'Recognition', color: '#a8a29e' },
            { name: 'Autonomy', color: '#78716c' },
          ].map((driver) => (
            <div key={driver.name} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: driver.color }}
              />
              <span className="text-sm font-sans text-sand-600">{driver.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
