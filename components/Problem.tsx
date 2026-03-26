'use client'

import { motion } from 'framer-motion'

const TIMELINE = [
  { week: 'Week 1–2', label: 'Kickoff calls', sub: 'Align on vision' },
  { week: 'Week 3–4', label: 'Discovery phase', sub: 'Document current state' },
  { week: 'Week 5–6', label: 'Requirements deck', sub: '47-slide PowerPoint' },
  { week: 'Week 7–8', label: 'Proposal review', sub: 'Back to stakeholders' },
  { week: '???',      label: 'Still planning',  sub: 'No system. No output.', bad: true },
]

const POINTS = [
  { n: '4–8', unit: 'weeks', label: 'of discovery before a single line of production code' },
  { n: '73%', unit: '',      label: 'of AI pilots never reach deployment. They die as slides.' },
  { n: '0',   unit: '',      label: 'working systems produced after weeks of "alignment"' },
]

export default function Problem() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <div className="w-8 h-[2px] bg-accent mb-2" />
          <p className="text-[#f15a29] text-sm font-semibold tracking-[0.22em] uppercase mb-3">
  THE PROBLEM
</p>
          <h2 className="text-[38px] md:text-[48px] font-extrabold text-[#F5F5F5] leading-[1.1] tracking-tight mb-5">
            AI reality:<br />planning ≠ progress.
          </h2>
          <p className="text-[17px] text-[#CFCFCF] leading-relaxed">
            Most enterprise AI initiatives produce PowerPoints, not systems.
            The process optimises for alignment, not execution.
          </p>
        </motion.div>

        {/* Broken timeline */}
        <div className="mb-16 overflow-x-auto pb-2">
          <div className="flex items-stretch gap-0 min-w-[640px]">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex items-center flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={`flex-1 rounded-xl p-4 border ${
                    item.bad
                      ? 'border-red-500/20 bg-red-500/[0.04]'
                      : 'border-white/[0.05] bg-[#0D0D0D]'
                  }`}
                >
                  <p className={`text-[10px] font-bold tracking-widest uppercase mb-1.5 ${
                    item.bad ? 'text-red-500/60' : 'text-[#444]'
                  }`}>
                    {item.week}
                  </p>
                  <p className={`text-[14px] font-semibold mb-0.5 ${
                    item.bad ? 'text-red-400' : 'text-[#F5F5F5]'
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-[12px] text-[#8A8A8A]">{item.sub}</p>
                </motion.div>
                {i < TIMELINE.length - 1 && (
                  <div className={`w-6 shrink-0 flex items-center justify-center ${
                    i >= 3 ? 'opacity-30' : ''
                  }`}>
                    <svg width="20" height="2" viewBox="0 0 20 2" fill="none">
                      <path d="M0 1h20" stroke="#333" strokeWidth="1.5" strokeDasharray={i >= 2 ? '3 3' : undefined}/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {POINTS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="rounded-2xl border border-white/[0.05] bg-[#0D0D0D] p-6"
            >
              <p className="text-[40px] font-extrabold text-[#F5F5F5] leading-none tracking-tight mb-1">
                {p.n}
                {p.unit && <span className="text-[22px] text-accent ml-1">{p.unit}</span>}
              </p>
              <p className="text-[14px] text-[#A3A3A3] leading-snug mt-2">{p.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
