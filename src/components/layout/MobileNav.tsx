'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, Bell, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/batches', label: 'Batches', icon: BookOpen },
  { href: '/announcements', label: 'Notices', icon: Bell },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 safe-area-pb">
      <div className="flex">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors',
                active ? 'text-brand-800' : 'text-gray-500'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              {label}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium text-gray-500"
        >
          <LogOut size={20} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </nav>
  )
}
