'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: '🔍',
    label: 'PII Detection',
    description:
      'Flags SSNs, emails, and personal data before they leave your system.',
  },
  {
    icon: '🛡',
    label: 'Injection Prevention',
    description:
      'Catches prompt injection attempts, jailbreaks, and instruction overrides.',
  },
  {
    icon: '⚡',
    label: 'Overclaim Filtering',
    description:
      'Detects language that creates regulatory or legal exposure.',
  },
]

export default function Product() {
  return (
    <section id="govtrace" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="w-8 h-[2px] bg-accent mb-2" />
        <p className="text-accent text-xs tracking-[0.22em] font-semibold uppercase mb-3">
          Product
        </p>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6 max-w-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Check before you send.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-[#888] text-lg leading-relaxed mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          GoVTraceAI is a lightweight safety layer that runs before content
          reaches your LLM — catching risks before they become incidents.
        </motion.p>

        {/* Feature Rows */}
        <div className="flex flex-col gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              className="flex items-start gap-6 bg-[#0f0f0f] border border-white/[0.07] rounded-xl p-6 hover:border-accent/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.1,
              }}
            >
              <span className="text-2xl mt-0.5 flex-shrink-0">{feature.icon}</span>
              <div>
                <h3 className="text-white font-semibold mb-1">{feature.label}</h3>
                <p className="text-[#888] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="#proof"
          className="text-accent font-medium text-sm hover:text-accent/80 transition-colors flex items-center gap-1 w-fit"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          Try GoVTraceAI
          <span aria-hidden>→</span>
        </motion.a>
      </div>
    </section>
  )
}
