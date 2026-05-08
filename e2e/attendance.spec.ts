import { test, expect } from '@playwright/test'
import * as dotenv from 'dotenv'

// Load test credentials from .env.test — gitignored, never committed
dotenv.config({ path: '.env.test' })

const EMAIL = process.env.TEST_EMAIL!
const PASSWORD = process.env.TEST_PASSWORD!

// End-to-end tests for the Attendance section
// These require the dev server to be running at localhost:3000
// and a valid test user to exist in Supabase
test.describe('Attendance', () => {
  // Log in before each test — the attendance route is protected
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Password').fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('/dashboard')
  })

  // The attendance page should open on the "Mark Attendance" tab by default,
  // showing the Today/Yesterday date picker buttons
  test('shows the Mark Attendance tab by default', async ({ page }) => {
    await page.goto('/attendance')
    await expect(page.getByRole('heading', { name: 'Attendance' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Today' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Yesterday' })).toBeVisible()
  })

  // Clicking the Summary tab link should switch the view and update the URL
  test('can switch to the Summary tab', async ({ page }) => {
    await page.goto('/attendance')

    await page.getByRole('link', { name: 'Summary' }).click()

    // URL should update to reflect the summary view
    await expect(page).toHaveURL('/attendance?view=summary')

    // The date picker buttons are only shown in Mark Attendance — not in Summary
    await expect(page.getByRole('button', { name: 'Today' })).not.toBeVisible()
  })

  // Clicking the mark button for an unmarked student should toggle them to Present
  // Note: this test requires at least one student with no attendance record for today
  test('marks a student as present', async ({ page }) => {
    await page.goto('/attendance')

    // "— Mark" is shown for students with no attendance record for the selected date
    const markButton = page.getByRole('button', { name: '— Mark' }).first()
    await expect(markButton).toBeVisible()
    await markButton.click()

    // After clicking, the button should update to show "Present"
    await expect(page.getByRole('button', { name: 'Present' }).first()).toBeVisible()
  })

  // Clicking "Present" again should toggle the student back to Absent
  test('toggles a present student to absent on second click', async ({ page }) => {
    await page.goto('/attendance')

    // Mark the first unmarked student as present
    const markButton = page.getByRole('button', { name: '— Mark' }).first()
    await expect(markButton).toBeVisible()
    await markButton.click()
    await expect(page.getByRole('button', { name: 'Present' }).first()).toBeVisible()

    // Click again — should toggle to Absent
    await page.getByRole('button', { name: 'Present' }).first().click()
    await expect(page.getByRole('button', { name: 'Absent' }).first()).toBeVisible()
  })
})
