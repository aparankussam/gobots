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
  const hasExternalDemo = Boolean(demoUrl)

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(245,116,69,0.16),transparent_32%),linear-gradient(180deg,#111111_0%,#090909_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_30%,transparent_70%,rgba(245,116,69,0.06))]" />
      <div className="relative px-6 py-12 sm:px-8 sm:py-14 md:px-12 md:py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D6D6D6]">
              {hasExternalDemo ? 'Demo currently unavailable' : 'Interactive demo coming soon'}
            </span>
            <h3 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-[#F5F5F5] sm:text-[34px]">
              {hasExternalDemo ? 'The live environment is offline right now.' : 'A guided LiveProof experience is on the way.'}
            </h3>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#B7B7B7] sm:text-[16px]">
              {hasExternalDemo
                ? 'GoVTraceAI is still available as a product layer, and the interactive environment will be back shortly.'
                : 'We are shaping the public demo to reflect the same production-grade guardrails, speed, and clarity our clients see in live deployments.'}
            </p>
          </div>

          {hasExternalDemo ? (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 self-center rounded-xl bg-accent px-6 py-3 text-[14px] font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-[#c44625] active:scale-[0.98] md:self-auto"
            >
              Open Demo in New Tab
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ) : null}
        </div>

        <div className="relative mt-10 grid gap-3 sm:grid-cols-3">
          {[
            'Instant SAFE / WARNING / BLOCK decisions',
            'Policy-aware review tuned for real workflows',
            'Deployable as an API or embedded control layer',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 text-center text-[13px] font-medium leading-6 text-[#D2D2D2] backdrop-blur-sm sm:text-left"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
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
             iframeState === 'failed' ? (isDemoAvailable ? 'GoVTraceAI · demo currently unavailable' : 'GoVTraceAI · interactive demo coming soon') :
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
