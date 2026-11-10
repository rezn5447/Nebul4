import type { Metadata, Viewport } from 'next'
import { Archivo, Inter } from 'next/font/google'

import { siteUrl } from '@/lib/site-url'

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

const description =
  'Nebul4 is a rock en español tribute band from Santa Maria, California, playing Soda Stereo, Gustavo Cerati and Caifanes.'

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: 'Nebul4 · Rock en español tribute',
    template: '%s · Nebul4',
  },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Nebul4',
    locale: 'en_US',
    title: 'Nebul4 · Rock en español tribute',
    description,
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // data-scroll-behavior lets Next turn off smooth scrolling during route changes.
    <html lang="en" data-scroll-behavior="smooth" className={`${archivo.variable} ${inter.variable} antialiased`}>
      <body className="min-w-0 bg-void text-bone">{children}</body>
    </html>
  )
}
