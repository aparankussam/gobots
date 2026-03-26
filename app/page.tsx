import Nav        from '@/components/Nav'
import Hero       from '@/components/Hero'
import TrustBar   from '@/components/TrustBar'
import Problem    from '@/components/Problem'
import Approach   from '@/components/Approach'
import LiveProof  from '@/components/LiveProof'
import WhatWeBuild from '@/components/WhatWeBuild'
import POV        from '@/components/POV'
import CTA        from '@/components/CTA'
import Footer     from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-[#050505] overflow-hidden">
      <Nav />
      <Hero />
      <TrustBar />
      <Problem />
      <Approach />
      <LiveProof />
      <WhatWeBuild />
      <POV />
      <CTA />
      <Footer />
    </main>
  )
}
