'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const LOGS = [
  { tag: 'INPUT',   msg: 'invoice_q3_final.pdf',          status: 'received',     sc: '#9CA3AF' },
  { tag: 'PARSE',   msg: 'Extracting structured fields',   status: '47 found',     sc: '#9CA3AF' },
  { tag: 'GOVERN',  msg: 'PII scan — SSN, email',          status: 'SAFE ✓',       sc: '#4ADE80' },
  { tag: 'GOVERN',  msg: 'Prompt injection check',         status: 'SAFE ✓',       sc: '#4ADE80' },
  { tag: 'EXECUTE', msg: 'POST /api/v2/erp/invoices',      status: '200 OK',       sc: '#9CA3AF' },
  { tag: 'AUDIT',   msg: 'Compliance trail committed',     status: 'logged',       sc: '#9CA3AF' },
  { tag: 'OUTPUT',  msg: 'Invoice #INV-4821 posted',       status: 'done · 8.3s', sc: '#D4532A' },
]

const TAG_COLOR: Record<string, string> = {
  GOVERN:  '#D4532A',
  OUTPUT:  '#D4532A',
  EXECUTE: '#9CA3AF',
  INPUT:   '#6B7280',
  PARSE:   '#6B7280',
  AUDIT:   '#6B7280',
}

function ExecutionTerminal() {
  const [lines, setLines] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let count = 0

    function step() {
      count++
      setLines(count)
      if (count < LOGS.length) {
        timerRef.current = setTimeout(step, 500 + Math.random() * 280)
      } else {
        timerRef.current = setTimeout(() => {
          setLines(0)
          count = 0
          timerRef.current = setTimeout(step, 380)
        }, 3200)
      }
    }

    timerRef.current = setTimeout(step, 700)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-[#080808] shadow-2xl shadow-black/60">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0C0C0C] border-b border-white/[0.05]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
        </div>
        <span className="text-[10px] text-[#6B7280] tracking-[0.12em] font-mono uppercase">
          Execution Engine · v2.1.0
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-live-dot" />
          <span className="text-[10px] text-[#22C55E] font-semibold tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Log body */}
      <div className="px-5 py-5 font-mono text-[12.5px] space-y-2.5 min-h-[248px]">
        {LOGS.slice(0, lines).map((log, i) => (
          <div key={i} className="flex items-center gap-3 leading-none animate-fade-line">
            <span className="text-[#4B5563] w-5 text-right shrink-0 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="text-[10px] font-bold tracking-widest w-[58px] shrink-0 uppercase"
              style={{ color: TAG_COLOR[log.tag] ?? '#555' }}
            >
              {log.tag}
            </span>
            <span className="text-[#E5E7EB] flex-1 truncate">{log.msg}</span>
            <span className="shrink-0 font-semibold" style={{ color: log.sc }}>
              {log.status}
            </span>
          </div>
        ))}

        {/* Cursor line */}
        {lines < LOGS.length && (
          <div className="flex items-center gap-3">
            <span className="text-[#4B5563] w-5 text-right shrink-0">
              {String(lines + 1).padStart(2, '0')}
            </span>
            <span
              className="text-[10px] font-bold tracking-widest w-[58px] shrink-0 uppercase"
              style={{ color: TAG_COLOR[LOGS[lines]?.tag] ?? '#555' }}
            >
              {LOGS[lines]?.tag}
            </span>
            <span className="text-[#D4532A] animate-blink">▌</span>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-5 py-2.5 bg-[#0C0C0C] border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-[10px] text-[#6B7280] font-mono">govtrace-engine · governed</span>
        <span className="text-[10px] font-mono" style={{ color: lines === LOGS.length ? '#4ADE80' : '#6B7280' }}>
          {lines}/{LOGS.length} steps ·{' '}
          {lines === LOGS.length ? '✓ complete' : 'executing…'}
        </span>
      </div>
    </div>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}
const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 20% 60%, rgba(212,83,42,0.04) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* ── Left: Copy ── */}
          <div>
            <motion.div
              variants={fadeUp} initial="initial" animate="animate"
              transition={{ duration: 0.55, ease, delay: 0 }}
              className="mb-5"
            >
              <div className="w-8 h-[2px] bg-accent mb-2" />
              <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase">
                AI Execution Company
              </p>
            </motion.div>

            <motion.h1
              className="text-[48px] md:text-[62px] font-extrabold text-[#F5F5F5] leading-[1.06] tracking-[-1.5px] mb-6"
              variants={fadeUp} initial="initial" animate="animate"
              transition={{ duration: 0.55, ease, delay: 0.07 }}
            >
              AI systems that<br />
              actually get<br />
              <span className="text-accent">deployed.</span>
            </motion.h1>

            <motion.p
              className="text-[17px] text-[#CFCFCF] leading-relaxed mb-3 max-w-lg"
              variants={fadeUp} initial="initial" animate="animate"
              transition={{ duration: 0.55, ease, delay: 0.14 }}
            >
              Week 1: your workflow → working system.
              <br />No discovery theatre.
            </motion.p>

            {/* Credibility */}
            <motion.div
              className="mb-9 mt-6 pl-3 border-l border-white/[0.08]"
              variants={fadeUp} initial="initial" animate="animate"
              transition={{ duration: 0.55, ease, delay: 0.2 }}
            >
              <p className="text-[13px] text-[#A3A3A3] leading-relaxed">
                <span className="text-[#F5F5F5] font-medium">Anand Parankussam</span>
                {' '}· ex-IBM, UWM, Adient
              </p>
              <p className="text-[12px] text-[#9CA3AF] mt-1">
                Systems deployed across Apple, UBS, BCBS, Nationwide, Qantas
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
              variants={fadeUp} initial="initial" animate="animate"
              transition={{ duration: 0.55, ease, delay: 0.26 }}
            >
              <a
                href="#live-proof"
                className="inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold text-[14px] px-5 py-3 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all shadow-lg shadow-accent/20"
              >
                Try Live Demo
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-[#f15a29] border border-[#f15a29]/70 px-5 py-3 rounded-xl hover:bg-[#f15a29]/10 hover:border-[#f15a29] transition-all"
              >
                Book Strategy Session
              </Link>
            </motion.div>
          </div>

          {/* ── Right: Terminal ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.35 }}
          >
            <ExecutionTerminal />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
