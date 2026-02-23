'use client';

/**
 * EmotionalTrends — Area chart with 5 emotional drivers
 * Refined color palette matching slate/analytical theme
 */

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Sep', security: 65, adventure: 45, legacy: 70, recognition: 40, autonomy: 80 },
  { month: 'Oct', security: 68, adventure: 52, legacy: 72, recognition: 42, autonomy: 78 },
  { month: 'Nov', security: 70, adventure: 58, legacy: 75, recognition: 45, autonomy: 75 },
  { month: 'Dec', security: 72, adventure: 62, legacy: 78, recognition: 48, autonomy: 72 },
  { month: 'Jan', security: 75, adventure: 68, legacy: 80, recognition: 52, autonomy: 70 },
  { month: 'Feb', security: 78, adventure: 72, legacy: 82, recognition: 55, autonomy: 68 },
];

const LEGEND = [
  { name: 'Security', color: '#334155' },
  { name: 'Adventure', color: '#0ea5e9' },
  { name: 'Legacy', color: '#6366f1' },
  { name: 'Recognition', color: '#a8a29e' },
  { name: 'Autonomy', color: '#10b981' },
];

export function EmotionalTrends() {
  return (
    <div>
      {/* Section header */}
      <div className="mb-10">
        <div className="w-10 h-px bg-gradient-to-r from-slate-400 to-slate-300 mb-5" />
        <p className="text-slate-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
          Section I
        </p>
        <h2 className="font-serif text-3xl text-stone-900 mb-3">
          Emotional Trends
        </h2>
        <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-2xl">
          How your emotional drivers have evolved over the past six months.
        </p>
      </div>

      {/* Chart in card */}
      <div className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart
            data={mockData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gSecurity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#334155" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#334155" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAdventure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gLegacy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gRecognition" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a8a29e" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#a8a29e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gAutonomy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f0ee" />
            <XAxis dataKey="month" stroke="#a8a29e" tick={{ fontSize: 11, fontFamily: 'var(--font-sans)' }} />
            <YAxis stroke="#a8a29e" tick={{ fontSize: 11, fontFamily: 'var(--font-sans)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e7e5e4',
                borderRadius: '12px',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            />
            <Area type="monotone" dataKey="security" stroke="#334155" fill="url(#gSecurity)" strokeWidth={2} />
            <Area type="monotone" dataKey="adventure" stroke="#0ea5e9" fill="url(#gAdventure)" strokeWidth={2} />
            <Area type="monotone" dataKey="legacy" stroke="#6366f1" fill="url(#gLegacy)" strokeWidth={2} />
            <Area type="monotone" dataKey="recognition" stroke="#a8a29e" fill="url(#gRecognition)" strokeWidth={1.5} />
            <Area type="monotone" dataKey="autonomy" stroke="#10b981" fill="url(#gAutonomy)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-5 justify-center mt-6 pt-5 border-t border-stone-100">
          {LEGEND.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] font-sans text-stone-400 tracking-wide">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative */}
      <div className="space-y-4 max-w-3xl">
        <p className="font-serif text-lg text-stone-700 leading-[1.8]">
          Your emotional landscape has shown a steady evolution toward greater{' '}
          <strong className="text-stone-900">security</strong> and{' '}
          <strong className="text-stone-900">legacy</strong> focus. This shift aligns
          with your life stage transition—a natural movement from building wealth to
          preserving it for future generations.
        </p>
        <p className="font-serif text-lg text-stone-700 leading-[1.8]">
          Notably, your <strong className="text-stone-900">adventure</strong> driver has
          increased by 60% since September, suggesting a renewed appetite for experiential
          journeys.
        </p>
        <p className="font-serif text-lg text-stone-700 leading-[1.8]">
          Your <strong className="text-stone-900">autonomy</strong> scores remain consistently
          high, reflecting your preference for control—traits that inform our
          approach to presenting opportunities rather than directing decisions.
        </p>
      </div>
    </div>
  );
}
