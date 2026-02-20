'use client';

import { Card } from '@/components/shared/Card';
import { Globe, FileCheck, DollarSign } from 'lucide-react';
import type { Vendor } from '@/lib/types';

interface VendorDirectoryProps {
  vendors: Vendor[];
}

const statusColors: Record<string, string> = {
  Active: 'bg-teal-100 text-teal-800',
  'Under Review': 'bg-amber-100 text-amber-800',
  Suspended: 'bg-rose-100 text-rose-800',
  Approved: 'bg-blue-100 text-blue-800',
  Rejected: 'bg-red-100 text-red-800',
};

const categoryColors: Record<string, string> = {
  'Travel & Aviation': 'bg-sky-50 text-sky-700',
  Security: 'bg-rose-50 text-rose-700',
  Legal: 'bg-indigo-50 text-indigo-700',
  Concierge: 'bg-purple-50 text-purple-700',
  Financial: 'bg-emerald-50 text-emerald-700',
  Medical: 'bg-red-50 text-red-700',
  Hospitality: 'bg-amber-50 text-amber-700',
  Technology: 'bg-blue-50 text-blue-700',
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export function VendorDirectory({ vendors }: VendorDirectoryProps) {
  if (vendors.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No vendors in directory</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-sans">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-3 text-slate-500 font-medium">Vendor</th>
            <th className="text-left py-2 px-3 text-slate-500 font-medium">Category</th>
            <th className="text-center py-2 px-3 text-slate-500 font-medium">Status</th>
            <th className="text-right py-2 px-3 text-slate-500 font-medium">Contract Value</th>
            <th className="text-left py-2 px-3 text-slate-500 font-medium">Regions</th>
            <th className="text-center py-2 px-3 text-slate-500 font-medium">NDA</th>
            <th className="text-left py-2 px-3 text-slate-500 font-medium">HQ</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(v => (
            <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2.5 px-3">
                <p className="text-slate-900 font-medium">{v.name}</p>
                <p className="text-[10px] text-slate-400">{v.contactName}</p>
              </td>
              <td className="py-2.5 px-3">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[v.category] || 'bg-slate-100 text-slate-600'}`}>
                  {v.category}
                </span>
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[v.status]}`}>
                  {v.status}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right text-slate-900 font-medium">{formatCurrency(v.contractValue)}</td>
              <td className="py-2.5 px-3 text-slate-600 max-w-[150px] truncate">{v.operatingRegions.join(', ')}</td>
              <td className="py-2.5 px-3 text-center">
                {v.ndaSigned ? (
                  <FileCheck className="w-3.5 h-3.5 text-teal-500 mx-auto" />
                ) : (
                  <span className="text-[10px] text-rose-500">Pending</span>
                )}
              </td>
              <td className="py-2.5 px-3 text-slate-600">{v.headquartersCountry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
