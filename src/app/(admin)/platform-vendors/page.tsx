'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Shield, Search } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { useServices } from '@/lib/hooks/useServices';
import { VendorDirectory } from '@/components/b2b/vendors/VendorDirectory';
import type { Vendor, Institution } from '@/lib/types';

export default function AdminVendorsPage() {
  const router = useRouter();
  const services = useServices();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState<string>('All');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [v, i] = await Promise.all([
        services.vendor.getVendors(),
        services.institution.getInstitutions(),
      ]);
      setVendors(v);
      setInstitutions(i);
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      if (err.status === 401) {
        router.push('/auth/signin');
        return;
      }
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [services, router]);

  useEffect(() => { load(); }, [load]);

  const institutionNameMap = useMemo(
    () => Object.fromEntries(institutions.map(i => [i.id, i.name])),
    [institutions]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vendors.filter(v => {
      const matchesSearch = !q
        || v.name.toLowerCase().includes(q)
        || v.contactName.toLowerCase().includes(q)
        || v.category.toLowerCase().includes(q)
        || v.headquartersCountry.toLowerCase().includes(q);
      const matchesInstitution = institutionFilter === 'All' || v.institutionId === institutionFilter;
      return matchesSearch && matchesInstitution;
    });
  }, [vendors, search, institutionFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-rose-900">Platform Vendor Registry</h1>
          <p className="text-sm font-sans text-sand-600 mt-1">
            Read-only view across all institutions ({vendors.length} vendors)
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-sans text-sand-700 bg-white border border-sand-200 rounded-lg hover:bg-sand-50 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
          <input
            type="text"
            placeholder="Search by name, contact, category, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <select
          value={institutionFilter}
          onChange={(e) => setInstitutionFilter(e.target.value)}
          className="px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500 min-w-[200px]"
        >
          <option value="All">All institutions ({vendors.length})</option>
          {institutions.map(i => (
            <option key={i.id} value={i.id}>
              {i.name} ({vendors.filter(v => v.institutionId === i.id).length})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-lg bg-sand-100 animate-pulse" />)}
        </div>
      )}

      {!loading && error && (
        <Card className="bg-rose-50 border-rose-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-rose-600" />
              <p className="text-sm text-rose-800 font-sans">{error}</p>
            </div>
            <button onClick={load}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-rose-700 bg-white rounded-md hover:bg-rose-100">
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        </Card>
      )}

      {!loading && !error && (
        <Card>
          <VendorDirectory
            vendors={filtered}
            canManage={false}
            canSeeContract={true}
            showInstitutionColumn
            institutionNameMap={institutionNameMap}
          />
        </Card>
      )}
    </div>
  );
}
