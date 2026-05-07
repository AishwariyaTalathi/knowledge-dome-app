import { describe, it, expect } from 'vitest'
import { getInitials, whatsappLink, formatCurrency, formatDate } from '@/lib/utils'

// Tests for getInitials — takes a first and last name, returns two uppercase initials
describe('getInitials', () => {
  // Standard case: Minakshi Talathi → MT
  it('returns uppercase initials from first and last name', () => {
    expect(getInitials('Minakshi', 'Talathi')).toBe('MT')
  })

  // Names already uppercase should still work correctly
  it('works when names are already uppercase', () => {
    expect(getInitials('AISHA', 'KHAN')).toBe('AK')
  })

  // Lowercase names should be converted to uppercase initials
  it('works when names are lowercase', () => {
    expect(getInitials('rohan', 'sharma')).toBe('RS')
  })

  // Edge case: both names are empty strings — should not crash, just return empty
  it('returns empty string when both names are empty', () => {
    expect(getInitials('', '')).toBe('')
  })
})

// Tests for whatsappLink — takes a phone number, returns a wa.me URL with Indian country code
describe('whatsappLink', () => {
  // A 10-digit number without country code should get 91 prepended
  it('adds country code 91 when not present', () => {
    expect(whatsappLink('9604555029')).toBe('https://wa.me/919604555029')
  })

  // A number that already starts with 91 should not get 91 added again
  it('does not double-add 91 when already present', () => {
    expect(whatsappLink('919604555029')).toBe('https://wa.me/919604555029')
  })

  // Spaces in the number should be stripped before building the URL
  it('strips spaces from the number', () => {
    expect(whatsappLink('96045 55029')).toBe('https://wa.me/919604555029')
  })

  // Dashes in the number should be stripped before building the URL
  it('strips dashes from the number', () => {
    expect(whatsappLink('96045-55029')).toBe('https://wa.me/919604555029')
  })
})

// Tests for formatCurrency — formats a number as Indian Rupees with ₹ symbol
describe('formatCurrency', () => {
  // Basic amount should show ₹ symbol with no decimals
  it('formats a whole number as Indian Rupees', () => {
    expect(formatCurrency(500)).toBe('₹500')
  })

  // Numbers above 999 should use Indian comma formatting (1,000 not 1000)
  it('formats a large number with Indian comma formatting', () => {
    expect(formatCurrency(1000)).toBe('₹1,000')
  })

  // Zero is a valid fee amount and should display correctly
  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('₹0')
  })

  // Decimal values should be rounded off since maximumFractionDigits is set to 0
  it('rounds off decimal values', () => {
    expect(formatCurrency(999.99)).toBe('₹1,000')
  })
})

// Tests for formatDate — takes an ISO date string and returns a human-readable Indian format
describe('formatDate', () => {
  // A standard date should be formatted as DD Mon YYYY
  it('formats a date string into a readable format', () => {
    expect(formatDate('2024-01-15')).toBe('15 Jan 2024')
  })

  // Month names should appear in short form (Jan, Feb, Mar etc.)
  it('uses short month names', () => {
    expect(formatDate('2024-06-01')).toBe('01 Jun 2024')
  })

  // Day should always be two digits — single digit days should have a leading zero
  it('pads single digit days with a leading zero', () => {
    expect(formatDate('2024-03-05')).toBe('05 Mar 2024')
  })

  // Year should always appear in full four digit format
  it('shows the full four digit year', () => {
    expect(formatDate('2025-12-31')).toBe('31 Dec 2025')
  })
})
