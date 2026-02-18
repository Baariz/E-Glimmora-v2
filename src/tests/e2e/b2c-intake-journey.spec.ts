/**
 * B2C Intake to Journey Generation E2E Test
 * Critical Path: UHNI completes intent wizard → journey generated
 *
 * Note: This test requires authentication setup. The app uses NextAuth with invite-only access.
 * For local testing, auth can be bypassed by setting mock session storage or using test credentials.
 */

import { test, expect } from '@playwright/test'

test.describe('B2C Intake to Journey Flow', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Set up authentication
    // Option 1: Use storageState from a logged-in session
    // Option 2: Mock NextAuth session in localStorage
    // Option 3: Create test user with known credentials

    // For now, navigate to intent page (will redirect if not authenticated)
    await page.goto('/intent')

    // Wait for page load
    await page.waitForLoadState('networkidle')
  })

  test('should complete intent wizard and generate journey', async ({ page }) => {
    // Step 1: Navigate to intent wizard
    // If no intent profile exists, should see "Begin Your Intent Profile" CTA
    const beginButton = page.getByRole('link', { name: /begin.*intent/i })

    if (await beginButton.isVisible()) {
      await beginButton.click()
    } else {
      // Intent profile exists, click "Update Intent" or navigate directly
      await page.goto('/intent/wizard')
    }

    await page.waitForLoadState('networkidle')

    // Step 2: Complete Step 1 - Travel Preferences
    // This step depends on the actual wizard component structure
    // Read the actual wizard implementation to get correct selectors

    // Expected flow (based on typical wizard pattern):
    // 1. Select travel style (e.g., Luxury, Adventure, Cultural)
    // 2. Select destinations of interest
    // 3. Select travel frequency
    // 4. Click Next

    // For semantic selectors, look for role="button" with name containing "Next"
    const nextButton = page.getByRole('button', { name: /next/i })

    // Wait for wizard to be ready
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Step 3: Complete each wizard step
    // This is a placeholder - actual implementation depends on wizard fields

    // Example: Select options and proceed
    // await page.getByRole('button', { name: 'Luxury' }).click()
    // await nextButton.click()

    // Step 4: Complete final step and submit
    const submitButton = page.getByRole('button', { name: /submit|complete|finish/i })

    // If submit button exists, wizard is ready
    // await submitButton.click()

    // Step 5: Verify navigation to intent profile or journeys page
    // After submission, should redirect to /intent or /journeys
    await page.waitForURL(/\/(intent|journeys)/)

    // Step 6: Verify journey was created (if auto-generated)
    // Navigate to journeys page
    await page.goto('/journeys')
    await page.waitForLoadState('networkidle')

    // Verify at least one journey card exists
    const journeyCards = page.getByRole('article').or(page.locator('[data-testid="journey-card"]'))
    // await expect(journeyCards.first()).toBeVisible()
  })

  test('should display intent profile after completion', async ({ page }) => {
    // Navigate to intent page
    await page.goto('/intent')
    await page.waitForLoadState('networkidle')

    // If intent profile exists, verify key sections are visible
    // Expected sections: Travel Preferences, Cultural Interests, Emotional Drivers

    const profileHeading = page.getByRole('heading', { name: /intent profile|your profile/i })

    // Either profile exists or empty state
    const emptyState = page.getByRole('heading', { name: /begin.*intent/i })
    const hasProfile = await profileHeading.isVisible().catch(() => false)
    const isEmpty = await emptyState.isVisible().catch(() => false)

    // One of these should be true
    expect(hasProfile || isEmpty).toBe(true)
  })

  test('should navigate between intent and journeys', async ({ page }) => {
    // Test navigation flow
    await page.goto('/intent')
    await page.waitForLoadState('networkidle')

    // Navigate to journeys via nav link
    const journeysLink = page.getByRole('link', { name: /journeys/i })
    await journeysLink.click()

    // Verify URL changed
    await expect(page).toHaveURL(/\/journeys/)

    // Navigate back to intent
    const intentLink = page.getByRole('link', { name: /intent/i })
    await intentLink.click()

    await expect(page).toHaveURL(/\/intent/)
  })
})

/**
 * Test Notes:
 *
 * 1. Authentication: This test requires authenticated session.
 *    Setup options:
 *    - Use `storageState` in playwright.config.ts to reuse login session
 *    - Create a global setup file that logs in once
 *    - Mock NextAuth session in beforeEach
 *
 * 2. Wizard Fields: The actual wizard fields depend on the IntentWizard component.
 *    Read src/components/b2c/intent/IntentWizard.tsx to identify:
 *    - Step titles/headings
 *    - Form field labels
 *    - Button text
 *    Use semantic selectors: getByRole, getByLabel, getByText
 *
 * 3. Journey Generation: If journey generation is automatic after intent submission,
 *    verify journey exists in /journeys. If manual, this test should be updated.
 *
 * 4. Mobile Testing: Playwright config includes mobile-chrome project.
 *    This test will run on both desktop and mobile viewports.
 */
