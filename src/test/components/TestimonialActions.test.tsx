import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TestimonialActions } from '@/components/testimonials/TestimonialActions'
import type { Testimonial } from '@/types/database'

// The component calls server actions when saving or toggling visibility.
// We replace them with mocks so the tests run without a real server.
vi.mock('@/app/(protected)/testimonials/actions', () => ({
  createTestimonial: vi.fn().mockResolvedValue({}),
  updateTestimonial: vi.fn().mockResolvedValue({}),
  toggleTestimonialVisibility: vi.fn().mockResolvedValue({}),
}))

// jsdom does not implement <dialog> — stub the methods so Modal works in tests
HTMLDialogElement.prototype.showModal = vi.fn()
HTMLDialogElement.prototype.close = vi.fn()

// Sample testimonials used across tests
const sampleTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Mrs. Phadnis',
    role: 'Parent',
    quote: 'My kid showed a lot of improvement after joining the class.',
    stars: 5,
    is_active: true,
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Mr. Kothari',
    role: 'Parent',
    quote: 'Kids really enjoy it and do not want to miss a single class.',
    stars: 5,
    is_active: false,
    created_at: '2024-01-02',
  },
]

// Tests for TestimonialActions — the admin component at /testimonials
describe('TestimonialActions', () => {
  // When testimonials exist, each name should be visible on the page
  it('renders the list of testimonials', () => {
    render(<TestimonialActions testimonials={sampleTestimonials} />)
    expect(screen.getByText('Mrs. Phadnis')).toBeInTheDocument()
    expect(screen.getByText('Mr. Kothari')).toBeInTheDocument()
  })

  // A hidden testimonial should show a "Hidden" badge so Minakshi can tell at a glance
  it('shows a Hidden badge for testimonials that are not active', () => {
    render(<TestimonialActions testimonials={sampleTestimonials} />)
    expect(screen.getByText('Hidden')).toBeInTheDocument()
  })

  // When there are no testimonials, an empty state message should be shown instead of an empty list
  it('shows an empty state when there are no testimonials', () => {
    render(<TestimonialActions testimonials={[]} />)
    expect(screen.getByText('No testimonials yet')).toBeInTheDocument()
  })

  // Clicking "Add Testimonial" should open the modal with the form
  it('opens the add modal when the Add Testimonial button is clicked', () => {
    render(<TestimonialActions testimonials={[]} />)
    fireEvent.click(screen.getByRole('button', { name: /add testimonial/i }))
    // jsdom doesn't expose closed-dialog content to ARIA — check for a form field unique to the modal
    expect(screen.getByLabelText('Parent / Student Name *')).toBeInTheDocument()
  })

  // Clicking Edit on a testimonial should open the modal pre-filled with that testimonial's data
  it('opens the edit modal with the correct testimonial name pre-filled', () => {
    render(<TestimonialActions testimonials={sampleTestimonials} />)
    // Click Edit on the first testimonial
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0])
    // The modal should show the edit title and the name field should be pre-filled
    expect(screen.getByText('Edit Testimonial')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Mrs. Phadnis')).toBeInTheDocument()
  })
})
