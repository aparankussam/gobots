'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Guilloche from '@/components/doc/Guilloche'
import Seal from '@/components/doc/Seal'
import Stamp from '@/components/doc/Stamp'
import { Arrow, ArrowUpRight, Cross } from '@/components/doc/icons'
import { SAMPLE_META, SAMPLE_RECEIPT } from '@/content/sample-receipt'

type VerifyResult = {
  valid: boolean
  reason: string
  public_key_id: string
  signature_algo: string
  signed_fields_data: Record<string, unknown>
  verifier_version: string
}

const PUBKEY_URL = 'https://govtrace-api.vercel.app/.well-known/govtrace-pubkey.json'

const PLACEHOLDER = `Paste a GoVTraceAI signed receipt here.

Accepted shapes:
  1. The full /audit response
  2. The receipt block on its own
  3. { "receipt": { ... } }

The verifier checks the Ed25519 signature against the
public key published at /.well-known/govtrace-pubkey.json.`

const STEPS = [
  'The engine canonicalizes the signed fields with sorted keys and compact separators.',
  'It SHA-256 hashes that canonical JSON to produce a 32-byte digest.',
  'It Ed25519-signs the digest with a private key. The matching public key is published.',
  'This page reverses steps 1 and 2 against the pasted fields and checks the signature.',
]

