/**
 * Mock Predictive Intelligence Service
 * Travel fatigue detection and family alignment drift monitoring
 */

import { BaseMockService } from './base.mock';
import type { IPredictiveService } from '../interfaces/IPredictiveService';
import type {
  TravelFatigueAssessment,
  FamilyAlignmentAssessment,
  PredictiveAlert,
  TravelSegment,
} from '@/lib/types';

const FATIGUE_KEY = 'predictive_fatigue';
const ALIGNMENT_KEY = 'predictive_alignment';
const ALERTS_KEY = 'predictive_alerts';
const SEGMENTS_KEY = 'travel_segments';

const MOCK_INSTITUTION_ID = 'inst-001-uuid-placeholder';

export class MockPredictiveService extends BaseMockService implements IPredictiveService {
  constructor() {
    super();
    this.seedIfEmpty();
  }

  private seedIfEmpty(): void {
    if (this.getFromStorage(FATIGUE_KEY).length > 0) return;

    const fatigueAssessments: TravelFatigueAssessment[] = [
      {
        id: 'fatigue-001',
        clientId: 'user-uhni-001',
        clientName: 'Alexandra Bennett',
        institutionId: MOCK_INSTITUTION_ID,
        fatigueScore: 34,
        fatigueLevel: 'Low',
        tripsLast30Days: 2,
        tripsLast90Days: 5,
        averageTimezonesCrossed: 3,
        totalFlightHoursLast90Days: 28,
        restDaysBetweenTrips: 12,
        burnoutRiskPercent: 15,
        recommendations: [
          'Current travel pace is sustainable',
          'Consider spacing Geneva trips to reduce timezone fatigue',
        ],
        trendDirection: 'stable',
        assessedAt: '2026-02-18T10:00:00Z',
        nextAssessmentDate: '2026-03-18T10:00:00Z',
      },
      {
        id: 'fatigue-002',
        clientId: 'user-uhni-002',
        clientName: 'Marcus Pemberton-Shaw',
        institutionId: MOCK_INSTITUTION_ID,
        fatigueScore: 72,
        fatigueLevel: 'High',
        tripsLast30Days: 5,
        tripsLast90Days: 14,
        averageTimezonesCrossed: 6,
        totalFlightHoursLast90Days: 82,
        restDaysBetweenTrips: 4,
        burnoutRiskPercent: 68,
        recommendations: [
          'Consolidate upcoming Geneva and Zurich meetings into a single Swiss visit',
          'Schedule a 5-day wellness retreat at Aman Tokyo between March and April travel blocks',
          'Consider virtual attendance for the Dubai advisory board meeting',
        ],
        trendDirection: 'worsening',
        assessedAt: '2026-02-18T10:00:00Z',
        nextAssessmentDate: '2026-03-04T10:00:00Z',
      },
      {
        id: 'fatigue-003',
        clientId: 'user-uhni-003',
        clientName: 'Isabella von Habsburg',
        institutionId: MOCK_INSTITUTION_ID,
        fatigueScore: 82,
        fatigueLevel: 'Critical',
        tripsLast30Days: 7,
        tripsLast90Days: 18,
        averageTimezonesCrossed: 8,
        totalFlightHoursLast90Days: 112,
        restDaysBetweenTrips: 2,
        burnoutRiskPercent: 89,
        recommendations: [
          'Immediate rest period recommended — 47 timezone crossings in 90 days',
          'Cancel or delegate the Singapore art fair attendance',
          'Arrange on-site medical wellness check at next destination',
          'Transition to single-region travel for the next 30 days',
        ],
        trendDirection: 'worsening',
        assessedAt: '2026-02-18T10:00:00Z',
        nextAssessmentDate: '2026-02-25T10:00:00Z',
      },
      {
        id: 'fatigue-004',
        clientId: 'user-uhni-004',
        clientName: 'Raj Mehta',
        institutionId: MOCK_INSTITUTION_ID,
        fatigueScore: 18,
        fatigueLevel: 'Minimal',
        tripsLast30Days: 1,
        tripsLast90Days: 3,
        averageTimezonesCrossed: 2,
        totalFlightHoursLast90Days: 14,
        restDaysBetweenTrips: 21,
        burnoutRiskPercent: 5,
        recommendations: ['Travel pattern is well-balanced and sustainable'],
        trendDirection: 'improving',
        assessedAt: '2026-02-18T10:00:00Z',
        nextAssessmentDate: '2026-04-18T10:00:00Z',
      },
      {
        id: 'fatigue-005',
        clientId: 'user-uhni-005',
        clientName: 'Elena Volkov',
        institutionId: MOCK_INSTITUTION_ID,
        fatigueScore: 55,
        fatigueLevel: 'Moderate',
        tripsLast30Days: 3,
        tripsLast90Days: 9,
        averageTimezonesCrossed: 5,
        totalFlightHoursLast90Days: 52,
        restDaysBetweenTrips: 7,
        burnoutRiskPercent: 42,
        recommendations: [
          'Monitor for increasing fatigue — approaching elevated threshold',
          'Recommend 3-day buffer between transatlantic crossings',
        ],
        trendDirection: 'stable',
        assessedAt: '2026-02-18T10:00:00Z',
        nextAssessmentDate: '2026-03-11T10:00:00Z',
      },
    ];

    const alignmentAssessments: FamilyAlignmentAssessment[] = [
      {
        id: 'align-001',
        clientId: 'user-uhni-002',
        clientName: 'Marcus Pemberton-Shaw',
        institutionId: MOCK_INSTITUTION_ID,
        overallAlignmentScore: 43,
        driftSeverity: 'Significant',
        familyMembers: [
          {
            memberId: 'fm-001',
            memberName: 'Marcus Sr.',
            relationship: 'Parent',
            travelPreferences: ['Cultural', 'Wellness'],
            investmentStyle: 'Conservative',
            lifestyleValues: ['Tradition', 'Legacy', 'Discretion'],
            philanthropicInterests: ['Classical Arts', 'Education'],
            lastUpdated: '2026-01-15T10:00:00Z',
          },
          {
            memberId: 'fm-002',
            memberName: 'Sophia Pemberton-Shaw',
            relationship: 'Spouse',
            travelPreferences: ['Adventure', 'Luxury'],
            investmentStyle: 'Moderate',
            lifestyleValues: ['Sustainability', 'Wellness', 'Community'],
            philanthropicInterests: ['Climate Change', 'Women Empowerment'],
            lastUpdated: '2026-02-01T10:00:00Z',
          },
          {
            memberId: 'fm-003',
            memberName: 'Oliver Pemberton-Shaw',
            relationship: 'Child',
            travelPreferences: ['Adventure', 'Exclusive Access'],
            investmentStyle: 'Very Aggressive',
            lifestyleValues: ['Innovation', 'Freedom', 'Impact'],
            philanthropicInterests: ['Web3 Philanthropy', 'Space Exploration'],
            lastUpdated: '2026-02-10T10:00:00Z',
          },
        ],
        driftAreas: [
          {
            area: 'Investment Philosophy',
            currentDriftPercent: 78,
            previousDriftPercent: 65,
            trendDirection: 'diverging',
          },
          {
            area: 'Philanthropy',
            currentDriftPercent: 62,
            previousDriftPercent: 58,
            trendDirection: 'diverging',
          },
          {
            area: 'Travel Style',
            currentDriftPercent: 35,
            previousDriftPercent: 40,
            trendDirection: 'converging',
          },
          {
            area: 'Lifestyle Values',
            currentDriftPercent: 48,
            previousDriftPercent: 45,
            trendDirection: 'stable',
          },
        ],
        alerts: [
          {
            id: 'da-001',
            severity: 'Critical',
            message: 'Heir advocates aggressive crypto allocation (40%) vs patriarch\'s conservative stance (5% max)',
            area: 'Investment Philosophy',
            triggeredAt: '2026-02-12T14:00:00Z',
            acknowledged: false,
          },
          {
            id: 'da-002',
            severity: 'Significant',
            message: 'Spouse favoring climate-focused giving while patriarch prefers classical arts endowment',
            area: 'Philanthropy',
            triggeredAt: '2026-02-08T09:00:00Z',
            acknowledged: true,
          },
        ],
        recommendations: [
          'Schedule a facilitated family alignment session within 30 days',
          'Propose a blended investment strategy that addresses both conservative and growth mandates',
          'Explore unified philanthropic vehicle that spans both arts and climate interests',
        ],
        assessedAt: '2026-02-15T10:00:00Z',
        nextReviewDate: '2026-03-15T10:00:00Z',
      },
      {
        id: 'align-002',
        clientId: 'user-uhni-001',
        clientName: 'Alexandra Bennett',
        institutionId: MOCK_INSTITUTION_ID,
        overallAlignmentScore: 82,
        driftSeverity: 'Minor',
        familyMembers: [
          {
            memberId: 'fm-004',
            memberName: 'James Bennett',
            relationship: 'Spouse',
            travelPreferences: ['Cultural', 'Wellness'],
            investmentStyle: 'Moderate',
            lifestyleValues: ['Family', 'Education', 'Health'],
            philanthropicInterests: ['Medical Research', 'Education'],
            lastUpdated: '2026-01-20T10:00:00Z',
          },
        ],
        driftAreas: [
          {
            area: 'Investment Philosophy',
            currentDriftPercent: 12,
            previousDriftPercent: 15,
            trendDirection: 'converging',
          },
          {
            area: 'Travel Style',
            currentDriftPercent: 22,
            previousDriftPercent: 20,
            trendDirection: 'stable',
          },
        ],
        alerts: [],
        recommendations: ['Family alignment is strong — continue quarterly check-ins'],
        assessedAt: '2026-02-10T10:00:00Z',
        nextReviewDate: '2026-05-10T10:00:00Z',
      },
      {
        id: 'align-003',
        clientId: 'user-uhni-005',
        clientName: 'Elena Volkov',
        institutionId: MOCK_INSTITUTION_ID,
        overallAlignmentScore: 61,
        driftSeverity: 'Moderate',
        familyMembers: [
          {
            memberId: 'fm-005',
            memberName: 'Dmitri Volkov',
            relationship: 'Spouse',
            travelPreferences: ['Luxury', 'Cultural'],
            investmentStyle: 'Aggressive',
            lifestyleValues: ['Status', 'Achievement', 'Legacy'],
            philanthropicInterests: ['Sports', 'Youth Programs'],
            lastUpdated: '2026-01-28T10:00:00Z',
          },
          {
            memberId: 'fm-006',
            memberName: 'Natasha Volkov',
            relationship: 'Child',
            travelPreferences: ['Adventure', 'Wellness'],
            investmentStyle: 'Moderate',
            lifestyleValues: ['Sustainability', 'Mindfulness'],
            philanthropicInterests: ['Environmental Conservation', 'Animal Welfare'],
            lastUpdated: '2026-02-05T10:00:00Z',
          },
        ],
        driftAreas: [
          {
            area: 'Philanthropy',
            currentDriftPercent: 55,
            previousDriftPercent: 50,
            trendDirection: 'diverging',
          },
          {
            area: 'Lifestyle Values',
            currentDriftPercent: 42,
            previousDriftPercent: 38,
            trendDirection: 'diverging',
          },
          {
            area: 'Investment Philosophy',
            currentDriftPercent: 28,
            previousDriftPercent: 30,
            trendDirection: 'converging',
          },
        ],
        alerts: [
          {
            id: 'da-003',
            severity: 'Moderate',
            message: 'Daughter\'s sustainability values increasingly diverge from family\'s traditional lifestyle approach',
            area: 'Lifestyle Values',
            triggeredAt: '2026-02-05T11:00:00Z',
            acknowledged: false,
          },
        ],
        recommendations: [
          'Initiate intergenerational dialogue session focusing on shared values',
          'Explore ESG-focused investment allocation to bridge generational preferences',
        ],
        assessedAt: '2026-02-12T10:00:00Z',
        nextReviewDate: '2026-04-12T10:00:00Z',
      },
    ];

    const predictiveAlerts: PredictiveAlert[] = [
      {
        id: 'pa-001',
        clientId: 'user-uhni-003',
        clientName: 'Isabella von Habsburg',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'travel_fatigue',
        severity: 'critical',
        title: 'Travel Burnout Imminent',
        message: 'Isabella has crossed 47 time zones in 90 days. Cognitive fatigue markers suggest scheduling an immediate restorative period.',
        confidence: 'High',
        actionRequired: true,
        acknowledged: false,
        createdAt: '2026-02-18T09:00:00Z',
      },
      {
        id: 'pa-002',
        clientId: 'user-uhni-002',
        clientName: 'Marcus Pemberton-Shaw',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'travel_fatigue',
        severity: 'warning',
        title: 'Elevated Travel Frequency',
        message: 'Marcus has 5 trips scheduled in the next 30 days across 4 continents. Consider consolidating itinerary.',
        confidence: 'High',
        actionRequired: true,
        acknowledged: false,
        createdAt: '2026-02-17T14:00:00Z',
      },
      {
        id: 'pa-003',
        clientId: 'user-uhni-002',
        clientName: 'Marcus Pemberton-Shaw',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'family_drift',
        severity: 'critical',
        title: 'Critical Family Alignment Drift',
        message: 'Investment philosophy divergence between Marcus Sr. and heir Oliver has reached 78%. Recommend facilitated alignment session.',
        confidence: 'High',
        actionRequired: true,
        acknowledged: false,
        createdAt: '2026-02-15T10:00:00Z',
      },
      {
        id: 'pa-004',
        clientId: 'user-uhni-005',
        clientName: 'Elena Volkov',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'family_drift',
        severity: 'warning',
        title: 'Generational Value Divergence',
        message: 'Natasha Volkov\'s sustainability-focused lifestyle values are increasingly diverging from family norms. Proactive dialogue recommended.',
        confidence: 'Medium',
        actionRequired: false,
        acknowledged: false,
        createdAt: '2026-02-14T16:00:00Z',
      },
      {
        id: 'pa-005',
        clientId: 'user-uhni-005',
        clientName: 'Elena Volkov',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'travel_fatigue',
        severity: 'info',
        title: 'Travel Fatigue Approaching Threshold',
        message: 'Current fatigue score of 55 is approaching the elevated threshold. Monitor upcoming travel plans.',
        confidence: 'Medium',
        actionRequired: false,
        acknowledged: true,
        createdAt: '2026-02-12T08:00:00Z',
      },
      {
        id: 'pa-006',
        clientId: 'user-uhni-004',
        clientName: 'Raj Mehta',
        institutionId: MOCK_INSTITUTION_ID,
        type: 'travel_fatigue',
        severity: 'info',
        title: 'Improved Travel Balance',
        message: 'Raj\'s travel fatigue score has decreased from 38 to 18 over the past quarter. Sustainable travel pattern confirmed.',
        confidence: 'High',
        actionRequired: false,
        acknowledged: true,
        createdAt: '2026-02-10T12:00:00Z',
      },
    ];

    const travelSegments: TravelSegment[] = [
      { id: 'seg-001', clientId: 'user-uhni-003', origin: 'London (LHR)', destination: 'Monaco (MCM)', departureDate: '2026-01-05', returnDate: '2026-01-08', timezonesCrossed: 1, tripDurationDays: 3, purpose: 'Leisure' },
      { id: 'seg-002', clientId: 'user-uhni-003', origin: 'Monaco (MCM)', destination: 'Dubai (DXB)', departureDate: '2026-01-10', returnDate: '2026-01-14', timezonesCrossed: 3, tripDurationDays: 4, purpose: 'Business' },
      { id: 'seg-003', clientId: 'user-uhni-003', origin: 'Dubai (DXB)', destination: 'Singapore (SIN)', departureDate: '2026-01-16', returnDate: '2026-01-20', timezonesCrossed: 4, tripDurationDays: 4, purpose: 'Philanthropy' },
      { id: 'seg-004', clientId: 'user-uhni-003', origin: 'Singapore (SIN)', destination: 'Tokyo (NRT)', departureDate: '2026-01-22', returnDate: '2026-01-26', timezonesCrossed: 1, tripDurationDays: 4, purpose: 'Leisure' },
      { id: 'seg-005', clientId: 'user-uhni-003', origin: 'Tokyo (NRT)', destination: 'London (LHR)', departureDate: '2026-01-28', returnDate: '2026-01-29', timezonesCrossed: 9, tripDurationDays: 1, purpose: 'Business' },
      { id: 'seg-006', clientId: 'user-uhni-002', origin: 'London (LHR)', destination: 'New York (JFK)', departureDate: '2026-01-15', returnDate: '2026-01-19', timezonesCrossed: 5, tripDurationDays: 4, purpose: 'Business' },
      { id: 'seg-007', clientId: 'user-uhni-002', origin: 'New York (JFK)', destination: 'Geneva (GVA)', departureDate: '2026-01-22', returnDate: '2026-01-25', timezonesCrossed: 6, tripDurationDays: 3, purpose: 'Business' },
      { id: 'seg-008', clientId: 'user-uhni-002', origin: 'Geneva (GVA)', destination: 'Dubai (DXB)', departureDate: '2026-01-28', returnDate: '2026-02-01', timezonesCrossed: 3, tripDurationDays: 4, purpose: 'Business' },
      { id: 'seg-009', clientId: 'user-uhni-002', origin: 'Dubai (DXB)', destination: 'Hong Kong (HKG)', departureDate: '2026-02-04', returnDate: '2026-02-08', timezonesCrossed: 4, tripDurationDays: 4, purpose: 'Business' },
      { id: 'seg-010', clientId: 'user-uhni-002', origin: 'Hong Kong (HKG)', destination: 'London (LHR)', departureDate: '2026-02-10', returnDate: '2026-02-11', timezonesCrossed: 8, tripDurationDays: 1, purpose: 'Family' },
      { id: 'seg-011', clientId: 'user-uhni-001', origin: 'London (LHR)', destination: 'Zurich (ZRH)', departureDate: '2026-02-01', returnDate: '2026-02-04', timezonesCrossed: 1, tripDurationDays: 3, purpose: 'Business' },
      { id: 'seg-012', clientId: 'user-uhni-001', origin: 'Zurich (ZRH)', destination: 'London (LHR)', departureDate: '2026-02-10', returnDate: '2026-02-11', timezonesCrossed: 1, tripDurationDays: 1, purpose: 'Business' },
      { id: 'seg-013', clientId: 'user-uhni-005', origin: 'Moscow (SVO)', destination: 'Paris (CDG)', departureDate: '2026-01-20', returnDate: '2026-01-25', timezonesCrossed: 2, tripDurationDays: 5, purpose: 'Leisure' },
      { id: 'seg-014', clientId: 'user-uhni-005', origin: 'Paris (CDG)', destination: 'New York (JFK)', departureDate: '2026-01-28', returnDate: '2026-02-02', timezonesCrossed: 6, tripDurationDays: 5, purpose: 'Business' },
      { id: 'seg-015', clientId: 'user-uhni-005', origin: 'New York (JFK)', destination: 'London (LHR)', departureDate: '2026-02-06', returnDate: '2026-02-09', timezonesCrossed: 5, tripDurationDays: 3, purpose: 'Business' },
      { id: 'seg-016', clientId: 'user-uhni-004', origin: 'Mumbai (BOM)', destination: 'London (LHR)', departureDate: '2026-01-18', returnDate: '2026-01-24', timezonesCrossed: 5, tripDurationDays: 6, purpose: 'Business' },
    ];

    this.setInStorage(FATIGUE_KEY, fatigueAssessments);
    this.setInStorage(ALIGNMENT_KEY, alignmentAssessments);
    this.setInStorage(ALERTS_KEY, predictiveAlerts);
    this.setInStorage(SEGMENTS_KEY, travelSegments);
  }

