'use client';

/**
 * Journey Governance List Page
 * Pipeline and table views of journeys with generation capability
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { Button } from '@/components/shared/Button';
import { useCan } from '@/lib/rbac/usePermission';
import { Permission } from '@/lib/types/permissions';
import { Journey, JourneyStatus } from '@/lib/types/entities';
import { useServices } from '@/lib/hooks/useServices';
import { getStateLabel, getStateColor } from '@/lib/state-machines/journey-workflow';
import { formatDistanceToNow } from 'date-fns';

type ViewMode = 'pipeline' | 'table';

const MOCK_RM_USER_ID = 'b2b-rm-001-uuid-placeholder';

export default function GovernancePage() {
  const router = useRouter();
  const { can } = useCan();
  const services = useServices();
  const [viewMode, setViewMode] = useState<ViewMode>('pipeline');
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    try {
      setLoading(true);
      // For mock, get all journeys from localStorage (filter by institution in production)
      const allJourneys = await services.journey.getJourneys(MOCK_RM_USER_ID, 'b2b');
      setJourneys(allJourneys);
    } catch (error) {
      console.error('Failed to load journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!can(Permission.READ, 'journey')) {
    return (
      <div className="p-8">
        <p className="font-sans text-slate-600">You do not have permission to view journeys.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-rose-900">Journey Governance</h1>
          <p className="mt-1 font-sans text-sm text-slate-600">
            Manage client journey proposals through compliance workflow
          </p>
        </div>
        <Link href="/governance/simulate">
          <Button variant="primary" size="md">
            Generate Journey
          </Button>
        </Link>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('pipeline')}
          className={`px-4 py-2 rounded-md font-sans text-sm transition-colors ${
            viewMode === 'pipeline'
              ? 'bg-rose-600 text-white'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Pipeline View
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 rounded-md font-sans text-sm transition-colors ${
            viewMode === 'table'
              ? 'bg-rose-600 text-white'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Table View
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center font-sans text-slate-600">Loading journeys...</div>
      ) : viewMode === 'pipeline' ? (
        <PipelineView journeys={journeys} onJourneyClick={(id) => router.push(`/governance/${id}`)} />
      ) : (
        <TableView journeys={journeys} onJourneyClick={(id) => router.push(`/governance/${id}`)} />
      )}
    </div>
  );
}

// Pipeline View Component
function PipelineView({
  journeys,
  onJourneyClick,
}: {
  journeys: Journey[];
  onJourneyClick: (id: string) => void;
}) {
  const statuses = [
    JourneyStatus.DRAFT,
    JourneyStatus.RM_REVIEW,
    JourneyStatus.COMPLIANCE_REVIEW,
    JourneyStatus.APPROVED,
    JourneyStatus.PRESENTED,
    JourneyStatus.EXECUTED,
  ];

  const journeysByStatus = statuses.reduce(
    (acc, status) => {
      acc[status] = journeys.filter((j) => j.status === status);
      return acc;
    },
    {} as Record<JourneyStatus, Journey[]>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statuses.map((status) => {
        const statusJourneys = journeysByStatus[status] || [];
        const color = getStateColor(status);

        return (
          <div key={status} className="flex-shrink-0 w-80">
            {/* Column Header */}
            <div className={`bg-${color}-50 border-t-4 border-${color}-500 rounded-t-lg p-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-sans font-semibold text-sm text-slate-900">
                  {getStateLabel(status)}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full bg-${color}-100 text-${color}-800 font-sans text-xs font-medium`}
                >
                  {statusJourneys.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-slate-50 rounded-b-lg p-3 space-y-3 min-h-[200px]">
              {statusJourneys.length === 0 ? (
                <p className="text-center py-8 font-sans text-sm text-slate-400">No journeys</p>
              ) : (
                statusJourneys.map((journey) => (
                  <button
                    key={journey.id}
                    onClick={() => onJourneyClick(journey.id)}
                    className="w-full bg-white rounded-lg border border-slate-200 p-4 text-left hover:border-rose-300 hover:shadow-md transition-all"
                  >
                    <h4 className="font-serif text-base text-rose-900 mb-2">{journey.title}</h4>
                    <div className="space-y-1">
                      <p className="font-sans text-xs text-slate-600">
                        Client: {journey.userId || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-olive-100 text-olive-800 rounded-full font-sans text-xs">
                          {journey.category}
                        </span>
                        {journey.discretionLevel && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-sans text-xs">
                            {journey.discretionLevel}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-slate-500 mt-2">
                        {formatDistanceToNow(new Date(journey.updatedAt), { addSuffix: true })}
                      </p>
                      {journey.assignedRM && (
                        <p className="font-sans text-xs text-slate-500">
                          RM: {journey.assignedRM.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Table View Component
function TableView({
  journeys,
  onJourneyClick,
}: {
  journeys: Journey[];
  onJourneyClick: (id: string) => void;
}) {
  const columns: ColumnDef<Journey, any>[] = [
    {
      accessorKey: 'title',
      header: 'Journey Title',
      cell: ({ row }) => (
        <span className="font-serif text-rose-900">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'userId',
      header: 'Client',
      cell: ({ row }) => (
        <span className="font-sans text-sm">{row.original.userId.slice(0, 16)}...</span>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-olive-100 text-olive-800 rounded-full font-sans text-xs">
          {row.original.category}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const color = getStateColor(row.original.status);
        return (
          <StatusBadge
            status={getStateLabel(row.original.status)}
            colorMap={{
              [getStateLabel(row.original.status)]: `bg-${color}-100 text-${color}-800`,
            }}
          />
        );
      },
    },
    {
      accessorKey: 'assignedRM',
      header: 'Assigned RM',
      cell: ({ row }) => (
        <span className="font-sans text-sm">
          {row.original.assignedRM ? row.original.assignedRM.slice(0, 12) + '...' : 'Unassigned'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="font-sans text-sm text-slate-600">
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => (
        <span className="font-sans text-sm text-slate-600">
          {formatDistanceToNow(new Date(row.original.updatedAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onJourneyClick(row.original.id)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={journeys}
      searchPlaceholder="Search by title or client..."
      searchColumn="title"
      pageSize={25}
      onRowClick={(journey) => onJourneyClick(journey.id)}
      emptyMessage="No journeys found"
    />
  );
}
