'use client';

/**
 * Advisor Visibility Scope Component (PRIV-03, COLB-02)
 * Granular control over advisor access with per-journey and per-resource-type permissions
 */

import { useState } from 'react';
import { AdvisorResourcePermissions } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

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
      // Turn off all permissions
      onChange({
        journeys: 'none',
        intelligence: false,
        memories: false,
      });
    } else {
      // Turn on default permissions
      onChange({
        journeys: 'all',
        intelligence: true,
        memories: false,
      });
    }
  };

  const handleJourneysChange = (value: 'all' | 'none' | string[]) => {
    onChange({
      ...permissions,
      journeys: value,
    });
  };

  const handleJourneyToggle = (journeyId: string) => {
    if (permissions.journeys === 'all' || permissions.journeys === 'none') {
      // Can't toggle individual journeys when set to all/none
      return;
    }

    const currentJourneys = permissions.journeys as string[];
    const newJourneys = currentJourneys.includes(journeyId)
      ? currentJourneys.filter(id => id !== journeyId)
      : [...currentJourneys, journeyId];

    onChange({
      ...permissions,
      journeys: newJourneys.length === 0 ? 'none' : newJourneys,
    });
  };

  const handleResourceToggle = (resource: 'intelligence' | 'memories') => {
    onChange({
      ...permissions,
      [resource]: !permissions[resource],
    });
  };

  const allJourneysSelected = permissions.journeys === 'all';
  const selectedJourneyCount =
    permissions.journeys === 'all'
      ? journeys.length
      : permissions.journeys === 'none'
      ? 0
      : (permissions.journeys as string[]).length;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-stone-200">
      {/* Master Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {masterEnabled ? (
            <Eye className="w-5 h-5 text-teal-600" />
          ) : (
            <EyeOff className="w-5 h-5 text-stone-400" />
          )}
          <div>
            <h4 className="font-serif text-lg text-stone-900">{advisorName}</h4>
            <p className="text-sm text-stone-500">
              {masterEnabled
                ? `Access to ${selectedJourneyCount} ${selectedJourneyCount === 1 ? 'journey' : 'journeys'}`
                : 'No access'}
            </p>
          </div>
        </div>

        <button
          onClick={handleMasterToggle}
          className={cn(
            'relative w-14 h-8 rounded-full transition-colors',
            masterEnabled ? 'bg-teal-600' : 'bg-stone-300'
          )}
          aria-label={masterEnabled ? 'Disable advisor access' : 'Enable advisor access'}
        >
          <div
            className={cn(
              'absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform',
              masterEnabled ? 'translate-x-7' : 'translate-x-1'
            )}
          />
        </button>
      </div>

      {/* Advanced Settings */}
      {masterEnabled && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors mb-3"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Advanced Settings
          </button>

          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-stone-200">
              {/* Journey Selection */}
              <div>
                <div className="text-sm font-medium text-stone-700 mb-2">Journey Access</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={allJourneysSelected}
                      onChange={() => handleJourneysChange('all')}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-stone-700">All Journeys</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={!allJourneysSelected}
                      onChange={() =>
                        handleJourneysChange(
                          permissions.journeys === 'all' ? [] : permissions.journeys
                        )
                      }
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-stone-700">Selected Journeys</span>
                  </label>

                  {!allJourneysSelected && journeys.length > 0 && (
                    <div className="ml-7 space-y-1.5 mt-2">
                      {journeys.map(journey => (
                        <label key={journey.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              permissions.journeys !== 'none' &&
                              permissions.journeys !== 'all' &&
                              permissions.journeys.includes(journey.id)
                            }
                            onChange={() => handleJourneyToggle(journey.id)}
                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-stone-600">{journey.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Resource Type Permissions */}
              <div>
                <div className="text-sm font-medium text-stone-700 mb-2">Additional Access</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.intelligence}
                      onChange={() => handleResourceToggle('intelligence')}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-stone-700">Intelligence Briefs</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.memories}
                      onChange={() => handleResourceToggle('memories')}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-stone-700">Shared Memories</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </>
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
    onChange({
      ...advisorResourcePermissions,
      [advisorId]: permissions,
    });
  };

  if (advisorIds.length === 0) {
    return (
      <div className="bg-stone-50 rounded-xl p-8 text-center">
        <p className="text-stone-600">No advisors in your circle yet.</p>
        <p className="text-sm text-stone-500 mt-1">
          Invite an advisor to grant them access to specific journeys and resources.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {advisorIds.map(advisorId => {
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
            onChange={perms => handleAdvisorChange(advisorId, perms)}
          />
        );
      })}
    </div>
  );
}
