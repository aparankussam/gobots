'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

type ScenarioId = 'healthcare' | 'fintech' | 'legal'
type RiskMode = 'risky' | 'safe'

type Scenario = {
  id: ScenarioId
  appName: string
  appDomain: string
  appTagline: string
  ctaLabel: string
  context: string
  profile: 'Healthcare' | 'Finance' | 'General'
  risky: { label: string; text: string }
  safe: { label: string; text: string }
}

const SCENARIOS: Record<ScenarioId, Scenario> = {
  healthcare: {
    id: 'healthcare',
    appName: 'MedNote AI',
    appDomain: 'mednote.app',
    appTagline: 'Ambient clinical scribe',
    ctaLabel: 'Save note to chart',
    context:
      'Encounter summary auto-drafted by the ambient scribe. Will be saved to the patient record.',
    profile: 'Healthcare',
    risky: {
      label: 'De-identification skipped',
      text: 'Encounter: 54-year-old male presented with chest pain. MRN 889977. Diagnosis codes I10, E11.9. Started on amlodipine 5mg daily; continue omeprazole.',
    },
    safe: {
      label: 'De-identified draft',
      text: 'Visit summary: returning patient assessment completed. Care plan reviewed and documented per protocol. Continuing prescribed regimen as discussed at last visit.',
    },
  },
  fintech: {
    id: 'fintech',
    appName: 'LendSpark',
    appDomain: 'lendspark.app',
    appTagline: 'AI underwriting copilot',
    ctaLabel: 'Send approval to applicant',
    context:
      'Approval letter auto-drafted by the underwriting copilot. Will be emailed to the applicant.',
    profile: 'Finance',
    risky: {
      label: 'Internal data left in draft',
      text: 'Loan approved. Wire instructions: account 000123456789 routing 021000021. Applicant SSN on file: 123-45-6789. Internal funding bucket: AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE.',
    },
    safe: {
      label: 'Cleaned approval',
      text: 'Loan approved. Underwriting completed within bounds. Funding instructions and account details have been sent through your secure portal.',
    },
  },
  legal: {
    id: 'legal',
    appName: 'Brieffy',
    appDomain: 'brieffy.app',
    appTagline: 'AI legal drafting agent',
    ctaLabel: 'Share with opposing counsel',
    context:
      'Memorandum auto-drafted by the agent. Will be shared with opposing counsel via the secure file room.',
    profile: 'General',
    risky: {
      label: 'Privileged content present',
      text: 'PRIVILEGED AND CONFIDENTIAL. Attorney-client communication regarding the audit. Counsel recommended we not respond to the opposing party until discovery closes. Litigation strategy memo attached.',
    },
    safe: {
      label: 'Public-record only',
      text: 'Memorandum summarizing the parties\u2019 positions as documented in the public court docket. Citations to filings included. No internal strategy referenced.',
    },
  },
}

type EngineResponse = {
  run_id?: string
  timestamp?: string
  status?: string
  verdict_code?: 'STOP' | 'NEEDS_REVIEW' | 'SAFE' | string
  reason_line?: string
  findings?: Array<{
    rule_id?: string
    category?: string
    severity?: string
    message?: string
  }>
  blocking_classes?: Record<string, number>
  duty_of_care_record?: {
    integrity?: {
      record_hash?: string
      chain_prev_hash?: string | null
      signature?: string | null
      signature_algo?: string | null
    }
    policy?: { policy_digest?: string; policy_version?: string }
    input?: { input_hash?: string }
  }
  receipt?: {
    signed_at?: string
    signature_algo?: string
    signature?: string
    canonical_digest?: string
  }
}

type EvalState =
  | { kind: 'idle' }
  | { kind: 'evaluating' }
  | { kind: 'done'; result: EngineResponse }
  | { kind: 'error'; message: string }

type VerifyState =
  | { open: false }
  | { open: true; loading: true }
  | { open: true; loading: false; ok: boolean; status: number; data: any }

