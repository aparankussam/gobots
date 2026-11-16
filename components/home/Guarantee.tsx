import Link from 'next/link'
import Claim from '@/components/Claim'
import Seal from '@/components/doc/Seal'
import { Arrow } from '@/components/doc/icons'
import { LAUNCH } from '@/content/site'
import { GUARANTEE } from '@/content/guarantee'

/** Homepage block for the week-1 guarantee. Renders nothing until LAUNCH.guarantee is on. */
export default function Guarantee() {
  if (!LAUNCH.guarantee) return null
  return (
    <section aria-label="Week-1 guarantee" className="border-t border-ink/80 py-20 md:py-24">
      <div className="wrap grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="label text-[11px] text-ink-3">Week-1 guarantee</p>
          <p className="heading mt-3 text-[clamp(1.8rem,3.6vw,2.75rem)] leading-[1.15]">
            <Claim id="guarantee.week1">{GUARANTEE.promise}</Claim>
          </p>
          <Link href="/guarantee" className="link-ink mt-6 inline-flex items-center gap-2 text-[15px] font-medium">
            Read the terms
            <Arrow size={14} />
          </Link>
        </div>
        <div className="lg:col-span-3 lg:col-start-10 lg:justify-self-end">
          <Seal id="home-guarantee-seal" size={150} ring="Gobots · Week-1 guarantee · Production Sprint · " center="ISSUED" />
        </div>
      </div>
    </section>
  )
}
