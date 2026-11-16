import Link from 'next/link'
import Claim from '@/components/Claim'
import Seal from '@/components/doc/Seal'
import Stamp from '@/components/doc/Stamp'
import { Arrow, ArrowUpRight } from '@/components/doc/icons'
import EditionSwitcher from './EditionSwitcher'
import InView from './InView'
import { PRODUCT_RECORDS, STATUS_LABEL, STATUS_LEGEND, type ProductRecord, type Status } from '@/content/site'

/** The shared layers every product is built on. */
const CORE_LAYERS = ['agents', 'governance', 'signed receipts', 'integrations']

const TONE: Record<Status, 'safe' | 'seal' | 'ink'> = {
  live: 'safe',
  launching: 'seal',
  built: 'ink',
  'in-development': 'ink',
}

/** Stagger between products in the plug-in animation, in ms. */
const STEP_MS = 900
const delay = (i: number) => ({ ['--d' as string]: `${i * STEP_MS}ms` })

/** One product as a sealed record: real fields, a status stamp and one next step. */
function Record({ p, i }: { p: ProductRecord; i: number }) {
  return (
    <article data-record={p.key} className="relative flex flex-col border border-rule bg-paper-3 shadow-[0_18px_40px_-28px_rgba(18,18,18,0.45)]">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3">
        <p className="label text-[11px] text-ink">Product record</p>
        <span className="whitespace-nowrap">
          <Claim id={p.claim} label={`${p.name} status`}>
            <Stamp id={`status-${p.key}`} tone={TONE[p.status]} size="sm" className="inline-block -rotate-3 align-middle">
              {STATUS_LABEL[p.status].toUpperCase()}
            </Stamp>
          </Claim>
        </span>
      </div>

      <div className="px-5 pt-5">
        <h3 className="heading text-[32px] leading-tight">{p.name}</h3>
        <p className="mt-1.5 text-[15.5px] text-ink-2">{p.promise}</p>
      </div>

      <dl className="mt-3 flex-1 px-5 text-[14.5px]">
        {p.fields.map((f) => (
          <div key={f.label} className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-rule py-3 leading-snug">
            <dt className="label pt-[3px] text-[10.5px] text-ink-3">{f.label}</dt>
            <dd>{f.claim ? <Claim id={f.claim}>{f.value}</Claim> : f.value}</dd>
          </div>
        ))}
        <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-3 pb-16 leading-snug">
          <dt className="label pt-[3px] text-[10.5px] text-ink-3">Next step</dt>
          <dd>
            {p.next.href.startsWith('http') ? (
              <a
                href={p.next.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-seal inline-flex px-4 py-2.5 text-[14px]"
              >
                {p.next.label}
                <ArrowUpRight size={13} />
              </a>
            ) : (
              <Link href={p.next.href} className="btn-ink inline-flex px-4 py-2.5 text-[14px]">
                {p.next.label}
                <Arrow size={13} />
              </Link>
            )}
          </dd>
        </div>
      </dl>

      <Seal
        id={`record-${p.key}`}
        size={78}
        ring="Gobots · Product record · Built on Gobots Core · "
        center="ISSUED"
        className="core-seal pointer-events-none absolute -bottom-4 right-3"
        style={delay(i)}
      />
    </article>
  )
}

export default function Products() {
  return (
    <section id="products" className="scroll-mt-20 border-t border-ink/80 py-24 md:py-32">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <h2 className="heading text-[clamp(2.5rem,5.4vw,4.25rem)] lg:col-span-6">
            Products, built on one core<span className="text-seal">.</span>
          </h2>
          <p className="text-[18px] leading-[1.55] text-ink-2 lg:col-span-5 lg:col-start-8 lg:pt-3">
            Our own software. Each product starts from the same governed core.
          </p>
        </div>

        {/* Plug-in: each pin draws down, its node lands on the core, then that record's seal presses (globals.css, core-*). */}
        <InView className="mt-16">
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-3">
          {PRODUCT_RECORDS.map((p, i) => (
            <Record key={p.key} p={p} i={i} />
          ))}
        </div>

        {/* Each record is pinned to the core: thin rule down, seal-orange node at the joint. */}
        <div aria-hidden="true" className="hidden h-12 grid-cols-3 gap-x-6 lg:grid">
          {PRODUCT_RECORDS.map((p, i) => (
            <span key={p.key} className="relative justify-self-center" style={delay(i)}>
              <span className="core-pin absolute inset-y-0 left-0 w-px bg-ink/55" />
              <span className="core-node absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-seal" />
            </span>
          ))}
        </div>
        </InView>

        <div
          data-core="foundation"
          className="mt-10 flex flex-col gap-4 bg-ink px-5 py-5 text-paper md:flex-row md:items-center md:justify-between lg:mt-0"
        >
          <p>
            <span className="text-[17px] font-semibold">Gobots Core</span>
            <span className="ml-3 text-[14px] text-paper/70">Every product starts from the same layers.</span>
          </p>
          <ul className="flex flex-wrap gap-2">
            {CORE_LAYERS.map((l) => (
              <li key={l} className="rounded-[2px] border border-paper/25 px-2.5 py-1 font-mono text-[12px] text-paper/80">
                {l}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-ink/80 pt-14">
          <EditionSwitcher />
        </div>

        <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-rule pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(STATUS_LEGEND) as Status[]).map((s) => (
            <div key={s}>
              <dt className="text-[14px] font-semibold">{STATUS_LABEL[s]}</dt>
              <dd className="text-[13.5px] text-ink-3">{STATUS_LEGEND[s]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
