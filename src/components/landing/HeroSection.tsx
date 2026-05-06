import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative text-white pt-10 pb-24 px-4 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 15% 50%, rgba(30, 136, 229, 0.5) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 15%, rgba(100, 181, 246, 0.25) 0%, transparent 45%),
          radial-gradient(ellipse at 65% 85%, rgba(13, 71, 161, 0.7) 0%, transparent 50%),
          linear-gradient(155deg, #1976d2 0%, #1565C0 35%, #0d47a1 65%, #1a237e 100%)
        `,
      }}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Logo */}
        <div className="w-28 h-28 rounded-full bg-white shadow-xl mb-4 ring-2 ring-white/30 overflow-hidden flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Minakshi's Knowledge Dome"
            width={112}
            height={112}
            priority
            className="rounded-full"
          />
        </div>

        {/* Pill badge */}
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-xs font-medium text-white/80 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          Enrolling Now · Pune, Maharashtra
        </div>

        <h1 className="text-2xl md:text-4xl font-bold italic mb-2 leading-tight">
          Minakshi&apos;s Knowledge Dome
        </h1>
        <p className="text-brand-200 text-sm md:text-base mb-2 font-sans not-italic">
          Building confident communicators, one student at a time.
        </p>
        <p className="text-brand-300/80 text-xs mb-5 font-sans tracking-widest uppercase">
          Phonics · Grammar · Spoken English · Kids &amp; Adults
        </p>

        <a
          href="#contact"
          className="inline-flex items-center gap-2 bg-white text-brand-800 font-semibold px-6 py-2.5 rounded-full hover:bg-brand-50 transition-colors shadow-md text-sm"
        >
          Enroll Now
          <ArrowRight size={15} />
        </a>
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
