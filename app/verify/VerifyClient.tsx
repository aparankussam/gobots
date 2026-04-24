'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

type VerifyResult = {
  valid: boolean
  reason: string
  public_key_id: string
  signature_algo: string
  signed_fields_data: Record<string, unknown>
  verifier_version: string
}

const PLACEHOLDER = `Paste a GoVTraceAI signed receipt here.

Accepted shapes:
  1. The full /audit response
  2. The receipt block on its own
  3. { "receipt": { ... } }

The verifier checks the Ed25519 signature against the
public key published at /.well-known/govtrace-pubkey.json.`

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
    const sample = {
      receipt: {
        receipt_id: 'rcpt_GT-SAMPLE',
        signed_at: '2026-04-24T00:00:00Z',
        signature_algo: 'Ed25519',
        signature: 'PASTE-A-REAL-RECEIPT-FROM-/demo-INSTEAD',
        public_key_id: 'govtrace-signing-v1',
        signed_fields: ['run_id', 'verdict', 'record_hash', 'policy_digest', 'input_hash', 'timestamp'],
        signed_fields_data: {
          run_id: 'GT-SAMPLE',
          verdict: 'POLICY VIOLATION',
          record_hash: '0000000000000000000000000000000000000000000000000000000000000000',
          policy_digest: '0000000000000000000000000000000000000000000000000000000000000000',
          input_hash: '0000000000000000000000000000000000000000000000000000000000000000',
          timestamp: '2026-04-24T00:00:00Z',
        },
      },
    }
    setInput(JSON.stringify(sample, null, 2))
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-[11px] tracking-[0.22em] font-semibold text-accent mb-3">
            INDEPENDENT VERIFICATION
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4">
            Verify a GoVTraceAI receipt.
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Paste any signed receipt. The verifier checks the Ed25519 signature
            against the public key at{' '}
            <Link
              href="https://govtrace-api.vercel.app/.well-known/govtrace-pubkey.json"
              className="text-accent underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              /.well-known/govtrace-pubkey.json
            </Link>
            . Stateless. No DoCR required. No login.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="receipt-input" className="text-sm font-medium text-white/80">
              Receipt JSON
            </label>
            <button
              type="button"
              onClick={loadSample}
              className="text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              Load sample
            </button>
          </div>
          <textarea
            id="receipt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            className="w-full h-72 bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-xs text-white/90 leading-relaxed focus:outline-none focus:border-accent/60 resize-y"
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-white/40">
              Need a real receipt? Run the{' '}
              <Link href="/demo" className="text-accent underline underline-offset-4">
                live demo
              </Link>{' '}
              and copy the JSON from the receipt panel.
            </p>
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || !input.trim()}
              className="bg-accent text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/[0.06] p-5 mb-6">
            <p className="text-sm text-red-300 font-medium mb-1">Verifier error</p>
            <p className="text-sm text-red-200/80">{error}</p>
          </div>
        )}

        {result && (
          <div
            className={`rounded-2xl border p-6 mb-6 ${
              result.valid
                ? 'border-emerald-500/40 bg-emerald-500/[0.06]'
                : 'border-red-500/40 bg-red-500/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-2xl ${result.valid ? 'text-emerald-400' : 'text-red-400'}`}
                aria-hidden
              >
                {result.valid ? '✓' : '✗'}
              </span>
              <div>
                <p
                  className={`text-lg font-bold ${
                    result.valid ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {result.valid ? 'Signature valid' : 'Signature invalid'}
                </p>
                <p className="text-xs text-white/60">
                  Reason: <code className="font-mono">{result.reason}</code>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-5">
              <Field label="public_key_id" value={result.public_key_id} />
              <Field label="signature_algo" value={result.signature_algo} />
              <Field label="verifier_version" value={result.verifier_version} />
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-[11px] tracking-[0.18em] font-semibold text-white/50 mb-3">
                SIGNED FIELDS DATA
              </p>
              <div className="space-y-2">
                {Object.entries(result.signed_fields_data).map(([k, v]) => (
                  <Field key={k} label={k} value={String(v)} />
                ))}
              </div>
            </div>

            <p className="mt-5 text-[11px] text-white/40 leading-relaxed">
              {result.valid
                ? 'These field values were canonicalized, hashed, and signed by the GoVTraceAI engine. Any change to any field would invalidate the signature.'
                : 'The signature does not match the signed fields. Either the fields were modified after signing, or the receipt was signed by a different key than the one currently published.'}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/70">
          <p className="text-[11px] tracking-[0.22em] font-semibold text-white/50 mb-3">
            HOW THIS WORKS
          </p>
          <ol className="space-y-2 list-decimal list-inside leading-relaxed">
            <li>The engine canonicalizes the signed fields with sorted keys and compact separators.</li>
            <li>It SHA-256 hashes that canonical JSON to produce a 32-byte digest.</li>
            <li>It Ed25519-signs the digest with a private key. The matching public key is published.</li>
            <li>This page reverses steps 1 and 2 against the pasted fields and checks the signature.</li>
          </ol>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] tracking-[0.14em] uppercase text-white/40 font-medium">
        {label}
      </span>
      <code className="font-mono text-xs text-white/90 break-all">{value}</code>
    </div>
  )
}
