'use client';

/**
 * Advisor Directory — Admin View
 * Shows all advisors with specializations and AGI auto-assign recommendation
 */

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { UserCheck } from 'lucide-react';

const MOCK_ADVISORS = [
  { id: 'adv-001', name: 'Sarah Montague', specialization: 'European Heritage & Private Estates', languages: ['English', 'French', 'Italian'], clientLoad: 4, maxClients: 6, satisfactionScore: 97, availability: 'Available' as const, regions: ['Europe', 'Mediterranean'], matchScore: 94 },
  { id: 'adv-002', name: 'James Okonkwo', specialization: 'Asia Pacific & Cultural Immersion', languages: ['English', 'Mandarin', 'Japanese'], clientLoad: 5, maxClients: 6, satisfactionScore: 95, availability: 'Available' as const, regions: ['Asia Pacific', 'Far East'], matchScore: 78 },
  { id: 'adv-003', name: 'Isabelle Fontaine', specialization: 'Wellness & Private Retreat Journeys', languages: ['English', 'French', 'Spanish'], clientLoad: 3, maxClients: 5, satisfactionScore: 98, availability: 'Available' as const, regions: ['Europe', 'Americas', 'Indian Ocean'], matchScore: 88 },
  { id: 'adv-004', name: 'Marcus Lindqvist', specialization: 'Nordic & Arctic Exclusive Access', languages: ['English', 'Swedish', 'Norwegian'], clientLoad: 6, maxClients: 6, satisfactionScore: 93, availability: 'Fully Engaged' as const, regions: ['Scandinavia', 'Arctic', 'North Atlantic'], matchScore: 62 },
];

type Availability = 'Available' | 'Fully Engaged' | 'On Leave';

const availColor = (a: Availability) => ({
  'Available': 'bg-emerald-100 text-emerald-700',
  'Fully Engaged': 'bg-amber-100 text-amber-700',
  'On Leave': 'bg-slate-100 text-slate-500',
}[a]);

interface AdvisorDirectoryProps {
  onAssign?: (advisorId: string, advisorName: string) => void;
  highlightMatchFor?: string;
}

export function AdvisorDirectory({ onAssign, highlightMatchFor }: AdvisorDirectoryProps) {
  const [assigned, setAssigned] = useState<string | null>(null);
  const sorted = [...MOCK_ADVISORS].sort((a, b) => b.matchScore - a.matchScore);

  const handleAssign = (id: string, name: string) => {
    setAssigned(id);
    onAssign?.(id, name);
  };

  return (
    <div>
      {highlightMatchFor && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <span className="text-blue-600 text-lg">{'\u25C8'}</span>
          <div>
            <p className="text-blue-800 font-sans font-medium text-sm">AGI Advisor Recommendation</p>
            <p className="text-blue-600 font-sans text-xs mt-0.5">
              Based on {highlightMatchFor}&apos;s emotional profile (Privacy: High, Cultural Access, Legacy),
              the optimal advisor match is <strong>Sarah Montague</strong> — Match Score: 94/100.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((advisor, i) => (
          <div
            key={advisor.id}
            className={cn(
              'p-4 rounded-xl border transition-all',
              i === 0 && highlightMatchFor ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-white',
              assigned === advisor.id && 'border-emerald-300 bg-emerald-50'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-sans font-medium text-slate-800 text-sm">{advisor.name}</span>
                  {i === 0 && highlightMatchFor && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">{'\u25C8'} AGI Top Match</span>
                  )}
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', availColor(advisor.availability))}>{advisor.availability}</span>
                </div>
                <p className="text-slate-500 text-xs font-sans mb-2">{advisor.specialization}</p>

                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">Clients:</span>
                    <span className="text-xs text-slate-600 font-medium">{advisor.clientLoad}/{advisor.maxClients}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">Satisfaction:</span>
                    <span className="text-xs text-emerald-600 font-medium">{advisor.satisfactionScore}%</span>
                  </div>
                  {highlightMatchFor && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Match:</span>
                      <span className={cn('text-xs font-medium', advisor.matchScore >= 85 ? 'text-blue-600' : 'text-slate-500')}>{advisor.matchScore}/100</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-1 mt-2 flex-wrap">
                  {advisor.languages.map(lang => (
                    <span key={lang} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{lang}</span>
                  ))}
                </div>
              </div>

              {assigned === advisor.id ? (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-sans font-medium px-3 py-1.5">
                  <UserCheck size={14} />
                  Assigned
                </div>
              ) : (
                <button
                  onClick={() => handleAssign(advisor.id, advisor.name)}
                  disabled={advisor.availability === 'Fully Engaged'}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-colors flex-shrink-0',
                    advisor.availability !== 'Fully Engaged' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  )}
                >
                  Assign
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
