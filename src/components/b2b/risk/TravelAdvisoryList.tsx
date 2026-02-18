'use client';

/**
 * Travel Advisory List Component (RISK-02)
 * DataTable of travel advisories with expandable rows showing full advisory details
 */

import { useState, useEffect } from 'react';
import { useServices } from '@/lib/hooks/useServices';
import { TravelAdvisory } from '@/lib/types/entities';
import { DataTable } from '@/components/b2b/tables/DataTable';
import { StatusBadge } from '@/components/b2b/layouts/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function TravelAdvisoryList() {
  const { risk } = useServices();
  const [advisories, setAdvisories] = useState<TravelAdvisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAdvisories();
  }, []);

  const loadAdvisories = async () => {
    try {
      setLoading(true);
      const data = await risk.getTravelAdvisories();
      setAdvisories(data);
    } catch (error) {
      console.error('Failed to load travel advisories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const columns: ColumnDef<TravelAdvisory, any>[] = [
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => (
        <div className="font-medium text-slate-900">{row.original.country}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'region',
      header: 'Region',
      cell: ({ row }) => (
        <span className="text-slate-600">{row.original.region}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'advisoryLevel',
      header: 'Advisory Level',
      cell: ({ row }) => <StatusBadge status={row.original.advisoryLevel} />,
      enableSorting: true,
    },
    {
      accessorKey: 'effectiveDate',
      header: 'Effective Date',
      cell: ({ row }) => (
        <span className="text-slate-600">
          {new Date(row.original.effectiveDate).toLocaleDateString()}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: 'expand',
      header: 'Details',
      cell: ({ row }) => (
        <button
          onClick={() => toggleRow(row.original.id)}
          className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-sans text-sm"
        >
          {expandedRows.has(row.original.id) ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show
            </>
          )}
        </button>
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
          <h3 className="font-serif text-xl text-slate-900 mb-1">Active Travel Advisories</h3>
          <p className="font-sans text-sm text-slate-600">
            Current travel advisories for monitored regions ({advisories.length} total)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {advisories.map(advisory => (
          <div key={advisory.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900 text-base">{advisory.country}</h4>
                    <p className="text-sm text-slate-600">{advisory.region}</p>
                  </div>
                  <StatusBadge status={advisory.advisoryLevel} size="md" />
                </div>
                <button
                  onClick={() => toggleRow(advisory.id)}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-sans text-sm"
                >
                  {expandedRows.has(advisory.id) ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Details
                    </>
                  )}
                </button>
              </div>
            </div>

            {expandedRows.has(advisory.id) && (
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="space-y-3">
                  <div>
                    <p className="font-sans text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                      Advisory Summary
                    </p>
                    <p className="font-sans text-sm text-slate-800 leading-relaxed">
                      {advisory.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>
                        <strong>Effective:</strong>{' '}
                        {new Date(advisory.effectiveDate).toLocaleDateString()}
                      </span>
                      {advisory.expiresAt && (
                        <span>
                          <strong>Expires:</strong>{' '}
                          {new Date(advisory.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
