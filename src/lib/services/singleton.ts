/**
 * Service Singletons
 * Module-level instances shared across the entire app lifecycle.
 * Prevents re-seeding and re-fetching when components remount during navigation.
 */

import { MockIntentService } from './mock/intent.mock';
import { MockJourneyService } from './mock/journey.mock';
import { MockMemoryService } from './mock/memory.mock';
import { MockMessageService } from './mock/message.mock';
import { MockPrivacyService } from './mock/privacy.mock';
import { MockUserService } from './mock/user.mock';
import { MockInviteCodeService } from './mock/invite-code.mock';
import { MockClientService } from './mock/client.mock';
import { MockRiskService } from './mock/risk.mock';
import { MockContractService } from './mock/contract.mock';
import { MockInstitutionService } from './mock/institution.mock';
import { MockAuditService } from './mock/audit.mock';
import { MockSystemHealthService } from './mock/system-health.mock';
import { MockPredictiveService } from './mock/predictive.mock';
import { MockCrisisService } from './mock/crisis.mock';
import { MockVendorService } from './mock/vendor.mock';
import { MockConflictService } from './mock/conflict.mock';
import { MockIntegrationService } from './mock/integration.mock';

// Created once when this module first loads — shared for entire session
export const services = {
  intent:        new MockIntentService(),
  journey:       new MockJourneyService(),
  memory:        new MockMemoryService(),
  message:       new MockMessageService(),
  privacy:       new MockPrivacyService(),
  user:          new MockUserService(),
  inviteCode:    new MockInviteCodeService(),
  client:        new MockClientService(),
  risk:          new MockRiskService(),
  contract:      new MockContractService(),
  institution:   new MockInstitutionService(),
  audit:         new MockAuditService(),
  systemHealth:  new MockSystemHealthService(),
  predictive:    new MockPredictiveService(),
  crisis:        new MockCrisisService(),
  vendor:        new MockVendorService(),
  conflict:      new MockConflictService(),
  integration:   new MockIntegrationService(),
};
