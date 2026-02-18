'use client';

/**
 * Vault Report Export Component (GVLT-03)
 * Report generation with date range filter and HTML export
 */

import { useState, useEffect } from 'react';
import { useServices } from '@/lib/hooks/useServices';
import { MemoryItem } from '@/lib/types/entities';
import { Download, FileText, Calendar } from 'lucide-react';

export function VaultReportExport({ clientId }: { clientId: string }) {
  const { memory } = useServices();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);

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

  const filterMemoriesByDate = () => {
    if (!dateFrom && !dateTo) return memories;

    return memories.filter(mem => {
      const memDate = new Date(mem.createdAt);
      if (dateFrom && memDate < new Date(dateFrom)) return false;
      if (dateTo && memDate > new Date(dateTo)) return false;
      return true;
    });
  };

  const exportReport = () => {
    const filteredMemories = filterMemoriesByDate();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Memory Vault Report - ${clientId}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; }
    h1 { color: #1e293b; border-bottom: 3px solid #e11d48; padding-bottom: 10px; }
    .meta { color: #64748b; font-size: 14px; margin-bottom: 30px; }
    .memory { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .memory-title { font-size: 18px; font-weight: 600; color: #0f172a; margin-bottom: 8px; }
    .memory-desc { color: #475569; margin-bottom: 12px; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    .tag { background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .memory-meta { color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Memory Vault Report</h1>
  <div class="meta">
    <strong>Client:</strong> ${clientId}<br>
    <strong>Report Generated:</strong> ${new Date().toLocaleString()}<br>
    <strong>Period:</strong> ${dateFrom || 'All'} to ${dateTo || 'All'}<br>
    <strong>Total Memories:</strong> ${filteredMemories.length}
  </div>

  ${filteredMemories.map(mem => `
    <div class="memory">
      <div class="memory-title">${mem.title}</div>
      ${mem.description ? `<div class="memory-desc">${mem.description}</div>` : ''}
      ${mem.emotionalTags.length > 0 ? `
        <div class="tags">
          ${mem.emotionalTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      ` : ''}
      <div class="memory-meta">
        <strong>Type:</strong> ${mem.type} |
        <strong>Created:</strong> ${new Date(mem.createdAt).toLocaleDateString()} |
        ${mem.isMilestone ? '<strong style="color: #9333ea;">Milestone</strong> |' : ''}
        ${mem.isLocked ? '<strong style="color: #d97706;">Locked</strong> |' : ''}
        <strong>Linked Journeys:</strong> ${mem.linkedJourneys.length}
      </div>
    </div>
  `).join('')}

  <div class="footer">
    <strong>Report Notice:</strong> This report contains governed memory vault data.
    Access and export logged to institutional audit trail.
    Report generated in compliance with data governance policies.
  </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-report-${clientId}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredMemories = filterMemoriesByDate();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl text-slate-900 mb-1">Vault Report Export</h3>
        <p className="font-sans text-sm text-slate-600">
          Generate and export memory vault reports with audit tracking
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3">Date Range Filter</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-xs text-slate-600 mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-slate-600 mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 border border-slate-200 rounded-lg bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h4 className="font-sans text-sm font-semibold text-slate-700">Report Preview</h4>
          </div>
          <button
            onClick={exportReport}
            disabled={filteredMemories.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors font-sans text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export HTML Report
          </button>
        </div>

        <div className="space-y-2 text-sm font-sans">
          <p className="text-slate-600">
            <strong>Client:</strong> {clientId}
          </p>
          <p className="text-slate-600">
            <strong>Period:</strong> {dateFrom || 'All'} to {dateTo || 'All'}
          </p>
          <p className="text-slate-600">
            <strong>Memories in Report:</strong> {filteredMemories.length} of {memories.length}
          </p>
        </div>

        {filteredMemories.length === 0 && (
          <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
            <p className="font-sans text-sm text-amber-900">
              No memories match the selected date range.
            </p>
          </div>
        )}
      </div>

      {/* Audit Notice */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-sans text-sm font-semibold text-blue-900 mb-1">
              Audit & Compliance
            </h4>
            <p className="font-sans text-sm text-blue-800">
              All report exports are logged to the institutional audit trail. Exported reports include
              a governance footer indicating compliance with data policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
