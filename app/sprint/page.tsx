import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Claim from '@/components/Claim'
import Guarantee from '@/components/home/Guarantee'
import SprintCaption from '@/components/SprintCaption'
import { Arrow } from '@/components/doc/icons'
import { SPRINT_BRING, SPRINT_GET, SPRINT_NEXT, SPRINT_PHASES } from '@/content/sprint'

export const metadata: Metadata = {
  title: 'The Production Sprint · Gobots',
  alternates: { canonical: '/sprint' },
  description:
    'A working system on your own workflow in week 1, governed and integrated by week 4, then expanded. See the sprint week by week.',
}

export default function SprintPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="wrap pb-16 pt-14 md:pt-20 lg:pb-24 lg:pt-24">
          <h1 className="display max-w-[16ch] text-[clamp(2.75rem,7vw,5.5rem)]">
            A Production Sprint, week by week<span className="text-seal">.</span>
          </h1>
          <p className="mt-8 max-w-[38rem] text-[19px] leading-[1.5] text-ink-2 md:text-[21px]">
            <span className="text-ink">A working system on your own workflow in week 1.</span> Then we
            govern it, integrate it and expand it.
          </p>
          <div className="mt-10">
            <Link href="/walkthrough" className="btn-seal py-3.5">
              Start a Production Sprint
              <Arrow />
            </Link>
            <SprintCaption className="mt-2.5 max-w-[17rem] text-ink-3" />
          </div>
        </section>

        <section aria-label="The sprint timeline" className="border-t border-ink/80 py-20 md:py-28">
          <div className="wrap">
            <h2 className="heading text-[clamp(2rem,4.4vw,3.25rem)]">
              Three phases, one core<span className="text-seal">.</span>
            </h2>
            <p className="mt-4 max-w-[36rem] text-[17px] leading-[1.55] text-ink-2">
              <Claim id="sprint.plan">A working system in week 1, governed and integrated by week 4, then expanded.</Claim>
            </p>
            <ol className="mt-12 grid grid-cols-1 border-t border-rule md:grid-cols-3">
              {SPRINT_PHASES.map((p, i) => (
                <li
                  key={p.when}
                  className={`border-b border-rule py-8 md:border-b-0 md:py-10 ${i > 0 ? 'md:border-l md:pl-8' : ''} ${i < 2 ? 'md:pr-8' : ''}`}
                >
                  <p className="label text-[10.5px] text-seal-ink">{p.when}</p>
                  <h3 className="heading mt-3 text-[28px] leading-[1.1]">{p.title}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="text-[15.5px] leading-snug text-ink-2">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-ink/80 py-20 md:py-28">
          <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="heading text-[clamp(1.9rem,3.6vw,2.75rem)]">
                What you bring<span className="text-seal">.</span>
              </h2>
              <ul className="mt-6 border-t border-ink/80">
                {SPRINT_BRING.map((b) => (
                  <li key={b} className="border-b border-rule py-3.5 text-[16px] leading-snug">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <h2 className="heading text-[clamp(1.9rem,3.6vw,2.75rem)]">
                What you get<span className="text-seal">.</span>
              </h2>
              <ul className="mt-6 border-t border-ink/80">
                {SPRINT_GET.map((g) => (
                  <li key={g} className="border-b border-rule py-3.5 text-[16px] leading-snug">
                    {g}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[14px] text-ink-3">
                <Claim id="trust.data">Your data stays in your environment.</Claim>
              </p>
            </div>
          </div>
        </section>

        <Guarantee />

        <section className="border-t border-ink/80 py-20 md:py-28">
          <div className="wrap">
            <h2 className="heading text-[clamp(1.9rem,3.6vw,2.75rem)]">
              After the sprint<span className="text-seal">.</span>
            </h2>
            <p className="mt-4 max-w-[34rem] text-[17px] leading-[1.55] text-ink-2">
              Start with one sprint, then add the next engine when the first one proves out.
            </p>
            <ul className="mt-10 grid grid-cols-1 border-t border-rule md:grid-cols-3">
              {SPRINT_NEXT.map((n, i) => (
                <li
                  key={n.name}
                  className={`border-b border-rule py-7 md:border-b-0 ${i > 0 ? 'md:border-l md:pl-8' : ''} ${i < 2 ? 'md:pr-8' : ''}`}
                >
                  <p className="heading text-[30px]">{n.name}</p>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{n.line}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-ink text-paper">
          <div className="wrap flex flex-col gap-8 py-20 md:flex-row md:items-center md:justify-between md:py-24">
            <h2 className="display max-w-[18ch] text-[clamp(2.25rem,5vw,3.75rem)]">
              Start with one workflow<span className="text-seal">.</span>
            </h2>
            <div>
              <Link href="/walkthrough" className="btn-seal w-full py-4 sm:w-auto">
                Start a Production Sprint
                <Arrow />
              </Link>
              <SprintCaption className="mt-3 text-paper/60" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
