/**
 * Conflict Detection Service Interface
 * Cross-UHNI conflict detection, alerts, and resolution tracking
 */

import type {
  ConflictAlert,
  ConflictResolution,
  ConflictMatrixEntry,
  ConflictSeverity,
  ConflictStatus,
  ConflictType,
} from '@/lib/types';

export interface ConflictStats {
  totalActive: number;
  totalResolved: number;
  criticalCount: number;
  highCount: number;
  averageResolutionHours: number;
  byType: Record<ConflictType, number>;
}

export interface IConflictService {
  // Alerts
  getConflictAlerts(institutionId: string, filters?: {
    severity?: ConflictSeverity;
    status?: ConflictStatus;
    type?: ConflictType;
  }): Promise<ConflictAlert[]>;
  getConflictById(id: string): Promise<ConflictAlert | null>;

  // Stats
  getConflictStats(institutionId: string): Promise<ConflictStats>;

  // Matrix
  getConflictMatrix(institutionId: string): Promise<ConflictMatrixEntry[]>;

  // Resolution
  resolveConflict(conflictId: string, data: {
    resolvedBy: string;
    action: string;
    notes: string;
  }): Promise<ConflictAlert>;
  acknowledgeConflict(conflictId: string, userId: string): Promise<ConflictAlert>;

  // Resolution history
  getResolutionHistory(conflictId: string): Promise<ConflictResolution[]>;
}
