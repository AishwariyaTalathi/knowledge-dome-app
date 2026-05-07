import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Pencil, ArrowLeft, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AttendanceDots } from '@/components/students/AttendanceDots'
import { FeeStatusBadge } from '@/components/students/FeeStatusBadge'
import { DeactivateStudent } from '@/components/students/DeactivateStudent'
import { WhatsAppButton } from '@/components/students/WhatsAppButton'
import { PhoneButton } from '@/components/students/PhoneButton'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate, formatCurrency, getInitials } from '@/lib/utils'

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  )
}

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: student }, { data: attendance }] = await Promise.all([
    supabase.from('students').select('*, batches(*)').eq('id', id).single(),
    supabase
      .from('attendance_records')
      .select('class_date, present')
      .eq('student_id', id)
      .order('class_date', { ascending: false })
      .limit(20),
  ])

  if (!student) notFound()

  const contactNumber = student.whatsapp_number || student.phone

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link href="/students" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-800 mb-4">
        <ArrowLeft size={16} />
        All Students
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <span className="text-brand-800 font-bold text-xl">
                {getInitials(student.first_name, student.last_name)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {student.first_name} {student.last_name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={student.is_active ? 'success' : 'default'}>
                  {student.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {student.grade && <Badge variant="blue">{student.grade}</Badge>}
              </div>
            </div>
          </div>
          <Link href={`/students/${student.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil size={14} className="mr-1.5" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Class info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Class Info</h2>
          <InfoRow label="Batch" value={student.batches?.name} />
          <InfoRow label="Program" value={student.batches?.class_type} />
          <InfoRow label="Grade" value={student.grade} />
          <InfoRow label="Enrolled" value={formatDate(student.enrollment_date)} />
          <InfoRow label="Age" value={student.age ? `${student.age} years` : undefined} />
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact</h2>
          {student.guardian_name && (
            <InfoRow label="Guardian" value={student.guardian_name} />
          )}
          {student.phone && (
            <InfoRow
              label="Phone"
              value={
                <PhoneButton
                  number={student.phone}
                  name={`${student.first_name} ${student.last_name}`}
                />
              }
            />
          )}
          {student.email && (
            <InfoRow
              label="Email"
              value={
                <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-brand-800 hover:underline">
                  <Mail size={13} />
                  {student.email}
                </a>
              }
            />
          )}

          {contactNumber && (
            <div className="mt-4">
              <WhatsAppButton
                number={contactNumber}
                name={`${student.first_name} ${student.last_name}`}
                variant="full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Fee info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Fees</h2>
        <div className="flex items-center gap-4">
          <FeeStatusBadge status={student.fee_status} />
          {student.fee_amount && (
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(student.fee_amount)}
            </span>
          )}
        </div>
      </div>

      {/* Notes */}
      {student.notes && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mt-4">
          <h2 className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">Private Notes</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.notes}</p>
        </div>
      )}

      {/* Danger zone */}
      <div className="mt-4 flex justify-end">
        <DeactivateStudent
          studentId={student.id}
          studentName={`${student.first_name} ${student.last_name}`}
          isActive={student.is_active}
        />
      </div>

      {/* Attendance */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Attendance</h2>
        </div>
        <AttendanceDots records={attendance ?? []} attendancePct={student.attendance_pct ?? 0} />
      </div>
    </div>
  )
}