export default function DemoClient() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('healthcare')
  const [risk, setRisk] = useState<RiskMode>('risky')
  const [evalState, setEvalState] = useState<EvalState>({ kind: 'idle' })
  const [verifyState, setVerifyState] = useState<VerifyState>({ open: false })

  const scenario = SCENARIOS[scenarioId]
  const text = risk === 'risky' ? scenario.risky.text : scenario.safe.text

  function reset() {
    setEvalState({ kind: 'idle' })
  }

  async function handleSend() {
    setEvalState({ kind: 'evaluating' })
    try {
      const res = await fetch('/api/govtrace/evaluate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text, profile: scenario.profile }),
      })
      const data = (await res.json()) as EngineResponse
      if (!res.ok) {
        setEvalState({
          kind: 'error',
          message: (data as any)?.message ?? `Engine returned ${res.status}.`,
        })
        return
      }
      setEvalState({ kind: 'done', result: data })
    } catch (err) {
      setEvalState({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Network error.',
      })
    }
  }

  async function handleVerify(runId: string) {
    setVerifyState({ open: true, loading: true })
    try {
      const res = await fetch(`/api/govtrace/verify/${encodeURIComponent(runId)}`)
      const data = await res.json()
      const ok =
        res.ok && (data?.verified === true || data?.signature_valid === true)
      setVerifyState({ open: true, loading: false, ok, status: res.status, data })
    } catch {
      setVerifyState({
        open: true,
        loading: false,
        ok: false,
        status: 0,
        data: { error: 'network', message: 'Could not reach the verify endpoint.' },
      })
    }
  }

  return (
    <main className="bg-[#050505] min-h-screen">
      <Nav />
      <section className="pt-32 pb-20 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
            <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">
              Live Gatekeeper
            </p>
            <h1 className="text-[36px] md:text-[52px] font-extrabold text-[#F5F5F5] leading-[1.08] tracking-tight mb-5">
              Watch AI try. Watch GoVTraceAI catch it.
            </h1>
            <p className="text-[16px] text-[#CFCFCF] max-w-xl mx-auto leading-relaxed">
              Pick a sector. Pick a scenario. Press the button an employee would press.
              The signed Duty-of-Care Record is generated in real time by the live engine.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => {
              const isActive = scenarioId === id
              const s = SCENARIOS[id]
              return (
                <button
                  key={id}
                  onClick={() => {
                    setScenarioId(id)
                    setRisk('risky')
                    reset()
                  }}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-colors border ${
                    isActive
                      ? 'bg-accent text-white border-accent'
                      : 'bg-transparent text-[#CFCFCF] border-white/10 hover:border-white/30'
                  }`}
                >
                  {s.appName}
                  <span
                    className={`ml-2 text-[10px] tracking-[0.18em] uppercase ${
                      isActive ? 'text-white/70' : 'text-[#6B7280]'
                    }`}
                  >
                    {s.profile}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-6">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0D0D0D] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/40">
                <span className="w-2 h-2 rounded-full bg-[#444]" />
                <span className="w-2 h-2 rounded-full bg-[#444]" />
                <span className="w-2 h-2 rounded-full bg-[#444]" />
                <p className="ml-3 text-[11px] text-[#6B7280] font-mono">
                  {scenario.appDomain}
                </p>
              </div>
              <div className="p-6">
                <p className="text-[11px] text-[#8A8A8A] tracking-[0.18em] uppercase font-semibold mb-1">
                  {scenario.appName}
                </p>
                <h2 className="text-[18px] font-bold text-[#F5F5F5] mb-5">
                  {scenario.appTagline}
                </h2>

                <div className="inline-flex rounded-lg border border-white/10 bg-black/40 p-1 mb-5">
                  <button
                    onClick={() => {
                      setRisk('risky')
                      reset()
                    }}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
                      risk === 'risky'
                        ? 'bg-white/10 text-white'
                        : 'text-[#9CA3AF] hover:text-[#CFCFCF]'
                    }`}
                  >
                    {scenario.risky.label}
                  </button>
                  <button
                    onClick={() => {
                      setRisk('safe')
                      reset()
                    }}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
                      risk === 'safe'
                        ? 'bg-white/10 text-white'
                        : 'text-[#9CA3AF] hover:text-[#CFCFCF]'
                    }`}
                  >
                    {scenario.safe.label}
                  </button>
                </div>

                <p className="text-[12px] text-[#6B7280] mb-2 leading-relaxed">
                  {scenario.context}
                </p>

                <div className="rounded-lg bg-black border border-white/10 p-4 text-[13px] text-[#CFCFCF] font-mono leading-relaxed mb-5 min-h-[120px] whitespace-pre-wrap">
                  {text}
                </div>

                <button
                  onClick={handleSend}
                  disabled={evalState.kind === 'evaluating'}
                  className="w-full inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3 rounded-xl hover:bg-[#c44625] active:scale-[0.99] transition-all text-[14px] shadow-lg shadow-accent/20 disabled:opacity-60 disabled:cursor-wait"
                >
                  {evalState.kind === 'evaluating'
                    ? 'Intercepting…'
                    : scenario.ctaLabel}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 7h10M7 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {evalState.kind === 'done' && (
                    <Banner result={evalState.result} />
                  )}
                  {evalState.kind === 'error' && (
                    <motion.div
                      key="err"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-200"
                    >
                      Engine error: {evalState.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#070707] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-black/40">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    evalState.kind === 'done'
                      ? 'bg-[#22C55E]'
                      : evalState.kind === 'evaluating'
                        ? 'bg-accent animate-live-dot'
                        : evalState.kind === 'error'
                          ? 'bg-amber-400'
                          : 'bg-[#444]'
                  }`}
                />
                <p className="text-[11px] text-[#9CA3AF] font-semibold tracking-[0.18em] uppercase">
                  GoVTraceAI Runtime
                </p>
                <p className="ml-auto text-[10px] text-[#555] font-mono">
                  profile: {scenario.profile}
                </p>
              </div>
              <div className="p-5 font-mono text-[12px] text-[#CFCFCF] leading-[1.7] min-h-[420px]">
                <Runtime state={evalState} profile={scenario.profile} />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {evalState.kind === 'done' && (
              <Receipt result={evalState.result} onVerify={handleVerify} />
            )}
          </AnimatePresence>

          <div className="mt-14 max-w-3xl mx-auto text-center">
            <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
            <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">
              Your scenario, live
            </p>
            <h3 className="text-[28px] md:text-[34px] font-extrabold text-[#F5F5F5] leading-tight tracking-tight mb-4">
              Same engine. Your workflow. Twenty minutes.
            </h3>
            <p className="text-[15px] text-[#CFCFCF] mb-6 leading-relaxed">
              Bring the action your team is afraid to ship. We will run it through the
              live engine on the call and you will leave with the signed record.
            </p>
            <Link
              href="/walkthrough"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#c44625] active:scale-[0.99] transition-all text-[14px] shadow-lg shadow-accent/20"
            >
              Request a Walkthrough
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7h10M7 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <p className="mt-3 text-[12px] text-[#8A8A8A]">
              Reply-to is{' '}
              <span className="text-[#CFCFCF] font-mono">anand@gobotsai.com</span>.
              Founder reads it.
            </p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {verifyState.open && (
          <VerifyModal
            state={verifyState}
            onClose={() => setVerifyState({ open: false })}
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}

function Banner({ result }: { result: EngineResponse }) {
  const code = result.verdict_code ?? 'UNKNOWN'
  const findingCount = result.findings?.length ?? 0
  const tone =
    code === 'STOP'
      ? {
          border: 'border-red-500/40',
          bg: 'bg-red-500/10',
          text: 'text-red-200',
          label: 'BLOCKED',
        }
      : code === 'NEEDS_REVIEW'
        ? {
            border: 'border-amber-500/40',
            bg: 'bg-amber-500/10',
            text: 'text-amber-200',
            label: 'NEEDS REVIEW',
          }
        : {
            border: 'border-emerald-500/40',
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-200',
            label: 'ALLOWED',
          }

  return (
    <motion.div
      key="banner"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-4 rounded-lg border ${tone.border} ${tone.bg} px-4 py-3`}
    >
      <p className={`text-[13px] font-bold tracking-wide ${tone.text}`}>
        {tone.label}
      </p>
      <p className="text-[12px] text-[#CFCFCF] mt-1 leading-relaxed">
        {code === 'SAFE'
          ? 'Action passed all policy checks. Cleared for delivery.'
          : `${findingCount} finding${findingCount === 1 ? '' : 's'} flagged before the action reached the recipient.`}
      </p>
      {result.reason_line && (
        <p className="text-[11px] text-[#9CA3AF] mt-2 font-mono leading-relaxed">
          {result.reason_line}
        </p>
      )}
    </motion.div>
  )
}

function Runtime({
  state,
  profile,
}: {
  state: EvalState
  profile: string
}) {
  if (state.kind === 'idle') {
    return (
      <p className="text-[#555]">
        <span className="text-accent">$</span> awaiting AI action ({profile} profile
        loaded)…
      </p>
    )
  }
  if (state.kind === 'evaluating') {
    return <RuntimeStream profile={profile} />
  }
  if (state.kind === 'error') {
    return (
      <p className="text-amber-400">
        <span className="text-accent">$</span> engine returned an error. See message
        above.
      </p>
    )
  }
  const r = state.result
  const docr = r.duty_of_care_record ?? {}
  const integrity = docr.integrity ?? {}
  const findings = r.findings ?? []
  const top = findings.slice(0, 5)

  const lines: Array<{ k: string; v: string }> = [
    { k: 'intercept', v: 'outbound action captured' },
    { k: 'profile', v: profile },
    { k: 'run_id', v: r.run_id ?? '\u2014' },
    { k: 'verdict_code', v: r.verdict_code ?? '\u2014' },
    { k: 'status', v: r.status ?? '\u2014' },
    { k: 'findings', v: String(findings.length) },
    ...top.map((f) => ({
      k: '  \u00b7 ' + (f.rule_id ?? 'RULE'),
      v: (f.message ?? f.category ?? '').slice(0, 80),
    })),
    {
      k: 'record_hash',
      v: integrity.record_hash ? integrity.record_hash.slice(0, 24) + '\u2026' : '\u2014',
    },
    { k: 'signature_algo', v: integrity.signature_algo ?? 'Ed25519' },
    {
      k: 'signed',
      v: integrity.signature ? 'yes (' + integrity.signature.slice(0, 12) + '\u2026)' : 'no',
    },
  ]

  return (
    <div className="space-y-1">
      {lines.map((l, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.18 }}
          className="whitespace-pre-wrap break-all"
        >
          <span className="text-[#6B7280]">{l.k.padEnd(16)}</span>{' '}
          <span className="text-[#D1D5DB]">{l.v}</span>
        </motion.p>
      ))}
    </div>
  )
}

function RuntimeStream({ profile }: { profile: string }) {
  const steps = [
    'intercept       outbound action captured',
    'profile         ' + profile,
    'rules           loading policy bundle\u2026',
    'scan            tokenizing input\u2026',
    'hash            computing input_hash\u2026',
    'evaluate        resolving findings\u2026',
    'docr            building Duty-of-Care Record\u2026',
    'sign            Ed25519\u2026',
  ]
  return (
    <div className="space-y-1">
      {steps.map((s, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.18, duration: 0.2 }}
        >
          <span className="text-accent">{'\u2192'}</span> {s}
        </motion.p>
      ))}
    </div>
  )
}

function Receipt({
  result,
  onVerify,
}: {
  result: EngineResponse
  onVerify: (runId: string) => void
}) {
  const docr = result.duty_of_care_record ?? {}
  const integrity = docr.integrity ?? {}
  const policy = docr.policy ?? {}
  const input = docr.input ?? {}
  const receipt = result.receipt ?? {}
  const runId = result.run_id

  return (
    <motion.div
      key="receipt"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0D0D0D] p-6"
    >
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="text-[11px] text-[#8A8A8A] tracking-[0.22em] uppercase font-semibold">
            Signed Duty-of-Care Record
          </p>
          <p className="text-[12px] text-[#6B7280] font-mono mt-1">
            run_id: {runId ?? '\u2014'}
          </p>
        </div>
        <button
          onClick={() => runId && onVerify(runId)}
          disabled={!runId}
          className="text-[13px] font-semibold text-accent border border-accent/40 px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors disabled:opacity-50"
        >
          Verify signature
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-[12px] font-mono">
        <Field k="verdict_code" v={result.verdict_code} />
        <Field k="status" v={result.status} />
        <Field k="record_hash" v={integrity.record_hash} mono />
        <Field k="chain_prev_hash" v={integrity.chain_prev_hash} mono />
        <Field k="policy_digest" v={policy.policy_digest} mono />
        <Field k="input_hash" v={input.input_hash} mono />
        <Field k="signed_at" v={receipt.signed_at ?? result.timestamp} />
        <Field k="signature_algo" v={integrity.signature_algo ?? receipt.signature_algo ?? 'Ed25519'} />
      </div>
      <p className="text-[11px] text-white/45 mt-5 leading-relaxed">
        Notarization-grade. Anyone with the published public key can re-verify
        this receipt offline.{' '}
        <Link href="/verify" className="text-accent underline underline-offset-4">
          Try the web verifier
        </Link>{' '}
        or run{' '}
        <span className="font-mono text-white/65">npm i -g @gobotsai/govtrace</span>
        .{' '}
        <Link href="/spec" className="text-accent underline underline-offset-4">
          Read the spec
        </Link>
        .
      </p>
    </motion.div>
  )
}

function Field({
  k,
  v,
  mono,
}: {
  k: string
  v?: string | null
  mono?: boolean
}) {
  const value = v ?? '\u2014'
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2">
      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-0.5">
        {k}
      </p>
      <p className={`text-[#D1D5DB] ${mono ? 'truncate' : ''}`} title={mono ? value : undefined}>
        {value}
      </p>
    </div>
  )
}

function VerifyModal({
  state,
  onClose,
}: {
  state: Extract<VerifyState, { open: true }>
  onClose: () => void
}) {
  const loading = state.loading
  const ok = !loading && state.ok
  const status = !loading ? state.status : 0
  const reason = !loading ? state.data?.failure_reason : undefined
  const msg = !loading ? state.data?.message : undefined

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl border border-white/10 bg-[#0D0D0D] p-7 max-w-md w-full"
      >
        <p className="text-[11px] text-[#8A8A8A] tracking-[0.22em] uppercase font-semibold mb-2">
          Independent verification
        </p>
        {loading ? (
          <p className="text-[14px] text-[#9CA3AF]">{'Re-checking signature\u2026'}</p>
        ) : (
          <>
            <h3 className="text-[22px] font-bold text-[#F5F5F5] mb-2 leading-tight">
              {ok
                ? 'Signature valid.'
                : status === 503
                  ? 'Verification storage off in this demo.'
                  : 'Could not verify signature.'}
            </h3>
            <p className="text-[13px] text-[#9CA3AF] leading-relaxed">
              {ok
                ? 'Hash chain re-walked end to end. Each record\u2019s Ed25519 signature checked against the published public key. Record is authentic and unmodified.'
                : status === 503
                  ? 'The hosted demo runs on a stateless function, so the audit chain is not persisted between requests. The signature on every receipt is real. To walk the full chain, point the engine at a persistent volume.'
                  : (reason || msg || 'The verify endpoint returned a non-OK result.')}
            </p>
            {!ok && status !== 503 && state.data && (
              <pre className="mt-4 rounded-md bg-black border border-white/10 p-3 text-[11px] text-[#9CA3AF] font-mono overflow-x-auto">
                {JSON.stringify(state.data, null, 2).slice(0, 600)}
              </pre>
            )}
            <button
              onClick={onClose}
              className="mt-5 w-full bg-accent text-white font-semibold py-2.5 rounded-lg hover:bg-[#c44625] transition-colors text-[13px]"
            >
              Close
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
