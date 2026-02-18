'use client';

/**
 * Presentation Export Component
 * Generates printable client presentation document
 */

import { Journey, ClientRecord } from '@/lib/types/entities';
import { Card, CardHeader, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Download } from 'lucide-react';
import { getStateLabel } from '@/lib/state-machines/journey-workflow';

interface PresentationExportProps {
  journey: Journey;
  client: ClientRecord | null;
}

export function PresentationExport({ journey, client }: PresentationExportProps) {
  const handleExport = () => {
    // Generate printable presentation in a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to generate the presentation');
      return;
    }

    const presentationHTML = generatePresentationHTML(journey, client);
    printWindow.document.write(presentationHTML);
    printWindow.document.close();

    // Trigger print dialog after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-sans text-sm font-semibold text-slate-700">Client Presentation</h3>
      </CardHeader>
      <CardContent>
        <p className="font-sans text-xs text-slate-600 mb-4">
          Generate a formatted presentation document for client review
        </p>
        <Button variant="primary" size="sm" onClick={handleExport} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Presentation
        </Button>
      </CardContent>
    </Card>
  );
}

// Generate HTML for printable presentation
function generatePresentationHTML(journey: Journey, client: ClientRecord | null): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${journey.title} - Client Presentation</title>
  <style>
    @page {
      margin: 1in;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Georgia, serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in;
    }

    h1 {
      font-size: 32pt;
      font-weight: 400;
      color: #881337;
      margin-bottom: 0.5em;
      border-bottom: 2px solid #881337;
      padding-bottom: 0.25em;
    }

    h2 {
      font-size: 20pt;
      font-weight: 600;
      color: #881337;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }

    h3 {
      font-size: 14pt;
      font-weight: 600;
      color: #475569;
      margin-top: 1em;
      margin-bottom: 0.5em;
    }

    p {
      font-size: 11pt;
      margin-bottom: 1em;
      text-align: justify;
    }

    .metadata {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 10pt;
      color: #64748b;
      margin-bottom: 2em;
      padding: 0.75em;
      background: #f8fafc;
      border-radius: 4px;
    }

    .metadata-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25em;
    }

    .metadata-label {
      font-weight: 600;
    }

    .badge {
      display: inline-block;
      padding: 0.25em 0.75em;
      border-radius: 999px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 9pt;
      font-weight: 500;
      margin-right: 0.5em;
    }

    .badge-category {
      background: #f0fdf4;
      color: #166534;
    }

    .badge-discretion {
      background: #f1f5f9;
      color: #475569;
    }

    .section {
      margin-top: 2em;
      page-break-inside: avoid;
    }

    .narrative {
      font-size: 12pt;
      line-height: 1.8;
      margin-bottom: 2em;
      white-space: pre-wrap;
    }

    .footer {
      margin-top: 3em;
      padding-top: 1em;
      border-top: 1px solid #e2e8f0;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 9pt;
      color: #94a3b8;
      text-align: center;
    }

    @media print {
      body {
        padding: 0;
      }

      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <h1>${journey.title}</h1>

  <!-- Metadata -->
  <div class="metadata">
    ${client ? `<div class="metadata-row"><span class="metadata-label">Client:</span><span>${client.name}</span></div>` : ''}
    <div class="metadata-row">
      <span class="metadata-label">Category:</span>
      <span>
        <span class="badge badge-category">${journey.category}</span>
        ${journey.discretionLevel ? `<span class="badge badge-discretion">${journey.discretionLevel} Discretion</span>` : ''}
      </span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Status:</span>
      <span>${getStateLabel(journey.status)}</span>
    </div>
  </div>

  <!-- Emotional Objective -->
  ${
    journey.emotionalObjective
      ? `
  <div class="section">
    <h3>Emotional Objective</h3>
    <p>${journey.emotionalObjective}</p>
  </div>
  `
      : ''
  }

  <!-- Journey Narrative -->
  <div class="section">
    <h2>Journey Narrative</h2>
    <div class="narrative">${journey.narrative}</div>
  </div>

  <!-- Strategic Reasoning -->
  ${
    journey.strategicReasoning
      ? `
  <div class="section">
    <h3>Strategic Reasoning</h3>
    <p>${journey.strategicReasoning}</p>
  </div>
  `
      : ''
  }

  <!-- Risk Summary -->
  ${
    journey.riskSummary
      ? `
  <div class="section">
    <h3>Risk Considerations</h3>
    <p>${journey.riskSummary}</p>
  </div>
  `
      : ''
  }

  <!-- Footer -->
  <div class="footer">
    <p>Élan — Bespoke Luxury Experience Platform</p>
    <p>This document is confidential and prepared exclusively for ${client ? client.name : 'the client'}.</p>
    <p>© ${currentYear} Élan. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
}
