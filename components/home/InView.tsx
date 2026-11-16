'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Marks its subtree `is-inview` once 25% of it is visible, then stops
 * observing. CSS in globals.css holds the receipt's motion until then.
 */
export default function InView({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    setReady(true)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${ready ? 'js-inview' : ''} ${seen ? 'is-inview' : ''} ${className}`}>
      {children}
    </div>
  )
}
