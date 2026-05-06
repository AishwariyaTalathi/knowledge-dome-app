import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { TopBar } from './TopBar'

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="md:ml-64 pb-20 md:pb-8 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </main>
      <MobileNav />
    </div>
  )
}
