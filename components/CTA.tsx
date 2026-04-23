'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
          <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">
            Scenario Walkthrough
          </p>
          <h2 className="text-[38px] md:text-[52px] font-extrabold text-[#F5F5F5] leading-[1.08] tracking-tight mb-5">
            Map the first system we should deploy.
          </h2>
          <p className="text-[17px] text-[#CFCFCF] max-w-lg mx-auto leading-relaxed mb-3">
            Bring the workflow. We&apos;ll use the session to identify the highest-leverage
            automation path and what execution looks like in Week 1.
          </p>
          <p className="text-[14px] text-[#8A8A8A]">No commitment. No discovery fee. Just execution.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50 max-w-2xl mx-auto bg-[#0D0D0D] p-8 md:p-10 text-center"
        >
          <p className="text-[15px] text-[#CFCFCF] leading-relaxed max-w-xl mx-auto mb-8">
            Choose a time for a focused strategy session and we&apos;ll walk through your current
            workflow, constraints, and the fastest route to a working deployment.
          </p>

          <Link
            href="/walkthrough"
            className="inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-[#c44625] active:scale-[0.99] transition-all text-[15px] tracking-wide shadow-lg shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            Request a Walkthrough
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 7h10M7 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <p className="text-center text-[13px] text-[#8A8A8A] mt-5">
            Four fields. Founder reads it. Reply-to is{' '}
            <span className="text-[#CFCFCF] font-mono">anand@gobotsai.com</span>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
