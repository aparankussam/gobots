import Link from 'next/link'

export default function StickyMobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#080808]/90 backdrop-blur-md border-t border-white/[0.06]">
      <Link
        href="/book"
        className="block w-full bg-accent text-white font-semibold text-sm text-center py-3.5 rounded-xl hover:bg-accent/90 transition-colors"
      >
        Book Strategy Session →
      </Link>
      <p className="text-center text-[#555] text-xs mt-2">
        Week 1: working system
      </p>
    </div>
  )
}
