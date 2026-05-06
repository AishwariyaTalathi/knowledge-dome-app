import Image from 'next/image'

export function TopBar() {
  return (
    <header className="md:hidden sticky top-0 z-10 bg-brand-800 text-white px-4 py-3 flex items-center gap-3 shadow-sm">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
        <Image src="/images/logo.png" alt="MKD Logo" width={32} height={32} />
      </div>
      <div>
        <p className="font-bold text-sm leading-tight">Minakshi's Knowledge Dome</p>
        <p className="text-brand-200 text-xs">Admin Panel</p>
      </div>
    </header>
  )
}
