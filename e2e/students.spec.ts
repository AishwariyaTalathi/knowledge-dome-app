import { test, expect } from '@playwright/test'
import * as dotenv from 'dotenv'

// Load test credentials from .env.test — gitignored, never committed
dotenv.config({ path: '.env.test' })

const EMAIL = process.env.TEST_EMAIL!
const PASSWORD = process.env.TEST_PASSWORD!

// End-to-end tests for the Students section
// These require the dev server to be running at localhost:3000
// and a valid test user to exist in Supabase
test.describe('Students', () => {
  // Log in before each test — all student routes are protected
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Password').fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('/dashboard')
  })

  // The students page should show the section heading and the button to add a new student
  test('shows the students list with an Add Student button', async ({ page }) => {
    await page.goto('/students')
    await expect(page.getByRole('heading', { name: 'Students' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Add Student' })).toBeVisible()
  })

  // Filling in the minimum required fields (first name, last name) and submitting
  // should save the student and redirect back to the students list
  // Note: this test adds a real student to the database — delete "E2E Test Student" afterwards via the admin UI
  test('adds a new student and shows them in the list', async ({ page }) => {
    await page.goto('/students/new')
    await expect(page.getByRole('heading', { name: 'Add New Student' })).toBeVisible()

    // Only first name and last name are required — enrollment date and fee status have defaults
    await page.getByLabel('First Name *').fill('E2E Test')
    await page.getByLabel('Last Name *').fill('Student')

    await page.getByRole('button', { name: 'Add Student' }).click()

    // After saving, should redirect to the students list
    await page.waitForURL('/students')
    // Wait for the server-rendered page to fully load before asserting
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('E2E Test Student').first()).toBeVisible()
  })

  // Clicking a fee status badge in the student table should open a dropdown
  // and selecting a different status should update it immediately (optimistic UI)
  // Note: this test requires at least one student with "Pending" fee status to exist
  test('updates a student fee status inline from the list', async ({ page }) => {
    await page.goto('/students')

    // Click the first "Pending" badge to open the status dropdown
    const pendingBadge = page.getByRole('button', { name: 'Pending' }).first()
    await expect(pendingBadge).toBeVisible()
    await pendingBadge.click()

    // The dropdown panel appears as an absolute-positioned container (z-20, above the backdrop)
    // Target it specifically to avoid clicking a badge from another student that's behind the backdrop
    const dropdownPanel = page.locator('.absolute.top-full')
    await dropdownPanel.waitFor({ state: 'visible' })
    await dropdownPanel.getByText('Paid').click()

    // The badge for that student should now show "Paid"
    await expect(page.getByRole('button', { name: 'Paid' }).first()).toBeVisible()
  })
})
