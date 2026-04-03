import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <Image
            src="/gobots-logo.png"
            alt="goBots"
            width={96}
            height={24}
            className="h-6 w-auto"
            style={{ filter: 'brightness(1.1) contrast(1.05)' }}
          />
          <span className="text-[#6B7280] text-[10px] tracking-[0.15em] font-medium uppercase hidden sm:inline">
            AI Execution Co.
          </span>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: 'GoVTraceAI', href: '#live-proof' },
            { label: 'Strategy Session', href: '/book' },
            { label: 'Contact',   href: 'mailto:pilot@gobotsai.com' },
          ].map((l) => (
            l.href.startsWith('mailto:') ? (
              <a
                key={l.label}
                href={l.href}
                className="text-[13px] text-[#9CA3AF] hover:text-[#CFCFCF] transition-colors font-medium"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13px] text-[#9CA3AF] hover:text-[#CFCFCF] transition-colors font-medium"
              >
                {l.label}
              </Link>
            )
          ))}
        </div>
        <p className="text-[12px] text-[#6B7280]">
          © {new Date().getFullYear()} Gobots · gobotsai.com
        </p>
      </div>
    </footer>
  )
}
