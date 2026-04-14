'use client';

/**
 * Pre-Departure Brief Composer
 * Advisor writes a calm, minimal departure summary for the UHNI
 * Persists to POST /api/journeys/{id}/pre-departure
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { Wand2, Send, Loader2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import type { PreDepartureBrief as Brief } from '@/lib/types/entities';

interface PreDepartureBriefProps {
  journeyId: string;
  clientName: string;
  journeyTitle: string;
  initialBrief?: Brief | null;
  onSaved?: () => void;
}

const AGI_TEMPLATE: Brief = {
  arrivalSummary: 'Your arrival has been arranged with complete discretion. A dedicated host will greet you privately upon arrival.',
  keyContact: 'Your Élan Experience Host',
  keyContactRole: 'On-Ground Liaison',
  timing: 'All timing has been pre-coordinated. Simply arrive as planned — everything else is handled.',
  discretionLevel: 'High',
  specialInstructions: 'No public-facing itinerary exists. All arrangements are known only to your Élan team and those who need to know.',
};

export function PreDepartureBrief({ journeyId, clientName, journeyTitle, initialBrief, onSaved }: PreDepartureBriefProps) {
  const services = useServices();
  const [arrivalSummary, setArrivalSummary] = useState(initialBrief?.arrivalSummary ?? '');
  const [keyContact, setKeyContact] = useState(initialBrief?.keyContact ?? '');
  const [keyContactRole, setKeyContactRole] = useState(initialBrief?.keyContactRole ?? '');
  const [timing, setTiming] = useState(initialBrief?.timing ?? '');
  const [discretionLevel, setDiscretionLevel] = useState<'High' | 'Standard' | 'Custom'>(initialBrief?.discretionLevel ?? 'High');
  const [specialInstructions, setSpecialInstructions] = useState(initialBrief?.specialInstructions ?? '');
  const [sent, setSent] = useState(Boolean(initialBrief?.sentAt));
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (initialBrief) {
      setArrivalSummary(initialBrief.arrivalSummary ?? '');
      setKeyContact(initialBrief.keyContact ?? '');
      setKeyContactRole(initialBrief.keyContactRole ?? '');
      setTiming(initialBrief.timing ?? '');
      setDiscretionLevel(initialBrief.discretionLevel ?? 'High');
      setSpecialInstructions(initialBrief.specialInstructions ?? '');
      setSent(Boolean(initialBrief.sentAt));
    }
  }, [initialBrief]);

  const applyTemplate = () => {
    setArrivalSummary(AGI_TEMPLATE.arrivalSummary!);
    setKeyContact(AGI_TEMPLATE.keyContact!);
    setKeyContactRole(AGI_TEMPLATE.keyContactRole!);
    setTiming(AGI_TEMPLATE.timing!);
    setDiscretionLevel(AGI_TEMPLATE.discretionLevel!);
    setSpecialInstructions(AGI_TEMPLATE.specialInstructions!);
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await services.journey.setPreDepartureBrief(journeyId, {
        arrivalSummary,
        keyContact,
        keyContactRole,
        timing,
        discretionLevel,
        specialInstructions,
      });
      setSent(true);
      toast.success('Pre-departure brief sent to client.');
      onSaved?.();
    } catch (err) {
      console.error('Failed to save pre-departure brief', err);
      toast.error('Unable to send brief. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const hasContent = arrivalSummary || keyContact || timing;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <p className="font-sans text-sm font-medium text-slate-800">Pre-Departure Brief</p>
          <p className="text-slate-500 text-xs font-sans">For {clientName} — {journeyTitle}</p>
        </div>
        <button onClick={applyTemplate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 font-sans text-xs font-medium hover:bg-blue-100 transition-colors">
          <Wand2 size={12} />
          Use AGI Template
        </button>
      </div>

      {sent ? (
        <div className="px-6 py-10 text-center">
          <p className="text-emerald-600 font-sans font-medium mb-1">Brief sent successfully.</p>
          <p className="text-slate-400 text-sm font-sans mb-4">Client has been notified through their secure channel.</p>
          <button
            onClick={() => setSent(false)}
            className="text-blue-600 text-xs font-sans hover:underline"
          >
            Edit &amp; resend
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">Arrival Summary</label>
              <textarea value={arrivalSummary} onChange={(e) => setArrivalSummary(e.target.value)} rows={3} placeholder="Describe the arrival arrangement..." className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 resize-none focus:outline-none focus:border-blue-300" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">Key Contact</label>
                <input value={keyContact} onChange={(e) => setKeyContact(e.target.value)} placeholder="Name" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 focus:outline-none focus:border-blue-300" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
                <input value={keyContactRole} onChange={(e) => setKeyContactRole(e.target.value)} placeholder="Role / title" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 focus:outline-none focus:border-blue-300" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">Key Timing</label>
              <input value={timing} onChange={(e) => setTiming(e.target.value)} placeholder="Timing note for client..." className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 focus:outline-none focus:border-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">Discretion Level</label>
              <select value={discretionLevel} onChange={(e) => setDiscretionLevel(e.target.value as 'High' | 'Standard' | 'Custom')} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans focus:outline-none focus:border-blue-300">
                <option value="High">High — Maximum discretion</option>
                <option value="Standard">Standard — Normal privacy</option>
                <option value="Custom">Custom — See instructions</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1.5">Special Instructions</label>
              <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} rows={2} placeholder="Any final notes..." className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-sm font-sans placeholder-slate-400 resize-none focus:outline-none focus:border-blue-300" />
            </div>
            <button onClick={handleSend} disabled={!hasContent || sending} className={cn('w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-sans text-sm font-medium transition-all', hasContent && !sending ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}>
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {sending ? 'Sending…' : 'Send to Client'}
            </button>
          </div>

          <div className="p-6 bg-sand-50">
            <p className="text-xs font-sans font-medium text-slate-400 uppercase tracking-wider mb-4">Client Preview</p>
            {hasContent ? (
              <div className="bg-white rounded-xl border border-sand-200 p-5">
                <Image src="/Logo/elan-glimmora.png" alt="Élan Glimmora" width={100} height={28} className="h-6 w-auto mb-1" />
                <h4 className="font-serif text-lg text-rose-900 mb-4">Your Experience Brief</h4>
                {arrivalSummary && (
                  <div className="mb-3">
                    <p className="text-xs text-sand-400 uppercase tracking-wider font-sans mb-1">Arrival</p>
                    <p className="text-sand-700 font-sans text-sm leading-relaxed">{arrivalSummary}</p>
                  </div>
                )}
                {keyContact && (
                  <div className="mb-3">
                    <p className="text-xs text-sand-400 uppercase tracking-wider font-sans mb-1">Your Contact</p>
                    <p className="text-sand-700 font-sans text-sm">{keyContact}{keyContactRole ? ` — ${keyContactRole}` : ''}</p>
                  </div>
                )}
                {timing && (
                  <div className="mb-3">
                    <p className="text-xs text-sand-400 uppercase tracking-wider font-sans mb-1">Timing</p>
                    <p className="text-sand-700 font-sans text-sm">{timing}</p>
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-sand-100 flex items-center gap-2">
                  <span className="text-xs text-sand-400 font-sans">Discretion Level:</span>
                  <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">{discretionLevel}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-sand-200 p-5 text-center">
                <p className="text-sand-400 font-sans text-sm">Begin composing or use the AGI template to see the client preview.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
