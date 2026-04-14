'use client';

/**
 * PackageSelector — B2B Advisor Component
 * Shows active packages for a given hotel and lets the advisor attach one to a journey.
 * Advisor view: shows internal name as primary label (client_title shown as secondary).
 */

import { useEffect, useState } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react';
import type { Package, ItineraryDay } from '@/lib/types/entities';
import { Card, CardHeader, CardContent } from '@/components/shared/Card';
import { useServices } from '@/lib/hooks/useServices';
import { toast } from 'sonner';

interface PackageSelectorProps {
  journeyId: string;
  journeyCategory?: string;
  hotelId?: string;
  currentPackageId?: string | null;
  onPackageSelected?: (pkg: Package) => void;
}

export function PackageSelector({
  journeyId,
  hotelId,
  currentPackageId,
  onPackageSelected,
}: PackageSelectorProps) {
  const services = useServices();
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(currentPackageId ?? null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await services.package.getPackages({
          hotel_id: hotelId,
          active: true,
        });
        if (!cancelled) setPackages(data);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load packages', err);
          setError('Unable to load packages. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, hotelId]);

  const handleSelect = async (pkg: Package) => {
    setAssigningId(pkg.id);
    try {
      await services.journey.updateJourney(journeyId, { packageId: pkg.id });
      setSelectedPkgId(pkg.id);
      onPackageSelected?.(pkg);
      toast.success(`Package "${pkg.name}" attached to journey`);
    } catch (err) {
      console.error('Failed to assign package', err);
      toast.error('Unable to attach package. Please try again.');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-rose-900">Recommended Packages</h2>
          <span className="text-xs font-sans text-sand-500">
            {hotelId ? 'Filtered by journey hotel' : 'All active packages'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-sand-500 text-sm font-sans py-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading packages…
          </div>
        )}

        {error && !loading && (
          <p className="text-rose-700 text-sm font-sans py-4">{error}</p>
        )}

        {!loading && !error && packages.length === 0 && (
          <p className="text-sand-500 text-sm font-sans py-6 text-center">
            No active packages available{hotelId ? ' for this hotel' : ''}.
          </p>
        )}

        {!loading && !error && packages.length > 0 && (
          <div className="space-y-3">
            {packages.map((pkg) => {
              const isExpanded = expandedPkg === pkg.id;
              const isSelected = selectedPkgId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    isSelected
                      ? 'border-olive-400 bg-olive-50/50'
                      : 'border-sand-200 hover:border-sand-300'
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedPkg(isExpanded ? null : pkg.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-sans text-sm font-semibold text-slate-800 truncate">
                            {pkg.name}
                          </h3>
                          <span className="shrink-0 px-1.5 py-0.5 bg-sand-100 text-sand-700 rounded text-xs font-sans">
                            {pkg.category}
                          </span>
                        </div>
                        <p className="text-xs font-sans text-sand-500 italic truncate">
                          Client-facing: &ldquo;{pkg.clientTitle}&rdquo;
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-sand-600 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {pkg.hotelName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {pkg.duration} nights
                          </span>
                          <span>{pkg.region}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs font-sans font-medium text-olive-700">
                            <Check className="w-3.5 h-3.5" /> Assigned
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

                  {isExpanded && (
                    <div className="border-t border-sand-100 p-4 bg-sand-50/50">
                      <p className="text-sm font-sans text-sand-600 italic mb-3">
                        {pkg.tagline}
                      </p>

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

                      {!isSelected ? (
                        <button
                          onClick={() => handleSelect(pkg)}
                          disabled={assigningId === pkg.id}
                          className="w-full py-2 text-sm font-sans font-medium text-white bg-rose-900 rounded-lg hover:bg-rose-800 disabled:opacity-60 transition-colors"
                        >
                          {assigningId === pkg.id ? 'Assigning…' : 'Assign to Journey'}
                        </button>
                      ) : (
                        <div className="w-full py-2 text-center text-sm font-sans font-medium text-olive-700 bg-olive-100 rounded-lg">
                          Package Assigned
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
