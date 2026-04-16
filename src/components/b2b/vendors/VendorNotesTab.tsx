'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useServices } from '@/lib/hooks/useServices';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { VendorNote, VendorNoteType, VendorNotePriority } from '@/lib/types';

const TYPES: VendorNoteType[] = ['General', 'Request', 'Issue', 'Follow-up'];
const PRIORITIES: VendorNotePriority[] = ['Low', 'Medium', 'High'];

const typeColors: Record<VendorNoteType, string> = {
  General: 'bg-slate-100 text-slate-700',
  Request: 'bg-blue-100 text-blue-800',
  Issue: 'bg-rose-100 text-rose-800',
  'Follow-up': 'bg-amber-100 text-amber-800',
};

const priorityColors: Record<VendorNotePriority, string> = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  High: 'bg-rose-50 text-rose-700 border-rose-100',
};

interface VendorNotesTabProps {
  vendorId: string;
  canEditAnyNote: boolean;
}

export function VendorNotesTab({ vendorId, canEditAnyNote }: VendorNotesTabProps) {
  const services = useServices();
  const { user } = useCurrentUser();

  const [notes, setNotes] = useState<VendorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ type: VendorNoteType; priority: VendorNotePriority; text: string }>({
    type: 'General', priority: 'Medium', text: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await services.vendor.getNotesByVendor(vendorId);
      setNotes(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [services, vendorId]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ type: 'General', priority: 'Medium', text: '' });
  };

  const startEdit = (n: VendorNote) => {
    setEditingId(n.id);
    setForm({ type: n.type, priority: n.priority, text: n.text });
  };

  const canEditNote = (n: VendorNote) => canEditAnyNote || n.authorId === (user?.id ?? 'current-user');

  const submit = async () => {
    if (!form.text.trim()) {
      toast.error('Note text is required');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await services.vendor.updateNote(vendorId, editingId, form);
        toast.success('Note updated ✓');
      } else {
        await services.vendor.addNote(vendorId, form);
        toast.success('Note added ✓');
      }
      resetForm();
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const removeNote = async (n: VendorNote) => {
    if (!confirm('Delete this note?')) return;
    try {
      await services.vendor.deleteNote(vendorId, n.id);
      toast.error('Note deleted');
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete note');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-sand-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-rose-900" />
          <h3 className="font-serif text-sm text-rose-900">
            {editingId ? 'Edit Note' : 'Add Note'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-sans">
          <label className="space-y-1">
            <span className="text-sand-700 font-medium text-xs">Type</span>
            <select value={form.type} onChange={(e) => setForm(s => ({ ...s, type: e.target.value as VendorNoteType }))}
              className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-sand-700 font-medium text-xs">Priority</span>
            <select value={form.priority} onChange={(e) => setForm(s => ({ ...s, priority: e.target.value as VendorNotePriority }))}
              className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
        </div>
        <textarea
          rows={3}
          value={form.text}
          onChange={(e) => setForm(s => ({ ...s, text: e.target.value }))}
          placeholder="Internal note — request, issue, follow-up, or general observation"
          className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <div className="flex justify-end gap-2">
          {editingId && (
            <button onClick={resetForm} disabled={submitting}
              className="px-3 py-1.5 text-xs font-sans text-sand-700 bg-sand-100 rounded-md hover:bg-sand-200">
              Cancel
            </button>
          )}
          <button onClick={submit} disabled={submitting || !form.text.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-white bg-rose-900 rounded-md hover:bg-rose-800 disabled:opacity-50">
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Plus className="w-3.5 h-3.5" />
            {editingId ? 'Save' : 'Add Note'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-lg bg-sand-100 animate-pulse" />)}
        </div>
      )}

      {!loading && error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">{error}</div>
      )}

      {!loading && !error && notes.length === 0 && (
        <p className="text-center py-8 text-sm font-sans text-sand-400">
          No notes yet. Add the first communication or internal observation above.
        </p>
      )}

      {!loading && !error && notes.length > 0 && (
        <ul className="space-y-3">
          {notes.map(n => (
            <li key={n.id} className="bg-white border border-sand-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${typeColors[n.type]}`}>{n.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans border ${priorityColors[n.priority]}`}>{n.priority}</span>
                  <span className="text-[11px] font-sans text-sand-500">
                    {n.authorName} · {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                {canEditNote(n) && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(n)} className="p-1 text-sand-400 hover:text-rose-900" aria-label="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeNote(n)} className="p-1 text-sand-400 hover:text-rose-700" aria-label="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-sans text-sand-800 whitespace-pre-wrap">{n.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
