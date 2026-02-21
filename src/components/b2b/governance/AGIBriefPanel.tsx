'use client';

/**
 * AGI Intelligence Brief Panel — Advisor View
 * Dark card — signals intelligence, internal-only
 * Shows ranked hotel options, aviation shortlist, risk summary
 * NEVER shown to UHNI client
 */

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, ChevronUp, Shield, Plane, Building2 } from 'lucide-react';

interface AGIBriefPanelProps {
  journeyId: string;
  clientName: string;
}

const MOCK_HOTELS = [
  { name: 'Aman Venice', location: 'Venice, Italy', privacyScore: 96, emotionalMatch: 94, riskLevel: 'Low' as const, note: 'Private canal entrance. Zero press exposure. Aligned with client discretion tier: High.', recommended: true },
  { name: 'Hotel de Crillon', location: 'Paris, France', privacyScore: 88, emotionalMatch: 91, riskLevel: 'Low' as const, note: 'Presidential suite with private access. Minor exposure risk during fashion week.', recommended: false },
  { name: 'Four Seasons George V', location: 'Paris, France', privacyScore: 82, emotionalMatch: 87, riskLevel: 'Medium' as const, note: 'High-visibility address. Recommend only if prestige outweighs privacy for this client.', recommended: false },
];

const MOCK_JETS = [
  { operator: 'VistaJet', aircraft: 'Global 7500', availability: 'Confirmed' as const, note: 'Client-preferred operator. NDA: verified.' },
  { operator: 'NetJets Europe', aircraft: 'Bombardier Challenger 350', availability: 'Pending' as const, note: 'Backup option. Same privacy and security standards.' },
];

type SectionKey = 'hotels' | 'aviation' | 'risk';

export function AGIBriefPanel({ journeyId, clientName }: AGIBriefPanelProps) {
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);
  const [advisorNote, setAdvisorNote] = useState('');

  const toggle = (section: SectionKey) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const riskColor = (level: 'Low' | 'Medium' | 'High') => ({
    Low: 'text-emerald-400 bg-emerald-900/40',
    Medium: 'text-amber-400 bg-amber-900/40',
    High: 'text-red-400 bg-red-900/40',
  }[level]);

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 text-lg">{'\u25C8'}</span>
          <div>
            <p className="text-white font-sans font-medium text-sm">AGI Intelligence Brief</p>
            <p className="text-slate-400 text-xs font-sans">For {clientName} — Internal Only</p>
          </div>
        </div>
        <span className="text-xs font-sans px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Confidential</span>
      </div>

      <div className="p-6 space-y-4">
        {/* Hotel Recommendations */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <button onClick={() => toggle('hotels')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-white">
              <Building2 size={16} className="text-slate-400" />
              <span className="font-sans text-sm font-medium">Hotel Recommendations</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">3 options</span>
            </div>
            {openSection === 'hotels' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          {openSection === 'hotels' && (
            <div className="p-4 space-y-3">
              {MOCK_HOTELS.map((hotel, i) => (
                <div key={i} className={cn('p-4 rounded-lg border', hotel.recommended ? 'border-amber-500/40 bg-amber-900/20' : 'border-slate-600 bg-slate-700/30')}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-sans text-sm font-medium">{hotel.name}</span>
                        {hotel.recommended && <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">AGI Recommended</span>}
                      </div>
                      <span className="text-slate-400 text-xs">{hotel.location}</span>
                    </div>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', riskColor(hotel.riskLevel))}>{hotel.riskLevel} Risk</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Privacy Score</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${hotel.privacyScore}%` }} />
                        </div>
                        <span className="text-emerald-400 text-xs font-medium">{hotel.privacyScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Emotional Match</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${hotel.emotionalMatch}%` }} />
                        </div>
                        <span className="text-amber-400 text-xs font-medium">{hotel.emotionalMatch}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{hotel.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aviation */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <button onClick={() => toggle('aviation')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-white">
              <Plane size={16} className="text-slate-400" />
              <span className="font-sans text-sm font-medium">Private Aviation Shortlist</span>
            </div>
            {openSection === 'aviation' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          {openSection === 'aviation' && (
            <div className="p-4 space-y-2">
              {MOCK_JETS.map((jet, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-sans text-sm font-medium">{jet.operator}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', jet.availability === 'Confirmed' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400')}>{jet.availability}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{jet.aircraft} — {jet.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Risk Summary */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <button onClick={() => toggle('risk')} className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-white">
              <Shield size={16} className="text-slate-400" />
              <span className="font-sans text-sm font-medium">Risk & Exposure Summary</span>
            </div>
            {openSection === 'risk' ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
          </button>
          {openSection === 'risk' && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/40">
                  <p className="text-emerald-400 text-xs font-sans uppercase tracking-wider mb-1">Overall Risk</p>
                  <p className="text-emerald-300 font-sans font-medium">Low</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                  <p className="text-slate-400 text-xs font-sans uppercase tracking-wider mb-1">Privacy Alignment</p>
                  <p className="text-white font-sans font-medium">93 / 100</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600">
                <p className="text-slate-400 text-xs mb-1">Exposure Assessment</p>
                <p className="text-slate-300 text-sm">No known public events during travel window. Political stability: Stable. Media risk: Minimal.</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-2">Your Notes (Internal)</p>
                <textarea
                  value={advisorNote}
                  onChange={(e) => setAdvisorNote(e.target.value)}
                  placeholder="Add any advisor notes for this brief..."
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 text-xs font-sans placeholder-slate-500 resize-none focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
