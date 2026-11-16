import Claim from '@/components/Claim'
import { SPRINT_BRING, SPRINT_NEXT, WEEK_ONE } from '@/content/sprint'

/** Four answers, assembled from content/sprint.ts and the existing data claim. */
const QA: { q: string; a: React.ReactNode }[] = [
  {
    q: 'What is a Production Sprint?',
    a: (
      <>
        <p>
          A time-boxed engagement on one workflow. {WEEK_ONE} Then the same core is applied to your
          next workflows.
        </p>
        <p className="mt-3">Your first call is 20 minutes with an architect, with no commitment and no discovery fee.</p>
      </>
    ),
  },
  {
    q: 'What do we need to provide?',
    a: (
      <ul className="list-disc space-y-1.5 pl-5">
        {SPRINT_BRING.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    ),
  },
  {
    q: 'Where does our data go?',
    a: (
      <>
        <p>
          <Claim id="trust.data">Your data stays in your environment.</Claim> In a Production Sprint
          we deploy into your cloud and your tools, under your access controls. Our hosted products,
          such as the live demo, run on Gobots infrastructure.
        </p>
        <p className="mt-3">
          Every AI decision leaves a signed record your auditors can check without asking us.
        </p>
      </>
    ),
  },
  {
    q: 'What happens after week 4?',
    a: (
      <ul className="space-y-2">
        {SPRINT_NEXT.map((n) => (
          <li key={n.name}>
            <span className="font-semibold">{n.name}.</span> {n.line}
          </li>
        ))}
      </ul>
    ),
  },
]

export default function Questions() {
  return (
    <section id="questions" aria-label="Questions" className="scroll-mt-20 border-t border-ink/80 py-20 md:py-28">
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
        <h2 className="heading text-[clamp(2rem,4.4vw,3.25rem)] lg:col-span-4">
          Questions<span className="text-seal">.</span>
        </h2>
        <div className="border-t border-ink/80 lg:col-span-8">
          {QA.map((item) => (
            <details key={item.q} className="group border-b border-rule py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 heading text-[22px] leading-snug marker:hidden [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="font-mono text-[18px] text-ink-3 group-open:hidden">+</span>
                <span aria-hidden="true" className="hidden font-mono text-[18px] text-ink-3 group-open:inline">−</span>
              </summary>
              <div className="mt-4 max-w-[38rem] text-[16px] leading-relaxed text-ink-2">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
