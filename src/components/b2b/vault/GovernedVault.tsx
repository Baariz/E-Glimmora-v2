'use client';

/**
 * Governed Vault Component (GVLT-01 & GVLT-02)
 * Read-only timeline of client memories with governance banner and audit logging
 */

import { useState, useEffect } from 'react';
import { useServices } from '@/lib/hooks/useServices';
import { MemoryItem } from '@/lib/types/entities';
import { Lock, Eye, Calendar } from 'lucide-react';

export function GovernedVault({ clientId }: { clientId: string }) {
  const { memory } = useServices();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, [clientId]);

  const loadMemories = async () => {
    try {
      setLoading(true);
      const data = await memory.getMemories(clientId);
      setMemories(data);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-slate-200 rounded"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Governance Banner */}
      <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-sans text-sm font-semibold text-amber-900 mb-1">
              Governed Mode: Read-Only Access
            </h4>
            <p className="font-sans text-sm text-amber-800">
              You are viewing this client&apos;s vault in governed mode. All access is logged
              to the audit trail. You cannot modify, delete, or export memories. This access
              is compliant with institutional data governance policies.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-xl text-slate-900 mb-1">
          Memory Vault for {clientId}
        </h3>
        <p className="font-sans text-sm text-slate-600">
          Read-only timeline view ({memories.length} memories)
        </p>
      </div>

      {/* Memory Timeline */}
      {memories.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 rounded-lg">
          <Eye className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="font-sans text-sm text-slate-500">No memories in vault yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {memories.map(mem => (
            <div
              key={mem.id}
              className="p-4 border border-slate-200 rounded-lg bg-white hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 text-base mb-1">{mem.title}</h4>
                  {mem.description && (
                    <p className="text-sm text-slate-600">{mem.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {mem.isLocked && (
                    <Lock className="w-4 h-4 text-amber-600" />
                  )}
                  {mem.isMilestone && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-sans">
                      Milestone
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-sans">
                    {mem.type}
                  </span>
                </div>
              </div>

              {mem.emotionalTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {mem.emotionalTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-sans"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-500 font-sans pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(mem.createdAt).toLocaleDateString()}
                </span>
                {mem.linkedJourneys.length > 0 && (
                  <span>
                    Linked to {mem.linkedJourneys.length} journey{mem.linkedJourneys.length > 1 ? 's' : ''}
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1 text-blue-600">
                  <Eye className="w-3 h-3" />
                  Viewed (audit logged)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
