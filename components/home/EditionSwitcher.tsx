import Claim from '@/components/Claim'
import { ArrowUpRight } from '@/components/doc/icons'
import { REVXL_EDITIONS, STATUS_LABEL, type RevxlEdition } from '@/content/site'
import Link from 'next/link'

const MORTGAGE = REVXL_EDITIONS[0] as RevxlEdition & Required<Pick<RevxlEdition, 'outcomes' | 'freeScan' | 'validatedWith'>>

/** The other editions, as one status line. They return as tabs when each has real outcomes. */
export function otherEditions() {
  const rest = REVXL_EDITIONS.slice(1)
  const built = rest.filter((e) => e.status === 'built').map((e) => e.name)
  const dev = rest.filter((e) => e.status === 'in-development').map((e) => e.name)
  return { built, dev }
}

/** RevXL, led by the one edition that has real outcomes: Mortgage. */
export default function EditionSwitcher() {
  const { built, dev } = otherEditions()
  return (
    <div id="revxl-editions" data-revxl-record="" className="scroll-mt-24 grid grid-cols-1 items-start gap-x-12 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <p className="label text-[11px] text-ink-3">RevXL · Mortgage edition</p>
        <h3 className="heading mt-3 text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.05]">
          RevXL for {MORTGAGE.audience}
          <span className="text-seal">.</span>
        </h3>
        <p className="mt-4 max-w-[30rem] text-[17px] leading-[1.55] text-ink-2">
          Scores a mortgage site for borrower conversion, 0 to 100, with a prioritized fix plan.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href={MORTGAGE.freeScan.href} target="_blank" rel="noopener noreferrer" className="btn-seal py-3">
            {MORTGAGE.freeScan.label}
            <ArrowUpRight size={14} />
          </a>
          <Link href="/revxl/mortgage" className="link-ink text-[14.5px] font-medium">
            What the mortgage edition covers
          </Link>
        </div>
        <p className="mt-3 text-[13px] text-ink-3">
          <Claim id="revxl.scan" label="free scan terms">
            {MORTGAGE.freeScan.note}
          </Claim>
        </p>
        <p className="mt-6 max-w-[30rem] text-[13.5px] leading-relaxed text-ink-3">
          Also built: {built.join(', ')}. In development: {dev.join(', ')}.{' '}
          <Link href="/walkthrough" className="link-ink">
            Book a RevXL briefing
          </Link>{' '}
          for those.
        </p>
      </div>

      <div className="border border-rule bg-paper-3 shadow-[0_18px_40px_-28px_rgba(18,18,18,0.45)] lg:col-span-6">
        <div className="flex items-baseline justify-between gap-3 border-b border-rule px-5 py-3.5">
          <p className="label text-[11px] text-ink">RevXL · {MORTGAGE.name} edition</p>
          <p className="font-mono text-[11.5px] text-ink-3">{STATUS_LABEL[MORTGAGE.status]}</p>
        </div>
        <dl className="px-5 pb-3 pt-1 text-[14.5px]">
          <Field label="For">{MORTGAGE.audience.charAt(0).toUpperCase() + MORTGAGE.audience.slice(1)}</Field>
          <Field label="You get">
            <ol>
              {MORTGAGE.outcomes.map((o, i) => (
                <li key={o} className={`grid grid-cols-[1.75rem_1fr] gap-1 py-2 leading-snug ${i > 0 ? 'border-t border-rule' : 'pt-0'}`}>
                  <span className="font-mono text-[11.5px] leading-[1.7] text-seal-ink tnum">{String(i + 1).padStart(2, '0')}</span>
                  <span>{i === 0 ? <Claim id="revxl.mortgage">{o}</Claim> : o}</span>
                </li>
              ))}
            </ol>
          </Field>
          {MORTGAGE.loanTypes && <Field label="Loan types">{MORTGAGE.loanTypes}</Field>}
          <Field label="Validated with">
            <Claim id="revxl.validated">
              <span className="font-medium">{MORTGAGE.validatedWith.join(' · ')}</span>
            </Claim>
          </Field>
          <Field label="Built on" last>
            Gobots Core
          </Field>
        </dl>
      </div>
    </div>
  )
}

function Field({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`grid grid-cols-1 gap-1 py-3 sm:grid-cols-[7.5rem_1fr] sm:gap-3 ${last ? '' : 'border-b border-rule'}`}>
      <dt className="label pt-[3px] text-[10.5px] text-ink-3">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
