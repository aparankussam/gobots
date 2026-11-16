'use client'

import { Children, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { EVIDENCE_LABEL, getClaim, type ClaimId } from '@/content/claims'

/** useLayoutEffect in the browser, useEffect on the server (no SSR warning). */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Plain text of a React node, for the marker's accessible name. */
function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((n) => (typeof n === 'string' || typeof n === 'number' ? String(n) : isValidElement(n) ? textOf((n.props as { children?: ReactNode }).children) : ''))
    .join('')
}

function shorten(s: string, max = 60) {
  const t = s.replace(/\s+/g, ' ').trim().replace(/[.,;:]+$/, '')
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t
}

/**
 * A factual claim plus a small marker that reveals its source.
 * An id missing from the register renders nothing, so an unsourced
 * fact cannot reach the page.
 */
export default function Claim({
  id,
  children,
  tone = 'paper',
  label,
}: {
  id: ClaimId
  children: ReactNode
  tone?: 'paper' | 'ink'
  /** Short name for screen readers when the claim's text isn't plain. */
  label?: string
}) {
  const claim = getClaim(id)
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const pop = useRef<HTMLSpanElement>(null)
  const [shift, setShift] = useState(0)
  const popId = useId()

  // Keep the popover inside the viewport: measure it unshifted, then nudge it
  // left or right so it clears a 12px gutter on both sides.
  useIsoLayoutEffect(() => {
    if (!open || !pop.current) return
    const GUTTER = 12
    const r = pop.current.getBoundingClientRect()
    let dx = 0
    if (r.right > window.innerWidth - GUTTER) dx = window.innerWidth - GUTTER - r.right
    if (r.left + dx < GUTTER) dx = GUTTER - r.left
    setShift(Math.round(dx))
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      btn.current?.focus()
    }
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [open])

  if (!claim) {
    if (process.env.NODE_ENV !== 'production') console.error(`Claim "${id}" has no register entry`)
    return null
  }

  const ring = tone === 'ink' ? 'text-paper/70 hover:text-paper' : 'text-seal-ink hover:text-ink'
  const popTone =
    tone === 'ink'
      ? 'border-rule-inv bg-ink text-paper'
      : 'border-rule bg-paper-3 text-ink shadow-[0_14px_30px_-20px_rgba(18,18,18,0.55)]'

  return (
    <span ref={wrap} className="relative inline">
      {children}
      {'⁠'}
      <button
        type="button"
        ref={btn}
        aria-label={`Source for ${shorten(label ?? textOf(children))}: ${EVIDENCE_LABEL[claim.evidence]}`}
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => {
          setShift(0)
          setOpen((o) => !o)
        }}
        className={`relative -top-[0.55em] ml-0.5 inline-flex h-6 w-6 items-center justify-center align-baseline ${ring}`}
      >
        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
          <circle cx="4.5" cy="4.5" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <span
          id={popId}
          ref={pop}
          role="note"
          style={{ transform: `translateX(${shift}px)` }}
          className={`absolute left-0 top-full z-30 mt-1 block w-[min(18rem,calc(100vw-24px))] whitespace-normal rounded-doc border p-3 text-left font-sans text-[13px] font-normal normal-case leading-snug tracking-normal ${popTone}`}
        >
          <span className="label block text-[10.5px] opacity-70">{EVIDENCE_LABEL[claim.evidence]}</span>
          <span className="mt-1 block">{claim.source}</span>
          {claim.href && (
            <Link href={claim.href} className="mt-2 inline-block underline underline-offset-4">
              Open the evidence
            </Link>
          )}
        </span>
      )}
    </span>
  )
}
