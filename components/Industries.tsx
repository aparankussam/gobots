'use client'

import { motion } from 'framer-motion'

const industries = [
  {
    name: 'Mortgage',
    description:
      'Automate underwriting review, document extraction, and compliance flagging.',
  },
  {
    name: 'Manufacturing',
    description:
      'Real-time process monitoring, anomaly detection, and decision routing at the edge.',
  },
  {
    name: 'Healthcare',
    description:
      'Clinical document processing, prior auth workflows, and safety-checked AI communications.',
  },
  {
    name: 'Enterprise Operations',
    description:
      'Cross-functional AI agents for routing, approvals, and knowledge retrieval at scale.',
  },
]

export default function Industries() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="w-8 h-[2px] bg-accent mb-2" />
        <p className="text-accent text-xs tracking-[0.22em] font-semibold uppercase mb-3">
          Where We Deploy
        </p>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
          One system. Every industry.
        </h2>

        {/* Subtext */}
        <p className="text-[#888] text-lg leading-relaxed mb-16 max-w-2xl">
          The same execution layer applies across domains. The use case
          changes. The approach doesn&apos;t.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-6 hover:border-accent/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.1,
              }}
            >
              <h3 className="text-white font-semibold text-base mb-3">
                {industry.name}
              </h3>
              <p className="text-[#888] text-sm leading-relaxed">
                {industry.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
