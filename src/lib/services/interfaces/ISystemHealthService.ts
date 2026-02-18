/**
 * System Health Service Interface
 * Provides system monitoring and health metrics
 */

export interface SystemMetrics {
  uptime: number; // percentage (0-100)
  errorRate: number; // percentage (0-100)
  avgResponseTime: number; // milliseconds
  activeSessions: number;
  apiCallsToday: number;
  storageUsedGB: number;
  storageCapacityGB: number;
}

export interface HealthTimePoint {
  time: string; // ISO timestamp
  uptime: number; // percentage
  errorRate: number; // percentage
  responseTime: number; // milliseconds
}

export interface ISystemHealthService {
  /**
   * Get current system metrics snapshot
   */
  getCurrentMetrics(): Promise<SystemMetrics>;

  /**
   * Get health timeline for the last N hours
   * @param hours - Number of hours to fetch (default: 24)
   */
  getHealthTimeline(hours?: number): Promise<HealthTimePoint[]>;
}
