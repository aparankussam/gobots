import Image from 'next/image'
import Link from 'next/link'
import { LAUNCH } from '@/content/site'

const LINKS = [
  { label: 'Products', href: '/#products' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'The sprint', href: '/sprint' },
  { label: 'RevXL mortgage', href: '/revxl/mortgage' },
  { label: 'Live demo', href: '/demo' },
  { label: 'Verify', href: '/verify' },
  { label: 'Spec', href: '/spec' },
  { label: 'Evidence', href: '/evidence-gap' },
  ...(LAUNCH.guarantee ? [{ label: 'Guarantee', href: '/guarantee' }] : []),
  { label: 'Start a sprint', href: '/walkthrough' },
]

export default function Footer() {
  return (
    <footer className="bg-ink pb-28 text-paper md:pb-0">
      <div className="wrap border-t border-rule-inv">
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Image src="/gobots-logo-paper.png" alt="Gobots" width={552} height={203} className="h-10 w-auto" />
            <p className="mt-1 text-[13px] text-paper/60">Full-stack AI company</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-paper/75 transition-colors hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-[12.5px] text-paper/60 tnum">© {new Date().getFullYear()} Gobots · gobotsai.com</p>
        </div>
        <p className="microtext border-t border-rule-inv py-2 text-paper/30" aria-hidden="true">
          {'gobots · govtrace receipt format v1 · ed25519 · third-party verifiable · '.repeat(8)}
        </p>
      </div>
    </footer>
  )
}
