'use client';

import { Card } from '@/components/shared/Card';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { VendorScreening } from '@/lib/types';

interface ScreeningDashboardProps {
  screenings: VendorScreening[];
}

const screeningStatusColors: Record<string, string> = {
  'Not Started': 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  Passed: 'bg-teal-100 text-teal-800',
  Failed: 'bg-rose-100 text-rose-800',
  Expired: 'bg-amber-100 text-amber-800',
};

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-teal-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

export function ScreeningDashboard({ screenings }: ScreeningDashboardProps) {
  if (screenings.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No screening records</p>;
  }

  const passed = screenings.filter(s => s.overallScreeningStatus === 'Passed').length;
  const failed = screenings.filter(s => s.overallScreeningStatus === 'Failed').length;
  const expired = screenings.filter(s => s.overallScreeningStatus === 'Expired').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-teal-50 rounded-lg p-3 text-center">
          <p className="font-serif text-2xl text-teal-700">{passed}</p>
          <p className="font-sans text-xs text-teal-600">Passed</p>
        </div>
        <div className="bg-rose-50 rounded-lg p-3 text-center">
          <p className="font-serif text-2xl text-rose-700">{failed}</p>
          <p className="font-sans text-xs text-rose-600">Failed</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <p className="font-serif text-2xl text-amber-700">{expired}</p>
          <p className="font-sans text-xs text-amber-600">Expired</p>
        </div>
      </div>

      <div className="space-y-3">
        {screenings.map(s => (
          <Card key={s.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{s.vendorName}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-medium mt-1 ${screeningStatusColors[s.overallScreeningStatus]}`}>
                    {s.overallScreeningStatus}
                  </span>
                </div>
                <p className="font-sans text-[10px] text-slate-400">Screened: {new Date(s.screenedAt).toLocaleDateString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-sans text-[10px] text-slate-500 mb-1">Financial Health ({s.financialHealthScore}/100)</p>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${scoreColor(s.financialHealthScore)}`} style={{ width: `${s.financialHealthScore}%` }} />
                  </div>
                  <div className="mt-1 space-y-0.5 text-[10px] font-sans text-slate-500">
                    <p>Credit: {s.financialHealthDetails.creditRating} | Debt Ratio: {(s.financialHealthDetails.debtRatio * 100).toFixed(0)}%</p>
                    <p>Bankruptcy Risk: {s.financialHealthDetails.bankruptcyRisk}</p>
                  </div>
                </div>
                <div>
                  <p className="font-sans text-[10px] text-slate-500 mb-1">Security Assessment ({s.securityAssessmentScore}/100)</p>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${scoreColor(s.securityAssessmentScore)}`} style={{ width: `${s.securityAssessmentScore}%` }} />
                  </div>
                  <div className="mt-1 space-y-0.5 text-[10px] font-sans text-slate-500">
                    <p>Certs: {s.securityAssessmentDetails.certifications.join(', ')}</p>
                    <p>Incidents: {s.securityAssessmentDetails.incidentHistory}</p>
                  </div>
                </div>
              </div>

              <p className="font-sans text-[10px] text-slate-400">
                Expires: {new Date(s.expiresAt).toLocaleDateString()} | Screened by: {s.screenedBy}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
