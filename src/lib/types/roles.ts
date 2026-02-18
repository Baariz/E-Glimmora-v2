/**
 * Role definitions for E-Glimmora (Elan platform)
 * Supports multi-domain role assignment (B2C, B2B, Admin)
 */

export enum B2CRole {
  UHNI = 'UHNI',
  Spouse = 'Spouse',
  LegacyHeir = 'LegacyHeir',
  ElanAdvisor = 'ElanAdvisor'
}

export enum B2BRole {
  RelationshipManager = 'RelationshipManager',
  PrivateBanker = 'PrivateBanker',
  FamilyOfficeDirector = 'FamilyOfficeDirector',
  ComplianceOfficer = 'ComplianceOfficer',
  InstitutionalAdmin = 'InstitutionalAdmin',
  UHNIPortal = 'UHNIPortal'
}

export enum AdminRole {
  SuperAdmin = 'SuperAdmin'
}

export type Role = B2CRole | B2BRole | AdminRole;

export interface UserRoles {
  b2c?: B2CRole;
  b2b?: B2BRole;
  admin?: AdminRole;
}

export type DomainContext = 'b2c' | 'b2b' | 'admin';
