import { test, expect } from '@playwright/test'
import * as dotenv from 'dotenv'

// Load test credentials from .env.test — gitignored, never committed
dotenv.config({ path: '.env.test' })

const EMAIL = process.env.TEST_EMAIL!
const PASSWORD = process.env.TEST_PASSWORD!

// End-to-end tests for the Testimonials admin section
// These require the dev server running and the testimonials table to exist in Supabase
test.describe('Testimonials', () => {
  // Log in before each test — the testimonials route is protected
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Password').fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('/dashboard')
  })

  // The testimonials page should load with the heading and Add button visible
  test('shows the testimonials page with an Add Testimonial button', async ({ page }) => {
    await page.goto('/testimonials')
    await expect(page.getByRole('heading', { name: 'Testimonials' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add Testimonial' })).toBeVisible()
  })

  // Clicking Add Testimonial should open the modal form
  test('opens the add modal when Add Testimonial is clicked', async ({ page }) => {
    await page.goto('/testimonials')
    await page.getByRole('button', { name: 'Add Testimonial' }).click()
    await expect(page.getByText('Add Testimonial').first()).toBeVisible()
    await expect(page.getByLabel('Parent / Student Name *')).toBeVisible()
    await expect(page.getByLabel('What they said *')).toBeVisible()
  })

  // Filling in the form and submitting should add the testimonial to the list
  // Note: this test adds a real row to the database — delete "E2E Test Parent" afterwards via the admin UI
  test('adds a new testimonial and shows it in the list', async ({ page }) => {
    await page.goto('/testimonials')
    await page.getByRole('button', { name: 'Add Testimonial' }).click()

    // Fill in the required fields
    await page.getByLabel('Parent / Student Name *').fill('E2E Test Parent')
    await page.getByLabel('What they said *').fill('This is an automated test testimonial for the app.')

    await page.getByRole('button', { name: 'Add Testimonial' }).last().click()

    // Should appear in the list after saving
    await expect(page.getByText('E2E Test Parent')).toBeVisible()
  })
})
