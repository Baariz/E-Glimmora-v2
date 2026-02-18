'use client';

/**
 * Platform-wide Audit Logs Page
 * Super Admin can search and filter all audit events across the platform
 */

import { useEffect, useState, useMemo } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatsRow, StatCard } from '@/components/b2b/layouts/StatsRow';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { useServices } from '@/lib/hooks/useServices';
import type { AuditEvent } from '@/lib/types';
import { toast } from 'sonner';

/**
 * Platform-wide Audit Logs Page
 * Multi-filter search with expandable event details
 */
export default function AuditLogsPage() {
  const services = useServices();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filters
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [contextFilter, setContextFilter] = useState<string>('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await services.audit.getAll();
      setEvents(allEvents);
    } catch (error) {
      console.error('Failed to load audit events:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Client-side filtering
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (resourceTypeFilter && event.resourceType !== resourceTypeFilter) {
        return false;
      }
      if (actionFilter && event.action !== actionFilter) {
        return false;
      }
      if (contextFilter && event.context !== contextFilter) {
        return false;
      }
      return true;
    });
  }, [events, resourceTypeFilter, actionFilter, contextFilter]);

  // Get unique values for filters
  const resourceTypes = useMemo(
    () => Array.from(new Set(events.map((e) => e.resourceType))).sort(),
    [events]
  );
  const actions = useMemo(
    () => Array.from(new Set(events.map((e) => e.action))).sort(),
    [events]
  );
  const contexts = useMemo(
    () => Array.from(new Set(events.map((e) => e.context))).sort(),
    [events]
  );

  // Calculate stats
  const stats: StatCard[] = [
    {
      label: 'Total Events',
      value: filteredEvents.length,
      colorClass: 'from-white to-slate-50',
    },
    {
      label: 'Creates',
      value: filteredEvents.filter((e) => e.action === 'CREATE').length,
      colorClass: 'from-white to-teal-50',
    },
    {
      label: 'Updates',
      value: filteredEvents.filter((e) => e.action === 'UPDATE').length,
      colorClass: 'from-white to-blue-50',
    },
    {
      label: 'Deletes',
      value: filteredEvents.filter((e) => e.action === 'DELETE').length,
      colorClass: 'from-white to-rose-50',
    },
    {
      label: 'Approvals',
      value: filteredEvents.filter((e) => e.action === 'APPROVE').length,
      colorClass: 'from-white to-olive-50',
    },
  ];

  // Action color mapping
  const getActionColor = (action: string) => {
    const colorMap: Record<string, string> = {
      CREATE: 'teal',
      READ: 'blue',
      UPDATE: 'amber',
      DELETE: 'red',
      APPROVE: 'olive',
      REJECT: 'rose',
      EXECUTE: 'purple',
    };
    return colorMap[action] || 'slate';
  };

  // Toggle row expansion
  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Table columns
  const columns: ColumnDef<AuditEvent>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => {
        const timestamp = new Date(row.original.timestamp);
        return (
          <div className="font-sans text-sm space-y-0.5">
            <div className="text-slate-900">
              {format(timestamp, 'MMM d, yyyy HH:mm:ss')}
            </div>
            <div className="text-xs text-slate-500">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'event',
      header: 'Event',
      cell: ({ row }) => {
        const action = row.original.action;
        const event = row.original.event;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full bg-${getActionColor(action)}-500`}
            />
            <span className="font-sans text-sm text-slate-900">{event}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'resourceType',
      header: 'Resource',
      cell: ({ row }) => (
        <div className="font-sans text-sm space-y-0.5">
          <div className="text-slate-900">{row.original.resourceType}</div>
          <div className="text-xs text-slate-500 font-mono">
            {row.original.resourceId.substring(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'userId',
      header: 'User',
      cell: ({ row }) => (
        <span className="font-sans text-sm text-slate-700 font-mono">
          {row.original.userId.substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: 'context',
      header: 'Context',
      cell: ({ row }) => <StatusBadge status={row.original.context} size="sm" />,
    },
    {
      id: 'expand',
      header: '',
      cell: ({ row }) => {
        const isExpanded = expandedRows.has(row.original.id);
        return (
          <button
            onClick={() => toggleRow(row.original.id)}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        );
      },
    },
  ];

  const clearFilters = () => {
    setResourceTypeFilter('');
    setActionFilter('');
    setContextFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-slate-900">Platform Audit Logs</h1>
        <p className="text-sm font-sans text-slate-600 mt-1">
          Immutable trail of all platform events and actions
        </p>
      </div>

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-sans font-medium text-slate-600 mb-1">
              Resource Type
            </label>
            <select
              value={resourceTypeFilter}
              onChange={(e) => setResourceTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Types</option>
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-slate-600 mb-1">
              Action
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Actions</option>
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-slate-600 mb-1">
              Context
            </label>
            <select
              value={contextFilter}
              onChange={(e) => setContextFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Contexts</option>
              {contexts.map((context) => (
                <option key={context} value={context}>
                  {context}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-md font-sans text-sm hover:bg-slate-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-sans">
            Loading audit logs...
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={filteredEvents}
              pageSize={25}
              emptyMessage="No audit events found"
            />

            {/* Expandable details */}
            {filteredEvents.map((event) => {
              if (!expandedRows.has(event.id)) return null;

              return (
                <div
                  key={`detail-${event.id}`}
                  className="border-t border-slate-200 bg-slate-50 p-4"
                >
                  <div className="grid grid-cols-2 gap-4 font-sans text-sm">
                    <div>
                      <span className="font-medium text-slate-600">Event ID:</span>
                      <p className="text-slate-900 font-mono mt-1">{event.id}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Resource ID:</span>
                      <p className="text-slate-900 font-mono mt-1">
                        {event.resourceId}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">User ID:</span>
                      <p className="text-slate-900 font-mono mt-1">{event.userId}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Action:</span>
                      <p className="text-slate-900 mt-1">{event.action}</p>
                    </div>
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <div className="col-span-2">
                        <span className="font-medium text-slate-600">Metadata:</span>
                        <pre className="text-xs bg-white border border-slate-200 rounded p-2 mt-1 overflow-x-auto">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                    {event.previousState && (
                      <div className="col-span-2">
                        <span className="font-medium text-slate-600">
                          Previous State:
                        </span>
                        <pre className="text-xs bg-white border border-slate-200 rounded p-2 mt-1 overflow-x-auto">
                          {JSON.stringify(event.previousState, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
