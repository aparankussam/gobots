'use client'

import { motion } from 'framer-motion'

const lines = [
  'Execution > Experimentation',
  'Systems > Ideas',
  'Production > Prototypes',
  'Governance > Slides',
]

export default function Philosophy() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
        <p className="text-accent text-xs tracking-[0.22em] font-semibold uppercase mb-16 text-center">
          How We Think
        </p>

        {/* Manifesto Lines */}
        <div className="flex flex-col items-center gap-6 text-center">
          {lines.map((line, index) => (
            <motion.p
              key={index}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.12,
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}
