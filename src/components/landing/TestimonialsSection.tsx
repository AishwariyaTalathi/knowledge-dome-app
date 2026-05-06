import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      "My son recently completed Level-1 Phonics from Minakshi's Knowledge Dome. I am grateful for Ma'am's efforts on my son as a Semi-English medium student. He loved attending classes. Very happy and satisfied — she arranges special programs as required by each student.",
    name: 'Saili Karandikar Tambe',
    role: 'Parent',
    stars: 5,
  },
  {
    quote:
      "If you are looking for the best class, Minakshi's Knowledge Dome is it. Ma'am's teaching skills are amazing and very innovative. My son enjoyed each and every session and it helped him upgrade his skills. Ma'am focused on grammar and communication skills. Thank you so much for everything!",
    name: 'Mrs. Thombare',
    role: 'Parent',
    stars: 5,
  },
  {
    quote:
      "Kids really enjoy it!! Your system of teaching is not only bookish but covers overall knowledge — kids don't want to miss the class. Thanks!",
    name: 'Mr. Atul Kothari',
    role: 'Parent',
    stars: 5,
  },
  {
    quote:
      "My kid showed a lot of improvement after joining Minakshi's Knowledge Dome. She is very happy to go for her classes. Ma'am is very patient and has great teaching skills. Would definitely recommend joining her class.",
    name: 'Mrs. Phadnis',
    role: 'Parent',
    stars: 5,
  },
  {
    quote:
      "Awesome learning, confidence building & grooming of language from every aspect — that's Minakshi's Knowledge Dome. Lovely place to learn.",
    name: 'Seema Purohit',
    role: 'Parent',
    stars: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="bg-brand-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          What Parents Say
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Real experiences from our community
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-brand-100 shadow-sm p-5 flex flex-col"
            >
              <StarRating count={t.stars} />
              <p className="text-sm text-gray-600 leading-relaxed my-3 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-800 flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
