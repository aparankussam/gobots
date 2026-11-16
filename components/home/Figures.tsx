import Claim from '@/components/Claim'
import { FIGURES } from '@/content/site'

/** Three figures, each with its source marker. Sits inside "Who you work with". */
export default function Figures() {
  return (
    <div role="group" aria-label="Gobots in figures" className="bg-ink text-paper">
      <div className="px-6 py-10 md:px-10 md:py-12">
        <dl className="grid grid-cols-1 gap-y-8 sm:grid-cols-3">
          {FIGURES.map((f, i) => (
            <div
              key={f.label}
              className={`flex flex-col-reverse gap-2 ${i > 0 ? 'sm:border-l sm:border-rule-inv sm:pl-6' : ''}`}
            >
              <dt className="label text-[10.5px] leading-snug text-paper/60">{f.label}</dt>
              <dd
                className={`display leading-none ${
                  f.value.length > 8 ? 'text-[clamp(1.4rem,2.4vw,2rem)] leading-tight' : 'text-[clamp(2.25rem,4.6vw,3.5rem)]'
                }`}
              >
                <Claim id={f.claim} tone="ink" label={`${f.value}, ${f.label.toLowerCase()}`}>
                  {f.value}
                </Claim>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 border-t border-rule-inv pt-4 text-[14.5px] text-paper/70">
          <Claim id="delivery.global" tone="ink">
            Architecture led from the US, delivered by pods worldwide.
          </Claim>
        </p>
      </div>
    </div>
  )
}
