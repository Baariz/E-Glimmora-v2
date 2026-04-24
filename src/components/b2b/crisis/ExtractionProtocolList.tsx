'use client';

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { CheckCircle, Circle, Clock, SkipForward, MapPin, Siren, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { ExtractionProtocol, ExtractionStep } from '@/lib/types';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { Modal } from '@/components/shared/Modal/Modal';
import { logger } from '@/lib/utils/logger';

interface ExtractionProtocolListProps {
  protocols: ExtractionProtocol[];
  onActivated?: () => void;
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

export function ExtractionProtocolList({ protocols, onActivated }: ExtractionProtocolListProps) {
  const services = useServices();
  const { user: currentUser } = useCurrentUser();
  const [pendingActivate, setPendingActivate] = useState<ExtractionProtocol | null>(null);
  const [activating, setActivating] = useState(false);

  const handleConfirmActivate = async () => {
    if (!pendingActivate) return;
    setActivating(true);
    try {
      // FRONTEND_EMAIL_INTEGRATION §4.7 — backend emails RM + Compliance + InstAdmin.
      await services.crisis.activateProtocol(
        pendingActivate.id,
        currentUser?.id ?? ''
      );
      toast.success(
        `Protocol activated. Stakeholders notified by email and in-app.`,
        { duration: 8000 }
      );
      onActivated?.();
      setPendingActivate(null);
    } catch (err) {
      logger.error('Crisis', 'activateProtocol failed', err, { protocolId: pendingActivate.id });
      toast.error('Failed to activate protocol. Please try again.');
    } finally {
      setActivating(false);
    }
  };

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

              {p.status === 'Standby' && (
                <button
                  onClick={() => setPendingActivate(p)}
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-sans font-semibold text-white bg-rose-600 rounded-md hover:bg-rose-700 transition-colors shadow-sm"
                >
                  <Siren size={12} />
                  Activate Protocol
                </button>
              )}
            </div>
          </Card>
        );
      })}

      {/* Crisis activation confirmation — FRONTEND_EMAIL_INTEGRATION §4.7 */}
      <Modal
        open={Boolean(pendingActivate)}
        onOpenChange={(open) => {
          if (!open && !activating) setPendingActivate(null);
        }}
        title="Activate crisis protocol?"
        description="This is a high-stakes action. Confirm to alert all stakeholders."
      >
        {pendingActivate && (
          <div className="space-y-4">
            <div className="rounded-md border-2 border-rose-300 bg-rose-50 p-4">
              <p className="text-xs font-sans uppercase tracking-wider text-rose-700 font-bold mb-2">
                URGENT — Crisis Protocol
              </p>
              <p className="text-sm font-sans text-rose-900">
                <span className="font-semibold">{pendingActivate.clientName}</span>
                {' · '}
                <span>{pendingActivate.priority}</span>
              </p>
              <p className="text-xs font-sans text-rose-800 mt-1">
                {pendingActivate.currentLocation} → {pendingActivate.destinationLocation}
              </p>
            </div>

            <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-md text-xs font-sans text-amber-800">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <span>
                Activating sends an urgent email to the assigned RM, all
                Compliance Officers, and Institutional Admins. They will also
                be paged via the in-app channel.
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={activating}
                onClick={() => setPendingActivate(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-sans rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={activating}
                onClick={handleConfirmActivate}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-sans font-semibold rounded-md hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                <Siren size={14} />
                {activating ? 'Activating…' : 'Activate Protocol'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
