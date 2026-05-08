import { describe, it, expect } from 'vitest'
import { studentSchema, batchSchema, testimonialSchema } from '@/lib/validations'

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

// Tests for batchSchema — the Zod schema that validates the Add/Edit Batch form
describe('batchSchema', () => {
  // A minimal valid batch — all required fields present and correct
  const validBatch = {
    name: 'Morning Grammar',
    schedule: 'Mon, Wed, Fri — 9:00 AM',
    class_type: 'Academic Grammar' as const,
    max_seats: 20,
    is_active: true,
  }

  // The base valid batch should pass without any errors
  it('passes when all required fields are valid', () => {
    const result = batchSchema.safeParse(validBatch)
    expect(result.success).toBe(true)
  })

  // Batch name is required — an empty string should fail with the correct message
  it('fails when batch name is empty', () => {
    const result = batchSchema.safeParse({ ...validBatch, name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Batch name is required')
  })

  // Schedule is required — an empty string should fail with the correct message
  it('fails when schedule is empty', () => {
    const result = batchSchema.safeParse({ ...validBatch, schedule: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Schedule is required')
  })

  // class_type must be one of the 5 exact program names — anything else is rejected
  it('fails when class type is not one of the five allowed programs', () => {
    const result = batchSchema.safeParse({ ...validBatch, class_type: 'Random Program' })
    expect(result.success).toBe(false)
  })

  // All 5 program types should be accepted — tests each one individually
  it('passes for all five valid class types', () => {
    const types = [
      'Academic Grammar',
      'Phonics for Kids',
      'Phonics for Adults',
      'Spoken English for Adults',
      'Language Classes for Kids',
    ] as const
    for (const class_type of types) {
      const result = batchSchema.safeParse({ ...validBatch, class_type })
      expect(result.success).toBe(true)
    }
  })

  // max_seats must be a positive number — zero should be rejected
  it('fails when max seats is zero', () => {
    const result = batchSchema.safeParse({ ...validBatch, max_seats: 0 })
    expect(result.success).toBe(false)
  })

  // max_seats must be a positive number — negative values should be rejected
  it('fails when max seats is negative', () => {
    const result = batchSchema.safeParse({ ...validBatch, max_seats: -5 })
    expect(result.success).toBe(false)
  })
})

// Tests for testimonialSchema — the Zod schema that validates the Add/Edit Testimonial form
describe('testimonialSchema', () => {
  // A minimal valid testimonial — all required fields present and correct
  const validTestimonial = {
    name: 'Mrs. Phadnis',
    role: 'Parent',
    quote: 'My kid showed a lot of improvement after joining the class.',
    stars: 5,
    is_active: true,
  }

  // The base valid testimonial should pass without any errors
  it('passes when all required fields are valid', () => {
    const result = testimonialSchema.safeParse(validTestimonial)
    expect(result.success).toBe(true)
  })

  // Name is required — an empty string should fail with the correct message
  it('fails when name is empty', () => {
    const result = testimonialSchema.safeParse({ ...validTestimonial, name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Name is required')
  })

  // Role is required — an empty string should fail with the correct message
  it('fails when role is empty', () => {
    const result = testimonialSchema.safeParse({ ...validTestimonial, role: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Role is required')
  })

  // Quote must be at least 10 characters — a very short string should be rejected
  it('fails when quote is shorter than 10 characters', () => {
    const result = testimonialSchema.safeParse({ ...validTestimonial, quote: 'Too short' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Quote must be at least 10 characters')
  })

  // Stars must be between 1 and 5 — 0 should be rejected
  it('fails when stars is 0', () => {
    const result = testimonialSchema.safeParse({ ...validTestimonial, stars: 0 })
    expect(result.success).toBe(false)
  })

  // Stars must be between 1 and 5 — 6 should be rejected
  it('fails when stars is greater than 5', () => {
    const result = testimonialSchema.safeParse({ ...validTestimonial, stars: 6 })
    expect(result.success).toBe(false)
  })

  // All star values from 1 to 5 should be accepted
  it('passes for all valid star ratings (1 through 5)', () => {
    for (const stars of [1, 2, 3, 4, 5]) {
      const result = testimonialSchema.safeParse({ ...validTestimonial, stars })
      expect(result.success).toBe(true)
    }
  })

  // is_active controls visibility — both true and false should be valid
  it('passes when is_active is false (hidden testimonial)', () => {
    const result = testimonialSchema.safeParse({ ...validTestimonial, is_active: false })
    expect(result.success).toBe(true)
  })
})
