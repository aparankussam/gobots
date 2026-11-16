import Link from 'next/link'
import Guilloche from './doc/Guilloche'
import SprintCaption from './SprintCaption'
import { Arrow } from './doc/icons'
import { WEEK_ONE } from '@/content/sprint'

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <Guilloche
        className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full text-seal"
        width={1400}
        height={96}
        strands={18}
        opacity={0.35}
      />
      <div className="wrap relative grid grid-cols-1 gap-12 pb-24 pt-36 md:pb-32 lg:grid-cols-12">
        <h2 className="display text-[clamp(2.75rem,6.4vw,5.25rem)] lg:col-span-7">
          Start with one workflow<span className="text-seal">.</span>
        </h2>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
          <p className="text-[18px] leading-[1.55] text-paper/80">
            Bring the workflow. {WEEK_ONE}
          </p>
          <Link href="/walkthrough" className="btn-seal mt-8 w-full py-4 sm:w-auto">
            Start a Production Sprint
            <Arrow />
          </Link>
          <SprintCaption className="mt-3 text-paper/60" />
          <Link href="/sprint" className="mt-4 inline-flex items-center gap-2 text-[14.5px] text-paper/80 underline underline-offset-4 hover:text-paper sm:ml-5">
            See how a sprint works
          </Link>
          <dl className="mt-10 space-y-2 border-t border-rule-inv pt-5 text-[14px]">
            <div className="flex justify-between gap-4">
              <dt className="text-paper/60">Form</dt>
              <dd>Four fields, then a calendar</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-paper/60">First call</dt>
              <dd>With your architect, not a salesperson</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-paper/60">Length</dt>
              <dd>20 minutes</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-paper/60">Email</dt>
              <dd className="font-mono text-[13px]">hello@gobotsai.com</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
