'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  { href: '/#products', label: 'Products' },
  { href: '/sprint', label: 'How it works' },
  { href: '/capabilities', label: 'Capabilities' },
]

const PROOF = [
  { href: '/demo', label: 'Live demo', note: 'Run the gatekeeper' },
  { href: '/verify', label: 'Verify', note: 'Check a receipt' },
  { href: '/spec', label: 'Spec', note: 'Receipt format v1' },
  { href: '/evidence-gap', label: 'Evidence', note: 'Why logs are not evidence' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [proofOpen, setProofOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const proofRef = useRef<HTMLDivElement>(null)
  const proofBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setProofOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!proofOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setProofOpen(false)
      proofBtn.current?.focus()
    }
    const onDown = (e: MouseEvent) => {
      if (proofRef.current && !proofRef.current.contains(e.target as Node)) setProofOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [proofOpen])

  const proofActive = PROOF.some((p) => p.href === pathname)
  const linkCls = 'rounded-doc px-3 py-2 text-[14.5px] font-medium transition-colors'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-paper/95 transition-[border-color,box-shadow] duration-300 ${
        scrolled || open ? 'border-b border-rule shadow-[0_8px_24px_-20px_rgba(18,18,18,0.5)]' : 'border-b border-transparent'
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" aria-label="Gobots home" className="flex items-center gap-3">
          <Image src="/gobots-logo-ink.png" alt="Gobots" width={552} height={203} priority className="h-8 w-auto" />
          <span className="label hidden border-l border-rule pl-3 text-[10.5px] text-ink-2 sm:inline">
            Full-stack AI company
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((l) => (
            <Link key={l.href} href={l.href} className={`${linkCls} text-ink-2 hover:text-ink`}>
              {l.label}
            </Link>
          ))}
          <div
            ref={proofRef}
            className="relative"
            onBlur={(e) => {
              if (!proofRef.current?.contains(e.relatedTarget as Node | null)) setProofOpen(false)
            }}
          >
            <button
              ref={proofBtn}
              type="button"
              aria-expanded={proofOpen}
              aria-controls="proof-menu"
              onClick={() => setProofOpen((o) => !o)}
              className={`${linkCls} inline-flex items-center gap-1.5 ${
                proofActive ? 'text-ink underline decoration-seal decoration-2 underline-offset-[6px]' : 'text-ink-2 hover:text-ink'
              }`}
            >
              Proof
              <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true">
                <path d={proofOpen ? 'M1 5l3.5-3.5L8 5' : 'M1 1l3.5 3.5L8 1'} stroke="currentColor" strokeWidth="1.4" fill="none" />
              </svg>
            </button>
            {proofOpen && (
              <ul
                id="proof-menu"
                className="absolute right-0 top-full mt-2 w-64 rounded-doc border border-rule bg-paper-3 py-1 shadow-[0_18px_40px_-28px_rgba(18,18,18,0.6)]"
              >
                {PROOF.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      aria-current={pathname === p.href ? 'page' : undefined}
                      onClick={() => setProofOpen(false)}
                      className="flex items-baseline justify-between gap-3 px-4 py-2.5 hover:bg-paper-2"
                    >
                      <span className="text-[14.5px] font-medium">{p.label}</span>
                      <span className="text-[12px] text-ink-3">{p.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {pathname !== '/walkthrough' && (
            <Link href="/walkthrough" className="btn-seal ml-3 px-4 py-2.5 text-[14px]">
              Start a Production Sprint
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="label flex items-center gap-2 rounded-doc px-2 py-2 text-[11px] lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? 'Close' : 'Menu'}
          <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true">
            <path d={open ? 'M3 0l10 10M13 0L3 10' : 'M0 1h16M0 9h16'} stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="wrap max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-rule pb-6 lg:hidden">
          <ul>
            {[...SECTIONS, ...PROOF].map((l) => (
              <li key={l.href} className="border-b border-rule">
                <Link href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-3.5 heading text-[22px]">
                  {l.label}
                  <span className="font-mono text-[11px] text-ink-3">{l.href}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/walkthrough" className="btn-seal mt-6 w-full">
            Start a Production Sprint
          </Link>
        </nav>
      )}
    </header>
  )
}
