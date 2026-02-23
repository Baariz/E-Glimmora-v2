'use client';

/**
 * Advisor Visibility Scope Component (PRIV-03, COLB-02)
 * Granular control over advisor access — luxury card style with custom toggles
 */

import { useState } from 'react';
import { AdvisorResourcePermissions } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, ChevronUp, Eye, EyeOff, Users } from 'lucide-react';

interface AdvisorVisibilityScopeProps {
  advisorIds: string[];
  advisorResourcePermissions: Record<string, AdvisorResourcePermissions>;
  journeys: Array<{ id: string; title: string }>;
  onChange: (permissions: Record<string, AdvisorResourcePermissions>) => void;
}

interface AdvisorCardProps {
  advisorId: string;
  advisorName: string;
  permissions: AdvisorResourcePermissions;
  journeys: Array<{ id: string; title: string }>;
  onChange: (permissions: AdvisorResourcePermissions) => void;
}

function AdvisorCard({ advisorId, advisorName, permissions, journeys, onChange }: AdvisorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const masterEnabled = permissions.journeys !== 'none';

  const handleMasterToggle = () => {
    if (masterEnabled) {
      onChange({ journeys: 'none', intelligence: false, memories: false });
    } else {
      onChange({ journeys: 'all', intelligence: true, memories: false });
    }
  };

  const handleJourneysChange = (value: 'all' | 'none' | string[]) => {
    onChange({ ...permissions, journeys: value });
  };

  const handleJourneyToggle = (journeyId: string) => {
    if (permissions.journeys === 'all' || permissions.journeys === 'none') return;

    const currentJourneys = permissions.journeys as string[];
    const newJourneys = currentJourneys.includes(journeyId)
      ? currentJourneys.filter((id) => id !== journeyId)
      : [...currentJourneys, journeyId];

    onChange({ ...permissions, journeys: newJourneys.length === 0 ? 'none' : newJourneys });
  };

  const handleResourceToggle = (resource: 'intelligence' | 'memories') => {
    onChange({ ...permissions, [resource]: !permissions[resource] });
  };

  const allJourneysSelected = permissions.journeys === 'all';
  const selectedJourneyCount =
    permissions.journeys === 'all'
      ? journeys.length
      : permissions.journeys === 'none'
      ? 0
      : (permissions.journeys as string[]).length;

  return (
    <div className={cn(
      'bg-white border rounded-2xl shadow-sm transition-all overflow-hidden',
      masterEnabled ? 'border-emerald-200/60' : 'border-stone-200/60'
    )}>
      {/* Master Toggle */}
      <div className="flex items-center justify-between p-6 sm:p-7">
        <div className="flex items-center gap-3.5">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            masterEnabled ? 'bg-emerald-50' : 'bg-stone-100'
          )}>
            {masterEnabled ? (
              <Eye size={16} className="text-emerald-600" />
            ) : (
              <EyeOff size={16} className="text-stone-400" />
            )}
          </div>
          <div>
            <h4 className="font-serif text-lg text-stone-900">{advisorName}</h4>
            <p className="text-[11px] font-sans text-stone-400 tracking-wide mt-0.5">
              {masterEnabled
                ? `Access to ${selectedJourneyCount} ${selectedJourneyCount === 1 ? 'journey' : 'journeys'}`
                : 'No access granted'}
            </p>
          </div>
        </div>

        <button
          onClick={handleMasterToggle}
          className={cn(
            'w-12 h-7 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0',
            masterEnabled ? 'bg-emerald-500' : 'bg-stone-200'
          )}
        >
          <div
            className={cn(
              'w-6 h-6 rounded-full bg-white shadow-sm transition-transform',
              masterEnabled ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>

      {/* Advanced Settings */}
      {masterEnabled && (
        <div className="border-t border-stone-200/60">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center gap-2 px-7 py-3.5 text-[11px] font-sans text-stone-400 tracking-wide hover:text-stone-600 transition-colors"
          >
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            Advanced Settings
          </button>

          {isExpanded && (
            <div className="px-7 pb-7 space-y-6">
              {/* Journey Selection */}
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-3">
                  Journey Access
                </p>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      allJourneysSelected ? 'border-emerald-500' : 'border-stone-300'
                    )}>
                      {allJourneysSelected && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </div>
                    <span className="text-sm font-sans text-stone-700">All Journeys</span>
                  </label>
                  <div onClick={() => handleJourneysChange(allJourneysSelected ? [] : permissions.journeys)} />

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={allJourneysSelected}
                      onChange={() => handleJourneysChange('all')}
                      className="sr-only"
                    />
                  </label>

                  <button
                    onClick={() =>
                      handleJourneysChange(
                        permissions.journeys === 'all' ? [] : permissions.journeys
                      )
                    }
                    className="flex items-center gap-3"
                  >
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      !allJourneysSelected ? 'border-emerald-500' : 'border-stone-300'
                    )}>
                      {!allJourneysSelected && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </div>
                    <span className="text-sm font-sans text-stone-700">Selected Journeys</span>
                  </button>

                  {!allJourneysSelected && journeys.length > 0 && (
                    <div className="ml-7 space-y-2 mt-2">
                      {journeys.map((journey) => {
                        const isChecked =
                          permissions.journeys !== 'none' &&
                          permissions.journeys !== 'all' &&
                          permissions.journeys.includes(journey.id);

                        return (
                          <button
                            key={journey.id}
                            onClick={() => handleJourneyToggle(journey.id)}
                            className="flex items-center gap-3 w-full text-left"
                          >
                            <div className={cn(
                              'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                              isChecked
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-stone-300'
                            )}>
                              {isChecked && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-sm font-sans text-stone-600">{journey.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Resource Type Permissions */}
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[4px] text-stone-400 mb-3">
                  Additional Access
                </p>
                <div className="space-y-2.5">
                  {[
                    { key: 'intelligence' as const, label: 'Intelligence Briefs' },
                    { key: 'memories' as const, label: 'Shared Memories' },
                  ].map((resource) => {
                    const isChecked = permissions[resource.key];
                    return (
                      <button
                        key={resource.key}
                        onClick={() => handleResourceToggle(resource.key)}
                        className="flex items-center gap-3 w-full text-left"
                      >
                        <div className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-stone-300'
                        )}>
                          {isChecked && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-sans text-stone-700">{resource.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdvisorVisibilityScope({
  advisorIds,
  advisorResourcePermissions,
  journeys,
  onChange,
}: AdvisorVisibilityScopeProps) {
  const handleAdvisorChange = (advisorId: string, permissions: AdvisorResourcePermissions) => {
    onChange({ ...advisorResourcePermissions, [advisorId]: permissions });
  };

  if (advisorIds.length === 0) {
    return (
      <div className="bg-white border border-stone-200/60 rounded-2xl p-10 sm:p-12 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-5">
          <Users size={20} className="text-stone-400" />
        </div>
        <h3 className="font-serif text-xl text-stone-800 mb-2">No advisors in your circle</h3>
        <p className="text-stone-400 font-sans text-sm leading-[1.7] tracking-wide max-w-sm mx-auto">
          Invite an advisor to grant them access to specific journeys and resources.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {advisorIds.map((advisorId) => {
        const permissions =
          advisorResourcePermissions[advisorId] || {
            journeys: 'none',
            intelligence: false,
            memories: false,
          };

        return (
          <AdvisorCard
            key={advisorId}
            advisorId={advisorId}
            advisorName={`Advisor ${advisorId.slice(0, 8)}`}
            permissions={permissions}
            journeys={journeys}
            onChange={(perms) => handleAdvisorChange(advisorId, perms)}
          />
        );
      })}
    </div>
  );
}
