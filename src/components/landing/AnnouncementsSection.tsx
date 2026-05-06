import { Bell } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Announcement } from '@/types/database'

interface AnnouncementsSectionProps {
  announcements: Announcement[]
}

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  if (announcements.length === 0) return null

  return (
    <section className="bg-brand-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Bell size={20} className="text-brand-800" />
          <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
        </div>

        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl p-4 border border-brand-100 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <time className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                  {formatDate(a.date)}
                </time>
              </div>
              {a.description && (
                <p className="text-sm text-gray-600 mt-1">{a.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
