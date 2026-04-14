'use client';

import { useEffect, useState, FormEvent } from 'react';
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  Loader2,
  X,
  Edit2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { Hotel, Package, ItineraryDay, HotelRegion } from '@/lib/types/entities';
import { toast } from 'sonner';

const REGIONS: HotelRegion[] = ['Europe', 'Asia Pacific', 'Middle East', 'Americas', 'Africa', 'Indian Ocean'];

interface DayDraft {
  day: number;
  title: string;
  description: string;
  activities: string;
  meals: string;
  transport: string;
}

interface PackageFormState {
  name: string;
  clientTitle: string;
  hotelId: string;
  duration: number;
  region: HotelRegion;
  category: string;
  tagline: string;
  itinerary: DayDraft[];
}

const EMPTY_FORM: PackageFormState = {
  name: '',
  clientTitle: '',
  hotelId: '',
  duration: 1,
  region: 'Europe',
  category: '',
  tagline: '',
  itinerary: [],
};

export default function PackagesPage() {
  const services = useServices();

  const [packages, setPackages] = useState<Package[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [activeHotels, setActiveHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<HotelRegion | 'All'>('All');
  const [hotelFilter, setHotelFilter] = useState<string>('All');
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [previewItinerary, setPreviewItinerary] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pkgs, hts, activeHts] = await Promise.all([
        services.package.getPackages(),
        services.hotel.getHotels(),
        services.hotel.getHotels({ active: true }),
      ]);
      setPackages(pkgs);
      setHotels(hts);
      setActiveHotels(activeHts);
    } catch {
      setError('Failed to load packages');
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = Array.from(new Set(packages.map((p) => p.category)));

  const filtered = packages.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.clientTitle.toLowerCase().includes(q) ||
      p.hotelName.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesRegion = regionFilter === 'All' || p.region === regionFilter;
    const matchesHotel = hotelFilter === 'All' || p.hotelId === hotelFilter;
    return matchesSearch && matchesCategory && matchesRegion && matchesHotel;
  });

  const handleDelete = async (pkgId: string) => {
    if (!confirm('Remove this package?')) return;
    try {
      await services.package.deletePackage(pkgId);
      toast.success('Package removed');
      await refresh();
    } catch {
      toast.error('Failed to remove package');
    }
  };

  const handleToggleActive = async (pkg: Package) => {
    setTogglingId(pkg.id);
    try {
      const updated = await services.package.toggleActive(pkg.id);
      setPackages((prev) => prev.map((p) => (p.id === pkg.id ? updated : p)));
      toast.success(`Package ${updated.isActive ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update package');
    } finally {
      setTogglingId(null);
    }
  };

  const getHotelPrivacyScore = (hotelId: string) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    return hotel?.privacyScore ?? 0;
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, hotelId: activeHotels[0]?.id || '' });
    setShowModal(true);
  };

  const openEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      clientTitle: pkg.clientTitle,
      hotelId: pkg.hotelId,
      duration: pkg.duration,
      region: pkg.region,
      category: pkg.category,
      tagline: pkg.tagline,
      itinerary: pkg.itinerary.map((d) => ({
        day: d.day,
        title: d.title,
        description: d.description,
        activities: d.activities.join(', '),
        meals: d.meals || '',
        transport: d.transport || '',
      })),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const moveDay = (idx: number, dir: -1 | 1) => {
    setForm((prev) => {
      const next = [...prev.itinerary];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      const a = next[idx];
      const b = next[target];
      if (!a || !b) return prev;
      next[idx] = b;
      next[target] = a;
      return { ...prev, itinerary: next.map((d, i) => ({ ...d, day: i + 1 })) };
    });
  };

  const addDay = () => {
    setForm((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: '', description: '', activities: '', meals: '', transport: '' },
      ],
    }));
  };

  const removeDay = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== idx)
        .map((d, i) => ({ ...d, day: i + 1 })),
    }));
  };

  const updateDay = (idx: number, patch: Partial<DayDraft>) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((d, i) => (i === idx ? { ...d, ...patch } : d)),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const hotel = activeHotels.find((h) => h.id === form.hotelId);
    if (!hotel) {
      toast.error('Select a hotel');
      return;
    }
    setSubmitting(true);
    const itinerary: ItineraryDay[] = form.itinerary.map((d) => ({
      day: d.day,
      title: d.title,
      description: d.description,
      activities: d.activities.split(',').map((s) => s.trim()).filter(Boolean),
      meals: d.meals || undefined,
      transport: d.transport || undefined,
    }));
    const payload: Partial<Package> = {
      name: form.name,
      clientTitle: form.clientTitle,
      hotelId: hotel.id,
      hotelName: hotel.name,
      duration: Number(form.duration),
      region: form.region,
      category: form.category,
      tagline: form.tagline,
      itinerary,
    };
    try {
      if (editingId) {
        await services.package.updatePackage(editingId, payload);
        toast.success('Package updated');
      } else {
        await services.package.createPackage({ ...payload, isActive: true });
        toast.success('Package created');
      }
      closeModal();
      await refresh();
    } catch {
      toast.error(editingId ? 'Failed to update package' : 'Failed to create package');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-rose-900">Package Builder</h1>
          <p className="text-sm font-sans text-sand-600 mt-1">
            {packages.length} packages &middot; {hotels.length} hotels available
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-rose-900 text-white text-sm font-sans font-medium rounded-lg hover:bg-rose-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Package
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
          <input
            type="text"
            placeholder="Search packages, hotels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as HotelRegion | 'All')}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Regions</option>
          {REGIONS.map((r) => (<option key={r} value={r}>{r}</option>))}
        </select>
        <select
          value={hotelFilter}
          onChange={(e) => setHotelFilter(e.target.value)}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="All">All Hotels</option>
          {hotels.map((h) => (<option key={h.id} value={h.id}>{h.name}</option>))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-sand-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="font-sans text-sm">Loading packages…</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-16 text-rose-700 font-sans text-sm">{error}</div>
      )}

      {!loading && !error && (
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
                <div className="p-5 cursor-pointer" onClick={() => setExpandedPackage(isExpanded ? null : pkg.id)}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-serif text-lg text-rose-900 font-medium">{pkg.name}</h3>
                        <span className="px-2 py-0.5 bg-sand-100 rounded text-xs font-sans text-sand-600">{pkg.category}</span>
                      </div>
                      <p className="text-sm font-sans text-sand-500 italic">&ldquo;{pkg.clientTitle}&rdquo;</p>
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
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-sand-400" /> : <ChevronDown className="w-5 h-5 text-sand-400" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-sand-100 p-5">
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-sans">
                      <span className="text-sand-600">Region: <span className="text-sand-800 font-medium">{pkg.region}</span></span>
                      <span className="text-sand-600">Hotel Privacy: <span className="text-olive-700 font-medium">{getHotelPrivacyScore(pkg.hotelId)}/100</span></span>
                      <span className="text-sand-600">Days: <span className="text-sand-800 font-medium">{pkg.itinerary.length}</span></span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => setPreviewItinerary(isPreview ? null : pkg.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans font-medium text-rose-900 bg-rose-50 rounded-lg hover:bg-rose-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isPreview ? 'Hide Itinerary' : 'Preview Itinerary'}
                      </button>
                      <button
                        onClick={() => openEdit(pkg)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans text-rose-900 bg-rose-50 rounded-lg hover:bg-rose-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(pkg)}
                        disabled={togglingId === pkg.id}
                        className={`px-3 py-1.5 text-sm font-sans rounded-lg disabled:opacity-50 ${
                          pkg.isActive ? 'text-olive-700 bg-olive-50 hover:bg-olive-100' : 'text-sand-600 bg-sand-100 hover:bg-sand-200'
                        }`}
                      >
                        {togglingId === pkg.id ? '…' : pkg.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>

                    {isPreview && (
                      <div className="mt-4 space-y-3">
                        <h4 className="font-sans text-sm font-semibold text-sand-700">Day-by-Day Itinerary</h4>
                        <div className="relative pl-6 border-l-2 border-rose-200 space-y-4">
                          {pkg.itinerary.map((day: ItineraryDay) => (
                            <div key={day.day} className="relative">
                              <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-rose-400 border-2 border-white" />
                              <div className="bg-sand-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-sans font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded">Day {day.day}</span>
                                  <h5 className="font-sans text-sm font-semibold text-sand-800">{day.title}</h5>
                                </div>
                                <p className="text-sm font-sans text-sand-600 mb-2">{day.description}</p>
                                <div className="space-y-1">
                                  {day.activities.map((a, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs font-sans text-sand-600">
                                      <span className="text-rose-400 mt-0.5">&bull;</span>
                                      {a}
                                    </div>
                                  ))}
                                </div>
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
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sand-500 font-sans">No packages match your filters.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-sand-100 flex items-center justify-between">
              <h2 className="font-serif text-xl text-rose-900">{editingId ? 'Edit Package' : 'New Package'}</h2>
              <button type="button" onClick={closeModal} className="text-sand-400 hover:text-sand-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
              <label className="space-y-1">
                <span className="text-sand-700 font-medium">Name (Internal)</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sand-700 font-medium">Client Title</span>
                <input
                  required
                  value={form.clientTitle}
                  onChange={(e) => setForm({ ...form, clientTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sand-700 font-medium">Hotel</span>
                <select
                  required
                  value={form.hotelId}
                  onChange={(e) => setForm({ ...form, hotelId: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">— Select hotel —</option>
                  {activeHotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name} — {h.location}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-sand-700 font-medium">Duration (nights)</span>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
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
                <span className="text-sand-700 font-medium">Category</span>
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Wellness, Cultural, Adventure…"
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-sand-700 font-medium">Tagline</span>
                <input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </label>
            </div>

            <div className="px-6 pb-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-rose-900">Itinerary</h3>
                <button
                  type="button"
                  onClick={addDay}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-sans font-medium text-rose-900 bg-rose-50 rounded-lg hover:bg-rose-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Day
                </button>
              </div>

              {form.itinerary.length === 0 && (
                <p className="text-sm font-sans text-sand-500 italic mb-3">No days yet — click &ldquo;Add Day&rdquo; to begin.</p>
              )}

              <div className="space-y-3">
                {form.itinerary.map((d, idx) => (
                  <div key={idx} className="border border-sand-200 rounded-lg p-4 space-y-2 text-sm font-sans">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">Day {d.day}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveDay(idx, -1)}
                          disabled={idx === 0}
                          className="text-sand-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-sand-400"
                          aria-label="Move day up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDay(idx, 1)}
                          disabled={idx === form.itinerary.length - 1}
                          className="text-sand-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-sand-400"
                          aria-label="Move day down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDay(idx)}
                          className="text-sand-400 hover:text-rose-600"
                          aria-label="Remove day"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      placeholder="Title"
                      value={d.title}
                      onChange={(e) => updateDay(idx, { title: e.target.value })}
                      className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={d.description}
                      onChange={(e) => updateDay(idx, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <input
                      placeholder="Activities (comma separated)"
                      value={d.activities}
                      onChange={(e) => updateDay(idx, { activities: e.target.value })}
                      className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Meals"
                        value={d.meals}
                        onChange={(e) => updateDay(idx, { meals: e.target.value })}
                        className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <input
                        placeholder="Transport"
                        value={d.transport}
                        onChange={(e) => updateDay(idx, { transport: e.target.value })}
                        className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
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
                {editingId ? 'Save Changes' : 'Create Package'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
