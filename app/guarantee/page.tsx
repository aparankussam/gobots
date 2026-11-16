import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { GuaranteeCertificate } from '@/components/home/GuaranteeCertificate'
import { LAUNCH } from '@/content/site'

export const metadata: Metadata = {
  title: 'Week-1 guarantee · Gobots',
  alternates: { canonical: '/guarantee' },
  description: 'A working system on your workflow by the end of week 1 of a Production Sprint, or the sprint is free.',
}

export default function GuaranteePage() {
  if (!LAUNCH.guarantee) notFound()
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="wrap py-16 md:py-24">
          <GuaranteeCertificate />
        </section>
      </main>
      <Footer />
    </>
  )
}
