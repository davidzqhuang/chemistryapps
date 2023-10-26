import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import './globals.css'

const lato = Lato({ subsets: ['latin'], weight: "400" })

export const metadata: Metadata = {
  title: 'App Tree',
  description: 'Useful applets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  )
}
