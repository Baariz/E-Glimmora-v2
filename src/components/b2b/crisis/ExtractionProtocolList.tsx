'use client';

import { Card } from '@/components/shared/Card';
import { CheckCircle, Circle, Clock, SkipForward, MapPin } from 'lucide-react';
import type { ExtractionProtocol, ExtractionStep } from '@/lib/types';

interface ExtractionProtocolListProps {
  protocols: ExtractionProtocol[];
}

const priorityColors: Record<string, string> = {
  Routine: 'bg-slate-100 text-slate-700',
  Urgent: 'bg-amber-100 text-amber-800',
  Emergency: 'bg-orange-100 text-orange-800',
  Critical: 'bg-rose-100 text-rose-800',
};

const statusColors: Record<string, string> = {
  Standby: 'bg-blue-100 text-blue-700',
  Activated: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-orange-100 text-orange-700',
  Completed: 'bg-teal-100 text-teal-700',
  Aborted: 'bg-slate-100 text-slate-600',
};

function StepIcon({ status }: { status: ExtractionStep['status'] }) {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-teal-500" />;
    case 'in_progress': return <Clock className="w-4 h-4 text-amber-500" />;
    case 'skipped': return <SkipForward className="w-4 h-4 text-slate-400" />;
    default: return <Circle className="w-4 h-4 text-slate-300" />;
  }
}

export function ExtractionProtocolList({ protocols }: ExtractionProtocolListProps) {
  if (protocols.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No extraction protocols configured</p>;
  }

  return (
    <div className="space-y-4">
      {protocols.map(p => {
        const completedSteps = p.steps.filter(s => s.status === 'completed').length;
        const progress = p.steps.length > 0 ? Math.round((completedSteps / p.steps.length) * 100) : 0;

        return (
          <Card key={p.id}>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-sans text-sm font-semibold text-slate-900">{p.clientName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${priorityColors[p.priority]}`}>
                      {p.priority}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-slate-900">{progress}%</p>
                  <p className="font-sans text-[10px] text-slate-500">{completedSteps}/{p.steps.length} steps</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-sans text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{p.currentLocation}</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{p.destinationLocation}</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${progress}%` }} />
              </div>

              <div className="space-y-1.5">
                {p.steps.map(step => (
                  <div key={step.id} className="flex items-center gap-2">
                    <StepIcon status={step.status} />
                    <span className={`font-sans text-xs flex-1 ${step.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {step.title}
                    </span>
                    <span className="font-sans text-[10px] text-slate-400">{step.estimatedDurationMinutes}m</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-[10px] font-sans text-slate-400">
                <span>Safe Houses: {p.safeHouses.length}</span>
                <span>Contacts: {p.emergencyContacts.length}</span>
                {p.activatedAt && <span>Activated: {new Date(p.activatedAt).toLocaleString()}</span>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
