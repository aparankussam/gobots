import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/home/VendorComparison'
import LiveProof from '@/components/LiveProof'
import Products from '@/components/home/Products'
import Engines from '@/components/home/Engines'
import WhoYouWorkWith from '@/components/home/WhoYouWorkWith'
import Questions from '@/components/home/Questions'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export const metadata: Metadata = { alternates: { canonical: '/' } }

/** Eight sections: hero, how it works, proof, products, engines, who you work with, questions, call. */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <LiveProof />
        <Products />
        <Engines />
        <WhoYouWorkWith />
        <Questions />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
