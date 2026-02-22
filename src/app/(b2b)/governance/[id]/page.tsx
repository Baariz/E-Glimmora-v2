'use client';

/**
 * Journey Detail Page (B2B Governance View)
 * Full governance workflow with state machine, version history, execution tracking
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { Journey, ClientRecord } from '@/lib/types/entities';
import { useServices } from '@/lib/hooks/useServices';
import { getStateLabel, getStateColor } from '@/lib/state-machines/journey-workflow';
import { Card, CardHeader, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { JourneyGovernancePanel } from '@/components/b2b/workflows/JourneyGovernancePanel';
import { VersionHistory } from '@/components/b2b/workflows/VersionHistory';
import { AGIBriefPanel } from '@/components/b2b/governance/AGIBriefPanel';
import { PackageSelector } from '@/components/b2b/governance/PackageSelector';
import { TravelMonitorPanel } from '@/components/b2b/governance/TravelMonitorPanel';
import { PreDepartureBrief } from '@/components/b2b/governance/PreDepartureBrief';
import { ExecutionTracker } from '@/components/b2b/workflows/ExecutionTracker';
import { PresentationExport } from '@/components/b2b/workflows/PresentationExport';
import { JourneyStatus } from '@/lib/types/entities';
import { toast } from 'sonner';

export default function GovernanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { can } = useCan();
  const services = useServices();
  const journeyId = params.id as string;

  const [journey, setJourney] = useState<Journey | null>(null);
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNarrative, setEditedNarrative] = useState('');

  useEffect(() => {
    loadJourney();
  }, [journeyId]);

  const loadJourney = async () => {
    try {
      setLoading(true);
      const journeyData = await services.journey.getJourneyById(journeyId);
      if (!journeyData) {
        toast.error('Journey not found');
        router.push('/governance');
        return;
      }
      setJourney(journeyData);
      setEditedNarrative(journeyData.narrative);

      // Load client info
      if (journeyData.userId) {
        // In mock, we need to find client by userId
        const clients = await services.client.getClientsByRM('b2b-rm-001-uuid-placeholder');
        const clientData = clients.find((c) => c.userId === journeyData.userId);
        if (clientData) {
          setClient(clientData);
        }
      }
    } catch (error) {
      console.error('Failed to load journey:', error);
      toast.error('Failed to load journey');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNarrative = async () => {
    if (!journey) return;

    try {
      // Create new version with updated narrative
      await services.journey.createJourneyVersion(journey.id, {
        title: journey.title,
        narrative: editedNarrative,
        status: journey.status,
        modifiedBy: 'b2b-rm-001-uuid-placeholder',
      });

      toast.success('Journey narrative updated');
      setIsEditing(false);
      loadJourney(); // Reload to get new version
    } catch (error) {
      console.error('Failed to save narrative:', error);
      toast.error('Failed to save narrative');
    }
  };

  const canEdit = journey && (journey.status === JourneyStatus.DRAFT || journey.status === JourneyStatus.RM_REVIEW);

  if (!can(Permission.READ, 'journey')) {
    return (
      <div className="p-8">
        <p className="font-sans text-slate-600">You do not have permission to view this journey.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 font-sans text-slate-600">Loading journey...</div>;
  }

  if (!journey) {
    return <div className="p-8 font-sans text-slate-600">Journey not found.</div>;
  }

  const stateColor = getStateColor(journey.status);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-sans text-sm text-slate-600">
        <Link href="/governance" className="hover:text-rose-600 transition-colors">
          Journey Governance
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900">{journey.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl text-rose-900 mb-2">{journey.title}</h1>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full bg-${stateColor}-100 text-${stateColor}-800 font-sans text-sm font-medium`}
            >
              {getStateLabel(journey.status)}
            </span>
            <span className="px-3 py-1 rounded-full bg-olive-100 text-olive-800 font-sans text-sm">
              {journey.category}
            </span>
            {journey.discretionLevel && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-sans text-sm">
                {journey.discretionLevel} Discretion
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Narrative Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-rose-900">Journey Narrative</h2>
                {canEdit && !isEditing && can(Permission.WRITE, 'journey') && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editedNarrative}
                    onChange={(e) => setEditedNarrative(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <Button variant="primary" size="sm" onClick={handleSaveNarrative}>
                      Save Changes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedNarrative(journey.narrative);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="font-serif text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {journey.narrative}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Journey Details */}
          <Card>
            <CardHeader>
              <h2 className="font-serif text-xl text-rose-900">Journey Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journey.emotionalObjective && (
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-slate-700 mb-1">
                      Emotional Objective
                    </h3>
                    <p className="font-sans text-sm text-slate-600">{journey.emotionalObjective}</p>
                  </div>
                )}
                {journey.strategicReasoning && (
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-slate-700 mb-1">
                      Strategic Reasoning
                    </h3>
                    <p className="font-sans text-sm text-slate-600">{journey.strategicReasoning}</p>
                  </div>
                )}
                {journey.riskSummary && (
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-slate-700 mb-1">
                      Risk Summary
                    </h3>
                    <p className="font-sans text-sm text-slate-600">{journey.riskSummary}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Version History */}
          <VersionHistory journey={journey} onVersionChange={loadJourney} />

          {/* Execution Tracker - only show when APPROVED or later */}
          {[
            JourneyStatus.APPROVED,
            JourneyStatus.PRESENTED,
            JourneyStatus.EXECUTED,
            JourneyStatus.ARCHIVED,
          ].includes(journey.status) && <ExecutionTracker journey={journey} />}

          {/* AGI Brief Panel — gated on READ journey permission */}
          {can(Permission.READ, 'journey') && (
            <AGIBriefPanel journeyId={journey.id} clientName={client?.name || 'Client'} />
          )}

          {/* Package Selector — recommend packages for this journey */}
          {can(Permission.READ, 'journey') && (
            <PackageSelector
              journeyId={journey.id}
              journeyCategory={journey.category}
            />
          )}

          {/* Travel Monitor — only when EXECUTED */}
          {journey.status === JourneyStatus.EXECUTED && <TravelMonitorPanel />}

          {/* Pre-Departure Brief — only when APPROVED or PRESENTED */}
          {(journey.status === JourneyStatus.APPROVED || journey.status === JourneyStatus.PRESENTED) && (
            <PreDepartureBrief clientName={client?.name || 'Client'} journeyTitle={journey.title} />
          )}
        </div>

        {/* Governance Sidebar - 1/3 width */}
        <div className="space-y-6">
          {/* Governance Panel */}
          <JourneyGovernancePanel journey={journey} onStateChange={loadJourney} />

          {/* Client Info Card */}
          {client && (
            <Card>
              <CardHeader>
                <h3 className="font-sans text-sm font-semibold text-slate-700">Client Information</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-sans text-sm">
                  <div>
                    <span className="text-slate-600">Name:</span>{' '}
                    <span className="text-slate-900 font-medium">{client.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Risk Category:</span>{' '}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        client.riskCategory === 'Low'
                          ? 'bg-olive-100 text-olive-800'
                          : client.riskCategory === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-gold-100 text-gold-800'
                      }`}
                    >
                      {client.riskCategory}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Active Journeys:</span>{' '}
                    <span className="text-slate-900">{client.activeJourneyCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">NDA Status:</span>{' '}
                    <span className="text-slate-900">{client.ndaStatus}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Presentation Export - only when APPROVED or later */}
          {[
            JourneyStatus.APPROVED,
            JourneyStatus.PRESENTED,
            JourneyStatus.EXECUTED,
            JourneyStatus.ARCHIVED,
          ].includes(journey.status) && <PresentationExport journey={journey} client={client} />}
        </div>
      </div>
    </div>
  );
}
