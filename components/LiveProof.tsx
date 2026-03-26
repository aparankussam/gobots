'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const DEMO_URL = 'https://govtrace.gobotsai.com'
// Timeout before declaring the iframe as unreachable (ms)
const LOAD_TIMEOUT = 9000

type IframeState = 'loading' | 'loaded' | 'failed'

function IframeFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-8 text-center bg-[#0A0A0A]">
      {/* Terminal-style header */}
      <div className="w-full max-w-md rounded-xl border border-white/[0.07] bg-[#080808] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0C0C0C] border-b border-white/[0.05]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
          </div>
          <span className="text-[10px] text-[#444] font-mono tracking-wider">GoVTraceAI</span>
          <span className="text-[10px] text-[#555] font-mono">v2.1.0</span>
        </div>
        <div className="px-5 py-5 font-mono text-[12px] space-y-2">
          {[
            { tag: 'INPUT',  msg: 'My SSN is 123-45-6789',          status: 'received',  sc: '#666' },
            { tag: 'GOVERN', msg: 'SSN pattern detected',           status: 'HIGH',      sc: '#ef4444' },
            { tag: 'GOVERN', msg: 'Prompt injection attempt',       status: 'HIGH',      sc: '#ef4444' },
            { tag: 'OUTPUT', msg: 'Verdict: BLOCK',                 status: '⛔ BLOCK',  sc: '#ef4444' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[9px] font-bold tracking-widest w-[52px] shrink-0 text-[#D4532A] uppercase">{l.tag}</span>
              <span className="text-[#777] flex-1 truncate">{l.msg}</span>
              <span className="shrink-0 font-semibold" style={{ color: l.sc }}>{l.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[15px] font-semibold text-[#F5F5F5] mb-1">Live Demo</p>
        <p className="text-[13px] text-[#8A8A8A] mb-5">
          The interactive demo runs at govtrace.gobotsai.com
        </p>
        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-[#c44625] active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
        >
          Open Full Demo
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default function LiveProof() {
  const [iframeState, setIframeState] = useState<IframeState>('loading')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // If iframe hasn't reported load after LOAD_TIMEOUT, fall back
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
          className="flex items-center gap-2 mb-3 justify-center"
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
            <IframeFallback />
          ) : (
            <div className="relative" style={{ height: '640px' }}>
              {/* Loading skeleton */}
              {iframeState === 'loading' && (
                <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center gap-3 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-live-dot" />
                  <span className="text-[13px] text-[#555] font-mono">Connecting to govtrace.gobotsai.com…</span>
                </div>
              )}
              <iframe
                src={DEMO_URL}
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
          GoVTraceAI · govtrace.gobotsai.com · Available as API or embedded layer
        </p>
      </div>
    </section>
  )
}
