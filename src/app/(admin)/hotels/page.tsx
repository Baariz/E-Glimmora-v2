'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Search, Plus, Shield, MapPin, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { Hotel, HotelAmenity, HotelRegion, HotelTier } from '@/lib/types/entities';
import { toast } from 'sonner';

const REGIONS: HotelRegion[] = ['Europe', 'Asia Pacific', 'Middle East', 'Americas', 'Africa', 'Indian Ocean'];
const TIERS: HotelTier[] = ['Ultra-Luxury', 'Luxury', 'Boutique'];

interface HotelFormState {
  name: string;
  location: string;
  country: string;
  region: HotelRegion;
  tier: HotelTier;
  privacyScore: number;
  description: string;
  clientDescription: string;
  advisorNotes: string;
  amenities: string;
  imageUrls: string;
}

const EMPTY_FORM: HotelFormState = {
  name: '',
  location: '',
  country: '',
  region: 'Europe',
  tier: 'Luxury',
  privacyScore: 80,
  description: '',
  clientDescription: '',
  advisorNotes: '',
  amenities: '',
  imageUrls: '',
};

function toFormState(h: Hotel): HotelFormState {
  return {
    name: h.name,
    location: h.location,
    country: h.country,
    region: h.region,
    tier: h.tier,
    privacyScore: h.privacyScore,
    description: h.description,
    clientDescription: h.clientDescription,
    advisorNotes: h.advisorNotes || '',
    amenities: h.amenities.map((a) => a.label).join(', '),
    imageUrls: (h.imageUrls && h.imageUrls.length ? h.imageUrls : h.imageUrl ? [h.imageUrl] : []).join(', '),
  };
}

function parseImageUrls(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseAmenities(input: string): HotelAmenity[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label) => ({ label, icon: '✦' }));
}

