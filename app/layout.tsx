import type { Metadata, Viewport } from 'next'
import { Archivo, IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import Analytics from '@/components/Analytics'
import { SITE_META } from '@/content/meta'

const serif = Source_Serif_4({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const sans = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
  metadataBase: new URL('https://gobotsai.com'),
  openGraph: {
    title: SITE_META.title,
    description: SITE_META.shareDescription,
    url: 'https://gobotsai.com',
    siteName: 'Gobots',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE_META.ogAlt }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_META.title,
    description: SITE_META.shareDescription,
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#F2F2EE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-paper text-ink antialiased font-sans">
        {children}
        <StickyMobileCTA />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Gobots',
              url: 'https://gobotsai.com',
              logo: 'https://gobotsai.com/gobots-logo-ink.png',
              description: SITE_META.description,
            }),
          }}
        />
      </body>
    </html>
  )
}
