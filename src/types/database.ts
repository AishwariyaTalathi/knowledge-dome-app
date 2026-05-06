export type ClassType =
  | 'Academic Grammar'
  | 'Phonics for Kids'
  | 'Phonics for Adults'
  | 'Spoken English for Adults'
  | 'Language Classes for Kids'

export type FeeStatus = 'Paid' | 'Pending' | 'Overdue'

export interface Batch {
  id: string
  name: string
  schedule: string
  class_type: ClassType
  max_seats: number
  current_count: number
  is_active: boolean
  created_at: string
}

export interface Student {
  id: string
  first_name: string
  last_name: string
  age: number | null
  batch_id: string | null
  grade: string | null
  guardian_name: string | null
  phone: string | null
  email: string | null
  whatsapp_number: string | null
  enrollment_date: string
  is_active: boolean
  attendance_pct: number
  fee_status: FeeStatus
  fee_amount: number | null
  notes: string | null
  created_at: string
  batches?: Batch
}

export interface AttendanceRecord {
  id: string
  student_id: string
  class_date: string
  present: boolean
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  description: string | null
  date: string
  is_active: boolean
  created_at: string
}