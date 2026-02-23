'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { MOCK_PACKAGES } from '@/lib/mock/packages.mock';
import { MOCK_HOTELS } from '@/lib/mock/hotels.mock';
import { cn } from '@/lib/utils/cn';
import { ArrowRight, MapPin, Moon, Sparkles, Calendar } from 'lucide-react';
import { IMAGES } from '@/lib/constants/imagery';

const HOTEL_IMAGES: Record<string, string> = {
  'hotel-001': IMAGES.heroVenice,
  'hotel-002': IMAGES.heroTemple,
  'hotel-003': IMAGES.heroRiviera,
  'hotel-004': IMAGES.heroMaldives,
};

export default function ExperiencesPage() {
  const packages = MOCK_PACKAGES.filter(p => p.isActive);

  return (
    <div
      className="min-h-screen bg-[#f8f6f3] -mx-4 md:-mx-6 -mt-[5.5rem] md:-mt-24 -mb-6 md:-mb-8 overflow-x-hidden"
      style={{ width: '100vw', maxWidth: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      {/* ═══════ CINEMATIC HERO ═══════ */}
      <div
        className="relative min-h-[52vh] sm:min-h-[58vh] flex items-end bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGES.heroAerial})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-10 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
            <p className="text-amber-300/50 text-[10px] font-sans uppercase tracking-[5px] mb-4">
              Your Private Collection
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] text-white leading-[1] tracking-[-0.025em] mb-5 max-w-lg"
          >
            Experiences curated<br />only for you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/30 font-sans text-sm max-w-md leading-[1.7] tracking-wide"
          >
            Each destination selected by our intelligence against your profile.
            Nothing standard. Everything arranged privately.
          </motion.p>
        </div>
      </div>

      {/* ═══════ INFO STRIP ═══════ */}
      <div className="sticky top-16 z-20 bg-[#f8f6f3]/95 backdrop-blur-md border-b border-stone-200/40">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-stone-400 font-sans text-[12px] tracking-wide">
            Showing <span className="text-stone-700 font-medium">{packages.length} curated experiences</span> matched to your profile
          </p>
          <div className="flex items-center gap-2 text-[10px] text-amber-600/80 bg-amber-50/60 border border-amber-200/40 rounded-full px-3.5 py-1.5 font-sans uppercase tracking-[2px]">
            <Sparkles size={10} />
            Intelligence-ranked
          </div>
        </div>
      </div>

      {/* ═══════ EXPERIENCE CARDS ═══════ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-14 space-y-10">
        {packages.map((pkg, i) => {
          const hotel = MOCK_HOTELS.find(h => h.id === pkg.hotelId);
          const imageUrl = HOTEL_IMAGES[pkg.hotelId] || IMAGES.heroJourney;
          const isReversed = i % 2 !== 0;

          return (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'group relative flex flex-col lg:flex-row rounded-3xl overflow-hidden',
                'bg-white border border-stone-100/80',
                'shadow-sm hover:shadow-2xl hover:shadow-stone-900/[0.08] transition-all duration-700 hover:-translate-y-1',
                isReversed && 'lg:flex-row-reverse'
              )}
            >
              {/* Photography Panel */}
              <div
                className="relative lg:w-[55%] min-h-[280px] sm:min-h-[380px] lg:min-h-[480px] bg-stone-900 overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-[1.04]"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/5" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

                {/* Bottom info on photo */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <div className="flex items-center gap-2 text-white/60 text-[11px] font-sans tracking-wide mb-3">
                    <MapPin size={11} />
                    <span>{hotel?.location}, {hotel?.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 font-sans font-medium uppercase tracking-[3px]">
                      {pkg.category}
                    </span>
                    <span className="text-[9px] px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 font-sans font-medium uppercase tracking-[3px] flex items-center gap-1.5">
                      <Moon size={9} /> {pkg.duration} nights
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="lg:w-[45%] p-7 sm:p-9 flex flex-col justify-between">
                <div>
                  {/* Region label */}
                  <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-amber-600 mb-5" />
                  <p className="text-amber-500/70 text-[10px] font-sans uppercase tracking-[5px] mb-4">
                    {pkg.region}
                  </p>

                  {/* Title */}
                  <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 leading-[1.1] tracking-[-0.015em] mb-4">
                    {pkg.clientTitle}
                  </h2>

                  {/* Tagline */}
                  <p className="text-stone-400 font-sans text-[13px] leading-[1.7] tracking-wide italic mb-7">
                    &ldquo;{pkg.tagline}&rdquo;
                  </p>

                  {/* Day highlights */}
                  <div className="space-y-4 mb-7">
                    {pkg.itinerary.slice(0, 3).map(day => (
                      <div key={day.day} className="flex gap-4">
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-stone-100/80 flex items-center justify-center">
                          <span className="font-serif text-[12px] text-stone-500 font-medium">{day.day}</span>
                        </div>
                        <div className="pt-0.5">
                          <p className="font-sans text-[13px] font-medium text-stone-800 mb-0.5 tracking-wide">{day.title}</p>
                          <p className="text-stone-400 text-[12px] font-sans leading-[1.6] tracking-wide line-clamp-1">{day.description}</p>
                        </div>
                      </div>
                    ))}
                    {pkg.itinerary.length > 3 && (
                      <p className="text-stone-300 text-[11px] font-sans pl-[52px] tracking-wide">
                        + {pkg.itinerary.length - 3} more days of curated experience
                      </p>
                    )}
                  </div>

                  {/* Amenity tags */}
                  {hotel && (
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {hotel.amenities.slice(0, 4).map(a => (
                        <span key={a.label} className="text-[10px] px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/60 text-stone-500 font-sans tracking-wide">
                          {a.icon} {a.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="/intent"
                  className="group/cta inline-flex items-center justify-center gap-2.5 w-full px-8 py-3.5 bg-stone-900 text-white font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-stone-800 transition-all shadow-sm hover:shadow-lg"
                >
                  Begin Curation
                  <ArrowRight size={13} className="group-hover/cta:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.article>
          );
        })}

        {/* ═══════ BOTTOM CTA ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[20px] overflow-hidden"
        >
          <div
            className="relative min-h-[300px] bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${IMAGES.heroSuite})` }}
          >
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative text-center px-6 py-14">
              <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-5" />
              <p className="text-white/30 font-sans text-[11px] uppercase tracking-[4px] mb-4">
                Bespoke
              </p>
              <h3 className="font-serif text-3xl sm:text-4xl text-white leading-[1.05] tracking-[-0.02em] mb-6 max-w-md mx-auto">
                Something entirely bespoke awaits.
              </h3>
              <Link
                href="/messages"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white/95 backdrop-blur-sm text-stone-900 font-sans text-[13px] font-semibold tracking-wide rounded-full hover:bg-white transition-all shadow-2xl"
              >
                Speak with Your Advisor <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