export default function HotelsPage() {
  const services = useServices();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<HotelRegion | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<HotelTier | 'All'>('All');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HotelFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await services.hotel.getHotels();
      setHotels(data);
    } catch {
      setError('Failed to load hotels');
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = hotels.filter((h) => {
    const q = search.toLowerCase();
    const matchesSearch =
      h.name.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      h.country.toLowerCase().includes(q);
    const matchesRegion = regionFilter === 'All' || h.region === regionFilter;
    const matchesTier = tierFilter === 'All' || h.tier === tierFilter;
    const matchesActive =
      activeFilter === 'All' ||
      (activeFilter === 'Active' ? h.isActive : !h.isActive);
    return matchesSearch && matchesRegion && matchesTier && matchesActive;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (h: Hotel) => {
    setEditingId(h.id);
    setForm(toFormState(h));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload: Partial<Hotel> = {
      name: form.name,
      location: form.location,
      country: form.country,
      region: form.region,
      tier: form.tier,
      privacyScore: Number(form.privacyScore),
      description: form.description,
      clientDescription: form.clientDescription,
      advisorNotes: form.advisorNotes,
      amenities: parseAmenities(form.amenities),
      imageUrls: parseImageUrls(form.imageUrls),
      isActive: true,
    };
    try {
      if (editingId) {
        await services.hotel.updateHotel(editingId, payload);
        toast.success('Hotel updated');
      } else {
        await services.hotel.createHotel(payload);
        toast.success('Hotel created');
      }
      closeModal();
      await refresh();
    } catch {
      toast.error(editingId ? 'Failed to update hotel' : 'Failed to create hotel');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (hotelId: string) => {
    if (!confirm('Remove this hotel from the library?')) return;
    try {
      await services.hotel.deleteHotel(hotelId);
      if (selectedHotel?.id === hotelId) setSelectedHotel(null);
      toast.success('Hotel removed');
      await refresh();
    } catch {
      toast.error('Failed to remove hotel');
    }
  };

  const handleToggleActive = async (hotel: Hotel) => {
    setTogglingId(hotel.id);
    try {
      const updated = await services.hotel.toggleActive(hotel.id);
      setHotels((prev) => prev.map((h) => (h.id === hotel.id ? updated : h)));
      toast.success(`Hotel ${updated.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to toggle hotel status');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-rose-900">Hotel & Resort Library</h1>
          <p className="text-sm font-sans text-sand-600 mt-1">{hotels.length} properties in portfolio</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-rose-900 text-white text-sm font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Hotel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
          <input
            type="text"
            placeholder="Search by name, location, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as HotelRegion | 'All')}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Regions</option>
          {REGIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
        </select>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as HotelTier | 'All')}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Tiers</option>
          {TIERS.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-sand-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="font-sans text-sm">Loading hotels…</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-16 text-rose-700 font-sans text-sm">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((hotel) => (
            <div
              key={hotel.id}
              className={`border rounded-xl p-5 transition-all hover:shadow-md ${
                selectedHotel?.id === hotel.id ? 'border-rose-300 bg-rose-50/50 shadow-md' : 'border-sand-200 bg-white'
              } ${!hotel.isActive ? 'opacity-60' : ''}`}
            >
              <div
                className="cursor-pointer"
                onClick={() => setSelectedHotel(selectedHotel?.id === hotel.id ? null : hotel)}
              >
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

                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-olive-600" />
                  <div className="flex-1 h-2 bg-sand-100 rounded-full overflow-hidden">
                    <div className="h-full bg-olive-500 rounded-full" style={{ width: `${hotel.privacyScore}%` }} />
                  </div>
                  <span className="text-xs font-sans font-medium text-olive-700">{hotel.privacyScore}</span>
                </div>

                <p className="text-sm font-sans text-sand-600 line-clamp-2 mb-3">{hotel.clientDescription}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {hotel.amenities.slice(0, 4).map((a, i) => (
                    <span key={i} className="px-2 py-0.5 bg-sand-50 border border-sand-100 rounded text-xs font-sans text-sand-600">
                      {a.icon} {a.label}
                    </span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="px-2 py-0.5 text-xs font-sans text-sand-400">+{hotel.amenities.length - 4} more</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-sand-100">
                <span className="text-xs font-sans text-sand-500">{hotel.region}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(hotel)}
                    disabled={togglingId === hotel.id}
                    className={`text-xs font-sans px-2 py-1 rounded transition-colors disabled:opacity-50 ${
                      hotel.isActive
                        ? 'text-olive-700 bg-olive-50 hover:bg-olive-100'
                        : 'text-sand-600 bg-sand-100 hover:bg-sand-200'
                    }`}
                  >
                    {togglingId === hotel.id ? '…' : hotel.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => openEdit(hotel)}
                    className="p-1 text-sand-400 hover:text-rose-600 transition-colors"
                    aria-label="Edit hotel"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel.id)}
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
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sand-500 font-sans">No hotels match your filters.</p>
        </div>
      )}

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
              <h3 className="font-sans text-sm font-semibold text-sand-700 mb-1">Client-Facing Description</h3>
              <p className="text-sm font-sans text-sand-600 leading-relaxed">{selectedHotel.clientDescription}</p>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold text-sand-700 mb-1">Internal Notes</h3>
              <p className="text-sm font-sans text-sand-600 leading-relaxed">{selectedHotel.description}</p>
            </div>
            {selectedHotel.advisorNotes && (
              <div className="md:col-span-2">
                <h3 className="font-sans text-sm font-semibold text-sand-700 mb-1">Advisor Notes</h3>
                <p className="text-sm font-sans text-sand-600 leading-relaxed">{selectedHotel.advisorNotes}</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-sans text-sm font-semibold text-sand-700 mb-2">All Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {selectedHotel.amenities.map((a, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-sand-200 rounded-full text-sm font-sans text-sand-700">
                  {a.icon} {a.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-sand-100">
              <h2 className="font-serif text-xl text-rose-900">{editingId ? 'Edit Hotel' : 'Add Hotel'}</h2>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sand-700 font-medium">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sand-700 font-medium">Location</span>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sand-700 font-medium">Country</span>
                <input
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sand-700 font-medium">Region</span>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value as HotelRegion })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {REGIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sand-700 font-medium">Tier</span>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value as HotelTier })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {TIERS.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sand-700 font-medium">Privacy Score (0-100)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={form.privacyScore}
                  onChange={(e) => setForm({ ...form, privacyScore: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sand-700 font-medium">Description (Internal)</span>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sand-700 font-medium">Client Description</span>
                <textarea
                  rows={2}
                  value={form.clientDescription}
                  onChange={(e) => setForm({ ...form, clientDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sand-700 font-medium">Advisor Notes</span>
                <textarea
                  rows={2}
                  value={form.advisorNotes}
                  onChange={(e) => setForm({ ...form, advisorNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sand-700 font-medium">Image URLs (comma separated)</span>
                <textarea
                  rows={2}
                  value={form.imageUrls}
                  onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
                  placeholder="https://cdn.example.com/hero.jpg, https://cdn.example.com/suite.jpg"
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sand-700 font-medium">Amenities (comma separated)</span>
                <input
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                  placeholder="Spa, Private Beach, Helipad"
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-sand-100">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="px-4 py-2 text-sm font-sans font-medium text-sand-700 bg-sand-100 rounded-lg hover:bg-sand-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium text-white bg-rose-900 rounded-lg hover:bg-rose-800 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Save Changes' : 'Create Hotel'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
