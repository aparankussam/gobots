import Claim from '@/components/Claim'
import Seal from '@/components/doc/Seal'
import type { ClaimId } from '@/content/claims'

const ROWS: [string, string, ClaimId?][] = [
  ['Practice', 'AI strategy · governance · security'],
  ['Delivery', 'Forward-deployed AI pods · week-1 systems'],
  ['Products', 'RevXL · GoVTraceAI · Lumen health line'],
  ['In production', 'Three enterprise implementation clients', 'fig.clients'],
  ['Advisory', 'Board-certified physicians', 'advisory.physicians'],
]

/** The company itself, issued as a sealed record (hero mockup B, used as the about block). */
export default function CompanyRecord() {
  return (
    <figure className="relative border border-rule bg-paper-3 shadow-[0_18px_40px_-28px_rgba(18,18,18,0.45)]">
      <div className="flex items-baseline justify-between border-b border-rule px-5 py-3.5">
        <p className="label text-[11px] text-ink">Company record</p>
        <p className="font-mono text-[11px] text-ink-3">gobots · 2026</p>
      </div>
      <dl className="px-5 pb-16 pt-1 text-[14px]">
        {ROWS.map(([k, v, claim], i) => (
          <div key={k} className={`grid grid-cols-[7.5rem_1fr] gap-3 py-3 ${i < ROWS.length - 1 ? 'border-b border-rule' : ''}`}>
            <dt className="label pt-[2px] text-[10.5px] text-ink-3">{k}</dt>
            <dd>{claim ? <Claim id={claim}>{v}</Claim> : v}</dd>
          </div>
        ))}
      </dl>
      <Seal
        id="record-seal"
        size={96}
        ring="Gobots · Full-stack AI company · Company record · "
        center="ISSUED"
        className="absolute -bottom-5 right-4 -rotate-12"
      />
    </figure>
  )
}
