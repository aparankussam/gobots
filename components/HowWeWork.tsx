'use client'

import { motion } from 'framer-motion'

const cards = [
  {
    week: 'WEEK 1',
    title: 'Working System',
    description:
      'A real AI agent running on your actual data and workflow. Not a demo. Not a prototype.',
  },
  {
    week: 'WEEKS 2–4',
    title: 'Refine & Govern',
    description:
      'Iterate on outputs. Wire in guardrails. Integrate with your stack. Governance is not a final step — it\'s how we build.',
  },
  {
    week: 'SCALE',
    title: 'Expand Across Use Cases',
    description:
      'One system becomes many. Same governance layer, new capabilities. No rebuild. No new vendor.',
  },
]

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="w-8 h-[2px] bg-accent mb-2" />
        <p className="text-accent text-xs tracking-[0.22em] font-semibold uppercase mb-3">
          How We Work
        </p>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6 max-w-xl">
          Stop planning AI.
          <br />
          Start running it.
        </h2>

        {/* Subtext */}
        <p className="text-[#888] text-lg leading-relaxed mb-16 max-w-2xl">
          Most AI projects spend the first 6 weeks in discovery. We ship a
          working system in the first week using your real workflow.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.week}
              className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-8 hover:border-accent/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.1,
              }}
            >
              <p className="text-accent text-xs tracking-[0.22em] font-semibold uppercase mb-4">
                {card.week}
              </p>
              <h3 className="text-white text-xl font-semibold mb-3">
                {card.title}
              </h3>
              <p className="text-[#888] text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
