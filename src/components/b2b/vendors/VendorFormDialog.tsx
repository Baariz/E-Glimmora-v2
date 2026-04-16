'use client';

import { useEffect, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowLeft, ArrowRight, Loader2, Plus } from 'lucide-react';
import type { Vendor, VendorCategory } from '@/lib/types';
import type { CreateVendorInput } from '@/lib/services/interfaces/IVendorService';

const CATEGORIES: VendorCategory[] = [
  'Travel & Aviation', 'Security', 'Legal', 'Concierge',
  'Financial', 'Medical', 'Hospitality', 'Technology',
];

interface VendorFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: Vendor | null;
  institutionId: string;
  onClose: () => void;
  onSubmit: (input: CreateVendorInput) => Promise<void>;
}

interface FormState {
  name: string;
  category: VendorCategory;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  headquartersCountry: string;
  operatingRegions: string[];
  regionInput: string;
  contractValue: string;
  contractStart: string;
  contractEnd: string;
  ndaSigned: boolean;
  ndaExpiresAt: string;
}

const EMPTY: FormState = {
  name: '', category: 'Concierge',
  contactName: '', contactEmail: '', contactPhone: '', website: '',
  headquartersCountry: '', operatingRegions: [], regionInput: '',
  contractValue: '', contractStart: '', contractEnd: '',
  ndaSigned: false, ndaExpiresAt: '',
};

function fromVendor(v: Vendor): FormState {
  return {
    name: v.name,
    category: v.category,
    contactName: v.contactName,
    contactEmail: v.contactEmail,
    contactPhone: v.contactPhone,
    website: v.website ?? '',
    headquartersCountry: v.headquartersCountry,
    operatingRegions: [...v.operatingRegions],
    regionInput: '',
    contractValue: String(v.contractValue ?? ''),
    contractStart: v.contractStart ? v.contractStart.slice(0, 10) : '',
    contractEnd: v.contractEnd ? v.contractEnd.slice(0, 10) : '',
    ndaSigned: v.ndaSigned,
    ndaExpiresAt: v.ndaExpiresAt ? v.ndaExpiresAt.slice(0, 10) : '',
  };
}

