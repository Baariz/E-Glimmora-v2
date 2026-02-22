'use client';

/**
 * B2C Experiences Page
 * Curated, magazine-style view of available luxury travel packages.
 * UHNI sees beautiful editorial-quality cards — no pricing, no admin data.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { MOCK_PACKAGES } from '@/lib/mock/packages.mock';
import { MOCK_HOTELS } from '@/lib/mock/hotels.mock';
import type { Package, Hotel, ItineraryDay } from '@/lib/types/entities';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ExperiencesPage() {
  const [expandedExperience, setExpandedExperience] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>('All');

  const activePackages = MOCK_PACKAGES.filter((p) => p.isActive);
  const regions = Array.from(new Set(activePackages.map((p) => p.region)));

  const filtered =
    regionFilter === 'All'
      ? activePackages
      : activePackages.filter((p) => p.region === regionFilter);

  const getHotel = (hotelId: string): Hotel | undefined =>
    MOCK_HOTELS.find((h) => h.id === hotelId);

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* Hero */}
      <motion.div variants={fadeUp} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-8 h-8 text-rose-900" />
          <h1 className="text-4xl font-serif font-light text-rose-900">
            Curated Experiences
          </h1>
        </div>
        <p className="text-base font-sans text-sand-600 leading-relaxed max-w-2xl">
          Each experience has been designed around a single idea: that the most
          extraordinary moments happen when every detail has been considered, and
          then made invisible.
        </p>
      </motion.div>

      {/* Region filter pills */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setRegionFilter('All')}
          className={`px-4 py-1.5 rounded-full text-sm font-sans transition-colors ${
            regionFilter === 'All'
              ? 'bg-rose-900 text-white'
              : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
          }`}
        >
          All Regions
        </button>
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegionFilter(r)}
            className={`px-4 py-1.5 rounded-full text-sm font-sans transition-colors ${
              regionFilter === r
                ? 'bg-rose-900 text-white'
                : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
            }`}
          >
            {r}
          </button>
        ))}
      </motion.div>

      {/* Experience Cards */}
      <div className="space-y-8">
        {filtered.map((pkg) => {
          const isExpanded = expandedExperience === pkg.id;
          const hotel = getHotel(pkg.hotelId);

          return (
            <motion.div
              key={pkg.id}
              variants={fadeUp}
              className="border border-sand-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
            >
              {/* Card Header — editorial style */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-sans font-medium tracking-widest text-rose-700 uppercase mb-2 block">
                      {pkg.category}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-rose-900 font-light leading-tight">
                      {pkg.clientTitle}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4 text-sand-500 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-sans">{pkg.duration} nights</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-sans">{pkg.region}</span>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <p className="font-serif text-lg text-sand-600 italic leading-relaxed mb-4">
                  &ldquo;{pkg.tagline}&rdquo;
                </p>

                {/* Hotel info */}
                {hotel && (
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-sm font-sans text-sand-700 font-medium">
                      {hotel.name}
                    </span>
                    <span className="text-sand-300">&middot;</span>
                    <span className="text-sm font-sans text-sand-500">
                      {hotel.location}, {hotel.country}
                    </span>
                    <span className="text-sand-300">&middot;</span>
                    <span className="text-sm font-sans text-sand-500">{hotel.tier}</span>
                  </div>
                )}

                {/* Hotel amenities */}
                {hotel && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-sand-50 border border-sand-100 rounded-full text-xs font-sans text-sand-600"
                      >
                        {a.icon} {a.label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hotel client description */}
                {hotel && (
                  <p className="text-sm font-sans text-sand-600 leading-relaxed">
                    {hotel.clientDescription}
                  </p>
                )}

                {/* Expand itinerary */}
                <button
                  onClick={() => setExpandedExperience(isExpanded ? null : pkg.id)}
                  className="mt-4 flex items-center gap-2 text-sm font-sans font-medium text-rose-900 hover:text-rose-700 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" /> Hide itinerary
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> View day-by-day itinerary
                    </>
                  )}
                </button>
              </div>

              {/* Expanded Itinerary */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-sand-100 bg-sand-50/50"
                >
                  <div className="p-6 sm:p-8">
                    <h3 className="font-serif text-lg text-rose-900 mb-6">
                      Your {pkg.duration}-Day Journey
                    </h3>

                    <div className="relative pl-6 border-l-2 border-rose-200 space-y-6">
                      {pkg.itinerary.map((day: ItineraryDay) => (
                        <div key={day.day} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-rose-400 border-2 border-white shadow-sm" />

                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-900 rounded text-xs font-sans font-bold">
                                Day {day.day}
                              </span>
                              <h4 className="font-serif text-base text-sand-800">
                                {day.title}
                              </h4>
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
                                {day.meals && (
                                  <span className="flex items-center gap-1">
                                    Dining: {day.meals}
                                  </span>
                                )}
                                {day.transport && (
                                  <span className="flex items-center gap-1">
                                    Transport: {day.transport}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <motion.div variants={fadeUp} className="text-center py-16">
          <p className="text-sand-500 font-sans text-lg">
            No experiences available for this region yet.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
