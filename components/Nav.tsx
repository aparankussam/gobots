'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const GOVTRACE_DEMO_URL = '/demo'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
  {/* Logo */}
  <div className="flex items-center gap-4">
    <Link href="/" aria-label="Gobots home" className="flex items-center">
      <Image
        src="/gobots-logo.png"
        alt="Gobots"
        width={180}
        height={48}
        priority
        className="h-16 w-auto object-contain"
        style={{ filter: 'brightness(1.08) contrast(1.04)' }}
      />
    </Link>
    <span className="text-[#D1D5DB] text-[11px] tracking-[0.18em] font-medium uppercase hidden sm:inline select-none ml-2">
      AI Execution Co.
    </span>
  </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/spec"
            className="text-sm font-medium text-white/70 hover:text-white px-2 py-2 transition-colors"
          >
            Spec
          </Link>
          <Link
            href="/verify"
            className="text-sm font-medium text-white/70 hover:text-white px-2 py-2 transition-colors"
          >
            Verify
          </Link>
          <Link
            href={GOVTRACE_DEMO_URL}
            className="text-sm font-medium text-accent border border-accent/40 px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors"
          >
            Try the Live Demo
          </Link>
          <Link
            href="/walkthrough"
            className="text-sm font-medium bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Request a Walkthrough
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#080808]/95 backdrop-blur-md border-t border-white/[0.06] px-6 py-6 flex flex-col gap-4">
          <Link
            href="/spec"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-white/80 hover:text-white text-center py-2"
          >
            Spec
          </Link>
          <Link
            href="/verify"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-white/80 hover:text-white text-center py-2"
          >
            Verify
          </Link>
          <Link
            href={GOVTRACE_DEMO_URL}
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-accent border border-accent/40 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors text-center"
          >
            Try the Live Demo
          </Link>
          <Link
            href="/walkthrough"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium bg-accent text-white px-4 py-3 rounded-lg hover:bg-accent/90 transition-colors text-center"
          >
            Request a Walkthrough
          </Link>
        </div>
      )}
    </header>
  )
}
