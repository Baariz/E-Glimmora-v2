/**
 * Service Configuration & Registry
 * Selects between mock and real API implementations based on environment
 */

import { IJourneyService } from './interfaces/IJourneyService';
import { IMemoryService } from './interfaces/IMemoryService';
import { IMessageService } from './interfaces/IMessageService';
import { IIntentService } from './interfaces/IIntentService';
import { IUserService } from './interfaces/IUserService';
import { IInstitutionService } from './interfaces/IInstitutionService';
import { IInviteCodeService } from './interfaces/IInviteCodeService';
import { IDeviceService } from './interfaces/IDeviceService';
import { IClientService } from './interfaces/IClientService';
import { IRiskService } from './interfaces/IRiskService';
import { IContractService } from './interfaces/IContractService';
import { IAuditService } from './interfaces/IAuditService';
import { ISystemHealthService } from './interfaces/ISystemHealthService';
import { IPredictiveService } from './interfaces/IPredictiveService';
import { ICrisisService } from './interfaces/ICrisisService';
import { IVendorService } from './interfaces/IVendorService';
import { IConflictService } from './interfaces/IConflictService';
import { IIntegrationService } from './interfaces/IIntegrationService';
import { IPrivacyService } from './interfaces/IPrivacyService';

import { MockJourneyService } from './mock/journey.mock';
import { MockMessageService } from './mock/message.mock';
import { ApiUserService } from './api/user.api';
import { ApiInviteCodeService } from './api/invite-code.api';
import { ApiDeviceService } from './api/device.api';
import { ApiIntentService } from './api/intent.api';
import { ApiJourneyService } from './api/journey.api';
import { ApiMessageService } from './api/message.api';
import { ApiPrivacyService } from './api/privacy.api';
import { ApiMemoryService } from './api/memory.api';
import { ApiInstitutionService } from './api/institution.api';
import { ApiClientService } from './api/client.api';
import { MockRiskService } from './mock/risk.mock';
import { MockContractService } from './mock/contract.mock';
import { MockAuditService } from './mock/audit.mock';
import { MockSystemHealthService } from './mock/system-health.mock';
import { MockPredictiveService } from './mock/predictive.mock';
import { MockCrisisService } from './mock/crisis.mock';
import { MockVendorService } from './mock/vendor.mock';
import { MockConflictService } from './mock/conflict.mock';
import { MockIntegrationService } from './mock/integration.mock';

/**
 * Environment variable to control mock vs real API usage
 * Set NEXT_PUBLIC_USE_MOCK_SERVICES=true to use mock services
 */
const USE_MOCK_SERVICES =
  process.env.NEXT_PUBLIC_USE_MOCK_SERVICES === 'true' ||
  process.env.NODE_ENV === 'development';

/**
 * Service Registry
 * Services with real API implementations always use them.
 * Services without real API implementations fall back to mock.
 */
export const services = {
  // === Real API services (always use real backend) ===
  user: new ApiUserService(),
  inviteCode: new ApiInviteCodeService(),
  device: new ApiDeviceService(),
  intent: new ApiIntentService(),
  journey: new ApiJourneyService(),
  message: new ApiMessageService(),
  privacy: new ApiPrivacyService(),
  memory: new ApiMemoryService(),
  institution: new ApiInstitutionService(),
  client: new ApiClientService(),

  // === Mock-only services (real API not yet implemented) ===
  risk: new MockRiskService(),
  contract: new MockContractService(),
  audit: new MockAuditService(),
  systemHealth: new MockSystemHealthService(),
  predictive: new MockPredictiveService(),
  crisis: new MockCrisisService(),
  vendor: new MockVendorService(),
  conflict: new MockConflictService(),
  integration: new MockIntegrationService(),
} as {
  journey: IJourneyService;
  memory: IMemoryService;
  message: IMessageService;
  intent: IIntentService;
  user: IUserService;
  institution: IInstitutionService;
  inviteCode: IInviteCodeService;
  device: IDeviceService;
  client: IClientService;
  risk: IRiskService;
  contract: IContractService;
  audit: IAuditService;
  systemHealth: ISystemHealthService;
  predictive: IPredictiveService;
  crisis: ICrisisService;
  vendor: IVendorService;
  conflict: IConflictService;
  integration: IIntegrationService;
  privacy: IPrivacyService;
};

/**
 * Utility to check if we're using mock services
 */
export const isMockMode = (): boolean => USE_MOCK_SERVICES;
