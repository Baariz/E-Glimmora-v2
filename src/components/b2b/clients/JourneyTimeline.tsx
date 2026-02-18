'use client';

/**
 * Journey Timeline Component
 * Visual timeline of client's journey lifecycle
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServices } from '@/lib/hooks/useServices';
import { Journey, JourneyStatus } from '@/lib/types';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { MapPin, Calendar, Eye, List, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';

interface JourneyTimelineProps {
  clientId: string;
  userId: string;
}

export function JourneyTimeline({ clientId, userId }: JourneyTimelineProps) {
  const router = useRouter();
  const services = useServices();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');

  useEffect(() => {
    loadJourneys();
  }, [userId]);

  async function loadJourneys() {
    try {
      setLoading(true);
      const data = await services.journey.getJourneys(userId, 'b2b');
      setJourneys(data);
    } catch (error) {
      console.error('Failed to load journeys:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: JourneyStatus): string => {
    const colorMap: Record<JourneyStatus, string> = {
      [JourneyStatus.DRAFT]: 'bg-slate-200 border-slate-400',
      [JourneyStatus.RM_REVIEW]: 'bg-blue-200 border-blue-400',
      [JourneyStatus.COMPLIANCE_REVIEW]: 'bg-gold-200 border-gold-400',
      [JourneyStatus.APPROVED]: 'bg-teal-200 border-teal-400',
      [JourneyStatus.PRESENTED]: 'bg-olive-200 border-olive-400',
      [JourneyStatus.EXECUTED]: 'bg-emerald-200 border-emerald-400',
      [JourneyStatus.ARCHIVED]: 'bg-slate-100 border-slate-300',
    };
    return colorMap[status] || 'bg-slate-200 border-slate-400';
  };

  const columns: ColumnDef<Journey>[] = [
    {
      accessorKey: 'title',
      header: 'Journey Title',
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="font-sans text-sm text-slate-700">{row.original.category}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        try {
          const distance = formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
          });
          return <span className="font-sans text-sm text-slate-600">{distance}</span>;
        } catch {
          return <span className="font-sans text-sm text-slate-400">N/A</span>;
        }
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        try {
          const distance = formatDistanceToNow(new Date(row.original.updatedAt), {
            addSuffix: true,
          });
          return <span className="font-sans text-sm text-slate-600">{distance}</span>;
        } catch {
          return <span className="font-sans text-sm text-slate-400">N/A</span>;
        }
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4" />
          <p className="font-sans text-sm text-slate-600">Loading journeys...</p>
        </div>
      </div>
    );
  }

  if (journeys.length === 0) {
    return (
      <Card className="p-8 text-center">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="font-serif text-xl text-slate-900 mb-2">No Journeys Yet</h3>
        <p className="font-sans text-slate-600 mb-4">
          This client has no journeys. Generate a journey draft to get started.
        </p>
        <Button
          variant="primary"
          onClick={() => router.push('/journeys/simulate')}
          disabled
        >
          Generate Journey (Coming Soon)
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-slate-900">Journey Lifecycle</h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'timeline' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Timeline
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Table
          </Button>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-6">
            {journeys.map((journey, index) => (
              <div key={journey.id} className="relative pl-16">
                {/* Timeline marker */}
                <div
                  className={`absolute left-3 w-6 h-6 rounded-full border-2 ${getStatusColor(
                    journey.status
                  )}`}
                />

                <button
                  onClick={() => router.push(`/journeys/${journey.id}`)}
                  className="w-full text-left"
                >
                  <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-serif text-lg text-slate-900">{journey.title}</h4>
                          <StatusBadge status={journey.status} size="sm" />
                        </div>
                        <p className="font-sans text-sm text-slate-600 mb-2">
                          {journey.narrative.slice(0, 120)}...
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created {formatDistanceToNow(new Date(journey.createdAt))} ago
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {journey.category}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </Card>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={journeys}
          searchColumn="title"
          searchPlaceholder="Search journeys..."
          pageSize={10}
          onRowClick={(row) => router.push(`/journeys/${row.id}`)}
          emptyMessage="No journeys found"
        />
      )}
    </div>
  );
}
