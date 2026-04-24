'use client';

/**
 * Create Predictive Alert Modal — POST /api/predictive/alerts
 * (FRONTEND_EMAIL_INTEGRATION §4.6).
 *
 * The backend looks up ClientRecord.assigned_rm by client_id (= UHNI user_id)
 * and emails them with severity-color-coded styling, plus broadcasts
 * predictive.alert_created over WebSocket.
 */

import { useEffect, useMemo, useState } from 'react';
import { Modal } from '@/components/shared/Modal/Modal';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { toast } from 'sonner';
import { AlertTriangle, Search, Send } from 'lucide-react';
import type { ClientRecord, CreatePredictiveAlertInput } from '@/lib/types';

type AlertType = 'travel_fatigue' | 'family_drift';
type Severity = 'low' | 'medium' | 'high' | 'critical';

interface CreatePredictiveAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const SEVERITY_OPTIONS: { value: Severity; label: string; ring: string }[] = [
  { value: 'low', label: 'Low', ring: 'peer-checked:ring-blue-400 peer-checked:bg-blue-50 peer-checked:text-blue-700' },
  { value: 'medium', label: 'Medium', ring: 'peer-checked:ring-amber-400 peer-checked:bg-amber-50 peer-checked:text-amber-800' },
  { value: 'high', label: 'High', ring: 'peer-checked:ring-orange-400 peer-checked:bg-orange-50 peer-checked:text-orange-800' },
  { value: 'critical', label: 'Critical', ring: 'peer-checked:ring-rose-400 peer-checked:bg-rose-50 peer-checked:text-rose-800' },
];

export function CreatePredictiveAlertModal({
  open,
  onOpenChange,
  onCreated,
}: CreatePredictiveAlertModalProps) {
  const services = useServices();
  const { user: currentUser } = useCurrentUser();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [clientUserId, setClientUserId] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [type, setType] = useState<AlertType>('travel_fatigue');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [confidence, setConfidence] = useState(75);
  const [actionRequired, setActionRequired] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userInstitutionId = currentUser?.institutionId ?? '';

  // Reset state when the modal opens.
  useEffect(() => {
    if (!open) return;
    setClientSearch('');
    setClientUserId('');
    setInstitutionId(userInstitutionId);
    setType('travel_fatigue');
    setSeverity('medium');
    setConfidence(75);
    setActionRequired('');
  }, [open, userInstitutionId]);

  // Fetch the RM's clients for the selector.
  useEffect(() => {
    if (!open || !currentUser) return;
    let cancelled = false;
    setClientsLoading(true);
    (async () => {
      try {
        const list = userInstitutionId
          ? await services.client.getClientsByInstitution(userInstitutionId)
          : await services.client.getClientsByRM(currentUser.id);
        if (!cancelled) setClients(list);
      } catch (err) {
        console.error('Failed to load clients for alert form:', err);
        if (!cancelled) toast.error('Could not load clients.');
      } finally {
        if (!cancelled) setClientsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, services, currentUser, userInstitutionId]);

  const filteredClients = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return clients.slice(0, 25);
    return clients
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      )
      .slice(0, 25);
  }, [clients, clientSearch]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.userId === clientUserId) || null,
    [clients, clientUserId]
  );

  const canSubmit =
    !!clientUserId && !!institutionId && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload: CreatePredictiveAlertInput = {
        clientId: clientUserId,
        institutionId,
        type,
        severity,
        confidence,
        actionRequired: actionRequired.trim() || undefined,
      };
      await services.predictive.createPredictiveAlert(payload);
      const clientLabel = selectedClient?.name || 'the client';
      toast.success(
        `Alert created. ${clientLabel}'s relationship manager has been notified.`
      );
      onCreated?.();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Failed to create predictive alert:', err);
      const msg =
        typeof err?.message === 'string' && err.message.length < 220
          ? err.message
          : 'Could not create the alert. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Predictive Alert"
      description="Notify the assigned RM of a travel-fatigue or family-alignment concern."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Client selector */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
            Client <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              placeholder={clientsLoading ? 'Loading clients…' : 'Search by name or email'}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100 bg-white">
            {filteredClients.length === 0 ? (
              <p className="px-3 py-2 text-xs font-sans text-gray-500">
                {clientsLoading ? 'Loading…' : 'No matching clients.'}
              </p>
            ) : (
              filteredClients.map((c) => {
                const selected = c.userId === clientUserId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setClientUserId(c.userId);
                      if (c.institutionId) setInstitutionId(c.institutionId);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm font-sans transition-colors ${
                      selected
                        ? 'bg-rose-50 text-rose-900'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-medium">{c.name || 'Unnamed client'}</span>
                      {c.email && (
                        <span className="text-xs text-gray-500 ml-2">{c.email}</span>
                      )}
                    </span>
                    {selected && (
                      <span className="text-[10px] uppercase tracking-wider text-rose-600">
                        Selected
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Institution */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
            Institution ID <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={institutionId}
            onChange={(e) => setInstitutionId(e.target.value)}
            placeholder="Auto-filled from selected client"
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AlertType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="travel_fatigue">Travel Fatigue</option>
            <option value="family_drift">Family Alignment Drift</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <p className="text-sm font-sans font-medium text-gray-700 mb-1.5">
            Severity
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SEVERITY_OPTIONS.map((opt) => (
              <label key={opt.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="severity"
                  value={opt.value}
                  checked={severity === opt.value}
                  onChange={() => setSeverity(opt.value)}
                  className="peer sr-only"
                />
                <span
                  className={`block text-center text-xs font-sans font-medium px-2 py-2 border border-gray-200 rounded-md text-gray-600 ring-2 ring-transparent transition-all ${opt.ring}`}
                >
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Confidence slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-sans font-medium text-gray-700">
              Confidence <span className="text-gray-400">(optional)</span>
            </label>
            <span className="text-sm font-mono text-gray-700">{confidence}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={confidence}
            onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
            className="w-full accent-rose-600"
          />
        </div>

        {/* Action required */}
        <div>
          <label className="block text-sm font-sans font-medium text-gray-700 mb-1.5">
            Action Required <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={actionRequired}
            onChange={(e) => setActionRequired(e.target.value)}
            rows={3}
            placeholder="Recommend a 4-week recovery period before next travel."
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 flex items-start gap-2 text-xs font-sans text-amber-800">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <span>
            The assigned RM is emailed automatically. Email delivery is best-effort.
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-sans rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-sans rounded-md hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
            {submitting ? 'Creating…' : 'Create Alert'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
