/**
 * Permission system for fine-grained access control
 */

export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  EXPORT = 'EXPORT',
  ASSIGN = 'ASSIGN',
  CONFIGURE = 'CONFIGURE'
}

export type Resource =
  | 'journey'
  | 'vault'
  | 'intent'
  | 'privacy'
  | 'client'
  | 'risk'
  | 'audit'
  | 'invite'
  | 'institution'
  | 'message'
  | 'contract'
  | 'revenue'
  | 'user'
  | 'predictive'
  | 'crisis'
  | 'vendor'
  | 'conflict'
  | 'integration'
  | 'hotel'
  | 'package';

export interface PermissionCheck {
  action: Permission;
  resource: Resource;
}
