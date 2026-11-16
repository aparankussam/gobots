'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Stamp from '@/components/doc/Stamp'
import SprintCaption from '@/components/SprintCaption'
import { Arrow } from '@/components/doc/icons'
import { track } from '@/lib/track'
import { latestOnly, runCheck, verifyReceipt, type CheckResult, type VerifyOutcome } from '@/lib/check'
import type { Verdict } from '@/lib/verdict'
import { SPECIMENS } from '@/content/specimens'
import { SAMPLE_META, SAMPLE_RECEIPT } from '@/content/sample-receipt'

export type Preset = { label: string; text: string; profile: 'Finance' | 'General' }

const TONE: Record<Exclude<Verdict, 'UNKNOWN'>, 'safe' | 'warn' | 'block'> = {
  SAFE: 'safe',
  WARNING: 'warn',
  BLOCK: 'block',
}

export const PRESETS: Preset[] = SPECIMENS.map((s) => ({ label: s.label, text: s.prompt, profile: s.profile }))

type Verified = VerifyOutcome | { kind: 'pending' } | { kind: 'none' }
type State = { kind: 'idle' } | { kind: 'checking' } | (CheckResult & { verified?: Verified })

/** Live GoVTraceAI check on preset examples only (no free text; spec §7.1 item 11). */
export default function HomeChecker() {
  const [pick, setPick] = useState(0)
  const [state, setState] = useState<State>({ kind: 'idle' })
  const latest = useRef(latestOnly())
  const preset = PRESETS[pick]
  const busy = state.kind === 'checking'

  async function run() {
    if (busy) return
    setState({ kind: 'checking' })
    track('live_check_run')
    const r = await latest.current(runCheck(preset.text, preset.profile))
    if (!r.fresh) return
    const result = r.value
    if (result.kind === 'done' && result.receipt) {
      // Verify that exact run, in place, by its signature. Only the engine can say "valid".
      setState({ ...result, verified: { kind: 'pending' } })
      const v = await latest.current(verifyReceipt(result.receipt))
      if (v.fresh) setState({ ...result, verified: v.value })
    } else {
      setState({ ...result, verified: { kind: 'none' } })
    }
  }

  return (
    <div id="live-check" className="scroll-mt-24 border border-ink/80 bg-paper-3">
      <div className="flex items-baseline justify-between gap-3 border-b border-rule px-5 py-3">
        <p className="text-[15px] font-semibold">Run a live check</p>
        <p className="font-mono text-[11.5px] text-ink-3">A live call to the GoVTraceAI engine</p>
      </div>

      <div className="px-5 py-5">
        <p className="text-[13px] text-ink-3">Pick an example</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={i === pick}
              disabled={busy}
              onClick={() => {
                void latest.current(Promise.resolve(0)) // drop any in-flight check or verification
                setPick(i)
                setState({ kind: 'idle' })
              }}
              className={`rounded-doc border px-3 py-2 text-[13.5px] transition-colors disabled:cursor-not-allowed ${
                i === pick ? 'border-ink bg-ink text-paper' : 'border-rule text-ink-2 hover:border-ink/60 hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="heading mt-5 text-[21px] leading-snug">“{preset.text}”</p>

        <button
          type="button"
          onClick={run}
          aria-disabled={busy}
          className="btn-ink mt-5 py-3 aria-disabled:cursor-wait aria-disabled:opacity-60"
        >
          {busy ? 'Checking…' : 'Run check'}
        </button>

        <div className="mt-6 min-h-[5.5rem] border-t border-dashed border-ink/25 pt-4" aria-live="polite">
          {state.kind === 'idle' && (
            <p className="text-[14px] text-ink-3">The verdict and a signed receipt appear here, then we verify it for you.</p>
          )}
          {state.kind === 'checking' && <p className="text-[14px] text-ink-2">Checking…</p>}
          {state.kind === 'error' && <EngineDown limited={state.limited} />}
          {state.kind === 'done' && (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {state.reason && <p className="text-[14.5px] leading-snug">{state.reason}</p>}
                {state.runId && <p className="mt-2 truncate font-mono text-[12px] text-ink-3">run_id {state.runId}</p>}
                <VerifyLine v={state.verified} />
                <Link href="/demo" className="link-ink mt-3 inline-flex items-center gap-2 text-[14px] font-medium">
                  Try other scenarios
                  <Arrow size={13} />
                </Link>
              </div>
              {state.verdict !== 'UNKNOWN' ? (
                <Stamp id="home-check" tone={TONE[state.verdict]} size="md" className="shrink-0 -rotate-6">
                  {state.verdict}
                </Stamp>
              ) : (
                <p className="font-mono text-[12px] text-ink-3">verdict unavailable</p>
              )}
            </div>
          )}
        </div>

        {state.kind === 'done' && (
          <div className="mt-5 border-t border-rule pt-4">
            <p className="text-[14px] text-ink-2">Seen enough?</p>
            <Link href="/walkthrough" className="btn-seal mt-3 py-3">
              Start a Production Sprint
              <Arrow />
            </Link>
            <SprintCaption className="mt-2.5 text-ink-3" />
          </div>
        )}
      </div>
    </div>
  )
}

function VerifyLine({ v }: { v?: Verified }) {
  if (!v || v.kind === 'none') return null
  if (v.kind === 'pending') return <p className="mt-2 text-[13.5px] text-ink-3">Verifying the signature…</p>
  if (v.kind === 'valid')
    return (
      <p className="mt-2 text-[13.5px] font-medium text-verdict-safe">
        Signature valid{v.algo ? ` · ${v.algo}` : ''}
        {v.keyId ? ` · key ${v.keyId}` : ''}. Checked just now by the engine&rsquo;s verifier.
      </p>
    )
  if (v.kind === 'invalid') return <p className="mt-2 text-[13.5px] font-medium text-verdict-block">Signature did not verify.</p>
  return (
    <p className="mt-2 text-[13.5px] text-ink-3">
      Could not reach the verifier just now. You can check this receipt yourself on{' '}
      <Link href="/verify" className="link-ink">the verify page</Link>.
    </p>
  )
}

/** Engine did not answer: say so, show a stored, real example, make no live claim. */
function EngineDown({ limited }: { limited?: boolean }) {
  return (
    <div>
      <p className="text-[14px] leading-relaxed text-ink-2">
        {limited
          ? 'Too many checks from this connection. Try again in a few minutes.'
          : 'The live engine is not answering right now. Try again, or run it on the '}
        {!limited && (
          <Link href="/demo" className="link-ink">
            demo page
          </Link>
        )}
        {!limited && '.'}
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4 border border-dashed border-ink/25 p-3">
        <div className="min-w-0 flex-1">
          <p className="label text-[10.5px] text-ink-3">
            Stored example, verified on {SAMPLE_META.capturedOn}. Not a live result.
          </p>
          <p className="mt-1.5 text-[13.5px] leading-snug">“{SAMPLE_META.prompt}”</p>
          <p className="mt-1 text-[13px] text-ink-2">{SAMPLE_META.reason}</p>
          <p className="mt-1 truncate font-mono text-[11.5px] text-ink-3">
            {SAMPLE_RECEIPT.receipt_id} ·{' '}
            <Link href="/verify" className="link-ink">
              verify it yourself
            </Link>
          </p>
        </div>
        <Stamp id="home-check-stored" tone="safe" size="sm" className="shrink-0 -rotate-6">
          {SAMPLE_META.verdict}
        </Stamp>
      </div>
    </div>
  )
}
