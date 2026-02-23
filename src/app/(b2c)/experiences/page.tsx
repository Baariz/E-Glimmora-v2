'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { MOCK_PACKAGES } from '@/lib/mock/packages.mock';
import { MOCK_HOTELS } from '@/lib/mock/hotels.mock';
import { cn } from '@/lib/utils/cn';
import { ArrowRight, MapPin, Moon, Sparkles } from 'lucide-react';

const DESTINATION_IMAGES: Record<string, string> = {
  'hotel-001': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
  'hotel-002': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  'hotel-003': 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=80',
  'hotel-004': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
};

const GRADIENT_FALLBACK: Record<string, string> = {
  'hotel-001': 'linear-gradient(135deg, #8B6F5E 0%, #C4956A 50%, #7B4F3A 100%)',
  'hotel-002': 'linear-gradient(135deg, #78716C 0%, #A8956E 50%, #57534E 100%)',
  'hotel-003': 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #1D4ED8 100%)',
  'hotel-004': 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #0284C7 100%)',
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function ExperiencesPage() {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const packages = MOCK_PACKAGES.filter(p => p.isActive);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── CINEMATIC HERO ── */}
      <div
        className="relative min-h-[70vh] flex items-end bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80)` }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/75" />

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 pb-16 sm:pb-24"
        >
          <p className="text-amber-300 text-xs font-sans font-semibold uppercase tracking-[4px] mb-5">
            Your Private Collection
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-white leading-[1.05] mb-6 max-w-3xl">
            Experiences curated only for you.
          </h1>
          <p className="text-white/75 font-sans text-lg sm:text-xl max-w-xl leading-relaxed">
            Each destination selected by our intelligence against your profile.
            Nothing standard. Everything arranged privately.
          </p>
        </motion.div>
      </div>

      {/* ── INTRO STRIP ── */}
      <div className="bg-white border-b border-stone-100 px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-stone-500 font-sans text-sm">
            Showing <span className="text-rose-800 font-semibold">{packages.length} curated experiences</span> matched to your profile
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
            <Sparkles size={12} />
            <span>Ranked by your intelligence profile</span>
          </div>
        </div>
      </div>

      {/* ── EXPERIENCE CARDS ── */}
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-20"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {packages.map((pkg, i) => {
          const hotel = MOCK_HOTELS.find(h => h.id === pkg.hotelId);
          const imageUrl = DESTINATION_IMAGES[pkg.hotelId];
          const gradient = GRADIENT_FALLBACK[pkg.hotelId];
          const isReversed = i % 2 !== 0;

          return (
            <motion.div
              key={pkg.id}
              variants={fadeUp}
              className={cn(
                'flex flex-col lg:flex-row gap-0 rounded-3xl overflow-hidden shadow-2xl',
                isReversed && 'lg:flex-row-reverse'
              )}
            >
              {/* Photography Panel */}
              <div
                className="relative lg:w-1/2 min-h-[300px] sm:min-h-[400px] bg-cover bg-center"
                style={{
                  backgroundImage: imgErrors[pkg.hotelId]
                    ? gradient
                    : `url(${imageUrl})`,
                  background: imgErrors[pkg.hotelId] ? gradient : undefined,
                }}
              >
                {/* Preload image and catch error */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt=""
                  className="hidden"
                  onError={() => setImgErrors(prev => ({ ...prev, [pkg.hotelId]: true }))}
                />

                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Bottom info on photo */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white/90 text-sm font-sans mb-1">
                    <MapPin size={13} />
                    <span>{hotel?.location}, {hotel?.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium border border-white/30">
                      {pkg.category}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium border border-white/30 flex items-center gap-1">
                      <Moon size={10} /> {pkg.duration} nights
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="lg:w-1/2 bg-white p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  {/* Region */}
                  <p className="text-amber-600 text-xs font-sans font-semibold uppercase tracking-widest mb-3">
                    {pkg.region}
                  </p>

                  {/* Title */}
                  <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-tight mb-4">
                    {pkg.clientTitle}
                  </h2>

                  {/* Tagline */}
                  <p className="text-stone-500 font-sans text-base leading-relaxed italic mb-8 border-l-2 border-rose-200 pl-4">
                    &ldquo;{pkg.tagline}&rdquo;
                  </p>

                  {/* Day highlights */}
                  <div className="space-y-4 mb-8">
                    {pkg.itinerary.slice(0, 3).map(day => (
                      <div key={day.day} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
                          <span className="font-serif text-sm text-rose-700 font-medium">{day.day}</span>
                        </div>
                        <div className="pt-1.5">
                          <p className="font-sans text-sm font-semibold text-stone-800 mb-0.5">{day.title}</p>
                          <p className="text-stone-400 text-sm leading-relaxed">{day.description}</p>
                        </div>
                      </div>
                    ))}
                    {pkg.itinerary.length > 3 && (
                      <p className="text-stone-400 text-xs font-sans pl-14">
                        + {pkg.itinerary.length - 3} more days of curated experience
                      </p>
                    )}
                  </div>

                  {/* Amenity tags */}
                  {hotel && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {hotel.amenities.slice(0, 4).map(a => (
                        <span key={a.label} className="text-xs px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-stone-600 font-sans">
                          {a.icon} {a.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href="/intent"
                  className="group inline-flex items-center justify-between w-full px-6 py-4 bg-rose-900 text-white font-sans text-sm font-medium rounded-2xl hover:bg-rose-800 transition-all hover:shadow-lg hover:shadow-rose-900/20"
                >
                  <span>Begin Curation</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}

        {/* ── BOTTOM CTA ── */}
        <motion.div
          variants={fadeUp}
          className="relative rounded-3xl overflow-hidden"
        >
          <div
            className="min-h-[280px] bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80)` }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative text-center px-6 py-12">
              <p className="text-white/70 font-sans text-sm mb-3">
                Don&apos;t see what you have in mind?
              </p>
              <h3 className="font-serif text-3xl text-white mb-6">
                Something entirely bespoke awaits.
              </h3>
              <Link
                href="/messages"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-rose-900 font-sans text-sm font-semibold rounded-full hover:bg-rose-50 transition-all"
              >
                Speak with your Advisor <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