export default function VerifyClient() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    setError(null)
    setResult(null)
    setLoading(true)

    let parsed: unknown
    try {
      parsed = JSON.parse(input)
    } catch {
      setError('Input is not valid JSON. Paste a receipt or full audit response.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/govtrace/verify-receipt', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed),
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body?.message || `Verifier returned HTTP ${res.status}.`)
      } else {
        setResult(body as VerifyResult)
      }
    } catch (err) {
      setError('Could not reach the verifier. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  function loadSample() {
    // A real receipt signed by the live engine (see content/sample-receipt.ts), so the first click verifies.
    setInput(JSON.stringify({ receipt: SAMPLE_RECEIPT }, null, 2))
    setResult(null)
    setError(null)
  }

  const isEmpty = !input.trim()

  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="wrap pb-24 pt-14 md:pb-32 md:pt-20 lg:pt-24">
          {/* Heading */}
          <div className="grid gap-8 lg:grid-cols-12">
            <h1 className="heading text-[clamp(2.5rem,5.6vw,4.5rem)] lg:col-span-6">
              Verify a notarized AI receipt<span className="text-seal">.</span>
            </h1>
            <p className="text-[18px] leading-[1.55] text-ink-2 lg:col-span-5 lg:col-start-8 lg:pt-3">
              Paste any GoVTrace Receipt v1 (the signed form of a Duty-of-Care Record). The verifier checks the Ed25519 signature against the
              published public key. Stateless, no login, and the same result you get from{' '}
              <Code>npm i -g @gobotsai/govtrace</Code> on the command line.{' '}
              <Link href="/spec" className="link-ink text-ink">
                Read the spec
              </Link>
              .
            </p>
          </div>

          <div className="mt-16 grid gap-x-12 gap-y-16 lg:grid-cols-12">
            {/* Intake form + outcome */}
            <div className="min-w-0 lg:col-span-7">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!loading && !isEmpty) handleVerify()
                }}
                className="border-y border-ink/80"
                aria-describedby="receipt-help"
              >
                <div className="flex items-baseline justify-between gap-4 border-b border-rule py-3">
                  <p className="text-[15px] font-semibold">Receipt intake</p>
                  <p className="text-[13px] text-ink-3">Stateless. No login.</p>
                </div>

                <div className="py-5">
                  <div className="mb-2 flex items-baseline justify-between gap-4">
                    <label htmlFor="receipt-input" className="label text-ink-2">
                      Receipt JSON
                    </label>
                    <button
                      type="button"
                      onClick={loadSample}
                      className="link-ink text-[14px] font-medium text-ink-2 hover:text-ink"
                    >
                      Load sample
                    </button>
                  </div>
                  <p className="-mt-1 mb-2 text-[12.5px] text-ink-3">
                    The sample is a real receipt signed by the live engine on {SAMPLE_META.capturedOn}. The engine records its SAFE result as the COMPLIANT status in the signed fields.
                  </p>
                  <textarea
                    id="receipt-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={PLACEHOLDER}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'verify-error receipt-help' : 'receipt-help'}
                    className={`block h-72 w-full resize-y rounded-doc border bg-paper-3 p-4 font-mono text-[13px] leading-relaxed text-ink transition-colors focus:border-ink focus:outline-none ${
                      error
                        ? 'border-verdict-block/70 hover:border-verdict-block'
                        : 'border-ink/30 hover:border-ink/60'
                    }`}
                  />
                  <p id="receipt-help" className="mt-2 text-[14px] leading-relaxed text-ink-3">
                    Need a real receipt? Run the{' '}
                    <Link href="/demo" className="link-ink text-ink-2">
                      live demo
                    </Link>{' '}
                    and copy the JSON from the receipt panel.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-rule py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[13px] text-ink-3" aria-live="polite">
                    {loading
                      ? 'Checking the signature against the published key…'
                      : isEmpty
                        ? 'Paste a receipt to enable verification.'
                        : 'Ready to verify.'}
                  </p>
                  <button
                    type="submit"
                    disabled={loading || isEmpty}
                    aria-busy={loading || undefined}
                    className="btn-ink w-full disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink disabled:active:translate-y-0 sm:w-auto"
                  >
                    {loading ? 'Verifying…' : 'Verify signature'}
                    {!loading && <Arrow />}
                  </button>
                </div>
              </form>

              {/* Outcome */}
              <div className="mt-12" aria-live="polite">
                {error ? (
                  <ErrorNotice id="verify-error" message={error} />
                ) : result ? (
                  <Certificate result={result} />
                ) : (
                  <div className="rounded-doc border border-dashed border-ink/25 px-6 py-10 text-center">
                    <p className="heading text-[22px] text-ink-2">
                      {loading ? 'Checking signature…' : 'No receipt checked yet.'}
                    </p>
                    <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-3">
                      {loading
                        ? 'Recomputing the digest and testing it against the published Ed25519 key.'
                        : 'The outcome is issued here as a slip: valid receipts are sealed, altered ones are marked invalid.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Method */}
            <aside className="lg:col-span-4 lg:col-start-9">
              <h2 className="heading text-[28px]">How the check works</h2>
              <ol className="mt-6 border-t border-ink/80">
                {STEPS.map((s, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[2rem_1fr] gap-3 border-b border-rule py-4 text-[15px] leading-relaxed text-ink-2"
                  >
                    <span className="tnum font-semibold text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <dl className="mt-10 space-y-3 border-t border-rule pt-5 text-[14px]">
                <div className="grid gap-1">
                  <dt className="text-ink-3">Public key</dt>
                  <dd className="min-w-0">
                    <a
                      href={PUBKEY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-ink break-all font-mono text-[12.5px]"
                    >
                      /.well-known/govtrace-pubkey.json
                      <ArrowUpRight size={12} className="ml-1 inline align-[-1px]" />
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <dt className="text-ink-3">Algorithm</dt>
                  <dd>Ed25519 over SHA-256</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <dt className="text-ink-3">Requires</dt>
                  <dd>No DoCR, no login</dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <dt className="text-ink-3">Format</dt>
                  <dd>
                    <Link href="/spec" className="link-ink">
                      GoVTrace Receipt v1
                    </Link>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function ErrorNotice({ id, message }: { id: string; message: string }) {
  return (
    <div id={id} role="alert" className="border-y border-verdict-block/50 py-5">
      <p className="flex items-center gap-2 text-[15px] font-semibold text-verdict-block">
        <Cross size={13} />
        Verification could not run
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink">{message}</p>
      <p className="mt-1 text-[14px] leading-relaxed text-ink-3">
        Check that the whole receipt was pasted, including the opening and closing braces, or
        copy a fresh one from the{' '}
        <Link href="/demo" className="link-ink text-ink-2">
          live demo
        </Link>
        .
      </p>
    </div>
  )
}

function Certificate({ result }: { result: VerifyResult }) {
  const valid = result.valid
  const fields = Object.entries(result.signed_fields_data ?? {})
  return (
    <figure className="mx-auto w-full max-w-[36rem] overflow-x-clip lg:mx-0">
      <div
        className="perf-top perf-bottom relative bg-paper-3 text-ink"
        style={{
          boxShadow:
            '0 1px 0 rgba(18,18,18,0.06), 0 2px 4px -2px rgba(18,18,18,0.12), 0 32px 60px -36px rgba(18,18,18,0.55)',
        }}
      >
        {/* Header band */}
        <div className="relative overflow-hidden border-b border-ink/80 px-5 pb-4 pt-6 sm:px-6">
          <Guilloche
            className={`absolute inset-0 h-full w-full ${valid ? 'text-seal' : 'text-verdict-block'}`}
            opacity={valid ? 0.32 : 0.22}
          />
          <div className="relative flex items-baseline justify-between gap-3">
            <p className="label text-[11px] tracking-[0.14em]">Verification result</p>
            <p className="font-mono text-[11px] text-ink-2">{result.verifier_version}</p>
          </div>
          <p className={`relative mt-2 heading text-[26px] ${valid ? '' : 'text-verdict-block'}`}>
            {valid ? 'Signature valid' : 'Signature invalid'}
          </p>
        </div>
        <p className="microtext border-b border-rule px-5 py-1 text-ink-3 sm:px-6" aria-hidden="true">
          {'ed25519 · canonical json · sha-256 · verifiable without the issuer · '.repeat(4)}
        </p>

        {/* Key facts */}
        <dl className="space-y-2 px-5 pt-5 font-mono text-[12.5px] sm:px-6">
          <Row k="reason" v={result.reason} tone={valid ? 'safe' : 'block'} />
          <Row k="public_key_id" v={result.public_key_id} />
          <Row k="signature_algo" v={result.signature_algo} />
        </dl>

        {/* Signed fields */}
        <div className="mt-5 border-y border-dashed border-ink/25 px-5 py-4 sm:px-6">
          <p className="label mb-3 text-[10.5px] text-ink-3">Signed fields</p>
          {fields.length > 0 ? (
            <dl className="space-y-2 font-mono text-[12.5px]">
              {fields.map(([k, v]) => (
                <Row key={k} k={k} v={String(v)} />
              ))}
            </dl>
          ) : (
            <p className="text-[14px] text-ink-3">The verifier returned no signed field data.</p>
          )}
        </div>

        {/* Verdict */}
        <div className="relative px-5 pb-7 pt-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[12px] text-ink-3">outcome</span>
            <Stamp
              id={valid ? 'verify-ok' : 'verify-bad'}
              tone={valid ? 'safe' : 'block'}
              size="md"
              className="-rotate-6"
            >
              {valid ? 'VERIFIED' : 'INVALID'}
            </Stamp>
          </div>
          <p
            className={`mt-4 text-[14px] leading-relaxed text-ink-2 ${valid ? 'pr-24 sm:pr-32' : ''}`}
          >
            {valid
              ? 'These field values were canonicalized, hashed, and signed by the GoVTraceAI engine. Any change to any field would invalidate the signature.'
              : 'The signature does not match the signed fields. Either the fields were modified after signing, or the receipt was signed by a different key than the one currently published.'}
          </p>
          {valid && (
            <Seal
              id="verify-seal"
              size={112}
              className="seal-stamp pointer-events-none absolute -bottom-4 right-4 h-[88px] w-[88px] sm:h-[112px] sm:w-[112px]"
              style={{ '--d': '0.2s' } as React.CSSProperties}
            />
          )}
        </div>
      </div>
    </figure>
  )
}

function Row({ k, v, tone }: { k: string; v: string; tone?: 'safe' | 'block' }) {
  return (
    <div className="grid gap-x-3 gap-y-0.5 sm:grid-cols-[8.5rem_1fr]">
      <dt className="text-ink-3">{k}</dt>
      <dd
        className={`min-w-0 break-all ${
          tone === 'safe' ? 'text-verdict-safe' : tone === 'block' ? 'text-verdict-block' : ''
        }`}
      >
        {v}
      </dd>
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="whitespace-nowrap rounded-doc border border-rule bg-paper-2 px-1.5 py-0.5 font-mono text-[0.82em] text-ink">
      {children}
    </code>
  )
}
