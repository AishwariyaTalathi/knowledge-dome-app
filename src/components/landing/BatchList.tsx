import { Clock, Users, BookOpen, Volume2, Headphones, MessageCircle, Sparkles } from 'lucide-react'
import { CLASS_TYPE_META, CLASS_TYPES } from '@/lib/constants'
import type { Batch, ClassType } from '@/types/database'

interface BatchListProps {
  batches: Batch[]
}

const PROGRAM_ICONS: Record<ClassType, React.ReactNode> = {
  'Academic Grammar': <BookOpen size={26} />,
  'Phonics for Kids': <Volume2 size={26} />,
  'Phonics for Adults': <Headphones size={26} />,
  'Spoken English for Adults': <MessageCircle size={26} />,
  'Language Classes for Kids': <Sparkles size={26} />,
}

const CARD_THEME: Record<ClassType, { icon: string; tag: string; border: string }> = {
  'Academic Grammar':          { icon: 'bg-blue-600',   tag: 'bg-blue-50 text-blue-700',   border: 'border-blue-100' },
  'Phonics for Kids':          { icon: 'bg-purple-600', tag: 'bg-purple-50 text-purple-700', border: 'border-purple-100' },
  'Phonics for Adults':        { icon: 'bg-indigo-600', tag: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-100' },
  'Spoken English for Adults': { icon: 'bg-teal-600',   tag: 'bg-teal-50 text-teal-700',   border: 'border-teal-100' },
  'Language Classes for Kids': { icon: 'bg-orange-500', tag: 'bg-orange-50 text-orange-700', border: 'border-orange-100' },
}

function SeatBadge({ current, max }: { current: number; max: number }) {
  const remaining = max - current
  const pct = current / max
  if (pct >= 1) return <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Full</span>
  if (pct >= 0.8) return <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Almost Full</span>
  return <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{remaining} left</span>
}

export function BatchList({ batches }: BatchListProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-1.5 text-center">Our Programs</h2>
      <p className="text-center text-gray-500 text-sm mb-10">English learning for every age and goal</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CLASS_TYPES.map((classType) => {
          const meta = CLASS_TYPE_META[classType]
          const theme = CARD_THEME[classType as ClassType]
          const typeBatches = batches.filter((b) => b.class_type === classType)

          return (
            <div key={classType} className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col ${theme.border}`}>
              {/* Card header */}
              <div className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${theme.icon}`}>
                  {PROGRAM_ICONS[classType as ClassType]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 leading-tight">{classType}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-snug">{meta.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${theme.tag}`}>
                      {meta.audience === 'kids' ? 'For Kids' : 'For Adults'}
                    </span>
                    {meta.grades && (
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {meta.grades}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Batch rows */}
              {typeBatches.length > 0 && (
                <div className="border-t border-gray-50 divide-y divide-gray-50 mt-auto">
                  {typeBatches.map((batch) => (
                    <div key={batch.id} className="px-5 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{batch.name}</p>
                        <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Clock size={11} />
                          {batch.schedule}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Users size={11} />
                          {batch.current_count}/{batch.max_seats}
                        </span>
                        <SeatBadge current={batch.current_count} max={batch.max_seats} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {typeBatches.length === 0 && (
                <div className="border-t border-gray-50 px-5 py-3 text-xs text-gray-400 italic">
                  No batches scheduled yet — contact us to enroll.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
