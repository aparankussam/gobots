'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const DEMO_URL = process.env.NEXT_PUBLIC_GOVTRACE_URL
const isDemoAvailable = Boolean(DEMO_URL)
// Timeout before declaring the iframe as unreachable (ms)
const LOAD_TIMEOUT = 9000

type IframeState = 'loading' | 'loaded' | 'failed'

type IframeFallbackProps = {
  demoUrl?: string
}

function IframeFallback({ demoUrl }: IframeFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-8 text-center bg-[#0A0A0A]">
      <p className="text-[18px] font-bold text-[#F5F5F5]">Live demo unavailable</p>
      <p className="text-[14px] text-[#8A8A8A] max-w-md">
        The interactive demo is temporarily unavailable. Please try again later.
      </p>
      {demoUrl && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-[#c44625] active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
        >
          Open Demo in New Tab
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )}
    </div>
  )
}

export default function LiveProof() {
  const [iframeState, setIframeState] = useState<IframeState>(isDemoAvailable ? 'loading' : 'failed')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isDemoAvailable) return

    timeoutRef.current = setTimeout(() => {
      setIframeState(s => s === 'loading' ? 'failed' : s)
    }, LOAD_TIMEOUT)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])
  function handleLoad() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIframeState('loaded')
  }

  function handleError() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIframeState('failed')
  }

  return (
    <section id="live-proof" className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
          <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">
            Live Proof
          </p>
          <h2 className="text-[38px] md:text-[48px] font-extrabold text-[#F5F5F5] leading-[1.1] tracking-tight mb-4">
            See it run.
          </h2>
          <p className="text-[17px] text-[#CFCFCF] max-w-xl mx-auto leading-relaxed">
            Paste any prompt. Get instant{' '}
            <span className="text-[#22C55E] font-semibold">SAFE</span>{' '}
            /{' '}
            <span className="text-[#F59E0B] font-semibold">WARNING</span>{' '}
            /{' '}
            <span className="text-red-400 font-semibold">BLOCK</span>.
            <br />
            This is how Gobots systems work in production.
          </p>
        </motion.div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex items-center gap-2 mb-4 justify-center"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${
            iframeState === 'loaded'  ? 'bg-[#22C55E] animate-live-dot' :
            iframeState === 'failed'  ? 'bg-[#F59E0B]' :
            'bg-[#555] animate-live-dot'
          }`} />
          <span className="text-[11px] font-semibold tracking-widest text-[#555] uppercase">
            {iframeState === 'loaded' ? 'GoVTraceAI · live' :
             iframeState === 'failed' ? 'GoVTraceAI · open externally' :
             'GoVTraceAI · connecting…'}
          </span>
        </motion.div>

        {/* Demo container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-white/[0.07] overflow-hidden shadow-2xl shadow-black/50"
          style={{ minHeight: iframeState === 'failed' ? 'auto' : '640px' }}
        >
          {iframeState === 'failed' ? (
            <IframeFallback demoUrl={DEMO_URL || undefined} />
          ) : (
            <div className="relative" style={{ height: '640px' }}>
              {/* Loading skeleton */}
              {iframeState === 'loading' && (
                <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center gap-3 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-live-dot" />
                  <span className="text-[13px] text-[#555] font-mono">Connecting to demo…</span>
                </div>
              )}
              <iframe
                src={DEMO_URL || undefined}
                title="GoVTraceAI — Live Demo"
                className="w-full h-full"
                style={{ border: 'none', background: '#080808' }}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
              />
            </div>
          )}
        </motion.div>

        <p className="text-center text-[13px] text-[#8A8A8A] mt-5">
          GoVTraceAI · Available as API or embedded layer
        </p>
      </div>
    </section>
  )
}
