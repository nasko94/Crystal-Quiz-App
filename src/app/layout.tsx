import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crystal Energy Quiz - Намери своя кристал',
  description: 'Интерактивен въпросник за намиране на перфектния кристал за теб',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

