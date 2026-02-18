/**
 * Visual Regression Tests for Design System
 * Establishes baseline screenshots for critical pages and components
 *
 * IMPORTANT: First run will FAIL because no baseline exists.
 * To create baselines: npx playwright test --update-snapshots --project=chromium src/tests/visual
 * To verify against baselines: npx playwright test --project=chromium src/tests/visual
 */

import { test, expect } from '@playwright/test'

test.describe('Design System Visual Regression', () => {
  // Disable animations for consistent screenshots
  test.use({
    // Disable CSS animations and transitions
    extraHTTPHeaders: {
      'Sec-Fetch-Site': 'same-origin',
    },
  })

  test.beforeEach(async ({ page }) => {
    // Disable animations via CSS
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    })
  })

  test('marketing homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for any lazy-loaded content
    await page.waitForTimeout(1000)

    // Take full-page screenshot
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100, // Allow small differences (fonts, anti-aliasing)
    })
  })

  test('B2C briefing page', async ({ page }) => {
    // TODO: This requires authentication
    // For now, document the expected URL
    await page.goto('/briefing')
    await page.waitForLoadState('networkidle')

    // If redirected to login, skip screenshot
    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('b2c-briefing.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })

  test('B2C intent page (empty state)', async ({ page }) => {
    await page.goto('/intent')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('b2c-intent-empty.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })

  test('B2C journeys page', async ({ page }) => {
    await page.goto('/journeys')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('b2c-journeys.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })

  test('B2B clients page', async ({ page }) => {
    await page.goto('/clients')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('b2b-clients.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })

  test('B2B governance page', async ({ page }) => {
    await page.goto('/governance')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('b2b-governance.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })

  test('Admin dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('admin-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })

  test('Admin invites page', async ({ page }) => {
    await page.goto('/invites')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('admin-invites.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })
})

test.describe('Responsive Design - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE
  })

  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    })
  })

  test('marketing homepage - mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })

  test('B2C journeys page - mobile', async ({ page }) => {
    await page.goto('/journeys')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('b2c-journeys-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })
  })

  test('B2B clients page with mobile sidebar - mobile', async ({ page }) => {
    await page.goto('/clients')
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/api/auth') || currentUrl.includes('/login')) {
      test.skip()
      return
    }

    await page.waitForTimeout(1000)

    // Take screenshot with sidebar closed
    await expect(page).toHaveScreenshot('b2b-clients-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
    })

    // Open mobile sidebar drawer
    const hamburgerButton = page.getByRole('button', { name: /open menu/i })
    if (await hamburgerButton.isVisible().catch(() => false)) {
      await hamburgerButton.click()
      await page.waitForTimeout(500) // Wait for drawer animation

      // Take screenshot with sidebar open
      await expect(page).toHaveScreenshot('b2b-clients-mobile-drawer-open.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixels: 100,
      })
    }
  })
})

test.describe('Design System Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    })
  })

  test('luxury color palette - visual check', async ({ page }) => {
    // Navigate to a page that uses the full color palette
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Take a focused screenshot of the hero section (uses rose/sand/gold colors)
    const heroSection = page.locator('section').first()
    if (await heroSection.isVisible().catch(() => false)) {
      await expect(heroSection).toHaveScreenshot('color-palette-hero.png', {
        animations: 'disabled',
        maxDiffPixels: 50,
      })
    }
  })

  test('typography - serif headings and sans body', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Check that typography is rendering correctly
    // This establishes baseline for font rendering
    const heading = page.getByRole('heading', { level: 1 }).first()
    if (await heading.isVisible().catch(() => false)) {
      await expect(heading).toHaveScreenshot('typography-heading.png', {
        animations: 'disabled',
        maxDiffPixels: 50,
      })
    }
  })
})

/**
 * Visual Regression Workflow:
 *
 * 1. **First-time baseline creation:**
 *    ```
 *    npx playwright test --update-snapshots --project=chromium src/tests/visual
 *    ```
 *    This creates baseline screenshots in src/tests/visual/*.spec.ts-snapshots/
 *
 * 2. **Verify against baselines (CI/local):**
 *    ```
 *    npx playwright test --project=chromium src/tests/visual
 *    ```
 *    This compares current screenshots against baselines and fails if differences exceed threshold.
 *
 * 3. **Update baselines after intentional design changes:**
 *    ```
 *    npx playwright test --update-snapshots --project=chromium src/tests/visual
 *    ```
 *    Commit the new baseline screenshots to git.
 *
 * 4. **Review diff report:**
 *    When tests fail, Playwright generates an HTML report with visual diffs:
 *    ```
 *    npx playwright show-report
 *    ```
 *
 * Configuration:
 * - maxDiffPixels: 100 allows small differences (anti-aliasing, font rendering)
 * - animations: 'disabled' ensures consistent screenshots
 * - fullPage: true captures entire scrollable area
 *
 * Authentication:
 * - Tests skip pages that redirect to auth
 * - For complete coverage, set up storageState with authenticated session
 * - See Playwright authentication docs for setup
 */
