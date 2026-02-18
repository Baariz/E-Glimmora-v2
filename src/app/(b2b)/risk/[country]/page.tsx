'use client';

/**
 * Country Risk Detail Page
 * Shows detailed risk information for a specific country
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { useServices } from '@/lib/hooks/useServices';
import { GeopoliticalRisk, TravelAdvisory } from '@/lib/types/entities';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { ArrowLeft, MapPin, AlertTriangle, Calendar } from 'lucide-react';

export default function CountryRiskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { risk } = useServices();
  const [countryRisk, setCountryRisk] = useState<GeopoliticalRisk | null>(null);
  const [advisory, setAdvisory] = useState<TravelAdvisory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountryData();
  }, [params.country]);

  const loadCountryData = async () => {
    try {
      setLoading(true);
      const countryName = decodeURIComponent(params.country as string);

      const risks = await risk.getGeopoliticalRisks();
      const advisories = await risk.getTravelAdvisories();

      const foundRisk = risks.find(
        r => r.country.toLowerCase() === countryName.toLowerCase()
      );
      const foundAdvisory = advisories.find(
        a => a.country.toLowerCase() === countryName.toLowerCase()
      );

      setCountryRisk(foundRisk || null);
      setAdvisory(foundAdvisory || null);
    } catch (error) {
      console.error('Failed to load country data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!countryRisk) {
    return (
      <div className="p-8">
        <Card className="bg-slate-50">
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-slate-900 mb-2">Country Not Found</h2>
            <p className="font-sans text-sm text-slate-600 mb-4">
              No risk data available for this country.
            </p>
            <button
              onClick={() => router.push('/risk')}
              className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm"
            >
              Back to Risk Intelligence
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/risk')}
        className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-sans text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Risk Intelligence
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-2">
            {countryRisk.country}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm text-slate-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {countryRisk.region}
            </span>
            <StatusBadge status={countryRisk.threatLevel} size="md" />
          </div>
        </div>
        <div className="text-right">
          <p className="font-sans text-xs text-slate-500">Last Updated</p>
          <p className="font-sans text-sm text-slate-900">
            {new Date(countryRisk.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Risk Factors */}
      <Card>
        <h2 className="font-serif text-xl text-slate-900 mb-4">Risk Factors</h2>
        <ul className="space-y-3">
          {countryRisk.riskFactors.map((factor, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="font-sans text-sm text-slate-800">{factor}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Travel Advisory */}
      {advisory && (
        <Card className="border-l-4 border-amber-400">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-xl text-slate-900 mb-1">Active Travel Advisory</h2>
              <div className="flex items-center gap-2">
                <StatusBadge status={advisory.advisoryLevel} size="md" />
                <span className="font-sans text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Effective: {new Date(advisory.effectiveDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg">
            <p className="font-sans text-sm text-slate-800 leading-relaxed">
              {advisory.summary}
            </p>
          </div>
        </Card>
      )}

      {!advisory && (
        <Card>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-serif text-lg text-slate-700 mb-2">No Active Travel Advisory</h3>
            <p className="font-sans text-sm text-slate-600">
              There is currently no travel advisory in effect for {countryRisk.country}.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
