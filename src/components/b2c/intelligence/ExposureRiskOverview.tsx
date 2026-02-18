'use client';

/**
 * ExposureRiskOverview Component (INTL-04)
 * Plain language risk categories: Privacy, Travel, Financial
 * Color-coded indicators with overall summary
 * Non-technical, sophisticated presentation
 */

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

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
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: CheckCircle,
  },
  Moderate: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: AlertTriangle,
  },
  Elevated: {
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    icon: AlertTriangle,
  },
};

export function ExposureRiskOverview() {
  return (
    <motion.section
      className="py-16 px-8 bg-sand-50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-rose-600" />
            <h2 className="text-3xl font-serif font-light text-rose-900">
              Exposure & Risk Overview
            </h2>
          </div>
          <p className="text-base font-sans text-sand-600 leading-relaxed italic max-w-3xl">
            A holistic view of your exposure across privacy, travel security, and financial
            dimensions. We continuously monitor these factors to protect your sovereignty.
          </p>
        </div>

        {/* Risk categories */}
        <div className="space-y-6 mb-12">
          {riskCategories.map((category, index) => {
            const config = levelConfig[category.level];
            const Icon = config.icon;

            return (
              <motion.div
                key={category.name}
                className={`p-6 rounded-lg border ${config.borderColor} ${config.bgColor}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`mt-1 ${config.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-serif font-light text-rose-900">
                        {category.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-sans font-semibold ${config.color} ${config.bgColor} border ${config.borderColor}`}
                      >
                        {category.level}
                      </span>
                    </div>

                    <p className="text-base font-sans font-medium text-sand-900 mb-3">
                      {category.summary}
                    </p>

                    <p className="text-sm font-sans text-sand-700 leading-relaxed">
                      {category.details}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overall summary */}
        <motion.div
          className="p-8 bg-white rounded-xl border border-sand-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full">
              <Shield className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-light text-rose-900 mb-3">
                Overall Assessment
              </h3>
              <p className="font-serif text-lg text-sand-900 leading-relaxed mb-4">
                Your overall risk profile remains <strong className="text-emerald-700">well-managed</strong>
                {' '}and aligned with your stated preferences for discretion and security. The moderate
                travel security awareness is routine for your destinations and does not require
                journey modification—only enhanced coordination.
              </p>
              <p className="text-sm font-sans text-sand-600 leading-relaxed">
                We conduct quarterly reviews of your risk exposure and will proactively notify you
                of any material changes. Your next scheduled review is <strong>May 15, 2026</strong>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
