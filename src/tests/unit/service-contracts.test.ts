/**
 * Service Contract Unit Tests
 * Verify mock service implementations fulfill interface contracts
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { MockMemoryService } from '@/lib/services/mock/memory.mock'
import { MockJourneyService } from '@/lib/services/mock/journey.mock'
import { CreateMemoryInput, CreateJourneyInput } from '@/lib/types'

const TEST_USER_ID = 'test-user-123'

describe('MockMemoryService', () => {
  let service: MockMemoryService

  beforeEach(() => {
    service = new MockMemoryService()
  })

  it('createMemory returns a MemoryItem with generated id and timestamps', async () => {
    const input: CreateMemoryInput = {
      userId: TEST_USER_ID,
      type: 'photo',
      title: 'Test Memory',
      description: 'Test Description',
    }

    const memory = await service.createMemory(input)

    expect(memory.id).toBeDefined()
    expect(memory.userId).toBe(TEST_USER_ID)
    expect(memory.type).toBe('photo')
    expect(memory.title).toBe('Test Memory')
    expect(memory.description).toBe('Test Description')
    expect(memory.emotionalTags).toEqual([])
    expect(memory.linkedJourneys).toEqual([])
    expect(memory.sharingPermissions).toEqual([])
    expect(memory.isLocked).toBe(false)
    expect(memory.isMilestone).toBe(false)
    // Dates are stored as Date objects initially, but become strings after localStorage round-trip
    expect(memory.createdAt).toBeDefined()
    expect(memory.updatedAt).toBeDefined()
  })

  it('getMemories returns memories filtered by userId', async () => {
    // Create memories for two different users
    await service.createMemory({
      userId: 'user-1',
      type: 'photo',
      title: 'User 1 Memory',
      description: 'Description',
    })
    await service.createMemory({
      userId: 'user-2',
      type: 'video',
      title: 'User 2 Memory',
      description: 'Description',
    })
    await service.createMemory({
      userId: 'user-1',
      type: 'document',
      title: 'User 1 Memory 2',
      description: 'Description',
    })

    const user1Memories = await service.getMemories('user-1')
    const user2Memories = await service.getMemories('user-2')

    expect(user1Memories).toHaveLength(2)
    expect(user2Memories).toHaveLength(1)
    expect(user1Memories.every(m => m.userId === 'user-1')).toBe(true)
    expect(user2Memories.every(m => m.userId === 'user-2')).toBe(true)
  })

  it('getMemoryById returns the correct memory or null', async () => {
    const created = await service.createMemory({
      userId: TEST_USER_ID,
      type: 'photo',
      title: 'Test Memory',
      description: 'Description',
    })

    const found = await service.getMemoryById(created.id)
    const notFound = await service.getMemoryById('non-existent-id')

    expect(found).toBeDefined()
    expect(found?.id).toBe(created.id)
    expect(found?.title).toBe('Test Memory')
    expect(notFound).toBeNull()
  })

  it('updateMemory modifies the memory and returns updated version', async () => {
    const created = await service.createMemory({
      userId: TEST_USER_ID,
      type: 'photo',
      title: 'Original Title',
      description: 'Original Description',
    })

    const updated = await service.updateMemory(created.id, {
      title: 'Updated Title',
      isLocked: true,
    })

    expect(updated.id).toBe(created.id)
    expect(updated.title).toBe('Updated Title')
    expect(updated.description).toBe('Original Description') // Unchanged
    expect(updated.isLocked).toBe(true)
    // updatedAt should be modified (dates may be strings after localStorage)
    expect(updated.updatedAt).toBeDefined()
    expect(updated.updatedAt).not.toBe(created.updatedAt)
  })

  it('deleteMemory removes the memory and returns true', async () => {
    const created = await service.createMemory({
      userId: TEST_USER_ID,
      type: 'photo',
      title: 'To Delete',
      description: 'Description',
    })

    const deleteResult = await service.deleteMemory(created.id)
    const found = await service.getMemoryById(created.id)

    expect(deleteResult).toBe(true)
    expect(found).toBeNull()
  })

  it('deleteMemory returns false if memory not found', async () => {
    const deleteResult = await service.deleteMemory('non-existent-id')
    expect(deleteResult).toBe(false)
  })

  it('lockMemory sets isLocked to true and adds unlockCondition', async () => {
    const created = await service.createMemory({
      userId: TEST_USER_ID,
      type: 'photo',
      title: 'To Lock',
      description: 'Description',
    })

    const locked = await service.lockMemory(created.id, 'Upon my passing')

    expect(locked.id).toBe(created.id)
    expect(locked.isLocked).toBe(true)
    expect(locked.unlockCondition).toBe('Upon my passing')
  })

  it('data persists across calls (localStorage)', async () => {
    const created = await service.createMemory({
      userId: TEST_USER_ID,
      type: 'photo',
      title: 'Persistent Memory',
      description: 'Description',
    })

    // Create new service instance to simulate page reload
    const newServiceInstance = new MockMemoryService()
    const retrieved = await newServiceInstance.getMemoryById(created.id)

    expect(retrieved).toBeDefined()
    expect(retrieved?.id).toBe(created.id)
    expect(retrieved?.title).toBe('Persistent Memory')
  })
})

describe('MockJourneyService', () => {
  let service: MockJourneyService

  beforeEach(() => {
    service = new MockJourneyService()
  })

  it('createJourney returns a Journey with generated id and initial version', async () => {
    const input: CreateJourneyInput = {
      userId: TEST_USER_ID,
      title: 'Test Journey',
      narrative: 'Test Narrative',
      category: 'Travel',
    }

    const journey = await service.createJourney(input)

    expect(journey.id).toBeDefined()
    expect(journey.userId).toBe(TEST_USER_ID)
    expect(journey.title).toBe('Test Journey')
    expect(journey.narrative).toBe('Test Narrative')
    expect(journey.category).toBe('Travel')
    expect(journey.status).toBe('DRAFT') // JourneyStatus enum uses SCREAMING_CASE
    expect(journey.versions).toHaveLength(1)
    expect(journey.versions[0]!.versionNumber).toBe(1)
    expect(journey.currentVersionId).toBe(journey.versions[0]!.id)
    expect(journey.isInvisible).toBe(false)
    // Dates are defined but may be strings after localStorage
    expect(journey.createdAt).toBeDefined()
    expect(journey.updatedAt).toBeDefined()
  })

  it('getJourneys returns journeys filtered by userId', async () => {
    await service.createJourney({
      userId: 'user-1',
      title: 'User 1 Journey',
      narrative: 'Narrative',
      category: 'Travel',
    })
    await service.createJourney({
      userId: 'user-2',
      title: 'User 2 Journey',
      narrative: 'Narrative',
      category: 'Business',
    })
    await service.createJourney({
      userId: 'user-1',
      title: 'User 1 Journey 2',
      narrative: 'Narrative',
      category: 'Family',
    })

    const user1Journeys = await service.getJourneys('user-1', 'b2c')
    const user2Journeys = await service.getJourneys('user-2', 'b2c')

    expect(user1Journeys).toHaveLength(2)
    expect(user2Journeys).toHaveLength(1)
    expect(user1Journeys.every(j => j.userId === 'user-1')).toBe(true)
    expect(user2Journeys.every(j => j.userId === 'user-2')).toBe(true)
  })

  it('getJourneyById returns correct journey or null', async () => {
    const created = await service.createJourney({
      userId: TEST_USER_ID,
      title: 'Test Journey',
      narrative: 'Narrative',
      category: 'Travel',
    })

    const found = await service.getJourneyById(created.id)
    const notFound = await service.getJourneyById('non-existent-id')

    expect(found).toBeDefined()
    expect(found?.id).toBe(created.id)
    expect(found?.title).toBe('Test Journey')
    expect(notFound).toBeNull()
  })

  it('updateJourney modifies and returns updated journey', async () => {
    const created = await service.createJourney({
      userId: TEST_USER_ID,
      title: 'Original Title',
      narrative: 'Original Narrative',
      category: 'Travel',
    })

    const updated = await service.updateJourney(created.id, {
      title: 'Updated Title',
      isInvisible: true,
    })

    expect(updated.id).toBe(created.id)
    expect(updated.title).toBe('Updated Title')
    expect(updated.narrative).toBe('Original Narrative') // Unchanged
    expect(updated.isInvisible).toBe(true)
    // updatedAt should be modified
    expect(updated.updatedAt).toBeDefined()
    expect(updated.updatedAt).not.toBe(created.updatedAt)
  })

  it('deleteJourney removes the journey and returns true', async () => {
    const created = await service.createJourney({
      userId: TEST_USER_ID,
      title: 'To Delete',
      narrative: 'Narrative',
      category: 'Business',
    })

    const deleteResult = await service.deleteJourney(created.id)
    const found = await service.getJourneyById(created.id)

    expect(deleteResult).toBe(true)
    expect(found).toBeNull()
  })

  it('deleteJourney returns false if journey not found', async () => {
    const deleteResult = await service.deleteJourney('non-existent-id')
    expect(deleteResult).toBe(false)
  })

  it('createJourneyVersion creates new version and updates current version', async () => {
    const journey = await service.createJourney({
      userId: TEST_USER_ID,
      title: 'Original',
      narrative: 'Original',
      category: 'Travel',
    })

    const newVersion = await service.createJourneyVersion(journey.id, {
      title: 'Version 2',
      narrative: 'Updated Narrative',
      status: 'Approved' as any,
      modifiedBy: TEST_USER_ID,
    })

    expect(newVersion.versionNumber).toBe(2)
    expect(newVersion.title).toBe('Version 2')
    expect(newVersion.journeyId).toBe(journey.id)

    // Verify journey was updated
    const updatedJourney = await service.getJourneyById(journey.id)
    expect(updatedJourney?.versions).toHaveLength(2)
    expect(updatedJourney?.currentVersionId).toBe(newVersion.id)
  })

  it('getJourneyVersions returns all versions for a journey', async () => {
    const journey = await service.createJourney({
      userId: TEST_USER_ID,
      title: 'Journey',
      narrative: 'Narrative',
      category: 'Travel',
    })

    await service.createJourneyVersion(journey.id, {
      title: 'Version 2',
      narrative: 'Narrative 2',
      modifiedBy: TEST_USER_ID,
    })
    await service.createJourneyVersion(journey.id, {
      title: 'Version 3',
      narrative: 'Narrative 3',
      modifiedBy: TEST_USER_ID,
    })

    const versions = await service.getJourneyVersions(journey.id)

    expect(versions).toHaveLength(3)
    expect(versions[0]!.versionNumber).toBe(1)
    expect(versions[1]!.versionNumber).toBe(2)
    expect(versions[2]!.versionNumber).toBe(3)
  })

  it('data persists across calls (localStorage)', async () => {
    const created = await service.createJourney({
      userId: TEST_USER_ID,
      title: 'Persistent Journey',
      narrative: 'Narrative',
      category: 'Travel',
    })

    // Create new service instance to simulate page reload
    const newServiceInstance = new MockJourneyService()
    const retrieved = await newServiceInstance.getJourneyById(created.id)

    expect(retrieved).toBeDefined()
    expect(retrieved?.id).toBe(created.id)
    expect(retrieved?.title).toBe('Persistent Journey')
  })
})
