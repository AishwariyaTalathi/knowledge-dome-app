'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, Bell, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/batches', label: 'Batches', icon: BookOpen },
  { href: '/announcements', label: 'Announcements', icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-brand-800 fixed left-0 top-0 z-20">
      {/* Header */}
      <div className="px-6 py-6 border-b border-brand-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
            <Image src="/images/logo.png" alt="MKD Logo" width={40} height={40} />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Minakshi's</p>
            <p className="text-brand-200 text-xs">Knowledge Dome</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-900 text-white'
                  : 'text-brand-100 hover:bg-brand-700 hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-brand-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-100 hover:bg-brand-700 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}
