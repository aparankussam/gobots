import Link from 'next/link'
import Stamp from './doc/Stamp'
import Claim from './Claim'
import Receipt from './doc/Receipt'
import InView from './home/InView'
import HomeChecker from './home/HomeChecker'
import { Arrow, ArrowUpRight } from './doc/icons'
import { SPECIMENS } from '@/content/specimens'


const INDEX = [
  { href: '/demo', title: 'Try the live gatekeeper', note: 'Run a scenario, get a signed verdict', external: false },
  { href: '/verify', title: 'Verify a receipt', note: 'Check a signature yourself', external: false },
  { href: '/spec', title: 'Read the open spec', note: 'Receipt Format v1 · CC BY 4.0', external: false },
  { href: '/evidence-gap', title: 'See the evidence artifact', note: 'Why logs are not evidence', external: false },
  { href: 'https://www.npmjs.com/package/@gobotsai/govtrace', title: 'Install the SDK', note: '@gobotsai/govtrace', external: true },
]

export default function LiveProof() {
  return (
    <section id="live-proof" className="border-t border-ink/80 py-24 md:py-32">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <h2 className="heading text-[clamp(2.5rem,5.4vw,4.25rem)] lg:col-span-6">
            Every decision leaves a receipt<span className="text-seal">.</span>
          </h2>
          <p className="text-[18px] leading-[1.55] text-ink-2 lg:col-span-5 lg:col-start-8 lg:pt-3">
            GoVTraceAI sits between your AI and your systems. It returns{' '}
            <span className="font-semibold text-verdict-safe">SAFE</span>,{' '}
            <span className="font-semibold text-verdict-warn">WARNING</span> or{' '}
            <span className="font-semibold text-verdict-block">BLOCK</span> on every action and{' '}
            <Claim id="receipts.signed">signs the result</Claim>, so an auditor can check it without asking us.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-x-12 gap-y-14 lg:grid-cols-12">
          <InView className="lg:col-span-5">
            <Receipt />
          </InView>
          <div className="lg:col-span-6 lg:col-start-7">
            <HomeChecker />
          </div>
        </div>

        <p className="mt-20 text-[13.5px] text-ink-3">
          Illustrative outcomes for three example inputs. Not engine output: the live check above
          returns the engine&rsquo;s own result.
        </p>
        <div className="mt-4 grid border-t border-rule md:grid-cols-3">
          {SPECIMENS.map((s, i) => (
            <article
              key={s.verdict}
              className={`flex flex-col gap-6 border-b border-rule py-8 md:border-b-0 md:py-10 ${
                i > 0 ? 'md:border-l md:pl-8' : ''
              } ${i < 2 ? 'md:pr-8' : ''}`}
            >
              <p className="text-[13px] text-ink-3">Example input</p>
              <p className="heading -mt-3 text-[23px] leading-[1.2]">“{s.prompt}”</p>
              <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
                <p className="max-w-[15rem] text-[14px] leading-snug text-ink-2">{s.reason}</p>
                <Stamp id={`spec-${s.verdict}`} tone={s.tone} size="md" className="shrink-0 -rotate-6">
                  {s.verdict}
                </Stamp>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 border-t border-ink/80 pt-8 lg:grid-cols-12">
          <p className="heading text-[clamp(1.5rem,2.6vw,2rem)] leading-snug lg:col-span-6">
            <Claim id="trust.data">Your data stays in your environment.</Claim>
          </p>
          <p className="max-w-[34rem] text-[16.5px] leading-[1.55] text-ink-2 lg:col-span-5 lg:col-start-8">
            In a Production Sprint we deploy into your cloud and your tools, under your access
            controls. Our hosted products, such as the live demo, run on Gobots infrastructure. Every
            AI decision leaves a signed record your auditors can check without asking us.
          </p>
        </div>

        <nav aria-label="Evidence" className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <p className="max-w-xs text-[15px] leading-relaxed text-ink-2 lg:col-span-4">
            Don&rsquo;t take our word for it. Run it, verify it, or read how it works.
          </p>
          <ul className="border-t border-ink/80 lg:col-span-8">
            {INDEX.map((l) => {
              const inner = (
                <>
                  <span className="heading text-[22px] md:text-[26px]">{l.title}</span>
                  <span className="hidden font-mono text-[12px] text-ink-3 sm:block">{l.note}</span>
                  {l.external ? <ArrowUpRight size={16} /> : <Arrow size={16} />}
                </>
              )
              const cls =
                'group grid grid-cols-[1fr_auto] items-center gap-6 py-4 transition-colors hover:text-seal-ink sm:grid-cols-[1fr_auto_auto]'
              return (
                <li key={l.href} className="border-b border-rule">
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={l.href} className={cls}>
                      {inner}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </section>
  )
}
