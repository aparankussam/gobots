'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PIPELINE = [
  {
    id: 'input',
    label: 'INPUT',
    detail: 'Your real workflow data',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M4.5 9h5M4.5 11.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'ai',
    label: 'AI ENGINE',
    detail: 'Reasoning + extraction',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 5V3M11 5V3M7 15v-2M11 15v-2M3 7H5M3 11H5M13 7h2M13 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'govern',
    label: 'GOVERN',
    detail: 'PII · injection · audit',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L3 5v5c0 3.3 2.5 5.8 6 6.5 3.5-.7 6-3.2 6-6.5V5L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M6 9.5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'execute',
    label: 'EXECUTE',
    detail: 'API · ERP · systems',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 3v12M3 9l6-6 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'output',
    label: 'OUTPUT',
    detail: 'Result + audit trail',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const BADGES = [
  { value: '$10M+', label: 'ROI delivered' },
  { value: '230+',  label: 'Plants deployed' },
  { value: '3',     label: 'Continents' },
  { value: 'Day 1', label: 'Governance on' },
]

function PipelineFlow() {
  const [active, setActive] = useState(0)
  const [traveling, setTraveling] = useState<number | null>(null)

  useEffect(() => {
    let step = 0
    let timeout: ReturnType<typeof setTimeout>

    function advance() {
      if (step < PIPELINE.length - 1) {
        setTraveling(step)
        timeout = setTimeout(() => {
          step++
          setActive(step)
          setTraveling(null)
          timeout = setTimeout(advance, 600)
        }, 900)
      } else {
        timeout = setTimeout(() => {
          step = 0
          setActive(0)
          setTraveling(null)
          timeout = setTimeout(advance, 500)
        }, 2000)
      }
    }

    timeout = setTimeout(advance, 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex items-center w-full overflow-x-auto pb-2">
      {PIPELINE.map((node, i) => (
        <div key={node.id} className="flex items-center flex-1 min-w-0">
          {/* Node */}
          <div
            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-500 flex-1 min-w-[80px] ${
              i <= active
                ? 'border-accent/40 bg-accent/[0.06] text-accent'
                : 'border-white/[0.05] bg-[#0D0D0D] text-[#444]'
            } ${i === active ? 'animate-node-ring' : ''}`}
          >
            <div className={`transition-all duration-300 ${i === active ? 'scale-110' : 'scale-100'}`}>
              {node.icon}
            </div>
            <span className="text-[9px] font-bold tracking-widest text-center">{node.label}</span>
            <span className="text-[9px] text-[#555] text-center leading-tight hidden sm:block">{node.detail}</span>
            {/* Active dot */}
            {i === active && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-live-dot" />
            )}
          </div>

          {/* Connector line */}
          {i < PIPELINE.length - 1 && (
            <div className="relative h-0.5 w-6 md:w-8 shrink-0 bg-white/[0.05] overflow-hidden mx-0.5">
              {/* Filled progress */}
              <div
                className="absolute inset-y-0 left-0 bg-accent/60 transition-all duration-500"
                style={{ width: i < active ? '100%' : '0%' }}
              />
              {/* Traveling packet */}
              {traveling === i && (
                <div className="absolute inset-y-0 w-3 bg-accent animate-travel" />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Approach() {
  return (
    <section className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-[2px] bg-accent mb-2" />
            <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">
              The Gobots Approach
            </p>
            <h2 className="text-[38px] md:text-[48px] font-extrabold text-[#F5F5F5] leading-[1.1] tracking-tight mb-6">
              Week 1:<br />working system.
            </h2>
            <p className="text-[17px] text-[#CFCFCF] leading-relaxed mb-10">
              We deploy against your real workflow in the first week.
              No sandbox. No POC. Production-grade from day one.
            </p>

            <div className="space-y-5">
              {[
                { week: 'Week 1',  title: 'Working system', body: 'Built on your actual data, workflow, and environment. Not a demo.' },
                { week: 'Week 2–4', title: 'Refinement + governance', body: 'We wire in guardrails, integrate upstream/downstream systems, iterate.' },
                { week: 'After',   title: 'Scale', body: 'Same governance layer. New use cases. No rebuild.' },
              ].map((row) => (
                <div key={row.week} className="flex gap-4">
                  <div className="w-20 shrink-0 pt-0.5">
                    <span className="text-[11px] font-bold tracking-widest text-accent uppercase">{row.week}</span>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#F5F5F5] mb-0.5">{row.title}</p>
                    <p className="text-[14px] text-[#A3A3A3] leading-snug">{row.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Badges */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl border border-white/[0.06] bg-[#0D0D0D] p-4 flex flex-col gap-1"
                >
                  <span className="text-[26px] font-extrabold text-[#F5F5F5] tracking-tight leading-none">
                    {b.value}
                  </span>
                  <span className="text-[12px] text-[#666]">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Pipeline animation */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-5">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-live-dot" />
                <span className="text-[11px] font-semibold tracking-widest text-[#555] uppercase">
                  Execution pipeline · live
                </span>
              </div>
              <PipelineFlow />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