export function VendorFormDialog({ open, mode, initial, institutionId, onClose, onSubmit }: VendorFormDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm(initial ? fromVendor(initial) : EMPTY);
      setErr(null);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, initial]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm(s => ({ ...s, [k]: v }));

  const addRegion = () => {
    const val = form.regionInput.trim();
    if (!val || form.operatingRegions.includes(val)) return;
    setForm(s => ({ ...s, operatingRegions: [...s.operatingRegions, val], regionInput: '' }));
  };

  const removeRegion = (r: string) =>
    setForm(s => ({ ...s, operatingRegions: s.operatingRegions.filter(x => x !== r) }));

  const canNext1 =
    form.name.trim() && form.contactName.trim() && form.contactEmail.trim() && form.category;
  const canNext2 = !!form.contractStart;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const input: CreateVendorInput = {
        institutionId,
        name: form.name.trim(),
        category: form.category,
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        website: form.website.trim() || undefined,
        headquartersCountry: form.headquartersCountry.trim(),
        operatingRegions: form.operatingRegions,
        contractValue: Number(form.contractValue) || 0,
        contractStart: form.contractStart,
        contractEnd: form.contractEnd || undefined,
        ndaSigned: form.ndaSigned,
        ndaExpiresAt: form.ndaSigned ? (form.ndaExpiresAt || undefined) : undefined,
      };
      await onSubmit(input);
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Failed to save vendor');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const title = mode === 'edit' ? 'Edit Vendor' : 'Add Vendor';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.form
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-sand-100">
            <div>
              <h2 className="font-serif text-xl text-rose-900">{title}</h2>
              <p className="text-xs font-sans text-sand-500 mt-0.5">Step {step} of 3</p>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-sand-400 hover:text-sand-700" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-6 pt-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-1 flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-semibold ${step >= n ? 'bg-rose-900 text-white' : 'bg-sand-100 text-sand-400'}`}>
                  {step > n ? <Check className="w-4 h-4" /> : n}
                </div>
                {n < 3 && <div className={`flex-1 h-0.5 ${step > n ? 'bg-rose-900' : 'bg-sand-100'}`} />}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-sm font-sans">
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-sand-700 font-medium">Vendor Name <span className="text-rose-600">*</span></span>
                  <input required value={form.name} onChange={(e) => set('name', e.target.value)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
                <label className="space-y-1">
                  <span className="text-sand-700 font-medium">Category <span className="text-rose-600">*</span></span>
                  <select value={form.category} onChange={(e) => set('category', e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-sand-700 font-medium">Contact Name <span className="text-rose-600">*</span></span>
                  <input required value={form.contactName} onChange={(e) => set('contactName', e.target.value)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
                <label className="space-y-1">
                  <span className="text-sand-700 font-medium">Contact Email <span className="text-rose-600">*</span></span>
                  <input required type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
                <label className="space-y-1">
                  <span className="text-sand-700 font-medium">Contact Phone</span>
                  <input value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-sand-700 font-medium">Website</span>
                  <input type="url" value={form.website} onChange={(e) => set('website', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-sand-700 font-medium">Headquarters Country</span>
                  <input value={form.headquartersCountry} onChange={(e) => set('headquartersCountry', e.target.value)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-sand-700 font-medium">Operating Regions</span>
                  <div className="flex gap-2">
                    <input
                      value={form.regionInput}
                      onChange={(e) => set('regionInput', e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRegion(); } }}
                      placeholder="Type and press Enter — e.g. Europe"
                      className="flex-1 px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button type="button" onClick={addRegion}
                      className="px-3 py-2 bg-sand-100 text-sand-700 rounded-lg hover:bg-sand-200 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.operatingRegions.map(r => (
                      <span key={r} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-800 text-xs">
                        {r}
                        <button type="button" onClick={() => removeRegion(r)} className="hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {form.operatingRegions.length === 0 && (
                      <span className="text-xs text-sand-400">No regions added yet.</span>
                    )}
                  </div>
                </div>
                <label className="space-y-1">
                  <span className="text-sand-700 font-medium">Contract Value (USD)</span>
                  <input type="number" min={0} value={form.contractValue}
                    onChange={(e) => set('contractValue', e.target.value)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
                <div />
                <label className="space-y-1">
                  <span className="text-sand-700 font-medium">Contract Start <span className="text-rose-600">*</span></span>
                  <input required type="date" value={form.contractStart}
                    onChange={(e) => set('contractStart', e.target.value)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
                <label className="space-y-1">
                  <span className="text-sand-700 font-medium">Contract End</span>
                  <input type="date" value={form.contractEnd}
                    onChange={(e) => set('contractEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </label>
                <label className="flex items-center gap-3 sm:col-span-2 mt-2">
                  <input type="checkbox" checked={form.ndaSigned}
                    onChange={(e) => set('ndaSigned', e.target.checked)}
                    className="w-4 h-4 rounded border-sand-300 text-rose-900 focus:ring-rose-500" />
                  <span className="text-sand-700 font-medium">NDA Signed</span>
                </label>
                {form.ndaSigned && (
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-sand-700 font-medium">NDA Expires At</span>
                    <input type="date" value={form.ndaExpiresAt}
                      onChange={(e) => set('ndaExpiresAt', e.target.value)}
                      className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  </label>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sand-600">Review the details below before {mode === 'edit' ? 'saving' : 'creating the vendor'}.</p>
                <div className="rounded-lg border border-sand-200 divide-y divide-sand-100 text-sm">
                  <Row k="Name" v={form.name} />
                  <Row k="Category" v={form.category} />
                  <Row k="Contact" v={`${form.contactName} · ${form.contactEmail}${form.contactPhone ? ' · ' + form.contactPhone : ''}`} />
                  {form.website && <Row k="Website" v={form.website} />}
                  <Row k="HQ" v={form.headquartersCountry || '—'} />
                  <Row k="Regions" v={form.operatingRegions.join(', ') || '—'} />
                  <Row k="Contract Value" v={form.contractValue ? `$${Number(form.contractValue).toLocaleString()}` : '—'} />
                  <Row k="Contract Term" v={`${form.contractStart || '—'} → ${form.contractEnd || 'open'}`} />
                  <Row k="NDA" v={form.ndaSigned ? `Signed${form.ndaExpiresAt ? ' · expires ' + form.ndaExpiresAt : ''}` : 'Not signed'} />
                </div>
                {mode === 'create' && (
                  <p className="text-xs font-sans text-sand-500">
                    On save, the vendor is created with status <strong>Under Review</strong>.
                  </p>
                )}
              </div>
            )}

            {err && (
              <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {err}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 p-6 border-t border-sand-100">
            <div>
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-sans text-sand-700 bg-sand-50 rounded-lg hover:bg-sand-100">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={submitting}
                className="px-4 py-2 text-sm font-sans font-medium text-sand-700 bg-sand-100 rounded-lg hover:bg-sand-200 disabled:opacity-50">
                Cancel
              </button>
              {step < 3 && (
                <button type="button" disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                  onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-sans font-medium text-white bg-rose-900 rounded-lg hover:bg-rose-800 disabled:opacity-50">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {step === 3 && (
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-sans font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'edit' ? 'Save Changes' : 'Create Vendor'}
                </button>
              )}
            </div>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-2.5">
      <span className="text-sand-500 text-xs uppercase tracking-wide">{k}</span>
      <span className="text-sand-900 text-right break-words">{v}</span>
    </div>
  );
}
