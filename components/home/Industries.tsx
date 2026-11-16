import { INDUSTRIES } from '@/content/site'

export default function Industries() {
  return (
    <section id="industries" className="scroll-mt-20 border-t border-ink/80 py-24 md:py-32">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <h2 className="heading text-[clamp(2.5rem,5.4vw,4.25rem)] lg:col-span-6">Where we work<span className="text-seal">.</span></h2>
          <p className="text-[18px] leading-[1.55] text-ink-2 lg:col-span-5 lg:col-start-8 lg:pt-3">
            Regulated and fast-moving industries, where a decision has to be defensible and a
            system has to ship.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 border-t border-ink/80 md:grid-cols-2 md:gap-x-12">
          {INDUSTRIES.map((ind) => (
            <li
              key={ind.name}
              className="flex flex-col gap-1.5 border-b border-rule py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="heading text-[24px] leading-tight">{ind.name}</span>
              <span className="flex flex-wrap gap-x-3 gap-y-1 sm:justify-end">
                {ind.servedBy.map((s) => (
                  <span key={s} className="font-mono text-[12px] text-ink-3">
                    {s}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
