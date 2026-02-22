'use client';

import { useState } from 'react';
import { Search, Plus, Star, Shield, MapPin, Edit2, Trash2 } from 'lucide-react';
import { MOCK_HOTELS } from '@/lib/mock/hotels.mock';
import type { Hotel, HotelRegion, HotelTier } from '@/lib/types/entities';
import { toast } from 'sonner';

/**
 * Admin Hotel & Resort Library
 * Content management for the hotel portfolio.
 * Admin can view, search, filter, add, edit, and remove hotels.
 */
export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<HotelRegion | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<HotelTier | 'All'>('All');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const regions: HotelRegion[] = ['Europe', 'Asia Pacific', 'Middle East', 'Americas', 'Africa', 'Indian Ocean'];
  const tiers: HotelTier[] = ['Ultra-Luxury', 'Luxury', 'Boutique'];

  const filtered = hotels.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase()) ||
      h.country.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'All' || h.region === regionFilter;
    const matchesTier = tierFilter === 'All' || h.tier === tierFilter;
    return matchesSearch && matchesRegion && matchesTier;
  });

  const handleDelete = (hotelId: string) => {
    if (!confirm('Remove this hotel from the library?')) return;
    setHotels((prev) => prev.filter((h) => h.id !== hotelId));
    if (selectedHotel?.id === hotelId) setSelectedHotel(null);
    toast.success('Hotel removed');
  };

  const handleToggleActive = (hotelId: string) => {
    setHotels((prev) =>
      prev.map((h) => (h.id === hotelId ? { ...h, isActive: !h.isActive } : h))
    );
    toast.success('Hotel status updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-rose-900">
            Hotel & Resort Library
          </h1>
          <p className="text-sm font-sans text-sand-600 mt-1">
            {hotels.length} properties in portfolio
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-900 text-white text-sm font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Hotel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
          <input
            type="text"
            placeholder="Search by name, location, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as HotelRegion | 'All')}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as HotelTier | 'All')}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Tiers</option>
          {tiers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => setSelectedHotel(selectedHotel?.id === hotel.id ? null : hotel)}
            className={`border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${
              selectedHotel?.id === hotel.id
                ? 'border-rose-300 bg-rose-50/50 shadow-md'
                : 'border-sand-200 bg-white hover:border-sand-300'
            } ${!hotel.isActive ? 'opacity-60' : ''}`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-serif text-lg text-rose-900 font-medium">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-sand-600 text-sm font-sans mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {hotel.location}, {hotel.country}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-sans font-medium ${
                  hotel.tier === 'Ultra-Luxury'
                    ? 'bg-gold-100 text-gold-800'
                    : hotel.tier === 'Luxury'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-sand-100 text-sand-700'
                }`}
              >
                {hotel.tier}
              </span>
            </div>

            {/* Privacy Score */}
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-olive-600" />
              <div className="flex-1 h-2 bg-sand-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-olive-500 rounded-full transition-all"
                  style={{ width: `${hotel.privacyScore}%` }}
                />
              </div>
              <span className="text-xs font-sans font-medium text-olive-700">
                {hotel.privacyScore}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm font-sans text-sand-600 line-clamp-2 mb-3">
              {hotel.clientDescription}
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {hotel.amenities.slice(0, 4).map((a, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-sand-50 border border-sand-100 rounded text-xs font-sans text-sand-600"
                >
                  {a.icon} {a.label}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="px-2 py-0.5 text-xs font-sans text-sand-400">
                  +{hotel.amenities.length - 4} more
                </span>
              )}
            </div>

            {/* Region + Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-sand-100">
              <span className="text-xs font-sans text-sand-500">{hotel.region}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleActive(hotel.id);
                  }}
                  className={`text-xs font-sans px-2 py-1 rounded ${
                    hotel.isActive
                      ? 'text-olive-700 bg-olive-50 hover:bg-olive-100'
                      : 'text-sand-600 bg-sand-100 hover:bg-sand-200'
                  } transition-colors`}
                >
                  {hotel.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(hotel.id);
                  }}
                  className="p-1 text-sand-400 hover:text-rose-600 transition-colors"
                  aria-label="Delete hotel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sand-500 font-sans">No hotels match your filters.</p>
        </div>
      )}

      {/* Selected Hotel Detail Panel */}
      {selectedHotel && (
        <div className="border border-rose-200 rounded-xl p-6 bg-rose-50/30">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-serif text-xl text-rose-900">{selectedHotel.name}</h2>
            <button
              onClick={() => setSelectedHotel(null)}
              className="text-sand-400 hover:text-sand-600 text-sm font-sans"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-sans text-sm font-semibold text-sand-700 mb-1">
                Client-Facing Description
              </h3>
              <p className="text-sm font-sans text-sand-600 leading-relaxed">
                {selectedHotel.clientDescription}
              </p>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-sand-700 mb-1">
                Internal Notes
              </h3>
              <p className="text-sm font-sans text-sand-600 leading-relaxed">
                {selectedHotel.description}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-sans text-sm font-semibold text-sand-700 mb-2">
              All Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedHotel.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border border-sand-200 rounded-full text-sm font-sans text-sand-700"
                >
                  {a.icon} {a.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Hotel Modal (simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
            <h2 className="font-serif text-xl text-rose-900 mb-4">Add Hotel</h2>
            <p className="text-sm font-sans text-sand-600 mb-6">
              In production, this would open a full form with all hotel fields.
              For the mock, hotels are pre-seeded.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-sans font-medium text-sand-700 bg-sand-100 rounded-lg hover:bg-sand-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
