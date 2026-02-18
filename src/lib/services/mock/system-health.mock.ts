/**
 * Mock System Health Service
 * Generates deterministic system health data for development
 */

import {
  ISystemHealthService,
  SystemMetrics,
  HealthTimePoint,
} from '../interfaces/ISystemHealthService';

export class MockSystemHealthService implements ISystemHealthService {
  /**
   * Get current system metrics snapshot
   * Returns static healthy metrics for demonstration
   */
  async getCurrentMetrics(): Promise<SystemMetrics> {
    return {
      uptime: 99.97,
      errorRate: 0.03,
      avgResponseTime: 142,
      activeSessions: 89,
      apiCallsToday: 12847,
      storageUsedGB: 23.4,
      storageCapacityGB: 100,
    };
  }

  /**
   * Get health timeline for the last N hours
   * Generates deterministic time series with slight variations every 4 hours
   * @param hours - Number of hours to fetch (default: 24)
   */
  async getHealthTimeline(hours: number = 24): Promise<HealthTimePoint[]> {
    const now = new Date();
    const points: HealthTimePoint[] = [];

    // Generate hourly data points
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);

      // Deterministic variations based on time
      const hourOfDay = time.getHours();
      const cyclePosition = (i % 4) / 4; // 4-hour cycle

      // Slight variations - system is generally healthy
      // Uptime dips slightly during business hours (load)
      const uptimeVariation = hourOfDay >= 9 && hourOfDay <= 17 ? -0.02 : 0;
      const uptime = 99.95 + uptimeVariation + (Math.sin(cyclePosition * Math.PI * 2) * 0.01);

      // Error rate increases slightly during business hours
      const errorVariation = hourOfDay >= 9 && hourOfDay <= 17 ? 0.02 : 0;
      const errorRate = 0.03 + errorVariation + (Math.cos(cyclePosition * Math.PI * 2) * 0.01);

      // Response time varies with load
      const responseVariation = hourOfDay >= 9 && hourOfDay <= 17 ? 20 : 0;
      const responseTime = 140 + responseVariation + (Math.sin(cyclePosition * Math.PI) * 10);

      points.push({
        time: time.toISOString(),
        uptime: Math.max(99.8, Math.min(100, uptime)),
        errorRate: Math.max(0, Math.min(0.1, errorRate)),
        responseTime: Math.max(100, Math.min(200, responseTime)),
      });
    }

    return points;
  }
}
