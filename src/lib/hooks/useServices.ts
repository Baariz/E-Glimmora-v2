'use client';

/**
 * Service Access Hook
 * Instantiates mock services for use in client components.
 * When real APIs arrive, only this hook needs to change.
 */

import { useMemo } from 'react';
import { MockIntentService } from '@/lib/services/mock/intent.mock';
import { MockJourneyService } from '@/lib/services/mock/journey.mock';
import { MockMemoryService } from '@/lib/services/mock/memory.mock';
import { MockMessageService } from '@/lib/services/mock/message.mock';
import { MockPrivacyService } from '@/lib/services/mock/privacy.mock';
import { MockUserService } from '@/lib/services/mock/user.mock';
import { MockInviteCodeService } from '@/lib/services/mock/invite-code.mock';
import { MockClientService } from '@/lib/services/mock/client.mock';
import { MockRiskService } from '@/lib/services/mock/risk.mock';
import { MockContractService } from '@/lib/services/mock/contract.mock';
import { MockInstitutionService } from '@/lib/services/mock/institution.mock';
import { MockAuditService } from '@/lib/services/mock/audit.mock';
import { MockSystemHealthService } from '@/lib/services/mock/system-health.mock';
import { MockPredictiveService } from '@/lib/services/mock/predictive.mock';
import { MockCrisisService } from '@/lib/services/mock/crisis.mock';
import { MockVendorService } from '@/lib/services/mock/vendor.mock';
import { MockConflictService } from '@/lib/services/mock/conflict.mock';
import { MockIntegrationService } from '@/lib/services/mock/integration.mock';

export function useServices() {
  return useMemo(
    () => ({
      intent: new MockIntentService(),
      journey: new MockJourneyService(),
      memory: new MockMemoryService(),
      message: new MockMessageService(),
      privacy: new MockPrivacyService(),
      user: new MockUserService(),
      inviteCode: new MockInviteCodeService(),
      client: new MockClientService(),
      risk: new MockRiskService(),
      contract: new MockContractService(),
      institution: new MockInstitutionService(),
      audit: new MockAuditService(),
      systemHealth: new MockSystemHealthService(),
      predictive: new MockPredictiveService(),
      crisis: new MockCrisisService(),
      vendor: new MockVendorService(),
      conflict: new MockConflictService(),
      integration: new MockIntegrationService(),
    }),
    []
  );
}
