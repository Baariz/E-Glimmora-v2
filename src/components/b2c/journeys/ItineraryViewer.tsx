'use client';

/**
 * ItineraryViewer — B2C Component
 * Shows the day-by-day itinerary for a confirmed journey.
 * Uses the package data linked to the journey to display a beautiful timeline.
 * Falls back gracefully if no package is attached.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronDown, ChevronUp, Utensils, Car } from 'lucide-react';
import { MOCK_PACKAGES } from '@/lib/mock/packages.mock';
import { MOCK_HOTELS } from '@/lib/mock/hotels.mock';
import { IMAGES } from '@/lib/constants/imagery';
import type { Package, Hotel, ItineraryDay } from '@/lib/types/entities';

interface ItineraryViewerProps {
  journeyTitle: string;
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
    <div className="border border-sand-200/60 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Cinematic Header */}
      <div
        className="relative min-h-[220px] sm:min-h-[280px] bg-cover bg-center flex items-end cursor-pointer"
        style={{ backgroundImage: `url(${IMAGES.heroVenice})` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        <div className="relative z-10 px-7 sm:px-8 py-7 w-full">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-4" />
              <p className="text-amber-300/60 text-[10px] font-sans uppercase tracking-[5px] mb-2">
                Your Experience
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-white leading-tight tracking-[-0.01em] mb-2">
                {pkg.clientTitle}
              </h3>
              <p className="text-white/50 font-sans text-sm italic tracking-wide">
                &ldquo;{pkg.tagline}&rdquo;
              </p>
              {hotel && (
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-white/40 text-[11px] font-sans tracking-wide">
                    <MapPin className="w-3.5 h-3.5" />
                    {hotel.name} &middot; {hotel.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/40 text-[11px] font-sans tracking-wide">
                    <Calendar className="w-3.5 h-3.5" />
                    {pkg.duration} nights
                  </span>
                </div>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 flex-shrink-0">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-white/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/60" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary timeline — collapsible */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="border-t border-sand-200/60"
        >
          {/* Hotel summary bar */}
          {hotel && (
            <div className="bg-sand-50/80 px-7 sm:px-8 py-4 border-b border-sand-200/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-sand-200/60 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <p className="font-serif text-sm text-stone-800">{hotel.name}</p>
                  <p className="text-stone-400 text-[11px] font-sans tracking-wide">{hotel.location}</p>
                </div>
              </div>
            </div>
          )}

          {/* Day-by-day timeline */}
          <div className="px-7 sm:px-8 py-7 sm:py-8">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[15px] top-6 bottom-6 w-px bg-sand-200/80" />

              <div className="space-y-7">
                {pkg.itinerary.map((day: ItineraryDay, index: number) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                    className="relative flex gap-5"
                  >
                    {/* Day circle */}
                    <div className="relative z-10 w-8 h-8 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center flex-shrink-0">
                      <span className="font-serif text-[11px] text-rose-500 font-semibold">{day.day}</span>
                    </div>

                    {/* Day content card */}
                    <div className="flex-1 bg-sand-50/50 border border-sand-200/40 rounded-xl p-5">
                      <h4 className="font-serif text-base text-stone-800 mb-2">
                        {day.title}
                      </h4>

                      <p className="font-sans text-sm text-stone-500 leading-[1.7] tracking-wide mb-4">
                        {day.description}
                      </p>

                      {/* Activities */}
                      <div className="space-y-2 mb-3">
                        {day.activities.map((activity, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 text-sm font-sans text-stone-500 leading-[1.6]"
                          >
                            <span className="text-rose-300 mt-1 text-[8px]">&#9679;</span>
                            <span className="tracking-wide">{activity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Meals & Transport */}
                      {(day.meals || day.transport) && (
                        <div className="flex flex-wrap gap-4 pt-3 border-t border-sand-200/40">
                          {day.meals && (
                            <span className="flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-[3px] text-stone-400">
                              <Utensils className="w-3 h-3" /> {day.meals}
                            </span>
                          )}
                          {day.transport && (
                            <span className="flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-[3px] text-stone-400">
                              <Car className="w-3 h-3" /> {day.transport}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
