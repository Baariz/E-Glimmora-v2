'use client';

import { IntegrationStatusCard } from './IntegrationStatusCard';
import type { ExternalIntegration } from '@/lib/types';

interface IntegrationOverviewProps {
  integrations: ExternalIntegration[];
}

const typeLabels: Record<string, string> = {
  government_advisory: 'Government Advisory',
  aviation: 'Aviation',
  insurance_provider: 'Insurance Provider',
  security: 'Security',
  financial_data: 'Financial Data',
};

export function IntegrationOverview({ integrations }: IntegrationOverviewProps) {
  if (integrations.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No integrations configured</p>;
  }

  const grouped = integrations.reduce<Record<string, ExternalIntegration[]>>((acc, i) => {
    const key = i.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(i);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type}>
          <h4 className="font-sans text-sm font-semibold text-slate-700 mb-3">
            {typeLabels[type] || type}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(integration => (
              <IntegrationStatusCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
