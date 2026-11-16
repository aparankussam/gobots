import type { Metadata } from 'next'
import WalkthroughClient from './WalkthroughClient'

export const metadata: Metadata = {
  title: 'Start a Production Sprint · Gobots',
  alternates: { canonical: '/walkthrough' },
  description:
    'Tell us the workflow. Talk to an architect. A working system on your workflow in week 1.',
}

export default function WalkthroughPage() {
  return <WalkthroughClient />
}
