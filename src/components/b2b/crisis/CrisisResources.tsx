'use client';

import { Card } from '@/components/shared/Card';
import { Building, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import type { SafeHouse, EmergencyContact } from '@/lib/types';

interface CrisisResourcesProps {
  safeHouses: SafeHouse[];
  contacts: EmergencyContact[];
}

const securityColors: Record<string, string> = {
  Standard: 'bg-blue-100 text-blue-700',
  Enhanced: 'bg-amber-100 text-amber-700',
  Maximum: 'bg-rose-100 text-rose-700',
};

export function CrisisResources({ safeHouses, contacts }: CrisisResourcesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Building className="w-4 h-4" /> Safe Houses ({safeHouses.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {safeHouses.map(sh => (
            <Card key={sh.id}>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h5 className="font-sans text-xs font-semibold text-slate-900">{sh.name}</h5>
                  {sh.availableNow ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-sans text-teal-600">
                      <CheckCircle className="w-3 h-3" /> Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-sans text-rose-600">
                      <XCircle className="w-3 h-3" /> Unavailable
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-slate-600">{sh.city}, {sh.country}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-sans ${securityColors[sh.securityLevel]}`}>
                    <Shield className="w-2.5 h-2.5 mr-0.5" /> {sh.securityLevel}
                  </span>
                  <span className="text-[10px] font-sans text-slate-500">Capacity: {sh.capacity}</span>
                </div>
                <div className="text-[10px] font-sans text-slate-400">
                  <p>Contact: {sh.contactName}</p>
                  <p>Verified: {new Date(sh.lastVerified).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" /> Emergency Contacts ({contacts.length})
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Name</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Role</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Region</th>
                <th className="text-left py-2 px-3 text-slate-500 font-medium">Phone</th>
                <th className="text-center py-2 px-3 text-slate-500 font-medium">24h</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-900 font-medium">{c.name}</td>
                  <td className="py-2 px-3 text-slate-600">{c.role}</td>
                  <td className="py-2 px-3 text-slate-600">{c.region}</td>
                  <td className="py-2 px-3 text-slate-600">{c.phone}</td>
                  <td className="py-2 px-3 text-center">
                    {c.available24h ? (
                      <CheckCircle className="w-3.5 h-3.5 text-teal-500 mx-auto" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
