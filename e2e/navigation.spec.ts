import { test, expect } from '@playwright/test'
import * as dotenv from 'dotenv'

// Load test credentials from .env.test — gitignored, never committed
dotenv.config({ path: '.env.test' })

const EMAIL = process.env.TEST_EMAIL!
const PASSWORD = process.env.TEST_PASSWORD!

// End-to-end tests for navigation on both mobile and desktop viewports
// Navigation is only visible on protected routes, so we log in first
test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Password').fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('/dashboard')
  })

  // ─── Mobile (375×812 — iPhone SE dimensions) ──────────────────────────────

  test.describe('Mobile bottom nav', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    // All 5 sections should appear as links in the bottom nav
    test('shows all 5 sections in the bottom nav', async ({ page }) => {
      const nav = page.locator('nav').last()
      await expect(nav.getByRole('link', { name: 'Dashboard' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Students' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Attendance' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Batches' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Announcements' })).toBeVisible()
    })

    // Logout should be in the TopBar header, not taking up a slot in the bottom nav
    test('shows logout in the TopBar, not in the bottom nav', async ({ page }) => {
      const header = page.locator('header')
      await expect(header.getByRole('button', { name: 'Logout' })).toBeVisible()

      // Bottom nav should have no Logout button — all slots are for navigation
      const nav = page.locator('nav').last()
      await expect(nav.getByRole('button', { name: 'Logout' })).not.toBeVisible()
    })

    // Tapping Batches should navigate to the batches page
    test('navigates to Batches when tapped', async ({ page }) => {
      await page.locator('nav').last().getByRole('link', { name: 'Batches' }).click()
      await expect(page).toHaveURL('/batches')
    })

    // Tapping Announcements should navigate to the announcements page
    test('navigates to Announcements when tapped', async ({ page }) => {
      await page.locator('nav').last().getByRole('link', { name: 'Announcements' }).click()
      await expect(page).toHaveURL('/announcements')
    })
  })

  // ─── Desktop sidebar ───────────────────────────────────────────────────────

  test.describe('Desktop sidebar', () => {
    test.use({ viewport: { width: 1280, height: 800 } })

    // All 5 sections should appear as links in the sidebar
    test('shows all 5 sections in the sidebar', async ({ page }) => {
      const sidebar = page.locator('aside')
      await expect(sidebar.getByRole('link', { name: 'Dashboard' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: 'Students' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: 'Attendance' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: 'Batches' })).toBeVisible()
      await expect(sidebar.getByRole('link', { name: 'Announcements' })).toBeVisible()
    })

    // Logout should be at the bottom of the sidebar on desktop
    test('shows logout at the bottom of the sidebar', async ({ page }) => {
      const sidebar = page.locator('aside')
      await expect(sidebar.getByRole('button', { name: 'Logout' })).toBeVisible()
    })
  })
})
