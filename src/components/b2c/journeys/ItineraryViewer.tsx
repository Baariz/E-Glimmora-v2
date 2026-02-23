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
      {/* Cinematic Header */}
      <div
        className="relative min-h-[200px] sm:min-h-[260px] bg-cover bg-center flex items-end cursor-pointer"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80)` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 px-6 sm:px-8 py-6 w-full">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-amber-300 text-xs font-sans uppercase tracking-widest mb-2">Your Experience</p>
              <h3 className="font-serif text-2xl sm:text-3xl text-white">{pkg.clientTitle}</h3>
              <p className="text-white/70 font-sans text-sm mt-1 italic">&ldquo;{pkg.tagline}&rdquo;</p>
              {hotel && (
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-sans text-white/60">
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
              <ChevronUp className="w-5 h-5 text-white/60 shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60 shrink-0" />
            )}
          </div>
        </div>
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
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-amber-50 border border-rose-200 flex items-center justify-center shadow-sm">
                        <span className="font-serif text-sm text-rose-800 font-semibold">{day.day}</span>
                      </div>
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
