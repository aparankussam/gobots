import Guilloche from './Guilloche'
import Seal from './Seal'
import { Check } from './icons'

const CHECKS = [
  { label: 'PII scan · SSN, email', value: 'clean' },
  { label: 'Prompt injection', value: 'clean' },
  { label: 'Policy fin-ops/ap-v3', value: 'pass' },
  { label: 'POST /erp/invoices', value: '200' },
]

const FIELDS: [string, string][] = [
  ['receipt_id', 'rcpt_01J9X4K2QF'],
  ['run_id', 'run_4821'],
  ['input', 'invoice_q3_final.pdf'],
]

/**
 * Specimen GoVTrace receipt. The checks ink in and the seal stamps down in
 * pure CSS, so the slip is fully legible before any JavaScript runs.
 */
export default function Receipt() {
  return (
    <figure className="relative mx-auto w-full max-w-[26rem] lg:mr-0">
      <div
        className="perf-top perf-bottom relative bg-paper-3 text-ink"
        style={{
          boxShadow:
            '0 1px 0 rgba(18,18,18,0.06), 0 2px 4px -2px rgba(18,18,18,0.12), 0 32px 60px -36px rgba(18,18,18,0.55)',
          transform: 'rotate(0.8deg)',
        }}
      >
        {/* Header band */}
        <div className="relative overflow-hidden border-b border-ink/80 px-5 pb-3 pt-5">
          <Guilloche className="absolute inset-0 h-full w-full text-seal" opacity={0.32} />
          <div className="relative flex items-baseline justify-between gap-3">
            <p className="label text-[11px] tracking-[0.14em]">GoVTrace receipt</p>
            <p className="font-mono text-[10.5px] text-ink-2">format v1.0.0</p>
          </div>
          <p className="relative mt-2 heading text-[22px]">Agent run trace</p>
        </div>
        <p className="microtext border-b border-rule px-5 py-1 text-ink-3" aria-hidden="true">
          {'ed25519 · canonical json · sha-256 · verifiable without the issuer · '.repeat(4)}
        </p>

        {/* Fields */}
        <dl className="space-y-1.5 px-5 pt-4 font-mono text-[12px]">
          {FIELDS.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-2">
              <dt className="text-ink-3">{k}</dt>
              <dd className="truncate">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Checks */}
        <ol className="mt-4 border-y border-dashed border-ink/25 px-5 py-3 text-[13px]">
          {CHECKS.map((c, i) => (
            <li key={c.label} className="flex items-baseline gap-2 py-[3px]">
              <span className="whitespace-nowrap">{c.label}</span>
              <span className="mb-[3px] flex-1 border-b border-dotted border-ink/30" aria-hidden="true" />
              <span
                className="sig-step inline-flex items-center gap-1 font-mono text-[12px] text-verdict-safe"
                style={{ '--i': i } as React.CSSProperties}
              >
                {c.value}
                <Check size={11} />
              </span>
            </li>
          ))}
        </ol>

        {/* Verdict + signature */}
        <div className="relative px-5 pb-6 pt-4">
          <div
            className="sig-step flex items-baseline justify-between"
            style={{ '--i': CHECKS.length } as React.CSSProperties}
          >
            <span className="font-mono text-[12px] text-ink-3">verdict</span>
            <span className="heading text-[34px] leading-none text-verdict-safe">SAFE</span>
          </div>
          <dl
            className="sig-step mt-3 space-y-1.5 font-mono text-[11.5px]"
            style={{ '--i': CHECKS.length + 1 } as React.CSSProperties}
          >
            <div className="grid grid-cols-[6.5rem_1fr] gap-2">
              <dt className="text-ink-3">policy_digest</dt>
              <dd className="truncate">sha256:9f2c41e0…a71e</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_1fr] gap-2">
              <dt className="text-ink-3">signed_at</dt>
              <dd className="tnum">2026-11-06T14:02:11Z</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_1fr] gap-2">
              <dt className="text-ink-3">signature</dt>
              <dd className="break-all pr-24 leading-snug text-ink-2">
                k3VqR0dPq8Zl1mW9cT2xNfA7hJ4sYbE6uK0iLgD5oXw
              </dd>
            </div>
          </dl>
          <Seal
            id="hero-seal"
            size={118}
            className="seal-stamp absolute -bottom-3 right-2"
            style={{ '--d': '2.75s' } as React.CSSProperties}
          />
        </div>
      </div>
      <figcaption className="mt-5 text-right text-[12.5px] text-ink-3 lg:pr-1">
        Specimen. Every verdict is signed like this.{' '}
        <a href="/verify" className="link-ink text-ink-2">
          Verify one
        </a>
      </figcaption>
    </figure>
  )
}
