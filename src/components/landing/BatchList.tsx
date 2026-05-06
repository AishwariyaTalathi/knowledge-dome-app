import { Clock, Users, BookOpen, Volume2, Headphones, MessageCircle, Sparkles } from 'lucide-react'
import { CLASS_TYPE_META, CLASS_TYPES, CLASS_TYPE_COLORS } from '@/lib/constants'
import type { Batch, ClassType } from '@/types/database'

interface BatchListProps {
  batches: Batch[]
}

const PROGRAM_ICONS: Record<ClassType, React.ReactNode> = {
  'Academic Grammar': <BookOpen size={22} />,
  'Phonics for Kids': <Volume2 size={22} />,
  'Phonics for Adults': <Headphones size={22} />,
  'Spoken English for Adults': <MessageCircle size={22} />,
  'Language Classes for Kids': <Sparkles size={22} />,
}

const ICON_BG: Record<ClassType, string> = {
  'Academic Grammar': 'bg-blue-100 text-blue-700',
  'Phonics for Kids': 'bg-purple-100 text-purple-700',
  'Phonics for Adults': 'bg-indigo-100 text-indigo-700',
  'Spoken English for Adults': 'bg-teal-100 text-teal-700',
  'Language Classes for Kids': 'bg-orange-100 text-orange-700',
}

function SeatBadge({ current, max }: { current: number; max: number }) {
  const remaining = max - current
  const pct = current / max
  if (pct >= 1) {
    return <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Full</span>
  }
  if (pct >= 0.8) {
    return <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Almost Full</span>
  }
  return <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{remaining} seats left</span>
}

export function BatchList({ batches }: BatchListProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Our Programs</h2>
      <p className="text-center text-gray-500 text-sm mb-8">English learning for every age and goal</p>

      <div className="space-y-8">
        {CLASS_TYPES.map((classType) => {
          const meta = CLASS_TYPE_META[classType]
          const typeBatches = batches.filter((b) => b.class_type === classType)
          if (typeBatches.length === 0) return null

          return (
            <div key={classType} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Program header */}
              <div className="p-5 border-b border-gray-50 flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${ICON_BG[classType as ClassType]}`}>
                  {PROGRAM_ICONS[classType as ClassType]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-900">{classType}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CLASS_TYPE_COLORS[classType as ClassType]}`}>
                      {meta.audience === 'kids' ? 'For Kids' : 'For Adults'}
                    </span>
                    {meta.grades && (
                      <span className="text-xs text-gray-500 font-medium">{meta.grades}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{meta.desc}</p>
                </div>
              </div>

              {/* Batch list */}
              <div className="divide-y divide-gray-50">
                {typeBatches.map((batch) => (
                  <div key={batch.id} className="px-5 py-3.5 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{batch.name}</p>
                      <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Clock size={12} />
                        {batch.schedule}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Users size={12} />
                        {batch.current_count}/{batch.max_seats}
                      </span>
                      <SeatBadge current={batch.current_count} max={batch.max_seats} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
