'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { eventForHref, track } from '@/lib/track'

/**
 * Vercel Web Analytics (cookie-free page views) plus four event counts:
 * sprint button clicks, free-scan clicks, live checks run (tracked in the checker)
 * and sprint-form starts. Enable Web Analytics in the Vercel project for it to report.
 */
export default function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a')
      const name = eventForHref(a?.getAttribute('href') ?? null)
      if (name) track(name, { from: window.location.pathname, kind: a?.classList.contains('btn-seal') ? 'button' : 'link' })
    }
    let started = false
    const onFocus = (e: FocusEvent) => {
      if (started) return
      if ((e.target as Element | null)?.closest?.('form[data-track-form]')) {
        started = true
        track('form_start')
      }
    }
    document.addEventListener('click', onClick)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('focusin', onFocus)
    }
  }, [])

  if (process.env.NODE_ENV !== 'production') return null
  return (
    <>
      <Script id="va-init" strategy="afterInteractive">
        {'window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };'}
      </Script>
      <Script src="/_vercel/insights/script.js" strategy="afterInteractive" defer />
    </>
  )
}
