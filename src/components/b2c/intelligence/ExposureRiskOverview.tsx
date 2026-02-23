'use client';

/**
 * ExposureRiskOverview — Risk categories with color-coded indicators
 * Clean card-based layout matching analytical theme
 */

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface RiskCategory {
  name: string;
  level: 'Low' | 'Moderate' | 'Elevated';
  summary: string;
  details: string;
}

const riskCategories: RiskCategory[] = [
  {
    name: 'Privacy & Discretion',
    level: 'Low',
    summary: 'Strong privacy posture maintained',
    details:
      'Your discretion preferences are well-documented and consistently honored across all journeys. Invisible itinerary mode active for 85% of travel. No public exposure concerns identified.',
  },
  {
    name: 'Travel & Security',
    level: 'Moderate',
    summary: 'Heightened awareness recommended for upcoming destinations',
    details:
      'Two upcoming journeys involve regions with evolving security dynamics. Enhanced protocols have been activated, including pre-arrival briefings and on-ground support coordination.',
  },
  {
    name: 'Financial Exposure',
    level: 'Low',
    summary: 'Portfolio risk aligned with stated tolerance',
    details:
      'Current exposure levels match your moderate-conservative risk profile. No concentration concerns. Estate planning documents current and comprehensive.',
  },
];

const levelConfig = {
  Low: {
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200/60',
    icon: CheckCircle,
  },
  Moderate: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200/60',
    icon: AlertTriangle,
  },
  Elevated: {
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200/60',
    icon: AlertTriangle,
  },
};

export function ExposureRiskOverview() {
  return (
    <div>
      {/* Section header */}
      <div className="mb-10">
        <div className="w-10 h-px bg-gradient-to-r from-slate-400 to-slate-300 mb-5" />
        <p className="text-slate-400 text-[10px] font-sans uppercase tracking-[5px] mb-3">
          Section IV
        </p>
        <h2 className="font-serif text-3xl text-stone-900 mb-3">
          Exposure & Risk
        </h2>
        <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-2xl">
          A holistic view of your exposure across privacy, travel security, and financial
          dimensions. We continuously monitor these factors to protect your sovereignty.
        </p>
      </div>

      {/* Risk cards */}
      <div className="space-y-4 mb-10">
        {riskCategories.map((category, index) => {
          const config = levelConfig[category.level];
          const Icon = config.icon;

          return (
            <motion.div
              key={category.name}
              className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-7 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                  config.bg
                )}>
                  <Icon size={17} className={config.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif text-lg text-stone-900">
                      {category.name}
                    </h3>
                    <span className={cn(
                      'text-[9px] font-sans font-medium uppercase tracking-[2px] px-3 py-1.5 rounded-full border flex-shrink-0',
                      config.bg, config.color, config.border
                    )}>
                      {category.level}
                    </span>
                  </div>

                  <p className="font-sans text-sm font-medium text-stone-700 mb-2">
                    {category.summary}
                  </p>

                  <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide">
                    {category.details}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall assessment */}
      <motion.div
        className="bg-white border border-emerald-200/60 rounded-2xl p-7 sm:p-8 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-stone-900 mb-3">
              Overall Assessment
            </h3>
            <p className="font-serif text-base text-stone-600 leading-[1.8] mb-4">
              Your overall risk profile remains <strong className="text-emerald-600">well-managed</strong>{' '}
              and aligned with your stated preferences for discretion and security. The moderate
              travel security awareness is routine and does not require
              journey modification—only enhanced coordination.
            </p>
            <p className="text-stone-400 font-sans text-[11px] tracking-wide">
              Next scheduled review: <strong className="text-stone-600">May 15, 2026</strong>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
