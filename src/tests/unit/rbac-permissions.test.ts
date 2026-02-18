/**
 * RBAC Permission System Unit Tests
 * Comprehensive coverage for all 11 roles across 3 domains
 */

import { describe, it, expect } from 'vitest'
import { hasPermission } from '@/lib/rbac/permissions'
import { filterJourneysByAccess, filterMemoriesByAccess } from '@/lib/rbac/filters'
import { B2CRole, B2BRole, AdminRole } from '@/lib/types/roles'
import { Permission } from '@/lib/types/permissions'
import { Journey, MemoryItem } from '@/lib/types/entities'

// ============================================================================
// B2C Role Permission Tests (4 roles)
// ============================================================================

describe('B2C Role Permissions', () => {
  describe('UHNI Role', () => {
    it('has READ/WRITE/DELETE/EXPORT on journey', () => {
      expect(hasPermission(B2CRole.UHNI, Permission.READ, 'journey', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.WRITE, 'journey', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.DELETE, 'journey', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.EXPORT, 'journey', 'b2c')).toBe(true)
    })

    it('has READ/WRITE/DELETE/EXPORT on vault', () => {
      expect(hasPermission(B2CRole.UHNI, Permission.READ, 'vault', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.WRITE, 'vault', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.DELETE, 'vault', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.EXPORT, 'vault', 'b2c')).toBe(true)
    })

    it('has READ/WRITE/DELETE/EXPORT on intent', () => {
      expect(hasPermission(B2CRole.UHNI, Permission.READ, 'intent', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.WRITE, 'intent', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.DELETE, 'intent', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.EXPORT, 'intent', 'b2c')).toBe(true)
    })

    it('has READ/WRITE/CONFIGURE on privacy', () => {
      expect(hasPermission(B2CRole.UHNI, Permission.READ, 'privacy', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.WRITE, 'privacy', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.CONFIGURE, 'privacy', 'b2c')).toBe(true)
    })

    it('has READ/WRITE/DELETE on message', () => {
      expect(hasPermission(B2CRole.UHNI, Permission.READ, 'message', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.WRITE, 'message', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.UHNI, Permission.DELETE, 'message', 'b2c')).toBe(true)
    })
  })

  describe('Spouse Role', () => {
    it('has READ on journey but NOT WRITE/DELETE', () => {
      expect(hasPermission(B2CRole.Spouse, Permission.READ, 'journey', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.Spouse, Permission.WRITE, 'journey', 'b2c')).toBe(false)
      expect(hasPermission(B2CRole.Spouse, Permission.DELETE, 'journey', 'b2c')).toBe(false)
    })

    it('has READ on vault but NOT WRITE', () => {
      expect(hasPermission(B2CRole.Spouse, Permission.READ, 'vault', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.Spouse, Permission.WRITE, 'vault', 'b2c')).toBe(false)
    })

    it('does NOT have permissions on privacy or intent', () => {
      expect(hasPermission(B2CRole.Spouse, Permission.READ, 'privacy', 'b2c')).toBe(false)
      expect(hasPermission(B2CRole.Spouse, Permission.READ, 'intent', 'b2c')).toBe(false)
    })
  })

  describe('LegacyHeir Role', () => {
    it('has READ on journey and vault only', () => {
      expect(hasPermission(B2CRole.LegacyHeir, Permission.READ, 'journey', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.LegacyHeir, Permission.READ, 'vault', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.LegacyHeir, Permission.WRITE, 'journey', 'b2c')).toBe(false)
      expect(hasPermission(B2CRole.LegacyHeir, Permission.WRITE, 'vault', 'b2c')).toBe(false)
    })

    it('does NOT have permissions on any other resources', () => {
      expect(hasPermission(B2CRole.LegacyHeir, Permission.READ, 'intent', 'b2c')).toBe(false)
      expect(hasPermission(B2CRole.LegacyHeir, Permission.READ, 'privacy', 'b2c')).toBe(false)
      expect(hasPermission(B2CRole.LegacyHeir, Permission.READ, 'message', 'b2c')).toBe(false)
    })
  })

  describe('ElanAdvisor Role', () => {
    it('has READ on journey and intent', () => {
      expect(hasPermission(B2CRole.ElanAdvisor, Permission.READ, 'journey', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.ElanAdvisor, Permission.READ, 'intent', 'b2c')).toBe(true)
    })

    it('has READ/WRITE on message but NOT WRITE on journey', () => {
      expect(hasPermission(B2CRole.ElanAdvisor, Permission.READ, 'message', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.ElanAdvisor, Permission.WRITE, 'message', 'b2c')).toBe(true)
      expect(hasPermission(B2CRole.ElanAdvisor, Permission.WRITE, 'journey', 'b2c')).toBe(false)
    })

    it('does NOT have vault or privacy access', () => {
      expect(hasPermission(B2CRole.ElanAdvisor, Permission.READ, 'vault', 'b2c')).toBe(false)
      expect(hasPermission(B2CRole.ElanAdvisor, Permission.READ, 'privacy', 'b2c')).toBe(false)
    })
  })
})

