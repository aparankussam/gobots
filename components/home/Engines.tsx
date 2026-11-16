import Link from 'next/link'
import SprintCaption from '@/components/SprintCaption'
import { Arrow } from '@/components/doc/icons'
import { ENGINES } from '@/content/site'

/** Three engines as one compact row. Each has a text link, not a button. */
export default function Engines() {
  return (
    <section id="engines" className="scroll-mt-20 border-t border-ink/80 py-20 md:py-24">
      <div className="wrap">
        <h2 className="heading text-[clamp(2rem,4.2vw,3.25rem)]">
          Three engines. Start with any one<span className="text-seal">.</span>
        </h2>
        <div className="mt-10 grid grid-cols-1 border-t border-rule md:grid-cols-3">
          {ENGINES.map((e, i) => (
            <article
              key={e.key}
              className={`flex flex-col border-b border-rule py-7 md:border-b-0 md:py-8 ${
                i > 0 ? 'md:border-l md:pl-8' : ''
              } ${i < 2 ? 'md:pr-8' : ''}`}
            >
              <p className="label text-[10.5px] text-ink-3">
                {e.n} · {e.name}
              </p>
              <h3 className="heading mt-3 text-[26px] leading-[1.1]">{e.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{e.body}</p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                {e.covers.map((c) => (
                  <li key={c} className="font-mono text-[12px] text-ink-3">
                    {c}
                  </li>
                ))}
              </ul>
              {e.key === 'deploy' ? (
                <div className="mt-5">
                  <Link href="/walkthrough" className="btn-seal py-3">
                    {e.firstStep}
                    <Arrow />
                  </Link>
                  <SprintCaption className="mt-2.5 text-ink-3" />
                </div>
              ) : (
                <Link
                  href="/walkthrough"
                  className="link-ink mt-5 inline-flex items-center gap-2 self-start text-[14.5px] font-medium"
                >
                  {e.firstStep}
                  <Arrow size={13} />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
