'use client';

/**
 * Geopolitical Map Component (RISK-01)
 * Visual risk map display using colored region cards with filtering and country detail navigation
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useServices } from '@/lib/hooks/useServices';
import { GeopoliticalRisk, ThreatLevel } from '@/lib/types/entities';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { MapPin, AlertCircle } from 'lucide-react';

const THREAT_COLOR_MAP: Record<ThreatLevel, string> = {
  Low: 'bg-olive-50 border-olive-200 hover:bg-olive-100',
  Moderate: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  Elevated: 'bg-gold-50 border-gold-200 hover:bg-gold-100',
  High: 'bg-rose-50 border-rose-200 hover:bg-rose-100',
  Critical: 'bg-red-50 border-red-200 hover:bg-red-100',
};

export function GeopoliticalMap() {
  const router = useRouter();
  const { risk } = useServices();
  const [risks, setRisks] = useState<GeopoliticalRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<ThreatLevel | 'All'>('All');

  useEffect(() => {
    loadRisks();
  }, []);

  const loadRisks = async () => {
    try {
      setLoading(true);
      const data = await risk.getGeopoliticalRisks();
      setRisks(data);
    } catch (error) {
      console.error('Failed to load geopolitical risks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRisks = risks.filter(
    r => filterLevel === 'All' || r.threatLevel === filterLevel
  );

  const handleCountryClick = (country: string) => {
    router.push(`/risk/${encodeURIComponent(country.toLowerCase())}`);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center gap-4">
        <label className="font-sans text-sm text-slate-700 font-medium">
          Filter by threat level:
        </label>
        <div className="flex gap-2">
          {['All', 'Low', 'Moderate', 'Elevated', 'High', 'Critical'].map(level => (
            <button
              key={level}
              onClick={() => setFilterLevel(level as ThreatLevel | 'All')}
              className={`px-3 py-1.5 rounded-md font-sans text-sm transition-colors ${
                filterLevel === level
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Distribution Summary */}
      <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-500" />
          <span className="font-sans text-sm text-slate-700">
            <strong>{filteredRisks.length}</strong> of <strong>{risks.length}</strong> countries
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-sans">
          <span className="text-olive-700">
            Low: {risks.filter(r => r.threatLevel === 'Low').length}
          </span>
          <span className="text-blue-700">
            Moderate: {risks.filter(r => r.threatLevel === 'Moderate').length}
          </span>
          <span className="text-gold-700">
            Elevated: {risks.filter(r => r.threatLevel === 'Elevated').length}
          </span>
          <span className="text-rose-700">
            High: {risks.filter(r => r.threatLevel === 'High').length}
          </span>
          <span className="text-red-700">
            Critical: {risks.filter(r => r.threatLevel === 'Critical').length}
          </span>
        </div>
      </div>

      {/* Country Risk Cards Grid */}
      {filteredRisks.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="font-sans text-sm text-slate-500">
            No countries match the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRisks.map(risk => (
            <div
              key={risk.id}
              onClick={() => handleCountryClick(risk.country)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                THREAT_COLOR_MAP[risk.threatLevel]
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-lg text-slate-900 mb-1">
                    {risk.country}
                  </h3>
                  <p className="font-sans text-xs text-slate-600">{risk.region}</p>
                </div>
                <StatusBadge status={risk.threatLevel} size="md" />
              </div>

              <div className="space-y-2">
                <p className="font-sans text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Risk Factors:
                </p>
                <ul className="space-y-1">
                  {risk.riskFactors.slice(0, 3).map((factor, idx) => (
                    <li key={idx} className="font-sans text-xs text-slate-600 flex items-start gap-1">
                      <span className="text-slate-400">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
                {risk.riskFactors.length > 3 && (
                  <p className="font-sans text-xs text-slate-500 italic">
                    +{risk.riskFactors.length - 3} more
                  </p>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="font-sans text-xs text-slate-500">
                  Last updated: {new Date(risk.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
