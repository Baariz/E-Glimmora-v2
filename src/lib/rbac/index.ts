/**
 * RBAC Module - Barrel Export
 * Complete role-based access control system
 */

// Permission system
export { hasPermission, getPermissionMatrix } from './permissions';

// Permission hooks
export { usePermission, useCan } from './usePermission';

// Permission gate component
export { RequirePermission } from './RequirePermission';

// Data access filters
export {
  filterJourneysByAccess,
  filterMemoriesByAccess,
  filterByPermission
} from './filters';
