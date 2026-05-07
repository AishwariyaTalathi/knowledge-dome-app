import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FeeStatusButton } from '@/components/students/FeeStatusButton'

// The component calls updateFeeStatus (a server action) when a new status is picked.
// Since tests run without a real server, we replace it with a fake function (mock)
// that just returns success immediately — so we can test the UI behaviour in isolation.
vi.mock('@/app/(protected)/students/actions', () => ({
  updateFeeStatus: vi.fn().mockResolvedValue({}),
}))

// Tests for FeeStatusButton — the clickable badge on the student list that lets
// Minakshi change fee status without opening the full edit form
describe('FeeStatusButton', () => {
  // The button should display the current status passed to it as a prop
  it('displays the current fee status', () => {
    render(<FeeStatusButton studentId="abc-123" status="Paid" />)
    expect(screen.getByText('Paid')).toBeInTheDocument()
  })

  // Clicking the button should open a dropdown showing all three status options
  it('shows the dropdown with all three options when clicked', async () => {
    render(<FeeStatusButton studentId="abc-123" status="Paid" />)

    // Simulate a click on the badge
    fireEvent.click(screen.getByText('Paid'))

    // All three options should now be visible in the dropdown
    expect(screen.getAllByText('Paid').length).toBeGreaterThan(0)
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  // After selecting a new status from the dropdown, the dropdown should close
  it('closes the dropdown when a new status is selected', async () => {
    render(<FeeStatusButton studentId="abc-123" status="Paid" />)

    // Open the dropdown
    fireEvent.click(screen.getByText('Paid'))
    expect(screen.getByText('Pending')).toBeInTheDocument()

    // Select a different status
    fireEvent.click(screen.getByText('Pending'))

    // Dropdown should now be closed — Overdue should no longer be visible
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument()
  })
})
