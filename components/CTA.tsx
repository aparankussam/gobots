'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// Swap to true once https://calendly.com/gobotsai/pilot is live
const CALENDLY_LIVE = false
const CALENDLY_URL =
  'https://calendly.com/gobotsai/pilot?embed_type=Inline&hide_gdpr_banner=1&background_color=0d0d0d&text_color=f5f5f5&primary_color=d4532a'

// Shared input styling — solid colors, no opacity tricks
const inputCls = [
  'w-full',
  'bg-[#0A0A0A]',
  'border border-[#2A2A2A]',
  'rounded-xl px-4 py-3',
  'text-[15px] font-[450] text-[#F5F5F5]',
  'placeholder:text-[#737373] placeholder:font-normal',
  'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20',
  'transition-colors duration-150',
].join(' ')

const labelCls = 'block text-[11px] font-semibold tracking-widest text-[#A3A3A3] uppercase mb-2'

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', usecase: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 11l5 5 9-9" stroke="#D4532A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-[22px] font-bold text-[#F5F5F5]">Request received.</p>
        <p className="text-[15px] text-[#CFCFCF] max-w-sm leading-relaxed">
          We&apos;ll be in touch within one business day to scope your Week&nbsp;1 pilot.
        </p>
        <p className="text-[13px] text-[#8A8A8A] mt-1">Or email directly: pilot@gobotsai.com</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Name</label>
          <input name="name" required value={form.name} onChange={handleChange}
            placeholder="Alex Rivera" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Work email</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange}
            placeholder="alex@company.com" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Company</label>
        <input name="company" required value={form.company} onChange={handleChange}
          placeholder="Acme Corp" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>What would you like to automate?</label>
        <textarea name="usecase" rows={4} required value={form.usecase} onChange={handleChange}
          placeholder="Describe your workflow — invoice processing, compliance checks, data routing…"
          className={`${inputCls} resize-none`} />
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#c44625] active:scale-[0.99] transition-all text-[15px] tracking-wide shadow-lg shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        Request a Pilot →
      </button>

      <p className="text-center text-[13px] text-[#8A8A8A]">
        No commitment. Response within 1 business day.
      </p>
    </form>
  )
}

export default function CTA() {
  return (
    <section id="calendly" className="py-24 md:py-32 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
          <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">
            Start Your Pilot
          </p>
          <h2 className="text-[38px] md:text-[52px] font-extrabold text-[#F5F5F5] leading-[1.08] tracking-tight mb-5">
            Run your Week 1 pilot.
          </h2>
          <p className="text-[17px] text-[#CFCFCF] max-w-lg mx-auto leading-relaxed mb-3">
            Tell us your workflow. We deploy a working AI system
            against your real data in the first week.
          </p>
          <p className="text-[14px] text-[#8A8A8A]">No commitment. No discovery fee. Just execution.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50 max-w-2xl mx-auto bg-[#0D0D0D]"
        >
          {CALENDLY_LIVE ? (
            <iframe
              src={CALENDLY_URL}
              title="Book a Pilot — Gobots"
              className="w-full"
              style={{ height: '700px', border: 'none' }}
              loading="lazy"
            />
          ) : (
            <ContactForm />
          )}
        </motion.div>

        <p className="text-center text-[13px] text-[#8A8A8A] mt-6">
          Prefer a call?{' '}
          <a href="mailto:pilot@gobotsai.com"
            className="text-accent hover:text-accent/80 transition-colors font-medium underline-offset-2 hover:underline">
            pilot@gobotsai.com
          </a>
        </p>
      </div>
    </section>
  )
}
