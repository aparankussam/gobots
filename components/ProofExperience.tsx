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
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-8 text-center bg-[#0f0f0f] rounded-2xl">
      <div>
        <p className="text-[15px] font-semibold text-[#F5F5F5] mb-1">Live Demo Unavailable</p>
        <p className="text-[13px] text-[#8A8A8A] mb-5">
          The interactive demo is temporarily unavailable.
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
    </div>
  )
}

const traditionalSteps = [
  'Week 1–2: Kickoff, requirements',
  'Week 3–4: Workshops, alignment',
  'Week 5–6: Technical discovery',
  'Week 7–8: Architecture proposal',
  'Week 9+: Build begins (maybe)',
  '→ Output: A plan',
]

const gobotsSteps = [
  'Day 1: Workflow mapping',
  'Day 3: First system running',
  'Day 5–7: Real output, real feedback',
  'Week 2–4: Refine, govern, integrate',
  'Week 5+: Scale across use cases',
  '→ Output: A working system',
]

export default function ProofExperience() {
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
    <section id="proof" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── PROBLEM BLOCK ── */}
        <div className="mb-24">
          <div className="w-8 h-[2px] bg-accent mb-2" />
          <p className="text-accent text-xs tracking-[0.22em] font-semibold uppercase mb-3">
            The Problem
          </p>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            AI projects don&apos;t fail in theory.
            <br />
            They fail in execution.
          </motion.h2>

          <div className="flex flex-col gap-4">
            {[
              'Discovery cycles that run 4–8 weeks and produce slides',
              'Prototypes that never reach production',
              'Governance treated as a checkpoint, not a foundation',
            ].map((point, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.08,
                }}
              >
                <span className="text-[#444] font-medium mt-0.5">—</span>
                <p className="text-[#888] text-base leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CONTRAST BLOCK ── */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional */}
            <motion.div
              className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[#9CA3AF] text-xs tracking-[0.22em] font-semibold uppercase mb-6">
                Traditional
              </p>
              <div className="flex flex-col gap-3">
                {traditionalSteps.map((step, i) => {
                  const isLast = i === traditionalSteps.length - 1
                  return (
                    <p
                      key={i}
                      className={`text-sm leading-relaxed ${
                        isLast
                          ? 'text-red-400 font-medium mt-2'
                          : 'text-[#555]'
                      }`}
                    >
                      {step}
                    </p>
                  )
                })}
              </div>
            </motion.div>

            {/* Gobots */}
            <motion.div
              className="bg-[#0a0f0a] border border-accent/25 rounded-2xl p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <p className="text-accent text-xs tracking-[0.22em] font-semibold uppercase mb-6">
                Gobots
              </p>
              <div className="flex flex-col gap-3">
                {gobotsSteps.map((step, i) => {
                  const isLast = i === gobotsSteps.length - 1
                  return (
                    <p
                      key={i}
                      className={`text-sm leading-relaxed ${
                        isLast
                          ? 'text-accent font-medium mt-2'
                          : 'text-[#aaa]'
                      }`}
                    >
                      {step}
                    </p>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── LIVE DEMO BLOCK ── */}
        <div>
          <div className="w-8 h-[2px] bg-accent mb-2" />
          <p className="text-accent text-xs tracking-[0.22em] font-semibold uppercase mb-3">
            See It In Action
          </p>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            GoVTraceAI — live in your browser.
          </motion.h2>
          <p className="text-[#888] text-lg leading-relaxed mb-10 max-w-2xl">
            This is how Gobots systems work — immediate, real feedback. Paste
            any text. See risk flags in under a second.
          </p>

          <motion.div
            className="overflow-hidden rounded-2xl border border-white/[0.08]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{ minHeight: iframeState === 'failed' ? 'auto' : '480px' }}
          >
            {iframeState === 'failed' ? (
              <IframeFallback demoUrl={DEMO_URL || undefined} />
            ) : (
              <div className="relative">
                {/* Loading skeleton */}
                {iframeState === 'loading' && (
                  <div className="absolute inset-0 bg-[#0f0f0f] flex items-center justify-center gap-3 z-10 rounded-2xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-live-dot" />
                    <span className="text-[13px] text-[#555] font-mono">Connecting to demo…</span>
                  </div>
                )}
                <iframe
                  src={DEMO_URL}
                  className="w-full rounded-2xl border border-white/[0.08] bg-[#0f0f0f]"
                  style={{ height: '480px' }}
                  frameBorder="0"
                  title="GoVTraceAI Live Demo"
                  onLoad={handleLoad}
                  onError={handleError}
                />
              </div>
            )}
          </motion.div>
          <p className="text-[#444] text-xs mt-4 text-center">
            GoVTraceAI — AI safety layer by Gobots
          </p>
        </div>
      </div>
    </section>
  )
}