// ============================================================================
// B2B Role Permission Tests (6 roles)
// ============================================================================

describe('B2B Role Permissions', () => {
  describe('RelationshipManager Role', () => {
    it('has READ/WRITE/ASSIGN on client', () => {
      expect(hasPermission(B2BRole.RelationshipManager, Permission.READ, 'client', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.RelationshipManager, Permission.WRITE, 'client', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.RelationshipManager, Permission.ASSIGN, 'client', 'b2b')).toBe(true)
    })

    it('has READ/WRITE on journey and risk', () => {
      expect(hasPermission(B2BRole.RelationshipManager, Permission.READ, 'journey', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.RelationshipManager, Permission.WRITE, 'journey', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.RelationshipManager, Permission.READ, 'risk', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.RelationshipManager, Permission.WRITE, 'risk', 'b2b')).toBe(true)
    })

    it('does NOT have APPROVE on journey', () => {
      expect(hasPermission(B2BRole.RelationshipManager, Permission.APPROVE, 'journey', 'b2b')).toBe(false)
    })

    it('has READ on vault and audit', () => {
      expect(hasPermission(B2BRole.RelationshipManager, Permission.READ, 'vault', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.RelationshipManager, Permission.READ, 'audit', 'b2b')).toBe(true)
    })
  })

  describe('PrivateBanker Role', () => {
    it('has READ on client, journey, risk, audit, revenue', () => {
      expect(hasPermission(B2BRole.PrivateBanker, Permission.READ, 'client', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.PrivateBanker, Permission.READ, 'journey', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.PrivateBanker, Permission.READ, 'risk', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.PrivateBanker, Permission.READ, 'audit', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.PrivateBanker, Permission.READ, 'revenue', 'b2b')).toBe(true)
    })

    it('does NOT have WRITE on client or journey', () => {
      expect(hasPermission(B2BRole.PrivateBanker, Permission.WRITE, 'client', 'b2b')).toBe(false)
      expect(hasPermission(B2BRole.PrivateBanker, Permission.WRITE, 'journey', 'b2b')).toBe(false)
    })
  })

  describe('FamilyOfficeDirector Role', () => {
    it('has CONFIGURE on institution', () => {
      expect(hasPermission(B2BRole.FamilyOfficeDirector, Permission.CONFIGURE, 'institution', 'b2b')).toBe(true)
    })

    it('has READ on client, journey, risk, audit, revenue', () => {
      expect(hasPermission(B2BRole.FamilyOfficeDirector, Permission.READ, 'client', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.FamilyOfficeDirector, Permission.READ, 'journey', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.FamilyOfficeDirector, Permission.READ, 'risk', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.FamilyOfficeDirector, Permission.READ, 'audit', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.FamilyOfficeDirector, Permission.READ, 'revenue', 'b2b')).toBe(true)
    })
  })

  describe('ComplianceOfficer Role', () => {
    it('has READ/APPROVE on journey', () => {
      expect(hasPermission(B2BRole.ComplianceOfficer, Permission.READ, 'journey', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.ComplianceOfficer, Permission.APPROVE, 'journey', 'b2b')).toBe(true)
    })

    it('has READ/EXPORT on audit', () => {
      expect(hasPermission(B2BRole.ComplianceOfficer, Permission.READ, 'audit', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.ComplianceOfficer, Permission.EXPORT, 'audit', 'b2b')).toBe(true)
    })

    it('does NOT have WRITE on client', () => {
      expect(hasPermission(B2BRole.ComplianceOfficer, Permission.WRITE, 'client', 'b2b')).toBe(false)
    })
  })

  describe('InstitutionalAdmin Role', () => {
    it('has CONFIGURE on institution and privacy', () => {
      expect(hasPermission(B2BRole.InstitutionalAdmin, Permission.CONFIGURE, 'institution', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.InstitutionalAdmin, Permission.CONFIGURE, 'privacy', 'b2b')).toBe(true)
    })

    it('has READ/WRITE on user and contract', () => {
      expect(hasPermission(B2BRole.InstitutionalAdmin, Permission.READ, 'user', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.InstitutionalAdmin, Permission.WRITE, 'user', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.InstitutionalAdmin, Permission.READ, 'contract', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.InstitutionalAdmin, Permission.WRITE, 'contract', 'b2b')).toBe(true)
    })

    it('has READ on audit', () => {
      expect(hasPermission(B2BRole.InstitutionalAdmin, Permission.READ, 'audit', 'b2b')).toBe(true)
    })
  })

  describe('UHNIPortal Role', () => {
    it('has READ on journey and client only', () => {
      expect(hasPermission(B2BRole.UHNIPortal, Permission.READ, 'journey', 'b2b')).toBe(true)
      expect(hasPermission(B2BRole.UHNIPortal, Permission.READ, 'client', 'b2b')).toBe(true)
    })

    it('does NOT have WRITE on anything', () => {
      expect(hasPermission(B2BRole.UHNIPortal, Permission.WRITE, 'journey', 'b2b')).toBe(false)
      expect(hasPermission(B2BRole.UHNIPortal, Permission.WRITE, 'client', 'b2b')).toBe(false)
      expect(hasPermission(B2BRole.UHNIPortal, Permission.WRITE, 'risk', 'b2b')).toBe(false)
    })
  })
})

