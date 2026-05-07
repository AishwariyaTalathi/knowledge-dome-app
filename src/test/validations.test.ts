import { describe, it, expect } from 'vitest'
import { studentSchema } from '@/lib/validations'

// A minimal valid student object used as the base for all tests below.
// Individual tests override specific fields to check what happens when they're wrong.
const validStudent = {
  first_name: 'Rohan',
  last_name: 'Sharma',
  enrollment_date: '2024-01-15',
  fee_status: 'Paid' as const,
}

// Tests for studentSchema — the Zod schema that validates the Add/Edit Student form
describe('studentSchema', () => {
  // The base valid student should pass without any errors
  it('passes when all required fields are valid', () => {
    const result = studentSchema.safeParse(validStudent)
    expect(result.success).toBe(true)
  })

  // First name is required — empty string should fail with the correct error message
  it('fails when first name is missing', () => {
    const result = studentSchema.safeParse({ ...validStudent, first_name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('First name is required')
  })

  // Last name is required — empty string should fail with the correct error message
  it('fails when last name is missing', () => {
    const result = studentSchema.safeParse({ ...validStudent, last_name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Last name is required')
  })

  // Enrollment date is required — empty string should fail with the correct error message
  it('fails when enrollment date is missing', () => {
    const result = studentSchema.safeParse({ ...validStudent, enrollment_date: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Enrollment date is required')
  })

  // Fee status must be one of: Paid, Pending, Overdue — anything else should be rejected
  it('fails when fee status is not one of the allowed values', () => {
    const result = studentSchema.safeParse({ ...validStudent, fee_status: 'Unknown' })
    expect(result.success).toBe(false)
  })

  // Email must be in a valid format if provided — a plain string without @ should fail
  it('fails when email format is invalid', () => {
    const result = studentSchema.safeParse({ ...validStudent, email: 'not-an-email' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Invalid email')
  })

  // Email is optional — leaving it blank should still pass validation
  it('passes when email is empty (email is optional)', () => {
    const result = studentSchema.safeParse({ ...validStudent, email: '' })
    expect(result.success).toBe(true)
  })

  // All three allowed fee statuses should be accepted — tests each one individually
  it('passes with all three valid fee statuses', () => {
    for (const status of ['Paid', 'Pending', 'Overdue'] as const) {
      const result = studentSchema.safeParse({ ...validStudent, fee_status: status })
      expect(result.success).toBe(true)
    }
  })
})
