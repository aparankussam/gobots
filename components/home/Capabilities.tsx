import { CAPABILITIES } from '@/content/site'

/** Large cells. Cell count is chosen so the grid closes with no gaps: 2×(2×2) + 13 = 21 = 7 rows of 3. */
const FEATURED = new Set(['Agentic and multi-agent systems', 'AI governance'])

export default function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-20 border-t border-ink/80 py-24 md:py-32">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <h2 className="heading text-[clamp(2.5rem,5.4vw,4.25rem)] lg:col-span-6">What we build and run<span className="text-seal">.</span></h2>
          <p className="text-[18px] leading-[1.55] text-ink-2 lg:col-span-5 lg:col-start-8 lg:pt-3">
            The practice areas behind every engine. One team covers strategy through production, so
            nothing is lost between the people who plan and the people who ship.
          </p>
        </div>

        <ul className="mt-16 grid grid-flow-dense grid-cols-1 gap-px border border-rule bg-rule md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => {
            const big = FEATURED.has(c.name)
            const last = i === CAPABILITIES.length - 1
            return (
              <li
                key={c.name}
                className={`flex flex-col bg-paper p-6 ${
                  big ? 'md:col-span-2 lg:row-span-2 lg:min-h-[17rem] lg:p-8' : ''
                } ${last ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <span className="font-mono text-[11.5px] text-ink-3">{c.engine}</span>
                <h3 className={`heading mt-2 ${big ? 'text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.05]' : 'text-[22px] leading-tight'}`}>
                  {c.name}
                </h3>
                <p className={`mt-3 leading-relaxed text-ink-2 ${big ? 'max-w-[28rem] text-[17px] lg:mt-auto' : 'text-[14.5px]'}`}>
                  {c.line}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