// ============================================================================
// Admin Role Permission Tests (1 role)
// ============================================================================

describe('Admin Role Permissions', () => {
  describe('SuperAdmin Role', () => {
    it('has READ/WRITE/DELETE on invite', () => {
      expect(hasPermission(AdminRole.SuperAdmin, Permission.READ, 'invite', 'admin')).toBe(true)
      expect(hasPermission(AdminRole.SuperAdmin, Permission.WRITE, 'invite', 'admin')).toBe(true)
      expect(hasPermission(AdminRole.SuperAdmin, Permission.DELETE, 'invite', 'admin')).toBe(true)
    })

    it('has READ/WRITE/CONFIGURE on institution', () => {
      expect(hasPermission(AdminRole.SuperAdmin, Permission.READ, 'institution', 'admin')).toBe(true)
      expect(hasPermission(AdminRole.SuperAdmin, Permission.WRITE, 'institution', 'admin')).toBe(true)
      expect(hasPermission(AdminRole.SuperAdmin, Permission.CONFIGURE, 'institution', 'admin')).toBe(true)
    })

    it('has READ/CONFIGURE on user', () => {
      expect(hasPermission(AdminRole.SuperAdmin, Permission.READ, 'user', 'admin')).toBe(true)
      expect(hasPermission(AdminRole.SuperAdmin, Permission.CONFIGURE, 'user', 'admin')).toBe(true)
    })

    it('has READ/EXPORT on audit', () => {
      expect(hasPermission(AdminRole.SuperAdmin, Permission.READ, 'audit', 'admin')).toBe(true)
      expect(hasPermission(AdminRole.SuperAdmin, Permission.EXPORT, 'audit', 'admin')).toBe(true)
    })

    it('has READ on revenue and contract', () => {
      expect(hasPermission(AdminRole.SuperAdmin, Permission.READ, 'revenue', 'admin')).toBe(true)
      expect(hasPermission(AdminRole.SuperAdmin, Permission.READ, 'contract', 'admin')).toBe(true)
    })
  })
})

// ============================================================================
// Edge Cases and Context Isolation
// ============================================================================

describe('Edge Cases', () => {
  it('returns false for unknown role', () => {
    expect(hasPermission('UnknownRole' as any, Permission.READ, 'journey', 'b2c')).toBe(false)
  })

  it('returns false for non-existent resource', () => {
    expect(hasPermission(B2CRole.UHNI, Permission.READ, 'non-existent' as any, 'b2c')).toBe(false)
  })

  it('returns false for context mismatch - B2C role in B2B context', () => {
    expect(hasPermission(B2CRole.UHNI, Permission.READ, 'client', 'b2b')).toBe(false)
  })

  it('returns false for context mismatch - B2B role in B2C context', () => {
    expect(hasPermission(B2BRole.RelationshipManager, Permission.READ, 'intent', 'b2c')).toBe(false)
  })

  it('returns false for context mismatch - Admin role in B2C context', () => {
    expect(hasPermission(AdminRole.SuperAdmin, Permission.READ, 'journey', 'b2c')).toBe(false)
  })
})

