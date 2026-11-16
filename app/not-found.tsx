import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Arrow } from '@/components/doc/icons'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="wrap pb-24 pt-14 md:pt-20 lg:pt-24">
          <p className="label text-[11px] text-ink-3">Error 404</p>
          <h1 className="display mt-4 max-w-[14ch] text-[clamp(2.75rem,7vw,5.5rem)]">
            No record found<span className="text-seal">.</span>
          </h1>
          <p className="mt-8 max-w-[34rem] text-[19px] leading-[1.5] text-ink-2">
            That page does not exist, or it moved. These are the places most visitors want.
          </p>
          <ul className="mt-10 max-w-[34rem] border-t border-ink/80">
            {[
              ['Products', '/#products'],
              ['Proof: live check, verify, open spec', '/#live-proof'],
              ['How a Production Sprint works', '/sprint'],
              ['Start a Production Sprint', '/walkthrough'],
            ].map(([label, href]) => (
              <li key={href} className="border-b border-rule">
                <Link href={href} className="group flex items-center justify-between gap-6 py-4 transition-colors hover:text-seal-ink">
                  <span className="heading text-[22px]">{label}</span>
                  <Arrow size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
