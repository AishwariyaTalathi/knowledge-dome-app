import { test, expect } from '@playwright/test'
import * as dotenv from 'dotenv'

// Load credentials from .env.test — this file is gitignored and never committed
dotenv.config({ path: '.env.test' })

const EMAIL = process.env.TEST_EMAIL!
const PASSWORD = process.env.TEST_PASSWORD!

// End-to-end tests for the login flow
// These open a real browser and interact with the running app at localhost:3000
test.describe('Login flow', () => {
  // Before each test, start from the login page
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  // The login page should show the form fields and sign in button
  test('shows the login form', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  // The "Back to website" link should navigate to the public landing page
  test('back to website link goes to the landing page', async ({ page }) => {
    await page.getByText('Back to website').click()
    await expect(page).toHaveURL('/')
  })

  // Entering wrong credentials should show an error toast, not redirect
  test('shows an error with wrong credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@email.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Error toast should appear — Supabase auth can take a moment
    await expect(page.getByText('Invalid email or password')).toBeVisible({ timeout: 15000 })

    // Should still be on the login page
    await expect(page).toHaveURL('/login')
  })

  // Correct credentials should redirect to the dashboard
  test('redirects to dashboard on successful login', async ({ page }) => {
    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Password').fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Should land on the dashboard after login
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})
