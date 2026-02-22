'use client';

/**
 * PackageSelector — B2B Advisor Component
 * Shows recommended packages for a journey with AGI match scores.
 * Advisor can view itinerary preview and attach a package to the journey.
 */

import { useState, useMemo } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronUp, Star, Check, Shield } from 'lucide-react';
import { MOCK_PACKAGES } from '@/lib/mock/packages.mock';
import { MOCK_HOTELS } from '@/lib/mock/hotels.mock';
import type { Package, ItineraryDay, Hotel } from '@/lib/types/entities';
import { Card, CardHeader, CardContent } from '@/components/shared/Card';
import { toast } from 'sonner';

interface PackageSelectorProps {
  journeyId: string;
  journeyCategory?: string;
  onPackageSelected?: (pkg: Package) => void;
}

/**
 * Compute a mock AGI match score based on category overlap.
 */
function computeMatchScore(pkg: Package, journeyCategory?: string): number {
  if (!journeyCategory) return Math.floor(Math.random() * 20) + 70;

  const cat = journeyCategory.toLowerCase();
  const pkgCat = pkg.category.toLowerCase();
  const pkgTagline = pkg.tagline.toLowerCase();

  let score = 75; // base

  if (pkgCat.includes(cat) || cat.includes(pkgCat)) score += 15;
  if (pkgTagline.includes('private') || pkgTagline.includes('seclu')) score += 5;
  if (pkg.duration >= 5) score += 3;

  return Math.min(score + Math.floor(Math.random() * 5), 99);
}

export function PackageSelector({
  journeyId,
  journeyCategory,
  onPackageSelected,
}: PackageSelectorProps) {
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);

  const rankedPackages = useMemo(() => {
    return MOCK_PACKAGES
      .filter((p) => p.isActive)
      .map((p) => ({ ...p, matchScore: computeMatchScore(p, journeyCategory) }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [journeyCategory]);

  const getHotel = (hotelId: string): Hotel | undefined =>
    MOCK_HOTELS.find((h) => h.id === hotelId);

  const handleSelect = (pkg: Package) => {
    setSelectedPkgId(pkg.id);
    onPackageSelected?.(pkg);
    toast.success(`Package "${pkg.clientTitle}" attached to journey`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-rose-900">Recommended Packages</h2>
          <span className="text-xs font-sans text-sand-500">
            AGI-ranked by client profile match
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankedPackages.map((pkg) => {
            const isExpanded = expandedPkg === pkg.id;
            const isSelected = selectedPkgId === pkg.id;
            const hotel = getHotel(pkg.hotelId);

            return (
              <div
                key={pkg.id}
                className={`border rounded-lg overflow-hidden transition-all ${
                  isSelected
                    ? 'border-olive-400 bg-olive-50/50'
                    : 'border-sand-200 hover:border-sand-300'
                }`}
              >
                {/* Package summary row */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedPkg(isExpanded ? null : pkg.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-sans text-sm font-semibold text-slate-800 truncate">
                          {pkg.clientTitle}
                        </h3>
                        <span className="shrink-0 px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-xs font-sans font-medium">
                          {(pkg as Package & { matchScore: number }).matchScore}% match
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-sand-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {pkg.hotelName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {pkg.duration} nights
                        </span>
                        {hotel && (
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-olive-500" /> Privacy {hotel.privacyScore}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="flex items-center gap-1 text-xs font-sans font-medium text-olive-700">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-sand-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-sand-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded: itinerary + select */}
                {isExpanded && (
                  <div className="border-t border-sand-100 p-4 bg-sand-50/50">
                    <p className="text-sm font-sans text-sand-600 italic mb-3">
                      {pkg.tagline}
                    </p>

                    {/* Itinerary timeline */}
                    <div className="relative pl-5 border-l-2 border-rose-200 space-y-3 mb-4">
                      {pkg.itinerary.map((day: ItineraryDay) => (
                        <div key={day.day} className="relative">
                          <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-rose-400 border-2 border-white" />
                          <div>
                            <span className="text-xs font-sans font-bold text-rose-900">
                              Day {day.day}: {day.title}
                            </span>
                            <p className="text-xs font-sans text-sand-600 mt-0.5">
                              {day.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {day.activities.slice(0, 3).map((a, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 bg-white border border-sand-100 rounded text-[10px] font-sans text-sand-500"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Select button */}
                    {!isSelected ? (
                      <button
                        onClick={() => handleSelect(pkg)}
                        className="w-full py-2 text-sm font-sans font-medium text-white bg-rose-900 rounded-lg hover:bg-rose-800 transition-colors"
                      >
                        Attach This Package
                      </button>
                    ) : (
                      <div className="w-full py-2 text-center text-sm font-sans font-medium text-olive-700 bg-olive-100 rounded-lg">
                        Package Attached
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
