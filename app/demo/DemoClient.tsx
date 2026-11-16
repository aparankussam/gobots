'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Stamp from '@/components/doc/Stamp'
import Seal from '@/components/doc/Seal'
import Guilloche from '@/components/doc/Guilloche'
import { Arrow, Check, Cross } from '@/components/doc/icons'

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
    signal?: string
    rule_label?: string
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

  const busy = evalState.kind === 'evaluating'
  const runtimeStatus =
    evalState.kind === 'done'
      ? 'Record issued'
      : evalState.kind === 'evaluating'
        ? 'Intercepting'
        : evalState.kind === 'error'
          ? 'Engine error'
          : 'Standing by'

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Nav />

      {/* Title */}
      <section className="pt-16">
        <div className="wrap grid gap-x-12 gap-y-6 pb-12 pt-14 md:pt-20 lg:grid-cols-12 lg:pb-16">
          <h1 className="display text-[clamp(2.6rem,6.4vw,4.75rem)] lg:col-span-7">
            Watch AI try. Watch GoVTraceAI catch it<span className="text-seal">.</span>
          </h1>
          <p className="max-w-[34rem] text-[18px] leading-[1.55] text-ink-2 lg:col-span-4 lg:col-start-9 lg:self-end">
            Pick a sector. Pick a scenario. Press the button an employee would press. The live
            engine issues the signed Duty-of-Care Record in real time. It is signed as a GoVTrace Receipt, so you can verify it.
          </p>
        </div>
      </section>

      {/* Workbench */}
      <section aria-label="Live gatekeeper" className="border-t border-ink/80 pb-20 md:pb-28">
        <div className="wrap grid gap-x-12 gap-y-14 pt-10 lg:grid-cols-12 lg:pt-12">
          {/* Input side */}
          <div className="min-w-0 lg:col-span-6">
            <p id="demo-app-label" className="label text-ink-2">
              Application
            </p>
            <ul aria-labelledby="demo-app-label" className="mt-3 border-t border-ink/80">
              {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => {
                const isActive = scenarioId === id
                const s = SCENARIOS[id]
                return (
                  <li key={id} className="border-b border-rule">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setScenarioId(id)
                        setRisk('risky')
                        reset()
                      }}
                      className={`grid w-full grid-cols-[1.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 px-3 py-3.5 text-left transition-colors ${
                        isActive ? 'bg-paper-3' : 'hover:bg-paper-2'
                      }`}
                    >
                      <RadioMark on={isActive} />
                      <span className="min-w-0">
                        <span className="block text-[16px] font-semibold leading-snug">
                          {s.appName}
                        </span>
                        <span className="block text-[14px] leading-snug text-ink-3">
                          {s.appTagline}
                        </span>
                      </span>
                      <span className="text-[13px] text-ink-3">{s.profile}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <p id="demo-draft-label" className="label mt-9 text-ink-2">
              Draft
            </p>
            <ul aria-labelledby="demo-draft-label" className="mt-3 border-t border-ink/80">
              {(['risky', 'safe'] as RiskMode[]).map((mode) => {
                const isActive = risk === mode
                return (
                  <li key={mode} className="border-b border-rule">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        setRisk(mode)
                        reset()
                      }}
                      className={`grid w-full grid-cols-[1.25rem_minmax(0,1fr)] items-baseline gap-x-3 px-3 py-3 text-left text-[15px] transition-colors ${
                        isActive ? 'bg-paper-3 font-semibold' : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
                      }`}
                    >
                      <RadioMark on={isActive} />
                      <span>{scenario[mode].label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="mt-9">
              <div className="flex items-baseline justify-between gap-4 border-b border-ink/80 pb-2">
                <p className="label text-ink-2">Outbound action</p>
                <p className="truncate font-mono text-[12px] text-ink-3">{scenario.appDomain}</p>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{scenario.context}</p>
              <div className="mt-4 min-h-[8rem] whitespace-pre-wrap break-words rounded-doc border border-ink/30 bg-paper-3 p-4 font-mono text-[13.5px] leading-relaxed text-ink">
                {text}
              </div>

              <button
                type="button"
                onClick={handleSend}
                disabled={busy}
                aria-busy={busy}
                className="btn-ink mt-5 w-full py-3.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-ink"
              >
                {busy ? 'Intercepting…' : scenario.ctaLabel}
                {!busy && <Arrow />}
              </button>

              {evalState.kind === 'done' && <Banner result={evalState.result} />}
              {evalState.kind === 'error' && (
                <p
                  role="alert"
                  className="mt-4 flex items-start gap-2.5 border-y border-verdict-block/40 py-3 text-[14px] leading-relaxed text-verdict-block"
                >
                  <Cross size={12} className="mt-[5px] shrink-0" />
                  <span>Engine error: {evalState.message}</span>
                </p>
              )}
            </div>
          </div>

          {/* Runtime / record side */}
          <div className="min-w-0 lg:col-span-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink/80 pb-2">
              <p className="label whitespace-nowrap text-ink-2">GoVTraceAI runtime</p>
              <p className="text-[13px] text-ink-3">
                <span className="sr-only">Status: </span>
                {runtimeStatus}
                <span aria-hidden="true"> · </span>
                <span className="font-mono text-[12px]">profile: {scenario.profile}</span>
              </p>
            </div>
            <div aria-live="polite" className="mt-6">
              {evalState.kind === 'done' ? (
                <IssuedRecord
                  result={evalState.result}
                  profile={scenario.profile}
                  onVerify={handleVerify}
                />
              ) : (
                <Runtime state={evalState} profile={scenario.profile} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Conversion */}
      <section className="border-t border-ink/80 py-20 md:py-28">
        <div className="wrap grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <h2 className="heading text-[clamp(2.1rem,4.4vw,3.4rem)] lg:col-span-6">
            Want this on your workflow?
          </h2>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-2">
            <p className="text-[18px] leading-[1.55] text-ink-2">
              Bring the action your team is afraid to ship. We will run it through the live engine
              on the call and you will leave with the signed record.
            </p>
            <Link href="/walkthrough" className="btn-ink mt-8 py-3.5">
              Book a GoVTraceAI briefing
              <Arrow />
            </Link>
            <p className="mt-5 border-t border-rule pt-4 text-[14px] text-ink-3">
              Questions first? Write to{' '}
              <span className="font-medium text-ink">hello@gobotsai.com</span>.
            </p>
          </div>
        </div>
      </section>

      {verifyState.open && (
        <VerifyModal state={verifyState} onClose={() => setVerifyState({ open: false })} />
      )}

      <Footer />
    </main>
  )
}

function RadioMark({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative top-[2px] inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
        on ? 'border-ink' : 'border-ink/40'
      }`}
    >
      {on && <span className="h-[7px] w-[7px] rounded-full bg-ink" />}
    </span>
  )
}

type Tone = 'safe' | 'warn' | 'block'

function verdictTone(code: string): { tone: Tone; label: string; text: string } {
  if (code === 'STOP') return { tone: 'block', label: 'BLOCKED', text: 'text-verdict-block' }
  if (code === 'NEEDS_REVIEW')
    return { tone: 'warn', label: 'NEEDS REVIEW', text: 'text-verdict-warn' }
  return { tone: 'safe', label: 'ALLOWED', text: 'text-verdict-safe' }
}

function verdictSummary(code: string, findingCount: number) {
  return code === 'SAFE'
    ? 'Action passed all policy checks. Cleared for delivery.'
    : `${findingCount} finding${findingCount === 1 ? '' : 's'} flagged before the action reached the recipient.`
}

function Banner({ result }: { result: EngineResponse }) {
  const code = result.verdict_code ?? 'UNKNOWN'
  const findingCount = result.findings?.length ?? 0
  const v = verdictTone(code)

  return (
    <div className="mt-4 border-y border-rule py-3">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`label text-[13px] ${v.text}`}>{v.label}</span>
        <span className="text-[14px] leading-relaxed text-ink-2">
          {verdictSummary(code, findingCount)}
        </span>
      </p>
    </div>
  )
}

function Runtime({ state, profile }: { state: EvalState; profile: string }) {
  if (state.kind === 'evaluating') {
    return <RuntimeStream profile={profile} />
  }
  return (
    <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-doc border border-dashed border-ink/25 px-6 py-12 text-center">
      {state.kind === 'error' ? (
        <>
          <p className="heading text-[24px] text-verdict-block">No record issued.</p>
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-2">
            The engine returned an error. See the message with the action.
          </p>
        </>
      ) : (
        <>
          <p className="heading text-[24px]">Awaiting an AI action.</p>
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-2">
            {profile} profile loaded. The signed record is issued here once the action is
            intercepted.
          </p>
        </>
      )}
    </div>
  )
}

function RuntimeStream({ profile }: { profile: string }) {
  const steps: Array<[string, string]> = [
    ['intercept', 'outbound action captured'],
    ['profile', profile],
    ['rules', 'loading policy bundle…'],
    ['scan', 'tokenizing input…'],
    ['hash', 'computing input_hash…'],
    ['evaluate', 'resolving findings…'],
    ['docr', 'building Duty-of-Care Record…'],
    ['sign', 'Ed25519…'],
  ]
  return (
    <div aria-busy="true" className="min-h-[22rem]">
      <p className="sr-only">Evaluating the action against policy.</p>
      <ol className="border-t border-rule font-mono text-[12.5px]">
        {steps.map(([k, v], i) => (
          <li
            key={k}
            className="sig-step grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 border-b border-rule py-2"
            style={{ animationDelay: `${i * 180}ms` }}
          >
            <span className="text-ink-3">{k}</span>
            <span className="break-words text-ink">
              {v}
              {i === steps.length - 1 && (
                <span aria-hidden="true" className="caret ml-1 inline-block h-[1em] w-[0.5ch] translate-y-[2px] bg-ink" />
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function IssuedRecord({
  result,
  profile,
  onVerify,
}: {
  result: EngineResponse
  profile: string
  onVerify: (runId: string) => void
}) {
  const code = result.verdict_code ?? 'UNKNOWN'
  const v = verdictTone(code)
  const docr = result.duty_of_care_record ?? {}
  const integrity = docr.integrity ?? {}
  const policy = docr.policy ?? {}
  const input = docr.input ?? {}
  const receipt = result.receipt ?? {}
  const runId = result.run_id
  const findings = result.findings ?? []
  const top = findings.slice(0, 5)
  const isSigned = Boolean(integrity.signature || receipt.signature)

  return (
    <article
      aria-label="Signed Duty-of-Care Record"
      className="perf-top perf-bottom relative bg-paper-3 text-ink"
      style={{
        boxShadow:
          '0 1px 0 rgba(18,18,18,0.06), 0 2px 4px -2px rgba(18,18,18,0.12), 0 28px 50px -34px rgba(18,18,18,0.5)',
      }}
    >
      {/* Header band */}
      <header className="relative overflow-hidden border-b border-ink/80 px-5 pb-4 pt-5 sm:px-6">
        <Guilloche
          className="absolute inset-x-0 top-0 h-16 w-full text-seal"
          opacity={0.28}
        />
        <div className="relative flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="label text-[11px] tracking-[0.14em]">Signed Duty-of-Care Record</p>
          <p className="min-w-0 truncate font-mono text-[11.5px] text-ink-2">
            run_id: {runId ?? '—'}
          </p>
        </div>
        <div className="relative mt-4 flex flex-col gap-3 sm:flex-row-reverse sm:items-start sm:justify-between sm:gap-6">
          <Stamp id="demo-verdict" tone={v.tone} size="md" className="shrink-0 -rotate-3">
            {v.label}
          </Stamp>
          <p className="heading text-[22px] leading-[1.2] sm:text-[24px]">
            {verdictSummary(code, findings.length)}
          </p>
        </div>
        {result.reason_line && (
          <p className="relative mt-3 text-[14.5px] leading-relaxed text-ink-2">
            {result.reason_line}
          </p>
        )}
      </header>
      <p className="microtext border-b border-rule px-5 py-1 text-ink-3 sm:px-6" aria-hidden="true">
        {'ed25519 · canonical json · sha-256 · verifiable without the issuer · '.repeat(4)}
      </p>

      {/* Findings */}
      <section aria-label="Findings" className="px-5 pt-5 sm:px-6">
        <div className="flex items-baseline justify-between border-b border-ink/80 pb-1.5">
          <p className="label text-[11px] text-ink-2">Findings</p>
          <p className="tnum font-mono text-[12px] text-ink-3">{findings.length}</p>
        </div>
        {top.length === 0 ? (
          <p className="border-b border-rule py-2.5 text-[14px] text-ink-3">No findings.</p>
        ) : (
          <ol>
            {top.map((f, i) => (
              <li
                key={i}
                className="grid gap-x-3 gap-y-0.5 border-b border-rule py-2.5 sm:grid-cols-[9rem_minmax(0,1fr)]"
              >
                <span className={`truncate font-mono text-[12px] ${v.text}`} title={f.rule_id}>
                  {f.rule_id ?? 'RULE'}
                </span>
                <span className="text-[14px] leading-snug text-ink-2">
                  {f.message ?? f.category ?? f.signal ?? f.rule_label ?? ''}
                  {f.severity && (
                    <span className="ml-2 whitespace-nowrap text-[12.5px] text-ink-3">
                      {f.severity}
                    </span>
                  )}
                </span>
              </li>
            ))}
            {findings.length > top.length && (
              <li className="border-b border-rule py-2 text-[13px] text-ink-3">
                +{findings.length - top.length} more in the record
              </li>
            )}
          </ol>
        )}
      </section>

      {/* Record fields */}
      <section aria-label="Record" className="px-5 pt-6 sm:px-6">
        <div className="border-b border-ink/80 pb-1.5">
          <p className="label text-[11px] text-ink-2">Record</p>
        </div>
        <dl>
          <Field k="intercept" v="outbound action captured" />
          <Field k="profile" v={profile} />
          <Field k="verdict_code" v={result.verdict_code} />
          <Field k="status" v={result.status} />
          <Field k="record_hash" v={integrity.record_hash} mono />
          <Field k="chain_prev_hash" v={integrity.chain_prev_hash} mono />
          <Field k="policy_digest" v={policy.policy_digest} mono />
          <Field k="input_hash" v={input.input_hash} mono />
          <Field k="signed_at" v={receipt.signed_at ?? result.timestamp} />
          <Field
            k="signature_algo"
            v={integrity.signature_algo ?? receipt.signature_algo ?? 'Ed25519'}
          />
          <Field
            k="signed"
            v={integrity.signature ? 'yes (' + integrity.signature.slice(0, 12) + '…)' : 'no'}
          />
        </dl>
      </section>

      {/* Verification */}
      <footer className="flex items-end justify-between gap-4 px-5 pb-7 pt-6 sm:px-6">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => runId && onVerify(runId)}
            disabled={!runId}
            className="btn-rule py-2.5 text-[14px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            Verify signature
          </button>
          <p className="mt-4 max-w-[26rem] text-[13px] leading-relaxed text-ink-3">
            Notarization-grade. Anyone with the published public key can re-verify this receipt
            offline.{' '}
            <Link href="/verify" className="link-ink text-ink-2">
              Try the web verifier
            </Link>{' '}
            or run{' '}
            <code className="whitespace-nowrap rounded-doc bg-paper-2 px-1 py-px font-mono text-[12px] text-ink">
              npm i -g @gobotsai/govtrace
            </code>
            .{' '}
            <Link href="/spec" className="link-ink text-ink-2">
              Read the spec
            </Link>
            .
          </p>
        </div>
        {isSigned && (
          <Seal
            id="demo-seal"
            size={88}
            className="seal-stamp shrink-0"
            style={{ '--d': '0.15s' } as React.CSSProperties}
          />
        )}
      </footer>
    </article>
  )
}

function Field({ k, v, mono }: { k: string; v?: string | null; mono?: boolean }) {
  const value = v ?? '—'
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-3 border-b border-rule py-2 font-mono sm:grid-cols-[9rem_minmax(0,1fr)]">
      <dt className="text-[12px] text-ink-3">{k}</dt>
      <dd
        className={`tnum text-[12.5px] ${v == null ? 'text-ink-3' : 'text-ink'} ${
          mono ? 'truncate' : 'break-words'
        }`}
        title={mono ? value : undefined}
      >
        {value}
      </dd>
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
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
        aria-busy={loading}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-doc border border-ink/80 bg-paper-3 text-ink shadow-[0_28px_60px_-30px_rgba(18,18,18,0.6)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-rule px-6 py-3">
          <p className="text-[13px] text-ink-3">Independent verification</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 inline-flex h-8 w-8 items-center justify-center rounded-doc text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <Cross size={12} />
          </button>
        </div>
        <div className="px-6 pb-6 pt-5">
          {loading ? (
            <p id="verify-title" className="heading text-[22px] text-ink-2">
              {'Re-checking signature…'}
            </p>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <h3 id="verify-title" className="heading text-[26px] leading-[1.15]">
                  {ok
                    ? 'Signature valid.'
                    : status === 503
                      ? 'Verification storage off in this demo.'
                      : 'Could not verify signature.'}
                </h3>
                {ok && (
                  <Check size={22} className="mt-1 shrink-0 text-verdict-safe" />
                )}
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                {ok
                  ? 'Hash chain re-walked end to end. Each record’s Ed25519 signature checked against the published public key. Record is authentic and unmodified.'
                  : status === 503
                    ? 'The hosted demo runs on a stateless function, so the audit chain is not persisted between requests. The signature on every receipt is real. To walk the full chain, point the engine at a persistent volume.'
                    : reason || msg || 'The verify endpoint returned a non-OK result.'}
              </p>
              {!ok && status !== 503 && state.data && (
                <pre className="mt-4 max-h-64 overflow-auto rounded-doc border border-rule bg-paper-2 p-3 font-mono text-[11.5px] leading-relaxed text-ink-2">
                  {JSON.stringify(state.data, null, 2).slice(0, 600)}
                </pre>
              )}
              <button type="button" onClick={onClose} className="btn-ink mt-6 w-full py-3">
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
