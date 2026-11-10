import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'

import './globals.css'

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  axes: ['wdth'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Nebul4 · Rock en español tribute',
    template: '%s · Nebul4',
  },
  description:
    'Nebul4 is a rock en español tribute band from Santa Maria, California, playing Soda Stereo, Gustavo Cerati and Caifanes.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} antialiased`}>
      <body className="min-w-0 bg-void text-bone">{children}</body>
    </html>
  )
}
