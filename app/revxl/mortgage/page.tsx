import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Claim from '@/components/Claim'
import { ArrowUpRight } from '@/components/doc/icons'
import { REVXL_EDITIONS } from '@/content/site'

export const metadata: Metadata = {
  title: 'RevXL for mortgage brokers · Gobots',
  description:
    'Score your mortgage site for borrower conversion, 0 to 100, with a prioritized fix plan. Free, about 90 seconds, just your site and email.',
  alternates: { canonical: '/revxl/mortgage' },
}

const ED = REVXL_EDITIONS[0]

export default function RevxlMortgagePage() {
  const scan = ED.freeScan!
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="wrap pb-16 pt-14 md:pt-20 lg:pb-24 lg:pt-24">
          <p className="label text-[11px] text-ink-3">RevXL · Mortgage edition</p>
          <h1 className="display mt-4 max-w-[17ch] text-[clamp(2.75rem,7vw,5.5rem)]">
            Score your mortgage site free<span className="text-seal">.</span>
          </h1>
          <p className="mt-8 max-w-[38rem] text-[19px] leading-[1.5] text-ink-2 md:text-[21px]">
            <span className="text-ink">
              Scores a mortgage site for borrower conversion, 0 to 100, with a prioritized fix plan.
            </span>
          </p>
          <div className="mt-10">
            <a href={scan.href} target="_blank" rel="noopener noreferrer" className="btn-seal py-3.5">
              {scan.label}
              <ArrowUpRight size={14} />
            </a>
            <p className="mt-3 max-w-[30rem] text-[13.5px] text-ink-3">
              <Claim id="revxl.scan" label="free scan terms">{scan.note}</Claim> Opens RevXL.
            </p>
          </div>
        </section>

        <section className="border-t border-ink/80 py-20 md:py-24">
          <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="heading text-[clamp(1.9rem,3.6vw,2.75rem)]">
                What you get<span className="text-seal">.</span>
              </h2>
              <ol className="mt-6 border-t border-ink/80">
                {ED.outcomes!.map((o, i) => (
                  <li key={o} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-rule py-4 text-[16px] leading-snug">
                    <span className="font-mono text-[12px] leading-[1.7] text-seal-ink tnum">{String(i + 1).padStart(2, '0')}</span>
                    <span>{i === 0 ? <Claim id="revxl.mortgage">{o}</Claim> : o}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="heading text-[clamp(1.9rem,3.6vw,2.75rem)]">
                Who it is for<span className="text-seal">.</span>
              </h2>
              <dl className="mt-6 border-t border-ink/80 text-[15.5px]">
                <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-rule py-3.5">
                  <dt className="label pt-[3px] text-[10.5px] text-ink-3">Loan types</dt>
                  <dd>{ED.loanTypes}</dd>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-rule py-3.5">
                  <dt className="label pt-[3px] text-[10.5px] text-ink-3">Validated with</dt>
                  <dd>
                    <Claim id="revxl.validated">
                      <span className="font-medium">{ED.validatedWith!.join(' · ')}</span>
                    </Claim>
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-[14px] leading-relaxed text-ink-3">
                RevXL is built on the Gobots Core, the same governed foundation as our other products.{' '}
                <Link href="/#products" className="link-ink">
                  See all products
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
