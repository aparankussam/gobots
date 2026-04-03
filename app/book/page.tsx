import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const CALENDLY_URL =
  'https://calendly.com/anand-gobotsai/ai-execution-strategy-session?embed_type=Inline&hide_gdpr_banner=1&background_color=0d0d0d&text_color=f5f5f5&primary_color=d4532a'

export const metadata: Metadata = {
  title: 'Book Strategy Session | Gobots',
  description:
    'Schedule an AI execution strategy session with Gobots to identify the fastest path to a working deployment.',
}

export default function BookPage() {
  return (
    <>
      <main className="bg-[#050505] overflow-hidden min-h-screen">
        <Nav />
        <section className="pt-32 pb-24 md:pb-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="w-8 h-[2px] bg-accent mb-2 mx-auto" />
              <p className="text-accent text-xs font-semibold tracking-[0.22em] uppercase mb-3">
                Book Strategy Session
              </p>
              <h1 className="text-[38px] md:text-[56px] font-extrabold text-[#F5F5F5] leading-[1.08] tracking-tight mb-5">
                Schedule your AI execution strategy session.
              </h1>
              <p className="text-[17px] text-[#CFCFCF] max-w-2xl mx-auto leading-relaxed mb-4">
                Pick a time and we&apos;ll review your workflow, governance constraints, and the
                fastest path to a working system.
              </p>
              <Link
                href="/"
                className="text-[14px] font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Back to home
              </Link>
            </div>

            <div className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50 bg-[#0D0D0D]">
              <iframe
                src={CALENDLY_URL}
                title="Book Strategy Session — Gobots"
                className="w-full"
                style={{ height: '760px', border: 'none' }}
                loading="lazy"
              />
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  )
}
