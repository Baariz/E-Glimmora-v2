'use client';

/**
 * ItineraryViewer — B2C Component
 * Shows the day-by-day itinerary for a confirmed journey.
 * Uses the package data linked to the journey to display a beautiful timeline.
 * Falls back gracefully if no package is attached.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_PACKAGES } from '@/lib/mock/packages.mock';
import { MOCK_HOTELS } from '@/lib/mock/hotels.mock';
import type { Package, Hotel, ItineraryDay } from '@/lib/types/entities';

interface ItineraryViewerProps {
  journeyTitle: string;
  /** Optional: pre-selected package ID. If not provided, shows first matching package. */
  packageId?: string;
}

export function ItineraryViewer({ journeyTitle, packageId }: ItineraryViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Find the package — by ID or fall back to the first active one
  const pkg: Package | undefined = useMemo(() => {
    if (packageId) return MOCK_PACKAGES.find((p) => p.id === packageId);
    return MOCK_PACKAGES.find((p) => p.isActive);
  }, [packageId]);

  const hotel: Hotel | undefined = useMemo(() => {
    if (!pkg) return undefined;
    return MOCK_HOTELS.find((h) => h.id === pkg.hotelId);
  }, [pkg]);

  if (!pkg) return null;

  return (
    <div className="border border-sand-200 rounded-2xl overflow-hidden bg-white">
      {/* Header */}
      <div className="p-6 sm:p-8">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-sans font-medium tracking-widest text-rose-700 uppercase mb-1 block">
                Your Itinerary
              </span>
              <h2 className="font-serif text-2xl text-rose-900 font-light">
                {pkg.clientTitle}
              </h2>
              {hotel && (
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-sans text-sand-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {hotel.name} &middot; {hotel.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {pkg.duration} nights
                  </span>
                </div>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-sand-400 shrink-0 mt-1" />
            ) : (
              <ChevronDown className="w-5 h-5 text-sand-400 shrink-0 mt-1" />
            )}
          </div>
        </button>

        {/* Tagline — always visible */}
        <p className="font-serif text-base text-sand-600 italic leading-relaxed mt-3">
          &ldquo;{pkg.tagline}&rdquo;
        </p>
      </div>

      {/* Itinerary timeline — collapsible */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-sand-100 bg-sand-50/50"
        >
          <div className="p-6 sm:p-8">
            <div className="relative pl-6 border-l-2 border-rose-200 space-y-6">
              {pkg.itinerary.map((day: ItineraryDay, index: number) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-rose-400 border-2 border-white shadow-sm" />

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-900 rounded text-xs font-sans font-bold">
                        Day {day.day}
                      </span>
                      <h3 className="font-serif text-base text-sand-800">
                        {day.title}
                      </h3>
                    </div>

                    <p className="font-sans text-sm text-sand-600 leading-relaxed mb-3">
                      {day.description}
                    </p>

                    {/* Activities */}
                    <div className="space-y-1.5 mb-2">
                      {day.activities.map((activity, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm font-sans text-sand-600"
                        >
                          <span className="text-rose-400 mt-0.5">&bull;</span>
                          {activity}
                        </div>
                      ))}
                    </div>

                    {/* Meals & Transport */}
                    {(day.meals || day.transport) && (
                      <div className="flex flex-wrap gap-4 mt-2 text-xs font-sans text-sand-500">
                        {day.meals && <span>Dining: {day.meals}</span>}
                        {day.transport && <span>Transport: {day.transport}</span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
