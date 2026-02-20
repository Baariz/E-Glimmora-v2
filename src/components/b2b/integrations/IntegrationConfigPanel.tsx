'use client';

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import type { ExternalIntegration } from '@/lib/types';

interface IntegrationConfigPanelProps {
  integrations: ExternalIntegration[];
  services: { integration: { toggleIntegration: (id: string, enabled: boolean) => Promise<ExternalIntegration> } };
  onRefresh: () => void;
}

const statusDot: Record<string, string> = {
  Connected: 'bg-teal-500',
  Degraded: 'bg-amber-500',
  Disconnected: 'bg-rose-500',
  Configuring: 'bg-blue-500',
  Maintenance: 'bg-slate-400',
};

export function IntegrationConfigPanel({ integrations, services, onRefresh }: IntegrationConfigPanelProps) {
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggle = async (id: string, currentlyConnected: boolean) => {
    setToggling(id);
    try {
      await services.integration.toggleIntegration(id, !currentlyConnected);
      onRefresh();
    } finally {
      setToggling(null);
    }
  };

  if (integrations.length === 0) {
    return <p className="text-center py-8 text-sm font-sans text-slate-500">No integrations to configure</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-slate-500" />
        <h4 className="font-sans text-sm font-semibold text-slate-700">Integration Configuration</h4>
      </div>

      <div className="space-y-3">
        {integrations.map(i => {
          const isConnected = i.status === 'Connected' || i.status === 'Degraded';
          const isToggling = toggling === i.id;

          return (
            <Card key={i.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${statusDot[i.status]}`} />
                  <div>
                    <h5 className="font-sans text-sm font-semibold text-slate-900">{i.name}</h5>
                    <p className="font-sans text-[10px] text-slate-500">{i.provider} • {i.endpoint}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-[10px] font-sans text-slate-500">
                    <p>Sync: {i.syncFrequency}</p>
                    <p>API Key: {i.apiKeyConfigured ? 'Configured' : 'Not Set'}</p>
                  </div>

                  <button
                    onClick={() => handleToggle(i.id, isConnected)}
                    disabled={isToggling}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-sans font-medium rounded-md transition-colors disabled:opacity-50"
                    title={isConnected ? 'Disable integration' : 'Enable integration'}
                  >
                    {isConnected ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-teal-600" />
                        <span className="text-teal-700">Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-500">Disabled</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
