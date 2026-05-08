'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function TopBar() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="md:hidden sticky top-0 z-10 bg-brand-800 text-white px-4 py-3 flex items-center gap-3 shadow-sm">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
        <Image src="/images/logo.png" alt="MKD Logo" width={32} height={32} />
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm leading-tight">Minakshi's Knowledge Dome</p>
        <p className="text-brand-200 text-xs">Admin Panel</p>
      </div>
      <button
        onClick={handleLogout}
        className="p-2 rounded-lg hover:bg-brand-700 transition-colors"
        aria-label="Logout"
      >
        <LogOut size={18} />
      </button>
    </header>
  )
}
