/**
 * External Integration Service Interface
 * API connections, health monitoring, and data flow metrics
 */

import type {
  ExternalIntegration,
  IntegrationHealthCheck,
  DataFlowMetric,
  IntegrationType,
  IntegrationStatus,
} from '@/lib/types';

export interface IntegrationDashboardStats {
  totalIntegrations: number;
  connectedCount: number;
  degradedCount: number;
  disconnectedCount: number;
  averageHealthScore: number;
  totalRecordsSyncedToday: number;
  totalErrorsToday: number;
}

export interface IIntegrationService {
  // Integrations
  getIntegrations(institutionId: string, filters?: {
    type?: IntegrationType;
    status?: IntegrationStatus;
  }): Promise<ExternalIntegration[]>;
  getIntegrationById(id: string): Promise<ExternalIntegration | null>;

  // Dashboard stats
  getDashboardStats(institutionId: string): Promise<IntegrationDashboardStats>;

  // Health checks
  getHealthChecks(integrationId: string, limit?: number): Promise<IntegrationHealthCheck[]>;
  triggerHealthCheck(integrationId: string): Promise<IntegrationHealthCheck>;

  // Data flow
  getDataFlowMetrics(integrationId: string, days?: number): Promise<DataFlowMetric[]>;

  // Connection management
  toggleIntegration(integrationId: string, enabled: boolean): Promise<ExternalIntegration>;
  testConnection(integrationId: string): Promise<{ success: boolean; latencyMs: number; message: string }>;
}
