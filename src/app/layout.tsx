import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: "Minakshi's Knowledge Dome",
  description: 'English teaching class management — Pune, India',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  )
}
