/**
 * Mock External Integration Service
 * API connections, health monitoring, and data flow metrics
 */

import { BaseMockService } from './base.mock';
import type { IIntegrationService, IntegrationDashboardStats } from '../interfaces/IIntegrationService';
import type {
  ExternalIntegration,
  IntegrationHealthCheck,
  DataFlowMetric,
  IntegrationType,
  IntegrationStatus,
} from '@/lib/types';

const INTEGRATIONS_KEY = 'external_integrations';
const HEALTH_KEY = 'integration_health_checks';
const FLOW_KEY = 'integration_data_flow';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export class MockIntegrationService extends BaseMockService implements IIntegrationService {
  constructor() {
    super();
    this.seedIfEmpty();
  }

  private seedIfEmpty(): void {
    if (this.getFromStorage(INTEGRATIONS_KEY).length > 0) return;

    const integrations: ExternalIntegration[] = [
      {
        id: 'integ-001', institutionId: MOCK_INSTITUTION_ID,
        name: 'UK FCDO Travel Advisory', provider: 'UK Foreign, Commonwealth & Development Office',
        type: 'government_advisory', status: 'Connected',
        endpoint: 'https://api.fcdo.gov.uk/v2/travel-advice', apiKeyConfigured: true,
        syncFrequency: 'Hourly', lastSyncAt: '2026-02-20T08:00:00Z', lastSyncStatus: 'Success',
        recordsSynced: 195, errorCount: 0, healthScore: 98,
        configuredBy: 'b2b-admin-001', configuredAt: '2025-09-15T10:00:00Z',
        createdAt: '2025-09-15T10:00:00Z', updatedAt: '2026-02-20T08:00:00Z',
      },
      {
        id: 'integ-002', institutionId: MOCK_INSTITUTION_ID,
        name: 'US State Dept Travel Advisories', provider: 'US Department of State',
        type: 'government_advisory', status: 'Connected',
        endpoint: 'https://travel.state.gov/api/v1/advisories', apiKeyConfigured: true,
        syncFrequency: 'Daily', lastSyncAt: '2026-02-20T02:00:00Z', lastSyncStatus: 'Success',
        recordsSynced: 210, errorCount: 0, healthScore: 95,
        configuredBy: 'b2b-admin-001', configuredAt: '2025-09-20T10:00:00Z',
        createdAt: '2025-09-20T10:00:00Z', updatedAt: '2026-02-20T02:00:00Z',
      },
      {
        id: 'integ-003', institutionId: MOCK_INSTITUTION_ID,
        name: 'EU Sanctions Registry', provider: 'European Commission',
        type: 'government_advisory', status: 'Degraded',
        endpoint: 'https://sanctions.ec.europa.eu/api/v2/consolidated', apiKeyConfigured: true,
        syncFrequency: 'Daily', lastSyncAt: '2026-02-19T22:00:00Z', lastSyncStatus: 'Partial',
        recordsSynced: 1842, errorCount: 3, healthScore: 72,
        configuredBy: 'b2b-admin-001', configuredAt: '2025-10-01T10:00:00Z',
        createdAt: '2025-10-01T10:00:00Z', updatedAt: '2026-02-19T22:00:00Z',
      },
      {
        id: 'integ-004', institutionId: MOCK_INSTITUTION_ID,
        name: 'FlightAware Enterprise', provider: 'FlightAware / Collins Aerospace',
        type: 'aviation', status: 'Connected',
        endpoint: 'https://aeroapi.flightaware.com/v4', apiKeyConfigured: true,
        syncFrequency: 'Real-time', lastSyncAt: '2026-02-20T09:15:00Z', lastSyncStatus: 'Success',
        recordsSynced: 1247, errorCount: 0, healthScore: 99,
        configuredBy: 'b2b-admin-001', configuredAt: '2025-08-01T10:00:00Z',
        createdAt: '2025-08-01T10:00:00Z', updatedAt: '2026-02-20T09:15:00Z',
      },
      {
        id: 'integ-005', institutionId: MOCK_INSTITUTION_ID,
        name: 'EUROCONTROL NM B2B', provider: 'EUROCONTROL Network Manager',
        type: 'aviation', status: 'Connected',
        endpoint: 'https://nm.eurocontrol.int/api/v2/flow', apiKeyConfigured: true,
        syncFrequency: 'Hourly', lastSyncAt: '2026-02-20T09:00:00Z', lastSyncStatus: 'Success',
        recordsSynced: 456, errorCount: 0, healthScore: 94,
        configuredBy: 'b2b-admin-001', configuredAt: '2025-11-01T10:00:00Z',
        createdAt: '2025-11-01T10:00:00Z', updatedAt: '2026-02-20T09:00:00Z',
      },
      {
        id: 'integ-006', institutionId: MOCK_INSTITUTION_ID,
        name: 'ADS-B Exchange Premium', provider: 'ADS-B Exchange',
        type: 'aviation', status: 'Maintenance',
        endpoint: 'https://globe.adsbexchange.com/api/v2', apiKeyConfigured: true,
        syncFrequency: 'Real-time', lastSyncAt: '2026-02-19T00:00:00Z', lastSyncStatus: 'Never',
        recordsSynced: 0, errorCount: 0, healthScore: 0,
        configuredBy: 'b2b-admin-001', configuredAt: '2026-01-15T10:00:00Z',
        createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-02-19T00:00:00Z',
      },
      {
        id: 'integ-007', institutionId: MOCK_INSTITUTION_ID,
        name: 'Zurich International Policy Sync', provider: 'Zurich Insurance Group',
        type: 'insurance_provider', status: 'Connected',
        endpoint: 'https://api.zurich.com/partners/v1/policies', apiKeyConfigured: true,
        syncFrequency: 'Daily', lastSyncAt: '2026-02-20T01:00:00Z', lastSyncStatus: 'Success',
        recordsSynced: 42, errorCount: 0, healthScore: 91,
        configuredBy: 'b2b-admin-001', configuredAt: '2025-07-01T10:00:00Z',
        createdAt: '2025-07-01T10:00:00Z', updatedAt: '2026-02-20T01:00:00Z',
      },
      {
        id: 'integ-008', institutionId: MOCK_INSTITUTION_ID,
        name: 'Chubb Elite Claims Portal', provider: 'Chubb Limited',
        type: 'insurance_provider', status: 'Disconnected',
        endpoint: 'https://api.chubb.com/elite/v2/claims', apiKeyConfigured: true,
        syncFrequency: 'Daily', lastSyncAt: '2026-02-15T01:00:00Z', lastSyncStatus: 'Failed',
        recordsSynced: 0, errorCount: 15, healthScore: 12,
        configuredBy: 'b2b-admin-001', configuredAt: '2025-09-01T10:00:00Z',
        createdAt: '2025-09-01T10:00:00Z', updatedAt: '2026-02-20T01:00:00Z',
      },
      {
        id: 'integ-009', institutionId: MOCK_INSTITUTION_ID,
        name: 'AIG Private Client API', provider: 'AIG',
        type: 'insurance_provider', status: 'Connected',
        endpoint: 'https://api.aig.com/privateclient/v1', apiKeyConfigured: true,
        syncFrequency: 'Weekly', lastSyncAt: '2026-02-17T03:00:00Z', lastSyncStatus: 'Success',
        recordsSynced: 28, errorCount: 0, healthScore: 88,
        configuredBy: 'b2b-admin-001', configuredAt: '2025-11-15T10:00:00Z',
        createdAt: '2025-11-15T10:00:00Z', updatedAt: '2026-02-17T03:00:00Z',
      },
    ];

    // Generate health checks for each integration (last 5 checks)
    const healthChecks: IntegrationHealthCheck[] = integrations.flatMap(integ => {
      const checks: IntegrationHealthCheck[] = [];
      for (let i = 0; i < 5; i++) {
        const hourOffset = i * 1;
        const isHealthy = integ.status === 'Connected' || (integ.status === 'Degraded' && Math.random() > 0.3);
        checks.push({
          id: `hc-${integ.id}-${i}`,
          integrationId: integ.id,
          timestamp: new Date(Date.now() - hourOffset * 3600000).toISOString(),
          latencyMs: isHealthy ? 120 + Math.floor(Math.random() * 200) : 2000 + Math.floor(Math.random() * 3000),
          statusCode: isHealthy ? 200 : (integ.status === 'Disconnected' ? 503 : 408),
          isHealthy,
          errorMessage: isHealthy ? undefined : (integ.status === 'Disconnected' ? 'Connection refused' : 'Request timeout'),
        });
      }
      return checks;
    });

    // Generate data flow metrics (last 7 days per integration)
    const dataFlowMetrics: DataFlowMetric[] = integrations
      .filter(i => i.status !== 'Maintenance')
      .flatMap(integ => {
        const metrics: DataFlowMetric[] = [];
        for (let d = 0; d < 7; d++) {
          const date = new Date(Date.now() - d * 86400000);
          const dateStr = date.toISOString().split('T')[0] ?? '';
          const baseRecords = integ.status === 'Connected' ? integ.recordsSynced : 0;
          metrics.push({
            integrationId: integ.id,
            period: dateStr,
            recordsIngested: Math.max(0, baseRecords + Math.floor(Math.random() * 50 - 25)),
            recordsFailed: integ.status === 'Disconnected' ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 2),
            avgLatencyMs: integ.status === 'Connected' ? 150 + Math.floor(Math.random() * 100) : 3000 + Math.floor(Math.random() * 2000),
            peakLatencyMs: integ.status === 'Connected' ? 400 + Math.floor(Math.random() * 200) : 8000 + Math.floor(Math.random() * 4000),
          });
        }
        return metrics;
      });

    this.setInStorage(INTEGRATIONS_KEY, integrations);
    this.setInStorage(HEALTH_KEY, healthChecks);
    this.setInStorage(FLOW_KEY, dataFlowMetrics);
  }

  async getIntegrations(institutionId: string, filters?: {
    type?: IntegrationType;
    status?: IntegrationStatus;
  }): Promise<ExternalIntegration[]> {
    await this.delay();
    let results = this.getFromStorage<ExternalIntegration>(INTEGRATIONS_KEY)
      .filter(i => i.institutionId === institutionId);
    if (filters?.type) results = results.filter(i => i.type === filters.type);
    if (filters?.status) results = results.filter(i => i.status === filters.status);
    return results;
  }

  async getIntegrationById(id: string): Promise<ExternalIntegration | null> {
    await this.delay();
    return this.getFromStorage<ExternalIntegration>(INTEGRATIONS_KEY).find(i => i.id === id) || null;
  }

  async getDashboardStats(institutionId: string): Promise<IntegrationDashboardStats> {
    await this.delay();
    const all = this.getFromStorage<ExternalIntegration>(INTEGRATIONS_KEY)
      .filter(i => i.institutionId === institutionId);

    return {
      totalIntegrations: all.length,
      connectedCount: all.filter(i => i.status === 'Connected').length,
      degradedCount: all.filter(i => i.status === 'Degraded').length,
      disconnectedCount: all.filter(i => i.status === 'Disconnected').length,
      averageHealthScore: Math.round(all.reduce((sum, i) => sum + i.healthScore, 0) / all.length),
      totalRecordsSyncedToday: all.reduce((sum, i) => sum + i.recordsSynced, 0),
      totalErrorsToday: all.reduce((sum, i) => sum + i.errorCount, 0),
    };
  }

  async getHealthChecks(integrationId: string, limit?: number): Promise<IntegrationHealthCheck[]> {
    await this.delay();
    let checks = this.getFromStorage<IntegrationHealthCheck>(HEALTH_KEY)
      .filter(h => h.integrationId === integrationId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (limit) checks = checks.slice(0, limit);
    return checks;
  }

  async triggerHealthCheck(integrationId: string): Promise<IntegrationHealthCheck> {
    await this.delay(500);
    const integration = this.getFromStorage<ExternalIntegration>(INTEGRATIONS_KEY).find(i => i.id === integrationId);
    const isHealthy = integration?.status === 'Connected';
    const check: IntegrationHealthCheck = {
      id: this.generateId(),
      integrationId,
      timestamp: this.now(),
      latencyMs: isHealthy ? 120 + Math.floor(Math.random() * 200) : 3000 + Math.floor(Math.random() * 2000),
      statusCode: isHealthy ? 200 : 503,
      isHealthy,
      errorMessage: isHealthy ? undefined : 'Connection refused or timeout',
    };
    const checks = this.getFromStorage<IntegrationHealthCheck>(HEALTH_KEY);
    checks.push(check);
    this.setInStorage(HEALTH_KEY, checks);
    return check;
  }

  async getDataFlowMetrics(integrationId: string, days?: number): Promise<DataFlowMetric[]> {
    await this.delay();
    let metrics = this.getFromStorage<DataFlowMetric>(FLOW_KEY)
      .filter(m => m.integrationId === integrationId)
      .sort((a, b) => b.period.localeCompare(a.period));
    if (days) metrics = metrics.slice(0, days);
    return metrics;
  }

  async toggleIntegration(integrationId: string, enabled: boolean): Promise<ExternalIntegration> {
    await this.delay();
    const items = this.getFromStorage<ExternalIntegration>(INTEGRATIONS_KEY);
    const item = items.find(i => i.id === integrationId);
    if (!item) throw new Error('Integration not found');
    item.status = enabled ? 'Connected' : 'Disconnected';
    item.updatedAt = this.now();
    this.setInStorage(INTEGRATIONS_KEY, items);
    return item;
  }

  async testConnection(integrationId: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
    await this.delay(800);
    const integration = this.getFromStorage<ExternalIntegration>(INTEGRATIONS_KEY).find(i => i.id === integrationId);
    if (!integration) throw new Error('Integration not found');
    const success = integration.status === 'Connected' || integration.status === 'Degraded';
    return {
      success,
      latencyMs: success ? 150 + Math.floor(Math.random() * 100) : 5000,
      message: success ? 'Connection successful' : `Connection failed: ${integration.status === 'Disconnected' ? 'Remote endpoint unreachable' : 'Service under maintenance'}`,
    };
  }
}
