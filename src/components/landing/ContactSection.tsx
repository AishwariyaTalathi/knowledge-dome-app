import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/utils'

const PHONE = '+919604555029'
const EMAIL = 'minakshisknowledgedome@gmail.com'
const ADDRESS = 'Premnagar Society, Pune Satara Road, Pune 411037'
const INSTAGRAM = 'https://www.instagram.com/knowledgedome/'

export function ContactSection() {
  return (
    <section id="contact" className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Get in Touch</h2>
      <p className="text-center text-gray-500 text-sm mb-8">
        Ready to enroll or have questions? We&apos;d love to hear from you.
      </p>

      <div className="bg-brand-800 rounded-2xl text-white p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <a
              href={`tel:${PHONE}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-brand-200 font-medium uppercase tracking-wide">Phone</p>
                <p className="font-semibold">{PHONE}</p>
              </div>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-brand-200 font-medium uppercase tracking-wide">Email</p>
                <p className="font-semibold break-all">{EMAIL}</p>
              </div>
            </a>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-brand-200 font-medium uppercase tracking-wide">Address</p>
                <p className="font-semibold leading-snug">{ADDRESS}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center md:items-start gap-4">
            <p className="text-brand-200 text-sm text-center md:text-left">
              The quickest way to reach us is via WhatsApp. Send us a message and we&apos;ll get back to you shortly.
            </p>
            <a
              href={whatsappLink(PHONE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-md"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-200 text-sm text-center">
            Classes held in Pune · Batches for kids and adults · Limited seats per batch
          </p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors flex-shrink-0"
          >
            {/* Instagram icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
            @knowledgedome
          </a>
        </div>
      </div>
    </section>
  )
}
