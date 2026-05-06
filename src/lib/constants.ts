import type { ClassType, FeeStatus } from '@/types/database'

export const CLASS_TYPES: ClassType[] = [
  'Academic Grammar',
  'Phonics for Kids',
  'Phonics for Adults',
  'Spoken English for Adults',
  'Language Classes for Kids',
]

export const CLASS_TYPE_META: Record<
  ClassType,
  { audience: 'kids' | 'adults'; desc: string; grades: string | null }
> = {
  'Academic Grammar': {
    audience: 'kids',
    desc: 'Grammar based on school syllabus',
    grades: 'Grades 2–8',
  },
  'Phonics for Kids': {
    audience: 'kids',
    desc: 'Jolly Phonics for kids',
    grades: null,
  },
  'Phonics for Adults': {
    audience: 'adults',
    desc: 'Jolly Phonics for adults',
    grades: null,
  },
  'Spoken English for Adults': {
    audience: 'adults',
    desc: 'Customized courses based on requirements',
    grades: null,
  },
  'Language Classes for Kids': {
    audience: 'kids',
    desc: 'Elocution, Speech & Drama, Conversations, Basic Grammar',
    grades: 'Senior KG – Grade 4',
  },
}

// Class types where the grade field should be shown
export const GRADE_CLASS_TYPES: ClassType[] = [
  'Academic Grammar',
  'Language Classes for Kids',
]

export const GRADES = [
  'Senior KG',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
]

export const FEE_STATUSES: FeeStatus[] = ['Paid', 'Pending', 'Overdue']

export const FEE_STATUS_COLORS: Record<FeeStatus, string> = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  Overdue: 'bg-red-100 text-red-800',
}

export const CLASS_TYPE_COLORS: Record<ClassType, string> = {
  'Academic Grammar': 'bg-blue-100 text-blue-800',
  'Phonics for Kids': 'bg-purple-100 text-purple-800',
  'Phonics for Adults': 'bg-indigo-100 text-indigo-800',
  'Spoken English for Adults': 'bg-teal-100 text-teal-800',
  'Language Classes for Kids': 'bg-orange-100 text-orange-800',
}