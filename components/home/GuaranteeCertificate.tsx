import Guilloche from '@/components/doc/Guilloche'
import Seal from '@/components/doc/Seal'
import { GUARANTEE } from '@/content/guarantee'

/** The week-1 guarantee as a printable sealed certificate. */
export function GuaranteeCertificate() {
  return (
    <article className="relative mx-auto max-w-[44rem] overflow-hidden border border-ink/80 bg-paper-3 print:border-ink">
      <Guilloche className="h-20 w-full text-seal" width={900} height={80} strands={14} opacity={0.35} />
      <div className="px-6 pb-12 pt-8 md:px-12">
        <p className="label text-[11px] tracking-[0.14em] text-ink-2">Gobots · Certificate</p>
        <h1 className="display mt-3 text-[clamp(2.4rem,6vw,3.75rem)]">
          Week-1 guarantee<span className="text-seal">.</span>
        </h1>
        <p className="heading mt-8 text-[clamp(1.4rem,3vw,1.85rem)] leading-snug">{GUARANTEE.promise}</p>

        <h2 className="mt-10 border-b border-ink/80 pb-2 text-[15px] font-semibold">Conditions</h2>
        <ol className="mt-2">
          {GUARANTEE.conditions.map((c, i) => (
            <li key={c} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-rule py-3 text-[16px] leading-relaxed">
              <span className="font-mono text-[12px] leading-[1.9] text-seal-ink tnum">{String(i + 1).padStart(2, '0')}</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex items-end justify-between gap-6">
          <div className="text-[14px]">
            <p className="font-semibold">Anand Parankussam</p>
            <p className="text-ink-3">Founder, Gobots</p>
            {/* TODO(founder): replace with the date the terms were reviewed. */}
            <p className="mt-2 font-mono text-[12px] text-ink-3">Terms reviewed: pending</p>
          </div>
          <Seal id="guarantee-seal" size={120} ring="Gobots · Week-1 guarantee · Production Sprint · " center="ISSUED" />
        </div>
      </div>
    </article>
  )
}