describe('Dual-Context Users', () => {
  it('UHNI in B2C context has journey WRITE, same user as RM in B2B has client WRITE', () => {
    // B2C context
    expect(hasPermission(B2CRole.UHNI, Permission.WRITE, 'journey', 'b2c')).toBe(true)
    expect(hasPermission(B2CRole.UHNI, Permission.WRITE, 'client', 'b2c')).toBe(false)

    // B2B context (same user, different role)
    expect(hasPermission(B2BRole.RelationshipManager, Permission.WRITE, 'client', 'b2b')).toBe(true)
    expect(hasPermission(B2BRole.RelationshipManager, Permission.WRITE, 'intent', 'b2b')).toBe(false)
  })

  it('contexts are isolated - B2C permissions do not leak into B2B', () => {
    // User has UHNI role in B2C, PrivateBanker in B2B
    // In B2C: UHNI can DELETE journey
    expect(hasPermission(B2CRole.UHNI, Permission.DELETE, 'journey', 'b2c')).toBe(true)

    // In B2B: PrivateBanker cannot DELETE anything
    expect(hasPermission(B2BRole.PrivateBanker, Permission.DELETE, 'journey', 'b2b')).toBe(false)
  })
})

// ============================================================================
// Data Access Filter Tests
// ============================================================================

describe('Journey Access Filters', () => {
  const mockJourneys: Journey[] = [
    {
      id: '1',
      userId: 'user-1',
      title: 'Journey 1',
      narrative: 'Narrative 1',
      category: 'Travel',
      status: 'Draft' as any,
      versions: [],
      currentVersionId: 'v1',
      isInvisible: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'user-1',
      title: 'Journey 2',
      narrative: 'Narrative 2',
      category: 'Business',
      status: 'Draft' as any,
      versions: [],
      currentVersionId: 'v2',
      isInvisible: true, // Invisible journey
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: 'user-2',
      title: 'Journey 3',
      narrative: 'Narrative 3',
      category: 'Family',
      status: 'Draft' as any,
      versions: [],
      currentVersionId: 'v3',
      isInvisible: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('UHNI sees all own journeys', () => {
    const filtered = filterJourneysByAccess(mockJourneys, 'user-1', B2CRole.UHNI, 'b2c')
    expect(filtered).toHaveLength(2)
    expect(filtered.map(j => j.id)).toEqual(['1', '2'])
  })

  it('Spouse does NOT see invisible journeys', () => {
    const filtered = filterJourneysByAccess(mockJourneys, 'user-1', B2CRole.Spouse, 'b2c')
    expect(filtered).toHaveLength(1)
    expect(filtered[0]!.id).toBe('1')
    expect(filtered[0]!.isInvisible).toBe(false)
  })

  it('LegacyHeir does NOT see invisible journeys', () => {
    const filtered = filterJourneysByAccess(mockJourneys, 'user-1', B2CRole.LegacyHeir, 'b2c')
    expect(filtered).toHaveLength(1)
    expect(filtered[0]!.id).toBe('1')
  })
})

describe('Memory Access Filters', () => {
  const mockMemories: MemoryItem[] = [
    {
      id: '1',
      userId: 'user-1',
      type: 'photo',
      title: 'Memory 1',
      description: 'Description 1',
      emotionalTags: [],
      linkedJourneys: [],
      sharingPermissions: ['spouse', 'heir'],
      isLocked: false,
      isMilestone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'user-1',
      type: 'video',
      title: 'Memory 2',
      description: 'Description 2',
      emotionalTags: [],
      linkedJourneys: [],
      sharingPermissions: ['heir'],
      isLocked: true, // Locked memory
      isMilestone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: 'user-1',
      type: 'document',
      title: 'Memory 3',
      description: 'Description 3',
      emotionalTags: [],
      linkedJourneys: [],
      sharingPermissions: [], // Not shared
      isLocked: false,
      isMilestone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('UHNI sees all own memories', () => {
    const filtered = filterMemoriesByAccess(mockMemories, 'user-1', B2CRole.UHNI)
    expect(filtered).toHaveLength(3)
  })

  it('Spouse sees only memories with spouse sharing permission', () => {
    const filtered = filterMemoriesByAccess(mockMemories, 'user-1', B2CRole.Spouse)
    expect(filtered).toHaveLength(1)
    expect(filtered[0]!.id).toBe('1')
    expect(filtered[0]!.sharingPermissions).toContain('spouse')
  })

  it('LegacyHeir sees shared memories that are NOT locked', () => {
    const filtered = filterMemoriesByAccess(mockMemories, 'user-1', B2CRole.LegacyHeir)
    expect(filtered).toHaveLength(1)
    expect(filtered[0]!.id).toBe('1')
    expect(filtered[0]!.isLocked).toBe(false)
  })

  it('B2B roles do not have memory vault access', () => {
    const filtered = filterMemoriesByAccess(mockMemories, 'user-1', B2BRole.RelationshipManager)
    expect(filtered).toHaveLength(0)
  })
})
