import CompanyRecord from './CompanyRecord'
import Figures from './Figures'
import TrustBar from '@/components/TrustBar'
import Claim from '@/components/Claim'
import { INDUSTRIES_WITH_PRODUCT } from '@/content/site'

/** Founder note, company record, three figures, team experience and who the work is for. */
export default function WhoYouWorkWith() {
  return (
    <section id="who" className="scroll-mt-20 border-t border-ink/80 py-24 md:py-32">
      <div className="wrap">
        <h2 className="heading text-[clamp(2.5rem,5.4vw,4.25rem)]">
          Who you work with<span className="text-seal">.</span>
        </h2>

        <article className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h3 className="heading text-[30px] leading-[1.1]">Built from the inside out.</h3>
            <p className="mt-4 font-mono text-[12px] leading-relaxed text-ink-3">
              <Claim id="founder.bio">IBM → UWM → Adient → Gobots</Claim>
            </p>
          </div>
          <div className="max-w-[40rem] lg:col-span-5 lg:col-start-4">
            <p className="text-[19px] leading-[1.6] text-ink">
              A decade inside enterprise AI programmes. Built across IBM, scaled at UWM, deployed at
              Adient. I watched strong ideas get buried in governance theatre, discovery cycles and
              slide decks that never shipped.
            </p>
            <p className="mt-5 text-[19px] leading-[1.6] text-ink-2">
              Gobots exists because execution, not experimentation, creates value. We don&rsquo;t stop
              at advice. We build, we deploy, we govern.
            </p>
            <p className="mt-5 text-[19px] font-medium leading-[1.6] text-ink">
              Your first call is with your architect, not a salesperson.
            </p>
            <div className="mt-10 flex items-end gap-5 border-t border-ink/80 pt-4">
              <div>
                <p className="text-[15px] font-semibold">Anand Parankussam</p>
                <p className="text-[13.5px] text-ink-3">Founder, Gobots</p>
              </div>
            </div>
          </div>
          <div className="pb-8 lg:col-span-4 lg:col-start-9">
            <CompanyRecord />
          </div>
        </article>

        <div className="mt-16">
          <Figures />
        </div>
      </div>

      <div className="mt-12">
        <TrustBar />
      </div>

      <div className="wrap">
        <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-ink-2">
          <span className="label mr-3 text-[10.5px] text-ink-3">Who it is for</span>
          {INDUSTRIES_WITH_PRODUCT.map((i) => i.name).join(' · ')}
        </p>
      </div>
    </section>
  )
}
