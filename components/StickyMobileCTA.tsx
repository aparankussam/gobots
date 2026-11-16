'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { REVXL_EDITIONS } from '@/content/site'

const SCAN = REVXL_EDITIONS[0].freeScan!

/** Sprint button everywhere; the free scan while the RevXL mortgage record is on screen. */
export default function StickyMobileCTA() {
  const pathname = usePathname()
  const [onRevxl, setOnRevxl] = useState(false)

  useEffect(() => {
    setOnRevxl(false)
    const el = document.querySelector('[data-revxl-record]')
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setOnRevxl(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [pathname])

  if (pathname === '/walkthrough') return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
      {onRevxl ? (
        <a href={SCAN.href} target="_blank" rel="noopener noreferrer" className="btn-seal w-full py-3.5">
          {SCAN.label}
        </a>
      ) : (
        <>
          <Link href="/walkthrough" className="btn-seal w-full py-3.5">
            Start a Production Sprint
          </Link>
          <p className="mt-1.5 text-center text-[12px] text-ink-3">20-minute call. No commitment, no discovery fee.</p>
        </>
      )}
    </div>
  )
}
