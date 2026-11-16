import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SprintCaption from '@/components/SprintCaption'
import Capabilities from '@/components/home/Capabilities'
import Industries from '@/components/home/Industries'
import { Arrow } from '@/components/doc/icons'

export const metadata: Metadata = {
  title: 'Capabilities · Gobots',
  description:
    'The practice areas behind every Gobots engine, and the industries they serve: strategy, governance, security, agents, automation and operations.',
  alternates: { canonical: '/capabilities' },
}

export default function CapabilitiesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Capabilities />
        <Industries />
        <section className="bg-ink text-paper">
          <div className="wrap flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between">
            <h2 className="display max-w-[18ch] text-[clamp(2rem,4.4vw,3.25rem)]">
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
