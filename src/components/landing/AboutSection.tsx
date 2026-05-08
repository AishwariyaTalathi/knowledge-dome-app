import Image from 'next/image'
import { UserRound } from 'lucide-react'

const TAGS = [
  'Jolly Phonics Certified',
  'Academic Grammar',
  'Spoken English',
  '20+ Years Experience',
]

const GALLERY: { src: string; alt: string }[] = [
  { src: '/images/gallery/classroom.jpg', alt: 'Students in creative writing class' },
  { src: '/images/gallery/online-class.jpg', alt: 'Online class in progress' },
  { src: '/images/gallery/reading.jpg', alt: 'Student reading aloud' },
  { src: '/images/gallery/books.jpg', alt: 'Reading materials in class' },
  { src: '/images/gallery/group-1.jpg', alt: 'Class group photo' },
  { src: '/images/gallery/group-2.jpg', alt: 'Students and teacher' },
]

function TeacherPhoto() {
  return (
    <div className="w-44 h-56 rounded-2xl overflow-hidden relative flex-shrink-0 bg-brand-50 border border-brand-100">
      <Image
        src="/images/teacher.jpg"
        alt="Minakshi — English Language Educator"
        fill
        className="object-cover object-top"
        sizes="176px"
      />
    </div>
  )
}

function GalleryCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 33vw, 25vw"
      />
    </div>
  )
}

export function AboutSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Meet the Teacher</h2>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

          {/* Teacher photo */}
          <TeacherPhoto />

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-0.5">Minakshi Talathi</h3>
            <p className="text-brand-800 font-medium text-sm mb-4">
              English Language Educator · Pune
            </p>
            <p className="text-gray-600 leading-relaxed mb-5">
              A doctor by profession and an educator by passion, Minakshi has spent over 20 years
              helping children and adults speak English with confidence. What began as a warm,
              in-person class in Pune evolved through the pandemic into a thriving online and offline
              institution — bringing her teaching to students across different cities, countries, and
              time zones. She specialises in Jolly Phonics, Academic Grammar, and Spoken English,
              giving every student the individual attention they deserve.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="bg-brand-50 text-brand-800 text-xs font-medium px-3 py-1 rounded-full border border-brand-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            From the classroom
          </p>
          {/* Mobile: horizontal scroll strip. Desktop: 3-column grid */}
          <div className="md:hidden">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none">
              {GALLERY.map((photo) => (
                <div
                  key={photo.src}
                  className="relative flex-shrink-0 w-[90vw] aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 snap-start"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="90vw"
                  />
                </div>
              ))}
            </div>
            {/* Dot indicators + swipe hint */}
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex gap-1.5">
                {GALLERY.map((photo, i) => (
                  <div
                    key={photo.src}
                    className={`rounded-full transition-all ${i === 0 ? 'w-4 h-1.5 bg-brand-800' : 'w-1.5 h-1.5 bg-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400">Swipe for more →</p>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-3">
            {GALLERY.map((photo) => (
              <GalleryCard key={photo.src} src={photo.src} alt={photo.alt} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
