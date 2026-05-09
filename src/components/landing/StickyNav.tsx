'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Classes', href: '#classes' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Announcements', href: '#announcements' },
  { label: 'Contact', href: '#contact' },
]

export function StickyNav() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_ITEMS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1))
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(href) },
        { rootMargin: '-30% 0px -60% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <nav className="max-w-4xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-2.5" style={{ scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={cn(
                'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                active === href
                  ? 'bg-brand-800 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