  async getTravelFatigueAssessments(institutionId: string): Promise<TravelFatigueAssessment[]> {
    await this.delay();
    return this.getFromStorage<TravelFatigueAssessment>(FATIGUE_KEY)
      .filter(a => a.institutionId === institutionId);
  }

  async getTravelFatigueByClient(clientId: string): Promise<TravelFatigueAssessment | null> {
    await this.delay();
    return this.getFromStorage<TravelFatigueAssessment>(FATIGUE_KEY)
      .find(a => a.clientId === clientId) || null;
  }

  async getTravelSegments(clientId: string): Promise<TravelSegment[]> {
    await this.delay();
    return this.getFromStorage<TravelSegment>(SEGMENTS_KEY)
      .filter(s => s.clientId === clientId);
  }

  async getFamilyAlignmentAssessments(institutionId: string): Promise<FamilyAlignmentAssessment[]> {
    await this.delay();
    return this.getFromStorage<FamilyAlignmentAssessment>(ALIGNMENT_KEY)
      .filter(a => a.institutionId === institutionId);
  }

  async getFamilyAlignmentByClient(clientId: string): Promise<FamilyAlignmentAssessment | null> {
    await this.delay();
    return this.getFromStorage<FamilyAlignmentAssessment>(ALIGNMENT_KEY)
      .find(a => a.clientId === clientId) || null;
  }

  async getPredictiveAlerts(institutionId: string): Promise<PredictiveAlert[]> {
    await this.delay();
    return this.getFromStorage<PredictiveAlert>(ALERTS_KEY)
      .filter(a => a.institutionId === institutionId);
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await this.delay();
    const alerts = this.getFromStorage<PredictiveAlert>(ALERTS_KEY);
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.setInStorage(ALERTS_KEY, alerts);
    }
  }
}
