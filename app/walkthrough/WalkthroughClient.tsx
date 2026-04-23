'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const CALENDLY_BASE =
  'https://calendly.com/anand-gobotsai/ai-execution-strategy-session'

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'live.com',
  'me.com',
])

const REGULATED_KEYWORDS = [
  'health', 'medical', 'patient', 'clinic', 'hospital', 'hipaa', 'cipa', 'phi',
  'finance', 'fintech', 'bank', 'mortgage', 'lend', 'loan', 'insurance',
  'compliance', 'audit', 'regulator', 'regulated', 'governance', 'legal',
  'consent', 'pii', 'soc2', 'hitrust', 'fedramp',
]

type FormState = {
  name: string
  email: string
  company: string
  scenario: string
}

const INITIAL: FormState = { name: '', email: '', company: '', scenario: '' }

export default function WalkthroughClient() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [intent, setIntent] = useState<'priority' | 'standard'>('standard')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.name || !form.email || !form.company || !form.scenario) return
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return

    const domain = form.email.split('@')[1]?.toLowerCase() ?? ''
    const isCorpEmail = domain.length > 0 && !FREE_EMAIL_DOMAINS.has(domain)
    const text = (form.scenario + ' ' + form.company).toLowerCase()
    const hasRegulatedKeyword = REGULATED_KEYWORDS.some((kw) => text.includes(kw))
    setIntent(isCorpEmail && hasRegulatedKeyword ? 'priority' : 'standard')
    setSubmitted(true)
  }

  const calendlyUrl = (() => {
    const params = new URLSearchParams({
      name: form.name,
      email: form.email,
      a1: form.company,
      a2: form.scenario,
      hide_gdpr_banner: '1',
      background_color: '0d0d0d',
      text_color: 'f5f5f5',
      primary_color: 'd4532a',
    })
    return `${CALENDLY_BASE}?${params.toString()}`
  })()

  return (
    <main className="bg-[#050505] overflow-hidden min-h-screen">
      <Nav />
      <section className="pt-32 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
            <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">
              Scenario Walkthrough
            </p>
            <h1 className="text-[36px] md:text-[52px] font-extrabold text-[#F5F5F5] leading-[1.08] tracking-tight mb-5">
              {submitted
                ? 'Pick a time. Founder will arrive briefed.'
                : 'Bring the workflow you actually worry about.'}
            </h1>
            <p className="text-[16px] text-[#CFCFCF] max-w-xl mx-auto leading-relaxed">
              {submitted
                ? `${form.name.split(' ')[0]}, your context is captured. The calendar below routes you to a 20-minute working session.`
                : '20 minutes. Live. On your scenario. You will see the signed runtime evidence your compliance team should already have.'}
            </p>
            {!submitted && (
              <Link
                href="/"
                className="inline-block mt-4 text-[14px] font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Back to home
              </Link>
            )}
          </div>

          {!submitted ? (
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-10 items-start">
              <aside className="space-y-5">
                <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-6">
                  <p className="text-[11px] tracking-[0.22em] text-[#8A8A8A] uppercase font-semibold mb-3">
                    Who you meet
                  </p>
                  <p className="text-[15px] font-semibold text-[#F5F5F5]">Anand Parankussam</p>
                  <p className="text-[13px] text-[#9CA3AF] mt-1.5 leading-relaxed">
                    Enterprise AI &amp; Automation Leader. ex-IBM, UWM, Adient. Governance systems
                    deployed across fintech, mortgage, automotive, manufacturing, banking,
                    insurance, and other regulated sectors.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-6">
                  <p className="text-[11px] tracking-[0.22em] text-[#8A8A8A] uppercase font-semibold mb-4">
                    Agenda · 20 min
                  </p>
                  <ol className="space-y-3 text-[14px] text-[#CFCFCF] leading-relaxed">
                    <li className="flex gap-3">
                      <span className="text-accent font-mono text-[11px] mt-1">01</span>
                      <span>Your scenario, in your words. Five minutes.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-mono text-[11px] mt-1">02</span>
                      <span>Live: GoVTraceAI evaluates a real example from your domain.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-mono text-[11px] mt-1">03</span>
                      <span>The signed Duty-of-Care Record your team would receive.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-mono text-[11px] mt-1">04</span>
                      <span>Week-1 deployment shape and what you would own.</span>
                    </li>
                  </ol>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-6">
                  <p className="text-[11px] tracking-[0.22em] text-[#8A8A8A] uppercase font-semibold mb-2">
                    Read first
                  </p>
                  <p className="text-[13px] text-[#9CA3AF] leading-relaxed">
                    The live evidence artifact. Signed and verifiable in your browser.{' '}
                    <Link
                      href="/evidence-gap"
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      Open the artifact →
                    </Link>
                  </p>
                </div>
              </aside>

              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/[0.08] bg-[#0D0D0D] p-7 md:p-9 shadow-2xl shadow-black/50"
              >
                <p className="text-[11px] tracking-[0.22em] text-[#8A8A8A] uppercase font-semibold mb-1">
                  Step 1 of 2
                </p>
                <h2 className="text-[20px] font-bold text-[#F5F5F5] mb-1.5">
                  Tell us the context.
                </h2>
                <p className="text-[14px] text-[#9CA3AF] mb-6 leading-relaxed">
                  We will pull up the calendar next. Your information goes only to the founder.
                </p>

                <div className="space-y-5">
                  <Field label="Your name" id="name">
                    <input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-md px-4 py-3 text-[15px] text-white focus:outline-none focus:border-accent transition"
                      autoComplete="name"
                    />
                  </Field>

                  <Field
                    label="Work email"
                    id="email"
                    hint="Use your corporate domain so we can route appropriately."
                  >
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-md px-4 py-3 text-[15px] text-white focus:outline-none focus:border-accent transition"
                      autoComplete="email"
                    />
                  </Field>

                  <Field label="Company and your role" id="company">
                    <input
                      id="company"
                      required
                      placeholder="Sharp HealthCare · VP, Compliance"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-md px-4 py-3 text-[15px] text-white placeholder:text-[#555] focus:outline-none focus:border-accent transition"
                      autoComplete="organization"
                    />
                  </Field>

                  <Field
                    label="Scenario in one line"
                    id="scenario"
                    hint="Ambient scribe consent. Patient-messaging copilot. Prior-auth model. The thing that keeps your team up."
                  >
                    <textarea
                      id="scenario"
                      required
                      rows={3}
                      value={form.scenario}
                      onChange={(e) => setForm({ ...form, scenario: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-md px-4 py-3 text-[15px] text-white placeholder:text-[#555] focus:outline-none focus:border-accent transition resize-none"
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#c44625] active:scale-[0.99] transition-all text-[15px] shadow-lg shadow-accent/20"
                >
                  Continue to calendar
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2 7h10M7 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <p className="mt-4 text-center text-[12px] text-[#8A8A8A]">
                  No SDR follow-up. No drip sequence. Founder reads it.
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              {intent === 'priority' && (
                <div className="max-w-3xl mx-auto rounded-xl border border-accent/40 bg-accent/[0.06] px-5 py-4 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 animate-live-dot" />
                  <p className="text-[14px] text-[#F5F5F5] leading-relaxed">
                    <span className="font-semibold">Priority lane.</span>{' '}
                    <span className="text-[#CFCFCF]">
                      Same-week founder slots prioritized for your scenario.
                    </span>
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50 bg-[#0D0D0D]">
                <iframe
                  src={calendlyUrl}
                  title="Pick a time · Gobots"
                  className="w-full"
                  style={{ height: '780px', border: 'none' }}
                  loading="lazy"
                />
              </div>

              <p className="text-center text-[13px] text-[#8A8A8A]">
                Reply-to on the calendar invite is{' '}
                <span className="text-[#CFCFCF] font-mono">anand@gobotsai.com</span>. Founder reads
                it.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}

function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string
  id: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] tracking-[0.18em] text-[#8A8A8A] uppercase font-semibold mb-2"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] text-[#6B7280] leading-relaxed">{hint}</p>}
    </div>
  )
}
