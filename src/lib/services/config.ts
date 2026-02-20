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

import { MockJourneyService } from './mock/journey.mock';
import { MockMemoryService } from './mock/memory.mock';
import { MockMessageService } from './mock/message.mock';
import { MockIntentService } from './mock/intent.mock';
import { MockUserService } from './mock/user.mock';
import { MockInstitutionService } from './mock/institution.mock';
import { MockInviteCodeService } from './mock/invite-code.mock';
import { MockDeviceService } from './mock/device.mock';
import { MockClientService } from './mock/client.mock';
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
 * Provides access to all services through a single object
 */
export const services = {
  journey: USE_MOCK_SERVICES
    ? new MockJourneyService()
    : null, // TODO: Implement real API service

  memory: USE_MOCK_SERVICES
    ? new MockMemoryService()
    : null, // TODO: Implement real API service

  message: USE_MOCK_SERVICES
    ? new MockMessageService()
    : null, // TODO: Implement real API service

  intent: USE_MOCK_SERVICES
    ? new MockIntentService()
    : null, // TODO: Implement real API service

  user: USE_MOCK_SERVICES
    ? new MockUserService()
    : null, // TODO: Implement real API service

  institution: USE_MOCK_SERVICES
    ? new MockInstitutionService()
    : null, // TODO: Implement real API service

  inviteCode: USE_MOCK_SERVICES
    ? new MockInviteCodeService()
    : null, // TODO: Implement real API service

  device: USE_MOCK_SERVICES
    ? new MockDeviceService()
    : null, // TODO: Implement real API service

  client: USE_MOCK_SERVICES
    ? new MockClientService()
    : null, // TODO: Implement real API service

  risk: USE_MOCK_SERVICES
    ? new MockRiskService()
    : null, // TODO: Implement real API service

  contract: USE_MOCK_SERVICES
    ? new MockContractService()
    : null, // TODO: Implement real API service

  audit: USE_MOCK_SERVICES
    ? new MockAuditService()
    : null, // TODO: Implement real API service

  systemHealth: USE_MOCK_SERVICES
    ? new MockSystemHealthService()
    : null, // TODO: Implement real API service

  predictive: USE_MOCK_SERVICES
    ? new MockPredictiveService()
    : null, // TODO: Implement real API service

  crisis: USE_MOCK_SERVICES
    ? new MockCrisisService()
    : null, // TODO: Implement real API service

  vendor: USE_MOCK_SERVICES
    ? new MockVendorService()
    : null, // TODO: Implement real API service

  conflict: USE_MOCK_SERVICES
    ? new MockConflictService()
    : null, // TODO: Implement real API service

  integration: USE_MOCK_SERVICES
    ? new MockIntegrationService()
    : null // TODO: Implement real API service
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
};

/**
 * Utility to check if we're using mock services
 */
export const isMockMode = (): boolean => USE_MOCK_SERVICES;
