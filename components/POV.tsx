'use client'

import { motion } from 'framer-motion'

const STATEMENTS = [
  { quote: 'AI doesn\'t fail in theory.\nIt fails in production.',                       sub: 'Every project looks viable in a slide deck.' },
  { quote: 'You don\'t scale ideas.\nYou scale systems.',                                sub: 'Ideas are table stakes. Systems are the moat.' },
  { quote: 'Speed without governance breaks.\nGovernance without execution stalls.',     sub: 'Both are required. Both ship on Day 1.' },
  { quote: 'Most teams plan AI.\nFew actually deploy it.',                               sub: '73% of AI pilots die before production.' },
]

export default function POV() {
  return (
    <section className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-14">
          <div className="w-8 h-[2px] bg-accent mb-2" />
          <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">Our Point of View</p>
          <h2 className="text-[38px] md:text-[48px] font-extrabold text-[#F5F5F5] leading-[1.1] tracking-tight">
            Contrarian by design.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {STATEMENTS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.45 }}
              className="rounded-2xl border border-white/[0.05] bg-[#0D0D0D] p-7 hover:border-white/[0.1] transition-colors"
            >
              <p className="text-[20px] font-bold text-[#F5F5F5] leading-[1.35] tracking-tight mb-3 whitespace-pre-line">{s.quote}</p>
              <p className="text-[13px] text-[#8A8A8A]">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Founder story */}
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-2xl border border-accent/20 bg-accent/[0.03] p-8 md:p-10"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent mb-5">Built from the inside out</p>
          <p className="text-[20px] font-bold text-[#F5F5F5] mb-4 leading-snug">
            Built across IBM → scaled at UWM → deployed at Adient.<br />
            Now focused on execution, not experimentation.
          </p>
          <p className="text-[15px] text-[#888] leading-relaxed max-w-2xl">
            A decade inside enterprise AI programmes — watching strong ideas get buried in governance theatre,
            discovery cycles, and slide decks that never shipped.
            Gobots exists because execution, not experimentation, creates value.
            We don&rsquo;t consult. We build. We deploy. We govern. Week 1.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-7">
            {['Execution > experimentation', 'Systems > ideas', 'Production > prototypes'].map((p) => (
              <span key={p} className="text-[12px] font-semibold tracking-wide text-[#666]">{p}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
