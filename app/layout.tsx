import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StickyMobileCTA from '@/components/StickyMobileCTA'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Gobots · AI That Actually Executes',
  description:
    'Week 1: working AI system. No discovery. Real execution with governance built in from day one.',
  metadataBase: new URL('https://gobotsai.com'),
  openGraph: {
    title: 'Gobots · AI That Actually Executes',
    description:
      'Week 1: working AI system. No discovery. Real execution with governance.',
    url: 'https://gobotsai.com',
    siteName: 'Gobots',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Gobots · AI systems that actually get deployed',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gobots · AI That Actually Executes',
    description:
      'Week 1: working AI system. No discovery. Real execution with governance.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-[#050505] text-[#CFCFCF] antialiased font-sans">
        {children}
        <StickyMobileCTA />
      </body>
    </html>
  )
}
