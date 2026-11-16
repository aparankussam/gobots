import Link from 'next/link'
import Claim from './Claim'
import SprintCaption from './SprintCaption'
import { Arrow, ArrowUpRight } from './doc/icons'
import { REVXL_EDITIONS } from '@/content/site'

const SCAN = REVXL_EDITIONS[0].freeScan!

export default function Hero() {
  return (
    <section className="relative overflow-x-clip pt-16">
      <div className="wrap pb-16 pt-14 md:pt-20 lg:pb-20 lg:pt-24">
        <h1 className="display max-w-[16ch] text-[clamp(3rem,7.2vw,5.75rem)]">
          A working AI system on your workflow in week 1<span className="text-seal">.</span>
        </h1>

        <p className="mt-8 max-w-[40rem] text-[19px] leading-[1.5] text-ink-2 md:text-[21px]">
          <span className="text-ink">
            Gobots is a full-stack AI company: AI strategy, forward-deployed engineering pods and
            our own products.
          </span>{' '}
          Governed, integrated and receipted by week 4.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div>
            <Link href="/walkthrough" className="btn-seal py-3.5">
              Start a Production Sprint
              <Arrow />
            </Link>
            <SprintCaption className="mt-2.5 max-w-[17rem] text-ink-3" />
          </div>
          <Link href="#live-check" className="btn-rule py-3.5">
            Run a live check
          </Link>
        </div>

        {/* No-call actions: both work without booking anything. */}
        <div className="mt-14 max-w-[46rem] border-t border-ink/80">
          <p className="label pt-4 text-[10.5px] text-ink-3">Start without a call</p>
          <ul>
            <li className="border-b border-rule">
              <a
                href={SCAN.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-4 transition-colors hover:text-seal-ink"
              >
                <span className="heading text-[22px] md:text-[26px]">{SCAN.label}</span>
                <ArrowUpRight size={16} />
                <span className="col-span-2 text-[14px] leading-snug text-ink-3">
                  <Claim id="revxl.scan" label="free scan terms">
                    Opens RevXL. It asks for your site and email and returns a score in about 90 seconds.
                  </Claim>
                </span>
              </a>
            </li>
            <li className="border-b border-rule">
              <Link
                href="#live-check"
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-4 transition-colors hover:text-seal-ink"
              >
                <span className="heading text-[22px] md:text-[26px]">Run a live AI governance check</span>
                <Arrow size={16} />
                <span className="col-span-2 text-[14px] leading-snug text-ink-3">
                  Pick an example. The live GoVTraceAI engine returns a verdict and a signed receipt you can verify.
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 grid max-w-[40rem] grid-cols-[auto_1fr] gap-x-4 text-[14px] leading-relaxed">
          <span className="label pt-[3px] text-[10.5px] text-ink-3">Founder</span>
          <p className="text-ink-2">
            <span className="font-semibold text-ink">Anand Parankussam</span>, Enterprise AI &amp;
            Automation Leader{' '}
            <Claim id="founder.bio">(ex-IBM, UWM, Adient)</Claim>
          </p>
        </div>
      </div>
    </section>
  )
}
