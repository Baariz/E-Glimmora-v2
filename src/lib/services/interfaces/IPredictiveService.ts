/**
 * Predictive Intelligence Service Interface
 * Travel fatigue detection and family alignment drift monitoring
 */

import type {
  TravelFatigueAssessment,
  FamilyAlignmentAssessment,
  PredictiveAlert,
  TravelSegment,
} from '@/lib/types';

export interface IPredictiveService {
  // Travel Fatigue
  getTravelFatigueAssessments(institutionId: string): Promise<TravelFatigueAssessment[]>;
  getTravelFatigueByClient(clientId: string): Promise<TravelFatigueAssessment | null>;
  getTravelSegments(clientId: string): Promise<TravelSegment[]>;

  // Family Alignment
  getFamilyAlignmentAssessments(institutionId: string): Promise<FamilyAlignmentAssessment[]>;
  getFamilyAlignmentByClient(clientId: string): Promise<FamilyAlignmentAssessment | null>;

  // Alerts
  getPredictiveAlerts(institutionId: string): Promise<PredictiveAlert[]>;
  acknowledgeAlert(alertId: string): Promise<void>;
}
