'use client';

/**
 * PackageSelector — B2B Advisor Component (Phase 6)
 * Uses POST /api/intelligence/package-matching to score packages against a client.
 * On click: fetches full Package via GET /api/packages/{id} into a side drawer.
 */

import { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Sparkles,
  Cpu,
  Loader2,
} from 'lucide-react';
import type {
  PackageMatch,
  IntelligenceSource,
  Package,
  ItineraryDay,
} from '@/lib/types/entities';
import { Card, CardHeader, CardContent } from '@/components/shared/Card';
import { TrustChrome } from '@/components/shared/TrustChrome';
import { useServices } from '@/lib/hooks/useServices';
import { toast } from 'sonner';

interface PackageSelectorProps {
  /** UHNI client's user id — forwarded as `user_id` in POST body */
  clientUserId: string;
  /** Optional hotel filter */
  selectedHotelId?: string;
  /** If provided, enables "Assign to Journey" button to patch the journey */
  journeyId?: string;
  currentPackageId?: string | null;
  onPackageSelected?: (pkg: { package_id: string; package_name: string }) => void;
}

function SourcePill({ source }: { source: IntelligenceSource }) {
  const isAi = source === 'ai';
  return (
    <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
      isAi
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-sand-100 text-sand-700 border-sand-200'
    }`}>
      {isAi ? <Sparkles size={10} /> : <Cpu size={10} />}
      {isAi ? 'AI Matched' : 'Algorithmic'}
    </span>
  );
}

function ScoreBar({ label, value, accent = 'rose' }: { label: string; value: number; accent?: 'rose' | 'olive' }) {
  const pct = Math.max(0, Math.min(100, value));
  const barColor = accent === 'olive' ? 'bg-olive-500' : 'bg-rose-500';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-sans uppercase tracking-wider text-sand-500">{label}</span>
        <span className="text-xs font-sans text-slate-700 font-medium">{pct}%</span>
      </div>
      <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="p-4 rounded-lg border border-sand-200 bg-white animate-pulse">
          <div className="h-4 w-1/2 bg-sand-200 rounded mb-3" />
          <div className="h-2 w-full bg-sand-200 rounded mb-2" />
          <div className="h-2 w-4/5 bg-sand-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function SideDrawer({ pkg, loading, onClose }: { pkg: Package | null; loading: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b border-sand-200">
          <h3 className="font-serif text-lg text-rose-900">
            {loading ? 'Loading…' : pkg?.name || 'Package'}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-sand-100" aria-label="Close drawer">
            <X className="w-4 h-4 text-sand-600" />
          </button>
        </div>
        <div className="p-6">
          {loading && (
            <div className="flex items-center gap-2 text-sand-500 text-sm font-sans py-6">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading package…
            </div>
          )}
          {!loading && !pkg && (
            <p className="text-sm font-sans text-sand-600">Unable to load package details.</p>
          )}
          {!loading && pkg && (
            <div className="space-y-4">
              <p className="text-sm font-sans text-sand-600 italic">{pkg.tagline}</p>
              <div className="flex flex-wrap gap-3 text-xs font-sans text-sand-600">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {pkg.hotelName}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {pkg.duration} nights</span>
                <span>{pkg.region}</span>
              </div>
              <div>
                <p className="text-[10px] font-sans uppercase tracking-wider text-sand-500 mb-2">Itinerary Preview</p>
                <div className="relative pl-5 border-l-2 border-rose-200 space-y-3">
                  {pkg.itinerary.map((day: ItineraryDay) => (
                    <div key={day.day} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-rose-400 border-2 border-white" />
                      <span className="text-xs font-sans font-bold text-rose-900">Day {day.day}: {day.title}</span>
                      <p className="text-xs font-sans text-sand-600 mt-0.5">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PackageSelector({
  clientUserId,
  selectedHotelId,
  journeyId,
  currentPackageId,
  onPackageSelected,
}: PackageSelectorProps) {
  const services = useServices();
  const [matches, setMatches] = useState<PackageMatch[]>([]);
  const [source, setSource] = useState<IntelligenceSource>('fallback');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(currentPackageId ?? null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPkg, setDrawerPkg] = useState<Package | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    if (!clientUserId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await services.intelligence.matchPackages(clientUserId, selectedHotelId);
        if (cancelled) return;
        const sorted = [...(res.matches ?? [])].sort((a, b) => b.match_score - a.match_score);
        setMatches(sorted);
        setSource(res.source ?? 'fallback');
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to match packages', err);
          setError(err instanceof Error ? err.message : 'Unable to load package matches.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [services, clientUserId, selectedHotelId]);

  const openDrawer = async (packageId: string) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    setDrawerPkg(null);
    try {
      const pkg = await services.package.getPackageById(packageId);
      setDrawerPkg(pkg);
    } catch (err) {
      console.error('Failed to load package', err);
      toast.error('Unable to load package details.');
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleAssign = async (m: PackageMatch) => {
    if (!journeyId) {
      onPackageSelected?.({ package_id: m.package_id, package_name: m.package_name });
      toast.success(`Selected "${m.package_name}"`);
      return;
    }
    setAssigningId(m.package_id);
    try {
      await services.journey.updateJourney(journeyId, { packageId: m.package_id });
      setSelectedId(m.package_id);
      onPackageSelected?.({ package_id: m.package_id, package_name: m.package_name });
      toast.success(`Package "${m.package_name}" attached to journey`);
    } catch (err) {
      console.error('Failed to assign package', err);
      toast.error('Unable to attach package.');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-rose-900">Recommended Packages</h2>
            <div className="flex items-center gap-2">
              {!loading && !error && <SourcePill source={source} />}
              <span className="text-xs font-sans text-sand-500">
                {selectedHotelId ? 'Filtered by hotel' : 'All packages'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <Skeleton />}
          {error && !loading && (
            <p className="text-rose-700 text-sm font-sans py-4">{error}</p>
          )}
          {!loading && !error && matches.length === 0 && (
            <p className="text-sand-500 text-sm font-sans py-6 text-center">
              No matching packages found{selectedHotelId ? ' for this hotel' : ''}.
            </p>
          )}
          {!loading && !error && matches.length > 0 && (
            <div className="space-y-3">
              {matches.map((m) => {
                const expanded = expandedId === m.package_id;
                const isSelected = selectedId === m.package_id;
                return (
                  <div
                    key={m.package_id}
                    className={`border rounded-lg transition-all ${
                      isSelected ? 'border-olive-400 bg-olive-50/40' : 'border-sand-200 hover:border-sand-300 bg-white'
                    }`}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => openDrawer(m.package_id)}
                      role="button"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <h3 className="font-sans text-sm font-semibold text-slate-800 truncate">
                            {m.package_name}
                          </h3>
                          {m.recommended && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                              <Check className="w-3 h-3" /> Recommended
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs font-sans font-medium text-olive-700 shrink-0">
                            <Check className="w-3.5 h-3.5" /> Assigned
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <ScoreBar label="Match score" value={m.match_score} accent="rose" />
                        <ScoreBar label="Season fit" value={m.season_fit} accent="olive" />
                      </div>
                      <div className="mt-3">
                        <TrustChrome
                          variant="light"
                          compact
                          sources={m.sources}
                          rating={m.rating}
                          review_count={m.review_count}
                          distance_km={m.distance_km}
                          advisor_approved={m.advisor_approved}
                          confidence={m.confidence}
                        />
                      </div>
                    </div>

                    <div className="border-t border-sand-100 px-4 py-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(expanded ? null : m.package_id);
                        }}
                        className="w-full flex items-center justify-between text-[11px] font-sans uppercase tracking-wider text-sand-500 hover:text-sand-700"
                      >
                        <span>Why this fits</span>
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      {expanded && (
                        <p className="text-xs font-sans text-sand-700 leading-relaxed mt-2">
                          {m.emotional_resonance || 'No resonance commentary provided.'}
                        </p>
                      )}
                    </div>

                    <div className="px-4 pb-4">
                      {!isSelected ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAssign(m); }}
                          disabled={assigningId === m.package_id}
                          className="w-full py-2 text-sm font-sans font-medium text-white bg-rose-900 rounded-lg hover:bg-rose-800 disabled:opacity-60 transition-colors"
                        >
                          {assigningId === m.package_id ? 'Assigning…' : 'Assign to Journey'}
                        </button>
                      ) : (
                        <div className="w-full py-2 text-center text-sm font-sans font-medium text-olive-700 bg-olive-100 rounded-lg">
                          Package Assigned
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {drawerOpen && <SideDrawer pkg={drawerPkg} loading={drawerLoading} onClose={() => setDrawerOpen(false)} />}
    </>
  );
}
