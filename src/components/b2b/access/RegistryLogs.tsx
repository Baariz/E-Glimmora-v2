'use client';

/**
 * Registry Logs Component (ACCS-04 & ACCS-05)
 * Audit trail viewer with filters, search, and CSV export
 */

import { useState, useEffect } from 'react';
import { useServices } from '@/lib/hooks/useServices';
import { AuditEvent } from '@/lib/types/entities';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Download, Filter } from 'lucide-react';

export function RegistryLogs() {
  const { audit } = useServices();
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const events = audit.getByContext('b2b');
      setLogs(events);
    } catch (error) {
      console.error('Failed to load access logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const filteredLogs = filterAction === 'all'
      ? logs
      : logs.filter(l => l.action === filterAction);

    const headers = ['Timestamp', 'User', 'Action', 'Resource Type', 'Resource ID', 'Event'];
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.userId,
      log.action,
      log.resourceType,
      log.resourceId,
      log.event,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `access-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = filterAction === 'all'
    ? logs
    : logs.filter(l => l.action === filterAction);

  const columns: ColumnDef<AuditEvent, any>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <span className="text-slate-600 text-xs">
          {new Date(row.original.timestamp).toLocaleString()}
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'userId',
      header: 'User',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-700">{row.original.userId}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const actionColors: Record<string, string> = {
          CREATE: 'bg-teal-100 text-teal-800',
          READ: 'bg-blue-100 text-blue-800',
          UPDATE: 'bg-gold-100 text-gold-800',
          DELETE: 'bg-rose-100 text-rose-800',
          APPROVE: 'bg-olive-100 text-olive-800',
        };
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-sans ${
              actionColors[row.original.action] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {row.original.action}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'resourceType',
      header: 'Resource',
      cell: ({ row }) => (
        <span className="text-slate-900 text-sm">{row.original.resourceType}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'event',
      header: 'Event',
      cell: ({ row }) => (
        <span className="text-slate-600 text-sm">{row.original.event}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl text-slate-900 mb-1">Access Registry Logs</h3>
          <p className="font-sans text-sm text-slate-600">
            Audit trail of all access events ({filteredLogs.length} events)
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors font-sans text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <label className="font-sans text-sm text-slate-700 font-medium">Filter by Action:</label>
        </div>
        <div className="flex gap-2">
          {['all', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE'].map(action => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`px-3 py-1.5 rounded-md font-sans text-sm transition-colors ${
                filterAction === action
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {action === 'all' ? 'All' : action}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLogs}
        searchColumn="event"
        searchPlaceholder="Search events..."
      />
    </div>
  );
}
