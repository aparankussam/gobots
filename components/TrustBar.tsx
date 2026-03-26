'use client'

import { motion } from 'framer-motion'

const COMPANIES = [
  'Apple', 'IBM', 'UBS', 'BCBS', 'Nationwide', 'Qantas', 'UWM', 'Adient',
]

export default function TrustBar() {
  return (
    <section className="border-y border-white/[0.05] py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
        <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase text-center mb-8">
          Experience across global enterprise systems
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {COMPANIES.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="text-[15px] font-bold tracking-tight text-[#3d3d3d] hover:text-[#666] transition-colors select-none cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
