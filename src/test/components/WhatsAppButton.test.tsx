import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WhatsAppButton } from '@/components/students/WhatsAppButton'

// jsdom (the simulated browser used in tests) doesn't implement the native
// <dialog> element methods, so we add simple stubs so the ConfirmDialog component
// doesn't crash when it tries to call showModal() or close()
HTMLDialogElement.prototype.showModal = vi.fn()
HTMLDialogElement.prototype.close = vi.fn()

// We replace window.open with a fake function so the test doesn't actually
// try to open a browser tab — we just want to verify it was called correctly
const mockWindowOpen = vi.fn()
beforeEach(() => {
  vi.stubGlobal('open', mockWindowOpen)
  mockWindowOpen.mockReset()
})

// Tests for WhatsAppButton — the button that opens WhatsApp after a confirmation dialog
describe('WhatsAppButton', () => {
  // The full variant (used on student detail page) should show a "WhatsApp" label
  it('renders the full button with WhatsApp label', () => {
    render(<WhatsAppButton number="9604555029" name="Rohan Sharma" variant="full" />)
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
  })

  // Clicking the button should open a confirmation dialog showing the student's name
  it('shows a confirmation dialog with the student name when clicked', () => {
    render(<WhatsAppButton number="9604555029" name="Rohan Sharma" variant="full" />)

    fireEvent.click(screen.getByText('WhatsApp'))

    // The dialog title should mention the student's name
    expect(screen.getByText('Message Rohan Sharma on WhatsApp?')).toBeInTheDocument()
  })

  // Clicking Cancel should not open WhatsApp — the confirmation was declined
  it('does not open WhatsApp when Cancel is clicked', () => {
    render(<WhatsAppButton number="9604555029" name="Rohan Sharma" variant="full" />)

    // Open the confirmation dialog
    fireEvent.click(screen.getByText('WhatsApp'))
    expect(screen.getByText('Message Rohan Sharma on WhatsApp?')).toBeInTheDocument()

    // Click Cancel — window.open should never be called
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockWindowOpen).not.toHaveBeenCalled()
  })

  // Clicking "Open WhatsApp" should call window.open with the correct wa.me URL
  it('opens the correct WhatsApp URL when confirmed', () => {
    render(<WhatsAppButton number="9604555029" name="Rohan Sharma" variant="full" />)

    fireEvent.click(screen.getByText('WhatsApp'))
    fireEvent.click(screen.getByText('Open WhatsApp'))

    // Should open wa.me with Indian country code prepended
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://wa.me/919604555029',
      '_blank',
      'noopener,noreferrer'
    )
  })

  // The icon variant (used on the student list) should render a button with a title attribute
  it('renders the icon variant with a title attribute', () => {
    render(<WhatsAppButton number="9604555029" name="Rohan Sharma" variant="icon" />)
    expect(screen.getByTitle('WhatsApp')).toBeInTheDocument()
  })
})
