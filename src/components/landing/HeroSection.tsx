import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const COURSE_PILLS = ['Phonics', 'Grammar', 'Spoken English', 'Kids & Adults']

export function HeroSection() {
  return (
    <section
      className="relative text-white overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 15% 50%, rgba(30, 136, 229, 0.5) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 15%, rgba(100, 181, 246, 0.25) 0%, transparent 45%),
          radial-gradient(ellipse at 65% 85%, rgba(13, 71, 161, 0.7) 0%, transparent 50%),
          linear-gradient(155deg, #1976d2 0%, #1565C0 35%, #0d47a1 65%, #1a237e 100%)
        `,
      }}
    >
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-10 pb-24 grid md:grid-cols-2 gap-10 items-center">

        {/* Left — text content */}
        <div className="text-center md:text-left order-2 md:order-1">
          {/* Enrolling badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-xs font-medium text-white/80 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
            Enrolling Now · Pune, Maharashtra
          </div>

          <h1 className="text-3xl md:text-5xl font-bold italic mb-3 leading-tight">
            Minakshi&apos;s<br />Knowledge Dome
          </h1>

          <p className="text-blue-200 text-sm md:text-base mb-6 font-sans not-italic leading-relaxed max-w-sm mx-auto md:mx-0">
            Building confident communicators, one student at a time.
          </p>

          {/* Course pills */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
            {COURSE_PILLS.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-white/10 border border-white/25 rounded-full px-3 py-1 text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white text-brand-800 font-semibold px-6 py-2.5 rounded-full hover:bg-blue-50 transition-colors shadow-md text-sm"
            >
              Enroll Now
              <ArrowRight size={15} />
            </a>
            <a
              href="#classes"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-medium px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors text-sm"
            >
              View Classes
            </a>
          </div>
        </div>

        {/* Right — teacher photo with floating cards */}
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative">
            {/* Soft glow behind photo */}
            <div className="absolute inset-4 bg-blue-300/20 rounded-3xl blur-2xl" />

            {/* Photo */}
            <div className="relative w-52 h-64 md:w-72 md:h-96 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <Image
                src="/images/teacher.jpg"
                alt="Minakshi Talathi — English Language Educator"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 208px, 288px"
                priority
              />
            </div>

            {/* Floating credential — top right */}
            <div className="absolute -top-3 -right-4 bg-white rounded-2xl shadow-lg px-3 py-2 text-xs font-semibold text-brand-800 whitespace-nowrap">
              ✓ Jolly Phonics Certified
            </div>

            {/* Floating credential — bottom left */}
            <div className="absolute -bottom-3 -left-4 bg-white rounded-2xl shadow-lg px-3 py-2 text-xs font-semibold text-brand-800 whitespace-nowrap">
              🎓 20+ Years Experience
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 block">
          <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" fill="#f9fafb" />
        </svg>
      </div>
    </section>
  )
}
