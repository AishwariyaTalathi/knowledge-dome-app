import { z } from 'zod'

export const studentSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  age: z.coerce.number().int().positive().optional().or(z.literal('')),
  batch_id: z.string().uuid().optional().or(z.literal('')),
  grade: z.string().optional().or(z.literal('')),
  guardian_name: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  email: z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
  whatsapp_number: z.string().optional().or(z.literal('')),
  enrollment_date: z.string().min(1, 'Enrollment date is required'),
  fee_status: z.enum(['Paid', 'Pending', 'Overdue']),
  fee_amount: z.coerce.number().positive().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  is_active: z.boolean().optional(),
})

export type StudentFormData = z.infer<typeof studentSchema>

export const batchSchema = z.object({
  name: z.string().min(1, 'Batch name is required'),
  schedule: z.string().min(1, 'Schedule is required'),
  class_type: z.enum([
    'Academic Grammar',
    'Phonics for Kids',
    'Phonics for Adults',
    'Spoken English for Adults',
    'Language Classes for Kids',
  ]),
  max_seats: z.coerce.number().int().positive('Must be a positive number'),
  is_active: z.boolean(),
})

export type BatchFormData = z.infer<typeof batchSchema>

export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required'),
  is_active: z.boolean(),
})

export type AnnouncementFormData = z.infer<typeof announcementSchema>