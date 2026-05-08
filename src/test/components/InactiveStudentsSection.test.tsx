import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InactiveStudentsSection } from '@/components/students/InactiveStudentsSection'
import type { Student } from '@/types/database'

// A minimal set of inactive students used across tests
const inactiveStudents: Student[] = [
  {
    id: '1',
    first_name: 'Rohan',
    last_name: 'Sharma',
    age: null,
    batch_id: null,
    grade: null,
    guardian_name: null,
    phone: null,
    email: null,
    whatsapp_number: null,
    enrollment_date: '2024-01-01',
    is_active: false,
    attendance_pct: 0,
    fee_status: 'Pending',
    fee_amount: null,
    notes: null,
    created_at: '2024-01-01',
    batches: { id: 'b1', name: 'Morning Grammar', class_type: 'Academic Grammar', schedule: 'Mon-Wed', max_seats: 20, current_count: 5, is_active: true, created_at: '2024-01-01' },
  },
  {
    id: '2',
    first_name: 'Priya',
    last_name: 'Mehta',
    age: null,
    batch_id: null,
    grade: 'Grade 3',
    guardian_name: null,
    phone: null,
    email: null,
    whatsapp_number: null,
    enrollment_date: '2024-01-01',
    is_active: false,
    attendance_pct: 0,
    fee_status: 'Paid',
    fee_amount: null,
    notes: null,
    created_at: '2024-01-01',
    batches: undefined,
  },
]

// Tests for InactiveStudentsSection — the collapsible section at the bottom
// of the student list that shows deactivated students
describe('InactiveStudentsSection', () => {
  // When there are no inactive students, nothing should be rendered at all
  it('renders nothing when the students list is empty', () => {
    const { container } = render(<InactiveStudentsSection students={[]} />)
    expect(container.firstChild).toBeNull()
  })

  // The header should always show how many inactive students there are
  it('shows the inactive student count in the header', () => {
    render(<InactiveStudentsSection students={inactiveStudents} />)
    expect(screen.getByText('Inactive Students')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  // Student names should NOT be visible before the section is expanded
  it('does not show student names when collapsed by default', () => {
    render(<InactiveStudentsSection students={inactiveStudents} />)
    expect(screen.queryByText('Rohan Sharma')).not.toBeInTheDocument()
    expect(screen.queryByText('Priya Mehta')).not.toBeInTheDocument()
  })

  // Clicking the header should expand the section and reveal all student names
  it('shows student names after clicking the header to expand', () => {
    render(<InactiveStudentsSection students={inactiveStudents} />)

    fireEvent.click(screen.getByText('Inactive Students'))

    expect(screen.getByText('Rohan Sharma')).toBeInTheDocument()
    expect(screen.getByText('Priya Mehta')).toBeInTheDocument()
  })

  // Clicking the header a second time should collapse the section again
  it('hides student names again when the header is clicked a second time', () => {
    render(<InactiveStudentsSection students={inactiveStudents} />)

    // Expand
    fireEvent.click(screen.getByText('Inactive Students'))
    expect(screen.getByText('Rohan Sharma')).toBeInTheDocument()

    // Collapse
    fireEvent.click(screen.getByText('Inactive Students'))
    expect(screen.queryByText('Rohan Sharma')).not.toBeInTheDocument()
  })
})
