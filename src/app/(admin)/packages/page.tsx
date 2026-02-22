'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
} from 'lucide-react';
import { MOCK_PACKAGES } from '@/lib/mock/packages.mock';
import { MOCK_HOTELS } from '@/lib/mock/hotels.mock';
import type { Package, ItineraryDay } from '@/lib/types/entities';
import { toast } from 'sonner';

/**
 * Admin Package Builder
 * View, manage and preview travel packages with day-by-day itineraries.
 */
export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(MOCK_PACKAGES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [previewItinerary, setPreviewItinerary] = useState<string | null>(null);

  const categories = Array.from(new Set(packages.map((p) => p.category)));

  const filtered = packages.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.clientTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.hotelName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (pkgId: string) => {
    if (!confirm('Remove this package?')) return;
    setPackages((prev) => prev.filter((p) => p.id !== pkgId));
    toast.success('Package removed');
  };

  const handleToggleActive = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, isActive: !p.isActive } : p))
    );
    toast.success('Package status updated');
  };

  const getHotelPrivacyScore = (hotelId: string) => {
    const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
    return hotel?.privacyScore ?? 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-rose-900">Package Builder</h1>
          <p className="text-sm font-sans text-sand-600 mt-1">
            {packages.length} packages &middot; {MOCK_HOTELS.length} hotels available
          </p>
        </div>
        <button
          onClick={() => toast.info('Package creation form would open here')}
          className="flex items-center gap-2 px-4 py-2 bg-rose-900 text-white text-sm font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Package
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
          <input
            type="text"
            placeholder="Search packages, hotels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Package List */}
      <div className="space-y-4">
        {filtered.map((pkg) => {
          const isExpanded = expandedPackage === pkg.id;
          const isPreview = previewItinerary === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`border rounded-xl bg-white overflow-hidden transition-all ${
                isExpanded ? 'border-rose-300 shadow-md' : 'border-sand-200 hover:border-sand-300'
              } ${!pkg.isActive ? 'opacity-60' : ''}`}
            >
              {/* Package Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedPackage(isExpanded ? null : pkg.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg text-rose-900 font-medium">
                        {pkg.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-sand-100 rounded text-xs font-sans text-sand-600">
                        {pkg.category}
                      </span>
                    </div>
                    <p className="text-sm font-sans text-sand-500 italic">
                      &ldquo;{pkg.clientTitle}&rdquo;
                    </p>
                    <p className="text-sm font-sans text-sand-600 mt-1">{pkg.tagline}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sand-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-sans font-medium">{pkg.duration}N</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sand-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-sans">{pkg.hotelName}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-sand-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-sand-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-sand-100 p-5">
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-sans">
                    <span className="text-sand-600">
                      Region: <span className="text-sand-800 font-medium">{pkg.region}</span>
                    </span>
                    <span className="text-sand-600">
                      Hotel Privacy:{' '}
                      <span className="text-olive-700 font-medium">
                        {getHotelPrivacyScore(pkg.hotelId)}/100
                      </span>
                    </span>
                    <span className="text-sand-600">
                      Days:{' '}
                      <span className="text-sand-800 font-medium">
                        {pkg.itinerary.length}
                      </span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => setPreviewItinerary(isPreview ? null : pkg.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans font-medium text-rose-900 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isPreview ? 'Hide Itinerary' : 'Preview Itinerary'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(pkg.id)}
                      className={`px-3 py-1.5 text-sm font-sans rounded-lg transition-colors ${
                        pkg.isActive
                          ? 'text-olive-700 bg-olive-50 hover:bg-olive-100'
                          : 'text-sand-600 bg-sand-100 hover:bg-sand-200'
                      }`}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>

                  {/* Itinerary Preview */}
                  {isPreview && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-sans text-sm font-semibold text-sand-700">
                        Day-by-Day Itinerary
                      </h4>
                      <div className="relative pl-6 border-l-2 border-rose-200 space-y-4">
                        {pkg.itinerary.map((day: ItineraryDay) => (
                          <div key={day.day} className="relative">
                            {/* Timeline dot */}
                            <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-rose-400 border-2 border-white" />

                            <div className="bg-sand-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-sans font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded">
                                  Day {day.day}
                                </span>
                                <h5 className="font-sans text-sm font-semibold text-sand-800">
                                  {day.title}
                                </h5>
                              </div>
                              <p className="text-sm font-sans text-sand-600 mb-2">
                                {day.description}
                              </p>

                              {/* Activities */}
                              <div className="space-y-1">
                                {day.activities.map((activity, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2 text-xs font-sans text-sand-600"
                                  >
                                    <span className="text-rose-400 mt-0.5">&bull;</span>
                                    {activity}
                                  </div>
                                ))}
                              </div>

                              {/* Meals & Transport */}
                              <div className="flex flex-wrap gap-3 mt-2 text-xs font-sans text-sand-500">
                                {day.meals && <span>Meals: {day.meals}</span>}
                                {day.transport && <span>Transport: {day.transport}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sand-500 font-sans">No packages match your filters.</p>
        </div>
      )}
    </div>
  );
}
