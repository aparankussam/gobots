'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Guilloche from '@/components/doc/Guilloche'
import Stamp from '@/components/doc/Stamp'
import { Arrow } from '@/components/doc/icons'

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

const FIELD_ORDER: (keyof FormState)[] = ['name', 'email', 'company', 'scenario']

const AGENDA = [
  'Your workflow, in your words.',
  'What week 1 would ship, and how it is governed.',
  'A live GoVTraceAI check on an example from your domain.',
  'Which engine fits: strategy, a sprint pod or a product.',
]

/** Display-only messages for the existing validation rules. */
function fieldErrors(form: FormState): Partial<Record<keyof FormState, string>> {
  const e: Partial<Record<keyof FormState, string>> = {}
  if (!form.name) e.name = 'Add your name so your architect knows who to expect.'
  if (!form.email) e.email = 'Add your work email. The invite is sent here.'
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    e.email = 'That address looks incomplete. Use the form name@company.com.'
  if (!form.company) e.company = 'Add your company and role, for example “Acme Bank · Head of Risk”.'
  if (!form.scenario) e.scenario = 'One line is enough. Name the workflow you want to see run.'
  return e
}

export default function WalkthroughClient() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [intent, setIntent] = useState<'priority' | 'standard'>('standard')
  const [attempted, setAttempted] = useState(false)

  const errors = attempted ? fieldErrors(form) : {}

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAttempted(true)
    const firstInvalid = FIELD_ORDER.find((k) => fieldErrors(form)[k])
    if (firstInvalid) document.getElementById(firstInvalid)?.focus()

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
      background_color: 'f2f2ee',
      text_color: '121212',
      primary_color: 'e0643a',
    })
    return `${CALENDLY_BASE}?${params.toString()}`
  })()

  const firstName = form.name.split(' ')[0]

  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="wrap pb-24 pt-14 md:pb-32 md:pt-20 lg:pt-24">
          {!submitted ? (
            <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
              {/* Heading + explanation (left on desktop, first on mobile) */}
              <div className="lg:col-span-5 lg:row-start-1">
                <h1 className="display text-[clamp(2.75rem,6vw,4.75rem)]">
                  Bring the workflow you want running<span className="text-seal">.</span>
                </h1>
                <p className="mt-7 max-w-[30rem] text-[18px] leading-[1.55] text-ink-2">
                  <span className="text-ink">20 minutes with an architect, not a salesperson.</span>{' '}
                  No commitment, no discovery fee.{' '}
                  Strategy, a Production Sprint or a product briefing, whichever fits.
                </p>
              </div>

              {/* Request slip (right on desktop, second on mobile) */}
              <form
                onSubmit={handleSubmit}
                noValidate
                data-track-form="sprint"
                className="min-w-0 border-y border-ink/80 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-start"
              >
                <div className="flex items-baseline justify-between gap-4 border-b border-rule py-4">
                  <p className="text-[15px] font-semibold">Sprint request</p>
                  <p className="text-[13px] text-ink-3">Step 1 of 2</p>
                </div>

                <div className="pt-6">
                  <h2 className="heading text-[28px]">Tell us the context<span className="text-seal">.</span></h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                    The calendar opens next. Your details are used only to prepare your call. They are passed to our scheduling provider, Calendly.
                  </p>
                </div>

                <div className="mt-8 space-y-6 pb-8">
                  <Field label="Your name" id="name" error={errors.name}>
                    <input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass(!!errors.name)}
                      autoComplete="name"
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                  </Field>

                  <Field
                    label="Work email"
                    id="email"
                    hint="The calendar invite is sent to this address."
                    error={errors.email}
                  >
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass(!!errors.email)}
                      autoComplete="email"
                      inputMode="email"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? 'email-error' : 'email-hint'}
                    />
                  </Field>

                  <Field label="Company and your role" id="company" error={errors.company}>
                    <input
                      id="company"
                      required
                      placeholder="Acme Corp · Head of Operations"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className={inputClass(!!errors.company)}
                      autoComplete="organization"
                      aria-invalid={errors.company ? true : undefined}
                      aria-describedby={errors.company ? 'company-error' : undefined}
                    />
                  </Field>

                  <Field
                    label="Scenario in one line"
                    id="scenario"
                    hint="Invoice intake. Loan document review. Patient messaging. Release testing. The workflow that matters most."
                    error={errors.scenario}
                  >
                    <textarea
                      id="scenario"
                      required
                      rows={3}
                      value={form.scenario}
                      onChange={(e) => setForm({ ...form, scenario: e.target.value })}
                      className={`${inputClass(!!errors.scenario)} resize-none`}
                      aria-invalid={errors.scenario ? true : undefined}
                      aria-describedby={errors.scenario ? 'scenario-error' : 'scenario-hint'}
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-3 border-t border-rule py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[13px] text-ink-3 sm:order-1">
                    No sales sequence. No drip emails. The call is the next step.
                  </p>
                  <button type="submit" className="btn-ink w-full py-3.5 sm:order-2 sm:w-auto">
                    Continue to calendar
                    <Arrow />
                  </button>
                </div>
              </form>

              {/* What happens (left on desktop, last on mobile) */}
              <aside className="space-y-10 lg:col-span-5 lg:row-start-2 lg:self-start">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-rule pt-5 text-[15px] leading-relaxed">
                  <span className="label pt-[3px] text-[10.5px] text-ink-3">You meet</span>
                  <p className="text-ink-2">
                    <span className="font-semibold text-ink">Anand Parankussam</span>, Enterprise AI
                    &amp; Automation Leader (ex-IBM, UWM, Adient). Governance systems deployed across
                    fintech, mortgage, automotive, manufacturing, banking, insurance, and other
                    regulated sectors.
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between border-b border-ink/80 pb-2">
                    <h2 className="text-[15px] font-semibold">Agenda</h2>
                    <span className="text-[13px] text-ink-3">20 minutes</span>
                  </div>
                  <ol>
                    {AGENDA.map((item, i) => (
                      <li
                        key={item}
                        className="grid grid-cols-[2rem_1fr] gap-3 border-b border-rule py-3.5 text-[15px] leading-relaxed text-ink-2"
                      >
                        <span className="tnum font-semibold text-ink-3">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="text-[15px] leading-relaxed text-ink-2">
                  <p>
                    Read first: an illustrated evidence artifact, showing what a signed record of an AI action looks like.
                  </p>
                  <Link
                    href="/evidence-gap"
                    className="mt-2 inline-flex items-center gap-2 font-semibold text-ink hover:text-seal-ink"
                  >
                    Open the illustration
                    <Arrow />
                  </Link>
                  <p className="mt-6">
                    <Link href="/" className="link-ink text-[14px] text-ink-3 hover:text-ink">
                      Back to home
                    </Link>
                  </p>
                </div>
              </aside>
            </div>
          ) : (
            <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h1 className="display text-[clamp(2.75rem,6vw,4.75rem)]">
                  Details ready. Pick a time to book<span className="text-seal">.</span>
                </h1>
                <p className="mt-7 max-w-[30rem] text-[18px] leading-[1.55] text-ink-2">
                  {firstName ? `${firstName}, your` : 'Your'} details are ready. They are passed to Calendly to
                  prefill your booking, and we receive them when you book a slot. Until then nothing
                  has been booked.
                </p>

                <RequestReceipt form={form} priority={intent === 'priority'} />
              </div>

              <div className="min-w-0 lg:col-span-7">
                <div className="flex items-baseline justify-between gap-4 border-b border-ink/80 pb-2">
                  <h2 className="text-[15px] font-semibold">Choose a slot</h2>
                  <span className="text-[13px] text-ink-3">Step 2 of 2</span>
                </div>
                <div className="relative mt-4 overflow-hidden rounded-doc border border-rule bg-paper-3">
                  <p
                    className="absolute inset-x-0 top-24 px-6 text-center text-[15px] text-ink-3"
                    aria-hidden="true"
                  >
                    Loading the calendar…
                  </p>
                  <iframe
                    src={calendlyUrl}
                    title="Pick a time · Gobots"
                    className="relative block w-full"
                    style={{ height: '780px', border: 'none' }}
                    loading="lazy"
                  />
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-ink-3">
                  Booking is handled by Calendly. The invite comes from{' '}
                  <span className="font-mono text-[13px] text-ink-2">anand@gobotsai.com</span>.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

function inputClass(invalid: boolean) {
  return `block w-full rounded-doc border bg-paper-3 px-3.5 py-3 text-[16px] leading-snug text-ink transition-colors focus:border-ink focus:outline-none ${
    invalid
      ? 'border-verdict-block/70 hover:border-verdict-block'
      : 'border-ink/30 hover:border-ink/60'
  }`
}

function RequestReceipt({ form, priority }: { form: FormState; priority: boolean }) {
  const rows: [string, string, boolean?][] = [
    ['Name', form.name],
    ['Email', form.email, true],
    ['Company · role', form.company],
    ['Scenario', form.scenario],
  ]
  return (
    <figure data-lane={priority ? 'priority' : 'standard'} className="mt-12 w-full max-w-[28rem]">
      <div
        className="perf-top perf-bottom relative bg-paper-3 text-ink"
        style={{
          boxShadow:
            '0 1px 0 rgba(18,18,18,0.06), 0 2px 4px -2px rgba(18,18,18,0.12), 0 32px 60px -36px rgba(18,18,18,0.55)',
        }}
      >
        <div className="relative overflow-hidden border-b border-ink/80 px-5 pb-3 pt-5">
          <Guilloche className="absolute inset-0 h-full w-full text-seal" opacity={0.28} />
          <div className="relative flex items-baseline justify-between gap-3">
            <p className="label text-[11px] tracking-[0.14em]">Sprint request</p>
            <p className="text-[12px] text-ink-2">Step 1 of 2 complete</p>
          </div>
          <p className="relative mt-2 heading text-[22px]">Details ready</p>
        </div>

        <dl className="space-y-3 px-5 py-5 text-[14px]">
          {rows.map(([k, v, mono]) => (
            <div key={k} className="grid gap-x-3 gap-y-0.5 sm:grid-cols-[7.5rem_1fr]">
              <dt className="text-ink-3">{k}</dt>
              <dd className={`min-w-0 break-words ${mono ? 'font-mono text-[13px]' : ''}`}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex items-center justify-between gap-4 border-t border-dashed border-ink/25 px-5 pb-6 pt-4">
          <span className="text-[13px] text-ink-3">We receive it when you book</span>
          <Stamp
            id="walkthrough-ready"
            tone="seal"
            size="sm"
            className="-rotate-6 shrink-0"
          >
            READY
          </Stamp>
        </div>
      </div>
    </figure>
  )
}

function Field({
  label,
  id,
  hint,
  error,
  children,
}: {
  label: string
  id: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block text-ink-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[14px] leading-relaxed text-verdict-block">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-[14px] leading-relaxed text-ink-3">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
